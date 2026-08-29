import { NgDocPage } from '@ng-doc/core';
import { GroupChildrenExampleComponent } from '@examples/group-children-example/group-children-example.component';
import { GroupCollapsibleExampleComponent } from '@examples/group-collapsible-example/group-collapsible-example.component';
import { GroupDefaultExampleComponent } from '@examples/group-default-example/group-default-example.component';
import { GroupFunctionExampleComponent } from '@examples/group-function-example/group-function-example.component';
import { GroupSelectableExampleComponent } from '@examples/group-selectable-example/group-selectable-example.component';
import { GroupSelectableHiddenExampleComponent } from '@examples/group-selectable-hidden-example/group-selectable-hidden-example.component';
import { StackblitzButtonComponent } from '@docs/stackblitz-button/stackblitz-button.component';
import ExamplesCategory from '../ng-doc.category';

const GroupingPage: NgDocPage = {
	title: 'Grouping',
	mdFile: './index.md',
	order: 15,
	category: ExamplesCategory,
	demos: {
		StackblitzButtonComponent,
		GroupDefaultExampleComponent,
		GroupFunctionExampleComponent,
		GroupSelectableExampleComponent,
		GroupSelectableHiddenExampleComponent,
		GroupChildrenExampleComponent,
		GroupCollapsibleExampleComponent,
	},
};

export default GroupingPage;
