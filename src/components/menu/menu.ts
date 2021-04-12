import { Component, ViewChild } from '@angular/core';

import { HomePage } from '../../pages/home/home';
import { MywishlistComponent } from '../../pages/mywishlist/mywishlist';
import { ShoppingcartComponent } from '../../pages/shoppingcart/shoppingcart';
import { HelpAndSupport } from '../../pages/help-and-support/help-and-support';
import { Login } from '../../pages/login/login';
import { Nav } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';

import { AuthenticationService } from '../../providers/security/auth.service';
import { HelperService } from '../../core/services/helper.service';

import { CustomerInfoComponent } from '../../pages/customer/customer-info/customer-info';
import { CustomerRegisterComponent } from '../../pages/customer/customer-register/customer-register';
import { CustomerPasswordComponent } from '../../pages/customer/customer-password/customer-password';
import { ServiceRequestComponent } from '../../pages/our-services/service-request/service-request';
import { TrackingComponent } from '../../pages/tracking/tracking';

interface MenuItem {
    title?: string;
    component?: any;
    icon?: string;
    cssClass?: any;
    hasDivider?: boolean;
    requiresLogin?: boolean;
    isRoot?: boolean;
    isLogin?: boolean;
    isLogout?: boolean;
    isRegister?: boolean;
    url?: string;
}

/**
 * Generated class for the MenuComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
    selector: 'app-menu',
    templateUrl: 'menu.html'
})

export class MenuComponent {

    @ViewChild(Nav) nav: Nav;
    rootPage: any = HomePage;

    pages: Array<MenuItem>;
    customerPage: MenuItem;

    constructor(public translate: TranslateService,
        public auth: AuthenticationService,
        public helper: HelperService) {

        this.customerPage = { component: CustomerInfoComponent };

        this.pages = [
            { title: 'MENU.NAVIGATION.Home', component: HomePage, icon: undefined, cssClass: 'items', hasDivider: false, isRoot: true },
            { title: 'MENU.NAVIGATION.ServiceRequest', component: ServiceRequestComponent, icon: undefined, cssClass: 'items', hasDivider: false },
            { title: 'MENU.NAVIGATION.Shopping Cart', component: ShoppingcartComponent, icon: undefined, cssClass: 'items', hasDivider: false },
            { title: 'MENU.NAVIGATION.Wishlist', component: MywishlistComponent, icon: undefined, cssClass: 'items', hasDivider: false },
            { title: 'MENU.NAVIGATION.Terms & Conditions', component: HelpAndSupport, icon: undefined, cssClass: 'items', hasDivider: false },
            // { title: 'MENU.NAVIGATION.Privacy', url: "https://www.johnsoncontrols.com/legal/privacy", icon: undefined, cssClass: 'items', hasDivider: false },
            { title: 'MENU.NAVIGATION.Tracking my Order', component: TrackingComponent, icon: undefined, cssClass: 'items', hasDivider: false, requiresLogin: false },
            { title: 'MENU.NAVIGATION.Login', component: Login, icon: undefined, cssClass: 'login', hasDivider: true, isLogin: true },
            { title: 'MENU.NAVIGATION.Logout', component: Login, icon: undefined, cssClass: 'logout', hasDivider: true, isLogout: true },
            { title: 'MENU.NAVIGATION.ChangePassword', component: CustomerPasswordComponent, icon: 'ios-lock-outline', cssClass: 'items', hasDivider: false, requiresLogin: true },
            { title: 'MENU.NAVIGATION.Register', component: CustomerRegisterComponent, icon: 'ios-person-add-outline', cssClass: 'items', hasDivider: false, isRegister: true },
        ];
    }

    openPage(page: MenuItem) {

        if(page.url) {
            let url = page.url.replace('{language}', this.translate.currentLang);
            console.log("Opening External Url", url);
            window.open(url, '_system');
            return;
        }

        if (page.isLogout) {
            this.auth.doLogout().subscribe(() => {
                this.translate.get('MENU.LogoutSucceded').subscribe((val) => {
                    this.helper.showToast(val);
                    window.localStorage.setItem("skip-splash", "logout");
                    window.location.hash = "#/home";
                    window.location.reload();
                    return;
                });
            });
            return;
        }

        if (page.component == this.nav.getActive().component) return;

        if (page.isRoot)
            this.nav.setRoot(page.component);
        else
            this.nav.push(page.component);
    }

    showItem(p: MenuItem): boolean {
        if (p.isLogin && this.auth.isAuthenticated())
            return false;

        if (p.isLogout && !this.auth.isAuthenticated())
            return false;

        if (p.requiresLogin && !this.auth.isAuthenticated())
            return false;

        if (p.isRegister && this.auth.isAuthenticated())
            return false;

        return true;
    }
}
