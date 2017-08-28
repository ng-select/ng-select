import { Component } from '@angular/core';
import { NgOption } from '@ng-select/ng-select';
import { Subject } from 'rxjs/Subject';
import { HttpClient } from '@angular/common/http';

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

        <label>Search with autocomplete from server side</label>
        <ng-select [items]="todos"
                   bindLabel="title"
                   bindValue="id"
                   [autoComplete]="todoListFilter"
                   [(ngModel)]="selectedTodoId">
        </ng-select>
        <p>
            Selected value: {{selectedTodoId}}
        </p>
    `
})
export class SelectSearchComponent {

    companies: any[] = [];
    companies2: any[] = [];
    selectedCompany: any;
    selectedCompany2?: any;

    todos: any[] = [];
    selectedTodoId: number;

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

        this.todoListFilter
            .distinctUntilChanged()
            .debounceTime(200)
            .subscribe(val => {
                this.loadTodos(val);
            });
    }

    customFilterFunc(term: string) {
        return (val: NgOption) => {
            return term === 'Rooforia' && val.name === term;
        };
    }

    private loadTodos(term: string) {
        this.http.get<any[]>('https://jsonplaceholder.typicode.com/todos').subscribe(rsp => {
            console.log('term', term);
            console.log('loaded todos', rsp.length);
            this.todos = term ? rsp.filter(x => x.title.indexOf(term) > -1) : rsp;
            console.log('filtered todos', this.todos);
        });
    }

}


