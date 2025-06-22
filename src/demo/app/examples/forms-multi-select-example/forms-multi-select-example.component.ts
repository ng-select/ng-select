import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectComponent } from '@ng-select/ng-select';

@Component({
	selector: 'ng-forms-multi-select-example',
	templateUrl: './forms-multi-select-example.component.html',
	styleUrls: ['./forms-multi-select-example.component.scss'],
	imports: [FormsModule, ReactiveFormsModule, NgSelectComponent],
})
export class FormsMultiSelectExampleComponent implements OnInit {
	private fb = inject(FormBuilder);

	heroForm: FormGroup;
	isCitiesControlVisible = true;
	cities: any[] = [
		{ id: 1, name: 'Vilnius' },
		{ id: 2, name: 'Kaunas' },
		{ id: 3, name: 'Pavilnys (Disabled)', disabled: true },
		{ id: 4, name: 'Pabradė' },
	];

	ngOnInit() {
		this.heroForm = this.fb.group({
			selectedCitiesIds: [],
		});
	}

	toggleCitiesControl() {
		this.isCitiesControlVisible = !this.isCitiesControlVisible;
	}

	clearCities() {
		this.heroForm.get('selectedCitiesIds').patchValue([]);
	}
}
