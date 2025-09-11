import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgOptionComponent, NgSelectComponent } from '@ng-select/ng-select';
import { CommonModule } from '@angular/common';

@Component({
	selector: 'ng-appearance-example',
	templateUrl: './appearance-example.component.html',
	styleUrls: ['./appearance-example.component.scss'],
	imports: [FormsModule, NgSelectComponent, NgOptionComponent, CommonModule],
})
export class AppearanceExampleComponent {
	selectedValue = null;
	selectedAppearance = 'underline';
	cities = [
		{ id: 1, name: 'Vilnius' },
		{ id: 2, name: 'Kaunas' },
		{ id: 3, name: 'Pavilnys', disabled: true },
		{ id: 4, name: 'Pabradė' },
		{ id: 5, name: 'Klaipėda' },
	];

	appearances = [
		{ value: 'underline', label: 'Underline (default)' },
		{ value: 'outline', label: 'Outline' },
		{ value: 'fill', label: 'Fill' }
	];
}