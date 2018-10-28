import { GasFirebaseProvider } from './../../providers/gas-firebase/gas-firebase';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, MenuController, ModalController} from 'ionic-angular';
import { OrderDetailsPage } from '../order-details/order-details';

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

  distribuitorUid:any

  distribuitorData:DistribuitorModel;

  ordersUsers:any

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    public afDb : GasFirebaseProvider,
    public events: Events, public menuCtrl: MenuController, public modalCtrl: ModalController) {
    this.menuCtrl.enable(true, "menuGas");

    this.afDb.getSessionUser()
    .then((user)=>{
      this.distribuitorUid = user.uid
      this.afDb.getDistribuitorDataByUid(user.uid).subscribe((distribuitorData:any)=>{
        this.distribuitorData = distribuitorData;
        this.events.publish('distribuitor:logged', distribuitorData);
        console.log(this.distribuitorData)
        this.getOrders(this.distribuitorData.zone)
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

  getOrders(zone:string){
    this.afDb.getOrdersDistribuitor(zone).subscribe((orders:any)=>{
      console.log(orders)
      orders.map((order:any)=>{
        this.afDb.getUserDataByUid(order.userUid).subscribe((user)=>{
          order.userData = user
        })
      })
      this.ordersUsers = orders
      console.log(orders)
    })
  }

  reviewOrder(orderSelected:any){
    const modal = this.modalCtrl.create(OrderDetailsPage,
      {order: orderSelected, zone: this.distribuitorData.zone, uidDist:this.distribuitorUid})
      
    modal.onDidDismiss(data => {
      if(data){
        console.log(data);
      }
    });
    modal.present()
  }

}
