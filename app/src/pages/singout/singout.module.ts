import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SingoutPage } from './singout';

@NgModule({
  declarations: [
    SingoutPage,
  ],
  imports: [
    IonicPageModule.forChild(SingoutPage),
  ],
})
export class SingoutPageModule {}
