import { UserHomePage } from './../user-home/user-home';
import { GasFirebaseProvider } from './../../providers/gas-firebase/gas-firebase';
import { Geolocation } from '@ionic-native/geolocation';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController } from 'ionic-angular';

/**
 * Generated class for the UserRegisterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-user-register',
  templateUrl: 'user-register.html',
})
export class UserRegisterPage {

  newUser:UserModel = {
    email:"",
    password:"",
    name:"",
    lastname:"",
    latitude: 0,
    longitude: 0,
    phone_cell: null
  };
  newRegister:newRegister;

  coordenatesDef:Coordenates = {
    lat:-0.1991789,
    long:-78.4320597,
    zoom: 12
  }

  constructor(public menuCtrl: MenuController, public navCtrl: NavController, public navParams: NavParams,public gasFirebase:GasFirebaseProvider, public geolocation:Geolocation) {
    this.menuCtrl.enable(false, "menuGas");
    this.newRegister = this.navParams.get('newRegister');
    this.newUser.email = this.newRegister.email;
    this.newUser.password = this.newRegister.password;
    this.getLocation();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UserRegisterPage');
  }

  completeRegister(){
    console.log(this.newUser);

    this.gasFirebase.loginCorreo(this.newRegister).then((auth)=>{
      this.gasFirebase.registerUser(this.newUser,auth.user.uid).then((resp)=>{
        console.log(resp)
        this.navCtrl.setRoot(UserHomePage)
      }).catch((error)=>{
        console.log(error)
      })
    }).catch((error)=>{
      console.log(error)
    })
   
  }

  getLocation(){
    this.geolocation.getCurrentPosition().then((resp)=>{
      this.newUser.latitude = resp.coords.latitude;
      this.newUser.longitude = resp.coords.longitude;

      this.coordenatesDef.lat = resp.coords.latitude;
      this.coordenatesDef.long = resp.coords.longitude;

      this.coordenatesDef.zoom = 15
    }).catch((error)=>{
      console.log('Error getting location', error);
    })
  }

}
