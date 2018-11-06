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

  uidUser:any
  userData:UserModel;

  alertOrderGas:any

  coordenatesDef:Coordenates = {
    lat:-0.1991789,
    long:-78.4320597,
    zoom: 15
  }
  orderUser:Order = {
    zone:"",
    date:"",
    latitude:0,
    longitude:0,
    state:"",
    userUid: ""
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

      this.afDb.getSessionUser()
        .then((user)=>{
          this.uidUser = user.uid
          this.afDb.getUserDataByUid(user.uid)
          .subscribe((userData:any)=>{
            this.userData = userData;
            this.events.publish('user:logged', userData);
            localStorage.setItem("type","user");
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
    this.orderUser.zone = this.userData.zone;
    this.orderUser.latitude = this.coordenatesDef.lat;
    this.orderUser.longitude = this.coordenatesDef.long;
    this.orderUser.userUid = this.uidUser
    this.orderUser.state = "Solicitado"
    this.orderUser.date = this.getActualDate()

    this.afDb.registerOrder(this.orderUser)
    .then(()=>{
      this.showAlert(this.orderUser)
      this.afDb.getOrderActual(this.orderUser).subscribe((orderActual:Order)=>{
        console.log(orderActual)
        if(orderActual){
          if(orderActual.state == "Aceptado"){
            this.alertOrderGas.dismiss()
          }
        }
      },(error)=>{
        console.log('Error', error);
      })
    })
    .catch((error)=>{
      console.log('Error', error);
    })
  }

  showAlert(order:Order){
    this.alertOrderGas = this.alertCtrl.create({
      title: 'Solicitud de Gas',
      message: 'Su solicitud de gas esta siendo procesada..',
      buttons: [
        {
          text: 'Cancelar Solicitud',
          handler: () => {
            order.state = "Cancelado"
            this.afDb.cancelOrderActual(order)
            .then((resp)=>{
              this.alertOrderGas.dismiss();
            })
            .catch((error)=>{
              console.log('Error', error);
            })
            return false;
          }
        }
      ],
      enableBackdropDismiss : false
    });
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

  getActualDate():any{
    let currentdate = new Date(); 
    let datetime = currentdate.getDate() + "/"
    + (currentdate.getMonth()+1)  + "/" 
    + currentdate.getFullYear() + " @ "
    
    if(currentdate.getMinutes() < 10){
      datetime += "0"+currentdate.getHours()+ ":"  
      + currentdate.getMinutes() + ":" 
      + currentdate.getSeconds(); 
    }else{
      datetime += currentdate.getHours() + ":"  
      + currentdate.getMinutes() + ":" 
      + currentdate.getSeconds(); 
    }
    return datetime
  }
 
  
}
