import { TranslateService } from "@ngx-translate/core";
import { HelperService } from "../core/services/helper.service";
import { SimpleHttp } from "../core/services/simple-http.service";
import { Observable, forkJoin } from "rxjs";
import { Injectable } from "@angular/core";

import { config } from "../app/app.config";
import { AuthenticationService } from "./security/auth.service";


interface ICrmPayLoad {
  EntityName: string;
  Fields?: {
    FieldName: string;
  }[];
  Query?: {
    FieldName: string;
    FieldValue: string;
  }[];
}

@Injectable()
export class RequestService {
  regions: any = [];
  cities: any = {};

  requestTypes = {
    ServiceRequest: "1",
    WarrantyRegistration: "2",
    InquiryRequest: "3",
    CallBackRequest: "4",
    SubscribeRequest: "5",
    ComplainRequest: "6",
    CaseRequest: "7",
    ContractRequest: "8",
  };

  fields = {
    All: [
      { FieldName: "jci_requestid" },
      { FieldName: "jci_firstname" },
      { FieldName: "jci_lastname" },
      { FieldName: "jci_region" },
      { FieldName: "jci_city" },
      { FieldName: "jci_mobile" },
      { FieldName: "jci_email" },
      { FieldName: "jci_comments" },
      { FieldName: "jci_actype" },
      { FieldName: "jci_unitscount" },
      { FieldName: "jci_status" },
      { FieldName: "createdon" },
      { FieldName: "jci_requesttype" },
      { FieldName: "jci_name" },
      { FieldName: "jci_isunderwarranty" },
      { FieldName: "jci_issue" },
      { FieldName: "jci_contract" },
      { FieldName: "jci_customerlocation" },
      { FieldName: "jci_projectcode" },
      { FieldName: "jci_contractnumber" },
      { FieldName: "jci_contractaccountnumber" },
    ],

    CaseRequest: [
      { FieldName: "jci_requestid" },
      { FieldName: "jci_firstname" },
      { FieldName: "jci_lastname" },
      { FieldName: "jci_region" },
      { FieldName: "jci_city" },
      { FieldName: "jci_mobile" },
      { FieldName: "jci_email" },
      { FieldName: "jci_comments" },
      { FieldName: "jci_actype" },
      { FieldName: "jci_unitscount" },
      { FieldName: "jci_status" },
      { FieldName: "createdon" },
      { FieldName: "jci_requesttype" },
      { FieldName: "jci_name" },
      { FieldName: "jci_isunderwarranty" },
      { FieldName: "jci_issue" },
    ],

    ComplainRequest: [
      { FieldName: "jci_requestid" },
      { FieldName: "jci_firstname" },
      { FieldName: "jci_lastname" },
      { FieldName: "jci_region" },
      { FieldName: "jci_city" },
      { FieldName: "jci_mobile" },
      { FieldName: "jci_email" },
      { FieldName: "jci_comments" },
      { FieldName: "jci_status" },
      { FieldName: "createdon" },
      { FieldName: "jci_requesttype" },
      { FieldName: "jci_name" },
      { FieldName: "jci_issue" },
      { FieldName: "jci_contract" },
      { FieldName: "jci_accountnumber" },
    ],

    ContractRequest: [
      { FieldName: "jci_requestid" },
      { FieldName: "jci_firstname" },
      { FieldName: "jci_lastname" },
      { FieldName: "jci_region" },
      { FieldName: "jci_city" },
      { FieldName: "jci_mobile" },
      { FieldName: "jci_email" },
      { FieldName: "jci_comments" },
      { FieldName: "jci_actype" },
      { FieldName: "jci_unitscount" },
      { FieldName: "jci_status" },
      { FieldName: "createdon" },
      { FieldName: "jci_requesttype" },
      { FieldName: "jci_name" },
      { FieldName: "jci_issue" },
      { FieldName: "jci_contractnumber" },
      { FieldName: "jci_accountnumber" },
      { FieldName: "jci_customerlocation" },
      { FieldName: "jci_projectcode" },
      { FieldName: "jci_contractnumber" },
      { FieldName: "jci_contractaccountnumber" },
    ],
  };

