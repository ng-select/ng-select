import { NgDocPage } from '@ng-doc/core';
import { FixedPlaceholderExampleComponent } from '../../../examples/fixed-placeholder-example/fixed-placeholder-example.component';
import { StackblitzButtonComponent } from '../../stackblitz-button/stackblitz-button.component';
import ExamplesCategory from '../ng-doc.category';

const FixedPlaceholderPage: NgDocPage = {
	title: 'Fixed placeholder',
	mdFile: './index.md',
	order: 12,
	category: ExamplesCategory,
	demos: {
		StackblitzButtonComponent,
		FixedPlaceholderExampleComponent,
	},
};

export default FixedPlaceholderPage;
