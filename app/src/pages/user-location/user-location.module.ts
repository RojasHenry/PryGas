import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UserLocationPage } from './user-location';

import { AgmCoreModule } from '@agm/core';

@NgModule({
  declarations: [
    UserLocationPage,
  ],
  imports: [
    IonicPageModule.forChild(UserLocationPage),
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyA4gmYz_ugqt2QSlw3EBBeYRWIJYI_ZK0o'
    })
  ],
})
export class UserLocationPageModule {}
