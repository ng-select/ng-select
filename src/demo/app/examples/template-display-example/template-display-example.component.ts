import { Component, EventEmitter, OnInit } from '@angular/core';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { DataService } from '../data.service';
import { FormsModule } from '@angular/forms';
import {
	NgLoadingTextTemplateDirective,
	NgNotFoundTemplateDirective,
	NgSelectComponent,
	NgTypeToSearchTemplateDirective,
} from '@ng-select/ng-select';

@Component({
	selector: 'ng-template-display-example',
	templateUrl: './template-display-example.component.html',
	styleUrls: ['./template-display-example.component.scss'],
	imports: [NgSelectComponent, FormsModule, NgTypeToSearchTemplateDirective, NgNotFoundTemplateDirective, NgLoadingTextTemplateDirective],
})
export class TemplateDisplayExampleComponent implements OnInit {
	peopleTypeahead = new EventEmitter<string>();
	serverSideFilterItems = [];
	selectedPeople;

	constructor(private dataService: DataService) {}

	ngOnInit() {
		this.serverSideSearch();
	}

	private serverSideSearch() {
		this.peopleTypeahead
			.pipe(
				distinctUntilChanged(),
				debounceTime(300),
				switchMap((term) => this.dataService.getPeople(term)),
			)
			.subscribe(
				(x) => {
					this.serverSideFilterItems = x;
				},
				(err) => {
					console.log(err);
					this.serverSideFilterItems = [];
				},
			);
	}
}
