import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';

@Component({
    selector: 'ng-append-to-example',
    templateUrl: './append-to-example.component.html',
    styleUrls: ['./append-to-example.component.scss'],
    standalone: false
})
export class AppendToExampleComponent implements OnInit {
	people: any = [];
	selected: any;
	selected2: any;
	selected3: any;

	constructor(private dataService: DataService) {}

	ngOnInit() {
		this.people = this.dataService.getPeople();
	}
}
