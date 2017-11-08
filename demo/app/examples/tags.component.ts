import { Component, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Component({
    selector: 'select-tags',
    template: `
        <label>Default tags</label>
        ---html,true
        <ng-select [items]="companies"
                [addTag]="true"
                bindLabel="name"
                [(ngModel)]="selectedCompany">
        </ng-select>
        ---
        <p>
            Selected value: {{selectedCompany | json}}
        </p>
        <hr>

        <label>Custom tags</label>
        ---html,true
        <ng-select [items]="companies"
                [addTag]="addTag"
                multiple="true"
                bindLabel="name"
                [(ngModel)]="selectedCompanyCustom">
        </ng-select>
        ---
        <p>
            Selected value: {{selectedCompanyCustom | json}}
        </p>
        <hr>
    `
})
export class SelectTagsComponent {

    companies: any[] = [];

    companiesNames = ['Miškas', 'Žalias', 'Flexigen'];

    ngOnInit() {
        this.companiesNames.forEach((c, i) => {
            this.companies.push({ id: i, name: c });
        });
    }

    addTag = (name) => {
        return { name: name, tag: true };
    }
}


