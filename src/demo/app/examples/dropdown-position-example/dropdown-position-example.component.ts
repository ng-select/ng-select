import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgSelectComponent } from '@ng-select/ng-select';

@Component({
	selector: 'ng-dropdown-position-example',
	templateUrl: './dropdown-position-example.component.html',
	styleUrls: ['./dropdown-position-example.component.scss'],
	changeDetection: ChangeDetectionStrategy.Eager,
	imports: [NgSelectComponent],
})
export class DropdownPositionExampleComponent{
	cities = [
		{ value: 1, label: 'New York' },
		{ value: 2, label: 'London' },
		{ value: 3, label: 'Paris' },
	];
}
