import { NgDocPage } from '@ng-doc/core';
import { PopoverExampleComponent } from '../../../examples/popover-example/popover-example.component';
import { StackblitzButtonComponent } from '../../stackblitz-button/stackblitz-button.component';
import ExamplesCategory from '../ng-doc.category';

const PopoverPage: NgDocPage = {
	title: 'Popover',
	mdFile: './index.md',
	order: 14,
	category: ExamplesCategory,
	demos: {
		StackblitzButtonComponent,
		PopoverExampleComponent,
	},
};

export default PopoverPage;
