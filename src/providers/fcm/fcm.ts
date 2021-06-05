import { AngularFirestore } from '@angular/fire/firestore';
import { Platform } from 'ionic-angular';
import { Firebase } from '@ionic-native/firebase/ngx';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the FcmProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class FcmProvider {

  constructor(public firebaseNative : Firebase,
              public afs : AngularFirestore,
              private platform : Platform
              ) {
    console.log('Hello FcmProvider Provider');
  }

  async getToken(){

    let token : any;
    
      if(this.platform.is('ios')){
        token = await this.firebaseNative.getToken();
        const perm = await this.firebaseNative.grantPermission();


      }

      return this.saveTokenToFirestore(token);
  }

  private saveTokenToFirestore(token){
      if(!token)  return;

      const devicesRef = this.afs.collection('devies')

      const docData = {
        token,
        userId : 'testUser',

      }

      return devicesRef.doc(token).set(docData);
  }

  listenNotifications(){
    return this.firebaseNative.onNotificationOpen();
  }

}
