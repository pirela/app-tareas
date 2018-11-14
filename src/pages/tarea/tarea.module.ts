import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TareaPage } from './tarea';

@NgModule({
  declarations: [
    TareaPage,
  ],
  imports: [
    IonicPageModule.forChild(TareaPage),
  ],
})
export class TareaPageModule {}
