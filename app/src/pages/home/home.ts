import { Component } from '@angular/core';
import { NavController, ToastController, MenuController } from 'ionic-angular';

import {GooglePlus} from '@ionic-native/google-plus';
import {AngularFireModule} from 'angularfire2';
import { AngularFireAuth } from 'angularfire2/auth';
import firebase from 'firebase';

import { Facebook } from '@ionic-native/facebook';
import { GasFirebaseProvider } from '../../providers/gas-firebase/gas-firebase';

import { UserHomePage } from '../user-home/user-home';
import { LoginPage } from './../login/login';
import { RegisterPage } from './../register/register';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  //Creacion objeto vacio
  loginData = {
    email : '',
    password : ''
  };
 
  constructor(
    public menuCtrl: MenuController,
    public gasProvider: GasFirebaseProvider, 
    public facebook: Facebook, 
    public navCtrl: NavController, 
    public googleplus: GooglePlus, 
    public toastCtrl: ToastController,
    public afAuth: AngularFireAuth) {
    this.menuCtrl.enable(false, "menuGas");
  }

  
  
  loginCorreo(){
    console.log(this.loginData)
    this.gasProvider.loginCorreo(this.loginData)
    .then(auth => {
      // Do custom things with auth
      console.log("User logging");
      console.log(auth);
      this.navCtrl.setRoot(UserHomePage,{ uid: auth.user.uid });
    })
    .catch(err => {
      let toast = this.toastCtrl.create({
        message: err.message,
        duration: 1000
      });
      toast.present();
    });
  }

  facebookLogin(){
    this.facebook.login(['email']).then( response => {
      const facebookCredential = firebase.auth.FacebookAuthProvider.credential(response.authResponse.accessToken);
      firebase.auth().signInWithCredential(facebookCredential)
      .then( success => { 
       this.navCtrl.setRoot(LoginPage);
      });
    }).catch((error) => { 
      console.log(error) 
    });
  }

  loginGoogle(){
    this.googleplus.login({
      'webClientId':'800966370931-i0ibeumsfk1bltti65f8jv79tcm565hd.apps.googleusercontent.com',
      'offline': true
    }).then(res=>{
      firebase.auth().signInWithCredential(firebase.auth.GoogleAuthProvider.credential(res.idToken))
      .then(suc=>{
        alert("LOGIN SUC")
         this.navCtrl.setRoot(LoginPage);
      }).catch(ns=>{
        alert("NOT SUCC")
      })
    })
  }



  registro(){
    this.navCtrl.push(RegisterPage);
  }


}

