import { UserHomePage } from './../user-home/user-home';
import { GasFirebaseProvider } from './../../providers/gas-firebase/gas-firebase';
import { Geolocation } from '@ionic-native/geolocation';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController, AlertController } from 'ionic-angular';

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
    phone_cell: null,
    photo:"",
    zone:""
  };
  newRegister:newRegister;

  coordenatesDef:Coordenates = {
    lat:-0.1991789,
    long:-78.4320597,
    zoom: 15
  }

  typeRegist:any
  uidSocial:any

  constructor(public menuCtrl: MenuController, public alertCtrl: AlertController, public navCtrl: NavController, public navParams: NavParams,public gasFirebase:GasFirebaseProvider, public geolocation:Geolocation) {
    this.menuCtrl.enable(false, "menuGas");
    this.typeRegist = this.navParams.get('typeRegis');

    if(this.typeRegist == "newuser"){
      this.newRegister = this.navParams.get('newRegister');
      this.newUser.email = this.newRegister.email;
      this.newUser.password = this.newRegister.password;
    }else{
      this.newUser = this.navParams.get('userData')
      this.uidSocial = this.navParams.get('uidSocial')
    }
    
    this.getLocation();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UserRegisterPage');
  }

  completeRegister(){
    console.log(this.newUser);
    if(this.typeRegist == "newuser"){
      this.gasFirebase.createNewUser(this.newRegister).then(auth => {
        this.gasFirebase.registerUser(this.newUser,auth.user.uid).then((resp)=>{
          console.log(resp)
          this.navCtrl.setRoot(UserHomePage)
        }).catch((error)=>{
          console.log(error)
        })
      }).catch(err => {
        // Handle error
        let alert = this.alertCtrl.create({
          title: 'Error',
          message: err.message,
          buttons: ['OK']
        });
        alert.present();
      });
    }else{
      let alert = this.alertCtrl.create({
        title: 'Error',
        message: this.newUser + this.uidSocial,
        buttons: ['OK']
      });
      alert.present();
      /*
      this.gasFirebase.registerUser(this.newUser,this.uidSocial).then((resp)=>{
        console.log(resp)
        this.navCtrl.setRoot(UserHomePage)
      }).catch((error)=>{
        console.log(error)
        // Handle error
        let alert = this.alertCtrl.create({
          title: 'Error',
          message: error.message,
          buttons: ['OK']
        });
        alert.present();
      })*/
    }
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
