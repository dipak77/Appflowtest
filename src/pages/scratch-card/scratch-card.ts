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


declare var  ScratchCard ;  
declare var  SCRATCH_TYPE ;

const corsAnywhere = "https://cors-anywhere-eabz.herokuapp.com/";

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
  userPhone : any = '+918698108190';
  userFirstName : any;
  userLastName : any;
 
  constructor(public navCtrl: NavController,
    public viewCtrl: ViewController,
    public navParams: NavParams,
    private custService: CustomerService,
    private events: Events,
    public http: HttpClient,
    private helper: HelperService,
    private auth: AuthenticationService,
    public translate: TranslateService, public toastController: ToastController) {
      if (this.auth.isAuthenticated()) {
      
        this.custService.getCustomerInfo().subscribe((res:any)=>{
          //process the json data
              //this.brandList = data;
                this.userEmail = res.Email;
                this.userFirstName = res.FirstName;
                //this.userPhone = res.Phone;
                console.log(res);
          });
    }

    this.data = navParams.get("data");
    this.order_id = navParams.get("orderId");
    console.log(this.userEmail);
    

  }

  
  ionViewDidLoad() {
      console.log(this.order_id);
      
      //this.getScratchCardValue();
      this.http.get(corsAnywhere+config.applicationBaseUrl+'/order/getbrandslist/'+this.order_id).subscribe((res:any)=>{
        //process the json data
            //this.brandList = data;
            console.log(res);
            this.brandList = res.GiftBranding;
            this.cardValue = res.gift_value;
            console.log(this.cardValue);
            this.getScratchCard();
        });
      
  }  

  getScratchCard(){
    var _this = this;
    // window.addEventListener('load', function ()
    var html = '<div class="test">' + '' + '<br><br><br>(Gift Value : <strong>SAR' +  this.cardValue + ')</strong></div>'
    var scContainer = document.getElementById('js--sc--container');
    var sc = new ScratchCard('#js--sc--container', {
      enabledPercentUpdate: true,
      scratchType: SCRATCH_TYPE.CIRCLE,
      // brushSrc: './images/brush.png',
      containerWidth: scContainer.offsetWidth,
      containerHeight: scContainer.offsetHeight,
      imageForwardSrc: 'assets/scratch-card.png',
      // imageBackgroundSrc: 'assets/GiftBackground.png',
      htmlBackground: html,
      clearZoneRadius: 25,
      percentToFinish: 25, // When the percent exceeds 50 on touchend event the callback will be exec.
      nPoints: 30,
      pointSize: 20,
      callback: function () {
        _this.events.publish('cardScratched', _this.data);
        console.log("Card is scratched");
        document.getElementById('brandListGrid').classList.remove('hide');
        //_this.close();
      }
    })
    sc.init();
  }

  openModal(id) {
    let modal = document.getElementById("modal_"+id);
    modal.style.display = "block";
  }
  closeModal(id){
    let modal = document.getElementById("modal_"+id);
    modal.style.display = "none";
    console.log('modalClosed');

  }

  async presentToast(message) {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000
    });
    toast.present();
  }

  confirmBrand(brand_code, email1, name1, phone1){
    
    let randomString = this.makeid(6);
    if(this.userEmail == undefined || this.userPhone == undefined){
      this.presentToast('Update Your Mobile Number and email to recieve gift card.');
      return false;
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
      "receiver_name" : this.userFirstName,
      "receiver_email" : this.userEmail,
      "receiver_phone" : "+918698108190",
      "message": "Well Done!,\nI thought you would like this gift!",
      "extra_fields" : {
          "department" : "Information Technology",
          "custuomer_id" : "A1232",
          "pi_12" : "12Ag"
      }
    };

    this.http.post(corsAnywhere+config.applicationBaseUrl + '/order/orderforgiftcard', sendData).subscribe(data=>{
      //process the json data
          //this.brandList = data;
            console.log('return response', data);
            this.presentToast('Gift Card sent to your email and phone number.');
            location.href = '/';
      });

      console.log(sendData);

    // this.http.post(corsAnywhere+config.applicationBaseUrl + '/order/orderforgiftcard', sendData);
    //console.log(sendData);
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
  //     console.log(orderDetails);
  //   }, () => {  
  //   });

  //   console.log('order details here');
  //   console.log(details);
  // }
  
}