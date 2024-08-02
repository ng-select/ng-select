import { Component, OnInit, inject } from '@angular/core';
import { DataService, Person } from '../data.service';

@Component({
	selector: 'data-source-array-example',
	templateUrl: './data-source-array-example.component.html',
	styleUrls: ['./data-source-array-example.component.scss'],
})
export class DataSourceArrayExampleComponent implements OnInit {
	private dataService = inject(DataService);
	people: Person[] = [];
	selectedPersonId = '5a15b13c36e7a7f00cf0d7cb';

	selectedSimpleItem = 'Two';
	simpleItems = [];

	ngOnInit() {
		this.dataService.getPeople().subscribe((items) => (this.people = items));
		this.simpleItems = [true, 'Two', 3];
	}
}
