import { Routes } from '@angular/router';
import { NG_DOC_ROUTING } from 'ng-doc/demo';
import { HomeComponent } from './home/home.component';

export const appRoutes: Routes = [
	{
		path: '',
		component: HomeComponent,
		pathMatch: 'full',
	},
	...NG_DOC_ROUTING,
	{
		path: '**',
		redirectTo: '',
	},
];
