import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'hover-effect-example',
    templateUrl: './hover-effect-example.component.html',
    styleUrls: ['./hover-effect-example.component.scss']
})
export class HoverEffectExampleComponent implements OnInit {

    selectedCompanies;
    companies: any[] = [];
    companiesNames = ['Uber', 'Microsoft', 'Flexigen', 'Company A', 'Company B'];

    ngOnInit() {
        this.companiesNames.forEach((c, i) => {
            this.companies.push({ id: i, name: c, disabled: i === 3 });
        });
    }
}
