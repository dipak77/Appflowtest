import { Component, NgZone, ViewChild, ElementRef } from '@angular/core';
import {
    AlertController,
    NavController,
    Platform,
    ViewController,
    NavParams
} from 'ionic-angular';
import { MapsAPILoader } from '@agm/core';
import { Geolocation } from '@ionic-native/geolocation';
// import {} from 'googlemaps';

/**
 * Generated class for the LocationComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
    selector: 'location',
    templateUrl: 'location.html'
})
export class LocationComponent {

    public latitude: number = 0;
    public longitude: number = 0;

    public currentLatitude: number = 0;
    public currentLongitude: number = 0;

    public viewLatitude: number = 0;
    public viewLongitude: number = 0;

    public zoom: number = 12;
    public locationChosen: boolean = false;
    public showPositionType: boolean = true;
    public selPositionType: string;

    public country: string = '';
    public province: string = '';
    public city: string = '';
    public road: string = '';

    cityField: string = '';

    @ViewChild('map') mapElement: ElementRef;
    @ViewChild('searchbar', { read: ElementRef }) searchbar: ElementRef;

    addressElement: HTMLInputElement = null;

    constructor(
        private mapsAPILoader: MapsAPILoader,
        private ngZone: NgZone,
        public platform: Platform,
        public alertCtrl: AlertController,
        public geolocation: Geolocation,
        public viewCtrl: ViewController,
        public navCtrl: NavController,
        params: NavParams) {

        this.platform.ready().then(() => this.loadMap());
        this.cityField = params.get('city');
    }

    loadMap() {
        this.mapsAPILoader.load().then(() => {
            this.initAutocomplete();
            this.cityField ? this.geocodeAddress(this.cityField) : this.trackingCurrentPosition();
        });
    }

    initAutocomplete(): void {
        this.addressElement = this.searchbar.nativeElement.querySelector('.searchbar-input');
        let autocomplete = new google.maps.places.Autocomplete(this.addressElement);
        autocomplete.addListener("place_changed", () => {
            this.ngZone.run(() => {
                //get the place result
                let place = autocomplete.getPlace();

                //verify result
                if (place.geometry === undefined || place.geometry === null) {
                    return;
                }

                //set latitude, longitude and zoom
                this.latitude = place.geometry.location.lat();
                this.longitude = place.geometry.location.lng();
                this.getLocationFullAddress(this.latitude, this.longitude);
                this.setViewPosition(this.latitude, this.longitude);
            });
        });
    }

    errorAlert(title, message) {
        let alert = this.alertCtrl.create({
            title: title,
            message: message,
            buttons: [
                {
                    text: 'OK',
                    handler: data => {
                        this.loadMap();
                    }
                }
            ]
        });
        alert.present();
    }

    trackingCurrentPosition() {
        if ("geolocation" in navigator) {
            navigator.geolocation.watchPosition((position) => {
                this.setCurrentPosition(position);
            });
        }
    }

    // Get City coords
    geocodeAddress(city) {
        let geocoder = new google.maps.Geocoder();
        geocoder.geocode({ 'address': city }, (results, status) => {
            if (results[0]) {
                let position = results[0].geometry.location;
                this.setCurrentPosition(position, true);
            }
            else {
                //console.log('Geocode was not successful for the following reason: ' + status);
                this.trackingCurrentPosition()
            }
        });

    }

    setCurrentPosition(position, city?) {
        if (city) {
            this.currentLatitude = position.lat();
            this.currentLongitude = position.lng();
        }
        else {
            this.currentLatitude = position.coords.latitude;
            this.currentLongitude = position.coords.longitude;
        }

        if (this.selPositionType == 'CurrentLocation'
            || !this.selPositionType)
            this.setViewPosition(this.currentLatitude, this.currentLongitude);

        this.getLocationFullAddress(this.currentLatitude, this.currentLongitude);
    }

    setViewPosition(lat, long) {
        this.viewLatitude = lat;
        this.viewLongitude = long;
    }

    onChooseLocation(event) {
        this.latitude = event.coords.lat;
        this.longitude = event.coords.lng;

        this.getLocationFullAddress(this.latitude, this.longitude);
    }

    getLocationFullAddress(lat, long) {
        let geocoder = new google.maps.Geocoder;
        let latlng = { lat: lat, lng: long };

        geocoder.geocode({ 'location': latlng }, (results) => {
            let length = results.length;
            if (length) {
                if (length > 1) this.country = results[length - 1].formatted_address;
                if (length > 2) this.province = results[length - 2].formatted_address;
                if (length > 3) this.city = results[length - 3].formatted_address;
                this.road = results[0].formatted_address;
            }
        });
    }

    onClickDone() {
        this.dismiss({
            'latitude': this.selPositionType == 'CurrentLocation' ? this.currentLatitude : this.latitude || '',
            'longitude': this.selPositionType == 'CurrentLocation' ? this.currentLongitude : this.longitude || '',
            'country': this.country || '',
            'province': this.province || '',
            'city': this.city || '',
            'road': this.road || ''
        });
    }

    dismiss(data?: any) {
        // using the injected ViewController this page
        // can "dismiss" itself and pass back data
        this.viewCtrl.dismiss(data);
    }

    onDragEnd(event) {
        this.latitude = event.coords.lat;
        this.longitude = event.coords.lng;
        this.getLocationFullAddress(this.latitude, this.longitude);
    }

    onClickSelPositionType(type) {
        this.showPositionType = false;
        this.selPositionType = type;
        if (type == 'CurrentLocation') {
            this.trackingCurrentPosition();
        }
    }
}
