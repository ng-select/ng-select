import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgOptionComponent, NgSelectComponent } from '@ng-select/ng-select';

@Component({
	selector: 'ng-material-appearances-example',
	templateUrl: './material-appearances-example.component.html',
	styleUrls: ['./material-appearances-example.component.scss'],
	changeDetection: ChangeDetectionStrategy.Eager,
	imports: [FormsModule, NgSelectComponent, NgOptionComponent],
})
export class MaterialAppearancesExampleComponent {
	cities = [
		{ id: 1, name: 'Vilnius' },
		{ id: 2, name: 'Kaunas' },
		{ id: 3, name: 'Pavilnys' },
		{ id: 4, name: 'Pabradė' },
		{ id: 5, name: 'Klaipėda' },
	];

	selectedDefault = this.cities[0];
	selectedOutline = this.cities[0];
	selectedFill = this.cities[0];
	selectedOutlineEmpty: { id: number; name: string } | null = null;
}
