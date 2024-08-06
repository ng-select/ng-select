import { Component } from '@angular/core';

@Component({
	selector: 'ng-template-clear-example',
	templateUrl: './template-clear-example.component.html',
	styleUrls: ['./template-clear-example.component.scss'],
})
export class TemplateClearExampleComponent {
	cities = [
		{
			id: 1,
			name: 'Clermont-Ferrand',
		},
		{
			id: 2,
			name: 'Chamalières',
		},
		{
			id: 3,
			name: 'Lyon',
		},
		{
			id: 4,
			name: 'Compiègne',
		},
	];

	selectedCity = this.cities[0].name;
}
