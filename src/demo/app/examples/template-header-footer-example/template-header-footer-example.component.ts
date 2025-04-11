import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { NgSelectComponent } from '../../../../ng-select/lib/ng-select.component';
import { FormsModule } from '@angular/forms';
import { NgFooterTemplateDirective, NgHeaderTemplateDirective } from '../../../../ng-select/lib/ng-templates.directive';

@Component({
	selector: 'ng-template-header-footer-example',
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
