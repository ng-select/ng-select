import {Component} from '@angular/core';

@Component({
    selector: 'select-bindings',
    template: `        
        <label>Bind to default <b>label</b>, <b>value</b> bindings</label>
        <ang-select [items]="defaultBindingsList"
                    [allowClear]="true"
                    [(ngModel)]="selectedCityId">
        </ang-select>
        <p>
            Selected value: {{selectedCityId | json}}
        </p>
        <hr>
        <label>Bind display text to property and value to object</label>
        <ang-select [items]="cities"
                    bindText="name"
                    bindValue="this"
                    placeholder="Select value"
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

    ngOnInit() {
    }
}

