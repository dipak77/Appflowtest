import { Injectable } from '@angular/core';

import { HelperService } from '../core/services/helper.service';
import { SimpleHttp } from '../core/services/simple-http.service';
import { config } from '../app/app.config';

export enum AddressType {
    Billing = 1,
    Shipping = 2,
    Other = 3
};

@Injectable()
export class CheckOutService {

    constructor(public helper: HelperService,
        private http: SimpleHttp) {
    }

    checkOutForGuest() {
        return this.http.doGet(config.applicationBaseUrl + '/checkout/opccheckoutforguest');
    }

    getBillingAddresses() {
        return this.http.doGet(config.applicationBaseUrl + '/checkout/billingform');
    }

    setBillingAddressById(addressId, addressType: AddressType = AddressType.Billing) {
        return this.http.doPost(config.applicationBaseUrl + '/checkout/checkoutsaveadressid/' + addressType, {
            "value": addressId
        });
    }

    setShipmentAddressById(addressId, addressType: AddressType = AddressType.Shipping) {
        return this.http.doPost(config.applicationBaseUrl + '/checkout/checkoutsaveadressid/' + addressType, {
            "value": addressId
        });
    }

    setShipmentAddressByForm(address) {
        let fixed = { ...address };
        fixed["CountryId"] = 69;
        let data = [];
        for (let prop in fixed) {
            data.push({ "value": fixed[prop], "key": "ShippingNewAddress." + prop });
        }
        return this.http.doPost(config.applicationBaseUrl + '/checkout/checkoutsaveadress/' + AddressType.Shipping, data);
    }

    setBillingAddressByForm(address) {
        let fixed = { ...address };
        fixed["CountryId"] = 69;
        let data = [];
        for (let prop in fixed) {
            data.push({ "value": fixed[prop], "key": "BillingNewAddress." + prop });
        }
        return this.http.doPost(config.applicationBaseUrl + '/checkout/checkoutsaveadress/' + AddressType.Billing, data);
    }

    getPaymentMethods() {
        let url = config.applicationBaseUrl + '/checkout/checkoutgetpaymentmethod';
        if (config.developmentMode)
            url = 'assets/data/payment-methods.json';

        return this.http.doGet(url);
    }

    setPaymentMethod(paymentId) {
        return this.http.doPost(config.applicationBaseUrl + '/checkout/checkoutsavepaymentmethod', {
            "value": paymentId
        });
    }

    setDeliveryShipmentMethod() {
        return this.http.doPost(config.applicationBaseUrl + '/checkout/checkoutsetdeliveryshippingmethod', {
            "value": "Delivery___Shipping.FixedOrByWeight"
        });
    }

    setShipmentMethod(shipmentId) {
        return this.http.doPost(config.applicationBaseUrl + '/checkout/checkoutsetshippingmethod', {
            "value": shipmentId
        });
    }

    getShipmentMethods() {
        return this.http.doGet(config.applicationBaseUrl + '/checkout/checkoutgetshippingmethods');
    }

    getOpcCheckoutForGuest() {
        return this.http.doGet(config.applicationBaseUrl + '/checkout/opccheckoutforguest');
    }

    getCheckoutOrderInformation() {
        return this.http.doGet(config.applicationBaseUrl + '/shoppingcart/checkoutorderinformation');
    }

    setCheckOutComplete(paymentResultFields) {
        let formValues = [];
        for (var key in paymentResultFields) {
            let value = paymentResultFields[key] ? ("" + paymentResultFields[key]) : undefined;
            if (value) {
                formValues.push({ key, value });
            }
        }
        return this.http.doPost(config.applicationBaseUrl + '/checkout/checkoutcomplete', formValues);
    }

    redirectPayment() {
        return this.http.doGet(config.applicationBaseUrl + '/checkout/OpcCompleteRedirectionPayment');
    }
}
