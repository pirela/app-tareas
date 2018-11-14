import { Component } from '@angular/core';
import { Platform, Config } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { Usuario } from '../providers/providers';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = 'LoginPage';

  constructor(
    platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen,
    apiUsu: Usuario, config: Config
  ) {
    const token = apiUsu.getToken()
    const user = apiUsu.getUser()

    if (token && user.dni) this.rootPage = 'TabsPage';

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      // config.set('ios', 'backButtonText', '');
      splashScreen.hide();
    });
  }
}
