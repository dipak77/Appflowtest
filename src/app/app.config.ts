import { Observable } from "rxjs";

const isMobile = {
  Windows: function () {
    return /IEMobile/i.test(navigator.userAgent);
  },
  Android: function () {
    return /Android/i.test(navigator.userAgent);
  },
  BlackBerry: function () {
    return /BlackBerry/i.test(navigator.userAgent);
  },
  iOS: function () {
    return /iPhone|iPad|iPod/i.test(navigator.userAgent);
  },
  any: function () {
    return (
      isMobile.Android() ||
      isMobile.BlackBerry() ||
      isMobile.iOS() ||
      isMobile.Windows()
    );
  },
};

export interface PaytabsConfiguration {
  SecretKey: string;
  MerchantId: string;
  DefaultCurrency: string;
  DefaultLocalPort: number;
  MerchantEmail: string;
  BaseUrl: string;
}

export interface AppConfigInterface {
  isMobile: any;
  isMobileAppMode: boolean;
  applicationBaseUrl?: string;
  crmBaseUrl?: string;
  developmentMode?: boolean;
  NST_TOKEN?: string;
  CRM_TOKEN?: string;
  langConfig?: any;
  googleMapsKey?: string;
  PayTabs: PaytabsConfiguration;
  dateFormat: string;
  dateTimeFormat: string;
  timeFormat: string;
  remotePropertiesObservers: any;
  remotePropertiesObservable: Observable<any>;
  remoteProperties: any;
}

let isMobileAppMode = window.location.search.indexOf("isMobileAppMode=true") >= 0
    ? true
    : (window.location.search.indexOf("isMobileAppMode=false") >= 0 ? false : isMobile.any())
    ;

export const config: AppConfigInterface = {
  isMobile: isMobile,
  isMobileAppMode: isMobileAppMode,
  /*
       applicationBaseUrl: isMobileAppMode ? 'https://york.com.sa/api' : 'http://87.101.136.180:2019/api',
       crmBaseUrl: isMobileAppMode ? 'https://api.york.com.sa/api' : 'http://87.101.136.180:53234/api', 
    */
  // Using API Proxy for local development (check package.json on how to start it in scripts section)
  applicationBaseUrl: isMobileAppMode
     //? "https://york.com.sa/api"
     ? "http://20.50.18.127:2020/api"
     : "http://20.50.18.127:2020/api",
     //: "http://87.101.136.180:2019/api",
     //: "http://localhost:53234/api",
   
  crmBaseUrl: isMobileAppMode
   // ? "https://api.york.com.sa/api"  
    ? "http://20.50.18.127:4080/api"
    : "http://20.50.18.127:4080/api",
    //: "http://20.50.18.127:4080/api", // http://10.153.0.175:53234/api  or http://87.101.136.180:53234/api
    // : "http://20.50.18.127:4080/api", // http://10.153.0.175:53234/api  or http://87.101.136.180:53234/api
  developmentMode: false,
  NST_TOKEN:
    "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJOU1RfS0VZIjoiYm05d1UzUmhkR2x2YmxSdmEyVnUifQ.qdnNFEysRSenoFOmQqPZm5F1VY8Cp5Jmis1d9uFkM-s",
    //"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJOU1RfS0VZIjoiYm05d1UzUmhkR2x2YmxSdmEyVnUifQ.FXBzHptLEepXDicB1V2VrItcQCqtZP5GMxLmmsPuPDY",
  CRM_TOKEN:
    "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJOU1RfS0VZIjoiYm05d1UzUmhkR2x2YmxSdmEyVnUifQ.FXBzHptLEepXDicB1V2VrItcQCqtZP5GMxLmmsPuPDY",
  googleMapsKey: "AIzaSyA4SW-SmISsyz7hqsN3dDc0Bb9wkyIOofg", //AIzaSyDnTW7elSVQJ8GXxjIuDlbmUGzGWqJqmvc
  PayTabs: isMobileAppMode
    ? {
        SecretKey:
          "PzDXtJZQf612LzjgV0PBThEIvWXl6BXTiSPcnE0bfbaqPEDW9OlvdQDAhIf890mqF3Nr7hHaxFZsCZw03zUo7uEs1TunYYSeSAVq",
        MerchantId: "3910",
        MerchantEmail: "hind.omar@jci.com",
        DefaultCurrency: "SAR",
        DefaultLocalPort: 8100,
        BaseUrl: "https://secure.paytabs.sa/apiv2"
      }
    : {
        SecretKey:
          "PzDXtJZQf612LzjgV0PBThEIvWXl6BXTiSPcnE0bfbaqPEDW9OlvdQDAhIf890mqF3Nr7hHaxFZsCZw03zUo7uEs1TunYYSeSAVq",
        MerchantId: "3910",
        MerchantEmail: "hind.omar@jci.com",
        DefaultCurrency: "SAR",
        DefaultLocalPort: 8100,
        BaseUrl: "https://secure.paytabs.sa/apiv2",
      },
  dateFormat: "DD/MM/YYYY",
  dateTimeFormat: "DD/MM/YYYY h:mm:ss",
  timeFormat: "h:mm:ss",
  remotePropertiesObservers: [],
  remotePropertiesObservable: undefined,
  remoteProperties: {
    isFetchStarted: false,
    isFetchComplete: false,
    paymentLogos: {
      ar: [],
      en: [],
    },
    homepagePopupUrls: {
      ar: undefined,
      en: undefined,
    },
  },
};

