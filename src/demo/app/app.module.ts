import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from './app.component';
import { SelectWithTemplatesComponent } from './examples/custom-templates.component';
import { SelectBindingsComponent } from './examples/bindings.component';
import { SelectSearchComponent } from './examples/search.component';
import { ReactiveFormsComponent } from './examples/reactive-forms.component';
import { SelectEventsComponent } from './examples/events.component';
import { SelectMultiComponent } from './examples/multi.component';
import { SelectAutocompleteComponent } from './examples/autocomplete.component';

const appRoutes: Routes = [
    {
        path: '',
        redirectTo: '/forms',
        pathMatch: 'full'
    },
    { path: 'forms', component: ReactiveFormsComponent, data: { title: 'Reactive forms' } },
    { path: 'bindings', component: SelectBindingsComponent, data: { title: 'Custom bindings' } },
    { path: 'filter-client', component: SelectSearchComponent },
    { path: 'filter-server', component: SelectAutocompleteComponent },
    { path: 'templates', component: SelectWithTemplatesComponent },
    { path: 'multiselect', component: SelectMultiComponent },
    { path: 'events', component: SelectEventsComponent },
];

@NgModule({
    imports: [
        BrowserModule,
        NgSelectModule.forRoot({ notFoundText: 'No items found', typeToSearchText: 'Type to search' }),
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        NgbModule.forRoot(),
        RouterModule.forRoot(
            appRoutes,
            {
                useHash: true
            }
        )
    ],
    declarations: [
        AppComponent,
        SelectWithTemplatesComponent,
        SelectBindingsComponent,
        SelectSearchComponent,
        ReactiveFormsComponent,
        SelectEventsComponent,
        SelectMultiComponent,
        SelectAutocompleteComponent
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}

