import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'select-groups',
    changeDetection: ChangeDetectionStrategy.Default,
    template: `
        <label>Grpup by key</label>
        ---html,true
        <ng-select [items]="accounts"
                bindLabel="name"
                groupBy="country"
                [multiple]="true"
                [(ngModel)]="selectedAccount">
        </ng-select>
        ---
        <p>
            <small>Selected: {{selectedAccount | json}}</small>
        </p>
    `
})
export class SelectGroupsComponent {
    selectedAccount = null;
    accounts = [
        { name: 'Adam', email: 'adam@email.com', age: 12, country: 'United States' },
        { name: 'Samantha', email: 'samantha@email.com', age: 30, country: 'United States' },
        { name: 'Amalie', email: 'amalie@email.com', age: 12, country: 'Argentina' },
        { name: 'Estefanía', email: 'estefania@email.com', age: 21, country: 'Argentina' },
        { name: 'Adrian', email: 'adrian@email.com', age: 21, country: 'Ecuador' },
        { name: 'Wladimir', email: 'wladimir@email.com', age: 30, country: 'Ecuador' },
        { name: 'Natasha', email: 'natasha@email.com', age: 54, country: 'Ecuador' },
        { name: 'Nicole', email: 'nicole@email.com', age: 43, country: 'Colombia' },
        { name: 'Michael', email: 'michael@email.com', age: 15, country: 'Colombia' },
        { name: 'Nicolás', email: 'nicole@email.com', age: 43, country: 'Colombia' }
    ];

    ngOnInit() {

    }
}


