import { Component, Input, Output, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';

import { HelperService } from '../../core/services/helper.service';
import { CustomerService } from '../../providers/customer.service';
import { RequestService } from '../../providers/request.service';
import { AuthenticationService } from '../../providers/security/auth.service';

import { forkJoin } from 'rxjs';

@Component({
    selector: 'userInfo',
    templateUrl: 'user-info.html'
})
export class UserInfoComponent implements OnInit {

    @ViewChild('userInfoForm') form;
    @Input() valueModel: any; 
    @Input() showCityAndRegion: boolean = true;   
   
    @Output() isValid : EventEmitter<any> = new EventEmitter();

    regions: any = [];
    cities: any = [];

    disableUserInfo: boolean = false;

    constructor(private custService: CustomerService,
        private reqService: RequestService,
        private helper: HelperService,
        public translate: TranslateService,
        public navCtrl: NavController,
        public modalCtrl: ModalController,
        private auth: AuthenticationService) {       
    }

    ngOnInit() {
        this.fetchPageData();
        
        // here we are subscribing to changes to the form. This will fire anytime there is a change in our form.
        this.form.valueChanges.subscribe(() => {
            this.isValid.emit(this.form.valid)
        });
    }

    fetchPageData() {
        let loader = "USERINFO.getData";
        this.helper.showLoading(loader);

        let observer = [];
        observer.push(this.reqService.getRegions());
        if (this.auth.isAuthenticated()) {
            this.disableUserInfo = true; 
            observer.push(this.custService.getCustomerInfo());
        }
      
        forkJoin(observer).subscribe(([regions, custinfo]) => {
            this.regions = regions || [];
            console.debug("UserInfo:FetchData", { regions, custinfo })
            if (custinfo) {
                this.valueModel['FirstName'] = custinfo['FirstName'] || '';
                this.valueModel['LastName'] = custinfo['LastName'] || '';
                this.valueModel['Mobile'] = custinfo['Phone'] || null;
                this.valueModel['Email'] = custinfo['Email'] || '';
            }
           
            this.helper.hideLoading(loader);
        }, () => {
            this.helper.hideLoading(loader);
        });
    }

    onRegionChange(regionId) {
        let loader = "USERINFO.getCities";
        this.helper.showLoading(loader);

        this.reqService.getCities(regionId).subscribe(cities => {
            this.cities = cities || [];
            this.helper.hideLoading(loader);
        }, () => {
            this.helper.hideLoading(loader);
        });
    }
}
