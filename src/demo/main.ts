/// <reference types="@angular/localize" />

import { provideHttpClient, withXhr } from '@angular/common/http';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, withHashLocation, withInMemoryScrolling } from '@angular/router';
import {
	NG_DOC_DEFAULT_PAGE_PROCESSORS,
	NG_DOC_DEFAULT_PAGE_SKELETON,
	NgDocDefaultSearchEngine,
	provideMainPageProcessor,
	provideNgDocApp,
	providePageSkeleton,
	provideSearchEngine,
} from '@ng-doc/app';
import { provideNgDocContext } from 'ng-doc/demo';
import { AppComponent } from './app/app.component';
import { DataService } from './app/examples/data.service';
import { appRoutes } from './app/routes';

bootstrapApplication(AppComponent, {
	providers: [
		provideHttpClient(withXhr()),
		DataService,
		provideRouter(
			appRoutes,
			withHashLocation(),
			withInMemoryScrolling({
				scrollPositionRestoration: 'enabled',
				anchorScrolling: 'enabled',
			}),
		),
		provideNgDocApp(),
		provideNgDocContext(),
		provideSearchEngine(NgDocDefaultSearchEngine),
		providePageSkeleton(NG_DOC_DEFAULT_PAGE_SKELETON),
		provideMainPageProcessor(NG_DOC_DEFAULT_PAGE_PROCESSORS),
	],
}).catch((err) => console.error(err));
