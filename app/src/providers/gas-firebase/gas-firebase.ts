import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFirestore } from 'angularfire2/firestore';

import { first } from 'rxjs/operators';

/*
  Generated class for the GasFirebaseProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class GasFirebaseProvider {

  constructor(public afAuth : AngularFireAuth,public dbGas: AngularFirestore) {
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

  signOut(){
    return this.afAuth.auth.signOut()
  }

  getSessionUser() {
    return this.afAuth.authState.pipe(first()).toPromise();
  }

  getUserDataByUid(uid:string){
    return this.dbGas.collection('users').doc(`${uid}`).valueChanges()
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
}
