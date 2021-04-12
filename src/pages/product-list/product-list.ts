import { Component } from '@angular/core';
import { NavParams, ToastController, ModalController, NavController } from 'ionic-angular';

import { FilterInterface, ProductFilterComponent } from './product-filter/product-filter';
import { ProductDetailsComponent } from '../product-details/product-details';
import { HelperService, AnalyticsHelper } from '../../core/services/helper.service';

import { CatalogService } from '../../providers/catalog.service';
import { getRemoteProperties } from '../../app/app.config';
import { SimpleHttp } from '../../core/services/simple-http.service';

@Component({
    selector: 'product-list',
    templateUrl: 'product-list.html'
})

export class ProductListComponent {
    categoryId: string;
    remoteProperties: any = {};
    isLoading: boolean = false;
    result: any;
    queryText: string;
    filterProperties: FilterInterface = {};
    filterQueryString: string = '';
    showSortCtrls: boolean = false;
    sortBy: string = '';
    pageNumber: number = 1;

    constructor(public navParams: NavParams,
        public toastCtrl: ToastController,
        public modalCtrl: ModalController,
        public navCtrl: NavController,
        private helper: HelperService,
        private simpleHttp: SimpleHttp,
        private catalog: CatalogService) {
        this.categoryId = this.navParams.get('categoryId');
        let component = this;
        getRemoteProperties(this.simpleHttp).subscribe({
            next(remoteProperties) { component.remoteProperties = remoteProperties }
        });
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
        this.pageNumber = 1;
        this.helper.showLoading();
        this.catalog.getCategoryProducts(this.categoryId, this.pageNumber || 1, this.filterQueryString)
            .subscribe((result) => {
                this.result = result;
                AnalyticsHelper.logEvent("VisitCategory", { id: this.categoryId, name: result.Name });
                this.pageNumber += 1;
                this.helper.hideLoading();
            }, () => {
                this.helper.hideLoading();
            });
    }

    appendProductsData(pageNumber) {
        let observer = this.catalog.getCategoryProducts(this.categoryId, pageNumber, this.filterQueryString);
        observer
            .subscribe((result: any) => {
                for (let i = 0; i < result['Products'].length; i++) {
                    this.result.Products.push(result['Products'][i]);
                }
                this.pageNumber += 1;
            });

        return observer;
    }

    presentFilter() {
        let defaultProperties: FilterInterface = {
            PriceRange: {
                lower: this.result['PriceRange'].From == '0.0' ? 0 : this.result['PriceRange'].From,
                upper: this.result['PriceRange'].To == '0.0' ? 10 : this.result['PriceRange'].To
            },
            FilterItems: this.result['FilterItems']
        };

        let modal = this.modalCtrl.create(ProductFilterComponent, {
            defaultProperties: defaultProperties,
            filterProperties: this.filterProperties
        });
        modal.present();

        modal.onWillDismiss((data: FilterInterface) => {
            if (data) {
                this.filterProperties = data;
                this.convertFilterPropertiesToQueryString();
                this.fetchPageData();
            }
        });
    }

    convertFilterPropertiesToQueryString() {
        this.filterQueryString = '';

        if (this.filterProperties) {
            this.filterQueryString = this.filterProperties.PriceRange ?
                '&price=' + this.filterProperties.PriceRange.lower +
                '-' + this.filterProperties.PriceRange.upper : '';

            if (this.sortBy) {
                this.filterQueryString += '&orderby=' + this.sortBy;
            }

            if (this.filterProperties.FilterItems) {
                let index = 0;
                this.filterProperties.FilterItems.forEach((item) => {
                    if (item.Value) {
                        ++index;
                        this.filterQueryString += index == 0 ? '&specs=' + item.Value : ',' + item.Value;
                    }
                });
            }
        }
    }

    onSortByChange(id) {
        this.convertFilterPropertiesToQueryString();
        this.fetchPageData();
    }

    onProductSelected(product) {
        if (product) {
            let paramObj = { productId: product.Id };
            this.navCtrl.push(ProductDetailsComponent, paramObj);
        }
    }

    doInfinite(infiniteScroll) {
        return this.appendProductsData(this.pageNumber).subscribe(() => {
            infiniteScroll.complete();
        });
    }
}
