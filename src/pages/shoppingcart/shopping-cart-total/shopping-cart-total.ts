import { Component, Input } from '@angular/core';

/**
 * Generated class for the ShoppingCartTotalComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
    selector: 'shopping-cart-total',
    templateUrl: 'shopping-cart-total.html'
})
export class ShoppingCartTotalComponent {

    @Input() RequiresShipping: boolean = false;
    @Input() Shipping: number = 0;
    @Input() OrderTotal: number = 0;
    @Input() Tax: number = 0;
    @Input() SubTotal: number = 0;
    @Input() OrderTotalDiscount: any = undefined;
    @Input() SubTotalDiscount: any = undefined;

    @Input() totalProperties: any = {};

    constructor() {
    }
}