  constructor(
    public helper: HelperService,
    private http: SimpleHttp,
    public translate: TranslateService,
    private authenticate: AuthenticationService
  ) {}

  submitRequest(data, requestType) {
    data["jci_requesttype"] = this.requestTypes[requestType];
    data["jci_lang"] =
      this.translate.currentLang == "ar" ? "arabic" : "english";
    return this.http.doPost(
      config.crmBaseUrl + "/Insert",
      this.inflateValues(data),
      this.http.crmHttpOptions
    );
  }

  inflateValues(props) {
    let exceptionFields = {
      jci_region: "Lookup",
      jci_city: "Lookup",
      jci_issue: "Lookup",
      jci_contracttype: "Lookup",
      jci_interestarea: "Picklist",
      jci_actype: "Picklist",
      jci_unitscount: "Integer",
      jci_customertype: "Picklist",
      jci_requesttype: "Picklist",
      jci_purchasedate: "DateTime",
      jci_isunderwarranty: "Boolean",
      jci_contract: "Boolean",
      jci_problem: "Lookup",
      jci_customerlocation: "Lookup",
    };

    let fields = [];
    let variable;
    for (variable in props) {
      let propVal = props[variable];
      const propName = variable.includes("jci_")
        ? variable
        : "jci_" + variable.toLowerCase();

      let fieldVal = props[propName] || "";

      if (propName == "jci_purchasedate") {
        const date = new Date(fieldVal);

        const mm = date.getMonth() + 1;
        const dd = date.getDate();

        fieldVal =
          (dd < 10 ? "0" + dd : dd) +
          "/" +
          (mm < 10 ? "0" + mm : mm) +
          "/" +
          date.getFullYear();
      }

      if (propName == "jci_issue") {
        propVal = propVal.id || "";
      }

      const obj = { FieldName: propName, FieldValue: propVal };

      if (exceptionFields[propName]) {
        obj["FieldType"] = exceptionFields[propName];
      }
      // else {
      //   obj["FieldType"] = "String";
      // }

      fields.push(obj);
    }

    let data = {
      Fields: fields,
      EntityName: "jci_request",
    };

    return data;
  }

  getRequests(requestType) {
    return this.http.doGet(config.applicationBaseUrl);
  }

  getRequestDetails(requestType, requestId, isId = false) {
    let filter: ICrmPayLoad = {
      EntityName: "jci_request",
      Fields: this.fields[requestType] || this.fields.All,
      Query: [],
    };

    if (requestType && requestType != "All") {
      filter.Query.push({
        FieldName: "jci_requesttype",
        FieldValue: this.requestTypes[requestType],
      });
    }

    filter["Query"].push({
      FieldName: isId ? "jci_requestid" : "jci_name",
      FieldValue: requestId,
    });

    return Observable.create((observer) => {
      this.http
        .doPost(
          config.crmBaseUrl + "/EntityData",
          filter,
          this.http.crmHttpOptions
        )
        .subscribe(
          (res) => {
            let data = null;
            if (res["Records"] && res["Records"].length > 0)
              data = this.convertFieldsArrayToObject(
                res["Records"] ? res["Records"][0]["Fields"] : null
              );

            if (data) {
              // Deflate City And Region
              let observerList = [];
              observerList.push(this.getRegions(data.jci_region));
              observerList.push(this.getCities(data.jci_city, false));
              observerList.push(this.getAcIssues(data.jci_issue));
              observerList.push(this.getAcTypes(data.jci_actype));
              if (data.jci_customerlocation)
                observerList.push(
                  this.getCustomerLocations(
                    data.jci_contractaccountnumber,
                    data.jci_customerlocation
                  )
                );

              forkJoin(observerList).subscribe(
                ([
                  regionResult,
                  cityResult,
                  issueResult,
                  acResult,
                  locationsResult,
                ]) => {
                  let region: any = regionResult;
                  let city: any = cityResult;
                  let issue: any = issueResult;
                  let ac: any = acResult;
                  let locations: any = locationsResult;

                  data["jci_region"] =
                    region && region.length > 0
                      ? region[0]
                      : data["jci_region"];
                  data["jci_city"] =
                    city && city.length > 0 ? city[0] : data["jci_city"];
                  data["jci_issue"] =
                    issue && issue.length > 0 ? issue[0] : data["jci_issue"];

                  data["jci_customerlocation"] =
                    locations && locations.length > 0
                      ? locations[0]
                      : data["jci_customerlocation"];

                  if (ac)
                    data["jci_actype"] =
                      ac && ac.length > 0 ? ac[0] : data["jci_actype"];

                  observer.next(data);
                  observer.complete();
                },
                (err) => {
                  observer.error(err);
                }
              );
            } else {
              observer.next(data);
              observer.complete();
            }
          },
          (err) => {
            observer.error(err);
          }
        );
    });
  }

