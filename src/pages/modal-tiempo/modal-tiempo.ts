import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController, ViewController } from 'ionic-angular';
import { Tiempos } from '../../providers/providers';
import { Tiempo } from '../../models/tiempo';
import { ShowToast } from '../../components/notify';

import moment from 'moment';

@IonicPage()
@Component({
  selector: 'page-modal-tiempo',
  templateUrl: 'modal-tiempo.html',
})
export class ModalTiempoPage {

  tiempos:Tiempo[] = []
  tiempo:Tiempo = {
    id: null,
    descripcion: null,
    tiempoIni: null,
    tiempoFin: null
  }

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public viewCtrl: ViewController, public apiTiempos: Tiempos,
    public loading: LoadingController, public toastCtrl: ToastController) {
  }

  ionViewDidLoad() {
  }

  actualizar(){
    if(this.validate()){
      const p = '<img src="assets/imgs/loading.png" width="100px" height="100px"/> <br> Cargando...'
      const loader = this.loading.create({
        spinner: 'hide',
        content: p
      });

      loader.present()

      this.tiempo.tiempoIni =  this.getSeg(this.tiempo.tiempoIni)
      this.tiempo.tiempoFin =  this.getSeg(this.tiempo.tiempoFin)
      this.apiTiempos.post(this.tiempo).subscribe( res => {
        this.tiempo = {
          descripcion: null,
          id: null,
          tiempoIni: null,
          tiempoFin: null
        }
        loader.dismiss();
        ShowToast('Has agregado una nueva duracion.', null, null, this.toastCtrl);
        this.viewCtrl.dismiss({...res.data, nuevo: true})
      }, err => {
        loader.dismiss();
        ShowToast(err.json().error, null, null, this.toastCtrl);
      })
    }
  }

  getSeg(time){
    return moment(time, 'HH:mm:ss').diff(moment().startOf('day'), 'seconds');
  }

  validate(){
    const obj = this.tiempo
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
