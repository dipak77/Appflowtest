export enum IPaymentEnableDisable { disable = 0, enable = 1 };
export enum IPaymentSupportedLanguages { Arabic = "ar", English = "en" };

export interface IPaymentButtonConfig { width: number, height: number, img_url: string };

export interface IPaymentInfoSettings {
    amount: number // , 10.00,
    currency: string, // "USD",
    title: string, // "Johnson Controls - Test Express Checkout Transaction",
    product_names: string // "Product1,Product2,Product3",
    order_id: string // 25,
    display_customer_info: IPaymentEnableDisable,
    display_billing_details: IPaymentEnableDisable,
    display_shipping_details: IPaymentEnableDisable,
    secret_key: string,
    merchant_id: string,
    language: IPaymentSupportedLanguages,
    redirect_on_reject: IPaymentEnableDisable,
    url_redirect: string,
    is_iframe: {
        load: 'onbodyload',
        show: 1
    },
    checkout_button: IPaymentButtonConfig,
    pay_button: IPaymentButtonConfig
}

/**
 * PayTabs - Payment Info
 */
export interface IPaymentInfo {
    settings: IPaymentInfoSettings,
    customer_info: IPaymentCustomerInfo, // This object is mandatory if settings display_customer_info is 0
    billing_address: IPaymentBillingAddress, // This object is mandatory if settings display_billing_details is 0
    shipping_address: IPaymentShippingAddress // This object is mandatory if settings display_shipping_details is 0
}

export interface IPaymentShippingAddress {
    shipping_first_name: string, // 40 characters
    shipping_last_name: string, // 40 characters
    full_address_shipping: string, // 40 characters
    city_shipping: string, // 50 characters
    state_shipping: string, // 32 characters ex: Manama, 2 characters for US and Canada (NY, OH, CA...)
    country_shipping: string, // 3 character ISO country code E.g.: BHR for Bahrain ARE for UAE SAU for Saudi Arabia
    postal_code_shipping: string // 5 - 9 characters
}

export interface IPaymentBillingAddress {
    full_address: string, // 40 characters
    city: string, // 50 characters
    state: string, // 32 characters ex: Manama, 2 characters for US and Canada (NY, OH, CA...)
    country: string, // 3 character ISO country code E.g.: BHR for Bahrain ARE for UAE SAU for Saudi Arabia
    postal_code: string // 5 - 9 characters
}

export interface IPaymentCustomerInfo {
    first_name: string,
    last_name: string,
    country_code: string, // E.g.: 973 for Bahrain, 971 for UAE, 966 for Saudi
    phone_number: string,
    email_address: string
}

export interface IPaymentResultCallback {
    onSuccess: (successfulTransaction: IPaymentResultFields) => {},
    onFailure: (failedTransaction: IPaymentResultFields) => {},
}

export interface IPaymentResultFields {
    order_id: string, // order_id Order ID as per the merchant’s website. alphanumeric
    transaction_id: string, // transaction_id PayTabs Transaction ID integer
    response_code: string, // response_code PayTabs response code for transaction completion integer
    response_message: string, // response_message PayTabs description for the response code string
    transaction_amount: string, // transaction_amount Amount of the transaction integer
    transaction_currency: string, // transaction_currency Currency of the transaction 3 character ISO
    currency: string, // currency code
    customer_name: string, // customer_name Full customer name string
    customer_email: string, // customer_email Email of the customer string
    customer_phone: string, // customer_phone Mobile Number of the customer string
    last_4_digits: string, // last_4_digits Last 4 digits of the credit card used by the customer integer
    first_4_digits: string, // first_4_digits First 4 digits of the credit card used by the customer integer
    card_brand: string, // card_brand Brand of the credit card used by the customer i.e. Visa, MasterCard etc. string
    trans_date: string, // trans_date Date & time of the transaction. The format is DDMM-YYYY H:M:S AM/PM string
    secure_sign: string, // secure_sign A secure sign key in order for merchant to validate if the payment is returning from PayTabs alphanumeric 
}

// SADAD Interface

export interface IPaymentSadadInfo {
    merchant_email: string,
    secret_key: string,
    site_url: string,
    return_url: string,
    title: string, // "Johnson Controls - Test Express Checkout Transaction",
    cc_first_name: string,
    cc_last_name: string,
    cc_phone_number: string,
    phone_number: string,
    email: string,
    products_per_title: string,
    unit_price: string,
    quantity: string,
    other_charges: number,
    amount: number,
    discount: number,
    currency: string,
    reference_no: string,
    ip_customer: string,
    ip_merchant: string,
    address_shipping: string,
    city_shipping: string,
    state_shipping: string,
    postal_code_shipping: string,
    country_shipping: string,
    msg_lang: string,
    cms_with_version: string,
    olp_id: string
}

export interface IPaymentSadadCreateResultCallback {
    result: string,
    response_code: string,
    p_id: string,
    payment_url: string
}

export interface IPaymentSadadVerifyResultCallback {
    result: string,
    response_code: string,
    pt_invoice_id: string,
    amount: number,
    currency: string,
    transactions_id: string,
    reference_no: string
}

// PayTabs RestFul API Interfaces

export interface IPaymentRestFulApiInfo {
    merchant_id?: string,
    merchant_email: string,
    secret_key: string,
    site_url: string,
    return_url: string,
    title: string, // "Johnson Controls - Test Express Checkout Transaction",
    cc_first_name: string,
    cc_last_name: string,
    cc_phone_number: string,
    phone_number: string,
    email: string,
    products_per_title: string,
    unit_price: string,
    quantity: string,
    other_charges: number,
    amount: number,
    discount: number,
    currency: string,
    reference_no: string,
    ip_customer: string,
    ip_merchant: string,
    billing_address: string,
    state: string,
    city: string,
    postal_code: string,
    country: string,
    shipping_first_name: string,
    shipping_last_name: string,
    address_shipping: string,
    city_shipping: string,
    state_shipping: string,
    postal_code_shipping: string,
    country_shipping: string,
    msg_lang: string,
    cms_with_version: string
}

export interface IPaymentRestFulApiCreateResultCallback {
    result: string,
    response_code: string,
    p_id: string,
    payment_url: string
}

export interface IPaymentRestFulApiVerifyResultCallback {
    result: string,
    response_code: string,
    pt_invoice_id: string,
    amount: number,
    currency: string,
    transactions_id: string,
    reference_no: string
}