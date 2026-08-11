import { ChangeDetectionStrategy, Component, OnDestroy, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgSelectComponent } from '@ng-select/ng-select';

/**
 * The dropdown panel renders in the CDK overlay attached to `<body>`, outside this
 * component's DOM subtree. Custom properties therefore have to be declared on an
 * ancestor of both — `<body>` here — which is also how a real dark-mode toggle works.
 */
@Component({
	selector: 'ng-css-variables-example',
	templateUrl: './css-variables-example.component.html',
	changeDetection: ChangeDetectionStrategy.Eager,
	imports: [NgSelectComponent, FormsModule],
})
export class CssVariablesExampleComponent implements OnDestroy {
	protected readonly dark = signal(false);

	cities = [
		{ value: 1, label: 'Vilnius' },
		{ value: 2, label: 'Kaunas' },
		{ value: 3, label: 'Pavilnys' },
		{ value: 4, label: 'Klaipėda' },
	];

	selectedCity = 1;

	toggle(): void {
		this.dark.update((v) => !v);
		document.body.classList.toggle('ng-select-dark-demo', this.dark());
	}

	ngOnDestroy(): void {
		document.body.classList.remove('ng-select-dark-demo');
	}
}
