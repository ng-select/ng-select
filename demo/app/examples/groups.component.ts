import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'select-groups',
    changeDetection: ChangeDetectionStrategy.Default,
    template: `
        <p>
            ng-select supports grouping flat array of objects by providing <b>groupBy</b> input
        </p>

        <label>Default group by key</label>
        ---html,true
        <ng-select [items]="accounts"
                bindLabel="name"
                bindValue="name"
                groupBy="country"
                [multiple]="true"
                [(ngModel)]="selectedAccount">
        </ng-select>
        ---
        <p>
            <small>Selected: {{selectedAccount | json}}</small>
        </p>

        <label>Group by function expression</label>
        ---html,true
        <ng-select [items]="accounts2"
                bindLabel="name"
                bindValue="name"
                [groupBy]="groupByFn"
                [multiple]="true"
                [(ngModel)]="selectedAccount2">
        </ng-select>
        ---
        <p>
            <small>Selected: {{selectedAccount2 | json}}</small>
        </p>

        <hr />
        <label>With selectable groups</label>
        ---html,true
        <ng-select [items]="accounts3"
                bindLabel="name"
                groupBy="country"
                [selectableGroup]="true"
                [(ngModel)]="selectedAccount3">
        </ng-select>
        ---
        <p>
            <small>Selected: {{selectedAccount3 | json}}</small>
        </p>
    `
})
export class SelectGroupsComponent {
    selectedAccount = ['Samantha'];
    accounts = [
        { name: 'Adam', email: 'adam@email.com', age: 12, country: 'United States', child: { state: 'Active' } },
        { name: 'Jill', email: 'jill@email.com', age: 15, child: { state: 'Active' } },
        { name: 'Henry', email: 'henry@email.com', age: 10, child: { state: 'Active' } },
        { name: 'Meg', email: 'meg@email.com', age: 7, country: null, child: { state: 'Active' } },
        { name: 'Samantha', email: 'samantha@email.com', age: 30, country: 'United States', child: { state: 'Active' } },
        { name: 'Amalie', email: 'amalie@email.com', age: 12, country: 'Argentina', child: { state: 'Active' } },
        { name: 'Estefanía', email: 'estefania@email.com', age: 21, country: 'Argentina', child: { state: 'Active' } },
        { name: 'Adrian', email: 'adrian@email.com', age: 21, country: 'Ecuador', child: { state: 'Active' } },
        { name: 'Wladimir', email: 'wladimir@email.com', age: 30, country: 'Ecuador', child: { state: 'Inactive' } },
        { name: 'Natasha', email: 'natasha@email.com', age: 54, country: 'Ecuador', child: { state: 'Inactive' } },
        { name: 'Nicole', email: 'nicole@email.com', age: 43, country: 'Colombia', child: { state: 'Inactive' } },
        { name: 'Michael', email: 'michael@email.com', age: 15, country: 'Colombia', child: { state: 'Inactive' } },
        { name: 'Nicolás', email: 'nicole@email.com', age: 43, country: 'Colombia', child: { state: 'Inactive' } }
    ];

    accounts2 = this.accounts.slice();
    selectedAccount2 = ['Natasha'];
    groupByFn = (item) => item.child.state;

    accounts3 = this.accounts.slice();
    selectedAccount3 = this.accounts3[1];

    ngOnInit() {

    }
}


