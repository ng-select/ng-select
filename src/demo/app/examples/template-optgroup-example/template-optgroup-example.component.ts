import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgLabelTemplateDirective, NgOptgroupTemplateDirective, NgOptionTemplateDirective, NgSelectComponent } from '@ng-select/ng-select';
import { NgOptionHighlightDirective } from '@ng-select/ng-option-highlight';

@Component({
	selector: 'ng-template-optgroup-example',
	templateUrl: './template-optgroup-example.component.html',
	styleUrls: ['./template-optgroup-example.component.scss'],
	imports: [
		NgSelectComponent,
		FormsModule,
		NgLabelTemplateDirective,
		NgOptgroupTemplateDirective,
		NgOptionTemplateDirective,
		NgOptionHighlightDirective,
	],
})
export class TemplateOptgroupExampleComponent implements OnInit {
	cities = [
		{
			id: 1,
			name: 'Vilnius',
			avatar: '//www.gravatar.com/avatar/b0d8c6e5ea589e6fc3d3e08afb1873bb?d=retro&r=g&s=30 2x',
		},
		{ id: 2, name: 'Kaunas', avatar: '//www.gravatar.com/avatar/ddac2aa63ce82315b513be9dc93336e5?d=retro&r=g&s=15' },
		{
			id: 3,
			name: 'Pavilnys',
			avatar: '//www.gravatar.com/avatar/6acb7abf486516ab7fb0a6efa372042b?d=retro&r=g&s=15',
		},
		{
			id: 4,
			name: 'Siauliai',
			avatar: '//www.gravatar.com/avatar/b0d8c6e5ea589e6fc3d3e08afb1873bb?d=retro&r=g&s=30 2x',
		},
	];

	selectedCity = this.cities[2].name;

	ngOnInit() {}
}
