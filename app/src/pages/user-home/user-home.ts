import { Geolocation } from '@ionic-native/geolocation';
import { GasFirebaseProvider } from './../../providers/gas-firebase/gas-firebase';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController, Events, AlertController } from 'ionic-angular';

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

  zone:any

  userData:UserModel;
  alertOrderGas:any = this.alertCtrl.create({
    title: 'Solicitud de Gas',
    message: 'Su solicitud de gas esta siendo procesada..',
    buttons: [
      {
        text: 'Cancelar Solicitud',
        role: 'cancel',
        handler: () => {

        }
      }
    ],
    enableBackdropDismiss : false
  });

  coordenatesDef:Coordenates = {
    lat:-0.1991789,
    long:-78.4320597,
    zoom: 15
  }

  constructor(
    public menuCtrl: MenuController,
    public navCtrl: NavController, 
    public navParams: NavParams,
    public events: Events,
    public afDb : GasFirebaseProvider, 
    public geolocation:Geolocation,
    public alertCtrl: AlertController) {

      this.getLocation();
      this.zone = 'sur'
      this.menuCtrl.enable(true, "menuGas");

      this.login()

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

  orderGas(){
    this.alertOrderGas.present();
  }

  getLocation(){
    this.geolocation.getCurrentPosition().then((resp)=>{

      this.coordenatesDef.lat = resp.coords.latitude;
      this.coordenatesDef.long = resp.coords.longitude;

      this.coordenatesDef.zoom = 15
    }).catch((error)=>{
      console.log('Error getting location', error);
    })
  }

  getDistribuitors(zone:string){
    this.afDb.getDistribuitorByZone(zone).subscribe((resp)=>{
      console.log(resp)
    },(error)=>{
      console.log(error)
    })
  }

  loginData = {
    email : '171046192',
    password : ''
  };

  isNumber(data:any): boolean{
    if(Number.isInteger(data)){
      return true;
    }else{
      return false;
    }
  }

  login(){
    let emailNumber:string = this.loginData.email
    let data:string[] = emailNumber.split("@")
    if(data.length > 1){
      console.log("es usuario")
    } else{
      if(data[0].match(/^-{0,1}\d+$/)){
        if(data[0].length == 10){
          console.log("es distribuidor")
        }else{
          if(data[0].length < 10){
            console.log("cedula incorrecta")
          }else{
            if(data[0].length > 10){
              console.log("cedula incorrecta")
            }
          }
        }
      }else{
        console.log("no es numero")
      }
    }
  }



}
