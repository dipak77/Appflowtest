import { Component } from '@angular/core';
import { TranslateService } from "@ngx-translate/core";
import { NavController } from 'ionic-angular';
import { ServiceRequestComponent } from './service-request/service-request';
import { ComplaintRequestComponent } from './complaint-request/complaint-request';
import { ContractRequestComponent } from './contract-request/contract-request';
import { HelperService, AnalyticsHelper } from '../../core/services/helper.service';
import { getRemoteProperties } from '../../app/app.config';
import { SimpleHttp } from '../../core/services/simple-http.service';

@Component({
    selector: 'our-services',
    templateUrl: 'our-services.html'
})
export class OurServicesComponent {

    remoteProperties: any = {};

    constructor(public translate: TranslateService,
        private navCtrl: NavController,
        private simpleHttp: SimpleHttp,
        public helper: HelperService) {
        let component = this;
        getRemoteProperties(this.simpleHttp).subscribe({
            next(remoteProperties) { component.remoteProperties = remoteProperties }
        });
    }

    ionViewWillEnter() {
        this.helper.dismissAllLoaders().then(() => {
            AnalyticsHelper.logEvent("VisitOurServices");
         });
    }

    loadServiceRequestPage() {
        this.navCtrl.push(ServiceRequestComponent);
    }

    loadComplaintRequest() {
        this.navCtrl.push(ComplaintRequestComponent);
    }

    loadContractRequest() {
        this.navCtrl.push(ContractRequestComponent);
    }
}
