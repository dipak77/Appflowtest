import { TranslateLoader } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import 'rxjs/add/observable/of';

import * as common from './translations/common.translations';
import * as menu from '../../../components/menu/menu.translations';
import * as coupon from '../../../components/coupon/coupon.translations';
import * as footer from '../../../components/footer/footer.translations';
import * as userInfo from '../../../components/user-info/user-info.translations';

import * as store from '../../../pages/store/store.translations';
import * as home from '../../../pages/home/home.translations';
import * as productFilter from '../../../pages/product-list/product-filter/product-filter.translations';
import * as productDetails from '../../../pages/product-details/product-details.translations';
import * as shoppingcartitems from '../../../pages/shoppingcart/shopping-cart-items/shopping-cart-items.translations';
import * as shoppingcart from '../../../pages/shoppingcart/shoppingcart.translations';
import * as shoppingcarttotal from '../../../pages/shoppingcart/shopping-cart-total/shopping-cart-total.translations';
import * as checkout from '../../../pages/checkout/checkout.translations';
import * as login from '../../../pages/login/login.translations';
import * as relatedProducts from '../../../pages/product-details/related-products/related-products.translations';
import * as productList from '../../../pages/product-list/product-list.translations';
import * as productCard from '../../../pages/product-list/product-card/product-card.translations';
import * as orders from '../../../pages/orders/order-list/order-list.translations';
import * as orderDetails from '../../../pages/orders/order-details/order-details.translations';
import * as contactus from '../../../pages/contactus/contactus.translations';
import * as wishlist from '../../../pages/mywishlist/mywishlist.translations';
import * as address from '../../../pages/customer/customer-address/address/address.translations';
import * as customerpass from '../../../pages/customer/customer-password/customer-password.translations';
import * as register from '../../../pages/customer/customer-register/customer-register.translations';
import * as payment from '../../../pages/payment/payment.translations';
import * as location from '../../../pages/location/location.translations';
import * as services from '../../../pages/our-services/our-services.translations';
import * as scratchCard from './../../../pages/scratch-card/scratch-card.translations';

import * as customeraddress from '../../../pages/customer/customer-address/customer-address.translations';
import * as customerInfo from '../../../pages/customer/customer-info/customer-info.translations';
import * as tracking from '../../../pages/tracking/tracking.translations';
import * as forgotPassword from '../../../pages/forgot-password/forgot-password.translations';

//
// Custom Translations Loader
//  
export class CustomTranslationsLoader implements TranslateLoader {

  public translations = {
    "en": {}, "ar": {}
  };

  constructor() {
    this.process("", common.default);
    this.process("", menu.default);
    this.process("", footer.default);

    // Pages
    this.process("", store.default);
    this.process("", home.default);
    this.process("", productFilter.default);
    this.process("", productDetails.default);
    this.process("", shoppingcartitems.default);
    this.process("", shoppingcart.default);
    this.process("", shoppingcarttotal.default);
    this.process("", checkout.default);
    this.process("", login.default);
    this.process("", relatedProducts.default);
    this.process("", productList.default);
    this.process("", productCard.default);
    this.process("", orders.default);
    this.process("", orderDetails.default);
    this.process("", wishlist.default);
    this.process("", contactus.default);
    this.process("", customerInfo.default);
    this.process("", customeraddress.default);
    this.process("", address.default);
    this.process("", customerpass.default);
    this.process("", register.default);
    this.process("", coupon.default);
    this.process("", payment.default);
    this.process("", location.default);
    this.process("", services.default);
    this.process("", tracking.default);
    this.process("", userInfo.default);
    this.process("", forgotPassword.default);
    this.process("", scratchCard.default);
  }

  process(path, item) {
    if (item.en && item.ar && typeof (item.en) == typeof ("string")) {
      this.translations["en"][path] = item.en;
      this.translations["ar"][path] = item.ar;
    }
    else {
      for (let key in item) {
        this.process((path ? path + "." : "") + key, item[key]);
      }
    }
  }

  getTranslation(lang: string): Observable<any> {
    return Observable.of(this.translations[lang]);
  }
}
