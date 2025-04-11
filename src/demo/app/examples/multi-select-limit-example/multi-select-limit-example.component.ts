import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { DataService } from '../data.service';
import { NgSelectComponent } from '../../../../ng-select/lib/ng-select.component';
import { FormsModule } from '@angular/forms';
import { AsyncPipe } from '@angular/common';

@Component({
	selector: 'ng-multi-select-limit-example',
	templateUrl: './multi-select-limit-example.component.html',
	styleUrls: ['./multi-select-limit-example.component.scss'],
	imports: [NgSelectComponent, FormsModule, AsyncPipe],
})
export class MultiSelectLimitExampleComponent implements OnInit {
	people$: Observable<any[]>;
	selectedPeople = [];

	constructor(private dataService: DataService) {}

	ngOnInit() {
		this.people$ = this.dataService.getPeople();
	}

	clearModel() {
		this.selectedPeople = [];
	}
}
