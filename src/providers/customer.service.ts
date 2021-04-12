import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { HelperService } from '../core/services/helper.service';
import { SimpleHttp } from '../core/services/simple-http.service';
import { config } from '../app/app.config';

@Injectable()
export class CustomerService {

    states: any = [];

    constructor(
        public helper: HelperService,
        private http: SimpleHttp) {
    }

    getCustomerInfo() {
        return this.http.doGet(config.applicationBaseUrl + '/customer/info');
    }

    updateCustomerInfo(customer: any) {
        return this.http.doPost(config.applicationBaseUrl + '/customer/info', customer);
    }

    getCustomerAddresses() {
        let url = config.applicationBaseUrl + '/customer/addresses';
        if (config.developmentMode)
            url = 'assets/data/customer-addresses.json';

        return this.http.doGet(url);
    }

    removeCustomerAddress(addressId) {
        return this.http.doGet(config.applicationBaseUrl + '/customer/address/remove/' + addressId);
    }

    editCustomerAddress(address) {
        let obj = {
            "FirstName": address.FirstName,
            "LastName": address.LastName,
            "Email": address.Email,
            "PhoneNumber": address.PhoneNumber,
            "Company": address.Company || 'test',
            "City": address.City,
            "Address1": address.Address1,
            "Address2": address.Address2,
            "CountryId": address.CountryId || '1',
            "StateProvinceId": address.StateProvinceId || '1',
            "ZipPostalCode": address.ZipPostalCode || '1'
        };

        let data = [];
        for (let prop in obj) {
            data.push({ "value": address[prop] || "", "key": "Address." + prop });
        }

        return this.http.doPost(config.applicationBaseUrl + '/customer/address/edit/' + address.Id || '', data);
    }

    addCustomerAddress(address) {
        let data = [];
        for (let prop in address) {
            data.push({ "value": address[prop], "key": "Address." + prop });
        }

        return this.http.doPost(config.applicationBaseUrl + '/customer/address/add', data);
    }

    getCustomerOrders() {
        let url = config.applicationBaseUrl + '/order/customerorders';
        if (config.developmentMode)
            url = 'assets/data/orders.json';

        return this.http.doGet(url);
    }

    getCustomerOrderDetails(orderId: string) {
        let url = config.applicationBaseUrl + '/order/details/' + orderId;
        if (config.developmentMode)
            url = 'assets/data/order-details.json';

        return this.http.doGet(url);
    }

    reorder(orderId: string) {
        return this.http.doGet(config.applicationBaseUrl + '/order/reorder/' + orderId);
    }

    getCountryStates(countryId: string = '69', forceLoad: boolean = false) {
        return Observable.create((observer) => {

            if (this.states[countryId] && !forceLoad) {
                observer.next(this.states[countryId]);
                observer.complete();
                return;
            }

            this.http.doGet(config.applicationBaseUrl + '/country/getstatesbycountryid/' + countryId)
                .subscribe((res) => {
                    this.states[countryId] = res['Data'];
                    observer.next(this.states[countryId]);
                    observer.complete();
                }, (err) => {
                    observer.error(err);
                });
        });
    }
}
