import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { DataService } from '../data.service';
import { NgSelectComponent } from '../../../../ng-select/lib/ng-select.component';
import { FormsModule } from '@angular/forms';
import { AsyncPipe } from '@angular/common';

@Component({
	selector: 'ng-multi-select-hidden-example',
	templateUrl: './multi-select-hidden-example.component.html',
	styleUrls: ['./multi-select-hidden-example.component.scss'],
	imports: [NgSelectComponent, FormsModule, AsyncPipe],
})
export class MultiSelectHiddenExampleComponent implements OnInit {
	people$: Observable<any[]>;
	selectedPeople = [];

	constructor(private dataService: DataService) {}

	ngOnInit() {
		this.people$ = this.dataService.getPeople();
	}
}
