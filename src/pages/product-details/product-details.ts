import { Component, ViewChild } from '@angular/core';
import { NavParams, ModalController, Slides } from 'ionic-angular';
import { HelperService, getAmount, AnalyticsHelper } from '../../core/services/helper.service';
import { CartService } from '../../providers/cart.service';
import { WishService } from '../../providers/wish.service';
import { ImageViewerComponent } from '../../components/image-viewer/image-viewer';
import { NavController } from 'ionic-angular';
import { ShoppingcartComponent } from '../shoppingcart/shoppingcart';
import { DomSanitizer } from '@angular/platform-browser';

import { CartItem } from '../../models/cart.model';
import { TranslateService } from '@ngx-translate/core';

import { CatalogService } from '../../providers/catalog.service';
import { config } from '../../app/app.config';
import { Platform } from 'ionic-angular';

const anchorRegEx = /<a[^>]*?((target|href)\s*=\s*"([^"]*)")([^>]*?((target|href)\s*=\s*"([^"]*)"))*/gi;

let googleDocsViewerUrl = "https://docs.google.com/gview?embedded=true&url=";

function fixTarget(platform: Platform) {
    return function () {
        var attribute1 = (arguments[2] || "").toLowerCase();
        var attribute2 = (arguments[6] || "").toLowerCase();
        let fixed = arguments[0];

        if (attribute1 == "target") {
            fixed = fixed.replace(arguments[1], 'target="_system"');
        } else if (attribute2 == "target") {
            fixed = fixed.replace(arguments[5], 'target="_system"')
        } else {
            fixed = fixed.replace('<a ', '<a target="_system" ');
        }

        let isIOS = platform.is('ios');

        if (attribute1 == "href") {
            fixed = fixed.replace(arguments[1], getOpenInSystemBrowserHref(arguments[3], isIOS));
        } else if (attribute2 == "href") {
            fixed = fixed.replace(arguments[5], getOpenInSystemBrowserHref(arguments[7], isIOS));
        }

        return fixed;
    }
}

function getOpenInSystemBrowserHref(url, isIOS) {
    let isPdf = url.toLowerCase().endsWith('.pdf');
    return (!isPdf || isIOS)
        ? 'href="javascript:window.open(\'' + url + '\',\'_system\')"'
        : 'href="javascript:window.open(\'' + googleDocsViewerUrl + encodeURIComponent(url) + '\',\'_system\')"'
}


@Component({
    selector: 'product-details',
    templateUrl: 'product-details.html'
})
export class ProductDetailsComponent {
    @ViewChild(Slides) slides: Slides;

    productId: string;
    isLoading: boolean = false;
    product: any;
    selectedInfoIndex: number;

    constructor(
        public navParams: NavParams,
        public modalCtrl: ModalController,
        private helper: HelperService,
        private cart: CartService,
        private wish: WishService,
        private catalog: CatalogService,
        public translate: TranslateService,
        private navCtrl: NavController,
        private platform: Platform,
        private domSanitizer: DomSanitizer
    ) {
        this.selectedInfoIndex = 0;
        this.productId = this.navParams.get('productId');
    }

    ionViewWillEnter() {
        this.helper.dismissAllLoaders().then(() => {
            this.fetchPageData();
        });
    }

    onLanguageChange() {
        this.fetchPageData();
    }

    isProductAvailableInStock() {
        return this.product && getAmount(this.product.StockAvailability) > 0;
    }

    productAttributeCheckChanged() {
        console.log("productAttributeCheckChanged", arguments);
    }

    fetchPageData() {
        this.helper.showLoading();
        this.catalog.getProductDetails(this.productId).subscribe((result) => {
            this.product = result['Data'];

            AnalyticsHelper.logEvent("ProductView", {
                item_id: this.productId,
                item_name: this.product.Name,
                item_category: "Not Available",
                price: getAmount(this.product.ProductPrice.PriceWithDiscount || this.product.ProductPrice.Price)                    
            });

            this.product['Quantity'].SelectedQuantity = this.product['Quantity'] ? this.product['Quantity'].OrderMinimumQuantity : 0;

            if (this.product.FullDescription) {
                let desc = this.product.FullDescription;
                let startIndex = desc.indexOf('href=');
                if (startIndex !== -1) {
                    startIndex += 6;
                    let baseUrl = config.applicationBaseUrl.substring(0, config.applicationBaseUrl.indexOf("/api"));
                    const url = desc.substring(startIndex, desc.indexOf('"', startIndex));
                    if (url.substring(0, 4) == "http")
                        baseUrl = '';

                    this.product.brochureUrl = url ? baseUrl + url : null;
                    this.product.FullDescription = desc.substr(0, startIndex) + baseUrl + desc.substr(startIndex);
                    console.log('this.product.brochureUrl', this.product.brochureUrl);
                    this.product.FullDescription = this.product.FullDescription.replace(anchorRegEx, fixTarget(this.platform));
                    this.product.FullDescription = this.domSanitizer.bypassSecurityTrustHtml(this.product.FullDescription);
                }
            }
            this.product.AttributeInfo = this.product.AttributeInfo || {};
            console.log("Got Product Details", this.product);

            this.helper.hideLoading();
        }, () => {
            this.helper.hideLoading();
        });
    }

    showSliderFullScreen() {
        let imagesUrl = [];

        let currentIndex = this.slides.getActiveIndex();
        let index = 0;
        for (let i of this.product.PictureModels) {
            if (index == currentIndex)
                imagesUrl.push(i['FullSizeImageUrl'] || i['ImageUrl']);
            index++;
        }
        let modal = this.modalCtrl.create(ImageViewerComponent, { imagesUrl: imagesUrl, defaultIndex: 0, disablePager: true, disableLooping: true });
        modal.present();
    }

    onClickAddToList(type) {
        let cartItem: CartItem = new CartItem();

        cartItem.ProductId = this.product.Id;
        cartItem.ProductName = this.product.Name;
        cartItem.Quantity = this.product.Quantity ? this.product.Quantity.SelectedQuantity : 1;
        cartItem.UnitPrice = this.product.ProductPrice.Price;
        cartItem.Picture.ImageUrl = this.product.DefaultPictureModel.ImageUrl;
        cartItem.AttributeInfo = [];

        for (var att in this.product.AttributeInfo) {
            if (this.product.AttributeInfo[att]) {
                let parts = att.split('_');
                let value = parts.pop();
                let key = parts.join('_');
                cartItem.AttributeInfo.push({ key, value });
            }
        }

        if (type == 'cart') {
            this.cart.addToCartWithLoader(cartItem).subscribe(() => {
                this.navCtrl.push(ShoppingcartComponent)
            }, () => { });
        }
        else
            this.wish.addToWishWithLoader(cartItem).subscribe(() => {
                this.product.QuantityInWishlist = !this.product.QuantityInWishlist;
            }, () => { });
    }

    onClickReadBrochure(url) {
        window.open(encodeURI(url), '_system', 'location=yes')
    }
}
