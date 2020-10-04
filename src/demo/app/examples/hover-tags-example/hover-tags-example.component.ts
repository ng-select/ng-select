import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'hover-tags-example',
    templateUrl: './hover-tags-example.component.html',
    styleUrls: ['./hover-tags-example.component.scss']
})
export class HoverTagsExampleComponent implements OnInit {

    selectedCompanies;
    companies: any[] = [];
    companiesNames = ['Uber', 'Microsoft', 'Flexigen', 'Company A', 'Company B'];

    ngOnInit() {
        this.companiesNames.forEach((c, i) => {
            this.companies.push({ id: i, name: c });
        });
    }

    addTagFn(name) {
        return { name: name, tag: true };
    }
}
