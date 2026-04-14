import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgLabelTemplateDirective, NgPlaceholderTemplateDirective, NgSelectComponent } from '@ng-select/ng-select';

@Component({
	selector: 'ng-template-placeholder-example',
	templateUrl: './template-placeholder-example.component.html',
	styleUrls: ['./template-placeholder-example.component.scss'],
	imports: [NgSelectComponent, FormsModule, NgPlaceholderTemplateDirective, NgLabelTemplateDirective],
})
export class TemplatePlaceholderExampleComponent {
	cities = [
		{
			id: 1,
			name: 'New York',
			avatar: '//www.gravatar.com/avatar/b0d8c6e5ea589e6fc3d3e08afb1873bb?d=retro&r=g&s=30 2x',
		},
		{ id: 2, name: 'London', avatar: '//www.gravatar.com/avatar/ddac2aa63ce82315b513be9dc93336e5?d=retro&r=g&s=15' },
		{
			id: 3,
			name: 'Beijing',
			avatar: '//www.gravatar.com/avatar/6acb7abf486516ab7fb0a6efa372042b?d=retro&r=g&s=15',
		},
		{
			id: 4,
			name: 'New Delhi',
			avatar: '//www.gravatar.com/avatar/b0d8c6e5ea589e6fc3d3e08afb1873bb?d=retro&r=g&s=30 2x',
		},
		{
			id: 5,
			name: 'Paris',
			avatar: '//www.gravatar.com/avatar/ddac2aa63ce82315b513be9dc93336e5?d=retro&r=g&s=15',
		},
	];

	selectedCity = undefined;

	placeholderAvatar = '//www.gravatar.com/avatar/b0d8c6e5ea589e6fc3d3e08afb1873bb?d=retro&r=g&s=30 2x';
}
