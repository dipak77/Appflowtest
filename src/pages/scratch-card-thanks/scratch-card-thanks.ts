import { HomePage } from './../home/home';
import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HelperService } from '../../core/services/helper.service';

/**
 * Generated class for the ScratchCardThanksPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-scratch-card-thanks',
  templateUrl: 'scratch-card-thanks.html',
})
export class ScratchCardThanksPage {

  loading = 'scratch_card';

  constructor(public navCtrl: NavController, private helper: HelperService, public navParams: NavParams,public translate: TranslateService) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ScratchCardThanksPage');
  }

  navigateHomePage() {
    this.helper.showLoading(this.loading);
    this.helper.hideLoading(this.loading);
    this.navCtrl.push(HomePage);
  }

}
