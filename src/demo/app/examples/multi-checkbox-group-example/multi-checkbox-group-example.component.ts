import { Component, OnInit, inject } from '@angular/core';
import { DataService, Person } from '../data.service';
import { map } from 'rxjs/operators';
import { FormsModule } from '@angular/forms';
import { NgOptgroupTemplateDirective, NgOptionTemplateDirective, NgSelectComponent } from '@ng-select/ng-select';
import { UpperCasePipe } from '@angular/common';

@Component({
	selector: 'ng-multi-checkbox-group-example',
	templateUrl: './multi-checkbox-group-example.component.html',
	styleUrls: ['./multi-checkbox-group-example.component.scss'],
	imports: [NgSelectComponent, FormsModule, NgOptgroupTemplateDirective, NgOptionTemplateDirective, UpperCasePipe],
})
export class MultiCheckboxGroupExampleComponent implements OnInit {
	private dataService = inject(DataService);

	people: Person[] = [];
	selectedPeople = [];

	/** Inserted by Angular inject() migration for backwards compatibility */
	constructor(...args: unknown[]);

	constructor() {}

	ngOnInit() {
		this.dataService
			.getPeople()
			.pipe(map((x) => x.filter((y) => !y.disabled)))
			.subscribe((res) => {
				this.people = res;
				this.selectedPeople = [this.people[0].id];
			});
	}
}
