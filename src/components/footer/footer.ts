import { Component } from '@angular/core';
import { ContactusComponent } from '../../pages/contactus/contactus';
import { NavController } from 'ionic-angular';

/**
 * Generated class for the SignoutComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'app-footer',
  templateUrl: 'footer.html'
})
export class FooterComponent {
  currentYear: any;
  constructor(private nav: NavController) {
    var d = new Date();
    this.currentYear = d.getFullYear();
  }

  loadContactus() {
    this.nav.push(ContactusComponent);
  }
}
