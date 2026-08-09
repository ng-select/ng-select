import { NgDocPage } from '@ng-doc/core';
import { MultiSelectCustomExampleComponent } from '@examples/multi-select-custom-example/multi-select-custom-example.component';
import { MultiSelectDefaultExampleComponent } from '@examples/multi-select-default-example/multi-select-default-example.component';
import { MultiSelectDisabledExampleComponent } from '@examples/multi-select-disabled-example/multi-select-disabled-example.component';
import { MultiSelectHiddenExampleComponent } from '@examples/multi-select-hidden-example/multi-select-hidden-example.component';
import { MultiSelectLimitExampleComponent } from '@examples/multi-select-limit-example/multi-select-limit-example.component';
import { MultiSelectTemplateExampleComponent } from '@examples/multi-select-template-example/multi-select-template-example.component';
import { StackblitzButtonComponent } from '@docs/stackblitz-button/stackblitz-button.component';
import ExamplesCategory from '../ng-doc.category';

const MultiselectPage: NgDocPage = {
	title: 'Multiselect',
	mdFile: './index.md',
	order: 7,
	category: ExamplesCategory,
	demos: {
		StackblitzButtonComponent,
		MultiSelectDefaultExampleComponent,
		MultiSelectHiddenExampleComponent,
		MultiSelectLimitExampleComponent,
		MultiSelectDisabledExampleComponent,
		MultiSelectTemplateExampleComponent,
		MultiSelectCustomExampleComponent,
	},
};

export default MultiselectPage;
