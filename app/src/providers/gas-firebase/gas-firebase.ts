import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore } from 'angularfire2/firestore';

import {GooglePlus} from '@ionic-native/google-plus';

import { first } from 'rxjs/operators';

/*
  Generated class for the GasFirebaseProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class GasFirebaseProvider {

  constructor(public afAuth : AngularFireAuth,
              public dbGas: AngularFirestore,
              public googleplus: GooglePlus) {
    console.log('Hello GasFirebaseProvider Provider');
  }

  loginCorreo(dataUser){
    return this.afAuth.auth.signInWithEmailAndPassword(dataUser.email, dataUser.password);
  }

  createNewUser(newUser){
    return this.afAuth.auth.createUserAndRetrieveDataWithEmailAndPassword(newUser.email, newUser.password)
  }

  registerUser(registerUser:UserModel,uid){
    return this.dbGas.collection('users').doc(`${uid}`).set(registerUser);
  }

  updateUser(updateUser:UserModel,uid){
    return this.dbGas.collection('users').doc(`${uid}`).set(updateUser);
  }

  signOut(){
    return this.afAuth.auth.signOut()
  }

  getSessionUser() {
    return this.afAuth.authState.pipe(first()).toPromise();
  }

  getUserDataByUid(uid:string){
    return this.dbGas.collection('users').doc(`${uid}`).valueChanges()
  }

  getDistribuitorDataByUid(uid:string){
    return this.dbGas.collection('distributor').doc(`${uid}`).valueChanges()
  }

  updateDistribuitorData(updateDistr,uid:string){
    return this.dbGas.collection('distributor').doc(`${uid}`).set(updateDistr)
  }

  isLoggedIn() {
    return this.afAuth.authState.pipe(first()).toPromise();
  }

  async isLogged() {
    const user = await this.isLoggedIn()
    if (user) {
      return true
    } else {
      return false
    }
  }

  getDistribuitorByZone(zone:string){
    return this.dbGas.collection('distributor', ref => ref.where('zone','==', zone)).valueChanges()
  }

  async getUserNotExist(){  
    return this.dbGas.collection('users').stateChanges()
  } 

  // resgistrar pedido de gas

  registerOrder(order:Order){
    let id = btoa(order.date)
    return this.dbGas.collection('orderGas').doc(`${order.zone}`).collection('pedidos').doc(id).set(order)
  }

  getOrderActual(order:Order){
    let id = btoa(order.date)
    return this.dbGas.collection('orderGas').doc(`${order.zone}`).collection('pedidos').doc(id).valueChanges()
  }

  cancelOrderActual(order:Order){
    let id = btoa(order.date)
    return this.dbGas.collection('orderGas').doc(`${order.zone}`).collection('pedidos').doc(id).set(order)
  }   

  // metodos de distribuidor
  getOrdersDistribuitor(zone:any){
    return this.dbGas.collection('orderGas').doc(`${zone}`).collection('pedidos').valueChanges() 
  }

  getOrderById(order:any, zone:any){
    let idOrder = btoa(order.date)
    return this.dbGas.collection('orderGas').doc(`${zone}`).collection('pedidos').doc(idOrder).valueChanges()  
  }

  acceptOrder(order:any){
    let idOrder = btoa(order.date)
    return this.dbGas.collection('orderGas').doc(`${order.zone}`).collection('pedidos').doc(idOrder).set(order)
  }
}
