import { FcmProvider } from './../../providers/fcm/fcm';
import { tap } from 'rxjs/operators';
import { Component } from "@angular/core";
import { NavController, ToastController } from "ionic-angular";
import { Platform } from "ionic-angular";
import { StoreComponent } from "../store/store";
import {
  HelperService,
  AnalyticsHelper,
} from "../../core/services/helper.service";
import { OurServicesComponent } from "../../pages/our-services/our-services";
import { getRemoteProperties } from "../../app/app.config";
import { SimpleHttp } from "../../core/services/simple-http.service";
import { TranslateService } from "@ngx-translate/core";
@Component({
  selector: "page-home",
  templateUrl: "home.html",
})
export class HomePage {
  remoteProperties: any = { homepagePopupUrls: { ar: "", en: "" } };

  constructor(
    public translate: TranslateService,
    private navCtrl: NavController,
    public platform: Platform,
    private simpleHttp: SimpleHttp,
    private helper: HelperService,
    public fcm : FcmProvider,
    public toastCtrl : ToastController
  ) {

  }

  ionViewWillEnter() {
    this.helper.dismissAllLoaders();
    AnalyticsHelper.logEvent("VisitHomepage");
  }

  ionViewDidEnter() {
    let component = this;
    getRemoteProperties(component.simpleHttp).subscribe({
      next(remoteProperties) {
        component.remoteProperties = remoteProperties;
        component.loadPromotPopup(1000);
      },
    });
  }

  ionViewDidLoad(){
    this.fcm.getToken();
    this.fcm.listenNotifications().pipe(tap( msg => {
                      const toast = this.toastCtrl.create({
                        message :msg.body,
                        duration : 3000
                      });
                      toast.present();
    })).subscribe();
  }



  onLanguageChange() {
    this.loadPromotPopup(0);
  }

  loadStorePage() {
    this.navCtrl.push(StoreComponent);
  }

  loadOurServices() {
    this.navCtrl.push(OurServicesComponent);
  }

  loadPromotPopup(timeout) {
    if (this.remoteProperties.homepagePopupUrls[this.translate.currentLang]) {
      setTimeout(() => {
        document.getElementById("popup").style.display = "block";
        document.getElementById("cover").style.display = "block";
      }, timeout);
    }
  }

  closePromotPopup() {
    document.getElementById("popup").style.display = "none";
    document.getElementById("cover").style.display = "none";
  }
}
