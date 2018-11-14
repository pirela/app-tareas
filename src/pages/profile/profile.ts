import { Component } from '@angular/core';
import { IonicPage, NavController, App } from 'ionic-angular';

import { Usuario } from '../../providers/providers';

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
  user: {
    dni: string,
    nombre: string,
    telefono: string,
    email: string
    direccion: string,
    esDni?: boolean
  } = {
    dni: '',
    nombre: '',
    telefono: '',
    email: '',
    direccion: ''
  }

  constructor(
    public navCtrl: NavController, public appCtrl: App,
    public apiUsu: Usuario
  ) {
  }

  ionViewDidLoad() {
    this.user = this.apiUsu.getUser()
  }

  logout() {
    this.apiUsu.removeSesionData();
    this.appCtrl.getRootNav().setRoot('LoginPage');
  }
}
