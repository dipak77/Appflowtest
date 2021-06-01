import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NavController } from 'ionic-angular';

import { CustomerAddressComponent } from '../customer-address/customer-address'
import { CustomerService } from '../../../providers/customer.service';
import { HelperService } from '../../../core/services/helper.service';

@Component({
    selector: 'customer-info',
    templateUrl: 'customer-info.html'
})
export class CustomerInfoComponent {

    customer: any = {};

    constructor(
        public navCtrl: NavController,
        private translate: TranslateService,
        private custService: CustomerService,
        private helper: HelperService){
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
        let loaderName = "CUSTOMERINFO"
        this.helper.showLoading(loaderName);
        // 
        this.custService.getCustomerInfo()
            .subscribe((res) => {
                this.customer = res;
                this.helper.hideLoading(loaderName);
            }, () => {
                this.helper.hideLoading(loaderName);
            });
    }

    onClickUpdate() {
        let loaderName = "CUSTOMERINFO.Update"
        this.helper.showLoading(loaderName);
        this.custService.updateCustomerInfo(this.customer)
            .subscribe((res) => {
                this.translate.get("CUSTOMERINFO.UpdateSuccessfully").subscribe((val) => {
                    this.helper.showToast(val);
                    this.helper.hideLoading(loaderName);
                });
            }, () => {
                this.translate.get("CUSTOMERINFO.UpdateFailed").subscribe((val) => {
                    this.helper.showToast(val);
                    this.helper.hideLoading(loaderName);
                });
            });
    }

    navigateToAddressPage() {
        this.navCtrl.push(CustomerAddressComponent);
    }
}
