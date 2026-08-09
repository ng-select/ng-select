import { NgDocPage } from '@ng-doc/core';
import { DropdownPositionExampleComponent } from '@examples/dropdown-position-example/dropdown-position-example.component';
import { StackblitzButtonComponent } from '@docs/stackblitz-button/stackblitz-button.component';
import ExamplesCategory from '../ng-doc.category';

const DropdownPositionPage: NgDocPage = {
	title: 'Dropdown position',
	mdFile: './index.md',
	order: 11,
	category: ExamplesCategory,
	demos: {
		StackblitzButtonComponent,
		DropdownPositionExampleComponent,
	},
};

export default DropdownPositionPage;
