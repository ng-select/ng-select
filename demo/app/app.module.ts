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
import { ReactiveFormsComponent, ConfirmationComponent } from './examples/reactive-forms.component';
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
    { path: 'data-sources', component: DataSourceComponent, data: { title: 'Data sources', fileName: 'data-source.component.ts' } },
    { path: 'forms', component: ReactiveFormsComponent, data: { title: 'Reactive forms', fileName: 'reactive-forms.component.ts' } },
    { path: 'bindings', component: SelectBindingsComponent, data: { title: 'Data bindings', fileName: 'bindings.component.ts' } },
    { path: 'filter', component: SelectSearchComponent, data: { title: 'Filter and autocomplete', fileName: 'search.component.ts' } },
    { path: 'tags', component: SelectTagsComponent, data: { title: 'Tags', fileName: 'tags.component.ts' } },
    { path: 'templates', component: SelectWithTemplatesComponent, data: { title: 'Templates', fileName: 'custom-templates.component.ts' } },
    { path: 'multiselect', component: SelectMultiComponent, data: { title: 'Multiselect', fileName: 'multi.component.ts' } },
    { path: 'events', component: SelectEventsComponent, data: { title: 'Output events', fileName: 'events.component.ts' } },
    // tslint:disable-next-line:max-line-length
    { path: 'virtual-scroll', component: VirtualScrollComponent, data: { title: 'Virtual scroll', fileName: 'virtual-scroll.component.ts' } },
    // tslint:disable-next-line:max-line-length
    { path: 'dropdown-position', component: DropdownPositionsComponent, data: { title: 'Dropdown position', fileName: 'dropdown-positions.component.ts' } },
    // tslint:disable-next-line:max-line-length
    { path: 'append-to-element', component: AppendToComponent, data: { title: 'Append to element', fileName: 'append-to.component.ts' } },
    { path: 'grouping', component: SelectGroupsComponent, data: { title: 'Grouping', fileName: 'groups.component.ts' } },
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
                placeholder: 'Select item',
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
        SelectGroupsComponent,
        ConfirmationComponent
    ],
    entryComponents: [ConfirmationComponent],
    bootstrap: [AppComponent]
})
export class AppModule {
}

