import { Component, OnInit, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { DataService } from '../data.service';
import { FormsModule } from '@angular/forms';
import { AsyncPipe } from '@angular/common';
import { NgSelectComponent } from '@ng-select/ng-select';

@Component({
	selector: 'ng-multi-select-limit-example',
	templateUrl: './multi-select-limit-example.component.html',
	styleUrls: ['./multi-select-limit-example.component.scss'],
	imports: [NgSelectComponent, FormsModule, AsyncPipe],
})
export class MultiSelectLimitExampleComponent implements OnInit {
	private dataService = inject(DataService);

	people$: Observable<any[]>;
	selectedPeople = [];

	/** Inserted by Angular inject() migration for backwards compatibility */
	constructor(...args: unknown[]);

	constructor() {}

	ngOnInit() {
		this.people$ = this.dataService.getPeople();
	}

	clearModel() {
		this.selectedPeople = [];
	}
}
