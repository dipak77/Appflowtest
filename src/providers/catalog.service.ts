import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { HelperService } from '../core/services/helper.service';
import { SimpleHttp } from '../core/services/simple-http.service';
import { config } from '../app/app.config';

@Injectable()
export class CatalogService {

    constructor(
        public  helper: HelperService,
        private http: SimpleHttp) {
    }

    getCategories() {
        let url = config.applicationBaseUrl + '/homepagecategories';
        if (config.developmentMode)
            url = 'assets/data/categories.json';

        return this.http.doGet(url);
    }

    getCategoryProducts(categoryId, pageNumber: number = 1, filter: string = '') {
        let url = config.applicationBaseUrl + '/Category/' + categoryId + '?pagenumber=' + pageNumber + filter;
        if (config.developmentMode)
            url = 'assets/data/products.json';

        return this.http.doGet(url);
    }

    getProductDetails(productId) {
        let url = config.applicationBaseUrl + '/productdetails/' + productId;
        if (config.developmentMode)
            url = 'assets/data/product.json';

        return this.http.doGet(url);
    }

    getRelatedProducts(productId) {
        return this.http.doGet(config.applicationBaseUrl + '/relatedproducts/' + productId);
    }

    search(searchTxt) {
        return this.http.doPost(config.applicationBaseUrl + '/catalog/search', { "q": searchTxt });
    }

    getHomePageBanner() {
      let observers = [];
      observers.push(this.http.doGet(config.crmBaseUrl + '/JCI/GetStoreHeaderBanners/?language=english', this.http.crmHttpOptions));
      observers.push(this.http.doGet(config.crmBaseUrl + '/JCI/GetStoreHeaderBanners/?language=arabic', this.http.crmHttpOptions));

      return Observable.create((observer) => {
        Observable.forkJoin(observers).subscribe(([engList, arabList]) => {
          observer.next({
            DataAr: arabList,
            DataEn: engList
          });
          observer.complete();
        }, (err) => {
          observer.error(err);
        });     
      });      
    }
}
