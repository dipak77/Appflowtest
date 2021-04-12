import { Component } from '@angular/core'; 
import { NavController, NavParams } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';

import { Login } from '../login/login';
import { AuthenticationService } from '../../providers/security/auth.service';
import { HelperService } from '../../core/services/helper.service';

/**
 * Generated class for the SignoutComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'forgot-password',
  templateUrl: 'forgot-password.html'
})
export class ForgotPasswordComponent {
    private username: string;
    
    constructor(public navCtrl: NavController,
        public navParams: NavParams,        
        public helper: HelperService,
        public translate: TranslateService,
        private authenticate: AuthenticationService) {
    }

    /**
     * Reset Password
     */
    public doResetPassword(): void {        
        if (this.username) {
            this.helper.showLoading();            

            this.authenticate.resetPassword(this.username)
                .subscribe((res) => {
                    this.translate.get('FORGOTPASSWORDPAGE.PasswordResetSuccessfully').subscribe((val) => {
                        this.helper.hideLoading();
                        this.helper.showToast(val, 'success', {duration: 30000});    
                        
                        if(this.navCtrl.canGoBack())
                        this.navCtrl.pop();
                        else
                            this.navCtrl.push(Login);               
                    });
                },
                () => {                    
                    this.helper.hideLoading();
                });
        }
    }   
}
