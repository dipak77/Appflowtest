import { InAppBrowser } from '@ionic-native/in-app-browser';
import { Platform } from 'ionic-angular';
import { IPaymentRestFulApiInfo, IPaymentRestFulApiCreateResultCallback, IPaymentRestFulApiVerifyResultCallback, IPaymentResultFields } from './paytabs';
import { config } from '../app/app.config';
import { HttpClient, HttpHeaders } from '@angular/common/http';

export interface IRequest {
    requestId: string, // : '3jh4-ku34k-k3j4k-k3j42',
    body: string,
    headers: object, // { }
    method: string, // 'POST', 'GET, 'PUT, ...
    path: string, // '/hello/world'
    query: string // 'bla=wer&blu=2'
};

export interface IResponse {
    status: number // 200,
    body: string // '<html>Hello ... something</html>',
    headers: object // { 'Content-Type': 'text/html' <--- this is important }
};

const pluginName = "webserver";

export default class PayTabsRestFulApi {

    static defaultPort: number = config.PayTabs.DefaultLocalPort;

    port: number = PayTabsRestFulApi.defaultPort;

    static instance: PayTabsRestFulApi = null;

    inAppBrowser: InAppBrowser;
    paymentWindow = null;
    paymentWindowListener = null;
    paymentWindowOnExit = null;
    paymentInfo: IPaymentRestFulApiInfo;

    resolve = null;
    reject = null;    

    constructor(port = PayTabsRestFulApi.defaultPort,
        public iap: InAppBrowser,
        public platform: Platform,        
        public httpClient: HttpClient) {

        this.inAppBrowser = iap;
        this.platform = platform;
        this.successfulStart = this.successfulStart.bind(this);
        this.failedToStart = this.failedToStart.bind(this);        
        this.stop = this.stop.bind(this);
        this.onRequest = this.onRequest.bind(this);
        this.gotoPayment = this.gotoPayment.bind(this);
        this.getPaymentResultPageResponse = this.getPaymentResultPageResponse.bind(this);
        this.closePaymentWindow = this.closePaymentWindow.bind(this);
        
        this.port = port;

        PayTabsRestFulApi.instance = this;

        console.log('PayTabsRestFulApi.instance', this);
        console.log('window[webserver]', window[pluginName]);    
        // If there is a webserver instance
        if (window[pluginName]) {
            console.log("Starting web server at port " + this.port);

            window[pluginName].onRequest(this.onRequest);

            // Start Web Server and Try to call it
            window[pluginName].start(this.successfulStart, this.failedToStart, this.port);
        } else {
            console.error("Web Server Not Available as plugin: " + pluginName + ", you need to install https://github.com/bykof/cordova-plugin-webserver");
        }
    }

    protected successfulStart() {
        console.log("Started web server at port " + this.port);
    }

    protected failedToStart() {
        console.log("Failed to Start web server at port " + this.port);
    }

    /**
     * Our Custom Request Handler
     * @param request 
     */
    protected onRequest(request: IRequest) {
        console.log("Web Server Got a request", JSON.stringify(request, null, 2));

        // Get the response details
        let response = this.getPaymentResultPageResponse(request);
        console.log("Sending Response", JSON.stringify(response, null, 2));

        // Send Our Response
        try {
            window[pluginName].sendResponse(request.requestId, response);
        } catch(e) {
            console.error("Error Sending Response", e);
        }
    }

    stop() {
        if (PayTabsRestFulApi.instance) {
            PayTabsRestFulApi.instance.stop();
        }
    }

    protected getDefaultResponse(request: IRequest): IResponse {
        return {
            status: 200,
            body: `<html><body>
                This is the default response. 
                If you are seeing this, it means the webserver is running but not able to process your request in the correct manner.
                <br/>
                Your Request:<br/>
                <pre>${JSON.stringify(request, null, 2)}</pre>
                </body></html>`,
            headers: {
                'Content-Type': 'text/html',
                'Generated-At': JSON.stringify(new Date()),
                'Generated-By': 'Mobile Web Server'
            }
        }
    }

    /**
     * Get Payment Result Response, after processing the returned transaction details (success, failure) 
     * @param request 
     */
    protected getPaymentResultPageResponse(request: IRequest): IResponse {
        let response = this.getDefaultResponse(request);

        let transactionFields = {} as IPaymentResultFields;

        // Parse query fields
        request.query.split('&').forEach(pair => {
            let parts = pair.split('=');
            let name = parts[0];
            let value = parts[1] ? decodeURIComponent(parts[1]) : undefined;
            transactionFields[name] = value;
        });

        // Handle callback
        // if (this.resolve && this.reject) {
        //     // Successful transaction? 
        //     if (transactionFields['response_code'] == '100') {
        //         this.resolve(transactionFields);
        //     } 
        //     // else {
        //     //     console.log('this.paymentResolveCallback', this.reject)
        //     //     this.reject(transactionFields);
        //     // }
        // }

        if (request.query.indexOf('is_canceled_pt=1') >= 0) {            
            response.status = 404;
            response.body = "";
            this.closePaymentWindow();
            this.reject("canceled");
        }
        else {
            response.body = `<html><body><pre>${JSON.stringify(transactionFields)}</pre></body></html>`;
        }

        return response;
    }

