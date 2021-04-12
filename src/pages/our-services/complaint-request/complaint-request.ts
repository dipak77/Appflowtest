import { Component } from '@angular/core';
import { RequestDetailsComponent } from '../request-details/request-details';
import { NavController } from 'ionic-angular';
import { RequestService } from '../../../providers/request.service';
import { HelperService } from '../../../core/services/helper.service';
import { TranslateService } from '@ngx-translate/core';

/**
 * Generated class for the ComplaintRequestComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
    selector: 'complaint-request',
    templateUrl: 'complaint-request.html'
})
export class ComplaintRequestComponent {

    data: any = {};
    isUserInfoValid: boolean = false;
    acIssues: any;

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

    fetchPageData() {
        let loaderName = "COMPLAINTREQUEST"
        this.helper.showLoading(loaderName);
        this.requestService.getAcIssues().subscribe((result) => {
            this.acIssues = result;
            this.helper.hideLoading(loaderName);
        }, () => {
            this.helper.hideLoading(loaderName);
        });
    }

    onSubmit() {
        let loaderName = "COMPLAINTREQUEST.Submit"
        this.helper.showLoading(loaderName);
        this.requestService.submitRequest(this.data, 'ComplainRequest')
            .subscribe((res) => {
                this.translate.get("SERVICES.COMPLAINT-REQUEST.SubmitSuccessfully")
                    .subscribe((translateVal) => {
                        this.helper.showToast(translateVal);
                        this.helper.hideLoading(loaderName);

                      this.nav.push(RequestDetailsComponent, { requestType: 'ComplainRequest', requestId: res });
                    });
            }, () => {
                this.helper.hideLoading(loaderName);
            });
    }
}
