import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { RequestService } from '../../providers/request.service';
import { HelperService, AnalyticsHelper } from '../../core/services/helper.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'contactus',
    templateUrl: 'contactus.html'
})
export class ContactusComponent {
    contactus: any = {};
    interestedAreas: any = [];
    isUserInfoValid: boolean = false;
    languageChangeSubscription: any = undefined;
    isLoading: boolean = false;

    constructor(
        private nav: NavController,
        private helper: HelperService,
        private requestService: RequestService,
        private translate: TranslateService) {
    }

    ionViewWillEnter() {
        
        AnalyticsHelper.logEvent("VisitContactUs");

        this.helper.dismissAllLoaders().then(() => {
            this.fetchPageData();
        });
        this.languageChangeSubscription = this.translate.onLangChange.subscribe(() => {
            this.fetchPageData();
        });        
    }

    ionViewWillLeave() {
        if(this.languageChangeSubscription) {
            this.languageChangeSubscription.unsubscribe();
        }
    }

    fetchPageData() {
        if(this.isLoading) return;
        this.isLoading = true;
        let loader = "CONTACTUS.getData";
        this.helper.showLoading(loader);
        this.requestService.getInterestedArea()
            .subscribe((res) => {
                console.log("interestedAreas", res);
                this.interestedAreas = res;
                this.helper.hideLoading(loader);
                this.isLoading = false;
            }, () => {
                this.helper.hideLoading(loader);
                this.isLoading = false;
            });
    }

    onClickSubmitForm() {
        let loaderName = "CONTACTUS.SubmitForm"
        this.helper.showLoading(loaderName);
        this.requestService.submitRequest(this.contactus, 'InquiryRequest')
            .subscribe((res) => {
                this.translate.get("CONTACTUS.SuccessMsg").subscribe((val) => {
                    this.helper.showToast(val);
                    this.helper.hideLoading(loaderName);
                    if (this.nav.canGoBack())
                        this.nav.pop();
                });
            }, () => {
                this.helper.hideLoading(loaderName);
            });
    }
}
