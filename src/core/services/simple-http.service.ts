import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Platform } from 'ionic-angular';

import { Observable } from 'rxjs';
import 'rxjs/Rx';

import { HelperService } from './helper.service';
import { Device } from '@ionic-native/device';
import { config } from '../../app/app.config';

@Injectable()
export class SimpleHttp {
    httpOptions: any = { headers: {}, withCredentials: true, credentials: true };
    crmHttpOptions: any = { headers: {}, withCredentials: true, credentials: true };
     //CORS_PROXY: any ='https://cors-anywhere.herokuapp.com/';
    getApiHttpOptions() {
        let options = { ...this.httpOptions };
        if (options.headers && options.headers.Token && options.headers.DeviceId) {
            delete options.headers.DeviceId;
        }
        return options;
    }

    constructor(public http: HttpClient,
        public helper: HelperService,
        public device: Device,
        public platform: Platform) {

        this.crmHttpOptions.headers.key = config.CRM_TOKEN;
        this.httpOptions.headers.NST = config.NST_TOKEN || '';

        this.platform.ready().then(() => {
            let deviceid = this.device.uuid;
            let custId="";
//debugger;
            if (!deviceid
                || deviceid.length < 10) {

                if (localStorage != undefined) {
                    deviceid = localStorage.getItem('yorkstoredeviceid');
                    custId = localStorage.getItem('security_token[0].Token');


                    if (!deviceid) {
                        deviceid = helper.uuidv4();
                        console.log('creating local storage device id', deviceid);
                        localStorage.setItem('yorkstoredeviceid', deviceid);
                    }

                    this.httpOptions.headers.DeviceId = deviceid;
                }
            }
            this.httpOptions.headers.DeviceId = deviceid;
            console.debug("Device Id", deviceid);
            console.debug("customerId",custId);
        });
    }

    doPost(url: string, data: any, httpOptions?: any): Observable<any> {
        let sentHttpOptions = httpOptions || this.getApiHttpOptions();
        return Observable.create((observer) => {
            this.http.post(url, data, sentHttpOptions)
                // throw error
                .catch((error: HttpErrorResponse) => {
                    observer.error(error);
                    return this.ErrorHandler(error);
                })
                // Subscribe To check there is no error 
                .subscribe((res: any) => {

                    if (res) {
                        if (res.ErrorList && res.ErrorList.length > 0) {
                            this.helper.showToast(res.ErrorList[0], 'danger')
                            observer.error(res);
                            return;
                        }
                    }

                    observer.next(res || {});
                    observer.complete();
                });
        });
    }

    doGet(url: string, httpOptions?: any): Observable<any> {
        let sentHttpOptions = httpOptions || this.getApiHttpOptions();
        //debugger;
        return this.http.get(url, sentHttpOptions)
            // throw error
            .catch((error: HttpErrorResponse) => {
                return this.ErrorHandler(error);
            });
    }

    doPut(url: string, data: any, httpOptions?: any): Observable<any> {
        let sentHttpOptions = httpOptions || this.getApiHttpOptions();
        return this.http.put(url, data, sentHttpOptions)
            // throw error
            .catch((error: HttpErrorResponse) => {
                return this.ErrorHandler(error);
            });
    }

    doDelete(url: string, httpOptions?: any): Observable<any> {
        let sentHttpOptions = httpOptions || this.getApiHttpOptions();
        return this.http.delete(url, sentHttpOptions)
            // throw error
            .catch((error: HttpErrorResponse) => {
                return this.ErrorHandler(error);
            });
    }

    ErrorHandler(error: HttpErrorResponse) {
        // let errorMsg = error.message;

        if (error.error instanceof Error) {

            // client side error
            //console.error(`Client-side error occurred described as: ${errorMsg}`)
        } else {
            //console.error(
            //    `Backend returned code ${error.status}, ` +
            //     `body was: ${error.error}`);
        }

        //this.helper.showToast(errorMsg, 'danger');
        return Observable.throw(error);
    }
}