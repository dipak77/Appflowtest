import { Component, Input, OnChanges, ViewChild} from '@angular/core';
import { NavController } from 'ionic-angular';
import { CatalogService } from '../../../providers/catalog.service';
import { Slides } from 'ionic-angular';
import { ProductDetailsComponent } from '../../product-details/product-details';

@Component({
    selector: 'related-products',
    templateUrl: 'related-products.html'
})

export class RelatedProductsComponent implements OnChanges  {
    @ViewChild(Slides) slides: Slides;

    @Input() productId: string;
    
    isLoading: boolean = false;
    products: Array<any> = [];

    currentIndex: number = 0;
    totalSlidesCount: number = 0;    

    constructor(public navCtrl: NavController,
        private catalog: CatalogService) {
    }

    ngOnChanges(changes: any) {
        if(changes['productId'].currentValue)
          this.fetchPageData();
    }

    fetchPageData() {
        this.isLoading = true;
        this.catalog.getRelatedProducts(this.productId).subscribe((result) => {
            this.products = result['Data'] || [];
            
            this.currentIndex = 0;
            this.totalSlidesCount = (Math.ceil( this.products.length / 2)) || 0;
            this.isLoading = false;
        }, () => {
            this.isLoading = false;
        });
    } 

    onClickSliderButton(index) {
        let ind = this.currentIndex + index;
        if (ind < 0)
            ind = 0;

        this.slides.slideTo(ind);
    }

    onSlideDrag(index, slider) {
        this.currentIndex += index;
        
        if (this.currentIndex < 0)
            this.currentIndex = 0;

        if (this.currentIndex >= this.totalSlidesCount)
            this.currentIndex = this.totalSlidesCount-1;
    }

    onProductSelected(product) {
        if (product) {
            this.navCtrl.push(ProductDetailsComponent, {productId: product.Id});
        }
    }
}
