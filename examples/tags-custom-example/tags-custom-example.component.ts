import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { JsonPipe } from '@angular/common';
import { NgSelectComponent } from '@ng-select/ng-select';

@Component({
	selector: 'ng-tags-custom-example',
	templateUrl: './tags-custom-example.component.html',
	styleUrls: ['./tags-custom-example.component.scss'],
	imports: [NgSelectComponent, FormsModule, JsonPipe],
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
