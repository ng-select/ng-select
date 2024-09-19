import { Component, OnInit } from '@angular/core';
import { NgSelectModule } from "../../../../ng-select/lib/ng-select.module";
import { DataService, Person } from '../data.service';

@Component({
  selector: 'ng-float-placeholder-with-search-example',
  standalone: true,
  imports: [NgSelectModule],
  templateUrl: './float-placeholder-with-search-example.component.html',
  styleUrl: './float-placeholder-with-search-example.component.scss'
})
export class FloatPlaceholderWithSearchExampleComponent implements OnInit {
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
