import { UserRegisterPage } from './../user-register/user-register';
import { DistribuidorPage } from './../distribuidor/distribuidor';
import { Component } from '@angular/core';
import { NavController, ToastController, MenuController } from 'ionic-angular';

import {GooglePlus} from '@ionic-native/google-plus';
import { AngularFireAuth } from 'angularfire2/auth';
import firebase, { auth } from 'firebase';

import { Facebook } from '@ionic-native/facebook';
import { GasFirebaseProvider } from '../../providers/gas-firebase/gas-firebase';

import { UserHomePage } from '../user-home/user-home';
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

  loginDataDistribuitor = {
    email : '',
    password : ''
  };

  userFromSocial:UserModel = {
    email:"",
    password:"",
    name:"",
    lastname:"",
    latitude: 0,
    longitude: 0,
    phone_cell: null,
    photo:"",
    zone:""
  }
 
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
    this.loginData.email.replace(/ /g, "");
    console.log(this.loginData)
    let userType = this.loginVerification(this.loginData)
    switch(userType){
      case "user" : 
      this.gasProvider.loginCorreo(this.loginData)
      .then(() => {
        this.navCtrl.setRoot(UserHomePage);
      })
      .catch(err => {
        let toast = this.toastCtrl.create({
          message: err.message,
          duration: 1000
        });
        toast.present();
      });
      break;
      case "distribuitor": 
      let email = this.loginData.email+"@mail.com";
      this.loginDataDistribuitor.email = email;
      this.loginDataDistribuitor.password = this.loginData.password;
      this.gasProvider.loginCorreo(this.loginDataDistribuitor)
      .then(() => {
        this.navCtrl.setRoot(DistribuidorPage);
      })
      .catch(err => {
        let toast = this.toastCtrl.create({
          message: err.message,
          duration: 1000
        });
        toast.present();
      })
      break;
      default:
      let toast = this.toastCtrl.create({
        message: "Error: "+userType,
        duration: 3000
      });
      toast.present();
      break;
    }  
  }

  facebookLogin(){
    this.facebook.login(['email']).then( response => {
      const facebookCredential = firebase.auth.FacebookAuthProvider.credential(response.authResponse.accessToken);
      firebase.auth().signInWithCredential(facebookCredential)
      .then( resp => { 
        let uid = resp['uid']
        this.userFromSocial.email = resp['email']
        this.userFromSocial.name = resp['displayName']
        this.userFromSocial.photo = resp['photoURL']
        this.gasProvider.getUserNotExist()
        .then(resp=>{
          resp.subscribe((data)=>{
            console.log(data)
            data.map(user=>{
              const uidUserData = user.payload.doc.id
              if(uidUserData == uid){
                this.navCtrl.setRoot(UserHomePage)
              }
            })
            this.navCtrl.setRoot(UserRegisterPage,{userData: this.userFromSocial})
          })
        })
        .catch(error=>{
          console.log(error)
        })
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
      .then(resp=>{
        let uid = resp['uid']
        this.userFromSocial.email = resp['email']
        this.userFromSocial.name = resp['displayName']
        this.userFromSocial.photo = resp['photoURL']
        this.gasProvider.getUserNotExist()
        .then(resp=>{
          resp.subscribe((data)=>{
            console.log(data)
            data.map(user=>{
              const uidUserData = user.payload.doc.id
              if(uidUserData == uid){
                this.navCtrl.setRoot(UserHomePage)
              }
            })
            this.navCtrl.setRoot(UserRegisterPage,{userData: this.userFromSocial})
          })
        })
        .catch(error=>{
          console.log(error)
        })
      }).catch(ns=>{
        alert("NOT SUCC")
      })
    })
  }
 
  registro(){
    this.navCtrl.push(RegisterPage);
  }

  loginVerification(loginData){
    let emailNumber:string = loginData.email
    let data:string[] = emailNumber.split("@")
    if(data.length > 1){
      console.log("es usuario")
      return 'user'
    } else{
      if(data[0].match(/^-{0,1}\d+$/)){
        if(data[0].length == 10){
          console.log("es distribuidor")
          return 'distribuitor'
        }else{
          if(data[0].length < 10){
            console.log("cedula incorrecta")
            return 'Cédula incorrecta'
          }else{
            if(data[0].length > 10){
              console.log("cedula incorrecta")
              return 'Cédula incorrecta'
            }
          }
        }
      }else{
        console.log("no es numero")
        return 'Error en data'
      }
    }
  }
}

