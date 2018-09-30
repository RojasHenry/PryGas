import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import {GooglePlus} from '@ionic-native/google-plus';
import {AngularFireModule} from 'angularfire2';
import firebase from 'firebase';
import { HomePage } from '../home/home';

import {Facebook} from '@ionic-native/facebook';



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

  constructor(public facebook: Facebook, 
              public navCtrl: NavController, 
              public navParams: NavParams,
              public googleplus: GooglePlus) {
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
