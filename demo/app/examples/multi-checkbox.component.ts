import { Component, ViewEncapsulation } from '@angular/core';
import { DataService, Person } from '../shared/data.service';
import { map } from 'rxjs/operators';

@Component({
    styles: [
        `
        .multichebox-select .ng-dropdown-panel .ng-dropdown-panel-items .ng-option,
        .multichebox-select .ng-dropdown-panel .ng-dropdown-panel-items .ng-optgroup {
            padding: 0;
        }
        .multichebox-select .multichebox-option-label {
            display: block;
            padding: 8px 10px 8px 22px;
        }
        .multichebox-select .multichebox-option-group-label {
            display: block;
            padding: 8px 10px;
        }
        `
    ],
    encapsulation: ViewEncapsulation.None,
    template: `
        <label>Select multiple elements</label>
        ---html,true
        <ng-select
                class="multichebox-select"
                [items]="people"
                [multiple]="true"
                bindLabel="name"
                groupBy="gender"
                [selectableGroup]="true"
                [closeOnSelect]="false"
                bindValue="id"
                (add)="onItemSelect($event)"
                (remove)="onItemRemove($event)"
                [(ngModel)]="selectedPeople1">
            <ng-template ng-optgroup-tmp let-item="item" let-index="index">
                <label (click)="onLabelClick($event, item)" class="multichebox-option-group-label" for="item-{{index}}">
                    <input id="item-{{index}}" type="checkbox" [ngModel]="item.selected" /> {{item.gender}}
                </label>
            </ng-template>
            <ng-template ng-option-tmp let-item="item" let-index="index">
                <label (click)="onLabelClick($event, item)" class="multichebox-option-label" for="item-{{index}}">
                    <input id="item-{{index}}" type="checkbox" [ngModel]="item.selected" /> {{item.name}}
                </label>
            </ng-template>
        </ng-select>
        ---
        <br />
        <small>{{selectedPeople1 | json}}</small>
        <input id="item-{{index}}" type="checkbox" [ngModel]="selected" /> {{selected}}
    `
})
export class SelectMultiCheckboxComponent {

    people: Person[] = [];
    selectedPeople1 = [];
    selected = true

    constructor(private dataService: DataService) { }

    ngOnInit() {
        this.dataService.getPeople()
        .pipe(map(x => x.filter(y => !y.disabled)))
        .subscribe((res) => {
            this.people = res;
            this.people[0].selected = true;
            this.selectedPeople1 = [this.people[0].id]
        });
    }

    onItemSelect($event: any) {
        console.log('onItemSelect', $event);
        // $event.selected = true;
    }

    onItemRemove($event: any) {
        console.log('onItemRemove', $event);
    }

    onLabelClick($event, item) {
        $event.preventDefault();
        item.selected = !item.selected;
    }
}
