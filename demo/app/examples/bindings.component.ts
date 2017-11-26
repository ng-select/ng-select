import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'select-bindings',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <label>Bind to default <b>label</b>, <b>object</b> bindings</label>
        ---html,true
        <ng-select [items]="defaultBindingsList"
                   [(ngModel)]="selectedCity2">
        </ng-select>
        ---
        <p>
            Selected city object: {{selectedCity2 | json}}
        </p>
        <hr>
        <label>Bind label to custom property</label>
        ---html,true
        <ng-select [items]="cities"
                   bindLabel="name"
                   placeholder="Select value"
                   [clearable]="false"
                   [(ngModel)]="selectedCity">
        </ng-select>
        ---
        <p>
            Selected city object: {{selectedCity | json}}
        </p>
        <hr>
        <label>Bind label and model to custom properties</label>
        ---html,true
        <ng-select [items]="cities"
                   bindLabel="name"
                   bindValue="id"
                   [(ngModel)]="selectedCityId2">
        </ng-select>
        ---
        <p>
            Selected city ID: {{selectedCityId2 | json}}
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
    selectedCity2: number = null;
    selectedCityId2: number = null;

    ngOnInit() {
    }
}

