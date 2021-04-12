import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { config } from '../../app/app.config';
import { SimpleHttp } from '../../core/services/simple-http.service';

import { CartService } from '../cart.service';
import { WishService } from '../wish.service';
import { AnalyticsHelper } from '../../core/services/helper.service';

@Injectable()
export class AuthenticationService {

    _isAuthenticated: boolean = false;
    _authResponse: any = {};

    constructor(private simpleHttp: SimpleHttp,
        private cart: CartService,
        private wish: WishService) {

        this.initialize();
    }

    initialize() {
        if (this.getToken())
            this.updateSimpleHttpHeaders();
    }

    doLogin(userName: string, password: string) {

        const data = {
            email: userName,
            password: password
        };

        return Observable.create((observer) => {
            this.simpleHttp.doPost(config.applicationBaseUrl + '/login', data)
                .subscribe((response) => {

                    if (response['Token']) {
                        this._authResponse = response;
                        this._isAuthenticated = true;
                        this.updateTokenFromData(response);
                        this.updateSimpleHttpHeaders();
                    }

                    observer.next(response);
                    observer.complete();
                }, () => {
                    observer.error();
                });
        });
    }

    doLogout(): Observable<boolean> {
        return Observable.create((observer) => {
            localStorage.removeItem('security_token');
            AnalyticsHelper.logEvent("Logout");
            if (this.simpleHttp.httpOptions.headers.Token)
                delete this.simpleHttp.httpOptions.headers.Token;

            this._isAuthenticated = false;

            this.cart.resetCartItems();
            this.wish.resetWishItems();

            observer.next(true);
            observer.complete();
        });
    }

    register(customerInfo) {
        return Observable.create((observer) => {
            this.simpleHttp.doPost(config.applicationBaseUrl + '/customer/register', customerInfo).subscribe((response) => {
                this.doLogin(customerInfo.Email, customerInfo.Password).subscribe(() => {
                    observer.next(response);
                    observer.complete();
                }, () => {
                    observer.error();
                });
            }, () => {
                observer.error();
            });
        });
    }

    changePassword(oldPass, newPass, confirmPass) {
        return Observable.create((observer) => {
            this.simpleHttp.doPost(config.applicationBaseUrl + '/customer/changepass', {
                "OldPassword": oldPass,
                "NewPassword": newPass,
                "ConfirmNewPassword": confirmPass
            }).subscribe((response) => {
                let res = false;
                if (response['StatusCode'] == 200) {
                    res = true;
                }
                observer.next(res);
                observer.complete();
            }, (err) => {
                observer.error(err);
            });
        });
    }

    resetPassword(userName) {
        let language_id = config.langConfig['CurrentLanguageId'];
        return this.simpleHttp.doPost(config.applicationBaseUrl + '/customer/passwordrecovery/' + language_id, { "Email": userName });
    }

    public getAccessToken() {
        return this._authResponse.Token;
    }

    public getToken(): any {
        const tokenFromLocalStorage = localStorage.getItem('security_token') || '';

        if (tokenFromLocalStorage.length === 0) {
            return null;
        } else {
            this._authResponse = JSON.parse(tokenFromLocalStorage);
            this._isAuthenticated = true;
            return this._authResponse;
        }
    }

    public isAuthenticated(): boolean {
        return this._isAuthenticated || false;
    }

    private updateTokenFromData(data: any) {
        localStorage.setItem('security_token', JSON.stringify(data));
    }

    private updateSimpleHttpHeaders() {
        this.simpleHttp.httpOptions.headers.Token = this._authResponse.Token;
    }
}
