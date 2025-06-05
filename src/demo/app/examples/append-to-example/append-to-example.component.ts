import { AsyncPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgSelectComponent } from '@ng-select/ng-select';
import { DataService } from '../data.service';

@Component({
	selector: 'ng-append-to-example',
	standalone: true,
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
