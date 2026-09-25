import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { form, FormField } from '@angular/forms/signals';
import { NgSelectComponent } from '@ng-select/ng-select';

@Component({
	selector: 'ng-hero-select',
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [FormField, NgSelectComponent],
	template: `
		<div class="hero-demo">
			<ng-select [items]="demoCities" bindLabel="name" bindValue="id" placeholder="Try me — select a city" [formField]="demoForm.cityId" />
		</div>
	`,
})
export class HeroSelectComponent {
	static clientProviders = [];
	static renderProviders = [];

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
