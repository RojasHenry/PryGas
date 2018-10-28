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
      this.typeUser = localStorage.getItem("type");
      if(resp){
        if(this.typeUser == "user"){
          this.rootPage = UserHomePage
        }else{
          this.rootPage = DistribuidorPage
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
    });

    events.subscribe('distribuitor:logged', (distribuitor:DistribuitorModel) => {
      this.distribuitorLogged = distribuitor;
      localStorage.setItem("type","distribuitor");
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

