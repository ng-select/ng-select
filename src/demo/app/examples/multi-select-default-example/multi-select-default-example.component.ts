import { Component, OnInit, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { DataService } from '../data.service';

@Component({
	selector: 'multi-select-default-example',
	templateUrl: './multi-select-default-example.component.html',
	styleUrls: ['./multi-select-default-example.component.scss'],
})
export class MultiSelectDefaultExampleComponent implements OnInit {
	private dataService = inject(DataService);
	people$: Observable<any[]>;
	selectedPeople = [{ name: 'Karyn Wright' }];

	ngOnInit() {
		this.people$ = this.dataService.getPeople();
	}

	clearModel() {
		this.selectedPeople = [];
	}

	changeModel() {
		this.selectedPeople = [{ name: 'New person' }];
	}
}
