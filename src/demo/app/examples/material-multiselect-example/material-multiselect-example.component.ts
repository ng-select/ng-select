import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgSelectComponent } from '@ng-select/ng-select';

@Component({
	selector: 'ng-material-multiselect-example',
	templateUrl: './material-multiselect-example.component.html',
	styleUrls: ['./material-multiselect-example.component.scss'],
	changeDetection: ChangeDetectionStrategy.Eager,
	imports: [FormsModule, NgSelectComponent],
})
export class MaterialMultiselectExampleComponent {
	cities = [
		{ id: 1, name: 'Vilnius' },
		{ id: 2, name: 'Kaunas' },
		{ id: 3, name: 'Pavilnys' },
		{ id: 4, name: 'Pabradė' },
		{ id: 5, name: 'Klaipėda' },
	];

	selectedOutline = [this.cities[0], this.cities[1]];
	selectedFill = [this.cities[0]];
}
