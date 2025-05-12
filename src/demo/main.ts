/// <reference types="@angular/localize" />

import { enableProdMode, importProvidersFrom } from '@angular/core';
import { environment } from './environments/environment';
import { provideHttpClient } from '@angular/common/http';
import { DataService } from './app/examples/data.service';
import { bootstrapApplication, BrowserModule } from '@angular/platform-browser';
import { ExamplesModule } from './app/examples/examples.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { provideRouter, withHashLocation } from '@angular/router';
import { appRoutes } from './app/routes';
import { AppComponent } from './app/app.component';

if (environment.production) {
	enableProdMode();
}

bootstrapApplication(AppComponent, {
	providers: [
		importProvidersFrom(BrowserModule, ExamplesModule, NgbModule),
		provideHttpClient(),
		DataService,
		provideRouter(appRoutes, withHashLocation()),
	],
}).catch((err) => console.error(err));
