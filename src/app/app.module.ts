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
import { HTTP } from '@ionic-native/http/ngx';
import { FilterPipe } from '../core/pipes/filter.pipe';
import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { Device } from '@ionic-native/device';
import { OrderModule } from 'ngx-order-pipe';
import { ImageViewerModule } from 'ng2-image-viewer';
import { ScratchCardPageModule } from '../pages/scratch-card/scratch-card.module';

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
    IonicStorageModule.forRoot(),
    ScratchCardPageModule
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
    HTTP,
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
    Device
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