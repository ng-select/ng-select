import {Component} from '@angular/core';

@Component({
    selector: 'select-bindings',
    template: `
        <label>Bind display text to property</label>
        <ang-select [items]="cities"
                    bindText="name"
                    [allowClear]="true"
                    [(ngModel)]="selectedCity">
        </ang-select>
        <p>
            Selected value: {{selectedCity | json}}
        </p>
        <hr>
        <label>Bind selected model value to property</label>
        <ang-select [items]="cities"
                    bindText="name"
                    bindValue="id"
                    [allowClear]="true"
                    [(ngModel)]="selectedCityId">
        </ang-select>
        <p>
            Selected value: {{selectedCityId | json}}
        </p>
    `
})
export class SelectBindingsComponent {

    cities = [
        {id: 1, name: 'Vilnius'},
        {id: 2, name: 'Kaunas'},
        {id: 3, name: 'Pavilnys'}
    ];

    selectedCity: any;
    selectedCityId: number = null;

    ngOnInit() {
    }
}

