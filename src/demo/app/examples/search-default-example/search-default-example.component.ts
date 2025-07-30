import { Component, OnInit } from '@angular/core';
import { DataService, Person } from '../data.service';
import { NgSelectComponent } from '@ng-select/ng-select';

@Component({
	selector: 'ng-search-default-example',
	templateUrl: './search-default-example.component.html',
	styleUrls: ['./search-default-example.component.scss'],
	imports: [NgSelectComponent],
})
export class SearchDefaultExampleComponent implements OnInit {
	people: Person[] = [];
	peopleLoading = false;

	constructor(private dataService: DataService) {}

	ngOnInit() {
		this.loadPeople();
	}

	private loadPeople() {
		this.peopleLoading = true;
		this.dataService.getPeople().subscribe((x) => {
			this.people = x;
			this.peopleLoading = false;
		});
	}
}
