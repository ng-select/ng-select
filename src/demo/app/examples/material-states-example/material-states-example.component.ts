import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgSelectComponent } from '@ng-select/ng-select';

@Component({
	selector: 'ng-material-states-example',
	templateUrl: './material-states-example.component.html',
	styleUrls: ['./material-states-example.component.scss'],
	changeDetection: ChangeDetectionStrategy.Eager,
	imports: [FormsModule, NgSelectComponent],
})
export class MaterialStatesExampleComponent {
	cities = [
		{ id: 1, name: 'New York' },
		{ id: 2, name: 'London' },
		{ id: 3, name: 'Paris' },
		{ id: 4, name: 'Tokyo' },
		{ id: 5, name: 'New Delhi' },
	];

	selectedOutline = this.cities[1];
	selectedFill = this.cities[1];
	selectedOutlineDisabled = this.cities[0];
	selectedFillDisabled = this.cities[0];
}
