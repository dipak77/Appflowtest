import { Injectable } from "@angular/core";
import { LoadingController, ToastController, ToastOptions } from "ionic-angular";
import moment from "moment";
import * as _ from "lodash";
import { config } from "../../app/app.config";
import Toastify from 'toastify-js';

export interface FirebaseMessage {
  messageType?: "notification" | "data";
  tap?: "foreground" | "background";
  title?: string;
  body?: string;
  id?: string;
}

@Injectable()
export class HelperService {
  loader = {};

  constructor(
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController
  ) { }

  isLoading(section: string = "") {
    return this.loader[section] ? true : false;
  }

  showLoading(section: string = "", msg: string = "") {
    return new Promise((resolve, reject) => {
      this.loader[section] = this.loadingCtrl.create({
        content: msg,
      });

      this.loader[section].present();

      resolve(true);
    });
  }

  uuidv4() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (
      c
    ) {
      var r = (Math.random() * 16) | 0,
        v = c == "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  hideLoading(section: string = "") {
    return new Promise((resolve, reject) => {
      if (this.loader[section] && this.loader[section].dismiss) {
        this.loader[section].dismiss();
        this.loader[section] = null;
      }

      resolve(true);
    });
  }

  dismissAllLoaders() {
    return new Promise((resolve, reject) => {
      if (this.loader) {
        let loadItem;
        for (loadItem in this.loader) {
          if (this.loader[loadItem] && this.loader[loadItem].dismiss) {
            this.loader[loadItem].dismiss();
            this.loader[loadItem] = null;
          }
        }
      }

      resolve(true);
    });
  }

  showToast(
    msg: string,
    state: string = "success",
    additionalConfig: any = {}
  ) {
    let toasterClass = "success-toast";
    if (state == "danger") toasterClass = "danger-toast";
    if (state == "error") toasterClass = "danger-toast";
    else if (state == "warning") toasterClass = "warning-toast";

    let toaster = this.toastCtrl.create({
      message: msg,
      cssClass: toasterClass,
      duration: additionalConfig["duration"] || 2000,
      position: additionalConfig["position"] || "bottom",
      showCloseButton: additionalConfig["showCloseButton"],
      closeButtonText: additionalConfig["closeButtonText"],
    });

    toaster.present();
  }

  formatDate(dateOrString, newFormat = "DD/MM/YYYY") {
    return dateOrString
      ? moment(
        dateOrString.getMonth ? dateOrString : new Date(dateOrString)
      ).format(newFormat)
      : null;
  }

  formatDateByAppConfig(dateOrString, formatType = "date") {
    let format = config.dateFormat;
    if (formatType == "datetime") format = config.dateTimeFormat;
    else if (formatType == "time") format = config.timeFormat;

    return dateOrString
      ? moment(
        dateOrString.getMonth ? dateOrString : new Date(dateOrString)
      ).format(format)
      : null;
  }
}

export function getAmount(text) {
  let amount = 0;

  if (text) {
    text = text.replace(",", "");
    const regex = /\d+([.]\d+){0,1}/m;
    let m;
    if ((m = regex.exec(text)) !== null) {
      // The result can be accessed through the `m`-variable.
      m.forEach((match, groupIndex) => {
        if (groupIndex === 0) amount = parseFloat(match);
      });
    }
  }

  return amount;
}

const locationChanged = (...args) => {
  setTimeout(() => {
    let screen_name = location.hash.replace("#/", "");
    if (!screen_name) screen_name = "home";
    AnalyticsHelper.logEvent("PageView", { screen_name });
    if (screen_name.indexOf("/") > 0) {
      AnalyticsHelper.logEvent("PageView", {
        screen_name: screen_name.split("/")[0],
      });
    }
  });
};

//
// Anaylytics Helper (GA / Firebase Events and Others)
// Changed to Adjust Events
//
export class AnalyticsHelper {
  static Adjust: any = undefined;
  static AdjustConfig: any = undefined;
  static AdjustEvent: any = undefined;
  static FirebasePlugin: any = undefined;
  static localNotificationsPlugin: any = undefined;
  static initialized: boolean = false;

  static EventToken = {
    AddToCart: "xirf6f",
    ArabicLanguageSelect: "qdfelp",
    Checkout: "aq09h5",
    CheckoutComplete: "9sunsr",
    EnglishLanguageSelect: "5i75yj",
    Error: "t56vn0",
    Login: "ostegj",
    Logout: "ov0jky",
    PageView: "vq32e8",
    ProductView: "nj8muw",
    Promocode: "lo8il2",
    Register: "u31ww2",
    VisitHomepage: "8kz3ww",
    VisitCart: "67qbvb",
    VisitCategory: "w9l63m",
    VisitCheckout: "b7w3c0",
    VisitContactUs: "q8ulbg",
    VisitOurServices: "42kubs",
    VisitRegister: "81kq1w",
  };

