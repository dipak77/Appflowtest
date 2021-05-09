import { Component } from '@angular/core';
import { Platform, ModalController, ToastController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { FCM } from '@ionic-native/fcm/ngx';
import { TranslateService } from '@ngx-translate/core';
import { SplashComponent } from '../pages/splash/splash';
import PayTabsRestFulApi from './paytabs.restfulapi';
import { config, getRemoteProperties } from './app.config';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { HttpClient } from '@angular/common/http';
import { AnalyticsHelper } from '../core/services/helper.service';
import { SimpleHttp } from "../core/services/simple-http.service";

function getPreferredLanguage() {
    let language = (navigator.languages != undefined)
        ? navigator.languages[0]
        : navigator.language;
    if (language) language = language.split('-')[0];
    return language || "en";
}

@Component({
    templateUrl: 'app.html'
})
export class MyApp {

    static webServer;

    constructor(
        public platform: Platform,
        public statusBar: StatusBar,
        public splashScreen: SplashScreen,
        public translate: TranslateService,
        public modalCtrl: ModalController,
        public inAppBrowser: InAppBrowser,
        private simpleHttp: SimpleHttp,
        public toastCtrl: ToastController,
        public http: HttpClient,
        private fcm: FCM
        ) {

        // Initialize the application
        this.initializeApp();

        // Initialize Translation Services
        // this language will be used as a fallback when a translation isn't found in the current language
        // 
        this.translate.setDefaultLang(getPreferredLanguage());
    }

    initializeApp() {                
        this.platform.ready().then(() => {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            this.statusBar.styleDefault();

            // Show Custom Splash Screen
            if (window.localStorage.getItem("skip-splash")) {
                window.localStorage.removeItem("skip-splash");
            } else {
                let splash = this.modalCtrl.create(SplashComponent, {}, { showBackdrop: false });
                console.log("Presenting Splash Screen");
                splash.present();
            }

            // get Remote properties
            getRemoteProperties(this.simpleHttp);

            AnalyticsHelper.toastCtrl = this.toastCtrl;

             // Initialize Analytics
            // AnalyticsHelper.init();
              // subscribe to a topic
            // this.fcm.subscribeToTopic('Deals');

            // get FCM token
            this.fcm.getToken().then(token => {
                console.log(token);
            });

            // ionic push notification example
            this.fcm.onNotification().subscribe(data => {
                console.log(data);
                if (data.wasTapped) {
                console.log('Received in background');
                } else {
                console.log('Received in foreground');
                }
            });      

            // refresh the FCM token
            this.fcm.onTokenRefresh().subscribe(token => {
                console.log(token);
            });

            // Create our local web server for payment support
            MyApp.webServer = new PayTabsRestFulApi(config.PayTabs.DefaultLocalPort, this.inAppBrowser, this.platform, this.http);
        });
    }
}