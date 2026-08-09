import { NgDocPage } from '@ng-doc/core';
import { FormsAsyncDataExampleComponent } from '../../../examples/forms-async-data-example/forms-async-data-example.component';
import { FormsCustomTemplateExampleComponent } from '../../../examples/forms-custom-template-example/forms-custom-template-example.component';
import { FormsMultiSelectExampleComponent } from '../../../examples/forms-multi-select-example/forms-multi-select-example.component';
import { FormsSingleSelectExampleComponent } from '../../../examples/forms-single-select-example/forms-single-select-example.component';
import { FormsWithOptionsExampleComponent } from '../../../examples/forms-with-options-example/forms-with-options-example.component';
import { StackblitzButtonComponent } from '../../stackblitz-button/stackblitz-button.component';
import ExamplesCategory from '../ng-doc.category';

const FormsPage: NgDocPage = {
	title: 'Reactive forms',
	mdFile: './index.md',
	order: 3,
	category: ExamplesCategory,
	demos: {
		StackblitzButtonComponent,
		FormsSingleSelectExampleComponent,
		FormsMultiSelectExampleComponent,
		FormsWithOptionsExampleComponent,
		FormsAsyncDataExampleComponent,
		FormsCustomTemplateExampleComponent,
	},
};

export default FormsPage;
