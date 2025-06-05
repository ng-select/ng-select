/// <reference types="@angular/localize" />

import { provideHttpClient } from '@angular/common/http';
import { enableProdMode, importProvidersFrom } from '@angular/core';
import { bootstrapApplication, BrowserModule } from '@angular/platform-browser';
import { provideRouter, withHashLocation } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppComponent } from './app/app.component';
import { DataService } from './app/examples/data.service';
import { appRoutes } from './app/routes';
import { environment } from './environments/environment';

if (environment.production) {
	enableProdMode();
}

bootstrapApplication(AppComponent, {
	providers: [
		importProvidersFrom(BrowserModule, NgbModule),
		provideHttpClient(),
		DataService,
		provideRouter(appRoutes, withHashLocation()),
	],
}).catch((err) => console.error(err));
