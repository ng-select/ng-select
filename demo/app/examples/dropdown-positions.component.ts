import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'select-bindings',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <p>
            By default the dropdown is displayed below the ng-select. 
            You can change the default position by setting dropdownPosition to above or below.
        </p>

        ---html,true
        <ng-select [dropdownPosition]="dropdownPosition" [searchable]="false" [items]="cities" >
        </ng-select>
        ---

        <hr>

        <label>
            <input [(ngModel)]="dropdownPosition" type="radio" [value]="'above'">
            above
        </label>
        <br>

        <label>
            <input [(ngModel)]="dropdownPosition" type="radio" [value]="'below'">
            below
        </label>
    `
})
export class DropdownPositionsComponent {
    dropdownPosition: 'above' | 'below' = 'below';
    cities = [
        { value: 1, label: 'Vilnius' },
        { value: 2, label: 'Kaunas' },
        { value: 3, label: 'Pavilnys' }
    ];
}

