import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ScratchCard, SCRATCH_TYPE } from 'scratchcard-js'
/**
 * Generated class for the ScratchCardPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-scratch-card',
  templateUrl: 'scratch-card.html',
})
export class ScratchCardPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    this.createNewScratchCard();
  }

  createNewScratchCard() {
    const scContainer = document.getElementById('js--sc--container')
    const sc = new ScratchCard('#js--sc--container', {
      scratchType: SCRATCH_TYPE.CIRCLE,
      containerWidth: 300,//scContainer.offsetWidth,
      containerHeight: 300,
      imageForwardSrc: 'https://york.com.sa/images/uploaded/media-center/congrats-en.png',
      //imageBackgroundSrc: './assets/images/scratchcard-background.svg',
      htmlBackground: '<div class="cardamountcss"><div class="won-amnt">30</div><div class="won-text">Points<br>Won!</div></div>',
      clearZoneRadius: 40,
      nPoints: 30,
      pointSize: 4,
      callback: () => {
        console.log('Now the window will reload !')
      }
    })
    // Init
    sc.init();
  }

}
