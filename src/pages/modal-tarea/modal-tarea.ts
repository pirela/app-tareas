import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController, ViewController } from 'ionic-angular';
import { Tarea } from '../../models/tarea';
import { Tiempo } from '../../models/tiempo';
import { Tareas, Tiempos } from '../../providers/providers';
import { ShowToast } from '../../components/notify';


@IonicPage()
@Component({
  selector: 'page-modal-tarea',
  templateUrl: 'modal-tarea.html',
})
export class ModalTareaPage {

  tarea: Tarea
  tiempos:Tiempo[] = []
  nuevo:String = ''
  isReadonly:boolean
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public apiTareas: Tareas, public apiTiempos: Tiempos,
    public loading: LoadingController, public toastCtrl: ToastController,
    public viewCtrl: ViewController,) {
      this.tarea = navParams.get('tarea').id ? navParams.get('tarea') : {
        id: null,
        tarea: null,
        descripcion: null,
        idTiempo: null
      };
      this.nuevo = navParams.get('nuevo') ? 'Nueva' : 'Modificar';
      this.isReadonly = !navParams.get('nuevo')
  }

  ionViewDidLoad() {
    const p = '<img src="assets/imgs/loading.png" width="100px" height="100px"/> <br> Cargando...'
    const loader = this.loading.create({
      spinner: 'hide',
      content: p
    });


    this.apiTiempos.get().subscribe( res => {
      this.tiempos = res.data
      loader.dismiss();
    }, err => {
      loader.dismiss();
      ShowToast(err.json().error, null, null, this.toastCtrl);
    })
  }

  actualizar(){
    if(this.validate()){
      console.log("entre en validate")
      const p = '<img src="assets/imgs/loading.png" width="100px" height="100px"/> <br> Cargando...'
      const loader = this.loading.create({
        spinner: 'hide',
        content: p
      });
      let i = this.tiempos.findIndex( (obj) => obj.id == this.tarea.idTiempo)

      this.tarea.tiempoIni = this.tiempos[i].tiempoIni
      this.tarea.tiempoFin = this.tiempos[i].tiempoFin
      this.tarea.tiempoRealizado = 0
      this.tarea.cantPausa = 0

      if(!this.isReadonly){
        this.apiTareas.post(this.tarea).subscribe( res => {
          this.tarea = res.data

          loader.dismiss();
          ShowToast('Has agregado una nueva tarea.', null, null, this.toastCtrl);
          this.viewCtrl.dismiss(this.tarea)
        }, err => {
          loader.dismiss();
          ShowToast(err.json().error, null, null, this.toastCtrl);
        })
      } else {
        this.apiTareas.put(this.tarea).subscribe( res => {
          loader.dismiss();
          ShowToast('Has actualizado la tarea.', null, null, this.toastCtrl);
          this.viewCtrl.dismiss(this.tarea)
        }, err => {
          loader.dismiss();
          ShowToast(err.json().error, null, null, this.toastCtrl);
        })
      }
    }
  }

  validate(){
    const obj = this.tarea
    let flag = true
    // let propiedad
    for (const prop in obj) {
      if(flag && prop != 'id')
        flag = obj[prop] ? true : false
        // propiedad = prop
    }
    if(!flag)
      ShowToast('Debes verificar los campos', null, null, this.toastCtrl);
      // se podria utilizar, pero hay nombre de las propiedades que el usuario no entenderia
      //ShowToast('Debes ingresar el campo: '+propiedad, null, null, this.toastCtrl);

    return flag
  }

}
