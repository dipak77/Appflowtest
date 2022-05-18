import { Component, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HelperService } from '../../core/services/helper.service';
import { CustomerService } from '../../providers/customer.service';
import { HomePage } from '../home/home';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

/**
 * Generated class for the PaytabsSuccessPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-paytabs-success',
  templateUrl: 'paytabs-success.html',
})
export class PaytabsSuccessPage {

  loading = 'success_page';
  rajhiBank = '';
  SNBurl = '';
  Riyadurl = '';
  @Input() order_id: any;
  private orderNumber : any;
  constructor(public navCtrl: NavController, private helper: HelperService,

              public navParams: NavParams, public translate: TranslateService,
    private custService: CustomerService, private inAppBrowser: InAppBrowser ) {
    this.order_id = navParams.get("orderId"); 
    if(this.translate.store.currentLang == "ar"){
      this.rajhiBank = 'https://www.alrajhibank.com.sa/ar/personal/accounts-and-cards/credit-card-offers/tasaheal-program';
      this.SNBurl = 'https://www.alahli.com/ar-sa/personal-banking/credit-cards/Pages/Smart-Payment-Plan.aspx';
      this.Riyadurl = 'https://www.riyadbank.com/ar/personal-banking/credit-cards/qasset-installment-offers';
    }else{
      this.rajhiBank = 'https://www.alrajhibank.com.sa/en/personal/accounts-and-cards/credit-card-offers/tasaheal-program';
      this.SNBurl = 'https://www.alahli.com/en-us/personal-banking/credit-cards/Pages/Smart-Payment-Plan.aspx';
      this.Riyadurl = 'https://www.riyadbank.com/en/personal-banking/credit-cards/qasset-installment-offers';
    }

    this.custService.getCustomerOrderDetails(this.order_id).subscribe((result) => {

      this.orderNumber=result.CustomOrderNumber;
      

   
}, () => {
    // this.helper.hideLoading(loaderName);
});
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SuccessPage');
  }

  navigateHomePage() {
    this.helper.showLoading(this.loading);
    this.helper.hideLoading(this.loading);
    this.navCtrl.push(HomePage);
  }

  rajhiRedirect() {
        this.helper.showLoading(this.loading);
        this.inAppBrowser.create(this.rajhiBank, '_blank', 'location=yes');
        this.helper.hideLoading(this.loading);    
   }
   snbRedirect(){
        this.helper.showLoading(this.loading);
        this.inAppBrowser.create(this.SNBurl, '_blank', 'location=yes');
        this.helper.hideLoading(this.loading); 
   }
   riyadRedirect(){
        this.helper.showLoading(this.loading);
        this.inAppBrowser.create(this.Riyadurl, '_blank', 'location=yes');
        this.helper.hideLoading(this.loading); 
   }

}
