import { Component, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CustomerService } from '../../providers/customer.service';

/**
 * Generated class for the SuccessPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-success',
  templateUrl: 'success.html',
})
export class SuccessPage {
  
  @Input() order_id: any;
  private orderNumber : any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public translate: TranslateService,
    private custService: CustomerService) {
    this.order_id = navParams.get("orderId"); 
    this.custService.getCustomerOrderDetails(this.order_id).subscribe((result) => {

      this.orderNumber=result.CustomOrderNumber;
      

   
}, () => {
    // this.helper.hideLoading(loaderName);
});
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SuccessPage');
  }

}