  getAllRequests(requestType) {
    const user = this.authenticate.getToken();

    let filter: ICrmPayLoad = {
      EntityName: "jci_request",
      Fields: this.fields[requestType] || [],
      Query: [
        {
          FieldName: "jci_requesttype",
          FieldValue: this.requestTypes[requestType],
        },
        {
          FieldName: "jci_email",
          FieldValue: user
            ? user.Email || "Unknown@user.com"
            : "Unknown@user.com",
        },
      ],
    };

    return Observable.create((observer) => {
      this.http
        .doPost(
          config.crmBaseUrl + "/EntityData",
          filter,
          this.http.crmHttpOptions
        )
        .subscribe(
          (res) => {
            let data = [];
            if (res["Records"] && res["Records"].length > 0) {
              let item;
              for (item of res["Records"]) {
                data.push(this.convertFieldsArrayToObject(item["Fields"]));
              }
            }
            observer.next(data);
            observer.complete();
          },
          (err) => {
            observer.error(err);
          }
        );
    });
  }

  getRegions(regionId: string = null, forceLoad: boolean = false) {
    return Observable.create((observer) => {
      if (!regionId && this.regions && this.regions.length > 0 && !forceLoad) {
        observer.next(this.regions);
        observer.complete();
        return;
      }

      let filter: ICrmPayLoad = {
        EntityName: "jci_region",
        Fields: [{ FieldName: "jci_name" }, { FieldName: "jci_name_en" }],
      };

      if (regionId) {
        filter.Query = [{ FieldName: "jci_regionid", FieldValue: regionId }];
      }

      this.http
        .doPost(
          config.crmBaseUrl + "/EntityData",
          filter,
          this.http.crmHttpOptions
        )
        .subscribe(
          (res) => {
            let result = this.deflateLookup(res["Records"]);
            if (!regionId) this.regions = result;
            observer.next(result);
            observer.complete();
          },
          (err) => {
            observer.error(err);
          }
        );
    });
  }

  getDistricts(cityId: string = null) {
    return Observable.create((observer) => {
      let filter: ICrmPayLoad = {
        EntityName: "jci_district",
        Fields: [
          { FieldName: "jci_city" },
          { FieldName: "jci_name" },
          { FieldName: "jci_name_en" },
        ],
        Query: [],
      };
      if (cityId)
        filter.Query.push({ FieldName: "jci_city", FieldValue: cityId });

      this.http
        .doPost(
          config.crmBaseUrl + "/EntityData",
          filter,
          this.http.crmHttpOptions
        )
        .subscribe(
          (res) => {
            let districts = this.deflateLookup(res["Records"]);
            observer.next(districts);
            observer.complete();
          },
          (err) => {
            observer.error(err);
          }
        );
    });
  }

  getCities(
    regionOrCityId: string = "",
    isIdRegion: boolean = true,
    forceLoad: boolean = false,
    allowShipping: boolean = false
  ) {
    return Observable.create((observer) => {
      if (this.cities[regionOrCityId] && !forceLoad) {
        observer.next(this.cities[regionOrCityId]);
        observer.complete();
        return;
      }

      let filter: ICrmPayLoad = {
        EntityName: "jci_city",
        Fields: [{ FieldName: "jci_name" }, { FieldName: "jci_name_en" }],
        Query: [],
      };

      if (regionOrCityId) {
        if (isIdRegion) {
          filter.Query.push({
            FieldName: "jci_region",
            FieldValue: regionOrCityId,
          });
        } else {
          filter.Query.push({
            FieldName: "jci_cityid",
            FieldValue: regionOrCityId,
          });
        }
      }

      if (allowShipping) {
        filter.Query.push({
          FieldName: "jci_allowshipping",
          FieldValue: "true",
        });
      }

      this.http
        .doPost(
          config.crmBaseUrl + "/EntityData",
          filter,
          this.http.crmHttpOptions
        )
        .subscribe(
          (res) => {
            this.cities[regionOrCityId] = this.deflateLookup(res["Records"]);
            observer.next(this.cities[regionOrCityId]);
            observer.complete();
          },
          (err) => {
            observer.error(err);
          }
        );
    });
  }

