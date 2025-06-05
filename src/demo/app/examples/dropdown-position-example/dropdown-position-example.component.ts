import { Component } from '@angular/core';
import { NgSelectComponent } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';

@Component({
	selector: 'ng-dropdown-position-example',
	standalone: true,
	templateUrl: './dropdown-position-example.component.html',
	styleUrls: ['./dropdown-position-example.component.scss'],
	imports: [NgSelectComponent, FormsModule],
})
export class DropdownPositionExampleComponent {
	cities = [
		{ value: 1, label: 'Vilnius' },
		{ value: 2, label: 'Kaunas' },
		{ value: 3, label: 'Pavilnys' },
	];
}
