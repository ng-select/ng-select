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
		{ id: 1, name: 'New York' },
		{ id: 2, name: 'London' },
		{ id: 3, name: 'Paris' },
		{ id: 4, name: 'Tokyo' },
		{ id: 5, name: 'New Delhi' },
	];

	selectedDefault = this.cities[0];
	selectedOutline = this.cities[0];
	selectedFill = this.cities[0];
	selectedOutlineEmpty: { id: number; name: string } | null = null;
}
