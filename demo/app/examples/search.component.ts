import { Component, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/of';

@Component({
    selector: 'select-search',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <h5>Client side</h5>
        <hr>
        <label>Search in label text (default)</label>
        ---html,true
        <ng-select [items]="companies"
                   bindLabel="name"
                   [(ngModel)]="selectedCompany">
        </ng-select>
        ---
        <p>
            Selected value: {{selectedCompany | json}}
        </p>

        <label>Search using custom filter handler (search for Rooforia)</label>
        ---html,true
        <ng-select [items]="filteredCompanies2"
                   bindLabel="name"
                   [typeahead]="customFilter"
                   [(ngModel)]="selectedCompany2">
        </ng-select>
        ---
        <p>
            Selected value: {{selectedCompany2 | json}}
        </p>

        <h5>Server side</h5>
        <hr>
        <label>Search with autocomplete in Github accounts</label>
        ---html,true
        <ng-select [items]="items"
                   notFoundText="No results found"
                   typeToSearchText="Search for github account"
                   bindLabel="login"
                   [placeholder]="placeholder"
                   [multiple]="multiple"
                   [typeahead]="typeahead"
                   [(ngModel)]="githubAccount">
            <ng-template ng-option-tmp let-item="item">
                <img [src]="item.avatar_url" width="20px" height="20px"> {{item.login}}
            </ng-template>
        </ng-select>
        ---
        <br>
        <button class="btn btn-secondary btn-sm" (click)="toggleMultiple()">Toggle multiple</button>
        <p>
            Selected github account:
            <span *ngIf="githubAccount">
                <img [src]="githubAccount.avatar_url" width="20px" height="20px"> {{githubAccount.login}}
            </span>
        </p>
    `
})
export class SelectSearchComponent {

    companies: any[] = [];
    companies2: any[] = [];
    filteredCompanies2 = [];
    selectedCompany: any;
    selectedCompany2?: any;
    githubAccount = {
        avatar_url: 'https://avatars0.githubusercontent.com/u/3028012?v=4',
        login: 'anjmao'
    };
    items = [];
    typeahead = new EventEmitter<string>();
    placeholder = 'Type in me. I am single';
    multiple = false;

    customFilter = new EventEmitter<string>();

    /* tslint:disable */
    companiesNames = ['Miškas', 'Žalias', 'Flexigen', 'Rooforia', 'Rooblia', 'Tropoli', 'Eargo', 'Gadtron', 'Elentrix', 'Terragen', 'Medalert', 'Xelegyl', 'Bristo', 'Xylar', 'Imperium', 'Kangle', 'Earwax', 'Zanity', 'Portico', 'Tsunamia', 'Kage', 'Comstar', 'Radiantix', 'Bostonic', 'Geekko', 'Eventex', 'Stockpost', 'Silodyne', 'Enersave', 'Perkle', 'Pyramis', 'Accuprint', 'Papricut', 'Pathways', 'Circum', 'Gology', 'Buzzworks', 'Dancerity', 'Zounds', 'Diginetic', 'Snips', 'Chillium', 'Exotechno', 'Accufarm', 'Vidto', 'Signidyne', 'Escenta', 'Sureplex', 'Quarmony', 'Interfind', 'Exoswitch', 'Mondicil', 'Pyramia', 'Digitalus', 'Earthplex', 'Limozen', 'Twiist', 'Tubalum', 'Securia', 'Uni', 'Biospan', 'Zensus', 'Memora'];
    /* tslint:enable */

    constructor(private http: HttpClient) {
        this.typeahead
            .distinctUntilChanged()
            .debounceTime(200)
            .switchMap(term => this.loadGithubUsers(term))
            .subscribe(items => {
                this.items = items;
            }, (err) => {
                console.log(err);
                this.items = [];
            });
    }

    ngOnInit() {
        this.companiesNames.forEach((c, i) => {
            this.companies.push({ id: i, name: c });
            this.companies2.push({ id: i, name: c });
        });

        this.filteredCompanies2 = [...this.companies2];

        this.customFilter.subscribe(term => {
            this.filteredCompanies2 = term ? this.companies2.filter(x => term === 'Rooforia' && x.name === term) : this.companies2;
        });
    }

    loadGithubUsers(term: string): Observable<any[]> {
        if (term) {
            return this.http.get<any>(`https://api.github.com/search/users?q=${term}`).map(rsp => rsp.items);
        } else {
            return Observable.of([]);
        }
    }

    toggleMultiple() {
        this.multiple = !this.multiple;
        this.placeholder = this.multiple ? 'Type in me. I am multiple.' : 'Type in me. I am single.';
    }
}


