import { CommonModule } from '@angular/common';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgSelectModule } from '@ng-select/ng-select';

export const appConfig: ApplicationConfig = {
	providers: [
		importProvidersFrom(BrowserModule, FormsModule, NgSelectModule, CommonModule, ReactiveFormsModule),
		provideHttpClient(withFetch()),
	],
};
