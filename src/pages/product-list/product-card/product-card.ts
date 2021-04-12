import { Component, Input } from '@angular/core';
import { NavController } from 'ionic-angular';

import { ProductDetailsComponent } from '../../product-details/product-details';
import { ShoppingcartComponent } from '../../shoppingcart/shoppingcart';
import { MywishlistComponent } from '../../mywishlist/mywishlist';

import { CartService } from '../../../providers/cart.service';
import { WishService } from '../../../providers/wish.service';

import { CartItem } from '../../../models/cart.model';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'product-card',
    templateUrl: 'product-card.html'
})

export class ProductCardComponent {
    @Input() product: any;

    constructor(
        public navCtrl: NavController,
        private cart: CartService,
        private wish: WishService,
        public translate: TranslateService) {
    }

    onProductSelected(product) {
        if (product) {
            let paramObj = { productId: product.Id };
            this.navCtrl.push(ProductDetailsComponent, paramObj);
        }
    }

    onClickAddToList(type) {

        if (type == 'cart') {
            if (this.product.QuantityInCart) {
                this.navCtrl.push(ShoppingcartComponent);
            }
            else {
                let cartItem: CartItem = new CartItem();
                cartItem.ProductId = this.product.Id;
                cartItem.ProductName = this.product.Name;
                cartItem.Quantity = 1;
                cartItem.UnitPrice = this.product.ProductPrice.Price;
                cartItem.Picture.ImageUrl = this.product.DefaultPictureModel.ImageUrl;
                this.cart.addToCartWithLoader(cartItem).subscribe(() => {
                    this.product.QuantityInCart = 1;
                }, () => { });
            }
        }
        else {
            if (this.product.QuantityInWishlist) {
                this.navCtrl.push(MywishlistComponent);
            }
            else {
                let cartItem: CartItem = new CartItem();
                cartItem.ProductId = this.product.Id;
                cartItem.ProductName = this.product.Name;
                cartItem.Quantity = 1;
                cartItem.UnitPrice = this.product.ProductPrice.Price;
                cartItem.Picture.ImageUrl = this.product.DefaultPictureModel.ImageUrl;
                this.wish.addToWishWithLoader(cartItem).subscribe(() => {
                    this.product.QuantityInWishlist = 1;
                }, () => { });
            }
        }
    }
}
