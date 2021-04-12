import { Component } from '@angular/core';
import { AlertController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';

import { HelperService } from '../../../core/services/helper.service';
import { CustomerService } from '../../../providers/customer.service';

@Component({
    selector: 'customer-address',
    templateUrl: 'customer-address.html'
})
export class CustomerAddressComponent {

    addresses: any[] = [];
    selAddress: any;
    showAddressCmp: boolean = false;
    isNew: boolean = false;

    constructor(
        public translate: TranslateService,
        private alertCtrl: AlertController,
        private helper: HelperService,
        private custService: CustomerService) {
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
        let loaderName = "CUSTOMERADDRESS";       
        this.helper.showLoading(loaderName);
        this.custService.getCustomerAddresses()
            .subscribe((res) => {
                this.addresses = res['ExistingAddresses'];
                this.helper.hideLoading(loaderName)
            }, () => {
                this.helper.hideLoading(loaderName);
            });
    }

    onClickEditAddress(address) {
        this.showAddressCmp = true;
        this.selAddress = address;
    }

    onClickRemoveAddress(address, index) {

        this.translate.get(['CUSTOMERADDRESS.deleteAddressMsg1',
                            'CUSTOMERADDRESS.deleteAddressMsg2',
                            'CUSTOMERADDRESS.Yes',
                            'CUSTOMERADDRESS.No',
                            'CUSTOMERADDRESS.DeleteSuccessfully']).subscribe((res) => {
                                
                let alert = this.alertCtrl.create({
                    title: res['CUSTOMERADDRESS.deleteAddressMsg1'] + (index + 1) + res['CUSTOMERADDRESS.deleteAddressMsg2'],
                    buttons: [
                        {
                            text: res['CUSTOMERADDRESS.Yes'],
                            handler: () => {
                                let loader = "CUSTOMERADDRESS.delete";
                                this.helper.showLoading(loader);
                                this.custService.removeCustomerAddress(address.Id)
                                    .subscribe(() => {
                                        this.addresses.splice(index, 1);
                                        this.helper.showToast(res['CUSTOMERADDRESS.DeleteSuccessfully']);
                                        this.helper.hideLoading(loader);
                                    }, () => {
                                        this.helper.hideLoading(loader);
                                    });
                            }
                        },
                        {
                            text: res['CUSTOMERADDRESS.No']
                        }
                    ]
                });

                alert.present();
            });
    }

    onClickAddAddress() {
        this.isNew = true;
        this.selAddress = {};
        this.showAddressCmp = true;
    }

    addressCmpActionHandler(event) {
        this.showAddressCmp = false;
        this.isNew = false;
        
        if (event) {
            this.fetchPageData();
        }
    }
}
