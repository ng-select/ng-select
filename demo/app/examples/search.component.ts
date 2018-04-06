import { Component, EventEmitter, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { distinctUntilChanged, debounceTime, switchMap } from 'rxjs/operators'
import { DataService, Person } from '../shared/data.service';


@Component({
    selector: 'select-search',
    changeDetection: ChangeDetectionStrategy.Default,
    template: `
        <h5>Default search</h5>
        <hr>
        <p>
            By default ng-select will search using label text. You can also use <b>loading</b> input to set 
            loading state manually if <b>[typeahead]</b> is not used.
        </p>
        ---html,true
        <ng-select [items]="people"
                   bindLabel="name"
                   [loading]="peopleLoading"
                   [(ngModel)]="selectedPerson">
        </ng-select>
        ---
        <br/>

        <h5>Search across multiple fields using <b>[searchFn]</b></h5>
        <hr>
        <p>Use <b>typeahead</b> to get search term and filter on custom fields. Type <b>female</b> to see only females.</p>

        ---html,true
        <ng-select [items]="peopleFiltered"
                   bindLabel="name"
                   [searchFn]="customSearchFn"
                   (close)="peopleFiltered = people"
                   [(ngModel)]="selectedCustom">
                <ng-template ng-option-tmp let-item="item">
                    {{item.name}} <br />
                    <small>{{item.gender}}</small>
                </ng-template>
        </ng-select>
        ---
        <br/>
        
       
        <h5>Custom server-side search</h5>
        <hr>
        <p>Use <b>typeahead</b> to subscribe to search term and load async items.
        Loading state is automatically set when filter value changes.</p>
        <label>Multi select + Typeahead + Custom items (tags)</label>
        ---html,true
        <ng-select [items]="serverSideFilterItems"
                   bindLabel="name"
                   [addTag]="true"
                   [multiple]="true"
                   [hideSelected]="true"
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

    people: Person[] = [];
    peopleFiltered = [];
    serverSideFilterItems = [];
    
    peopleTypeahead = new EventEmitter<string>();
    selectedPersons: Person[] = <any>[{name: 'Karyn Wright'}, {name: 'Other'}];
    selectedPerson: Person;
    selectedCustom: Person;

    peopleLoading = false;

    constructor(private dataService: DataService, private cd: ChangeDetectorRef) { }

    ngOnInit() {
        this.loadPeopleForClientSide();
        this.serverSideSearch();
    }

    customSearchFn(term: string, item: Person) {
        term = term.toLocaleLowerCase();
        return item.name.toLocaleLowerCase().indexOf(term) > -1 || item.gender.toLocaleLowerCase() === term;
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


