import { UserLocationPage } from './../pages/user-location/user-location';
import { Component, ViewChild } from '@angular/core';
import { Platform, App, NavController, Nav, Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { UserProfilePage } from './../pages/user-profile/user-profile';
import { DistribuidorPage } from './../pages/distribuidor/distribuidor';
import { UserHomePage } from './../pages/user-home/user-home';
import { GasFirebaseProvider } from './../providers/gas-firebase/gas-firebase';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {

  @ViewChild(Nav) nav: NavController
  rootPage:any ;

  userLogged:UserModel;
  distribuitorLogged:DistribuitorModel;

  typeUser:any

   constructor( public app: App,  platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, public afDb: GasFirebaseProvider,public events: Events) {
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

