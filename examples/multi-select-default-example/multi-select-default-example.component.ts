import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { DataService } from '../data.service';
import { FormsModule } from '@angular/forms';
import { AsyncPipe } from '@angular/common';
import { NgSelectComponent } from '@ng-select/ng-select';

@Component({
	selector: 'ng-multi-select-default-example',
	templateUrl: './multi-select-default-example.component.html',
	styleUrls: ['./multi-select-default-example.component.scss'],
	imports: [NgSelectComponent, FormsModule, AsyncPipe],
})
export class MultiSelectDefaultExampleComponent implements OnInit {
	people$: Observable<any[]>;
	selectedPeople = [{ name: 'Karyn Wright' }];

	constructor(private dataService: DataService) {}

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
