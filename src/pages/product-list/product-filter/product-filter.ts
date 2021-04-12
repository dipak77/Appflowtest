import { Component } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';

export interface FilterInterface {
    PriceRange?: {
        lower?: number;
        upper?: number;
    },
    FilterItems?: {
        SpecificationAttributeName?: string;
        Value?: string;
        SpecificationAttributeOptions?: {
            SpecificationAttributeOptionName?: string;
            FilterId?: string;
            Selected?: boolean
        }[]
    }[]
}

@Component({
    selector: 'product-filter',
    templateUrl: 'product-filter.html'
})
export class ProductFilterComponent {

    defaultProperties: FilterInterface;
    filterProperties: FilterInterface;

    constructor(public navParams: NavParams,
        public viewCtrl: ViewController) {
        
        this.defaultProperties = this.navParams.data['defaultProperties'];
        this.filterProperties = this.navParams.data['filterProperties'];

        if (!this.filterProperties.PriceRange) {
            this.filterProperties = JSON.parse(JSON.stringify(this.defaultProperties));
        }
    }

    resetFilters() {
        this.filterProperties = JSON.parse(JSON.stringify(this.defaultProperties));
    }

    applyFilters() {
        this.dismiss(this.filterProperties);
    }

    dismiss(data?: any) {
        // using the injected ViewController this page
        // can "dismiss" itself and pass back data
        this.viewCtrl.dismiss(data);
    }
}
