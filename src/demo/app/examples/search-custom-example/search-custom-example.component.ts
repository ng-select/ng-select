import { Component, OnInit, inject } from '@angular/core';
import { DataService, Person } from '../data.service';
import { NgOptionTemplateDirective, NgSelectComponent } from '@ng-select/ng-select';

@Component({
	selector: 'ng-search-custom-example',
	templateUrl: './search-custom-example.component.html',
	styleUrls: ['./search-custom-example.component.scss'],
	imports: [NgSelectComponent, NgOptionTemplateDirective],
})
export class SearchCustomExampleComponent implements OnInit {
	private dataService = inject(DataService);

	people: Person[] = [];
	peopleLoading = false;

	/** Inserted by Angular inject() migration for backwards compatibility */
	constructor(...args: unknown[]);

	constructor() {}

	ngOnInit() {
		this.loadPeople();
	}

	customSearchFn(term: string, item: Person) {
		term = term.toLowerCase();
		return item.name.toLowerCase().indexOf(term) > -1 || item.gender.toLowerCase() === term;
	}

	private loadPeople() {
		this.peopleLoading = true;
		this.dataService.getPeople().subscribe((x) => {
			this.people = x;
			this.peopleLoading = false;
		});
	}
}
