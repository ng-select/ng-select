import { Component } from '@angular/core';
import { NgOption } from '@ng-select/ng-select';

@Component({
    template: `
        <label>Select multiple elements</label>
        <ng-select
                [items]="companies"
                bindLabel="name"
                [multiple]="true"
                [(ngModel)]="selectedCompanies">
        </ng-select>
        <p>
            Selected value: {{selectedCompanies | json}} <br>
            <button (click)="clearModel()" class="btn btn-secondary btn-sm">Clear model</button>
        </p>

        <label>Disabled multiple elements</label>
        <ng-select
                [items]="companies2"
                bindLabel="name"
                [multiple]="true"
                [disabled]="disable"
                [(ngModel)]="selectedCompaniesDisabled">
        </ng-select>
        <br>
        <button class="btn btn-secondary btn-sm" (click)="disable = !disable">Toggle disabled</button>
    `
})
export class SelectMultiComponent {

    companies: any[] = [];
    companies2: any[] = [];
    selectedCompanies: any;
    selectedCompaniesDisabled: any;
    disable = true;

    /* tslint:disable */
    companiesNames = ['Miškas', 'Žalias', 'Flexigen', 'Rooforia', 'Rooblia', 'Tropoli', 'Eargo', 'Gadtron', 'Elentrix', 'Terragen', 'Medalert', 'Xelegyl', 'Bristo', 'Xylar', 'Imperium', 'Kangle', 'Earwax', 'Zanity', 'Portico', 'Tsunamia', 'Kage', 'Comstar', 'Radiantix', 'Bostonic', 'Geekko', 'Eventex', 'Stockpost', 'Silodyne', 'Enersave', 'Perkle', 'Pyramis', 'Accuprint', 'Papricut', 'Pathways', 'Circum', 'Gology', 'Buzzworks', 'Dancerity', 'Zounds', 'Diginetic', 'Snips', 'Chillium', 'Exotechno', 'Accufarm', 'Vidto', 'Signidyne', 'Escenta', 'Sureplex', 'Quarmony', 'Interfind', 'Exoswitch', 'Mondicil', 'Pyramia', 'Digitalus', 'Earthplex', 'Limozen', 'Twiist', 'Tubalum', 'Securia', 'Uni', 'Biospan', 'Zensus', 'Memora'];
    /* tslint:enable */

    ngOnInit() {
        this.companiesNames.forEach((c, i) => {
            this.companies.push({ id: i, name: c });
            this.companies2.push({ id: i, name: c });
        });

        this.selectedCompaniesDisabled = [{ id: 0, name: 'Miškas' }, { id: 1, name: 'Žalias' }]
    }

    clearModel() {
        this.selectedCompanies = [];
    }
}


