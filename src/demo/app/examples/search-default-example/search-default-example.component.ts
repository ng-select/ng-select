import { Component, OnInit, inject, ChangeDetectionStrategy } from '@angular/core';
import { DataService, Person } from '../data.service';
import { NgSelectComponent } from '@ng-select/ng-select';

@Component({
	selector: 'ng-search-default-example',
	templateUrl: './search-default-example.component.html',
	styleUrls: ['./search-default-example.component.scss'],
	changeDetection: ChangeDetectionStrategy.Eager,
	imports: [NgSelectComponent],
})
export class SearchDefaultExampleComponent implements OnInit {
	private dataService = inject(DataService);

	people: Person[] = [];
	peopleLoading = false;

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
