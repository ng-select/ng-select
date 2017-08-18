import { Component } from '@angular/core';
import { NgOption } from 'ng-select';

@Component({
    template: `
        <label>Select multiple elements</label>
        <ng-select [items]="companies"
                    bindLabel="name"
                    bindValue="this"
                    multiple
                    [(ngModel)]="selectedCompany">
        </ng-select>
        <p>
            Selected value: {{selectedCompany | json}}
        </p>
    `
})
export class SelectMultiComponent {

    companies: any[] = [];
    selectedCompany: any;

    /* tslint:disable */
    companiesNames = ['Miškas', 'Žalias', 'Flexigen', 'Rooforia', 'Rooblia', 'Tropoli', 'Eargo', 'Gadtron', 'Elentrix', 'Terragen', 'Medalert', 'Xelegyl', 'Bristo', 'Xylar', 'Imperium', 'Kangle', 'Earwax', 'Zanity', 'Portico', 'Tsunamia', 'Kage', 'Comstar', 'Radiantix', 'Bostonic', 'Geekko', 'Eventex', 'Stockpost', 'Silodyne', 'Enersave', 'Perkle', 'Pyramis', 'Accuprint', 'Papricut', 'Pathways', 'Circum', 'Gology', 'Buzzworks', 'Dancerity', 'Zounds', 'Diginetic', 'Snips', 'Chillium', 'Exotechno', 'Accufarm', 'Vidto', 'Signidyne', 'Escenta', 'Sureplex', 'Quarmony', 'Interfind', 'Exoswitch', 'Mondicil', 'Pyramia', 'Digitalus', 'Earthplex', 'Limozen', 'Twiist', 'Tubalum', 'Securia', 'Uni', 'Biospan', 'Zensus', 'Memora'];
    /* tslint:enable */

    ngOnInit() {
        this.companiesNames.forEach((c, i) => {
            this.companies.push({ id: i, name: c });
        });
    }
}


