import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgSelectComponent } from '@ng-select/ng-select';

@Component({
	selector: 'ng-forms-reactive-example',
	templateUrl: './forms-reactive-example.component.html',
	styleUrls: ['./forms-reactive-example.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [ReactiveFormsModule, NgSelectComponent, JsonPipe],
})
export class FormsReactiveExampleComponent {
	readonly cities = [
		{ id: 1, name: 'New York' },
		{ id: 2, name: 'London' },
		{ id: 3, name: 'Beijing' },
		{ id: 4, name: 'New Delhi' },
		{ id: 5, name: 'Paris' },
	];
	readonly cityForm = new FormGroup({
		cityId: new FormControl<number | null>(2, Validators.required),
	});

	toggleDisabled(): void {
		const control = this.cityForm.controls.cityId;
		if (control.disabled) {
			control.enable();
		} else {
			control.disable();
		}
	}
}
