import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { HelperService } from '../../core/services/helper.service';
import { ShoppingcartComponent } from '../shoppingcart/shoppingcart';

import { CartService } from '../../providers/cart.service';
import { WishService } from '../../providers/wish.service';

/**
 * Generated class for the MywishlistComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
    selector: 'mywishlist',
    templateUrl: 'mywishlist.html'
})
export class MywishlistComponent {

    selectedItems: any[] = [];

    constructor(public translate: TranslateService,
        private cart: CartService,
        private wish: WishService,
        public helper: HelperService,
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
        let loaderName = "WISHLIST";
        this.helper.showLoading(loaderName);
        this.wish.getWishItems().subscribe((res) => {
            this.helper.hideLoading(loaderName);
        }, () => {
            this.helper.hideLoading(loaderName);
        });
    }

    onClickAddToCart() {
        let loaderName = "WISHLIST.AddToCart";
        this.helper.showLoading(loaderName);
        this.wish.addWishListToCart(this.selectedItems).subscribe((res) => {
            this.wish.result = res;
            this.wish.items = res['items'] || [];

            this.translate.get('WISHLIST.SuccessMsg').subscribe((val) => {
                this.navCtrl.push(ShoppingcartComponent);
                this.helper.showToast(val);
            });
            this.cart.getCartItems().subscribe(() => {
                this.helper.hideLoading(loaderName);
            }, () => {
                this.helper.hideLoading(loaderName);
            });
        }, () => {
            this.helper.hideLoading(loaderName);
        });
    }
}
