import { ScratchCardPage } from '../scratch-card/scratch-card';
import { Component } from '@angular/core';
import { HelperService } from '../../core/services/helper.service';
import { NavController, NavParams } from 'ionic-angular';

import { OrderDetailsComponent } from '../orders/order-details/order-details';

/**
 * Generated class for the PaymentComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
    selector: 'payment',
    templateUrl: 'payment.html'
})
export class PaymentComponent {

    paymentType: string = '';
    orderId: string = '';
    reference_no: string = ''; 
    orderTotal: string = '';
    data: any ;

    constructor(
        private helper: HelperService,
        public navParams: NavParams,
        private navCtrl: NavController) {
        this.paymentType = this.navParams.get('paymentType');
        this.orderId = this.navParams.get('orderId');
        this.reference_no = this.navParams.get('reference_no');
        this.orderTotal = this.navParams.get('orderTotal');
    }

    ionViewWillEnter() {
        this.helper.dismissAllLoaders().then(() => {});
    }

    navigateToDetailsPage() {
        let paramObj = { orderId: this.orderId };
        this.navCtrl.push(OrderDetailsComponent, paramObj);
    }

    navigateScratchCardPage() {
        this.data = {order_id:this.orderId};
        this.navCtrl.push(ScratchCardPage, { data: this.data, orderId:this.orderId }, {});
    }
}
