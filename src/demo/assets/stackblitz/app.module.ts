import { Component, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { CommonModule } from '@angular/common';
import { provideHttpClient, withFetch } from '@angular/common/http';

//example-import

@Component({
	selector: 'app-component',
	template: '//example-template',
	standalone: false,
})
export class AppComponent {}

@NgModule({
	imports: [
		BrowserModule,
		FormsModule,
		NgSelectModule,
		CommonModule,
		ReactiveFormsModule,
		//example-cmp
	],
	providers: [provideHttpClient(withFetch())],
	declarations: [AppComponent],
	bootstrap: [AppComponent],
})
export class AppModule {}
