import { NgDocPage } from '@ng-doc/core';
import { DataSourceArrayExampleComponent } from '@examples/data-source-array-example/data-source-array-example.component';
import { DataSourceBackendExampleComponent } from '@examples/data-source-backend-example/data-source-backend-example.component';
import { DataSourceOptionsExampleComponent } from '@examples/data-source-options-example/data-source-options-example.component';
import { StackblitzButtonComponent } from '@docs/stackblitz-button/stackblitz-button.component';
import ExamplesCategory from '../ng-doc.category';

const DataSourcesPage: NgDocPage = {
	title: 'Data sources',
	mdFile: './index.md',
	order: 1,
	category: ExamplesCategory,
	demos: {
		StackblitzButtonComponent,
		DataSourceArrayExampleComponent,
		DataSourceOptionsExampleComponent,
		DataSourceBackendExampleComponent,
	},
};

export default DataSourcesPage;
