import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { Keyboard } from 'ionic-angular';

/**
 * Generated class for the AutocompleteComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'autocomplete',
  templateUrl: 'autocomplete.html'
})
export class AutocompleteComponent implements OnInit {

  @Input("label")
  label: string;
  
  @Input("placeholder")
  placeholder: string;
  
  @Input("items")
  items: string[];

  @Input() value: string;
  @Output() valueChange = new EventEmitter();

  list: any = undefined;
  scrollHeight = "100%";

  showList: boolean = false;

  constructor(private keyboard: Keyboard) {    
  }
  
  ngOnInit() {
    this.list = this.items || [];    
  }
  
  setFocus() {
    this.showList = true;
    let el : any = document.querySelector(".ion-page .scroll-content");
    this.scrollHeight = el.scrollHeight + "px";
    this.search(this.value);
  }

  removeFocus() {
    this.showList = false;
    this.keyboard.close();
  }

  search(value) {
    if (!value || !value.trim().length) {
      this.list = this.items;
      return;
    }
    this.list = (this.items || []).filter(item => item.toUpperCase().includes(value.toUpperCase()));
  }

}
