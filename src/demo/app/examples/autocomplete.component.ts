import { Component, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Component({
    selector: 'select-autocomplete',
    template: `
        <label>Search with autocomplete in Github accounts</label>
        <ng-select [items]="items"
                   notFoundText="No results found"
                   typeToSearchText="Search for github account"
                   bindLabel="login"
                   [typeahead]="typeahead"
                   [(ngModel)]="githubAccount">

            <ng-template ng-option-tmp let-item="item">
                <img [src]="item.avatar_url" width="20px" height="20px"> {{item.login}}
            </ng-template>

        </ng-select>
        <p>
            Selected github account:
            <span *ngIf="githubAccount">
                <img [src]="githubAccount.avatar_url" width="20px" height="20px"> {{githubAccount.login}}
            </span>
        </p>
    `
})
export class SelectAutocompleteComponent {

    githubAccount: any;
    items = [];
    typeahead = new EventEmitter<string>();

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

    loadGithubUsers(term: string): Observable<any[]> {
        if (term) {
            return this.http.get<any>(`https://api.github.com/search/users?q=${term}`).map(rsp => rsp.items);
        } else {
            return Observable.of([]);
        }
    }
}


