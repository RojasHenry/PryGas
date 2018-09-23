import { UserRegisterPage } from './../user-register/user-register';
import { GasFirebaseProvider } from './../../providers/gas-firebase/gas-firebase';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
//import firebase from 'firebase';


/**
 * Generated class for the RegisterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {

	signupData: newRegister = {
	    email: '',
	    password: '',
	    passwordRetyped: ''
  };

  constructor(public afAuth : AngularFireAuth,
    public gasProvider: GasFirebaseProvider,  
    public navCtrl: NavController, 
    public navParams: NavParams, 
    public alertCtrl: AlertController) {
    //this.signupData.email = this.navParams.get('email');
  }
  
  registro() {
    if(this.signupData.password !== this.signupData.passwordRetyped) {
      let alert = this.alertCtrl.create({
        title: 'Error',
        message: 'Your password and your re-entered password does not match each other.',
        buttons: ['OK']
      });
      alert.present();
      return;
    }
    // Firebase Signup Code
    this.gasProvider.createNewUser(this.signupData).then(auth => {
       //this.navCtrl.setRoot('LoginPage');
       console.log(auth)
       this.navCtrl.setRoot(UserRegisterPage,{newRegister: this.signupData});
    })
    .catch(err => {
      // Handle error
      let alert = this.alertCtrl.create({
        title: 'Error',
        message: err.message,
        buttons: ['OK']
      });
      alert.present();
    });
  }
}
