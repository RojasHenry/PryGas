import { UserLocationPage } from './../pages/user-location/user-location';
import { Component, ViewChild } from '@angular/core';
import { Platform, App, NavController, Nav, Events, ToastController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { UserProfilePage } from './../pages/user-profile/user-profile';
import { DistribuidorPage } from './../pages/distribuidor/distribuidor';
import { UserHomePage } from './../pages/user-home/user-home';
import { GasFirebaseProvider } from './../providers/gas-firebase/gas-firebase';

import { LocalNotifications} from '@ionic-native/local-notifications';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {

  @ViewChild(Nav) nav: NavController
  rootPage:any ;

  userLogged:UserModel;
  distribuitorLogged:DistribuitorModel;

  typeUser:any

   constructor( public app: App,  platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, public afDb: GasFirebaseProvider,public events: Events,public localNotifications: LocalNotifications,toastCtrl: ToastController) {
    this.afDb.isLogged().then((resp: boolean)=>{
      if(resp){
        this.typeUser = localStorage.getItem("type");
        
        switch(this.typeUser){
          case "user":
          localStorage.setItem("type","user");
          this.rootPage = UserHomePage
          break;

          case "distribuitor":
          localStorage.setItem("type","distribuitor");
          this.rootPage = DistribuidorPage
          break;

          case "userNoRegister":
          this.rootPage = HomePage
          break;

          default:
          this.rootPage = HomePage
          break;
        }
      }else{
        this.rootPage = HomePage
      }
    })
    .catch((error)=>{
      console.log(error)
    })
    
    platform.ready().then(() => {
      
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });

    events.subscribe('user:logged', (user:UserModel) => {
      this.userLogged = user;
      localStorage.setItem("type","user");
      this.typeUser = "user"
    });

    events.subscribe('distribuitor:logged', (distribuitor:DistribuitorModel) => {
      this.distribuitorLogged = distribuitor;
      localStorage.setItem("type","distribuitor");
      this.typeUser = "distribuitor"
    });

    afDb.listenToNotifications().subscribe((msg:Notification) =>{
      // Schedule a single notification
      const toasts = toastCtrl.create({
        message: msg.body,
        duration: 3000
      });
      toasts.present();
      this.localNotifications.schedule({
        id: 1,
        text: msg.body,
        actions: [
          { id: 'yes', title: 'Yes' },
          { id: 'no',  title: 'No' }
        ],
        foreground: true,
        priority: 2,
        vibrate:true,
        led: 'FF0000',
        lockscreen:true
      });
      console.log(JSON.stringify(msg))
      const toast = toastCtrl.create({
        message: msg.body,
        duration: 3000
      });
      toast.present();
      this.localNotifications.on("yes").subscribe(()=>{
        console.log("boton yes")
      })

      this.localNotifications.on("no").subscribe(()=>{
        console.log("boton no")
      })
    })
  }

  gotoProfile(){
    this.nav.setRoot(UserProfilePage,{typeUser:this.typeUser})
  }

  gotoLocation(){
    this.nav.setRoot(UserLocationPage)
  }

  gotoHome(){
    if(this.typeUser == "user"){
      this.nav.setRoot(UserHomePage)
    }else{
      this.nav.setRoot(DistribuidorPage)
    }
  }
  
  async signOut(){
    localStorage.setItem("type","");
    await this.afDb.signOut().then((resp)=>{
      this.userLogged = null;
      this.distribuitorLogged = null;
      this.nav.setRoot(HomePage);
    })
    .catch((error)=>{
      console.log(error);
    })
  }
}

