import { Component, Input, Output, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';

import { HelperService } from '../../../../core/services/helper.service';
import { CustomerService } from '../../../../providers/customer.service';
import { AuthenticationService } from '../../../../providers/security/auth.service';

import { Login } from '../../../../pages/login/login';
import { LocationComponent } from '../../../../pages/location/location';

import { forkJoin, Observable } from 'rxjs';
import { RequestService } from '../../../../providers/request.service';

/**
 * Generated class for the AddressComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
    selector: 'address',
    templateUrl: 'address.html'
})
export class AddressComponent implements OnInit {

    @ViewChild('customerAddressForm') form;

    @Input() address: any;
    @Input() isNew: boolean = false;
    @Input() showLogin: boolean = false;
    @Input() showSaveBtn: boolean = true;
    @Input() isShipping: boolean = false;

    @Output() actionHandler: EventEmitter<any> = new EventEmitter();
    @Output() isValid: EventEmitter<any> = new EventEmitter();

    districts = [];
    cities = [];
    citiesByName = {};

    languageChangeSubscription: any = undefined;

    isLoading: boolean = false;

    constructor(
        private custService: CustomerService,
        private helper: HelperService,
        public translate: TranslateService,
        public navCtrl: NavController,
        public modalCtrl: ModalController,
        private requestService: RequestService,
        private auth: AuthenticationService) {

    }

    getMappedAndSorted(entities) {
        let result = entities.map(x => this.translate.currentLang == "ar" ? x.name : x.nameEn);
        result.sort();
        return Array.from(new Set(result));
    }

    cityChanged(city) {
        let cityObject = this.citiesByName[city];
        let observable = null;
        console.log("City Changed", cityObject);
        if (cityObject) {
            observable = this.requestService.getDistricts(cityObject ? cityObject.id : null);
            observable.subscribe(districts => {
                this.districts = this.getMappedAndSorted(districts);
            });
        }
        return observable;
    }

    ngOnInit() {
        this.languageChangeSubscription = this.translate.onLangChange.subscribe(() => {
            this.fetchPageData();
        });

        this.fetchPageData();

        if (this.isNew) {
            this.handleNewAddress();
        }

        // here we are subscribing to changes to the form. This will fire anytime there is a change in our form.
        this.form.valueChanges.subscribe(() => {
            this.isValid.emit(this.form.valid)
        });
    }

    handleNewAddress() {

        this.address = this.address || {};

        let address = this.address;

        address.CountryId = '69';
        // address.StateProvinceId = '0';
        // address.ZipPostalCode = '1';

        if (this.auth.isAuthenticated()) {
            this.custService.getCustomerInfo().subscribe({
                next(custinfo) {
                    if (custinfo) {
                        console.log("Customer Info (for New Address)", custinfo);
                        address.Email = custinfo['Email'] || address.Email;
                        address.FirstName = custinfo['FirstName'] || address.FirstName;
                        address.LastName = custinfo['LastName'] || address.LastName;
                        address.PhoneNumber = custinfo['Phone'] || address.PhoneNumber;
                        address.City = custinfo['City'] || address.City;
                        address.Address1 = custinfo['StreetAddress'] || address.Address1;
                        address.Address2 = custinfo['StreetAddress2'] || address.Address2;
                    }
                }
            });
        }
    }

    fetchPageData() {
        if (this.isLoading) return;
        this.isLoading = true;
        let loader = "Address.getData";
        let observables = [];
        observables.push(this.requestService.getCities('', false, false, this.isShipping));
        
        Observable.forkJoin(observables).subscribe(([citiesResult]) => {
            // this.districts = this.getMappedAndSorted(districts);
        
            let cities: any = citiesResult;
            this.cities = this.getMappedAndSorted(cities);
            cities.forEach(x => {
                this.citiesByName[x.name] = x;
                this.citiesByName[x.nameEn] = x;
            });
            if (this.address.City) {
                let observable = this.cityChanged(this.address.City);
                if (observable) {
                    observable.subscribe(() => {
                        this.helper.hideLoading(loader);
                        this.isLoading = false;
                    });
                } else {
                    this.helper.hideLoading(loader);
                    this.isLoading = false;
                }
            } else {
                this.helper.hideLoading(loader);
                this.isLoading = false;
            }
        }, () => {
            this.isLoading = false;
            this.helper.hideLoading(loader);
        });
    }

    onClickOpenLoginPage() {
        this.navCtrl.push(Login);
    }

    openMap(city) {
        let modal = this.modalCtrl.create(LocationComponent, { city: city });
        modal.present();
        modal.onWillDismiss((data) => {
            if (data) {
                this.address.City = data.city;
                this.address.Address1 = data.road;
                this.address.Address2 = data.road;
            }
        });
    }

    onClickSave() {
        let loader = "ADDRESS";
        this.helper.showLoading(loader);

        let observers = [];
        if (this.isNew) {
            observers.push(this.custService.addCustomerAddress(this.address));
        } else {
            observers.push(this.custService.editCustomerAddress(this.address));
        }

        forkJoin(observers).subscribe(([res]) => {
            this.helper.hideLoading(loader);

            if (res['Data']) {
                let key = this.isNew ? 'AddressAddedSuccessfully' : 'AddressUpdateSuccessfully';
                this.translate.get('ADDRESS.' + key).subscribe((val) => {
                    this.helper.showToast(val);
                });

                this.actionHandler.emit({ "address": this.address, "isNew": this.isNew });
            }
        }, () => {
            this.helper.hideLoading(loader);
            this.actionHandler.emit(null);
        });
    }
}
