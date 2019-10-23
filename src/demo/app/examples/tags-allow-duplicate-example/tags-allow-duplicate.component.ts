import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'tags-allow-duplicate-example',
    templateUrl: './tags-allow-duplicate.component.html'
})
export class TagsAllowDuplicateExampleComponent implements OnInit {

    selectedCompanies;
    companies: any[] = [];
    companiesNames = ['Uber', 'Microsoft', 'Flexigen'];

    ngOnInit() {
        this.companiesNames.forEach((c, i) => {
            this.companies.push({ id: i, name: c });
        });
    }
}
