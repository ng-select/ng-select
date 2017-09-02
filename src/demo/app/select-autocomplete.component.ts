import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Component({
    selector: 'select-autocomplete',
    template: `        
        <label>Search with autocomplete in Github accounts</label>
        <ng-select bindLabel="login"
                   bindValue="this"
                   [items]="users"
                   (search)="loadGithubUsers($event)"
                   [itemsFunc]="loadGithubUsers.bind(this)"
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
    users: any[];

    constructor(private http: HttpClient) { }

    loadGithubUsers(event: { term: string }) {
        this.http.get<any>(`https://api.github.com/search/users?q=${event.term}`).subscribe(rsp => {
            this.users = rsp.items;
        });
    }
}