  deflateLookup(data) {
    let deflated = [];
    if (data) {
      for (let item of data) {
        const convertedFields = this.convertFieldsArrayToObject(item.Fields);
        let record = {
          ...convertedFields,
          id: item["RecordID"] || "",
          name: convertedFields["jci_name"],
          nameEn: convertedFields["jci_name_en"],
        };
        deflated.push(record);
      }
    }

    return deflated;
  }

  convertFieldsArrayToObject(fields) {
    let convertedFields = {};
    if (fields) {
      for (let item of fields) {
        convertedFields[item.FieldName] = item.FieldValue;
      }
    }

    return convertedFields;
  }

  getProjectDetails(projectCode) {
    return Observable.create((observer) => {
      let url = config.isMobileAppMode
        ? "http://40.115.53.94:8088/api/EntityData/GetProjectDetails?ProjectCode="
        : config.crmBaseUrl + "/EntityData/GetProjectDetails?ProjectCode=";
      this.http
        .doPost(url + projectCode, null, this.http.crmHttpOptions)
        .subscribe(
          (res) => {
            if (res && res.AccountCode) {
              this.getCustomerLocations(res.AccountCode.trim()).subscribe(
                (locations) => {
                  res.Locations = locations;
                  observer.next(res);
                  observer.complete();
                },
                () => observer.error()
              );
            } else {
              observer.error();
            }
          },
          () => {
            observer.error();
          }
        );
    });
  }

  getCustomerLocations(
    customerCode: string = undefined,
    jci_customerlocationid: string = undefined
  ) {
    return Observable.create((observer) => {
      let crmPayload: ICrmPayLoad = {
        EntityName: "jci_customerlocation",
        Fields: [
          { FieldName: "jci_name" },
          { FieldName: "jci_customerlocationid" },
          { FieldName: "jci_locationname" },
          { FieldName: "jci_locationcode" },
          { FieldName: "jci_customercode" },
        ],
        Query: jci_customerlocationid
          ? [
              {
                FieldName: "jci_customerlocationid",
                FieldValue: jci_customerlocationid,
              },
            ]
          : [{ FieldName: "jci_customercode", FieldValue: customerCode }],
      };
      this.http
        .doPost(
          config.crmBaseUrl + "/EntityData",
          crmPayload,
          this.http.crmHttpOptions
        )
        .subscribe(
          (res) => {
            let locations = this.deflateLookup(res.Records);
            observer.next(locations);
            observer.complete();
          },
          () => {
            observer.error();
          }
        );
    });
  }

  getProblems() {
    return Observable.create((observer) => {
      let crmPayload: ICrmPayLoad = {
        EntityName: "jci_serviceproblem",
        Fields: [
          { FieldName: "jci_serviceproblemid" },
          { FieldName: "jci_titlear" },
          { FieldName: "jci_titleen" },
        ],
      };
      this.http
        .doPost(
          config.crmBaseUrl + "/EntityData",
          crmPayload,
          this.http.crmHttpOptions
        )
        .subscribe(
          (res) => {
            let problems = this.deflateLookup(res.Records);
            observer.next(problems);
            observer.complete();
          },
          () => {
            observer.error();
          }
        );
    });
  }

