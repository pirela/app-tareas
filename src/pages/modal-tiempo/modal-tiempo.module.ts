import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModalTiempoPage } from './modal-tiempo';

@NgModule({
  declarations: [
    ModalTiempoPage,
  ],
  imports: [
    IonicPageModule.forChild(ModalTiempoPage),
  ],
})
export class ModalTiempoPageModule {}
