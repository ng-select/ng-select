import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectComponent } from '../../../../ng-select/lib/ng-select.component';
import { NgOptionComponent } from '../../../../ng-select/lib/ng-option.component';

@Component({
	selector: 'ng-forms-with-options-example',
	templateUrl: './forms-with-options-example.component.html',
	styleUrls: ['./forms-with-options-example.component.scss'],
	imports: [FormsModule, ReactiveFormsModule, NgSelectComponent, NgOptionComponent],
})
export class FormsWithOptionsExampleComponent implements OnInit {
	basePath;
	heroForm: FormGroup;

	constructor(private fb: FormBuilder) {}

	ngOnInit() {
		this.basePath = window.location.host.includes('localhost') ? '' : '/ng-select';
		this.heroForm = this.fb.group({
			heroId: 'batman',
			agree: null,
		});
	}
}