  static toastCtrl: ToastController;

  static logEvent(event_name: string, event_params: any = undefined) {
    // console.debug("logEvent", event_name, event_params);

    if (AnalyticsHelper.AdjustEvent) {
      let eventToken = AnalyticsHelper.EventToken[event_name];
      if (eventToken) {
        let adjustEvent = new AnalyticsHelper.AdjustEvent(eventToken);
        if (event_params) {
          if (event_params.setRevenue)
            adjustEvent.setRevenue(event_params.setRevenue, "SAR");
          if (event_params.setTransactionId)
            adjustEvent.setTransactionId(event_params.setTransactionId);
          for (var key in event_params) {
            adjustEvent.addCallbackParameter(key, event_params[key]);
          }
        }
        AnalyticsHelper.Adjust.trackEvent(adjustEvent);
      }
    }

    if (AnalyticsHelper.FirebasePlugin) {
      let firebaseEventParams = event_params;
      switch (event_name) {
        case "PageView":
          firebaseEventParams = event_params.screen_name;
          AnalyticsHelper.FirebasePlugin.setScreenName(firebaseEventParams);
          // console.debug("FirebaseAnalytics.setCurrentScreen", event_params);
          break;
        case "AddToCart":
          firebaseEventParams = {
            currency: "SAR",
            value: event_params.setRevenue,
            item_id: event_params.ProductId,
            item_category: "Not Available",
            item_name: event_params.ProductName,
            price: getAmount(event_params.UnitPrice),
            quantity: event_params.Quantity,
          };
          AnalyticsHelper.FirebasePlugin.logEvent(
            "add_to_cart",
            firebaseEventParams
          );
          // console.debug("FirebaseAnalytics.add_to_cart", firebaseEventParams);
          break;
        case "RemoveFromCart":
          firebaseEventParams = {
            currency: "SAR",
            value: getAmount(event_params.UnitPrice) * event_params.Quantity,
            item_id: event_params.ProductId,
            item_category: "Not Available",
            item_name: event_params.ProductName,
            price: getAmount(event_params.UnitPrice),
            quantity: event_params.Quantity,
          };
          AnalyticsHelper.FirebasePlugin.logEvent(
            "remove_from_cart",
            firebaseEventParams
          );
          // console.debug("FirebaseAnalytics.remove_from_cart", firebaseEventParams);
          break;
        case "ProductView":
          firebaseEventParams = { ...event_params };
          AnalyticsHelper.FirebasePlugin.logEvent(
            "view_item",
            firebaseEventParams
          );
          // console.debug("FirebaseAnalytics.view_item", firebaseEventParams);
          break;
        case "VisitCategory":
          firebaseEventParams = { item_category: event_params.name };
          AnalyticsHelper.FirebasePlugin.logEvent(
            "view_item_list",
            firebaseEventParams
          );
          // console.debug("FirebaseAnalytics.view_item_list", firebaseEventParams);
          break;
        case "Promocode":
          firebaseEventParams = {
            promotions: [
              { id: event_params.promocode, name: event_params.promocode },
            ],
          };
          AnalyticsHelper.FirebasePlugin.logEvent(
            "view_promotion",
            firebaseEventParams
          );
          // console.debug("FirebaseAnalytics.view_promotion", firebaseEventParams);
          break;
        case "CheckoutComplete":
          firebaseEventParams = {
            transaction_id: event_params.paymentInfo.reference_no,
            value: event_params.paymentInfo.amount,
            currency: "SAR",
            tax: getAmount(_.get(event_params.order, "OrderTotalModel.Tax")),
            shipping: getAmount(
              _.get(event_params.order, "OrderTotalModel.Shipping")
            ),
            coupon: _.get(
              event_params.order,
              "ShoppingCartModel.DiscountBox.AppliedDiscountsWithCodes[0].CouponCode"
            ),
          };
          let items = [
            event_params.order.ShoppingCartModel.Items.map((x) => {
              return {
                item_id: x.ProductId,
                item_category: "Not Available",
                item_name: x.ProductName,
                price: getAmount(x.UnitPrice),
                quantity: x.Quantity,
              };
            }),
          ];
          AnalyticsHelper.FirebasePlugin.logEvent("purchase", {
            ...firebaseEventParams,
            items,
          });
          AnalyticsHelper.FirebasePlugin.logEvent(
            "ecommerce_purchase",
            firebaseEventParams
          );
          // console.debug("FirebaseAnalytics.purchase", { ...firebaseEventParams, items });
          break;
      }
    }
  }

