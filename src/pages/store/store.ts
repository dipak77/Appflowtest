import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Platform } from 'ionic-angular';
import { HelperService } from '../../core/services/helper.service';
import { ProductListComponent } from '../../pages/product-list/product-list';
import { getRemoteProperties } from '../../app/app.config';
import { SimpleHttp } from '../../core/services/simple-http.service';

import { CatalogService } from '../../providers/catalog.service';

@Component({
    selector: 'store',
    templateUrl: 'store.html'
})

export class StoreComponent {
    text: string;
    categories: any;
    isAndroid: boolean = false;
    isLoading: boolean = true;
    remoteProperties: any = {};
    
    constructor(
        platform: Platform,
        private navCtrl: NavController,
        private catalog: CatalogService,
        private simpleHttp: SimpleHttp,
        private helper: HelperService) {
        this.isAndroid = platform.is('android');
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
        this.helper.showLoading("Store/Categories");
        this.catalog.getCategories().subscribe((result: any) => {
            this.categories = result['Data'];
            this.helper.hideLoading("Store/Categories");
        }, () => {
            this.helper.hideLoading("Store/Categories");
        });
    }

    onItemSelected(category) {
        if (category) {
            let paramObj = { categoryId: category.Id };
            this.navCtrl.push(ProductListComponent, paramObj)
        }
    }
}