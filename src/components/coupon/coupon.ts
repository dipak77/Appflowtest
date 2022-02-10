import { SimpleHttp } from './../../core/services/simple-http.service';
import { Component, Output, Input, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { CartService } from '../../providers/cart.service';
import { HelperService, AnalyticsHelper } from '../../core/services/helper.service';
import { TranslateService } from '@ngx-translate/core';
import { ValueTransformer } from '@angular/compiler/src/util';
// import * as bankData from './PromoCodeReusableDetails.json';
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
    showError: boolean = false;
    card: string = '';
    showcardInput: boolean = false;
    promoCodes = [];
    bankName="";
    errorMessage = "";
    bankData= "";
    minCardNumber:number = 6;
    placeHolder = "";
    @Input() couponInfo: any = {};
    @Input() cardInfo: any = {};
    @Input() extraTaken: boolean ;
    @Output() actionHandler: EventEmitter<any> = new EventEmitter();

    constructor(public translate: TranslateService,
        private cart: CartService,
        private helper: HelperService,
        private cdRef: ChangeDetectorRef,
        private SimpleHttp:  SimpleHttp,
        ) {
           
        this.cart.getNCBCodeList().subscribe((res)=>{
            this.bankData = res;
            Object.entries(res).forEach(element => {
                this.promoCodes = [...this.promoCodes, ...element[1]['PromoCode']];
                });
        });
        
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
        this.cart.applyDiscountCoupon(this.coupon.toUpperCase(),cardnum, this.bankName)
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
        //if(this.coupon.toUpperCase()=="NCB21")
        if(this.promoCodes.includes(this.coupon.toUpperCase()))
        {   
            debugger
            Object.entries(this.bankData).forEach(element => {
                let checkCoupon = false;
                let promocodes = element[1]['PromoCode'];
                promocodes.forEach(el => {
                    if(el == this.coupon){
                        checkCoupon = true;
                        return null;
                    }
                });
                if(checkCoupon){
                    if(this.translate.store.currentLang == "ar"){
                        this.placeHolder = element[1]['Validate']['ErrorMessage'][3];
                    }else{
                        this.placeHolder = element[1]['Validate']['ErrorMessage'][2];
                    }
                    return null;
                }
            });

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
        let seriesNumber = [];
        let max:number;
        let min:number;
        Object.entries(this.bankData).forEach(element => {
            let checkCoupon = false;
            let promocodes = element[1]['PromoCode'];
            promocodes.forEach(el => {
                if(el == this.coupon){
                    checkCoupon = true;
                    return null;
                }
            });
            if(checkCoupon){
                this.bankName = element[0].toString();
                seriesNumber = [...element[1]['Validate']['startSeries']];
                max = element[1]['Validate']['Max'];
                min = element[1]['Validate']['Min'];
                if(this.translate.store.currentLang == "ar"){
                    this.errorMessage = element[1]['Validate']['ErrorMessage'][1];
                }else{
                    this.errorMessage = element[1]['Validate']['ErrorMessage'][0];
                }
                return null;
            }
        });
        //console.log("ValidatedCard");
        //console.log(value);
        if(value!=null && value!=undefined)
        {
            let seriescheck = false;
            seriesNumber.forEach(element => {
                let valueStr = String(value);
                if(parseInt(valueStr.substring(0,2)) == element){
                        seriescheck = true;
                }

            });
            

            if(String(value).length >= min && String(value).length <= max && seriescheck)
            {
                this.isValidCard=true;
                this.isCoupanEnter=true;
                this.showError=false;
                //console.log(this.isValidCard);
            }
            else
            {   
               
              if(String(value).length > min){
                this.showError=true;
                this.isValidCard = false;
                this.isCoupanEnter=false;
              }
              
            }
        }else{
            this.isValidCard = false;
            this.isCoupanEnter=false;
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
