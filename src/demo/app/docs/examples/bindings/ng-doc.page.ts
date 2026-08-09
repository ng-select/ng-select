import { NgDocPage } from '@ng-doc/core';
import { BindingsCustomExampleComponent } from '@examples/bindings-custom-example/bindings-custom-example.component';
import { BindingsDefaultExampleComponent } from '@examples/bindings-default-example/bindings-default-example.component';
import { BindingsNestedExampleComponent } from '@examples/bindings-nested-example/bindings-nested-example.component';
import { StackblitzButtonComponent } from '@docs/stackblitz-button/stackblitz-button.component';
import ExamplesCategory from '../ng-doc.category';

const BindingsPage: NgDocPage = {
	title: 'Data bindings',
	mdFile: './index.md',
	order: 2,
	category: ExamplesCategory,
	demos: {
		StackblitzButtonComponent,
		BindingsDefaultExampleComponent,
		BindingsCustomExampleComponent,
		BindingsNestedExampleComponent,
	},
};

export default BindingsPage;
