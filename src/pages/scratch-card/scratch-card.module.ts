import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ScratchCardPage } from './scratch-card';

@NgModule({
  declarations: [
    ScratchCardPage,
  ],
  imports: [
    IonicPageModule.forChild(ScratchCardPage),
  ],
})
export class ScratchCardPageModule {}
