import { Component } from "@angular/core";
import { HelperService } from "../../../core/services/helper.service";
import { RequestService } from "../../../providers/request.service";
import { NavParams } from "ionic-angular";
import { TranslateService } from "@ngx-translate/core";

/**
 * Generated class for the ServiceDetailsComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: "request-details",
  templateUrl: "request-details.html",
})
export class RequestDetailsComponent {
  errorMessage: string = "";
  requestId: string = "";
  referenceNumber: string = "";
  requestType: string = "";
  requestData: any = undefined;

  constructor(
    public navParams: NavParams,
    private helper: HelperService,
    private request: RequestService,
    private translate: TranslateService
  ) {
    this.requestType = this.navParams.get("requestType");
    this.requestId = this.navParams.get("requestId");
    this.referenceNumber = this.navParams.get("referenceNumber");
    this.requestData = this.navParams.get("requestData");
  }

  ionViewWillEnter() {
    this.helper.dismissAllLoaders().then(() => {
      this.fetchPageData();
      console.log(this.requestData);
    });
  }

  fetchPageData() {
    this.helper.showLoading();
    
    if (this.requestData == undefined) {
      this.request
      .getRequestDetails(
        this.requestType,
        this.requestId || this.referenceNumber,
        this.requestId ? true : false
      )
      .subscribe(
        (result) => {
          this.requestData = result;
          if (!result) {
            this.translate
              .get("SERVICES.ErrorWhileGettingRequestDetails")
              .subscribe((val) => {
                this.errorMessage = val;
                this.helper.showToast(val, "error");
              });
          } else this.helper.hideLoading();
          //console.log("this.requestData", this.requestData);
          this.helper.hideLoading();
        },
        () => {
          this.helper.hideLoading();
          this.translate
            .get("SERVICES.ErrorWhileGettingRequestDetails")
            .subscribe((val) => {
              this.errorMessage = val;
              this.helper.showToast(val, "error");
            });
        }
      );
    }
    this.helper.hideLoading();
  }
}
