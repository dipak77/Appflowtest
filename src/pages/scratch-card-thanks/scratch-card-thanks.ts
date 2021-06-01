import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

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

  constructor(public navCtrl: NavController, public navParams: NavParams,public translate: TranslateService) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ScratchCardThanksPage');
  }

}
