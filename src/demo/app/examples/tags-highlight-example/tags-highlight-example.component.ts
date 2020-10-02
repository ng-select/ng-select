import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'tags-highlight-example',
    templateUrl: './tags-highlight-example.component.html',
    styleUrls: ['./tags-highlight-example.component.scss']
})
export class TagsHighlightExampleComponent implements OnInit {

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
