import { JsonPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgSelectComponent } from '@ng-select/ng-select';

@Component({
	selector: 'ng-bindings-custom-example',
	templateUrl: './bindings-custom-example.component.html',
	styleUrls: ['./bindings-custom-example.component.scss'],
	imports: [NgSelectComponent, FormsModule, JsonPipe],
})
export class BindingsCustomExampleComponent implements OnInit {
	cities = [
		{ id: 1, name: 'New York' },
		{ id: 2, name: 'London' },
		{ id: 3, name: 'Beijing' },
		{ id: 4, name: 'New Delhi', disabled: true },
		{ id: 5, name: 'Paris' },
	];
	selectedCityId: number = null;

	ngOnInit() {
		this.selectedCityId = this.cities[0].id;
	}
}
