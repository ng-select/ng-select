import { Component, ViewEncapsulation } from '@angular/core';
import { map } from 'rxjs/operators';

import { DataService, Person } from '../shared/data.service';

@Component({
    encapsulation: ViewEncapsulation.None,
    template: `
        <label>Select multiple elements using custom templates with checkboxes.</label>
        ---html,true
        <ng-select
                [items]="people"
                [multiple]="true"
                bindLabel="name"
                groupBy="gender"
                [selectableGroup]="true"
                [closeOnSelect]="false"
                bindValue="id"
                [(ngModel)]="selectedPeople">
            <ng-template ng-optgroup-tmp let-item="item" let-item$="item$" let-index="index">
                <input id="item-{{index}}" type="checkbox" [ngModel]="item$.selected" /> {{item.gender | uppercase}}
            </ng-template>
            <ng-template ng-option-tmp let-item="item" let-item$="item$" let-index="index">
                <input id="item-{{index}}" type="checkbox" [ngModel]="item$.selected" /> {{item.name}}
            </ng-template>
        </ng-select>
        ---
        <br />
        <small>{{selectedPeople | json}}</small>
    `
})
export class SelectMultiCheckboxComponent {

    people: Person[] = [];
    selectedPeople = [];

    constructor(private dataService: DataService) { }

    ngOnInit() {
        this.dataService.getPeople()
        .pipe(map(x => x.filter(y => !y.disabled)))
        .subscribe((res) => {
            this.people = res;
            this.selectedPeople = [this.people[0].id, this.people[1].id];
        });
    }
}
