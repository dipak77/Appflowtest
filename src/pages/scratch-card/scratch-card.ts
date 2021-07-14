import { ScratchCardThanksPage } from './../scratch-card-thanks/scratch-card-thanks';
import { Component, Input } from '@angular/core';
import { NavController, NavParams, Events, ViewController, ToastController  } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { ScratchCard, SCRATCH_TYPE } from 'scratchcard-js';
import { HttpClient } from '@angular/common/http';
import { config } from "../../app/app.config";
import { forkJoin, Observable } from 'rxjs';
import { CustomerService } from '../../providers/customer.service';
import { HelperService, getAmount, AnalyticsHelper } from '../../core/services/helper.service';
import { AuthenticationService } from '../../providers/security/auth.service';
import locationTranslations from '../location/location.translations';
// import { Router } from '@angular/router';
import { SimpleHttp } from '../../core/services/simple-http.service';

declare var  ScratchCard ;  
declare var  SCRATCH_TYPE ;

// const corsAnywhere = "https://cors-anywhere-eabz.herokuapp.com/";

@Component({
  selector: 'page-scratch-card',
  templateUrl: 'scratch-card.html',
})
export class ScratchCardPage {
  
  @Input() order_id: any;
  data: any;
  brandList : any = [];
  cardValue :any;
  user: any;
  userEmail : any;
  userPhone : any;
  userFirstName : any;
  userLastName : any;
  orderNumber : any;
  inprogress :boolean = false;
  congratsImg = 'https://york.com.sa/images/uploaded/media-center/congrats-en.png';
  isSplit : any;
  // loading = 'scratch_card';

  constructor(public navCtrl: NavController,
    public viewCtrl: ViewController,
    public navParams: NavParams,
    private custService: CustomerService,
    private events: Events,
    public http: SimpleHttp,
    private helper: HelperService,
    private auth: AuthenticationService,
    public translate: TranslateService, public toastController: ToastController) {
    //  this.helper.showLoading(this.loading);
      this.data = navParams.get("data");
      this.order_id = navParams.get("orderId");   
     // if (this.auth.isAuthenticated()) {
        
        this.custService.getCustomerOrderDetails(this.order_id).subscribe((result) => {

            this.orderNumber=result.CustomOrderNumber;
            this.userEmail = result.BillingAddress.Email;
            this.userFirstName = result.BillingAddress.FirstName;
            this.userLastName = result.BillingAddress.LastName;
            this.userPhone = result.BillingAddress.PhoneNumber;

         
      }, () => {
          // this.helper.hideLoading(loaderName);
      });
      if(this.translate.store.currentLang == "ar"){
        this.congratsImg = 'https://york.com.sa/images/uploaded/media-center/congrats-ar.png';
      }

        // this.custService.getCustomerOrderDetails(this.order_id).subscribe((res:any)=>{
        //   //process the json data
        //      // this.brandList = data;
        //         // this.userEmail = res.Email;
        //         // this.userFirstName = res.FirstName;
        //         // this.userPhone = res.Phone;
        //         console.log(res);
        //   });
    //}

    

  }

  
  ionViewDidLoad() {
      ////console.log(this.order_id);
      
      //this.getScratchCardValue();
      this.http.doGet(config.applicationBaseUrl+'/order/getbrandslist/'+this.order_id).subscribe((res:any)=>{
        //process the json data
            //this.brandList = data;
            
            // this.isSplit = res.isSlitCategory;
            this.brandList = res.GiftBranding;
            this.cardValue = res.gift_value;
            console.log(res);
            if(this.brandList != null){
              this.isSplit = true;
                document.getElementById('scractch_card_div').style.display = "block";
                document.getElementById('home_div').style.display = "none";
                document.getElementById('brandListHeading').style.display = "block";
                this.getScratchCard();
            }else{
              this.isSplit = true;
              document.getElementById('scractch_card_div').style.display = "none";
              document.getElementById('home_div').style.display = "block";
              document.getElementById('brandListHeading').style.display = "none";


            }
        // this.helper.hideLoading(this.loading);

        });
      
  }  

