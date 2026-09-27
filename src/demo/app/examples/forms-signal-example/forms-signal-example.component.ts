import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { disabled, form, FormField, minLength, required } from '@angular/forms/signals';
import { NgSelectComponent } from '@ng-select/ng-select';

interface City {
	id: number;
	name: string;
}

@Component({
	selector: 'ng-forms-signal-example',
	templateUrl: './forms-signal-example.component.html',
	styleUrls: ['./forms-signal-example.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [FormField, NgSelectComponent, JsonPipe],
})
export class FormsSignalExampleComponent {
	readonly cities: City[] = [
		{ id: 1, name: 'New York' },
		{ id: 2, name: 'London' },
		{ id: 3, name: 'Beijing' },
		{ id: 4, name: 'New Delhi' },
		{ id: 5, name: 'Paris' },
	];
	readonly asyncCities = signal<readonly City[]>([]);
	readonly cityDisabled = signal(false);
	readonly multipleVisible = signal(true);
	readonly model = signal({
		cityId: 2 as number | null,
		cityIds: [1, 3] as number[],
	});
	readonly cityForm = form(this.model, (path) => {
		required(path.cityId, { message: 'Choose a city' });
		minLength(path.cityIds, 1, { message: 'Choose at least one city' });
		disabled(path.cityId, { when: () => this.cityDisabled() });
	});

	loadCities(): void {
		this.asyncCities.set([...this.cities]);
	}

	clearCities(): void {
		this.asyncCities.set([]);
		this.cityForm.cityIds().value.set([1, 3]);
	}

	toggleCityDisabled(): void {
		this.cityDisabled.update((value) => !value);
	}

	toggleMultipleVisible(): void {
		this.multipleVisible.update((value) => !value);
	}
}
