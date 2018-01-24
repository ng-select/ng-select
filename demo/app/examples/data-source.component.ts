import { Component, ChangeDetectionStrategy } from '@angular/core';
import { DataService, Person } from '../shared/data.service';
import { Observable } from 'rxjs/Observable';

@Component({
    selector: 'select-search',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <p>
            Most common case is showing data from some backend
            API and with ng-select this is extremely simple when using angular <b> | async</b> pipe
        </p>
        ---html,true
        <ng-select [items]="peopleObservable | async"
                   bindLabel="name"
                   bindValue="id"
                   [(ngModel)]="selectedPersonId">
        </ng-select>
        ---
        <br />Selected: {{selectedPersonId}}

        <hr />
        <p>
            You can also set plain array as  items input
        </p>
        ---html,true
        <ng-select [items]="people"
                   bindLabel="name"
                   bindValue="id"
                   [(ngModel)]="selectedPersonId">
        </ng-select>
        ---
        <br />Selected: {{selectedPersonId}}

        <hr />
        <p>
            While array of objecs is the most common items source you may want to set simple array of strings
        </p>
        ---js
        items = ['One', 'Two', 'Three'];
        ---
        ---html,true
        <ng-select [items]="simpleItems"
                   [(ngModel)]="selectedSimpleItem">
        </ng-select>
        ---
        <br />Selected: {{selectedSimpleItem}}
    `
})
export class DataSourceComponent {
    peopleObservable: Observable<Person[]>;
    people: Person[] = [];
    selectedPersonId = '5a15b13c36e7a7f00cf0d7cb';

    selectedSimpleItem = 'Two';
    simpleItems = [];

    constructor(private dataService: DataService) { }

    ngOnInit() {
        this.peopleObservable = this.dataService.getPeople();
        this.dataService.getPeople().subscribe(items => this.people = items);
        this.simpleItems = ['One', 'Two', 'Three'];
    }
}


