import { Component } from '@angular/core';
import { RequestDetailsComponent } from '../request-details/request-details';
import { NavController } from 'ionic-angular';
import { RequestService } from '../../../providers/request.service';
import { HelperService } from '../../../core/services/helper.service';
import { TranslateService } from '@ngx-translate/core';

import { forkJoin } from 'rxjs';
import ACwarrantyData from './warranty_details.json';
/**
 * Generated class for the ServiceRequestComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
    selector: 'service-request',
    templateUrl: 'service-request.html'
})
export class ServiceRequestComponent {

    data: any = {};
    ACTypes: any;
    numberOfUnits: any = [];
    isUserInfoValid: boolean = false;
    acIssues: any;
    contractType: any;
    acWarrantyData = ACwarrantyData;
    yearsOfWarranty: number;
    showErrorMessage: boolean = false;
    warrantyErrorMessage: string;
    acWarrantyInfo : any;
    department: any;
    acTypeYork : boolean;
    enableSerialNumber : boolean =  false;
    showDPCErrorMsg : boolean = false;
    disableButton : boolean = true;
    constructor(
        private nav: NavController,
        private helper: HelperService,
        private requestService: RequestService,
        private translate: TranslateService
        ) {
    }

    ionViewWillEnter() {
        this.helper.dismissAllLoaders().then(() => {
            this.fetchPageData();
        });
    }

    onLanguageChange() {
        this.fetchPageData();
    }
    acTypeChanged(id){
        let ac = this.ACTypes.filter(el=>el.id == id)[0].name;
        
        this.acWarrantyInfo = this.acWarrantyData.filter(el=>el.EN == ac)[0];
        this.yearsOfWarranty = parseInt(this.acWarrantyInfo.Warranty); 
        this.department = this.acWarrantyInfo.Department;
        this.checkAcWarranty();
    }
    acTypeYorkChanged(val){
        if(val == "yes"){
            this.acTypeYork = true;
        }else{
            this.acTypeYork = false;
        }
        this.checkAcWarranty();
    }
    checkAcWarranty(){
        if(this.data.jci_purchasedate && this.yearsOfWarranty){
            const date1:any = new Date(this.data.jci_purchasedate);
            const date2:any = new Date();
            const diffTime = Math.abs(date2 - date1);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            if(this.yearsOfWarranty * 365 < diffDays){
                this.showErrorMessage = true;
                console.log(this.department);
                if(!this.acTypeYork && this.department == "DP&amp;C" ){
                   this.showDPCErrorMsg = true;
                   this.disableButton = true;
                }else{
                    this.showDPCErrorMsg = false;
                   this.disableButton = false;
                    if(this.department == "ESG" && this.acTypeYork){
                        this.showErrorMessage = false;
                        this.enableSerialNumber = true;
                        this.warrantyErrorMessage = '';
                    }else{
                        this.enableSerialNumber = false;
                        if(this.translate.store.currentLang=="en"){
                            this.warrantyErrorMessage = this.acWarrantyInfo.en_message;
                        }else{
                            this.warrantyErrorMessage = this.acWarrantyInfo.ar_message;
                        }
                    }
                    
                }
                
                
            }else{
                this.showErrorMessage = false;
            }
        }
    }
    fetchPageData() {
        const loader = 'CASEREQUEST';
        this.helper.showLoading(loader);

        let observer = [];
        observer.push(this.requestService.getAcTypes());
        observer.push(this.requestService.getAcIssues());

      forkJoin(observer).subscribe(([acTypes, acIssues]) => {
            this.ACTypes = acTypes;            
            this.acIssues = acIssues;
            this.helper.hideLoading(loader);
        }, () => {
            this.helper.hideLoading(loader);
        });
    }

    onSubmit() {
        let loaderName = "CASEREQUEST.Submit"
        this.helper.showLoading(loaderName);
        this.requestService.submitRequest(this.data, 'CaseRequest')
            .subscribe((res) => {

                this.translate.get("SERVICES.SubmitSuccessfully")
                    .subscribe((translateVal) => {
                        this.helper.showToast(translateVal);
                        this.helper.hideLoading(loaderName);

                        this.nav.push(RequestDetailsComponent, { requestType: 'CaseRequest',requestId: res });
                    });
            }, () => {
                this.helper.hideLoading(loaderName);
            });
    }
}
