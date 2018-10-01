import { GasFirebaseProvider } from './../../providers/gas-firebase/gas-firebase';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, MenuController } from 'ionic-angular';

/**
 * Generated class for the DistribuidorPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-distribuidor',
  templateUrl: 'distribuidor.html',
})


export class DistribuidorPage {

  distribuitorData:DistribuitorModel;

  constructor(public navCtrl: NavController, public navParams: NavParams,public afDb : GasFirebaseProvider,public events: Events, public menuCtrl: MenuController) {
    this.menuCtrl.enable(true, "menuGas");

    this.afDb.getSessionUser()
    .then((user)=>{
      this.afDb.getDistribuitorDataByUid(user.uid)
      .subscribe((distribuitorData:any)=>{
        this.distribuitorData = distribuitorData;
        this.events.publish('distribuitor:logged', distribuitorData);
        console.log(this.distribuitorData)
      },(error)=>{
        console.log(error);
      })
    }).catch((error)=>{
      console.log(error);
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DistribuidorPage');
  }

}
