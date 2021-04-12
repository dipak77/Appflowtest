import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';

import { HelperService } from '../../../core/services/helper.service';
import { CustomerService } from '../../../providers/customer.service';
import { CartService } from '../../../providers/cart.service';

/**
 * Generated class for the OrderDetailsComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
    selector: 'order-details',
    templateUrl: 'order-details.html'
})
export class OrderDetailsComponent {

    orderId: string;
    result: any;

    constructor(public navParams: NavParams,
        public translate: TranslateService,
        private helper: HelperService,        
        private customer: CustomerService,
        private cart: CartService) {

        this.orderId = this.navParams.get('orderId');
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
        let loaderName = "ORDERDETAILS"
        this.helper.showLoading(loaderName);
        this.customer.getCustomerOrderDetails(this.orderId).subscribe((result) => {
            this.result = result;
            this.helper.hideLoading(loaderName);
        }, () => {
            this.helper.hideLoading(loaderName);
        });
    }

    onClickReorder() {
        let loaderName = "ORDERDETAILS.ReOrder"
        this.helper.showLoading(loaderName);
        this.customer.reorder(this.orderId).subscribe((result) => {

            this.cart.getCartItems().subscribe(() => {
                this.helper.hideLoading(loaderName);
                this.translate.get("ORDERDETAILS.ReorderDoneSuccessfully").subscribe((val) => {
                    this.helper.showToast(val);
                });
            });
        }, () => {
            this.helper.hideLoading(loaderName);
        });
    }
}
