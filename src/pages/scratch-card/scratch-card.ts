import { Component, Input } from '@angular/core';
import { NavController, NavParams, Events, ViewController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { ScratchCard, SCRATCH_TYPE } from 'scratchcard-js';
import { HttpClient } from '@angular/common/http';
import { config } from "../../app/app.config";
import { forkJoin, Observable } from 'rxjs';
import { CustomerService } from '../../providers/customer.service';
import { HelperService, getAmount, AnalyticsHelper } from '../../core/services/helper.service';

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

  // Get the modal

// Get the button that opens the modal
 btn = document.getElementById("myBtn");

// Get the <span> element that closes the modal
 span = document.getElementsByClassName("close")[0];
 
// When the user clicks on the button, open the modal
 

// When the user clicks on <span> (x), close the modal


// When the user clicks anywhere outside of the modal, close it

  // isDrawing;
  //   lastPoint;
  //   canvasWidth;
  //   canvasHeight;
  //   ctx;
  //   image = new Image();
  //   brush;
  //   container = document.getElementById('js-container');
  //   canvas :HTMLCanvasElement;
  // scratchCard : ScratchCard;
  constructor(public navCtrl: NavController,
    public viewCtrl: ViewController,
    public navParams: NavParams,
    private custService: CustomerService,
    private events: Events,
    public http: HttpClient,
    private helper: HelperService,
    public translate: TranslateService) {
    this.data = navParams.get("data");
    this.order_id = navParams.get("orderId");
   


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

  confirmBrand(brand_code){

    let randomString = this.makeid(6);
    let sendData = {
      "reference_id": randomString,
      "order_id":"15598",
      "delivery_type": 0,
      "brand_code": brand_code,
      "notify": 1,
      "currency": "SAR",
      "amount": this.cardValue,
      "country": "SA",
      "receiver_name" : "Vikram Sutar",
      "receiver_email" : "vikram.suthar@microexcel.com",
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
      });

    this.http.post(corsAnywhere+config.applicationBaseUrl + '/order/orderforgiftcard', sendData);
    console.log(sendData);
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