  getScratchCard(){
    var _this = this;
    let imagePath = 'assets/scratch-card.png';
    var html = '<div class="test">' + '' + '<br><br><br><strong>SAR ' +  this.cardValue + '</strong></div>';

    // window.addEventListener('load', function ()
    if(this.translate.store.currentLang == "ar"){
        var html = '<div class="test">' + '' + '<br><br><br><strong> ريال' +  this.cardValue + ' </strong></div>';
        imagePath = 'assets/scratch-card-ar.png';
    }else{
    }
    if(this.isSplit){
      var scContainer = document.getElementById('js--sc--container');
      var sc = new ScratchCard('#js--sc--container', {
        enabledPercentUpdate: true,
        scratchType: SCRATCH_TYPE.CIRCLE,
        // brushSrc: './images/brush.png',
        containerWidth: scContainer.offsetWidth,
        containerHeight: scContainer.offsetHeight,
        imageForwardSrc: imagePath,
        // imageBackgroundSrc: 'assets/GiftBackground.png',
        htmlBackground: html,
        clearZoneRadius: 25,
        percentToFinish: 25, // When the percent exceeds 50 on touchend event the callback will be exec.
        nPoints: 30,
        pointSize: 20,
        callback: function () {
          _this.events.publish('cardScratched', _this.data);
          //console.log("Card is scratched");
          document.getElementById('brandListGrid').classList.remove('hide');
          //_this.close();
        }
      })
      sc.init();
    }
   
  }

  openModal(id) {
    let modal = document.getElementById("modal_"+id);
    modal.style.display = "block";
  }
  closeModal(id){
    let modal = document.getElementById("modal_"+id);
    modal.style.display = "none";
    //console.log('modalClosed');

  }

  async presentToast(message) {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000
    });
    toast.present();
  }

  confirmBrand(brand_code){
    
    let randomString = this.makeid(6);
    if(this.userEmail == undefined || this.userPhone == undefined){
      this.presentToast('Update Your Mobile Number and email to recieve gift card.');
      return false;
    }
    if(this.userPhone.substring(0,2) == "05"){
        this.userPhone = this.userPhone.substring(1);
        this.userPhone = "00966"+this.userPhone;
        console.log(this.userPhone);
    }
    let sendData = {
      "reference_id": randomString,
      "order_id":"15598",
      "delivery_type": 0,
      "brand_code": brand_code,
      "notify": 1,
      "currency": "SAR",
      "amount": this.cardValue,
      "country": "SA",
      "receiver_name" : this.userFirstName+' '+this.userLastName,
      "receiver_email" : this.userEmail,
      "receiver_phone" : this.userPhone,
      "message": "Well Done!,\nI thought you would like this gift!",
      "extra_fields" : {
          "department" : "Information Technology",
          "custuomer_id" : "A1232",
          "pi_12" : "12Ag"
      }
    };
    if(this.translate.store.currentLang == "ar"){

          document.getElementById('confirm_btn').innerHTML="الرجاء الإنتظار";

    }else{

        document.getElementById('confirm_btn').innerHTML="Please Wait..";

    }
    if(!this.inprogress){
      this.helper.showLoading('scratchCard');
        this.http.post(corsAnywhere+config.applicationBaseUrl + '/order/orderforgiftcard', sendData).subscribe(data=>{
          //process the json data
              //this.brandList = data;
                this.inprogress = false;
                //console.log('return response', data);
                this.presentToast('Gift Card sent to your email and phone number.');
                this.helper.hideLoading('scratchCard');

                this.navCtrl.push(ScratchCardThanksPage);

          });
    }

    this.inprogress = true;

    

      //console.log(sendData);

    // this.http.post(corsAnywhere+config.applicationBaseUrl + '/order/orderforgiftcard', sendData);
    ////console.log(sendData);
  }

  makeid(length) {
    var result           = [];
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result.push(characters.charAt(Math.floor(Math.random() * 
 charactersLength)));
   }
   return result.join('');
}
  // getScratchCardValue(){
  //   let details = [];
  //   // details.push(this.custService.getCustomerOrderDetails('15598));
  //   let loaderName = "CHEKOUT.CREATEORDER";
  //   this.helper.showLoading(loaderName);

  //   this.custService.getCustomerOrderDetails(this.order_id).subscribe((orderDetails: any) => {
  //     this.helper.hideLoading(loaderName);
  //     //console.log(orderDetails);
  //   }, () => {  
  //   });

  //   console.log('order details here');
  //   console.log(details);
  // }
  
}