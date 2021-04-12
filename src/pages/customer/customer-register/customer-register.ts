import { Component, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NavController } from 'ionic-angular';

import { AuthenticationService } from '../../../providers/security/auth.service';
import { HelperService, AnalyticsHelper } from '../../../core/services/helper.service';
import { HomePage } from '../../home/home';
import { RequestService } from '../../../providers/request.service';
import { Observable } from 'rxjs';

/**
 * Generated class for the CustomerRegisterComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
    selector: 'customer-register',
    templateUrl: 'customer-register.html'
})
export class CustomerRegisterComponent {

    @Input("isShipping") isShipping: boolean = false;
    customer: any = { CountryId: 69 };

    days: number[] = [];
    months: { key?: string, value?: number }[];
    years: number[] = [];
    districts = [];
    cities = [];
    isLoading: boolean = false;
    citiesByName = {};
    languageChangeSubscription: any = undefined;

    constructor(public navCtrl: NavController,
        protected requestService: RequestService,
        private translate: TranslateService,
        private auth: AuthenticationService,
        private helper: HelperService) {
    }

    ionViewWillEnter() {
        this.helper.dismissAllLoaders().then(() => {
            this.fetchPageData();
            AnalyticsHelper.logEvent("VisitRegister");
        });
        this.languageChangeSubscription = this.translate.onLangChange.subscribe(() => {
            this.fetchPageData();
        });
    }

    ionViewWillLeave() {
        if (this.languageChangeSubscription) {
            this.languageChangeSubscription.unsubscribe();
        }
    }

    fetchPageData() {
        if (this.isLoading) return;
        this.isLoading = true;
        let loader = "CONTACTUS.getData";
        this.helper.showLoading(loader);
        let observables = [];
        // observables.push(this.requestService.getDistricts());
        observables.push(this.requestService.getCities('', false, false, this.isShipping));
        Observable.forkJoin(observables).subscribe(([citiesResut]) => {
            let cities: any = citiesResut;

            this.cities = this.getMappedAndSorted(cities);

            cities.forEach(x => {
                this.citiesByName[x.name] = x;
                this.citiesByName[x.nameEn] = x;
            });

            this.helper.hideLoading(loader);
            this.isLoading = false;
        }, () => {
            this.isLoading = false;
            this.helper.hideLoading(loader);
        });
    }

    getMappedAndSorted(entities) {
        let result = entities.map(x => this.translate.currentLang == "ar" ? x.name : x.nameEn);
        result.sort();
        return Array.from(new Set(result));
    }

    cityChanged(city) {
        let cityObject = this.citiesByName[city];
        if (cityObject)
            this.requestService
                .getDistricts(cityObject ? cityObject.id : null)
                .subscribe(districts => {
                    this.districts = this.getMappedAndSorted(districts);
                });
    }
    onClickRegister() {
        let loaderName = "REGISTER"
        this.helper.showLoading(loaderName);
        this.auth.register(this.customer)
            .subscribe((res) => {

                AnalyticsHelper.logEvent("Register", {
                    METHOD: "mobile",
                    ...this.customer
                });

                this.helper.hideLoading(loaderName);

                if (res) {
                    this.translate.get("CUSTOMERREGISTER.RegisterSuccessfully").subscribe((val) => {
                        this.helper.showToast(val);
                    });

                    this.navCtrl.setRoot(HomePage);
                } else {
                    this.translate.get("CUSTOMERREGISTER.RegisterFailed").subscribe((val) => {
                        this.helper.showToast(val, 'danger');
                    });
                }
            }, () => {
                this.helper.hideLoading(loaderName);
            });
    }
}
