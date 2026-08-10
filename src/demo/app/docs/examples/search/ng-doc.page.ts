import { NgDocPage } from '@ng-doc/core';
import { SearchAutocompleteExampleComponent } from '@examples/search-autocomplete-example/search-autocomplete-example.component';
import { SearchCustomExampleComponent } from '@examples/search-custom-example/search-custom-example.component';
import { SearchDefaultExampleComponent } from '@examples/search-default-example/search-default-example.component';
import { SearchEditableExampleComponent } from '@examples/search-editable-example/search-editable-example.component';
import { StackblitzButtonComponent } from '@docs/stackblitz-button/stackblitz-button.component';
import ExamplesCategory from '../ng-doc.category';

const SearchPage: NgDocPage = {
	title: 'Search and autocomplete',
	mdFile: './index.md',
	order: 4,
	category: ExamplesCategory,
	demos: {
		StackblitzButtonComponent,
		SearchDefaultExampleComponent,
		SearchCustomExampleComponent,
		SearchAutocompleteExampleComponent,
		SearchEditableExampleComponent,
	},
};

export default SearchPage;
