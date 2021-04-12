import { HomePage } from '../pages/home/home';
import { MywishlistComponent } from '../pages/mywishlist/mywishlist';
import { ShoppingcartComponent } from '../pages/shoppingcart/shoppingcart';
import { HelpAndSupport } from '../pages/help-and-support/help-and-support';
import { Login } from '../pages/login/login';
import { ContactusComponent } from '../pages/contactus/contactus';
import { StoreComponent } from '../pages/store/store';
import { ProductCardComponent } from '../pages/product-list/product-card/product-card';
import { ProductListComponent } from '../pages/product-list/product-list';
import { ProductFilterComponent } from '../pages/product-list/product-filter/product-filter';
import { ProductDetailsComponent } from '../pages/product-details/product-details';
import { RelatedProductsComponent } from '../pages/product-details/related-products/related-products';
import { ShoppingCartItemsComponent } from '../pages/shoppingcart/shopping-cart-items/shopping-cart-items';
import { ShoppingCartTotalComponent } from '../pages/shoppingcart/shopping-cart-total/shopping-cart-total';
import { CheckoutComponent } from '../pages/checkout/checkout';
import { OrderListComponent } from '../pages/orders/order-list/order-list';
import { OrderDetailsComponent } from '../pages/orders/order-details/order-details';
import { CustomerAddressComponent } from '../pages/customer/customer-address/customer-address';
import { AddressComponent } from '../pages/customer/customer-address/address/address';
import { CustomerPasswordComponent } from '../pages/customer/customer-password/customer-password';
import { CustomerRegisterComponent } from '../pages/customer/customer-register/customer-register';
import { PaymentComponent } from '../pages/payment/payment';
import { LocationComponent } from '../pages/location/location';
import { ServiceRequestComponent } from '../pages/our-services/service-request/service-request';
import { ComplaintRequestComponent } from '../pages/our-services/complaint-request/complaint-request';
import { ContractRequestComponent } from '../pages/our-services/contract-request/contract-request';
import { RequestDetailsComponent } from '../pages/our-services/request-details/request-details';

import { CustomerInfoComponent } from '../pages/customer/customer-info/customer-info';
import { OurServicesComponent } from '../pages/our-services/our-services';

import { SplashComponent } from '../pages/splash/splash';
import { TrackingComponent } from '../pages/tracking/tracking';

import { ForgotPasswordComponent } from '../pages/forgot-password/forgot-password';

// Shared Components
import { AutocompleteComponent } from '../components/autocomplete/autocomplete';
import { BannerComponent } from '../components/banner/banner';
import { FooterComponent } from '../components/footer/footer';
import { HeaderComponent } from '../components/header/header';
import { MenuComponent } from '../components/menu/menu';
import { CouponComponent } from '../components/coupon/coupon';
import { UserInfoComponent } from '../components/user-info/user-info';
import { PageImageComponent } from '../components/page-image/page-image';
import { ImageViewerComponent } from '../components/image-viewer/image-viewer';
import { QuantityBtnComponent } from '../components/quantity-btn/quantity-btn';

export const components = [
    HomePage,
    MywishlistComponent,
    ShoppingcartComponent,
    HelpAndSupport,
    Login,
    ContactusComponent,
    StoreComponent,
    ProductCardComponent,
    ProductListComponent,
    ProductFilterComponent,
    SplashComponent,
    ProductFilterComponent,
    ShoppingCartItemsComponent,
    ProductDetailsComponent,
    ShoppingCartTotalComponent,
    RelatedProductsComponent,
    CheckoutComponent,
    OrderListComponent,
    OrderDetailsComponent,
    CustomerInfoComponent,
    CustomerAddressComponent,
    AddressComponent,
    CustomerPasswordComponent,
    CustomerRegisterComponent,
    CouponComponent,
    PaymentComponent,
    LocationComponent,
    ServiceRequestComponent,
    BannerComponent,
    FooterComponent,
    HeaderComponent,
    MenuComponent,
    OurServicesComponent,
    ComplaintRequestComponent,
    TrackingComponent,
    UserInfoComponent,
    PageImageComponent,
    ImageViewerComponent,
    QuantityBtnComponent,
    ContractRequestComponent,
    RequestDetailsComponent,
    ForgotPasswordComponent,
    AutocompleteComponent
];

export const routes = [
    { component: HomePage, name: 'HomePage', segment: 'home' },
    { component: Login, name: 'Login', segment: 'login' },
    { component: ContactusComponent, name: 'ContactUs', segment: 'contact-us' },
    { component: StoreComponent, name: 'Store', segment: 'store' },
    { component: HelpAndSupport, name: 'HelpAndSupport', segment: 'help-and-support' },
    { component: ProductListComponent, name: 'ProductList', segment: 'product-list/:categoryId' },
    { component: ProductDetailsComponent, name: 'ProductDetails', segment: 'product-details/:productId' },
    { component: ShoppingcartComponent, name: 'ShoppingCart', segment: 'shopping-cart' },
    { component: CheckoutComponent, name: 'CheckOut', segment: 'check-out' },
    { component: OrderListComponent, name: 'OrderList', segment: 'order-list' },
    { component: OrderDetailsComponent, name: 'OrderDetails', segment: 'order-details/:orderId' },
    { component: MywishlistComponent, name: 'WishList', segment: 'wish-list' },    
    { component: CustomerInfoComponent, name: 'CustomerInto', segment: 'customer-info' },
    { component: CustomerAddressComponent, name: 'CustomerAddress', segment: 'customer-address' },
    { component: CustomerPasswordComponent, name: 'CustomerPassword', segment: 'customer-password' },
    { component: CustomerRegisterComponent, name: 'CustomerRegister', segment: 'customer-register' },
    { component: PaymentComponent, name: 'payment', segment: 'payment/:paymentType/:orderId/:orderTotal' },
    { component: LocationComponent, name: 'location', segment: 'location' },
    { component: ServiceRequestComponent, name: 'serviceRequest', segment: 'serviceRequest' },
    { component: OurServicesComponent, name: 'ourServices', segment: 'ourServices' },    
    { component: ComplaintRequestComponent, name: 'complaintRequest', segment: 'complaintRequest' },
    { component: ContractRequestComponent, name: 'contractRequest', segment: 'contractRequest' },   
    { component: TrackingComponent, name: 'tracking', segment: 'tracking' },
    { component: RequestDetailsComponent, name: 'requestDetails', segment: 'requestDetails/:requestType/:requestId' },
    { component: ForgotPasswordComponent, name: 'forgotPassword', segment: 'forgot-password' },
];

