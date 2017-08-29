import { Component } from '@angular/core';
import { NgOption } from '@ng-select/ng-select';
import { Subject } from 'rxjs/Subject';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Component({
    selector: 'select-search',
    template: `
        <label>Search in label text (default)</label>
        <ng-select [items]="companies"
                   bindLabel="name"
                   bindValue="this"
                   [(ngModel)]="selectedCompany">
        </ng-select>
        <p>
            Selected value: {{selectedCompany | json}}
        </p>

        <label>Search using custom filter handler (search for Rooforia)</label>
        <ng-select [items]="companies2"
                   bindLabel="name"
                   bindValue="this"
                   [filterFunc]="customFilterFunc"
                   [(ngModel)]="selectedCompany2">
        </ng-select>
        <p>
            Selected value: {{selectedCompany2 | json}}
        </p>

        <label>Search with autocomplete in Github accounts</label>
        <ng-select bindLabel="login"
                   bindValue="id"
                   [itemsFunc]="loadGithubUsers.bind(this)"
                   [(ngModel)]="selectedGithubAccountId">
        </ng-select>
        <p>
            Selected value: {{selectedGithubAccountId}}
        </p>
    `
})
export class SelectSearchComponent {

    companies: any[] = [];
    companies2: any[] = [];
    selectedCompany: any;
    selectedCompany2?: any;

    selectedGithubAccountId: number;

    todoListFilter = new Subject<string>();

    /* tslint:disable */
    companiesNames = ['Miškas', 'Žalias', 'Flexigen', 'Rooforia', 'Rooblia', 'Tropoli', 'Eargo', 'Gadtron', 'Elentrix', 'Terragen', 'Medalert', 'Xelegyl', 'Bristo', 'Xylar', 'Imperium', 'Kangle', 'Earwax', 'Zanity', 'Portico', 'Tsunamia', 'Kage', 'Comstar', 'Radiantix', 'Bostonic', 'Geekko', 'Eventex', 'Stockpost', 'Silodyne', 'Enersave', 'Perkle', 'Pyramis', 'Accuprint', 'Papricut', 'Pathways', 'Circum', 'Gology', 'Buzzworks', 'Dancerity', 'Zounds', 'Diginetic', 'Snips', 'Chillium', 'Exotechno', 'Accufarm', 'Vidto', 'Signidyne', 'Escenta', 'Sureplex', 'Quarmony', 'Interfind', 'Exoswitch', 'Mondicil', 'Pyramia', 'Digitalus', 'Earthplex', 'Limozen', 'Twiist', 'Tubalum', 'Securia', 'Uni', 'Biospan', 'Zensus', 'Memora'];
    /* tslint:enable */

    constructor(private http: HttpClient) {
    }

    ngOnInit() {
        this.companiesNames.forEach((c, i) => {
            this.companies.push({id: i, name: c});
            this.companies2.push({id: i, name: c});
        });
    }

    customFilterFunc(term: string) {
        return (val: NgOption) => {
            return term === 'Rooforia' && val.name === term;
        };
    }

    loadGithubUsers(term: string): Observable<any[]> {
        return this.http.get<any>(`https://api.github.com/search/users?q=${term}`).map(rsp => rsp.items);
    }

}


