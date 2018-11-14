import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GraficaPage } from './grafica';

@NgModule({
  declarations: [
    GraficaPage,
  ],
  imports: [
    IonicPageModule.forChild(GraficaPage),
  ],
})
export class GraficaPageModule {}
