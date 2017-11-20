import { Component } from '@angular/core';
import { NgOption } from '@ng-select/ng-select';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Component({
    template: `
        <label>Select multiple elements</label>
        ---html,true
        <ng-select
                [items]="companiesNames"
                [multiple]="true"
                [(ngModel)]="selectedCompanies">
        </ng-select>
        ---
        <p>
            Selected value: {{selectedCompanies | json}} <br>
            <button (click)="clearModel()" class="btn btn-secondary btn-sm">Clear model</button>
        </p>
        <hr/>

        <label>Disabled multiple elements</label>
        ---html,true
        <ng-select
                [items]="companies"
                bindLabel="name"
                [multiple]="true"
                [disabled]="disable"
                [(ngModel)]="selectedCompaniesDisabled">
        </ng-select>
        ---
        <br>
        <button class="btn btn-secondary btn-sm" (click)="disable = !disable">Toggle disabled</button>
        <hr/>
        <label>Custom label templates</label>
        ---html,true
        <ng-select
            [items]="users"
            [multiple]="true"
            [(ngModel)]="selectedUsers">

            <ng-template ng-label-tmp let-item="item" let-clear="clear">
                <div class="ng-value-wrapper default">
                    <span class="ng-value-label"><img [src]="item.avatar_url" width="20px" height="20px"> {{item.login}}</span>
                    <span class="ng-value-icon right" (click)="clear(item)" aria-hidden="true">×</span>
                </div>
            </ng-template>

            <ng-template ng-option-tmp let-item="item">
                <img [src]="item.avatar_url" width="20px" height="20px"> {{item.login}}
            </ng-template>
        </ng-select>
        ---
    `
})
export class SelectMultiComponent {

    users: any[] = [];
    companies: any[] = [];
    selectedCompanies: any;
    selectedCompaniesDisabled: any;
    disable = true;

    /* tslint:disable */
    companiesNames = ['Miškas', 'Žalias', 'Flexigen', 'Rooforia', 'Rooblia', 'Tropoli', 'Eargo', 'Gadtron', 'Elentrix', 'Terragen', 'Medalert', 'Xelegyl', 'Bristo', 'Xylar', 'Imperium', 'Kangle', 'Earwax', 'Zanity', 'Portico', 'Tsunamia', 'Kage', 'Comstar', 'Radiantix', 'Bostonic', 'Geekko', 'Eventex', 'Stockpost', 'Silodyne', 'Enersave', 'Perkle', 'Pyramis', 'Accuprint', 'Papricut', 'Pathways', 'Circum', 'Gology', 'Buzzworks', 'Dancerity', 'Zounds', 'Diginetic', 'Snips', 'Chillium', 'Exotechno', 'Accufarm', 'Vidto', 'Signidyne', 'Escenta', 'Sureplex', 'Quarmony', 'Interfind', 'Exoswitch', 'Mondicil', 'Pyramia', 'Digitalus', 'Earthplex', 'Limozen', 'Twiist', 'Tubalum', 'Securia', 'Uni', 'Biospan', 'Zensus', 'Memora'];
    /* tslint:enable */

    constructor(private http: HttpClient) { }

    ngOnInit() {
        this.companiesNames.forEach((c, i) => {
            this.companies.push({ id: i, name: c });
        });

        this.selectedCompaniesDisabled = [{ id: 0, name: 'Miškas' }, { id: 1, name: 'Žalias' }];
        this.loadGithubUsers('anjm').subscribe(users => {
            this.users = users;
        })
    }

    clearModel() {
        this.selectedCompanies = [];
    }

    loadGithubUsers(term: string): Observable<any[]> {
        return this.http.get<any>(`https://api.github.com/search/users?q=${term}`).map(rsp => rsp.items);
    }
}


