import { Component } from '@angular/core';
import { CatalogService } from '../../providers/catalog.service';
import { TranslateService } from '@ngx-translate/core';
import { Platform } from 'ionic-angular';

/**
 * Generated class for the BannerComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'app-banner',
  templateUrl: 'banner.html'
})
export class BannerComponent {

  banners: any = {};

  constructor(public platform: Platform,
    private catalog: CatalogService,
    public translate: TranslateService) {
    this.fetchComponentData();
  }
  
  fetchComponentData() {
    this.catalog.getHomePageBanner()
      .subscribe((res) => {
        this.banners = res;
      });
  }
}
