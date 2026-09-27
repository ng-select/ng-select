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
		{ id: 1, name: 'New York' },
		{ id: 2, name: 'London' },
		{ id: 3, name: 'Paris' },
		{ id: 4, name: 'Tokyo' },
		{ id: 5, name: 'New Delhi' },
	];

	selectedOutline = [this.cities[0], this.cities[1]];
	selectedFill = [this.cities[0]];
}
