import { Routes } from '@angular/router';
import { RouteViewerComponent } from './shared/route-viewer/route-viewer.component';

export const appRoutes: Routes = [
	{
		path: '',
		redirectTo: '/data-sources',
		pathMatch: 'full',
	},
	{ path: 'data-sources', component: RouteViewerComponent, data: { title: 'Data sources', examples: 'data-source' } },
	{ path: 'forms', component: RouteViewerComponent, data: { title: 'Reactive forms', examples: 'forms' } },
	{ path: 'bindings', component: RouteViewerComponent, data: { title: 'Data bindings', examples: 'bindings' } },
	{ path: 'search', component: RouteViewerComponent, data: { title: 'Search and autocomplete', examples: 'search' } },
	{ path: 'tags', component: RouteViewerComponent, data: { title: 'Tags', examples: 'tags' } },
	{ path: 'templates', component: RouteViewerComponent, data: { title: 'Templates', examples: 'template' } },
	{ path: 'multiselect', component: RouteViewerComponent, data: { title: 'Multiselect', examples: 'multi-select' } },
	{
		path: 'multiselect-checkbox',
		component: RouteViewerComponent,
		data: { title: 'Multiselect checkbox', examples: 'multi-checkbox' },
	},
	{ path: 'events', component: RouteViewerComponent, data: { title: 'Output events', examples: 'output-events' } },
	{
		path: 'virtual-scroll',
		component: RouteViewerComponent,
		data: { title: 'Virtual scroll', examples: 'virtual-scroll' },
	},
	{
		path: 'dropdown-position',
		component: RouteViewerComponent,
		data: { title: 'Dropdown position', examples: 'dropdown-position' },
	},
	{
		path: 'fixed-placeholder',
		component: RouteViewerComponent,
		data: { title: 'Fixed Placeholder', examples: 'fixed-placeholder-example' },
	},
	{
		path: 'append-to-element',
		component: RouteViewerComponent,
		data: { title: 'Append to element', examples: 'append-to' },
	},
	{ path: 'grouping', component: RouteViewerComponent, data: { title: 'Grouping', examples: 'group' } },
];
