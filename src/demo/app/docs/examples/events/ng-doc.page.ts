import { NgDocPage } from '@ng-doc/core';
import { OutputEventsExampleComponent } from '../../../examples/output-events-example/output-events-example.component';
import { StackblitzButtonComponent } from '../../stackblitz-button/stackblitz-button.component';
import ExamplesCategory from '../ng-doc.category';

const EventsPage: NgDocPage = {
	title: 'Output events',
	mdFile: './index.md',
	order: 9,
	category: ExamplesCategory,
	demos: {
		StackblitzButtonComponent,
		OutputEventsExampleComponent,
	},
};

export default EventsPage;
