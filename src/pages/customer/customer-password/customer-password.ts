import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NavController } from 'ionic-angular';

import { AuthenticationService } from '../../../providers/security/auth.service';
import { HelperService } from '../../../core/services/helper.service';

/**
 * Generated class for the CustomerPasswordComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
    selector: 'customer-password',
    templateUrl: 'customer-password.html'
})
export class CustomerPasswordComponent {

    oldPassword: string;
    newPassword: string;
    confirmPassword: string;

    constructor(
        public navCtrl: NavController,
        private translate: TranslateService,
        private auth: AuthenticationService,
        private helper: HelperService) {
    }

    ionViewWillEnter() {
        this.helper.dismissAllLoaders().then(() => {});
    }

    onClickChangePassword() {
        let loaderName = "CHANGEPASSWORD"
        this.helper.showLoading(loaderName);

        this.auth.changePassword(this.oldPassword,
            this.newPassword,
            this.confirmPassword)
            .subscribe((res) => {
                this.helper.hideLoading(loaderName);

                if (res) {
                    this.translate.get("CUSTOMERPASS.ChangeSuccessfully").subscribe((val) => {
                        this.helper.showToast(val);
                    });
                } else {
                    this.translate.get("CUSTOMERPASS.ChangeFailed").subscribe((val) => {
                        this.helper.showToast(val, 'danger');
                    });
                }
            }, () => {
                this.helper.hideLoading(loaderName);
            });
    }
}
