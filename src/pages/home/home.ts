import { Component } from "@angular/core";
import { NavController } from "ionic-angular";
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
import { config } from "../../app/app.config";

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
    private helper: HelperService
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
