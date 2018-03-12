import { Component, ChangeDetectionStrategy, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { DataService } from '../shared/data.service';
import { distinctUntilChanged, debounceTime, switchMap } from 'rxjs/operators'


@Component({
    selector: 'select-with-templates',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <label>Custom label</label>
        ---html,true
        <ng-select [items]="cities" [(ngModel)]="selectedCity" bindLabel="name" bindValue="name">
            <ng-template ng-label-tmp let-item="item">
                <img height="15" width="15" [src]="item.avatar"/>
                {{item.name}}
            </ng-template>
        </ng-select>
        ---
        <p>
            Selected city name: {{selectedCity}}
        </p>
        <hr>

        <label>Custom option</label>
        ---html,true
        <ng-select [items]="cities2" [(ngModel)]="selectedCity2" bindLabel="name" bindValue="name">
            <ng-template ng-option-tmp let-item="item" let-index="index" let-search="searchTerm">
                <div *ngIf="item.name === 'Kaunas'">{{item.name}}</div>
                <div class="card" *ngIf="item.name !== 'Kaunas'">
                    <div class="card-body">
                        <h5 class="card-title" [innerHTML]="item.name" [ngOptionHighlight]="search"></h5>
                        <h6 class="card-subtitle mb-2 text-muted">Card subtitle</h6>
                        <p class="card-text">
                            <img height="15" width="15" [src]="item.avatar"/>
                            Some quick example text to build
                        </p>
                        <div *ngIf="item.name === 'Pavilnys'">
                            <a href="#" class="card-link">Card link</a>
                            <a href="#" class="card-link">Another link</a>
                        </div>
                    </div>
                </div>
            </ng-template>
        </ng-select>
        ---
        <p>
            Selected city name: {{selectedCity2}}
        </p>
        <hr>

        <label>Custom label and option and optgroup</label>
        ---html,true
        <ng-select [items]="cities3" groupBy="avatar" [(ngModel)]="selectedCity3" bindLabel="name" bindValue="name">
            <ng-template ng-label-tmp let-item="item">
                <img height="15" width="15" [src]="item.avatar"/>
                <b>{{item.name}}</b>
            </ng-template>
            <ng-template ng-optgroup-tmp let-item="item" let-index="index">
                <img height="15" width="15" [src]="item.avatar"/>
                <b [innerHTML]="item.name"></b>
            </ng-template>
            <ng-template ng-option-tmp let-item="item" let-index="index" let-search="searchTerm">
                <b [innerHTML]="item.name" [ngOptionHighlight]="search"></b>
            </ng-template>
        </ng-select>
        ---
        <p>
            Selected city name: {{selectedCity3}}
        </p>
        <hr>

        <label>Custom header and footer</label>
        ---html,true
        <ng-select
            [multiple]="true"
            [items]="people"
            [(ngModel)]="selectedPeople"
            placeholder="Select people"
            bindLabel="name"
            bindValue="name">
            <ng-template ng-header-tmp>
                <button (click)="selectAll()" class="btn btn-sm btn-secondary">Select all</button>
                <button (click)="unselectAll()" class="btn btn-sm btn-secondary">Unselect all</button>
            </ng-template>
            <ng-template ng-footer-tmp>
                Selected count: {{selectedPeople.length}}
            </ng-template>
        </ng-select>
        ---
        <p>
            Selected people: {{selectedPeople}}
        </p

        <label>Custom not found ,  type to search and loading </label>
        ---html,true
        <ng-select
            [multiple]="true"
            [items]="serverSideFilterItems"
            [(ngModel)]="selectedPeople"
            placeholder="Select people"
            bindLabel="name"
            bindValue="name"
            [typeahead]="peopleTypeahead">
            <ng-template ng-typetosearch-tmp>
                <div class="ng-option disabled">
                    Start typing...
                </div>
            </ng-template>
            <ng-template ng-notfound-tmp let-searchTerm="searchTerm">

                <div class="ng-option disabled">
                    No data found for "{{searchTerm}}"
                </div>
            </ng-template>
            <ng-template ng-loadingtext-tmp let-searchTerm="searchTerm">

                <div class="ng-option disabled">
                    Fetching Data for "{{searchTerm}}"
                </div>
            </ng-template>
        </ng-select>
        ---
        <p>
            Selected people: {{selectedPeople}}
        </p>

        <hr />

        <label>Custom search</label>
        ---html,true
        <ng-select [items]="cities" [(ngModel)]="selectedCity" bindLabel="name" bindValue="name">
            <ng-template ng-header-tmp let-api="api">
                <input style="width: 100%" type="text" (input)="api.filter($event.target.value)" />
            </ng-template>
        </ng-select>
        ---
    `
})
export class SelectWithTemplatesComponent {

    cities = [
        {id: 1, name: 'Vilnius', avatar: '//www.gravatar.com/avatar/b0d8c6e5ea589e6fc3d3e08afb1873bb?d=retro&r=g&s=30 2x'},
        {id: 2, name: 'Kaunas', avatar: '//www.gravatar.com/avatar/ddac2aa63ce82315b513be9dc93336e5?d=retro&r=g&s=15'},
        {id: 3, name: 'Pavilnys', avatar: '//www.gravatar.com/avatar/6acb7abf486516ab7fb0a6efa372042b?d=retro&r=g&s=15'},
        {id: 4, name: 'Siauliai', avatar: '//www.gravatar.com/avatar/b0d8c6e5ea589e6fc3d3e08afb1873bb?d=retro&r=g&s=30 2x'},
    ];

    cities2 = this.cities.slice();
    cities3 = this.cities.slice();
    cities4 = this.cities.slice();

    selectedCity = this.cities[0].name;
    selectedCity2 = this.cities2[1].name;
    selectedCity3 = this.cities3[2].name;

    people = [];
    selectedPeople = [];
    serverSideFilterItems = [];

    peopleTypeahead = new EventEmitter<string>();

    constructor(private dataService: DataService, private cd: ChangeDetectorRef) {}

    ngOnInit() {
        this.dataService.getPeople().subscribe(items => {
            this.people = items;
        });
        this.serverSideSearch();
    }

    selectAll() {
        this.selectedPeople = this.people.map(x => x.name);
    }

    unselectAll() {
        this.selectedPeople = [];
    }

    private serverSideSearch() {
        this.peopleTypeahead.pipe(
            distinctUntilChanged(),
            debounceTime(300),
            switchMap(term => this.dataService.getPeople(term))
        ).subscribe(x => {
            this.cd.markForCheck();
            this.serverSideFilterItems = x;
        }, (err) => {
            console.log(err);
            this.serverSideFilterItems = [];
        });
    }
}