  getInterestedArea() {
    return Observable.create((observer) => {
      //console.log("getInterestedArea", this.translate.currentLang);
      let lcid = this.translate.currentLang == "ar" ? 1025 : 1033;
      let interestedarea: ICrmPayLoad = {
        EntityName: "jci_request",
        Fields: [{ FieldName: "jci_interestarea" }],
      };

      this.http
        .doPost(
          config.crmBaseUrl +
            "/EntityData/GetOptionSetLabelsValue?lcid=" +
            lcid,
          interestedarea,
          this.http.crmHttpOptions
        )
        .subscribe(
          (res) => {
            observer.next(this.transformObjectIntoArrayByKey(res));
            observer.complete();
          },
          () => {
            observer.error();
          }
        );
    });
  }

  getTopicFromApi(topicId): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http
        .doPost(config.applicationBaseUrl + "/topics/" + topicId, null)
        .subscribe((topic) => {
          //console.log(`Topic Result ${topicId}`, topic);
          resolve(topic);
        }, reject);
    });
  }

  getTermsAndConditionsTopic(): Promise<any> {
    return this.getTopicFromApi("12");
  }

  transformObjectIntoArrayByKey(data: any) {
    let interestedAreas = [];
    for (let prop in data) {
      interestedAreas.push({ id: prop, name: data[prop] });
    }
    return interestedAreas;
  }

  getNumberOfUnits() {
    return Observable.create((observer) => {
      let filter: ICrmPayLoad = {
        EntityName: "jci_request",
        Fields: [{ FieldName: "jci_numberofunits" }],
      };

      this.http
        .doPost(
          config.crmBaseUrl + "/EntityData/GetOptionSetLabels",
          filter,
          this.http.crmHttpOptions
        )
        .subscribe(
          (res) => {
            let units = [];
            for (let prop in res) {
              units.push({ id: prop, name: res[prop] });
            }

            observer.next(units);
            observer.complete();
          },
          () => {
            observer.error();
          }
        );
    });
  }

  getAcTypes(acId: string = null) {
    return Observable.create((observer) => {
      let filter: ICrmPayLoad = {
        EntityName: "jci_request",
        Fields: [
          { FieldName: "jci_actype" },
          { FieldName: "jci_actype_ar" },
          { FieldName: "jci_actype_en" },
        ],
      };

      this.http
        .doPost(
          config.crmBaseUrl + "/EntityData/GetOptionSetLabels",
          filter,
          this.http.crmHttpOptions
        )
        .subscribe(
          (res) => {
            let units = [];
            for (let prop in res) {
              units.push({ id: prop, name: res[prop] });
            }

            // Get Specific Ac Type
            if (acId) {
              const ac = units.find((issue) => {
                return issue.id == acId;
              });

              if (ac) units = [ac];
              else units = [];
            }

            observer.next(units);
            observer.complete();
          },
          () => {
            observer.error();
          }
        );
    });
  }

  getContractType(contractId: string = null) {
    return Observable.create((observer) => {
      let filter: ICrmPayLoad = {
        EntityName: "jci_contracttype",
        Fields: [{ FieldName: "jci_name_en" }, { FieldName: "jci_name_ar" }],
      };

      this.http
        .doPost(
          config.crmBaseUrl + "/EntityData",
          filter,
          this.http.crmHttpOptions
        )
        .subscribe(
          (res) => {
            let types = this.deflateLookup(res["Records"]);

            if (contractId) {
              const type = types.find((type) => {
                return type.id == contractId;
              });

              if (type) types = [type];
              else types = [];
            }

            observer.next(types);
            observer.complete();
          },
          () => {
            observer.error();
          }
        );
    });
  }

  getAcIssues(issueId: string = null) {
    return Observable.create((observer) => {
      let filter: ICrmPayLoad = {
        EntityName: "jci_issue",
        Fields: [{ FieldName: "jci_name" }, { FieldName: "jci_name_en" }],
      };

      this.http
        .doPost(
          config.crmBaseUrl + "/EntityData",
          filter,
          this.http.crmHttpOptions
        )
        .subscribe(
          (res) => {
            let issues = this.deflateLookup(res["Records"]);
            //console.log("issues", issues);
            if (issueId) {
              const issue = issues.find((issue) => {
                return issue.id == issueId;
              });

              if (issue) issues = [issue];
              else issues = [];
            }

            observer.next(issues);
            observer.complete();
          },
          () => {
            observer.error();
          }
        );
    });
  }
}
