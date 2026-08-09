import { NgDocPage } from '@ng-doc/core';
import { MaterialAppearancesExampleComponent } from '../../../examples/material-appearances-example/material-appearances-example.component';
import { MaterialMultiselectExampleComponent } from '../../../examples/material-multiselect-example/material-multiselect-example.component';
import { MaterialStatesExampleComponent } from '../../../examples/material-states-example/material-states-example.component';
import { StackblitzButtonComponent } from '../../stackblitz-button/stackblitz-button.component';
import ExamplesCategory from '../ng-doc.category';

const MaterialPage: NgDocPage = {
	title: 'Material theme',
	mdFile: './index.md',
	order: 16,
	category: ExamplesCategory,
	demos: {
		StackblitzButtonComponent,
		MaterialAppearancesExampleComponent,
		MaterialStatesExampleComponent,
		MaterialMultiselectExampleComponent,
	},
};

export default MaterialPage;
