import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'tags-custom-example',
    templateUrl: './tags-custom-example.component.html',
    styleUrls: ['./tags-custom-example.component.scss']
})
export class TagsCustomExampleComponent implements OnInit {

    selectedCompanies;
    companies: any[] = [];
    companiesNames = ['Uber', 'Microsoft', 'Flexigen'];

    ngOnInit() {
        this.companiesNames.forEach((c, i) => {
            this.companies.push({ id: i, name: c });
        });
    }

    addTagFn(name) {
        return { name: name, tag: true };
    }
}
