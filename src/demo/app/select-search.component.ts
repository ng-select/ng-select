import {Component} from '@angular/core';
import {AngOption} from 'ang-select';

@Component({
    selector: 'select-search',
    template: `
        <label>Search in label text (default)</label>
        <ang-select [items]="companies"
                    bindLabel="name"
                    bindValue="this"
                    [(ngModel)]="selectedCompany">
        </ang-select>
        <p>
            Selected value: {{selectedCompany | json}}
        </p>

        <label>Search using custom filter handler (try search for Roo)</label>
        <ang-select [items]="companies"
                    bindLabel="name"
                    bindValue="this"
                    [filterFunc]="customFilterFunc"
                    [(ngModel)]="selectedCompany2">
        </ang-select>
        <p>
            Selected value: {{selectedCompany2 | json}}
        </p>
    `
})
export class SelectSearchComponent {

    companies: any[] = [];
    selectedCompany: any;
    selectedCompany2?: any;
    /* tslint:disable */
    companiesNames = ['Miškas', 'Žalias', 'Flexigen', 'Rooforia', 'Rooblia', 'Tropoli', 'Eargo', 'Gadtron', 'Elentrix', 'Terragen', 'Medalert', 'Xelegyl', 'Bristo', 'Xylar', 'Imperium', 'Kangle', 'Earwax', 'Zanity', 'Portico', 'Tsunamia', 'Kage', 'Comstar', 'Radiantix', 'Bostonic', 'Geekko', 'Eventex', 'Stockpost', 'Silodyne', 'Enersave', 'Perkle', 'Pyramis', 'Accuprint', 'Papricut', 'Pathways', 'Circum', 'Gology', 'Buzzworks', 'Dancerity', 'Zounds', 'Diginetic', 'Snips', 'Chillium', 'Exotechno', 'Accufarm', 'Vidto', 'Signidyne', 'Escenta', 'Sureplex', 'Quarmony', 'Interfind', 'Exoswitch', 'Mondicil', 'Pyramia', 'Digitalus', 'Earthplex', 'Limozen', 'Twiist', 'Tubalum', 'Securia', 'Uni', 'Biospan', 'Zensus', 'Memora'];

    /* tslint:enable */
    ngOnInit() {
        this.companiesNames.forEach((c, i) => {
            this.companies.push({id: i, name: c});
        });
    }

    customFilterFunc(term: string) {
        return (val: AngOption) => {
            return term && val.name.indexOf(term) > -1 && term.startsWith('Ro');
        };
    }

}


