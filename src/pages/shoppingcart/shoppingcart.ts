import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NavController } from 'ionic-angular';

import { CheckoutComponent } from '../checkout/checkout';
import { StoreComponent } from '../store/store';
import { CartService } from '../../providers/cart.service';
import { CheckOutService } from '../../providers/checkout.service';
import { HelperService, getAmount, AnalyticsHelper } from '../../core/services/helper.service';
import { AuthenticationService } from '../../providers/security/auth.service';

import { CartItem } from '../../models/cart.model';
import { CustomerRegisterComponent } from '../customer/customer-register/customer-register';
import { Observable } from 'rxjs';

/**
 * Generated class for the ShoppingcartComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
    selector: 'shoppingcart',
    templateUrl: 'shoppingcart.html'
})
export class ShoppingcartComponent {

    isCartItemsChanged: boolean = false;
    items: CartItem[] = [];
    discountOnItems = 0;
    isGuest: boolean = true;
    canGuestCheckout: boolean = false;

    constructor(public translate: TranslateService,
        public navCtrl: NavController,
        private cart: CartService,
        private checkoutService: CheckOutService,
        private helper: HelperService,
        private authService: AuthenticationService) {
        this.isGuest = !this.authService.isAuthenticated();
    }

    ionViewWillEnter() {
        this.helper.dismissAllLoaders().then(() => {
            this.fetchPageData();
            AnalyticsHelper.logEvent("VisitCart");
        });
    }

    onLanguageChange() {
        this.fetchPageData();
    }

    fetchPageData() {
        
        let loaderName = "SHOOPINGCART.getItems";
        this.helper.showLoading(loaderName);
        //console.log("IsGuest: "+ this.isGuest);
        Observable.forkJoin(this.checkoutService.checkOutForGuest(), this.cart.getCartItems()).subscribe(([guestCheckoutEnabled, items]) => {
            if (guestCheckoutEnabled && guestCheckoutEnabled.Data)
                this.canGuestCheckout = guestCheckoutEnabled.Data;
            this.items = items;
            this.discountOnItems = items ? items.reduce((result, item) => getAmount(item.Discount) + result, 0) : 0;
            this.helper.hideLoading(loaderName);
        }, () => {
            this.helper.hideLoading(loaderName);
        });
    }

    onClickNavigate(name) {
        if (name == 'CheckOut') {
            this.navCtrl.push(CheckoutComponent);
        }
        if (name == 'Register') {
            this.navCtrl.push(CustomerRegisterComponent);
        }
        if (name == 'Continue')
            this.navCtrl.push(StoreComponent);
    }

    couponActionHandler(orderTotal) {
        //console.log("couponActionHandler call");
        this.fetchPageData();
    }
}
