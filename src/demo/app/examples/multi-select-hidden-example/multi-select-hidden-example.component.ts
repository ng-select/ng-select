import { Component, OnInit, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { DataService } from '../data.service';
import { FormsModule } from '@angular/forms';
import { AsyncPipe } from '@angular/common';
import { NgSelectComponent } from '@ng-select/ng-select';

@Component({
	selector: 'ng-multi-select-hidden-example',
	templateUrl: './multi-select-hidden-example.component.html',
	styleUrls: ['./multi-select-hidden-example.component.scss'],
	imports: [NgSelectComponent, FormsModule, AsyncPipe],
})
export class MultiSelectHiddenExampleComponent implements OnInit {
	private dataService = inject(DataService);

	people$: Observable<any[]>;
	selectedPeople = [];

	ngOnInit() {
		this.people$ = this.dataService.getPeople();
	}
}
