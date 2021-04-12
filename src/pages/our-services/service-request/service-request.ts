import { Component } from '@angular/core';
import { RequestDetailsComponent } from '../request-details/request-details';
import { NavController } from 'ionic-angular';
import { RequestService } from '../../../providers/request.service';
import { HelperService } from '../../../core/services/helper.service';
import { TranslateService } from '@ngx-translate/core';

import { forkJoin } from 'rxjs';

/**
 * Generated class for the ServiceRequestComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
    selector: 'service-request',
    templateUrl: 'service-request.html'
})
export class ServiceRequestComponent {

    data: any = {};
    ACTypes: any;
    numberOfUnits: any = [];
    isUserInfoValid: boolean = false;
    acIssues: any;
    contractType: any;

    constructor(
        private nav: NavController,
        private helper: HelperService,
        private requestService: RequestService,
        private translate: TranslateService
        ) {
    }

    ionViewWillEnter() {
        this.helper.dismissAllLoaders().then(() => {
            this.fetchPageData();
        });
    }

    onLanguageChange() {
        this.fetchPageData();
    }

    fetchPageData() {
        const loader = 'CASEREQUEST';
        this.helper.showLoading(loader);

        let observer = [];
        observer.push(this.requestService.getAcTypes());
        observer.push(this.requestService.getAcIssues());

      forkJoin(observer).subscribe(([acTypes, acIssues]) => {
            this.ACTypes = acTypes;            
            this.acIssues = acIssues;
            this.helper.hideLoading(loader);
        }, () => {
            this.helper.hideLoading(loader);
        });
    }

    onSubmit() {
        let loaderName = "CASEREQUEST.Submit"
        this.helper.showLoading(loaderName);
        this.requestService.submitRequest(this.data, 'CaseRequest')
            .subscribe((res) => {

                this.translate.get("SERVICES.SubmitSuccessfully")
                    .subscribe((translateVal) => {
                        this.helper.showToast(translateVal);
                        this.helper.hideLoading(loaderName);

                        this.nav.push(RequestDetailsComponent, { requestType: 'CaseRequest',requestId: res });
                    });
            }, () => {
                this.helper.hideLoading(loaderName);
            });
    }
}
