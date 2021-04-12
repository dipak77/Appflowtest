import { Component } from '@angular/core';
import { TranslateService } from "@ngx-translate/core";
import { HelperService } from '../../core/services/helper.service';
import { RequestService } from '../../providers/request.service';

/**
 * Generated class for the PrivacypolicyComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
    selector: 'help-and-support',
    templateUrl: 'help-and-support.html'
})
export class HelpAndSupport {

    isLoading: boolean = false;
    topic: any = { Title: "", Body: "" };
    
    constructor(
        public requestService: RequestService,
        public translate: TranslateService,
        public helper: HelperService) {
    }

    ionViewDidEnter() {       
        this.helper.dismissAllLoaders().then(() => {
            this.fetchPageData();          
        });
    }

    onLanguageChange() {
        this.fetchPageData();
    }    

    fetchPageData() {
        if(this.isLoading) return;
        this.isLoading = true;
        let loaderName = "CONTACTUS.getData";
        this.helper.showLoading(loaderName);
        this.requestService.getTermsAndConditionsTopic()
        .then(topic => {
            this.topic = topic;
            this.helper.hideLoading(loaderName);
            this.isLoading = false;
            console.log("Got Topic", this.topic);
        });
    }
}
