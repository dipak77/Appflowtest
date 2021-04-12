import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NavController, MenuController } from 'ionic-angular';
import { Platform } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { ShoppingcartComponent } from '../../pages/shoppingcart/shoppingcart';
import { SimpleHttp } from '../../core/services/simple-http.service';
import { HelperService, AnalyticsHelper } from '../../core/services/helper.service';
import { HomePage } from '../../pages/home/home';
import { config } from '../../app/app.config';
import { CartService } from '../../providers/cart.service';

/**
 * Generated class for the HeaderComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
    selector: 'header',
    templateUrl: 'header.html'
})
export class HeaderComponent {

    langConfig: any;
    @Input() showCart: boolean = true;
    @Input() showExtraMenuButton: boolean = true;
    @Output() onLanguageChange = new EventEmitter();

    constructor(
        public translate: TranslateService,
        public platform: Platform,
        private navCtrl: NavController,
        private helper: HelperService,
        private http: SimpleHttp,
        private cart: CartService,
        private menu: MenuController) {

        this.initialize();
    }

    initialize() {
        if (!config.langConfig) {
            let loaderName = "HEADER";
            this.helper.showLoading(loaderName);
            this.platform.ready().then(() => {
                this.http.doGet(config.applicationBaseUrl + '/GetLanguage').subscribe((res: any) => {
                    config.langConfig = res;
                    this.langConfig = config.langConfig;
                    this.setLanguageDirection(this.langConfig['CurrentLanguageId']);
                    this.helper.hideLoading(loaderName);
                }, () => {
                    this.helper.hideLoading(loaderName);
                    this.setLanguageDirection(2);
                });
            });
        } else {
            this.langConfig = config.langConfig;
        }
    }

    changeCurrentLanguage(langId) {
        let loaderName = "HEADER.changeLang";
        let language = (langId == 1 ? 'en' : 'ar');
        this.helper.showLoading(loaderName);
        this.http.doPost(config.applicationBaseUrl + '/SetLanguage/' + langId, {}).subscribe(() => {
            AnalyticsHelper.logEvent(language == "ar" ? "ArabicLanguageSelect" : "EnglishLanguageSelect");
            config.langConfig.CurrentLanguageId = langId;
            this.setLanguageDirection(langId);
            this.onLanguageChange.emit();
            this.helper.hideLoading(loaderName);
        }, () => {
            this.helper.hideLoading(loaderName);
        });
    }

    setLanguageDirection(langId) {
        let language = (langId == 1 ? 'en' : 'ar');
        this.translate.use(language);
        let isArabic = (language == "ar");
        var htmlEl = document.getElementsByTagName("html")[0];
        htmlEl.dir = isArabic ? "rtl" : "ltr";
        htmlEl.lang = language;
        this.platform.setDir(isArabic ? "rtl" : "ltr", true);
    }

    onClickOpenMenuBar() {
        this.menu.open();
    }

    loadShoppingCart() {
        this.navCtrl.push(ShoppingcartComponent);
    }

    navigateToHome() {
        this.navCtrl.setRoot(HomePage);
    }
}
