import {Component} from '@angular/core';

@Component({
    selector: 'select-search',
    template: `
        <label>Search in text value (TODO)</label>
        <ang-select [items]="companies"
                    bindText="name"
                    allowSearch="true"
                    [(ngModel)]="selectedCompany">
        </ang-select>
        <p>
            Selected value: {{selectedCompany | json}}
        </p>
    `
})
export class SelectSearchComponent {

    companies: any[] = [];
    selectedCompany: any;
    /* tslint:disable */
    companiesNames = ['Flexigen', 'Rooforia', 'Tropoli', 'Eargo', 'Gadtron', 'Elentrix', 'Terragen', 'Medalert', 'Xelegyl', 'Bristo', 'Xylar', 'Imperium', 'Kangle', 'Earwax', 'Zanity', 'Portico', 'Tsunamia', 'Kage', 'Comstar', 'Radiantix', 'Bostonic', 'Geekko', 'Eventex', 'Stockpost', 'Silodyne', 'Enersave', 'Perkle', 'Pyramis', 'Accuprint', 'Papricut', 'Pathways', 'Circum', 'Gology', 'Buzzworks', 'Dancerity', 'Zounds', 'Diginetic', 'Snips', 'Chillium', 'Exotechno', 'Accufarm', 'Vidto', 'Signidyne', 'Escenta', 'Sureplex', 'Quarmony', 'Interfind', 'Exoswitch', 'Mondicil', 'Pyramia', 'Digitalus', 'Earthplex', 'Limozen', 'Twiist', 'Tubalum', 'Securia', 'Uni', 'Biospan', 'Zensus', 'Memora'];
    /* tslint:enable */
    ngOnInit() {
        this.companiesNames.forEach((c, i) => {
            this.companies.push({id: i, name: c});
        });
    }

}


