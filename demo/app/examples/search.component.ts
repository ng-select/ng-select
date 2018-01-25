import { Component, EventEmitter, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { distinctUntilChanged, debounceTime, switchMap } from 'rxjs/operators'
import { DataService } from '../shared/data.service';

@Component({
    selector: 'select-search',
    changeDetection: ChangeDetectionStrategy.Default,
    template: `
        <h5>Default search</h5>
        <hr>
        <p>
            By default ng-select will search using label text. You can also use <b>loading</b> input to set loading state manually.
        </p>
        ---html,true
        <ng-select [items]="people"
                   bindLabel="name"
                   [loading]="peopleLoading"
                   [(ngModel)]="selectedPerson">
        </ng-select>
        ---
        <br/>

        <h5>Search across multiple fields</h5>
        <hr>
        <p>Use <b>typeahead</b> to get search term and filter on custom fields. Type <b>female</b> to see only females.</p>

        ---html,true
        <ng-select [items]="peopleFiltered"
                   bindLabel="name"
                   [typeahead]="searchTerm"
                   [(ngModel)]="selectedCustom">
        </ng-select>
        ---
        <br/>
        
       
        <h5>Custom server-side search</h5>
        <hr>
        <p>Use <b>typeahead</b> to subscribe to search term and load async items</p>
        <label>Multi select + Typeahead + Custom items (tags)</label>
        ---html,true
        <ng-select [items]="serverSideFilterItems"
                   bindLabel="name"
                   [addTag]="true"
                   [multiple]="true"
                   [typeahead]="peopleTypeahead"
                   [(ngModel)]="selectedPersons">
        </ng-select>
        ---

        <p style="margin-bottom:300px">
            Selected persons: {{selectedPersons | json}}
        </p>
    `
})
export class SelectSearchComponent {

    people = [];
    peopleFiltered = [];
    serverSideFilterItems = [];

    searchTerm = new EventEmitter<string>();
    peopleTypeahead = new EventEmitter<string>();
    selectedPersons = [{
        name: 'Karyn Wright'
    }];

    peopleLoading = false;

    constructor(private dataService: DataService, private cd: ChangeDetectorRef) { }

    ngOnInit() {
        this.loadPeopleForClientSide();
        this.serverSideSearch();
        this.searchTerm.subscribe(term => this.customSearch(term));
    }

    private customSearch(searchTerm) {
        const term = searchTerm.toUpperCase();
        this.peopleFiltered = this.people.filter(item => item.name.toUpperCase().indexOf(term) > -1 || item.gender.toUpperCase() === term)
    }

    private serverSideSearch() {
        this.peopleTypeahead.pipe(
            distinctUntilChanged(),
            debounceTime(200),
            switchMap(term => this.dataService.getPeople(term))
        ).subscribe(x => {
            this.cd.markForCheck();
            this.serverSideFilterItems = x;
        }, (err) => {
            console.log(err);
            this.serverSideFilterItems = [];
        });
    }

    private loadPeopleForClientSide() {
        this.peopleLoading = true;
        this.dataService.getPeople().subscribe(x => {
            this.people = x;
            this.peopleFiltered = x;
            this.peopleLoading = false;
        });
    }
}


