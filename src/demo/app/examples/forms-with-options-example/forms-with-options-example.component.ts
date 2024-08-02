import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
	selector: 'forms-with-options-example',
	templateUrl: './forms-with-options-example.component.html',
	styleUrls: ['./forms-with-options-example.component.scss'],
})
export class FormsWithOptionsExampleComponent implements OnInit {
	private fb = inject(FormBuilder);
	basePath;
	heroForm: FormGroup;

	ngOnInit() {
		this.basePath = window.location.host.includes('localhost') ? '' : '/ng-select';
		this.heroForm = this.fb.group({
			heroId: 'batman',
			agree: null,
		});
	}
}
