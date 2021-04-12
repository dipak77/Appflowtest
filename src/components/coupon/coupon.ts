import { Component, Output, Input, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { CartService } from '../../providers/cart.service';
import { HelperService, AnalyticsHelper } from '../../core/services/helper.service';
import { TranslateService } from '@ngx-translate/core';
import { ValueTransformer } from '@angular/compiler/src/util';

/**
 * Generated class for the ShoppingCartTotalComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
    selector: 'coupon',
    templateUrl: 'coupon.html'
})
export class CouponComponent {

    coupon: string = '';
    showCouponInput: boolean = false;
    isValidCard: boolean = false;
    card: string = '';
    showcardInput: boolean = false;

    @Input() couponInfo: any = {};
    @Input() cardInfo: any = {};
    @Output() actionHandler: EventEmitter<any> = new EventEmitter();

    constructor(public translate: TranslateService,
        private cart: CartService,
        private helper: HelperService,
        private cdRef: ChangeDetectorRef) {
    }

    applyCoupon() {
        let loader = 'COUPON';
        this.helper.showLoading(loader);
        this.cart.applyDiscountCoupon(this.coupon.toUpperCase(),this.card.toString().substring(0,6))
            .subscribe((res) => {
                AnalyticsHelper.logEvent("Promocode", { coupon: this.coupon });
                this.helper.hideLoading(loader);
                console.log("coupan=> "+this.coupon);
                this.showCouponInput = false;
                this.card=undefined;
                this.showcardInput = false;
                this.translate.get('COUPON.CouponAppliedSuccessfully').subscribe((val) => {
                   
                    this.helper.showToast(val);
                    this.actionHandler.emit(res);
                });
            }, () => {
                this.helper.hideLoading(loader);
                this.actionHandler.emit(null);
            });
    }
    checkIsNCBPromocode(value){
        //manually launch change detection
        this.cdRef.detectChanges();
        console.log(value);
        this.coupon=this.coupon.toUpperCase();
        if(this.coupon.toUpperCase()=="NCB21")
        {
            this.card=undefined;
            this.showcardInput = true;
            console.log("NCB card flag=> "+this.showcardInput);
        }
        else
        { 
            this.showcardInput = false;
            this.card=undefined;
        }           
      }
    ValidatedCard(value){
        //manually launch change detection
        this.cdRef.detectChanges();
        console.log("ValidatedCard");
        console.log(value);
        debugger;
        if(value!=null && value!=undefined)
        {
            if(String(value).length > 6)
            {
                console.log("this.isValidCard=true;");
                this.isValidCard=true;
                console.log(this.isValidCard);
            }
            else
                this.isValidCard=true;
        }
      }

    removeCoupon(couponId) {
        let loader = 'REMOVECOUPON';
        this.helper.showLoading(loader);
        this.cart.removeDiscountCoupon(couponId)
            .subscribe((res) => {
                this.helper.hideLoading(loader);

                this.translate.get('COUPON.CouponDeletedSuccessfully').subscribe((val) => {
                    this.helper.showToast(val);
                    this.actionHandler.emit(res);
                });
            }, () => {
                this.helper.hideLoading(loader);
                this.actionHandler.emit(null);
            });
    }
}
