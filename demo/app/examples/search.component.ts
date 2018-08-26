import { ChangeDetectionStrategy, Component } from '@angular/core';
import { concat, Observable, of, Subject } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, switchMap, tap } from 'rxjs/operators';

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
                   [loading]="peopleLoading">
        </ng-select>
        ---
        <br/>

        <h5>Search across multiple fields using <b>[searchFn]</b></h5>
        <hr>
        <p>Use search term and filter on custom fields. Type <b>female</b> to see only females.</p>

        ---html,true
        <ng-select [items]="people2"
                   bindLabel="name"
                   [loading]="people2Loading"
                   [searchFn]="customSearchFn">
                <ng-template ng-option-tmp let-item="item">
                    {{item.name}} <br />
                    <small>{{item.gender}}</small>
                </ng-template>
        </ng-select>
        ---
        <br/>
        
       
        <h5>Custom server-side search</h5>
        <hr>
        <p>Use <b>typeahead</b> to subscribe to search term and load async items.</p>
        <label>Multi select + Typeahead + Custom items (tags)</label>
        ---html,true
        <ng-select [items]="people3$ | async"
                   bindLabel="name"
                   [addTag]="true"
                   [multiple]="true"
                   [hideSelected]="true"
                   [loading]="people3Loading"
                   [typeahead]="people3input$"
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
    peopleLoading = false;

    people2: Person[] = [];
    people2Loading = false;

    people3$: Observable<Person[]>;
    people3Loading = false;
    people3input$ = new Subject<string>();
    selectedPersons: Person[] = <any>[{ name: 'Karyn Wright' }, { name: 'Other' }];

    constructor(private dataService: DataService) { }

    ngOnInit() {
        this.loadPeople();
        this.loadPeople2();
        this.loadPeople3();
    }

    customSearchFn(term: string, item: Person) {
        term = term.toLocaleLowerCase();
        return item.name.toLocaleLowerCase().indexOf(term) > -1 || item.gender.toLocaleLowerCase() === term;
    }

    private loadPeople() {
        this.peopleLoading = true;
        this.dataService.getPeople().subscribe(x => {
            this.people = x;
            this.peopleLoading = false;
        });
    }

    private loadPeople2() {
        this.people2Loading = true;
        this.dataService.getPeople().subscribe(x => {
            this.people2 = x;
            this.people2Loading = false;
        });
    }

    private loadPeople3() {
        this.people3$ = concat(
            of([]), // default items
            this.people3input$.pipe(
               debounceTime(200),
               distinctUntilChanged(),
               tap(() => this.people3Loading = true),
               switchMap(term => this.dataService.getPeople(term).pipe(
                   catchError(() => of([])), // empty list on error
                   tap(() => this.people3Loading = false)
               )) 
            )
        );
    }
}


