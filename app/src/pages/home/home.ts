import { LoginPage } from './../login/login';
import { RegisterPage } from './../register/register';
import { Component } from '@angular/core';
import { NavController, ToastController, MenuController} from 'ionic-angular';

import {GooglePlus} from '@ionic-native/google-plus';
import {AngularFireModule} from 'angularfire2';
import { AngularFireAuth } from 'angularfire2/auth';
import firebase from 'firebase';

import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { GasFirebaseProvider } from '../../providers/gas-firebase/gas-firebase';
import { UserHomePage } from '../user-home/user-home';

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
  
  loginuser: boolean = false;
  userData: any;

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
  
  loginGoogle(){
    this.googleplus.login({
  		'webClientId':'697976661645-l9vq0qtv8o951k78scpj59ariep2cbua.apps.googleusercontent.com',
  		'offline': true
  	}).then(res=>{
      console.log(res);
  		firebase.auth().signInWithCredential(firebase.auth.GoogleAuthProvider.credential(res.idToken))
  		.then(suc=>{
  			//alert("LOGIN SUC")
  			//this.navCtrl.push("LoginPage");
         this.navCtrl.setRoot('LoginPage');
  		}).catch(ns=>{
        console.log(ns);
  			alert("NOT SUCC")
  		})
  	})
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
  
  registro(){
    //this.navCtrl.push(RegistroPage, { email: this.loginData.email });
    this.navCtrl.push(RegisterPage);
  }

  facebookLogin(){
    console.log("User logging");
    this.facebook.login(['email'])
    .then( response => {
      const facebookCredential = firebase.auth.FacebookAuthProvider.credential(response.authResponse.accessToken);
      firebase.auth().signInWithCredential(facebookCredential)
      .then( success => { 
        //console.log("Firebase success: " + JSON.stringify(success)); 
        this.navCtrl.setRoot('LoginPage');
      });
    }).catch((error) => { 
      console.log(error) 
    });
  }
  
  loginWithFB() {
    this.facebook.login(['email', 'public_profile']).then((response: FacebookLoginResponse) => {
      this.facebook.api('me?fields=id,name,email,first_name,picture.width(720).height(720).as(picture_large)', []).then(profile => {
        this.userData = {email: profile['email'], first_name: profile['first_name'], picture: profile['picture_large']['data']['url'], username: profile['name']}
        alert(this.userData={email:profile['email'],first_name: profile['first_name']});
        alert(this.userData.email)
      });
    });
  }

}

