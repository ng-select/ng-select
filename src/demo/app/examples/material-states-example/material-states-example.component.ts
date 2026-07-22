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
		{ id: 1, name: 'Vilnius' },
		{ id: 2, name: 'Kaunas' },
		{ id: 3, name: 'Pavilnys' },
		{ id: 4, name: 'Pabradė' },
	];

	selectedOutline = this.cities[1];
	selectedFill = this.cities[1];
	selectedOutlineDisabled = this.cities[0];
	selectedFillDisabled = this.cities[0];
}
