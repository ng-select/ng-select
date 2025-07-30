import { Component, OnInit } from '@angular/core';
import { concat, Observable, of, Subject } from 'rxjs';
import { DataService, Person } from '../data.service';
import { catchError, distinctUntilChanged, switchMap, tap } from 'rxjs/operators';
import { FormsModule } from '@angular/forms';
import { AsyncPipe, JsonPipe } from '@angular/common';
import { NgSelectComponent } from '@ng-select/ng-select';

@Component({
	selector: 'ng-search-autocomplete-example',
	templateUrl: './search-autocomplete-example.component.html',
	styleUrls: ['./search-autocomplete-example.component.scss'],
	imports: [NgSelectComponent, FormsModule, AsyncPipe, JsonPipe],
})
export class SearchAutocompleteExampleComponent implements OnInit {
	people$: Observable<Person[]>;
	peopleLoading = false;
	peopleInput$ = new Subject<string>();
	selectedPersons: Person[] = <any>[{ name: 'Karyn Wright' }, { name: 'Other' }];

	constructor(private dataService: DataService) {}

	ngOnInit() {
		this.loadPeople();
	}

	trackByFn(item: Person) {
		return item.id;
	}

	private loadPeople() {
		this.people$ = concat(
			of([]), // default items
			this.peopleInput$.pipe(
				distinctUntilChanged(),
				tap(() => (this.peopleLoading = true)),
				switchMap((term) =>
					this.dataService.getPeople(term).pipe(
						catchError(() => of([])), // empty list on error
						tap(() => (this.peopleLoading = false)),
					),
				),
			),
		);
	}
}
