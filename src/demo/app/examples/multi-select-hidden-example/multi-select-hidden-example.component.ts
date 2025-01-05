import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { DataService } from '../data.service';

@Component({
    selector: 'ng-multi-select-hidden-example',
    templateUrl: './multi-select-hidden-example.component.html',
    styleUrls: ['./multi-select-hidden-example.component.scss'],
    standalone: false
})
export class MultiSelectHiddenExampleComponent implements OnInit {
	people$: Observable<any[]>;
	selectedPeople = [];

	constructor(private dataService: DataService) {}

	ngOnInit() {
		this.people$ = this.dataService.getPeople();
	}
}
