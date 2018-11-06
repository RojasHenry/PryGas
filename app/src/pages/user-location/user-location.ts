import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { GasFirebaseProvider } from './../../providers/gas-firebase/gas-firebase';
import { Geolocation } from '@ionic-native/geolocation';
import { Diagnostic } from '@ionic-native/diagnostic';

/**
 * Generated class for the UserLocationPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-user-location',
  templateUrl: 'user-location.html',
})
export class UserLocationPage {

  userU:UserModel
  uidUser:any

  enable:boolean = true

  constructor(public navCtrl: NavController, private diagnostic: Diagnostic, public geolocation: Geolocation, public navParams: NavParams, public afDb : GasFirebaseProvider, public alertCtrl: AlertController) {
    this.afDb.getSessionUser()
    .then((user)=>{
      this.uidUser = user.uid
      this.afDb.getUserDataByUid(user.uid)
      .subscribe((userData:any)=>{
        this.userU = userData;
        console.log(this.userU);
      },(error)=>{
        console.log(error);
      })
    })
    .catch((error)=>{
      console.log(error);
    })

    this.diagnostic.isGpsLocationEnabled()
    .then((enabled)=>{
      if(enabled){
        this.getLocation();
      }else{
        this.presentConfirm("Encender GPS por favor");
      }
    })
    .catch((error)=>{
      console.log(error);
    })
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UserLocationPage');
  }

  getLocation(){
    this.geolocation.getCurrentPosition().then((resp)=>{

      this.userU.latitude = resp.coords.latitude;
      this.userU.longitude = resp.coords.longitude;

    }).catch((error)=>{
      console.log('Error getting location', error);
    })
  }

  saveLocationUser(user:UserModel){
    this.enable = false
    console.log(user)
    this.afDb.updateUser(user,this.uidUser)
    .then((resp)=>{
      this.showAlert()
    })
    .catch((error)=>{
      console.log(error);
    })
  }

  showAlert() {
    const alert = this.alertCtrl.create({
      title: 'Ubicación Usuario',
      subTitle: 'Ubicación actualizada exitosamente',
      buttons: [{
        text: 'OK',
        handler: data => {
          this.enable = true
        }
      }],
      enableBackdropDismiss: false
    });
    alert.present();
  }

  presentConfirm(message) {
    let alert = this.alertCtrl.create({
      title: 'Ubicación',
      message: message
    });
    alert.present();
}

}
