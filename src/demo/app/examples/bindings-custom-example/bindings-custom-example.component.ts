import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { JsonPipe } from '@angular/common';
import { NgSelectComponent } from '@ng-select/ng-select';

@Component({
	selector: 'ng-bindings-custom-example',
	templateUrl: './bindings-custom-example.component.html',
	styleUrls: ['./bindings-custom-example.component.scss'],
	imports: [NgSelectComponent, FormsModule, JsonPipe],
})
export class BindingsCustomExampleComponent implements OnInit {
	cities = [
		{ id: 1, name: 'Vilnius' },
		{ id: 2, name: 'Kaunas' },
		{ id: 3, name: 'Pavilnys', disabled: true },
	];
	selectedCityId: number = null;

	ngOnInit() {
		this.selectedCityId = this.cities[0].id;
	}
}
