import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'select-bindings',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <label>Bind to default <b>label</b>, <b>object</b> bindings</label>
        ---html,true
        <ng-select [items]="defaultBindingsList"
                   [(ngModel)]="selectedCity">
        </ng-select>
        ---
        <p>
            Selected city object: {{selectedCity | json}}
        </p>
        <hr>
        <label>Bind label to nested custom property</label>
        ---html,true
        <ng-select [items]="countries"
                   bindLabel="nested.name"
                   bindValue="nested.countryId"
                   placeholder="Select value"
                   [(ngModel)]="selectedCountryId">
        </ng-select>
        ---
        <p>
            Selected country ID: {{selectedCountryId}}
        </p>
        <hr>
        <label>Bind label and model to custom properties</label>
        ---html,true
        <ng-select [items]="cities"
                   bindLabel="name"
                   bindValue="id"
                   [(ngModel)]="selectedCityId">
        </ng-select>
        ---
        <p>
            Selected city ID: {{selectedCityId | json}}
        </p>
    `
})
export class SelectBindingsComponent {

    defaultBindingsList = [
        { value: 1, label: 'Vilnius' },
        { value: 2, label: 'Kaunas' },
        { value: 3, label: 'Pavilnys', disabled: true }
    ];

    cities = [
        { id: 1, name: 'Vilnius' },
        { id: 2, name: 'Kaunas' },
        { id: 3, name: 'Pavilnys', disabled: true }
    ];

    countries = [
        { id: 1, nested: { countryId: 'L', name: 'Lithuania' } },
        { id: 2, nested: { countryId: 'U', name: 'USA' } },
        { id: 3, nested: { countryId: 'A', name: 'Australia' } }
    ];

    selectedCountryId: string = null;
    selectedCity = null;
    selectedCityId: number = null;

    ngOnInit() {
        this.selectedCountryId = this.countries[0].nested.countryId;
        this.selectedCity = this.defaultBindingsList[0];
        this.selectedCityId = this.cities[0].id;
    }
}

