import { Component, Input, Output, EventEmitter } from '@angular/core';

/**
 * Generated class for the SignoutComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
    selector: 'app-quantity-btn',
    templateUrl: 'quantity-btn.html'
})
export class QuantityBtnComponent {
    private _qty: number;
    @Input() minimum: number = 1;
    @Input() maximum: number = 1000000;
    @Input() canEdit: boolean = true;

    @Output() quantityChange = new EventEmitter();

    constructor() {
    }

    @Input()
    get quantity(): number {
        // transform value for display
        return this._qty;
    }

    set quantity(qty: number) {
        this._qty = qty;
    }

    onQuantityChange(qty) {
        let curQty = this.quantity;
        curQty += qty;

        if (curQty < 0 || curQty < this.minimum)
            curQty = this.minimum;

        if (curQty > this.maximum)
            curQty = this.maximum;

        this.quantity = curQty;
        this.quantityChange.emit(this.quantity);
    }
}