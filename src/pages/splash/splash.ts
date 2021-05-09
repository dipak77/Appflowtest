import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';

import { CartService } from '../../providers/cart.service';

@Component({
    selector: 'splash',
    templateUrl: 'splash.html'
})
export class SplashComponent {

    constructor(public viewCtrl: ViewController,
        public splashScreen: SplashScreen,
        private cart: CartService) {
    }

    ionViewDidEnter() {
        this.splashScreen.hide();

        let start = new Date().getTime();
        this.cart.getCartItems().subscribe(() => {
            let end = new Date().getTime();
            let timeDif = end - start;
            this.dismissViewCtrl(timeDif < 3000 ? (3000 - timeDif) : 10);
        }, () => {
            let end = new Date().getTime();
            let timeDif = end - start;
            this.dismissViewCtrl(timeDif < 3000 ? (3000 - timeDif) : 10);
        });
    }

    dismissViewCtrl(dismissTime = 10) {
        setTimeout(() => {
            this.viewCtrl.dismiss();
        }, dismissTime);
    }
}