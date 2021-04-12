import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { HelperService } from '../core/services/helper.service';
import { SimpleHttp } from '../core/services/simple-http.service';
import { config } from '../app/app.config';
import { TranslateService } from '@ngx-translate/core';

import { CartItem } from '../models/cart.model';

@Injectable()
export class WishService {

    result: any;
    items: Array<any> = [];

    constructor(public helper: HelperService,
        private http: SimpleHttp,
        public translate: TranslateService) {
    }

    addToWish(product: CartItem): Observable<any> {

        return Observable.create((observer) => {

            let data = [{ "value": product.Quantity, "key": "addtocart_" + product.ProductId + ".EnteredQuantity" }];

            this.http.doPost(config.applicationBaseUrl + '/AddProductToCart/' + product.ProductId + '/2', data).subscribe((res: any) => {

                if (res.Success) {
                    this.getWishItems().subscribe((result) => {
                        observer.next(res);
                        observer.complete();
                    });
                } else {
                    observer.next(res);
                    observer.complete();
                }
            }, (err) => {
                observer.error(err);
            });
        });
    }

    addToWishWithLoader(product: CartItem): Observable<any> {

        return Observable.create((observer) => {
            let loaderName = "CARTSERVICE.addToWish";
            this.helper.showLoading(loaderName);

            this.addToWish(product).subscribe((res) => {

                if (res.Success) {
                    this.translate.get('COMMON.NewWishItem').subscribe((val) => {
                        this.helper.showToast(val);
                    });
                } else {
                    this.helper.showToast(res.ErrorList ? res.ErrorList[0] : 'Error', 'danger');
                }

                this.helper.hideLoading(loaderName);
                observer.next(res);
                observer.complete();
            }, () => {
                this.helper.hideLoading(loaderName);
                observer.error();
            });
        });
    }

    addWishListToCart(products: CartItem[]) {
        let data = [];
        products.forEach((product) => {
            data.push({ "key": "addtocart", "value": product.Id });
        });

        return this.http.doPost(config.applicationBaseUrl + '/ShoppingCart/AddItemsToCartFromWishlist', data);
    }

    removeFromWish(product: CartItem): Observable<any> {
        return Observable.create((observer) => {
            let data = [{ "value": product.Id, "key": "removefromcart" }];
            this.http.doPost(config.applicationBaseUrl + '/ShoppingCart/UpdateWishlist', data)
                .subscribe((res) => {
                    let productIndex = this.items.findIndex((item) => { return item.ProductId == product.ProductId });
                    this.items.splice(productIndex, 1);

                    observer.next(res);
                    observer.complete();
                }, () => {
                    observer.error();
                });
        });
    }

    resetWishItems() {
        this.items = [];
    }

    getWishItems(forceLoading: boolean = false): Observable<any> {
        return Observable.create((observer) => {
            let url = config.developmentMode ? 'assets/data/shopping-cart.json' : config.applicationBaseUrl + '/shoppingCart/wishlist';            

            this.http.doGet(url).subscribe((res) => {
                this.result = res;
                this.items = res['Items'];

                observer.next(res);
                observer.complete();
            }, () => {
                observer.error();
            });
        });
    }
}