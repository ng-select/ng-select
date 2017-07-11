import { Component } from '@angular/core';

@Component({
  selector: 'integration-app',
  template: `
  <h2>Hello ang-select</h2>
   <ang-select [items]="cities"
                    bindText="name"
                    [allowClear]="true"
                    [(ngModel)]="selectedCity">
        </ang-select>
  `,
})
export class AppComponent {
  cities = [
    { id: 1, name: 'Vilnius' },
    { id: 2, name: 'Kaunas' },
    { id: 3, name: 'Pavilnys' }
  ];
  selectedCity: any;
  constructor() {
  }
}
