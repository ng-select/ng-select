import { Component, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/of';
import { DataService } from '../shared/data.service';

@Component({
    selector: 'select-search',
    template: `
        <h5>Default search</h5>
        <hr>
        <p>
            By default ng-select will search in visible label text
        </p>
        ---html,true
        <ng-select [items]="clientSideFilterItems"
                   bindLabel="name"
                   [(ngModel)]="selectedPerson1">
        </ng-select>
        ---
        <p>
            Selected person: {{selectedPerson1 | json}}
        </p>

        <h5>Custom search</h5>
        <hr>
        <p>Use <b>typeahead</b> Input to subscribe to user term and load items</p>
        <label>Multi select + Typeahead</label>
        ---html,true
        <ng-select [items]="serverSideFilterItems"
                   bindLabel="name"
                   [multiple]="true"
                   [typeahead]="peopleTypeahead"
                   [(ngModel)]="selectedPerson2">
        </ng-select>
        ---

        <p>
            Selected person: {{selectedPerson2 | json}}
        </p>
    `
})
export class SelectSearchComponent {

    clientSideFilterItems = [];
    selectedPerson1 = null;

    serverSideFilterItems = [];
    peopleTypeahead = new EventEmitter<string>();
    selectedPerson2 = null;

    constructor(private dataService: DataService) {}

    ngOnInit() {
        this.loadPeopleForClientSide();
        this.serverSideFilter();
    }

    private loadPeopleForClientSide() {
        this.dataService.getPeople().subscribe(x => this.clientSideFilterItems = x);
    }

    private serverSideFilter() {
        this.peopleTypeahead
        .distinctUntilChanged()
        .debounceTime(200)
        .switchMap(term => this.dataService.getPeople(term))
        .subscribe(x => {
            this.serverSideFilterItems = x;
        }, (err) => {
            console.log(err);
            this.serverSideFilterItems = [];
        });
    }
}


