import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { form, FormField } from '@angular/forms/signals';
import { RouterLink } from '@angular/router';
import { NgSelectComponent } from '@ng-select/ng-select';

@Component({
	selector: 'ng-home-page',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.scss'],
	changeDetection: ChangeDetectionStrategy.Eager,
	imports: [RouterLink, FormField, NgSelectComponent],
})
export class HomeComponent {
	features = [
		{ icon: '📶', title: 'Angular Forms support', text: 'Use Signal Forms with formField, Reactive Forms or Template-driven Forms.' },
		{ icon: '🔗', title: 'Flexible bindings', text: 'Bind to primitives, objects, or nested properties with bindLabel and bindValue.' },
		{ icon: '🧩', title: 'Custom templates', text: 'Replace labels, options, headers, footers and more with your own templates.' },
		{ icon: '⚡', title: 'Virtual scroll', text: 'Smoothly render thousands of options with built-in virtual scrolling.' },
		{ icon: '🔍', title: 'Typeahead search', text: 'Client and server-side filtering, autocomplete and custom search functions.' },
		{ icon: '🏷️', title: 'Tags & multiselect', text: 'Create options on the fly, select multiple values, group items.' },
		{ icon: '♿', title: 'Accessible', text: 'Keyboard navigation and ARIA support out of the box, zoneless-ready.' },
	];

	demoCities = [
		{ id: 1, name: 'New York' },
		{ id: 2, name: 'London' },
		{ id: 3, name: 'Vilnius' },
		{ id: 4, name: 'Paris' },
		{ id: 5, name: 'Tokyo' },
	];

	readonly demoModel = signal({ cityId: null as number | null });
	readonly demoForm = form(this.demoModel);
}