    closePaymentWindow() {
        if (this.paymentWindow) {
            setTimeout(() => {
                console.debug("Closing InAppBrowser");
                this.paymentWindow.removeEventListener('loadstop', this.paymentWindowListener);
                this.paymentWindow.removeEventListener('exit', this.paymentWindowOnExit);
                this.paymentWindow.close();
                this.paymentWindow = null;
            });
        }
    }

    /**
     * gotoPayment: Go to Payment Gateway via In-App-Browser and handle return, if any. The successful promise returns the transaction id
     */
    public gotoPayment(paymentInfo: IPaymentRestFulApiInfo): Promise<any> {
        this.paymentInfo = paymentInfo;
        let promise = new Promise<any>((resolve, reject) => {
            this.resolve = resolve;
            this.reject = reject;
            this.createPayTabsPayment(paymentInfo);
        });
        return promise;
    }

    rejectAndCloseWindow(error) {
        this.closePaymentWindow();
        this.reject(error);
    }

    validateSecretKey(paymentInfo) {
        console.log('Validating Secret Key PayTabs RestFul Api => Call PayTabs RestFul Api Validate Secret Key');
        console.log("paymentInfo: "+paymentInfo);
        this.httpClient.post(config.PayTabs.BaseUrl + "/validate_secret_key",
            {
                merchant_email: paymentInfo.merchant_email,
                secret_key: paymentInfo.secret_key
            })
            .subscribe((result: IPaymentRestFulApiCreateResultCallback) => {
                console.log('Validating Secret Key PayTabs RestFul Api => Done Successfully', result);
                if (result.response_code === '4000') {
                    this.createPayTabsPayment(paymentInfo);
                } else {
                    this.reject(result);
                }
            }, (error) => {
                console.log('Validating Secret Key PayTabs RestFul Api => Error', error);
                this.reject(error);
            });
    }

    createPayTabsPayment(paymentInfo) {

        let body = new URLSearchParams();

        Object.keys(paymentInfo).map(key => {
            let value = paymentInfo[key];
            body.set(key, value);
            console.log("Payment Setting", key, value);
        });

        let options = {
            headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
        };

        console.log('Creating PayTabs RestFul Api => Call PayTabs RestFul Api Create Service', paymentInfo, body);
debugger;
        this.httpClient.post(config.PayTabs.BaseUrl + "/create_pay_page", body.toString(), options)
            .subscribe((result: IPaymentRestFulApiCreateResultCallback) => {
                if (result.response_code === '4012') {
                    debugger;
                    console.log('Create PayTabs Payment => Success', result);
                    this.openPaymentWindow(paymentInfo, result);
                } else {
                    debugger;
                    console.log('Create PayTabs Payment => Error in Response', result);
                    this.reject(result);
                }
            }, (error) => {
                debugger;
                console.log('Create PayTabs Payment => Error', error);
                this.reject(error);
            });
    }

    verifyPayTabsPayment(verifyData) {
        console.log('Verify PayTabs RestFul Api => Call PayTabs RestFul Api Verify Service', verifyData);

        let body = new URLSearchParams();

        Object.keys(verifyData).map(key => {
            let value = verifyData[key];
            body.set(key, value);
            console.log("Payment Verification Setting", key, value);
        });

        let options = {
            headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
        };

        this.httpClient.post(config.PayTabs.BaseUrl + "/verify_payment", body.toString(), options)
            .subscribe((result: IPaymentRestFulApiVerifyResultCallback) => {
                console.log('Verified PayTabs RestFul Api => ', result, verifyData);
                if (result.response_code === '100') {
                    this.resolve(result);
                    this.closePaymentWindow();
                } else {
                    this.rejectAndCloseWindow(result);
                }
            }, (error) => {
                console.log('Verifying PayTabs RestFul Api => Error', error, verifyData);
                this.rejectAndCloseWindow(error);
            });
    }

    openPaymentWindow(paymentInfo: IPaymentRestFulApiInfo, createResponse: IPaymentRestFulApiCreateResultCallback) {

        const isCordovaBased = window["cordova"] && window["cordova"].InAppBrowser;
        let windowManager = (isCordovaBased ? window["cordova"].InAppBrowser : window);
        let verified = false;
debugger;
       // this.paymentWindow = windowManager.open(createResponse.payment_url, '_blank', 'location=no,toolbar=no,fullscreen=yes,usewkwebview=no');
        this.paymentWindow = windowManager.open(createResponse.payment_url, '_blank', 'location=no,toolbar=no,fullscreen=yes');

        this.paymentWindowListener = event => {
            console.debug("[payment] InAppBrowser: Loaded", JSON.stringify(event, null, 2));

            let URL = event.url;
            console.log('openPaymentWindow', URL);
            if (URL && URL.startsWith(this.paymentInfo.return_url)) {
                const verifyData = {
                    merchant_email: `${config.PayTabs.MerchantEmail}`,
                    secret_key: this.paymentInfo.secret_key,
                    payment_reference: createResponse.p_id
                };
                verified = true;
                return this.verifyPayTabsPayment(verifyData);
            }
        };

        this.paymentWindowOnExit = event => {
            if(!verified){
                console.log('paymentWindowOnExit', event);
                this.rejectAndCloseWindow({message: "Canceled"});
            }
        };

        this.paymentWindow.addEventListener('loadstop', this.paymentWindowListener);
        this.paymentWindow.addEventListener('exit', this.paymentWindowOnExit);
    }
}
