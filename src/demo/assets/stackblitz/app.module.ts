import { Component, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

//example-import

@Component({
    selector: 'app-component',
    template: '//example-template'
})
export class AppComponent {}

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        NgSelectModule,
        CommonModule,
        ReactiveFormsModule,
        HttpClientModule
    ],
    declarations: [
        AppComponent,
        //example-cmp
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}



