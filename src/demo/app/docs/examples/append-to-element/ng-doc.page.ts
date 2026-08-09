import { NgDocPage } from '@ng-doc/core';
import { AppendToExampleComponent } from '../../../examples/append-to-example/append-to-example.component';
import { ModalNgBootstrapExampleComponent } from '../../../examples/modal-ng-bootstrap-example/modal-ng-bootstrap-example.component';
import { StackblitzButtonComponent } from '../../stackblitz-button/stackblitz-button.component';
import ExamplesCategory from '../ng-doc.category';

const AppendToElementPage: NgDocPage = {
	title: 'Append to element',
	mdFile: './index.md',
	order: 13,
	category: ExamplesCategory,
	demos: {
		StackblitzButtonComponent,
		AppendToExampleComponent,
		ModalNgBootstrapExampleComponent,
	},
};

export default AppendToElementPage;
