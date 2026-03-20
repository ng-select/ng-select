import { JsonPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgSelectComponent } from '@ng-select/ng-select';

@Component({
	selector: 'ng-bindings-default-example',
	templateUrl: './bindings-default-example.component.html',
	styleUrls: ['./bindings-default-example.component.scss'],
	imports: [NgSelectComponent, FormsModule, JsonPipe],
})
export class BindingsDefaultExampleComponent implements OnInit {
	defaultBindingsList = [
		{ value: 1, label: 'New York' },
		{ value: 2, label: 'London' },
		{ value: 3, label: 'Beijing' },
		{ value: 4, label: 'New Delhi', disabled: true },
		{ value: 5, label: 'Paris' },
	];

	selectedCity = null;

	ngOnInit() {
		this.selectedCity = this.defaultBindingsList[0];
	}
}
