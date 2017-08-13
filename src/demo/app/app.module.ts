import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BrowserModule} from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import {AngSelectModule} from 'ang-select';

import {AppComponent} from './app.component';
import {SelectWithTemplatesComponent} from './select-with-templates.component';
import {SelectBindingsComponent} from './select-bindings.component';
import {SelectSearchComponent} from './select-search.component';
import {ReactiveFormsComponent} from './reactive-forms.component';
import {SelectEventsComponent} from "./select-events.component";


const appRoutes: Routes = [
    { path: '',
        redirectTo: '/forms',
        pathMatch: 'full'
    },
    { path: 'forms', component: ReactiveFormsComponent, data: {title: 'Reactive forms'} },
    { path: 'bindings', component: SelectBindingsComponent, data: {title: 'Custom bindings'} },
    { path: 'filter', component: SelectSearchComponent },
    { path: 'templates', component: SelectWithTemplatesComponent },
    { path: 'events', component: SelectEventsComponent },
];

@NgModule({
    imports: [
        BrowserModule,
        AngSelectModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        RouterModule.forRoot(
            appRoutes,
            { enableTracing: true }
        )
    ],
    declarations: [
        AppComponent,
        SelectWithTemplatesComponent,
        SelectBindingsComponent,
        SelectSearchComponent,
        ReactiveFormsComponent,
        SelectEventsComponent
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}

