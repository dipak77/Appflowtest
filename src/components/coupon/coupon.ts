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
    isCoupanEnter:  boolean = false;
    showCouponInput: boolean = false;
    isValidCard: boolean = false;
    card: string = '';
    showcardInput: boolean = false;

    @Input() couponInfo: any = {};
    @Input() cardInfo: any = {};
    @Input() extraTaken: boolean ;
    @Output() actionHandler: EventEmitter<any> = new EventEmitter();

    constructor(public translate: TranslateService,
        private cart: CartService,
        private helper: HelperService,
        private cdRef: ChangeDetectorRef) {
            
    }

    applyCoupon() {
        if(this.extraTaken){
            if(this.translate.store.currentLang=="en"){
                alert("Promo Code cannot be combined with Exchange & Stay Cool offer, to activate the Promo Code remove the offer.");
            }else{
                alert("لا يمكن جمع كود الخصم مع عرض بدّل وكيّف، للحصول على الخصم قم بإزالة العرض");
            }
            return;
        }
        let loader = 'COUPON';
        this.helper.showLoading(loader);
         
        let cardnum=this.card==null || this.card==undefined? "" : this.card.toString().substring(0,6);
        if(cardnum.length>6)
        {
            cardnum=cardnum.substring(0,6);
        }
        this.cart.applyDiscountCoupon(this.coupon.toUpperCase(),cardnum)
            .subscribe((res) => {
                AnalyticsHelper.logEvent("Promocode", { coupon: this.coupon });
                this.helper.hideLoading(loader);
                //console.log("coupan=> "+this.coupon);
                this.showCouponInput = false;
                this.card=undefined;
                this.showcardInput = false;
                console.log(res)
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
        //console.log(value);
         
        this.coupon=this.coupon.toUpperCase();
        if(this.coupon.toUpperCase()=="NCB21")
        {
            this.card=undefined;
            this.showcardInput = true;
            this.isCoupanEnter=false;
            //console.log("NCB card flag=> "+this.showcardInput);
        }
        else
        { 
            this.isCoupanEnter=true;
            this.showcardInput = false;
            this.card=undefined;
            this.isCoupanEnter=true;
        }           
      }
    ValidatedCard(value){
        //manually launch change detection
        this.cdRef.detectChanges();
        //console.log("ValidatedCard");
        //console.log(value);
         
        if(value!=null && value!=undefined)
        {
            if(String(value).length > 6)
            {
                //console.log("this.isValidCard=true;");
                this.isValidCard=true;
                this.isCoupanEnter=true;
                //console.log(this.isValidCard);
            }
            else
            {
                this.isValidCard=true;
            }
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