export function blobToDataURL(blob, callback) {
  return new Promise((resolve, reject) => {
    var a = new FileReader();
    a.onload = function (e) {
      let result = a.result;
      callback(result);
      resolve(result);
    };
    a.onerror = function (e) {
      reject(e);
    };
    a.onabort = function (e) {
      reject(e);
    };
    a.readAsDataURL(blob);
  });
}

export function getRemoteProperties(simpleHttp) {
  if (config.remotePropertiesObservable)
    return config.remotePropertiesObservable;

  config.remotePropertiesObservable = new Observable((observer) => {
    if (config.remoteProperties.isFetchComplete) {
      observer.next(config.remoteProperties);
      observer.complete();
      return;
    }

    config.remotePropertiesObservers.push(observer);

    if (config.remoteProperties.isFetchStarted) {
      return;
    } else {
      config.remoteProperties.isFetchStarted = true;

      let observables = [];

      let imagesObservable = simpleHttp.doGet(
        config.crmBaseUrl + "/JCI/GetMobileHomePageLogos",
        simpleHttp.crmHttpOptions
      );
      
      imagesObservable.subscribe((res) => {
        config.remoteProperties.onlineStoreImageUrl = res.store;
        config.remoteProperties.ourServicesImageUrl = res.services;
      });

      observables.push(imagesObservable);

      // Get Payment Logos and Homepage Popup Image Urls
      [
        { id: "ar", name: "arabic" },
        { id: "en", name: "english" },
      ].forEach((lang) => {
        let observable = simpleHttp.doGet(
          config.crmBaseUrl + "/JCI/GetPaymentLogos?language=" + lang.name,
          simpleHttp.crmHttpOptions
        );
        observable.subscribe((res) => {
          config.remoteProperties.paymentLogos[lang.id] = res;
        });
        observables.push(observable);

        let popupObservable = simpleHttp.doGet(
          config.crmBaseUrl + "/JCI/GetPopupImage?language=" + lang.name,
          simpleHttp.crmHttpOptions
        );
        popupObservable.subscribe((res) => {
          if (res)
            for (var imageName in res)
              config.remoteProperties.homepagePopupUrls[lang.id] =
                res[imageName];
        });
        observables.push(popupObservable);
      });

      Observable.forkJoin(observables).subscribe(() => {
        config.remoteProperties.isFetchComplete = true;
        console.log("Remote Properties", config.remoteProperties);
        config.remotePropertiesObservers.forEach((registeredObserver) => {
          registeredObserver.next(config.remoteProperties);
          registeredObserver.complete();
        });
      });
    }
  });

  return config.remotePropertiesObservable;
}

console.log("config", config);