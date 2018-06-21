import { Component, ViewEncapsulation } from '@angular/core';
import { DataService, Person } from '../shared/data.service';
import { map } from 'rxjs/operators';

@Component({
    encapsulation: ViewEncapsulation.None,
    template: `
        <label>Select multiple elements using custom templates with checkboxes.</label>
        ---html,true
        <ng-select
                #ref
                class="multichebox-select"
                [items]="people"
                [multiple]="true"
                bindLabel="name"
                groupBy="gender"
                [selectableGroup]="true"
                [closeOnSelect]="false"
                bindValue="id"
                [(ngModel)]="selectedPeople1">
            <ng-template ng-optgroup-tmp let-item="item" let-item$="item$" let-index="index">
                <input id="item-{{index}}" type="checkbox" [ngModel]="item$.selected" /> {{item.gender}}
            </ng-template>
            <ng-template ng-option-tmp let-item="item" let-item$="item$" let-index="index">
                <input id="item-{{index}}" type="checkbox" [ngModel]="item$.selected" /> {{item.name}}
            </ng-template>
        </ng-select>
        ---
        <br />
        <small>{{selectedPeople1 | json}}</small>
    `
})
export class SelectMultiCheckboxComponent {

    people: Person[] = [];
    selectedPeople1 = [];

    constructor(private dataService: DataService) { }

    ngOnInit() {
        this.dataService.getPeople()
        .pipe(map(x => x.filter(y => !y.disabled)))
        .subscribe((res) => {
            this.people = res;
            this.selectedPeople1 = [this.people[0].id, this.people[1].id];
        });
    }
}
