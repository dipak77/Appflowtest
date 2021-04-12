import { Component } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'my-image-viewer',
    templateUrl: 'image-viewer.html'
})
export class ImageViewerComponent {
    imagesUrl: Array<string>;
    defaultImageIndex: number = 0;
    enablePager: boolean = true;
    enableLooping: boolean = true;

    constructor(public navParams: NavParams,
        public viewCtrl: ViewController,
        public translate: TranslateService) {

        this.imagesUrl = this.navParams.get('imagesUrl') || [];
        this.defaultImageIndex = this.navParams.get('defaultIndex') || 0;
        this.enablePager = this.navParams.get('enablePager') || !this.navParams.get('disablePager');
        this.enableLooping = this.navParams.get('enableLooping') || !this.navParams.get('disableLooping');

        console.log("Image Viewer", {
            images: this.imagesUrl,
            defaultImageIndex: this.defaultImageIndex,
            enablePager: this.enablePager,
            enableLooping: this.enableLooping
        });
    }

    closeModal() {
        this.viewCtrl.dismiss();
    }
}
