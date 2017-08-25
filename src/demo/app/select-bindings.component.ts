import {Component} from '@angular/core';

@Component({
    selector: 'select-bindings',
    template: `
        <label>Bind to default <b>label</b>, <b>value</b> bindings</label>
        <ng-select [items]="defaultBindingsList"
                   [(ngModel)]="selectedCityId">
        </ng-select>
        <p>
            Selected value: {{selectedCityId | json}}
        </p>
        <hr>
        <label>Bind model to object</label>
        <ng-select [items]="cities"
                   bindLabel="name"
                   bindValue="this"
                   placeholder="Select value"
                   [clearable]="false"
                   [(ngModel)]="selectedCity">
        </ng-select>
        <p>
            Selected value: {{selectedCity | json}}
        </p>
        <hr>
        <label>Bind model to custom property</label>
        <ng-select [items]="cities"
                   bindLabel="name"
                   bindValue="id"
                   [(ngModel)]="selectedCityId2">
        </ng-select>
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

