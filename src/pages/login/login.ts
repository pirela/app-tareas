import { Component } from '@angular/core';
import { IonicPage, NavController, LoadingController, ToastController } from 'ionic-angular';

import { Usuario } from '../../providers/providers';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  user: { email: string } = {
    email: 'jjpirela93@gmail.com'
  }

  constructor(
    public navCtrl: NavController, public toastCtrl: ToastController,
    public loading: LoadingController, public apiUsu: Usuario
  ) {
  }

  login() {
    if (!this.user.email) {
      this.showToast('Ingrese su Email')
      return
    }

    const p = '<img src="assets/imgs/loading.png" width="100px" height="100px"/> <br> Cargando...'
			const loader = this.loading.create({
				spinner: 'hide',
				content: p
			});

    loader.present();

    this.apiUsu.login(this.user).subscribe(res => {
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

  goToRegister() {
    this.navCtrl.push('RegisterPage');
  }
}
