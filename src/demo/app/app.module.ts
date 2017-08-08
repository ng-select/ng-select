import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BrowserModule} from '@angular/platform-browser';
import {AngSelectModule} from 'ang-select';

import {AppComponent} from './app.component';
import {SelectWithTemplatesComponent} from './select-with-templates.component';
import {SelectBindingsComponent} from './select-bindings.component';
import {SelectSearchComponent} from './select-search.component';
import {ReactiveFormsComponent} from './reactive-forms.component';

@NgModule({
    imports: [
        BrowserModule,
        AngSelectModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule
    ],
    declarations: [
        AppComponent,
        SelectWithTemplatesComponent,
        SelectBindingsComponent,
        SelectSearchComponent,
        ReactiveFormsComponent
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}

