import {Component} from '@angular/core';

@Component({
    selector: 'demo-app',
    templateUrl: './app.component.html'
})
export class AppComponent {
    meaning: number;

    cities = [
        {id: 1, name: 'Vilnius'},
        {id: 2, name: 'Kaunas'},
        {id: 3, name: 'Pavilnys'}
    ];

    selectedCity = this.cities[0];

    constructor() {
    }

    ngOnInit() {
    }
}
