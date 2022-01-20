import { Injectable } from '@angular/core';
import { Observable, forkJoin } from 'rxjs';

import { HelperService, getAmount, AnalyticsHelper } from '../core/services/helper.service';
import { SimpleHttp } from '../core/services/simple-http.service';

import { config } from '../app/app.config';
import { CartItem } from '../models/cart.model';
import { TranslateService } from '@ngx-translate/core';

// const CART_KEY = 'cartItems';

@Injectable()
export class CartService {

    info: any;
    items: Array<CartItem> = [];
    orderTotal: any = {};

    constructor(public helper: HelperService,
        private http: SimpleHttp,
        public translate: TranslateService) {
    }

    addToCart(product: CartItem): Observable<any> {

        return Observable.create((observer) => {

            let data = [{ "value": product.Quantity, "key": "addtocart_" + product.ProductId + ".EnteredQuantity" }];

            if (product.AttributeInfo && product.AttributeInfo.length > 0)
                product.AttributeInfo.forEach(x => data.push(x));

            this.http.doPost(config.applicationBaseUrl + '/AddProductToCart/' + product.ProductId + '/1', data).subscribe((res: any) => {

                if (res.Success) {

                    AnalyticsHelper.logEvent("AddToCart", {
                        ...product,
                        setRevenue: getAmount(product.UnitPrice) * product.Quantity
                    });

                    this.getCartItems().subscribe((result: CartItem[]) => {

                        observer.next(res);
                        observer.complete();
                    }, (err) => {
                        observer.error(err);
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

    addToCartWithLoader(product: CartItem): Observable<any> {
        return Observable.create((observer) => {

            let loaderName = "CARTSERVICE.addToCart";
            this.helper.showLoading(loaderName);

            this.addToCart(product).subscribe((res) => {

                if (res.Success) {
                    this.translate.get('COMMON.NewCartItem').subscribe((val) => {
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

    updateCartItems(products: CartItem[]): Observable<any> {
        this.items.forEach((item, index) => {
            item.Quantity = products[index].Quantity;
        });

        let observables = [];
        products.forEach((product) => {
            if (product.isQuantityUpdated) {
                let data = [{ "value": product.Quantity, "key": "addtocart_" + product.ProductId + ".EnteredQuantity" },
                { "value": product.Id, "key": "addtocart_" + product.ProductId + ".UpdatedShoppingCartItemId" }];
                observables.push(this.http.doPost(config.applicationBaseUrl + '/AddProductToCart/' + product.ProductId + '/1', data));
            }
        });

        return Observable.create((observer) => {
            forkJoin(observables).subscribe((res) => {
                this.getCartItems().subscribe(() => {
                    observer.next(res);
                    observer.complete();
                }, (err) => {
                    observer.error(err)
                });
            }, (err) => {
                observer.error(err)
            });
        });
    }

    removeFromCart(product: CartItem): Observable<any> {
        return Observable.create((observer) => {

            let data = [{ "value": product.Id, "key": "removefromcart" }];

            this.http.doPost(config.applicationBaseUrl + '/ShoppingCart/UpdateCart', data)
                .subscribe((res: any) => {

                    let productIndex = this.items.findIndex(x => x.ProductId == product.ProductId);
                    this.items.splice(productIndex, 1);

                    AnalyticsHelper.logEvent("RemoveFromCart", product);

                    this.getOrderTotal().subscribe(() => {
                        observer.next(this.items);
                        observer.complete();
                    }, (err) => {
                        observer.error(err)
                    });
                }, () => {
                    observer.error();
                });
        });
    }

    resetCartItems() {
        this.items = [];
        this.orderTotal = {};
    }

    getNCBCodeList(){
        return this.http.doGet(config.applicationBaseUrl + '/ShoppingCart/getpromocodemapping');
    }

    getCartItems(forceLoading: boolean = false): Observable<CartItem[]> {

        return Observable.create((observer) => {
            let url = config.developmentMode ? 'assets/data/shopping-cart.json' : config.applicationBaseUrl + '/ShoppingCart';
            
            this.http.doGet(url)
                .subscribe((res) => {
                    this.info = res;
                    this.items = res['Items'];
                    this.getOrderTotal().subscribe(() => {

                        observer.next(this.items);
                        observer.complete();
                    }, (err) => {
                        observer.error(err)
                    });
                }, (err) => {
                    observer.error(err)
                });
        });
    }

    getOrderTotal(): Observable<any> {
        return Observable.create((observer) => {
            this.http.doGet(config.applicationBaseUrl + '/ShoppingCart/OrderTotal').subscribe((res: any) => {
                this.orderTotal = res;

                observer.next(res);
                observer.complete();
            }, () => {
                observer.error();
            });
        });
    }

    applyDiscountCoupon(code,card="",bankName="") {

        if(card!=undefined && card!=null && card!="")
        {
            return Observable.create((observer) => {
                this.http.doPost(config.applicationBaseUrl + '/ShoppingCart/ApplyDiscountCoupon?cardNumber='+card+'&bankName='+bankName, { value: code }).subscribe((res: any) => {
                    AnalyticsHelper.logEvent("Promocode", {
                        promocode: code
                    });
                    this.getCartItems().subscribe(() => {
                        observer.next(res);
                        observer.complete();
                    }, (err) => {
                        observer.error(err)
                    });
                }, () => {
                    observer.error();
                });
            });
        
        }
        else
         {

        return Observable.create((observer) => {
            this.http.doPost(config.applicationBaseUrl + '/ShoppingCart/ApplyDiscountCoupon', { value: code }).subscribe((res: any) => {
                AnalyticsHelper.logEvent("Promocode", {
                    promocode: code
                });
                this.getCartItems().subscribe(() => {
                    observer.next(res);
                    observer.complete();
                }, (err) => {
                    observer.error(err)
                });
            }, () => {
                observer.error();
            });
        });        
        
    }
}
 

    removeDiscountCoupon(couponId) {
        return Observable.create((observer) => {
            this.http.doPost(config.applicationBaseUrl + '/ShoppingCart/RemoveDiscountCoupon', { value: couponId }).subscribe((res: any) => {

                this.getCartItems().subscribe(() => {
                    observer.next(res);
                    observer.complete();
                }, (err) => {
                    observer.error(err)
                });
            }, () => {
                observer.error();
            });
        });
    }
}