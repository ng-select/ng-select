import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgFooterTemplateDirective, NgHeaderTemplateDirective, NgSelectComponent } from '@ng-select/ng-select';
import { DataService } from '../data.service';

@Component({
	selector: 'ng-template-header-footer-example',
	standalone: true,
	templateUrl: './template-header-footer-example.component.html',
	styleUrls: ['./template-header-footer-example.component.scss'],
	imports: [NgSelectComponent, FormsModule, NgHeaderTemplateDirective, NgFooterTemplateDirective],
})
export class TemplateHeaderFooterExampleComponent implements OnInit {
	people = [];
	selectedPeople = [];

	constructor(private dataService: DataService) {}

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
