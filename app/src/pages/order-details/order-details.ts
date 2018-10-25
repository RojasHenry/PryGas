import { GasFirebaseProvider } from './../../providers/gas-firebase/gas-firebase';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the OrderDetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-order-details',
  templateUrl: 'order-details.html',
})
export class OrderDetailsPage {

  orderDetail:any
  userOrder:UserModel
  constructor(public navCtrl: NavController, public navParams: NavParams,public afDb : GasFirebaseProvider) {

    this.orderDetail = this.navParams.get("order");
    this.afDb.getUserDataByUid(this.orderDetail.userUid).subscribe((user:UserModel)=>{
      this.userOrder = user
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OrderDetailsPage');
    
  }

}
