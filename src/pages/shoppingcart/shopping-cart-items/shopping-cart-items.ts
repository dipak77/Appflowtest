import { Component, Input } from '@angular/core';

import { HelperService } from '../../../core/services/helper.service';
import { CartService } from '../../../providers/cart.service';
import { WishService } from '../../../providers/wish.service';
import { TranslateService } from '@ngx-translate/core';


import { CartItem } from '../../../models/cart.model';

/**
 * Generated class for the ShoppingCartItemsComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
    selector: 'shopping-cart-items',
    templateUrl: 'shopping-cart-items.html'
})
export class ShoppingCartItemsComponent {

    @Input() cartType: string = 'cart';
    @Input() canDelete: boolean = true;
    @Input() canEdit: boolean = true;
    @Input() canSelect: boolean = false;

    @Input() selectedItems: any[];
    @Input() items: Array<CartItem> = [];

    isItemsChanged: boolean = false;
    
    constructor(
        private helper: HelperService,
        private cart: CartService,
        private wish: WishService,
        public translate: TranslateService) {
    }

    onClickRemoveCartItem(item: CartItem, index) {
        let loaderName = "SHOOPINGCART.removeCartItem";
        this.helper.showLoading(loaderName);

        let observer;
        if (this.cartType == 'wish')
            observer = this.wish.removeFromWish(item);
        else
            observer = this.cart.removeFromCart(item);

        observer.subscribe(() => {
          this.helper.hideLoading(loaderName);
          this.translate.get('CARTITEMS.ItemDeletedSuccessufully').subscribe((val) => {
            this.helper.showToast(val);
          });
            }, (error) => {
                this.helper.hideLoading(loaderName);
            });
    }

    onQuantityChangeHandler(qty, product: CartItem) {
        this.isItemsChanged = true;
        product.isQuantityUpdated = true;
    }

    onClickUpdateCartItems() {
        let loaderName = "SHOOPINGCART.updateCartItems";
        this.helper.showLoading(loaderName);

        this.cart.updateCartItems(this.items).subscribe(() => {
          this.isItemsChanged = false;
          this.helper.hideLoading(loaderName);
          this.translate.get('CARTITEMS.ItemsUpdatedSuccessufully').subscribe((val) => {
              this.helper.showToast(val);
          });
        }, (error) => {
            this.helper.hideLoading(loaderName);
        });
    }

    selectCartItem(item) {
        if (!item.isChecked) {
            var index = this.selectedItems.indexOf(item);
            if (index > -1) {
                this.selectedItems.splice(index, 1);
            }
            return;
        }

        this.selectedItems.push(item);
    };
}
