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
import { SelectTagsComponent } from './examples/tags.component';
import { DropdownPositionsComponent } from './examples/dropdown-positions.component';

import { LayoutHeaderComponent } from './layout/header.component';
import { LayoutSidenavComponent } from './layout/sidenav-component';
import { VirtualScrollComponent } from './examples/virtual-scroll.component';
import { DataService } from './shared/data.service';
import { AppendToChildComponent } from './examples/append-to-child.component';

const appRoutes: Routes = [
    {
        path: '',
        redirectTo: '/forms',
        pathMatch: 'full'
    },
    { path: 'forms', component: ReactiveFormsComponent, data: { title: 'Reactive forms' } },
    { path: 'bindings', component: SelectBindingsComponent, data: { title: 'Data bindings' } },
    { path: 'filter', component: SelectSearchComponent, data: { title: 'Filter and autocomplete'} },
    { path: 'tags', component: SelectTagsComponent, data: { title: 'Tags'} },
    { path: 'templates', component: SelectWithTemplatesComponent, data: { title: 'Templates'} },
    { path: 'multiselect', component: SelectMultiComponent, data: { title: 'Multiselect'} },
    { path: 'events', component: SelectEventsComponent, data: { title: 'Output events'} },
    { path: 'virtual-scroll', component: VirtualScrollComponent, data: { title: 'Virtual scroll'} },
    { path: 'dropdown-position', component: DropdownPositionsComponent, data: { title: 'Dropdown position'} },
    { path: 'append-to-child', component: AppendToChildComponent, data: { title: 'Append to child'} },
];

@NgModule({
    imports: [
        BrowserModule,
        NgSelectModule.forRoot(),
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
    providers: [
        DataService
    ],
    declarations: [
        AppComponent,
        SelectWithTemplatesComponent,
        SelectBindingsComponent,
        SelectSearchComponent,
        ReactiveFormsComponent,
        SelectEventsComponent,
        SelectMultiComponent,
        SelectTagsComponent,
        LayoutHeaderComponent,
        LayoutSidenavComponent,
        DropdownPositionsComponent,
        VirtualScrollComponent,
        AppendToChildComponent
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}

