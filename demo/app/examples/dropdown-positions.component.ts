import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'select-bindings',
    changeDetection: ChangeDetectionStrategy.Default,
    template: `
        <p>
            By default the dropdown position is set to auto and will be shown above if there is not space placing it at the bottom.
        </p>

        ---html,true
        <ng-select [items]="cities">
        </ng-select>
        ---
        <hr>
        <p>
          You can change force position to always to bottom or top by setting <b>dropdownPosition</b>
        </p>

        ---html,true
        <ng-select [dropdownPosition]="'top'"
                   [searchable]="false"
                   [items]="cities">
        </ng-select>
        ---
    `
})
export class DropdownPositionsComponent {
    dropdownPosition: 'top' | 'bottom' = 'bottom';
    cities = [
        { value: 1, label: 'Vilnius' },
        { value: 2, label: 'Kaunas' },
        { value: 3, label: 'Pavilnys' }
    ];
}

