import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-page-image',
    templateUrl: 'page-image.html'
})
export class PageImageComponent {

    @Input() title: string;

    constructor() {
    }
}