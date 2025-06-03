import { CommonModule, DatePipe } from '@angular/common';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, importProvidersFrom, provideZonelessChangeDetection } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MAT_DATE_FORMATS, MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { BrowserModule, Title } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
	PreloadAllModules,
	provideRouter,
	withComponentInputBinding,
	withInMemoryScrolling,
	withPreloading,
	withRouterConfig,
} from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { provideQueryClientOptions } from '@ngneat/query';
import { provideQueryDevTools } from '@ngneat/query-devtools';
import { AbstractSecurityStorage, provideAuth } from 'angular-auth-oidc-client';
import { CookieService } from 'ngx-cookie-service';
import { environment } from '../environments/environment';
import { routes } from './app.routes';
import { authConfig } from './auth/auth-config';
import { errorInterceptor } from './auth/intercepters/error.interceptor';
import { httpTokenInterceptor } from './auth/intercepters/http-token.interceptor';
import { PRES_DATE_FORMATS } from './constants/pres-date-format.constants';
import { LocalStorageService } from './auth/local-storage.service';

export const appConfig: ApplicationConfig = {
	providers: [
		provideAuth(authConfig),
		provideZonelessChangeDetection(),
		provideRouter(
			routes,
			withComponentInputBinding(),
			withRouterConfig({
				onSameUrlNavigation: 'reload',
			}),
			withInMemoryScrolling(),
			withPreloading(PreloadAllModules),
			withRouterConfig({
				paramsInheritanceStrategy: 'always',
				onSameUrlNavigation: 'reload',
				defaultQueryParamsHandling: 'merge',
			}),
		),
		importProvidersFrom(
			BrowserModule,
			CommonModule,
			FormsModule,
			ReactiveFormsModule,
			BrowserAnimationsModule,
			NgSelectModule,
			MatSelectModule,
			MatAutocompleteModule,
			MatNativeDateModule,
			MatDatepickerModule,
		),
		provideHttpClient(withFetch(), withInterceptors([errorInterceptor, httpTokenInterceptor])),
		provideQueryClientOptions({
			defaultOptions: {
				queries: {
					refetchOnWindowFocus: true,
					refetchOnMount: true,
					refetchOnReconnect: true,
					staleTime: 600000,
				},
			},
		}),
		Title,
		DatePipe,
		CookieService,
		{
			provide: AbstractSecurityStorage,
			useClass: LocalStorageService,
		},
		environment.production ? [] : provideQueryDevTools({ initialIsOpen: false }),
		{ provide: MAT_DATE_FORMATS, useValue: PRES_DATE_FORMATS },
		{
			provide: MAT_DIALOG_DEFAULT_OPTIONS,
			useValue: { hasBackdrop: true, disableClose: true },
		},
	],
};
