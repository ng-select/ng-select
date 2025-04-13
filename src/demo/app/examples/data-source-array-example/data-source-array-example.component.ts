import { Component, OnInit, inject } from '@angular/core';
import { DataService, Person } from '../data.service';
import { FormsModule } from '@angular/forms';
import { NgSelectComponent } from '@ng-select/ng-select';

@Component({
	selector: 'ng-data-source-array-example',
	templateUrl: './data-source-array-example.component.html',
	styleUrls: ['./data-source-array-example.component.scss'],
	imports: [NgSelectComponent, FormsModule],
})
export class DataSourceArrayExampleComponent implements OnInit {
	private dataService = inject(DataService);

	people: Person[] = [];
	selectedPersonId = '5a15b13c36e7a7f00cf0d7cb';

	selectedSimpleItem = 'Two';
	simpleItems = [];

	/** Inserted by Angular inject() migration for backwards compatibility */
	constructor(...args: unknown[]);

	constructor() {}

	ngOnInit() {
		this.dataService.getPeople().subscribe((items) => (this.people = items));
		this.simpleItems = [true, 'Two', 3];
	}
}
