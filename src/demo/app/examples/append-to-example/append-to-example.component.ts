import { Component, OnInit } from '@angular/core';
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
	people: any = [];
	selected: any;
	selected2: any;
	selected3: any;

	constructor(private dataService: DataService) {}

	ngOnInit() {
		this.people = this.dataService.getPeople();
	}
}
