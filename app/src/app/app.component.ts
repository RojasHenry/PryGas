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

import { LocalNotifications, ILocalNotification} from '@ionic-native/local-notifications';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {

  @ViewChild(Nav) nav: NavController
  rootPage:any ;

  userLogged:UserModel;
  distribuitorLogged:DistribuitorModel;

  typeUser:any

  notification:ILocalNotification

   constructor( public app: App,  platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, public afDb: GasFirebaseProvider,public events: Events,public localNotifications: LocalNotifications,public toastCtrl: ToastController) {
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
      this.listenToNofication()
    });

    events.subscribe('distribuitor:logged', (distribuitor:DistribuitorModel) => {
      this.distribuitorLogged = distribuitor;
      localStorage.setItem("type","distribuitor");
      this.typeUser = "distribuitor"
      this.listenToNofication()
    });

    
  }

  listenToNofication(){
    this.afDb.listenToNotifications().subscribe((msg:Notification) =>{
      // Schedule a single notification
      const toasts = this.toastCtrl.create({
        message: JSON.stringify(msg),
        duration: 3000
      });
      toasts.present();

      switch(this.typeUser){
        case "user":
          this.notification = {
            id: 1,
            
            title: msg.title,
            text: msg.body,
            foreground: true,
            priority: 2,
            vibrate:true,
            led: 'FF0000',
            lockscreen:true
          }
        break;

        case "distribuitor":
          this.notification = {
            id: 1,
            title: msg.title,
            text: msg.body,
            foreground: true,
            priority: 2,
            vibrate:true,
            actions: [
              {id: "yes",title: "Aceptar"},
              {id: "no", title: "Ignorar"}],
            led: 'FF0000',
            lockscreen:true
          }
        break;

        default:
        break;
      }
      this.localNotifications.schedule(this.notification);
      console.log(JSON.stringify(msg))
      const toast = this.toastCtrl.create({
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

