import { Component } from '@angular/core';
import { appRoutes } from '../routes';

@Component({
	selector: 'layout-sidenav',
	template: `
		<ul class="nav nav-pills flex-column">
			@for (route of routes; track route) {
				<li class="nav-item" routerLinkActive="active">
					<a class="nav-link" routerLink="{{ route.url }}" routerLinkActive="active">{{ route.title }}</a>
				</li>
			}
		</ul>
	`,
})
export class LayoutSidenavComponent {
	routes = [];

	constructor() {
		this.routes = appRoutes
			.filter((route) => route.component)
			.map((route) => ({
				title: route.data.title,
				url: `/${route.path}`,
			}));
	}
}
