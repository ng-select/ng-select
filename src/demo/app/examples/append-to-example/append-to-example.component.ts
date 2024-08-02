import { Component, OnInit, ViewEncapsulation, inject } from '@angular/core';
import { DataService } from '../data.service';

@Component({
	selector: 'append-to-example',
	templateUrl: './append-to-example.component.html',
	styleUrls: ['./append-to-example.component.scss'],
	//     encapsulation: ViewEncapsulation.ShadowDom,
})
export class AppendToExampleComponent implements OnInit {
	private dataService = inject(DataService);
	people: any = [];
	selected: any;
	selected2: any;
	selected3: any;

	ngOnInit() {
		this.people = this.dataService.getPeople();
	}
}
