import { Component } from "@angular/core";
import { RequestDetailsComponent } from "../request-details/request-details";
import { NavController } from "ionic-angular";
import { RequestService } from "../../../providers/request.service";
import { HelperService } from "../../../core/services/helper.service";
import { TranslateService } from "@ngx-translate/core";

import { forkJoin } from "rxjs";

/**
 * Generated class for the ServiceRequestComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: "contract-request",
  templateUrl: "contract-request.html",
})
export class ContractRequestComponent {
  data: any = {};
  ACTypes: any = [];
  problems: any = [];
  numberOfUnits: any = [];
  isUserInfoValid: boolean = false;
  projectDetails: any = {};
  acIssues: any;
  contractType: any;

  constructor(
    private nav: NavController,
    private helper: HelperService,
    private requestService: RequestService,
    private translate: TranslateService
  ) { }

  ionViewWillEnter() {
    this.helper.dismissAllLoaders().then(() => {
      this.fetchPageData();
    });
  }

  onLanguageChange() {
    this.fetchPageData();
  }

  fetchPageData() {
    const loader = "CASEREQUEST";
    this.helper.showLoading(loader);

    let observers = [];
    observers.push(this.requestService.getAcTypes());
    observers.push(this.requestService.getProblems());

    forkJoin(observers).subscribe(
      ([acTypes, problems]) => {
        this.ACTypes = acTypes;
        this.problems = problems;
        console.log({ acTypes, problems });
        this.helper.hideLoading(loader);
      },
      () => {
        this.helper.hideLoading(loader);
      }
    );
  }

  getProjectDetails() {
    if (this.data.jci_projectcode) {
      let loaderName = "CASEREQUEST.Submit";
      this.helper.showLoading(loaderName);
      this.requestService
        .getProjectDetails(this.data.jci_projectcode)
        .subscribe(
          (projectDetails) => {
            this.projectDetails = projectDetails || {};

            this.data.jci_contractaccountnumber = (projectDetails.AccountCode + "").trim();
            this.data.jci_contractnumber = projectDetails.ContractNumber;
            this.data.projectEndBeforeSixtyDays = false;
            this.data.hasProjectDetailsData = null;
            this.data.jci_region = projectDetails.Region || '';
            this.data.jci_city = projectDetails.City || '';
            this.data.isProjectCanceled = false;

            if (projectDetails.Status === 'Cancelled                     ') {
              this.data.isProjectCanceled = true;
              //console.log("this.data.isProjectCanceled", this.data.isProjectCanceled);
            }

            if (this.data.isProjectCanceled === true || this.data.hasProjectDetailsData === 'no') {
              this.data.jci_region = '';
              this.data.jci_city = '';
            }

            console.log("projectDetails", projectDetails);

            if (Object.keys(this.projectDetails).length === 0) {
              this.data.hasProjectDetailsData = 'yes';
            }

            if (projectDetails.ProjectEstEndDate) {
              var apiDateConvertedToJavascript = new Date(projectDetails.ProjectEstEndDate.replace(/(\d{2})\/(\d{2})\/(\d{4})/, "$2/$1/$3"));
              var subtractedDate = apiDateConvertedToJavascript;
              new Date(subtractedDate.setDate(apiDateConvertedToJavascript.getDate() - 60));
              var currentDate = new Date();
              if (currentDate > subtractedDate) {
                this.data.projectEndBeforeSixtyDays = true;
              }
            }

            this.helper.hideLoading(loaderName);
          },
          () => {
            this.projectDetails = {};
            this.data.hasProjectDetailsData = 'no';
            this.data.jci_region = '';
            this.data.jci_city = '';
            this.helper.hideLoading(loaderName);
          }
        );
    }
  }

  onSubmit() {
    let loaderName = "CASEREQUEST.Submit";
    this.helper.showLoading(loaderName);

    const clonedData = Object.assign({}, this.data);
    //const clonedData = { ...this.data };

    delete clonedData["jci_region"];
    delete clonedData["jci_city"];
    delete clonedData["projectEndBeforeSixtyDays"];
    delete clonedData["hasProjectDetailsData"];
    delete clonedData["isProjectCanceled"];

    this.requestService.submitRequest(clonedData, "ContractRequest").subscribe(
      (res) => {
        this.translate
          .get("SERVICES.SubmitSuccessfully")
          .subscribe((translateVal) => {
            this.helper.showToast(translateVal);
            this.helper.hideLoading(loaderName);

            this.nav.push(RequestDetailsComponent, {
              requestType: "ContractRequest",
              requestId: res,
            });
          });
      },
      () => {
        this.helper.hideLoading(loaderName);
      }
    );
  }
}
