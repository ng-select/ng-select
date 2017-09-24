import { Component, EventEmitter } from '@angular/core';

@Component({
    selector: 'select-search',
    template: `
        <label>Search in label text (default)</label>
        <ng-select [items]="companies"
                   bindLabel="name"
                   [(ngModel)]="selectedCompany">
        </ng-select>
        <p>
            Selected value: {{selectedCompany | json}}
        </p>

        <label>Search using custom filter handler (search for Rooforia)</label>
        <ng-select [items]="filteredCompanies2"
                   bindLabel="name"
                   [typeahead]="customFilter"
                   [(ngModel)]="selectedCompany2">
        </ng-select>
        <p>
            Selected value: {{selectedCompany2 | json}}
        </p>
    `
})
export class SelectSearchComponent {

    companies: any[] = [];
    companies2: any[] = [];
    filteredCompanies2 = [];
    selectedCompany: any;
    selectedCompany2?: any;

    customFilter = new EventEmitter<string>();

    /* tslint:disable */
    companiesNames = ['Miškas', 'Žalias', 'Flexigen', 'Rooforia', 'Rooblia', 'Tropoli', 'Eargo', 'Gadtron', 'Elentrix', 'Terragen', 'Medalert', 'Xelegyl', 'Bristo', 'Xylar', 'Imperium', 'Kangle', 'Earwax', 'Zanity', 'Portico', 'Tsunamia', 'Kage', 'Comstar', 'Radiantix', 'Bostonic', 'Geekko', 'Eventex', 'Stockpost', 'Silodyne', 'Enersave', 'Perkle', 'Pyramis', 'Accuprint', 'Papricut', 'Pathways', 'Circum', 'Gology', 'Buzzworks', 'Dancerity', 'Zounds', 'Diginetic', 'Snips', 'Chillium', 'Exotechno', 'Accufarm', 'Vidto', 'Signidyne', 'Escenta', 'Sureplex', 'Quarmony', 'Interfind', 'Exoswitch', 'Mondicil', 'Pyramia', 'Digitalus', 'Earthplex', 'Limozen', 'Twiist', 'Tubalum', 'Securia', 'Uni', 'Biospan', 'Zensus', 'Memora'];
    /* tslint:enable */

    ngOnInit() {
        this.companiesNames.forEach((c, i) => {
            this.companies.push({id: i, name: c});
            this.companies2.push({id: i, name: c});
        });

        this.filteredCompanies2 = [...this.companies2];

        this.customFilter.subscribe(term => {
            this.filteredCompanies2 = term ? this.companies2.filter(x => term === 'Rooforia' && x.name === term) : this.companies2;
        });
    }
}


