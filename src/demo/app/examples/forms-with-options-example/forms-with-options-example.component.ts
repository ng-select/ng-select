import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgOptionComponent, NgSelectComponent } from '@ng-select/ng-select';

@Component({
	selector: 'ng-forms-with-options-example',
	templateUrl: './forms-with-options-example.component.html',
	styleUrls: ['./forms-with-options-example.component.scss'],
	imports: [FormsModule, ReactiveFormsModule, NgSelectComponent, NgOptionComponent],
})
export class FormsWithOptionsExampleComponent implements OnInit {
	private fb = inject(FormBuilder);

	basePath;
	heroForm: FormGroup;

	/** Inserted by Angular inject() migration for backwards compatibility */
	constructor(...args: unknown[]);

	constructor() {}

	ngOnInit() {
		this.basePath = window.location.host.includes('localhost') ? '' : '/ng-select';
		this.heroForm = this.fb.group({
			heroId: 'batman',
			agree: null,
		});
	}
}
