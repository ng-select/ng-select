import { Component, OnInit, inject } from '@angular/core';
import { DataService } from '../data.service';
import { FormsModule } from '@angular/forms';
import { AsyncPipe } from '@angular/common';
import { NgSelectComponent } from '@ng-select/ng-select';

@Component({
	selector: 'ng-append-to-example',
	templateUrl: './append-to-example.component.html',
	styleUrls: ['./append-to-example.component.scss'],
	imports: [NgSelectComponent, FormsModule, AsyncPipe],
})
export class AppendToExampleComponent implements OnInit {
	private dataService = inject(DataService);

	people: any = [];
	selected: any;
	selected2: any;
	selected3: any;

	/** Inserted by Angular inject() migration for backwards compatibility */
	constructor(...args: unknown[]);

	constructor() {}

	ngOnInit() {
		this.people = this.dataService.getPeople();
	}
}
