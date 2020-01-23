import { DataSourceBackendExampleComponent } from './data-source-backend-example/data-source-backend-example.component';
import { DataSourceArrayExampleComponent } from './data-source-array-example/data-source-array-example.component';
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
import { SearchEditableExampleComponent } from './search-editable-example/search-editable-example.component';

export interface Example {
    component: any;
    title: string;
}

export const EXAMPLE_COMPONENTS: { [key: string]: Example } = {
    'data-source-backend-example': {
        component: DataSourceBackendExampleComponent,
        title: 'Backend data with async pipe'
    },
    'data-source-array-example': {
        component: DataSourceArrayExampleComponent,
        title: 'Array of objects'
    },
    'data-source-options-example': {
        component: DataSourceOptionsExampleComponent,
        title: 'Display data using ng-option'
    },
    'forms-with-options-example': {
        component: FormsWithOptionsExampleComponent,
        title: 'Reactive form using ng-option'
    },
    'forms-single-select-example': {
        component: FormsSingleSelectExampleComponent,
        title: 'Single select with required validation'
    },
    'forms-multi-select-example': {
        component: FormsMultiSelectExampleComponent,
        title: 'Multi select with clear button'
    },
    'forms-async-data-example': {
        component: FormsAsyncDataExampleComponent,
        title: 'Reactive forms using async data'
    },
    'forms-custom-template-example': {
        component: FormsCustomTemplateExampleComponent,
        title: 'Reactive forms with custom template'
    },
    'bindings-default-example': {
        component: BindingsDefaultExampleComponent,
        title: 'Bind to default values'
    },
    'bindings-custom-example': {
        component: BindingsCustomExampleComponent,
        title: 'Bind to custom values'
    },
    'bindings-nested-example': {
        component: BindingsNestedExampleComponent,
        title: 'Bind to nested properties'
    },
    'search-default-example': {
        component: SearchDefaultExampleComponent,
        title: 'Default search example'
    },
    'search-custom-example': {
        component: SearchCustomExampleComponent,
        title: 'Search across multiple fields using [searchFn]'
    },
    'search-autocomplete-example': {
        component: SearchAutocompleteExampleComponent,
        title: 'Custom server-side search'
    },
    'search-editable-example': {
        component: SearchEditableExampleComponent,
        title: 'Editable search value'
    },
    'tags-default-example': {
        component: TagsDefaultExampleComponent,
        title: 'Default tags'
    },
    'tags-custom-example': {
        component: TagsCustomExampleComponent,
        title: 'Custom tags'
    },
    'tags-backend-example': {
        component: TagsBackendExampleComponent,
        title: 'Server side tags'
    },
    'tags-closed-dropdown-example': {
        component: TagsClosedDropdownExampleComponent,
        title: 'Tags without dropdown panel'
    },
    'template-label-example': {
        component: TemplateLabelExampleComponent,
        title: 'Custom label template'
    },
    'template-option-example': {
        component: TemplateOptionExampleComponent,
        title: 'Custom option template'
    },
    'template-optgroup-example': {
        component: TemplateOptgroupExampleComponent,
        title: 'Custom optgroup template'
    },
    'template-header-footer-example': {
        component: TemplateHeaderFooterExampleComponent,
        title: 'Custom header footer template'
    },
    'template-display-example': {
        component: TemplateDisplayExampleComponent,
        title: 'Custom info display templates'
    },
    'template-search-example': {
        component: TemplateSearchExampleComponent,
        title: 'Custom search control'
    },
    'template-loading-example': {
        component: TemplateLoadingExampleComponent,
        title: 'Custom loading spinner'
    },
    'multi-select-default-example': {
        component: MultiSelectDefaultExampleComponent,
        title: 'Multi select'
    },
    'multi-select-hidden-example': {
        component: MultiSelectHiddenExampleComponent,
        title: 'Hidden selected items'
    },
    'multi-select-limit-example': {
        component: MultiSelectLimitExampleComponent,
        title: 'Multi select with limited number of selections'
    },
    'multi-select-disabled-example': {
        component: MultiSelectDisabledExampleComponent,
        title: 'Disabled select'
    },
    'multi-select-template-example': {
        component: MultiSelectTemplateExampleComponent,
        title: 'Custom selected item template'
    },
    'multi-select-custom-example': {
        component: MultiSelectCustomExampleComponent,
        title: 'Custom selected items template'
    },
    'multi-checkbox-example': {
        component: MultiCheckboxExampleComponent,
        title: 'Multi select with checkboxes'
    },
    'multi-checkbox-group-example': {
        component: MultiCheckboxGroupExampleComponent,
        title: 'Grouped multi select with checkboxes'
    },
    'output-events-example': {
        component: OutputEventsExampleComponent,
        title: 'Output events'
    },
    'virtual-scroll-example': {
        component: VirtualScrollExampleComponent,
        title: 'Virtual scroll'
    },
    'dropdown-position-example': {
        component: DropdownPositionExampleComponent,
        title: 'Dropdown position'
    },
    'append-to-example': {
        component: AppendToExampleComponent,
        title: 'Append to position'
    },
    'group-default-example': {
        component: GroupDefaultExampleComponent,
        title: 'Group by item key'
    },
    'group-function-example': {
        component: GroupFunctionExampleComponent,
        title: 'Group by function expression'
    },
    'group-selectable-example': {
        component: GroupSelectableExampleComponent,
        title: 'Selectable groups'
    },
    'group-selectable-hidden-example': {
        component: GroupSelectableHiddenExampleComponent,
        title: 'Selectable groups with hidden selected items'
    },
    'group-children-example': {
        component: GroupChildrenExampleComponent,
        title: 'Items with already grouped children array'
    }
};
