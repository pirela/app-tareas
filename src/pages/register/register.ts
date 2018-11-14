import { Component } from '@angular/core';
import { IonicPage, NavController, LoadingController, ToastController } from 'ionic-angular';

import { Usuario } from '../../providers/providers';
import { validateEmail } from '../../utils';

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {
  usuario: any = {
  }

  constructor(
    public navCtrl: NavController, public toastCtrl: ToastController,
    public loading: LoadingController, public apiUsu: Usuario
  ) {
  }

  goToLogin() {
    this.navCtrl.push('LoginPage');
  }

  validateForm() {
    const form = this.usuario
    return form.dni && form.nombre
      && form.telefono && form.email
      && form.direccion && validateEmail(form.email)
  }

  signup() {
    if (!this.validateForm()) {
      this.showToast('Por favor verifique sus datos.');
      return
    }

    const loader = this.loading.create({
      content: 'Cargando...',
    });

    loader.present();

    this.apiUsu.signup(this.usuario).subscribe(res => {
      this.apiUsu.saveSesionData(res);
      loader.dismiss();

      this.navCtrl.push('TabsPage');
    }, err => {
      loader.dismiss();
      this.showToast(err.json().error);
    });
  }

  showToast(msg: string) {
    let toast = this.toastCtrl.create({
      message: msg || 'Algo salio mal!',
      duration: 4000,
      position: 'top'
    });

    toast.present();
  }
}
