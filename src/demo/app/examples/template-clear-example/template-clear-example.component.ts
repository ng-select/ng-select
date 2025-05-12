import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgClearButtonTemplateDirective, NgSelectComponent } from '@ng-select/ng-select';

@Component({
	selector: 'ng-template-clear-example',
	templateUrl: './template-clear-example.component.html',
	styleUrls: ['./template-clear-example.component.scss'],
	imports: [NgSelectComponent, FormsModule, NgClearButtonTemplateDirective],
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