  static init() {
    if (AnalyticsHelper.initialized) {
      console.error("AnalyticsHelper Already Initialized");
      return;
    }

    let Adjust = window["Adjust"];
    let AdjustConfig = window["AdjustConfig"];
    if (Adjust && AdjustConfig) {
      AnalyticsHelper.Adjust = Adjust;
      AnalyticsHelper.AdjustConfig = AdjustConfig;
      AnalyticsHelper.AdjustEvent = window["AdjustEvent"];

      var adjustConfig = new AdjustConfig(
        "n7gfy3mqppmo",
        AdjustConfig.EnvironmentProduction
      );
      adjustConfig.setLogLevel(AdjustConfig.LogLevelVerbose); // enable all logging
      Adjust.create(adjustConfig);
    } else {
      console.error("Adjust Not Available");
    }

    ["go", "back", "forward", "pushState", "replaceState"].forEach((func) => {
      let _old = history[func];
      window.history[func] = (...args) => {
        let result = _old.call(window.history, ...args);
        if (result && result.then) {
          return result.then((results) => {
            locationChanged(...args);
            return results;
          });
        } else {
          locationChanged(...args);
        }
        return result;
      };
    });

    window.addEventListener("hashchange", locationChanged, false);

    AnalyticsHelper.FirebasePlugin = _.get(window, "FirebasePlugin");

    // Check Firebase availability
    if (!AnalyticsHelper.FirebasePlugin)
      console.warn("FirebasePlugin not defined");
    else {
      // Clear Badges
      AnalyticsHelper.FirebasePlugin.setBadgeNumber(0);
      // When message received...
      AnalyticsHelper.FirebasePlugin.onMessageReceived(
        function (message: any) {
          console.debug("FirebaseMessage Message Received", message);          
          message = AnalyticsHelper.getMessageDisplayParts(message);
          // if there is a product to show
          if(message.tap === "background" && message.productId) 
          {
            window.location.hash = "#/product-details/" + message.productId
          }
          else if(message.tap === "background" && message.categoryId) {
            window.location.hash = "#/product-list/" + message.categoryId
          }
          else if(message.tap !== "background" && (message.title || message.body)) {
  
            let hash = undefined;
            if(message.productId) hash = "#/product-details/" + message.productId;
            if(message.categoryId) hash = "#/product-list/" + message.categoryId;

            const toastify = Toastify({
              text: `<div ${message.body.indexOf('ا') ? 'dir="rtl"' : 'dir="ltr"' } style='font-size:150%'><b>${message.title}</b><br/>\n${message.body}</div>`.trim(),
              duration: 120000, 
              close: true,
              gravity: "bottom", // `top` or `bottom`
              position: "center", // `left`, `center` or `right`
              onClick: function(){
                if(hash) 
                  window.location.hash = hash;
                toastify.hideToast();
              } // Callback after click
            });
            toastify.showToast();
          }
        },
        function (error) {
          console.error("An error occured receiving a Firebase message", error);
        }
      );

      var getToken = function () {
        AnalyticsHelper.FirebasePlugin.getToken(function (token) {
          console.debug("Got FCM token", token)
        }, function (error) {
          console.error("Failed to get FCM token", error);
        });
      };

      var checkNotificationPermission = function (requested) {
        if(AnalyticsHelper.FirebasePlugin)
          AnalyticsHelper.FirebasePlugin.hasPermission(function (hasPermission) {
            if (hasPermission) {
              console.debug("Remote notifications permission granted");
              // Granted
              getToken();
            } else if (!requested) {
              // Request permission
              console.debug("Requesting remote notifications permission");
              AnalyticsHelper.FirebasePlugin.grantPermission(checkNotificationPermission);
            } else {
              // Denied
              console.error("Notifications won't be shown as permission is denied");
            }
          });
      };

    }

    if (AnalyticsHelper.FirebasePlugin)
    checkNotificationPermission(false);

    AnalyticsHelper.initialized = true;
  }

  static getMessageDisplayParts(message): { title, body } {

    let title = "";

    if (message.title) {
      title = message.title;
    } else if (message.notification && message.notification.title) {
      title = message.notification.title;
    } else if (message.aps && message.aps.alert && message.aps.alert.title) {
      title = message.aps.alert.title;
    }

    let body = "";
    if (message.body) {
      body = message.body;
    } else if (message.notification && message.notification.body) {
      body = message.notification.body;
    } else if (message.aps && message.aps.alert && message.aps.alert.body) {
      body = message.aps.alert.body;
    }

    message.title = title;
    message.body = body;

    return message;
  }

}
