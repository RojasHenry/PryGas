import { GasFirebaseProvider } from './../../providers/gas-firebase/gas-firebase';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController, Events } from 'ionic-angular';

/**
 * Generated class for the UserHomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-user-home',
  templateUrl: 'user-home.html',
})
export class UserHomePage {

  userData:UserModel;

  constructor(
    public menuCtrl: MenuController,
    public navCtrl: NavController, 
    public navParams: NavParams,
    public events: Events,
    public afDb : GasFirebaseProvider) {
      this.menuCtrl.enable(true, "menuGas");

      this.afDb.getSessionUser()
        .then((user)=>{
          this.afDb.getUserDataByUid(user.uid)
          .subscribe((userData:any)=>{
            this.userData = userData;
            this.events.publish('user:logged', userData);
            console.log(this.userData)
          },(error)=>{
            console.log(error);
          })
        }).catch((error)=>{
          console.log(error);
        })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UserHomePage');
  }

}
