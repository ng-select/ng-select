import { NgDocPage } from '@ng-doc/core';
import { CssVariablesExampleComponent } from '@examples/css-variables-example/css-variables-example.component';
import GettingStartedCategory from '../ng-doc.category';

const StylingPage: NgDocPage = {
	title: 'Styling',
	mdFile: './index.md',
	order: 2,
	category: GettingStartedCategory,
	demos: {
		CssVariablesExampleComponent,
	},
};

export default StylingPage;
