import { Component, OnInit, inject } from '@angular/core';
import { DataService } from '../data.service';

@Component({
	selector: 'template-header-footer-example',
	templateUrl: './template-header-footer-example.component.html',
	styleUrls: ['./template-header-footer-example.component.scss'],
})
export class TemplateHeaderFooterExampleComponent implements OnInit {
	private dataService = inject(DataService);
	people = [];
	selectedPeople = [];

	ngOnInit() {
		this.dataService.getPeople().subscribe((items) => {
			this.people = items;
		});
	}

	selectAll() {
		this.selectedPeople = this.people.map((x) => x.name);
	}

	unselectAll() {
		this.selectedPeople = [];
	}
}
