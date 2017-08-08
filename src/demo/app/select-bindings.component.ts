import {Component} from '@angular/core';

@Component({
    selector: 'select-bindings',
    template: `        
        <label>Bind to default <b>label</b>, <b>value</b> bindings</label>
        <ang-select [items]="defaultBindingsList"
                    [(ngModel)]="selectedCityId">
        </ang-select>
        <p>
            Selected value: {{selectedCityId | json}}
        </p>
        <hr>
        <label>Bind model to object</label>
        <ang-select [items]="cities"
                    bindLabel="name"
                    bindValue="this"
                    placeholder="Select value"
                    [allowClear]="false"
                    [(ngModel)]="selectedCity">
        </ang-select>
        <p>
            Selected value: {{selectedCity | json}}
        </p>
        <hr>
        <label>Bind model to custom property</label>
        <ang-select [items]="cities"
                    bindLabel="name"
                    bindValue="id"
                    [(ngModel)]="selectedCityId2">
        </ang-select>
        <p>
            Selected value: {{selectedCityId2 | json}}
        </p>
    `
})
export class SelectBindingsComponent {

    defaultBindingsList = [
        {value: 1, label: 'Vilnius'},
        {value: 2, label: 'Kaunas'},
        {value: 3, label: 'Pavilnys', disabled: true}
    ];

    cities = [
        {id: 1, name: 'Vilnius'},
        {id: 2, name: 'Kaunas'},
        {id: 3, name: 'Pavilnys', disabled: true}
    ];

    selectedCity: any;
    selectedCityId: number = null;
    selectedCityId2: number = null;

    ngOnInit() {
    }
}

