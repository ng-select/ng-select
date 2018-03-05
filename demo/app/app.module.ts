import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { NgSelectModule, NG_SELECT_DEFAULT_CONFIG } from '@ng-select/ng-select';
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
import { AppendToComponent } from './examples/append-to.component';
import { DataSourceComponent } from './examples/data-source.component';
import { SelectGroupsComponent } from './examples/groups.component';

export const appRoutes: Routes = [
    {
        path: '',
        redirectTo: '/data-sources',
        pathMatch: 'full'
    },
    { path: 'data-sources', component: DataSourceComponent, data: { title: 'Data sources' } },
    { path: 'forms', component: ReactiveFormsComponent, data: { title: 'Reactive forms' } },
    { path: 'bindings', component: SelectBindingsComponent, data: { title: 'Data bindings' } },
    { path: 'filter', component: SelectSearchComponent, data: { title: 'Filter and autocomplete'} },
    { path: 'tags', component: SelectTagsComponent, data: { title: 'Tags'} },
    { path: 'templates', component: SelectWithTemplatesComponent, data: { title: 'Templates'} },
    { path: 'multiselect', component: SelectMultiComponent, data: { title: 'Multiselect'} },
    { path: 'events', component: SelectEventsComponent, data: { title: 'Output events'} },
    { path: 'virtual-scroll', component: VirtualScrollComponent, data: { title: 'Virtual scroll'} },
    { path: 'dropdown-position', component: DropdownPositionsComponent, data: { title: 'Dropdown position'} },
    { path: 'append-to-element', component: AppendToComponent, data: { title: 'Append to element'} },
    { path: 'grouping', component: SelectGroupsComponent, data: { title: 'Grouping'} },
];

@NgModule({
    imports: [
        BrowserModule,
        NgSelectModule,
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
        DataService,
        {
            provide: NG_SELECT_DEFAULT_CONFIG,
            useValue: {
                notFoundText: 'Items not found',
                addTagText: 'Add item',
                typeToSearchText: 'Type to search',
                loadingText: 'Loading...',
                clearAllText: 'Clear all'
            }
        }
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
        AppendToComponent,
        DataSourceComponent,
        SelectGroupsComponent
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}

