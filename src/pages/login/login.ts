import { Component } from '@angular/core'; 
import { NavController, NavParams } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';

import { HomePage } from '../home/home';
import { ForgotPasswordComponent } from '../forgot-password/forgot-password';
import { AuthenticationService } from '../../providers/security/auth.service';
import { HelperService, AnalyticsHelper } from '../../core/services/helper.service';

import { CartService } from '../../providers/cart.service';
import { WishService } from '../../providers/wish.service';

import { forkJoin } from 'rxjs/observable/forkJoin';

/**
 * Generated class for the SignoutComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'login',
  templateUrl: 'login.html'
})
export class Login {
    private user: any = {};
    /**
     * Constructor.
     * 
     * @param navCtrl Navigation controller.
     * @param navParams Navigation params.
     * @param authenticateProvider Authenticate provider.
     */
    constructor(public navCtrl: NavController,
        public navParams: NavParams,
        public authenticate: AuthenticationService,
        public helper: HelperService,
        public translate: TranslateService,
        private cart: CartService,
        private wish: WishService) {
    }

    /**
     * Call authenticator.
     */
    public login(): void {        
        if (this.user.username && this.user.password) {
            this.helper.showLoading();            

            this.authenticate.doLogin(this.user.username, this.user.password)
                .subscribe((res) => {
                    if (this.authenticate.isAuthenticated()) {
                        this.translate.get('LOGINPAGE.LoginSucceeded').subscribe((val) => {
                            AnalyticsHelper.logEvent("Login", { user: this.user.username });
                            this.helper.showToast(val);
                            window.localStorage.setItem("skip-splash", "login");
                            window.location.hash = "#/home";
                            window.location.reload();
                        });
                    } else {
                        this.helper.hideLoading();
                    }
                },
                () => {                    
                    this.helper.hideLoading();
                });
        }
    }

    updateCartAndWishItems() {

        this.translate.get('LOGINPAGE.UpdatingCartAndWishItems').subscribe((val) => {

            let loadingKey = 'LOGINPAGE.UpdateItems';
            this.helper.showLoading(loadingKey, val);

            let observableBatch = [];
            observableBatch.push(this.cart.getCartItems(true));
            observableBatch.push(this.wish.getWishItems(true));

            forkJoin(observableBatch).subscribe(() => {

                this.helper.hideLoading(loadingKey);

                if (this.navCtrl.canGoBack())
                    this.navCtrl.pop();
                else
                    this.navCtrl.setRoot(HomePage);
            }, () => {
                this.helper.hideLoading(loadingKey);
            });
        });

        return;
    }

    onClickForgotPassword(){
        this.navCtrl.push(ForgotPasswordComponent);
    }
}