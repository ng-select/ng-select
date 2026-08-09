import { NgDocPage } from '@ng-doc/core';
import { VirtualScrollExampleComponent } from '@examples/virtual-scroll-example/virtual-scroll-example.component';
import { StackblitzButtonComponent } from '@docs/stackblitz-button/stackblitz-button.component';
import ExamplesCategory from '../ng-doc.category';

const VirtualScrollPage: NgDocPage = {
	title: 'Virtual scroll',
	mdFile: './index.md',
	order: 10,
	category: ExamplesCategory,
	demos: {
		StackblitzButtonComponent,
		VirtualScrollExampleComponent,
	},
};

export default VirtualScrollPage;
