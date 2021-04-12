import { Component } from '@angular/core';
import { CustomerService } from '../../../providers/customer.service';
import { NavController } from 'ionic-angular';
import { OrderDetailsComponent } from '../order-details/order-details';
import { HelperService } from '../../../core/services/helper.service';

/**
 * Generated class for the OrdersComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
    selector: 'order-list',
    templateUrl: 'order-list.html'
})
export class OrderListComponent {

    result: any;

    constructor(
        private customer: CustomerService,
        private helper: HelperService,
        private navCtrl: NavController) {
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
        let loaderName = "ORDERLIST"
        this.helper.showLoading(loaderName);
        this.customer.getCustomerOrders().subscribe((result) => {
            this.result = result;
            this.helper.hideLoading(loaderName);
        }, () => {
            this.helper.hideLoading(loaderName);
        });
    }

    navigateToDetailsPage(order) {
        if (order) {
            let paramObj = { orderId: order.Id };
            this.navCtrl.push(OrderDetailsComponent, paramObj);
        }
    }
}
