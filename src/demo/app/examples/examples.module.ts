import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataSourceBackendExampleComponent } from './data-source-backend-example/data-source-backend-example.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataSourceArrayExampleComponent } from './data-source-array-example/data-source-array-example.component';
import { EXAMPLE_COMPONENTS } from './examples';
import { DataSourceOptionsExampleComponent } from './data-source-options-example/data-source-options-example.component';
import { FormsWithOptionsExampleComponent } from './forms-with-options-example/forms-with-options-example.component';
import { FormsSingleSelectExampleComponent } from './forms-single-select-example/forms-single-select-example.component';
import { FormsMultiSelectExampleComponent } from './forms-multi-select-example/forms-multi-select-example.component';
import { FormsAsyncDataExampleComponent } from './forms-async-data-example/forms-async-data-example.component';
import { FormsCustomTemplateExampleComponent } from './forms-custom-template-example/forms-custom-template-example.component';
import { BindingsDefaultExampleComponent } from './bindings-default-example/bindings-default-example.component';
import { BindingsNestedExampleComponent } from './bindings-nested-example/bindings-nested-example.component';
import { BindingsCustomExampleComponent } from './bindings-custom-example/bindings-custom-example.component';
import { SearchDefaultExampleComponent } from './search-default-example/search-default-example.component';
import { SearchCustomExampleComponent } from './search-custom-example/search-custom-example.component';
import { SearchAutocompleteExampleComponent } from './search-autocomplete-example/search-autocomplete-example.component';
import { TagsDefaultExampleComponent } from './tags-default-example/tags-default-example.component';
import { TagsCustomExampleComponent } from './tags-custom-example/tags-custom-example.component';
import { TagsBackendExampleComponent } from './tags-backend-example/tags-backend-example.component';
import { TagsClosedDropdownExampleComponent } from './tags-closed-dropdown-example/tags-closed-dropdown-example.component';
import { TemplateLabelExampleComponent } from './template-label-example/template-label-example.component';
import { TemplateOptionExampleComponent } from './template-option-example/template-option-example.component';
import { TemplateOptgroupExampleComponent } from './template-optgroup-example/template-optgroup-example.component';
import { TemplateHeaderFooterExampleComponent } from './template-header-footer-example/template-header-footer-example.component';
import { TemplateDisplayExampleComponent } from './template-display-example/template-display-example.component';
import { TemplateSearchExampleComponent } from './template-search-example/template-search-example.component';
import { TemplateLoadingExampleComponent } from './template-loading-example/template-loading-example.component';
import { MultiSelectDefaultExampleComponent } from './multi-select-default-example/multi-select-default-example.component';
import { MultiSelectHiddenExampleComponent } from './multi-select-hidden-example/multi-select-hidden-example.component';
import { MultiSelectLimitExampleComponent } from './multi-select-limit-example/multi-select-limit-example.component';
import { MultiSelectDisabledExampleComponent } from './multi-select-disabled-example/multi-select-disabled-example.component';
import { MultiSelectTemplateExampleComponent } from './multi-select-template-example/multi-select-template-example.component';
import { MultiSelectCustomExampleComponent } from './multi-select-custom-example/multi-select-custom-example.component';
import { MultiCheckboxExampleComponent } from './multi-checkbox-example/multi-checkbox-example.component';
import { MultiCheckboxGroupExampleComponent } from './multi-checkbox-group-example/multi-checkbox-group-example.component';
import { OutputEventsExampleComponent } from './output-events-example/output-events-example.component';
import { VirtualScrollExampleComponent } from './virtual-scroll-example/virtual-scroll-example.component';
import { DropdownPositionExampleComponent } from './dropdown-position-example/dropdown-position-example.component';
import { AppendToExampleComponent } from './append-to-example/append-to-example.component';
import { GroupDefaultExampleComponent } from './group-default-example/group-default-example.component';
import { GroupFunctionExampleComponent } from './group-function-example/group-function-example.component';
import { GroupSelectableExampleComponent } from './group-selectable-example/group-selectable-example.component';
import { GroupSelectableHiddenExampleComponent } from './group-selectable-hidden-example/group-selectable-hidden-example.component';
import { GroupChildrenExampleComponent } from './group-children-example/group-children-example.component';

@NgModule({
    declarations: [
        DataSourceBackendExampleComponent,
        DataSourceArrayExampleComponent,
        DataSourceOptionsExampleComponent,
        FormsWithOptionsExampleComponent,
        FormsSingleSelectExampleComponent,
        FormsMultiSelectExampleComponent,
        FormsAsyncDataExampleComponent,
        FormsCustomTemplateExampleComponent,
        BindingsDefaultExampleComponent,
        BindingsNestedExampleComponent,
        BindingsCustomExampleComponent,
        SearchDefaultExampleComponent,
        SearchCustomExampleComponent,
        SearchAutocompleteExampleComponent,
        TagsDefaultExampleComponent,
        TagsCustomExampleComponent,
        TagsBackendExampleComponent,
        TagsClosedDropdownExampleComponent,
        TemplateLabelExampleComponent,
        TemplateOptionExampleComponent,
        TemplateOptgroupExampleComponent,
        TemplateHeaderFooterExampleComponent,
        TemplateDisplayExampleComponent,
        TemplateSearchExampleComponent,
        TemplateLoadingExampleComponent,
        MultiSelectDefaultExampleComponent,
        MultiSelectHiddenExampleComponent,
        MultiSelectLimitExampleComponent,
        MultiSelectDisabledExampleComponent,
        MultiSelectTemplateExampleComponent,
        MultiSelectCustomExampleComponent,
        MultiCheckboxExampleComponent,
        MultiCheckboxGroupExampleComponent,
        OutputEventsExampleComponent,
        VirtualScrollExampleComponent,
        DropdownPositionExampleComponent,
        AppendToExampleComponent,
        GroupDefaultExampleComponent,
        GroupFunctionExampleComponent,
        GroupSelectableExampleComponent,
        GroupSelectableHiddenExampleComponent,
        GroupChildrenExampleComponent
    ],
    imports: [
        NgSelectModule,
        FormsModule,
        CommonModule,
        ReactiveFormsModule
    ],
    entryComponents: [Object.keys(EXAMPLE_COMPONENTS).map(x => (EXAMPLE_COMPONENTS[x].component))]
})
export class ExamplesModule {
}
