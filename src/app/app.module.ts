import { ScratchCardThanksPage } from './../pages/scratch-card-thanks/scratch-card-thanks';
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { IonicStorageModule } from '@ionic/storage';
import { Geolocation } from '@ionic-native/geolocation';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { RouterModule } from '@angular/router';
import { config } from './app.config';
import { MyApp } from './app.component';
import { AgmCoreModule } from '@agm/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { FilterPipe } from '../core/pipes/filter.pipe';
import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { Device } from '@ionic-native/device';
import { OrderModule } from 'ngx-order-pipe';
import { ImageViewerModule } from 'ng2-image-viewer';
// Services
import { AuthenticationService } from '../providers/security/auth.service';
import { CartService } from '../providers/cart.service';
import { WishService } from '../providers/wish.service';

import { CatalogService } from '../providers/catalog.service';
import { CheckOutService } from '../providers/checkout.service';
import { CustomerService } from '../providers/customer.service';
import { RequestService } from '../providers/request.service';
import { SimpleHttp } from '../core/services/simple-http.service';
import { HelperService } from '../core/services/helper.service';

import { routes, components } from './app.imports';
import { CustomTranslationsLoader } from '../core/components/multilingual-support/index';
import { FcmProvider } from '../providers/fcm/fcm';
import { AngularFireModule} from '@angular/fire';
import {AngularFirestoreModule} from '@angular/fire/firestore';
import {Firebase} from "@ionic-native/firebase/ngx";

const firebase = {
  apiKey: "AIzaSyBSI51X85J_puvNeNBzLprLMFpC9V9h_dI",
  authDomain: "york-store-app.firebaseapp.com",
  projectId: "york-store-app",
  storageBucket: "york-store-app.appspot.com",
  messagingSenderId: "519553487235",
  appId: "1:519553487235:web:e39554004b89a9fa44a6b6"
};



@NgModule({
  declarations: [
    MyApp,
    FilterPipe,
    components
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AngularFireModule.initializeApp(firebase),
    AngularFirestoreModule,
    AgmCoreModule.forRoot({
      apiKey: config.googleMapsKey,
      libraries: ["places"]
    }),
    IonicModule.forRoot(MyApp, {}, { links: routes }),
    ImageViewerModule,
    OrderModule,
    TranslateModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useClass: CustomTranslationsLoader
      }
    }),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    components
  ],
  providers: [
    HttpClient,
    StatusBar,
    Geolocation,
    SplashScreen,
    InAppBrowser,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    CartService,
    WishService,
    AuthenticationService,
    CatalogService,
    CheckOutService,
    CustomerService,
    RequestService,
    SimpleHttp,
    HelperService,
    TranslateService,
    Device,
    Firebase,
    FcmProvider
  ],
  exports: [
    RouterModule,
    TranslateModule,
    IonicStorageModule,
    OrderModule,
    FilterPipe
  ]
})
export class AppModule { }