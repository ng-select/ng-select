import './polyfills';
import { bootstrapApplication, BrowserModule } from '@angular/platform-browser';
import { Component, importProvidersFrom } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { CommonModule } from '@angular/common';
import { provideHttpClient, withFetch } from '@angular/common/http';

@Component({
	selector: 'app-component',
	template: '//example-template',
})
export class AppComponent {}

bootstrapApplication(AppComponent, {
	providers: [
		importProvidersFrom(BrowserModule, FormsModule, NgSelectModule, CommonModule, ReactiveFormsModule),
		provideHttpClient(withFetch()),
	],
})
	.then((ref) => {
		if (window['ngRef']) {
			window['ngRef'].destroy();
		}
		window['ngRef'] = ref;
	})
	.catch((err) => console.error('Unable to Boostrap the application. Error:' + err));
