import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import {GooglePlus} from '@ionic-native/google-plus';
import {AngularFireModule} from 'angularfire2';
import firebase from 'firebase';
import { HomePage } from '../home/home';

import {Facebook,FacebookLoginResponse} from '@ionic-native/facebook';


/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  name: 'LoginPage'
})
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

    userData: any;
    dato="Josselyn";

  constructor(public facebook: Facebook,/* public FacebookLoginResp: FacebookLoginResponse,*/public navCtrl: NavController, public navParams: NavParams, public googleplus: GooglePlus) {
  }


  getData(){
   //      // this.facebook.login(['email', 'public_profile']).then((response: FacebookLoginResponse) => {
   //    this.facebook.api('me?fields=id,name,email,first_name,picture.width(720).height(720).as(picture_large)', []).then(profile => {
   //      return this.userData = {email: profile['email'], first_name: profile['first_name'], picture: profile['picture_large']['data']['url'], username: profile['name']}
   //    //  alert(this.userData={email:profile['email'],first_name: profile['first_name']});
   //    //  alert(this.userData.email)
   //    });
   // // });
  }

  

  loginout(){
    this.facebook.logout().then(res=>{
      firebase.auth().signOut().then(suc=>{
        this.navCtrl.setRoot(HomePage);
      }).catch(ns=>{
        alert("singout")
      })
    })
    
    this.googleplus.logout().then(res=>{
      firebase.auth().signOut().then(suc=>{
        this.navCtrl.setRoot(HomePage);
      }).catch(ns=>{
    		alert("NOT SINGOUT");
    	})
    });
  }

}
