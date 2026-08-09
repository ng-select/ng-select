import { NgDocPage } from '@ng-doc/core';
import { MultiCheckboxExampleComponent } from '@examples/multi-checkbox-example/multi-checkbox-example.component';
import { MultiCheckboxGroupExampleComponent } from '@examples/multi-checkbox-group-example/multi-checkbox-group-example.component';
import { StackblitzButtonComponent } from '@docs/stackblitz-button/stackblitz-button.component';
import ExamplesCategory from '../ng-doc.category';

const MultiselectCheckboxPage: NgDocPage = {
	title: 'Multiselect checkbox',
	mdFile: './index.md',
	order: 8,
	category: ExamplesCategory,
	demos: {
		StackblitzButtonComponent,
		MultiCheckboxExampleComponent,
		MultiCheckboxGroupExampleComponent,
	},
};

export default MultiselectCheckboxPage;
