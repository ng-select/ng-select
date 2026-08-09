import { NgDocPage } from '@ng-doc/core';
import { TagsBackendExampleComponent } from '@examples/tags-backend-example/tags-backend-example.component';
import { TagsClosedDropdownExampleComponent } from '@examples/tags-closed-dropdown-example/tags-closed-dropdown-example.component';
import { TagsCustomExampleComponent } from '@examples/tags-custom-example/tags-custom-example.component';
import { TagsDefaultExampleComponent } from '@examples/tags-default-example/tags-default-example.component';
import { StackblitzButtonComponent } from '@docs/stackblitz-button/stackblitz-button.component';
import ExamplesCategory from '../ng-doc.category';

const TagsPage: NgDocPage = {
	title: 'Tags',
	mdFile: './index.md',
	order: 5,
	category: ExamplesCategory,
	demos: {
		StackblitzButtonComponent,
		TagsDefaultExampleComponent,
		TagsCustomExampleComponent,
		TagsBackendExampleComponent,
		TagsClosedDropdownExampleComponent,
	},
};

export default TagsPage;
