import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'ng-bindings-custom-example',
    templateUrl: './bindings-custom-example.component.html',
    styleUrls: ['./bindings-custom-example.component.scss'],
    standalone: false
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
