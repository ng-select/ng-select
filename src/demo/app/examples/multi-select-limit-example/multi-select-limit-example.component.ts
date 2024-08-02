import { Component, OnInit, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { DataService } from '../data.service';

@Component({
	selector: 'multi-select-limit-example',
	templateUrl: './multi-select-limit-example.component.html',
	styleUrls: ['./multi-select-limit-example.component.scss'],
})
export class MultiSelectLimitExampleComponent implements OnInit {
	private dataService = inject(DataService);
	people$: Observable<any[]>;
	selectedPeople = [];

	ngOnInit() {
		this.people$ = this.dataService.getPeople();
	}

	clearModel() {
		this.selectedPeople = [];
	}
}
