import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NgSelectComponent } from '@ng-select/ng-select';

@Component({
	selector: 'ng-dropdown-position-example',
	templateUrl: './dropdown-position-example.component.html',
	styleUrls: ['./dropdown-position-example.component.scss'],
	changeDetection: ChangeDetectionStrategy.Eager,
	imports: [NgSelectComponent],
})
export class DropdownPositionExampleComponent implements OnInit {
	cities = [
		{ value: 1, label: 'Vilnius' },
		{ value: 2, label: 'Kaunas' },
		{ value: 3, label: 'Pavilnys' },
	];

	ngOnInit() {}
}
