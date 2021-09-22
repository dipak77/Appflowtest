import { ScratchCardPage } from './../scratch-card/scratch-card';
import { Component } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';
import { Platform } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';

import { CartService } from '../../providers/cart.service';
import { CheckOutService } from '../../providers/checkout.service';
import { HelperService, getAmount, AnalyticsHelper } from '../../core/services/helper.service';
import { AuthenticationService } from '../../providers/security/auth.service';
import { CustomerService } from '../../providers/customer.service';
import { PaymentComponent } from '../payment/payment';

import { Observable } from 'rxjs/Observable';
import { IPaymentRestFulApiInfo } from '../../app/paytabs';
import { config, getRemoteProperties } from '../../app/app.config';
import payTabs from '../../app/paytabs.restfulapi';
import { SimpleHttp } from '../../core/services/simple-http.service';
import { HelpAndSupport } from '../help-and-support/help-and-support';
import { toBase64String } from '@angular/compiler/src/output/source_map';
import { PaytabsSuccessPage } from '../paytabs-success/paytabs-success';

/**
 * Generated class for the CheckoutComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
    selector: 'checkout',
    templateUrl: 'checkout.html'
})
export class CheckoutComponent {

    isGuest = false;
    discountOnItems = 0;
    addresses: any = {};
    orderReview: any = {};
    createOrderReview: any = {};
    selAddress: string = '';
    selPaymentType: string = "";
    isAddressValid: boolean = true;
    isAddressSaved: boolean = false;
    isPaymentMethodSaved: boolean = false;
    showCartDetails: boolean = false;
    customerSadadId: string = '';
    paymentTypes: any = [];
    shippingMethods: any = [];
    selectedShippingMethod: any;
    hasAgreedTermsAndConditions: boolean = false;

    checkoutInfo = {
        Email: '', PhoneNumber: '', FirstName: '',
        LastName: '', Address1: '', Address2: '', City: '',
        CountryId: '', StateProvinceId: '', Notes: ''
    };

    constructor(
        public translate: TranslateService,
        private checkout: CheckOutService,
        private cart: CartService,
        public navCtrl: NavController,
        private auth: AuthenticationService,
        private helper: HelperService,
        private custService: CustomerService,
        public modalCtrl: ModalController,
        private simpleHttp: SimpleHttp,
        public platform: Platform) {
        this.onClickConfirm = this.onClickConfirm.bind(this);
        this.isGuest = !auth.isAuthenticated();
    }

    ionViewWillEnter() {
        this.helper.dismissAllLoaders().then(() => {
            this.fetchPageData();
            AnalyticsHelper.logEvent("VisitCheckout");
        });
    }

    onLanguageChange() {
        this.fetchPageData();
    }

    fetchPageData() {

        let observables = [];
        let data: any = {};
        this.isAddressSaved = false;
         
        let checkoutOrderInformation=this.checkout.getCheckoutOrderInformation().subscribe(res => {
           console.log("checkoutOrderInformation",res);
            data = res;
         });
        ////console.log("checkoutOrderInformation", checkoutOrderInformation);
        observables.push(this.checkout.getCheckoutOrderInformation());

        let getRemotePropertiesObservable = getRemoteProperties(this.simpleHttp).subscribe(res => {
            ////console.log("getRemotePropertiesObservable",res);
            data = res;
         });
        ////console.log("getRemotePropertiesObservable", getRemotePropertiesObservable);
        observables.push(getRemoteProperties(this.simpleHttp));

        let checkoutMethodsObvservable = this.checkout.getShipmentMethods().subscribe(res => {
           // //console.log("checkoutMethodsObvservable", res);
            data = res;
         });
        /////console.log("checkoutMethodsObvservable", checkoutMethodsObvservable);
        observables.push(this.checkout.getShipmentMethods());

        if (this.auth.isAuthenticated()) {
            let custdata=this.custService.getCustomerAddresses().subscribe(res => {
                ////console.log("custdata",res);
                data = res;
             });
          //  //console.log("custdata", custdata);
             
            observables.push(this.custService.getCustomerAddresses());
        }

       // //console.log("isAuthenticated()=> ", this.auth.isAuthenticated());

        let loaderName = "CHEKOUT.Loading";

        this.helper.showLoading(loaderName);
        ////console.log("shippingMethods started");
         
        Observable.forkJoin(observables).subscribe(([orderReview, remoteProps, shippingMethods, addresses]) => {
            
            this.orderReview = orderReview || { OrderTotalModel: {} };
            let remoteProperties: any = remoteProps || {};
            let shoppingCartModel = this.orderReview.ShoppingCartModel;
            this.shippingMethods = shippingMethods;

           // //console.log("shippingMethods", shippingMethods);

            // Addresses and Selected Address
            let gotAddressFromCheckout = !addresses && shoppingCartModel && shoppingCartModel.OrderReviewData && shoppingCartModel.OrderReviewData.BillingAddress;
            this.addresses = addresses || (gotAddressFromCheckout ? { ExistingAddresses: [shoppingCartModel.OrderReviewData.BillingAddress] } : {});
            let selectedAddress = (orderReview && shoppingCartModel && shoppingCartModel.OrderReviewData && shoppingCartModel.OrderReviewData.BillingAddress && this.addresses.ExistingAddresses)
                ? this.addresses.ExistingAddresses.find(a => a.Id == shoppingCartModel.OrderReviewData.BillingAddress.Id)
                : null;
            this.selAddress = selectedAddress ? selectedAddress.Id : null;
           // //console.log("selAddress", this.selAddress);
            if (selectedAddress && gotAddressFromCheckout) {
                ['FirstName', 'LastName', 'Address1', 'Address2', 'City', 'Email', 'PhoneNumber'].forEach(prop => {
                    if (!this.checkoutInfo[prop] && selectedAddress[prop])
                        this.checkoutInfo[prop] = selectedAddress[prop]
                });
            }

            let isEnglish = this.platform.dir() === "ltr";
            const bankTransferKey = "bank-transfer";
            this.isAddressSaved = this.selAddress ? true : false;
           
            this.discountOnItems = orderReview && shoppingCartModel && shoppingCartModel.Items ? shoppingCartModel.Items.reduce((result, item) => getAmount(item.Discount) + result, 0) : 0;

            // Payment Types
            let banktransferImage = (isEnglish ? './assets/bank-transfer-logo.png' : './assets/bank-transfer-logo-arabic.png');
            let paymentLogos = remoteProperties.paymentLogos[isEnglish ? "en" : "ar"];
            let imagesExceptBank = Object.keys(paymentLogos).filter(k => k != bankTransferKey).map(k => paymentLogos[k]);
            this.paymentTypes = [
                { id: 'paytabs', imgPaths: imagesExceptBank },
                { id: 'banktransfer', imgPaths: [paymentLogos[bankTransferKey] || banktransferImage] }
            ];

            //console.log("Checkout", { orderReview, remoteProperties, addresses, selectedAddress })

            this.helper.hideLoading(loaderName);
        }, () => {
            this.helper.hideLoading(loaderName);
        });
    }

    onDDLShippingMethodChange(item) {
        //console.log("onDDLShippingMethodChange", item);
        if (item) {
            let component = this;
            component.helper.showLoading("CHECKOUT.ShippingChange");
            component.checkout.setShipmentMethod(this.selectedShippingMethod).subscribe(res => {
                component.helper.hideLoading("CHECKOUT.ShippingChange");
                component.fetchPageData();
            });
        }
    }

    onDDLAddressChange(item) {
        const props = (item === 'new' && this.auth.isAuthenticated())
            ? this.auth._authResponse || {}
            : (this.addresses.ExistingAddresses.find(x => x.Id === item)) || {};
        for (let prop in this.checkoutInfo) {
            this.checkoutInfo[prop] = props[prop] || '';
        }
        if (item != 'new')
            this.onClickSaveAddress();
        else
            this.isAddressSaved = false;
    }

    onDDLPaymentTypeChange(paymentType) {
        if (paymentType) {
            this.isPaymentMethodSaved = false;
            let loaderName = "CHEKOUT.PAYMENTTYPE";
            this.helper.showLoading(loaderName);
            this.savePaymentMethod(paymentType).subscribe((res) => {
                this.helper.hideLoading(loaderName);
                if (!res.error) {
                    this.isPaymentMethodSaved = true;
                }
            }, () => {
                this.helper.hideLoading(loaderName);
            });
        }
    }

    editSelectedAddress() {
        this.isAddressSaved = false;
    }

    onClickSaveAddress() {

        let loaderName = "CHEKOUT.SaveAddress";
        this.helper.showLoading(loaderName);

        let isNewAddress = !this.auth.isAuthenticated() || this.selAddress === 'new' || !this.selAddress;
        //console.log("onClickSaveAddress", this.selAddress, "isNewAddress", isNewAddress);

        let observable = !isNewAddress
            ? Observable.forkJoin(
                this.checkout.setBillingAddressById(this.selAddress + ""),
                this.custService.editCustomerAddress({ ...this.checkoutInfo, Id: this.selAddress }))
            : this.checkout.setBillingAddressByForm(this.checkoutInfo);

        observable.subscribe((res) => {

            let shippingAddressObserver = !isNewAddress
                ? this.checkout.setShipmentAddressById(this.selAddress + "")
                : this.checkout.setShipmentAddressByForm(this.checkoutInfo)
                ;

            shippingAddressObserver.subscribe(() => {
                this.checkout.setDeliveryShipmentMethod().subscribe(() => {
                    this.helper.hideLoading(loaderName);
                    this.isAddressSaved = true;
                    this.fetchPageData();
                });
            }, () => {
                this.helper.hideLoading(loaderName);
            });
            // this.helper.hideLoading(loaderName);
            // this.isAddressSaved = true;
            // this.fetchPageData();
        }, () => {
            this.helper.hideLoading(loaderName);
        });

    }

    savePaymentMethod(paymentType: string) {
        const nopPaymentType = this.selPaymentType == 'paytabs' ? 'Payments.Manual' : 'Payments.Manual';
        return this.checkout.setDeliveryShipmentMethod().flatMap(() => {
            let result = this.checkout.setPaymentMethod(nopPaymentType);
            result.subscribe(() => {
                this.fetchPageData()
            })
            return result;
        });
    }

    getRestFulApiPaymentInfo(order) {
        let address = (this.checkoutInfo.Address1 + " " + this.checkoutInfo.Address2).trim();
        // let products = order.ShoppingCartModel.Items;
        // let total = 0;
        // products.forEach(element => {
        //         total = total + getAmount(element.UnitPrice) * element.Quantity;
        // });
        // total = parseFloat(total.toFixed(2));
        //debugger;
        let paymentInfo: IPaymentRestFulApiInfo = {
            merchant_email: `${config.PayTabs.MerchantEmail}`,
            secret_key: `${config.PayTabs.SecretKey}`,
            // site_url: 'http://localhost:8100/',
            // return_url: 'http://localhost:8100/PaymentResult/',
            site_url: 'http://localhost:21213/',
            return_url: 'http://localhost:21213/PaymentResult/',
            title: "York Store: " + order.ShoppingCartModel.Items.map(item => item.ProductName).join(' | '),
            cc_first_name: this.checkoutInfo.FirstName,
            cc_last_name: this.checkoutInfo.LastName,
            cc_phone_number: "00966",
            phone_number: this.checkoutInfo.PhoneNumber,
            email: this.checkoutInfo.Email,
            products_per_title: order.ShoppingCartModel.Items.map(item => item.ProductName).join(' || '),
            unit_price: order.ShoppingCartModel.Items.map(item => getAmount(item.UnitPrice)).join(' || '),
            quantity: order.ShoppingCartModel.Items.map(item => item.Quantity).join(' || '),
            other_charges: getAmount(order.OrderTotalModel.Shipping),
            amount: getAmount(order.OrderTotalModel.OrderTotal || order.OrderTotalModel.SubTotal), //total,
            discount: getAmount(order.OrderTotalModel.OrderTotalDiscount || order.OrderTotalModel.SubTotalDiscount),
            currency: 'SAR',
            reference_no: "CART-" + (new Date()).getTime(),
            ip_customer: '87.101.136.180',
            ip_merchant: '87.101.136.180',
            billing_address: address,
            state: this.checkoutInfo.StateProvinceId || 'unknown',
            city: this.checkoutInfo.City,
            postal_code: "none",
            country: "SAU",
            shipping_first_name: this.checkoutInfo.FirstName,
            shipping_last_name: this.checkoutInfo.LastName,
            address_shipping: address,
            city_shipping: this.checkoutInfo.City,
            state_shipping: this.checkoutInfo.StateProvinceId || 'unknown',
            postal_code_shipping: "none",
            country_shipping: "SAU",
            msg_lang: this.platform.dir() == 'ltr' ? 'English' : 'Arabic',
            cms_with_version: 'Ionic 3.2.1'
        };

        return paymentInfo;
    }

    onClickConfirm() {
        const order = this.orderReview;

        if (!order || !order.OrderTotalModel || !order.ShoppingCartModel) {
            console.error("Cannot Checkout while Order Details not available");
            return;
        }

        let paymentInfo = this.getRestFulApiPaymentInfo(order);
        this.createOrder(paymentInfo);
    }

    createOrder(paymentInfo: IPaymentRestFulApiInfo) {
        let loaderName = "CHEKOUT.CREATEORDER";
        this.helper.showLoading(loaderName);

        AnalyticsHelper.logEvent("Checkout", {
            setRevenue: paymentInfo.amount,
            setTransactionId: paymentInfo.reference_no
        });

        paymentInfo['PaymentMethod'] = this.selPaymentType == 'paytabs' ? 'PayTabs' : 'BankTransfer';
        paymentInfo['OrderSource'] = 'Mobile';
        let orderData = { ...paymentInfo };
        delete orderData.reference_no;
        delete orderData.secret_key;

        this.checkout.setCheckOutComplete(orderData).subscribe((res: any) => {
            this.createOrderReview = res;

            this.custService.getCustomerOrderDetails(res.OrderId).subscribe((orderDetails: any) => {
                this.helper.hideLoading(loaderName);

                paymentInfo.reference_no = orderDetails.CustomOrderNumber || res.OrderGuid;

                if (this.selPaymentType == 'paytabs')
                    this.payWithPayTabs(paymentInfo);
                else
                    this.setOrderStatus(paymentInfo);
                    
            }, () => {
                this.helper.hideLoading(loaderName);

                this.translate.get('CHECKOUT.ErrorWhileFinalizingPaymentFromNopSide').subscribe((val) => {
                    this.helper.showToast(val, 'error');
                });
            });

        }, (error) => {
            this.helper.hideLoading(loaderName);
            if (error && error.ErrorList) {
                this.helper.showToast(error.ErrorList.join('\n'), 'error')
            }
            else this.translate.get('CHECKOUT.ErrorWhileFinalizingPaymentFromNopSide').subscribe((val) => {
                this.helper.showToast(val, 'error');
            });
        });
    }

    openTermsAndConditions() {
        this.navCtrl.push(HelpAndSupport);
    }

    payWithPayTabs(paymentInfo) {
        
        // this.helper.showLoading("PAYTABS");
        // this.setOrderStatus(paymentInfo, 'success', {});
        // this.helper.hideLoading("PAYTABS");
        //  console.log(paymentInfo);
        let promise = payTabs.instance.gotoPayment(paymentInfo);
        promise.then(
            paymentResultFields => {
                this.helper.hideLoading("PAYTABS");
                //console.log("Successful Payment Transaction", paymentResultFields, paymentInfo);
                this.setOrderStatus(paymentInfo, 'success', paymentResultFields);
            },
            paymentResultFields => {
                this.helper.hideLoading("PAYTABS");
                //console.log("Successful Payment Transaction", paymentResultFields, paymentInfo);
               // this.setOrderStatus(paymentInfo, 'success', paymentResultFields);
                console.log("Error in Payment Transaction", paymentResultFields, paymentInfo);
                this.translate.get('CHECKOUT.PaymentError').subscribe((val) => {
                    this.helper.showToast(val, 'error');
                });

                this.setOrderStatus(paymentInfo, 'fail', paymentResultFields);
            });
    }

    setOrderStatus(paymentInfo = { amount: 0, reference_no: "" }, status: string = 'success', paymentResultFields = {}) {

        let observers = [
            this.cart.getCartItems(),
            this.checkout.getCheckoutOrderInformation()
        ];

        let loaderName = "CHEKOUT.RefreshCart";
        this.helper.showLoading(loaderName);

        Observable.forkJoin(observers).subscribe(([cart, orderReviewObj]) => {
            this.helper.hideLoading(loaderName);
            let orderReview: any = orderReviewObj;
            console.log('payment info', paymentInfo.amount);
            if (status == 'success') {
                AnalyticsHelper.logEvent("CheckoutComplete", {
                    paymentInfo: paymentInfo,
                    order: this.orderReview, 
                    setRevenue: paymentInfo.amount,
                    setTransactionId: paymentInfo.reference_no
                });
                if(this.selPaymentType == 'paytabs'){
                    this.navCtrl.setRoot(
                        PaytabsSuccessPage,
                        {
                            paymentType: this.selPaymentType,
                            orderId: this.createOrderReview.OrderId,
                            reference_no: paymentInfo.reference_no,
                            orderTotal: paymentInfo.amount
                        });
                }else{
                    this.navCtrl.setRoot(
                        PaymentComponent,
                        {
                            paymentType: this.selPaymentType,
                            orderId: this.createOrderReview.OrderId,
                            reference_no: paymentInfo.reference_no,
                            orderTotal: paymentInfo.amount
                        });
                }
                
            } else {
                this.orderReview = orderReview || {};
            }

        }, () => {
            this.helper.hideLoading(loaderName);
        });
    }
}

function ScratchCard(ScratchCard: any, arg1: { paymentType: string; orderId: any; reference_no: string; orderTotal: number; }) {
    throw new Error('Function not implemented.');
}
