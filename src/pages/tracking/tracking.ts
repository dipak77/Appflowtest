import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { HelperService } from '../../core/services/helper.service';

import { RequestService } from '../../providers/request.service';
import { CustomerService } from '../../providers/customer.service';

import { OrderDetailsComponent } from '../orders/order-details/order-details';
import { RequestDetailsComponent } from '../our-services/request-details/request-details';
import { AuthenticationService } from '../../providers/security/auth.service';

import { getRemoteProperties } from '../../app/app.config';
import { SimpleHttp } from '../../core/services/simple-http.service';


/**
 * Generated class for the OrdersComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'tracking',
  templateUrl: 'tracking.html'
})
export class TrackingComponent {

  result: any;
  referenceNumber: string = '';
  serviceType: string = '';
  customerOrders: any;
  remoteProperties: any = {};

  constructor(private customerService: CustomerService,
    private requestService: RequestService,
    private helper: HelperService,
    private navCtrl: NavController,
    private authenticate: AuthenticationService,
    private simpleHttp: SimpleHttp
  ) {
    this.serviceType = 'CaseRequest';
    let component = this;
    getRemoteProperties(this.simpleHttp).subscribe({
      next(remoteProperties) { component.remoteProperties = remoteProperties }
    });
  }

  ionViewWillEnter() {
    this.helper.dismissAllLoaders().then(() => {
      this.getAllOrders(this.serviceType);
    });
  }

  onServiceTypeChange(type) {
    this.serviceType = type;
    this.getAllOrders(this.serviceType);
  }

  getAllOrders(type) {
    this.customerOrders = null;

    if (!this.authenticate.isAuthenticated())
      return;

    let loaderName = "ORDERS";
    this.helper.showLoading(loaderName);
    let observer;
    if (type == 'Order') {
      observer = this.customerService.getCustomerOrders();
    }
    else {
      observer = this.requestService.getAllRequests(type);
    }

    observer.subscribe((result) => {
      this.serviceType == 'Order' ? this.customerOrders = result.Orders : this.customerOrders = result;
      this.helper.hideLoading(loaderName);
    }, () => {
      this.helper.hideLoading(loaderName);
    });
  }

  navigateToDetailsForRequestNumber() {
    let paramObj = { requestType: "All", referenceNumber: this.referenceNumber };
    this.navCtrl.push(RequestDetailsComponent, paramObj);
  }

  navigateToDetailsPage(requestId, Id) {
    if (this.customerOrders) {
      let paramObj = { requestType: this.serviceType, requestId: requestId, orderId: Id };

      let component;
      if (this.serviceType == 'Order')
        component = OrderDetailsComponent;
      else
        component = RequestDetailsComponent;

      this.navCtrl.push(component, paramObj);
    }
  }
}
