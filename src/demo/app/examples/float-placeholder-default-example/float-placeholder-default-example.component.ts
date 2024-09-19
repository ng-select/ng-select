import { Component, OnInit } from '@angular/core';
import { DataService, Person } from '../data.service';
import { Observable } from 'rxjs';

import { NgSelectModule } from "../../../../ng-select/lib/ng-select.module";
import { FormsModule } from '@angular/forms';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'ng-float-placeholder-default-example',
  standalone: true,
  imports: [NgSelectModule, FormsModule, AsyncPipe],
  templateUrl: './float-placeholder-default-example.component.html',
  styleUrl: './float-placeholder-default-example.component.scss'
})
export class FloatPlaceholderDefaultExampleComponent implements OnInit {
  people$: Observable<Person[]>;
	selectedPersonId = '5a15b13c36e7a7f00cf0d7cb';

	constructor(private dataService: DataService) {}

	ngOnInit() {
		this.people$ = this.dataService.getPeople();
	}
}
