import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController, AlertController, ModalController } from 'ionic-angular';

import { Tareas, Tiempos } from '../../providers/providers';
import { Tarea } from '../../models/tarea';
import { Tiempo } from '../../models/tiempo';

import { ShowToast, ShowConfirm } from '../../components/notify';

import moment from 'moment';

@IonicPage()
@Component({
  selector: 'page-tarea',
  templateUrl: 'tarea.html',
})
export class TareaPage {

  tareas:Tarea[] = []
  tiempos:Tiempo[] = []
  orden:number = 0
  habilitarOden:boolean = true
  tiempoId:any
  opcTiempo:any = {
    comenzar: true,
    pausa: false,
    reiniciar: false
  }

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public apiTareas: Tareas, public loading: LoadingController,
    public toastCtrl: ToastController, public alertCtrl: AlertController,
    public apiTiempo: Tiempos, public modalCtrl : ModalController,) {
  }

  ionViewDidLoad() {
    const p = '<img src="assets/imgs/loading.png" width="100px" height="100px"/> <br> Cargando...'
			const loader = this.loading.create({
				spinner: 'hide',
				content: p
			});

			loader.present();
			this.apiTareas.query(0).subscribe((res: any) => {
        this.tareas = res.data

        let primeraTarea
        if(this.tareas.length){
          this.tareas.forEach(obj => {
            if(obj.tiempoRealizado>0)
              primeraTarea = obj
          });
          let i = -1
          if (primeraTarea) {
            i = this.tareas.findIndex( (obj) => obj.id == primeraTarea.id)
          }
          if(i>0) {
            this.tareas.splice(i, 1)
            this.tareas.unshift(primeraTarea)
          }
          else {
            this.reordenarTareas();
          }



          this.habilitarOden = this.tareas[0].cantPausa > 0 ? false : true
        }

        this.apiTiempo.get().subscribe((res: any) => {
          this.tiempos = res.data
          loader.dismiss()
        }, err => {
          loader.dismiss()
          ShowToast(err.json().error, null, null, this.toastCtrl);
        })

			}, err => {
				loader.dismiss()
				ShowToast(err.json().error, null, null, this.toastCtrl);
			})
  }

  modalTiempo(){
    let ModalTiempo = this.modalCtrl.create('ModalTiempoPage', {});

		ModalTiempo.onDidDismiss(tiempo => {
      if(tiempo){
        if(tiempo.nuevo)
          this.tiempos.push(tiempo)
        if(tiempo.modificado){
          let i = this.tiempos.findIndex( (obj) => obj.id == tiempo.id)
          this.tiempos[i] = tiempo
        }
      }
		});

		ModalTiempo.present();
  }

  comenzar(tarea){
    if(this.opcTiempo.comenzar){
      this.tiempoId = setInterval(() => {
        tarea.tiempoRealizado+=1
        if(tarea.tiempoRealizado >= tarea.tiempoFin){
          clearInterval(this.tiempoId);
          this.tiempoCompletado(tarea)
        }
      }, 1000);
      this.opcTiempo.comenzar = false
      this.opcTiempo.pausa = true
      if(tarea.cantPausa){
        ShowToast('Continua con la tarea.', null, null, this.toastCtrl);
      } else {
        ShowToast('Has iniciado con la tarea.', null, null, this.toastCtrl);
      }
    } else {
      console.log("ya esta comenzada");
    }
  }

  pausa(tarea){
    if (this.opcTiempo.pausa){

      const p = '<img src="assets/imgs/loading.png" width="100px" height="100px"/> <br> Cargando...'
      const loader = this.loading.create({
        spinner: 'hide',
        content: p
      });

      loader.present();

      clearInterval(this.tiempoId);
      this.opcTiempo.pausa = false
      this.opcTiempo.comenzar = true
      tarea.cantPausa++

      this.apiTareas.put(tarea).subscribe( res => {
        loader.dismiss();
        ShowToast('Has pausado la tarea.', null, null, this.toastCtrl);
      }, err => {
        loader.dismiss();
        ShowToast(err.json().error, null, null, this.toastCtrl);
      })

    } else {
      console.log("ya esta pausada");
    }
  }

  detener(tarea){
    console.log("detener", tarea);
  }

  reiniciar(tarea){

    let texto = "Esta seguro de reinicar la tarea: " + tarea.tarea
		ShowConfirm(
			'Aviso',
			texto,
			() => {
        const p = '<img src="assets/imgs/loading.png" width="100px" height="100px"/> <br> Cargando...'
				const loader = this.loading.create({
					spinner: 'hide',
					content: p
				});

        loader.present();


        if( tarea.tiempoRealizado > 0){
          this.opcTiempo.comenzar = true
          tarea.cantPausa = 0
          this.habilitarOden = true
          clearInterval(this.tiempoId);
          tarea.tiempoRealizado = 0
          this.apiTareas.put(tarea).subscribe( res => {
            loader.dismiss();
            ShowToast('Has reiniciado la tarea.', null, null, this.toastCtrl);
          }, err => {
            loader.dismiss();
            ShowToast(err.json().error, null, null, this.toastCtrl);
          })
        } else {
          loader.dismiss();
        }

			},
			() => {
        ShowToast('has cancelado el proceso.', null, null, this.toastCtrl);
      },
			this.alertCtrl
		);
  }

  completada(tarea){
    let texto = "Esta seguro de completar la tarea: " + tarea.tarea
		ShowConfirm(
			'Aviso',
			texto,
			() => {
        if(tarea.tiempoRealizado >= tarea.tiempoIni){
          const p = '<img src="assets/imgs/loading.png" width="100px" height="100px"/> <br> Cargando...'
          const loader = this.loading.create({
            spinner: 'hide',
            content: p
          });

          loader.present();

          tarea.completada = true
          this.habilitarOden = true

          this.apiTareas.put(tarea).subscribe( res => {
            loader.dismiss();
            let i = this.tareas.findIndex( (obj) => obj.id == tarea.id)
            this.tareas.splice(i, 1);
            this.opcTiempo.comenzar = true
            this.opcTiempo.pausa = false
            this.opcTiempo.reiniciar = false

            ShowToast('has completado la tarea.', null, null, this.toastCtrl);
          }, err => {
            loader.dismiss();
            ShowToast(err.json().error, null, null, this.toastCtrl);
          })

        }else {
          ShowToast('El tiempo mínimo no ha transcurrido, verifica mejor tu tarea', null, null, this.toastCtrl);
        }
			},
			() => {
        ShowToast('has cancelado el proceso.', null, null, this.toastCtrl);
      },
			this.alertCtrl
		);
  }

  tiempoCompletado(tarea){

    const p = '<img src="assets/imgs/loading.png" width="100px" height="100px"/> <br> Cargando...'
    const loader = this.loading.create({
      spinner: 'hide',
      content: p
    });

    tarea.completada = true
    this.opcTiempo.comenzar = true
    this.opcTiempo.pausa = false
    this.opcTiempo.reiniciar = false

    loader.present();
    this.apiTareas.put(tarea).subscribe( res => {
      let i = this.tareas.findIndex( (obj) => obj.id == tarea.id)
      this.tareas.splice(i, 1);
      loader.dismiss();
      ShowToast('El tiempo de la tarea ha expirado. Se ha completado la tarea', 3000, 'middle', this.toastCtrl);
    }, err => {
      loader.dismiss();
      ShowToast(err.json().error, null, null, this.toastCtrl);
    })

  }

  modificar(tarea, nuevo){
		let ModalTarea = this.modalCtrl.create('ModalTareaPage', {
      tarea,
      nuevo
		});

		ModalTarea.onDidDismiss(tarea => {
      if(tarea){
        if(nuevo){
          this.tareas.push(tarea)
        } else {
          let i = this.tareas.findIndex( (obj) => obj.id == tarea.id)
          this.tareas[i] = tarea
        }
      }
		});

		ModalTarea.present();
  }

  eliminar(tarea){
    if(!tarea.cantPausa && !tarea.tiempoRealizado) {
      let texto = "Esta seguro de eliminar la tarea: " + tarea.tarea
      ShowConfirm(
        null,
        texto,
        () => {

          const p = '<img src="assets/imgs/loading.png" width="100px" height="100px"/> <br> Cargando...'
          const loader = this.loading.create({
            spinner: 'hide',
            content: p
          });

          loader.present();
          this.apiTareas.del(tarea.id).subscribe( res => {
            let i = this.tareas.findIndex( (obj) => obj.id == tarea.id)
            this.tareas.splice(i, 1);
            loader.dismiss();
            ShowToast('Has eliminado la tarea.', null, null, this.toastCtrl);
          }, err => {
            loader.dismiss();
            ShowToast(err.json().error, null, null, this.toastCtrl);
          })

        },
        () => {
          ShowToast('has cancelado el proceso.', null, null, this.toastCtrl);
        },
        this.alertCtrl
      );
    }else {
      ShowToast('No puedes eliminar una tarea comenzada.', null, null, this.toastCtrl);
    }
  }

  reordenarTareas(){
    if(this.habilitarOden){
      switch (this.orden) {
        case 0:
          this.tareas.sort((a, b) => {
            return a.tiempoFin - b.tiempoFin
          })
          this.orden++
          break;
        case 1:
          this.tareas.reverse()
          this.orden++
          break;
        case 2:
          this.tareas.sort((a, b) => {
            let x = moment(a.createdAt).isBefore(b.createdAt) ? 1 : 0;
            return x
          })
          this.orden++
          break;
        case 3:
          this.tareas.reverse()
          this.orden = 0
          break;

        default:
          break;
      }
    } else {
      ShowToast('No puedes re oderdenar las tareas, deber terminar la primera tarea.', null, null, this.toastCtrl);
    }
  }

  cargaMasiva(){

    let texto = "¿Realmente deseas cargar 50 tareas realizas, distribuidas en los últimos 7 dias?"
		ShowConfirm(
			'Aviso',
			texto,
			() => {
      const p = '<img src="assets/imgs/loading.png" width="100px" height="100px"/> <br> Cargando...'
      const loader = this.loading.create({
        spinner: 'hide',
        content: p
      });

      loader.present();

      let all = []
      for (let i = 0; i < 50; i++) {
        const j = Math.floor(Math.random() * (6)) + 1;
        const k = Math.floor(Math.random() * (9999999));
        const f = moment().subtract(j ,'days')
        const obj ={
          tarea: 'Tarea ' + k,
          descripcion: 'Descripción ' + k,
          idTiempo: 2,
          tiempoIni: 1800,
          tiempoFin: 3600,
          tiempoRealizado: Math.floor(Math.random() * (3601 - 2880 + 1)) + 2880,
          completada: 1,
          cantPausa: Math.floor(Math.random() * (10 - 1 + 1)) + 1,
          createdAt: f,
          updatedAt: f
        }
        all.push(obj)
      }

      this.apiTareas.postMasivo(all).subscribe((res: any) => {
        ShowToast('Has ingresado 50 tareas completas, distribuidas en los últimos 7 dias.', null, null, this.toastCtrl);
        loader.dismiss()
      }, err => {
        loader.dismiss()
        ShowToast(err.json().error, null, null, this.toastCtrl);
      })
			},
			() => {
        ShowToast('has cancelado el proceso.', null, null, this.toastCtrl);
      },
			this.alertCtrl
		);

  }

  toTime(seg){
    return moment('2000-01-01 00:00:00').add(moment.duration(seg*1000)).format('HH:mm:ss');
  }

}
