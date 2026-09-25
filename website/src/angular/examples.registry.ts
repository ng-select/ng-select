import type { Type } from '@angular/core';

/** Lazy loaders for every demo under src/demo/app/examples, keyed by folder name. */
export const EXAMPLES: Record<string, () => Promise<Type<unknown>>> = {
	'append-to-example': () => import('@examples/append-to-example/append-to-example.component').then((m) => m.AppendToExampleComponent),
	'bindings-custom-example': () => import('@examples/bindings-custom-example/bindings-custom-example.component').then((m) => m.BindingsCustomExampleComponent),
	'bindings-default-example': () =>
		import('@examples/bindings-default-example/bindings-default-example.component').then((m) => m.BindingsDefaultExampleComponent),
	'bindings-nested-example': () => import('@examples/bindings-nested-example/bindings-nested-example.component').then((m) => m.BindingsNestedExampleComponent),
	'css-variables-example': () => import('@examples/css-variables-example/css-variables-example.component').then((m) => m.CssVariablesExampleComponent),
	'data-source-array-example': () =>
		import('@examples/data-source-array-example/data-source-array-example.component').then((m) => m.DataSourceArrayExampleComponent),
	'data-source-backend-example': () =>
		import('@examples/data-source-backend-example/data-source-backend-example.component').then((m) => m.DataSourceBackendExampleComponent),
	'data-source-options-example': () =>
		import('@examples/data-source-options-example/data-source-options-example.component').then((m) => m.DataSourceOptionsExampleComponent),
	'dropdown-position-example': () =>
		import('@examples/dropdown-position-example/dropdown-position-example.component').then((m) => m.DropdownPositionExampleComponent),
	'fixed-placeholder-example': () =>
		import('@examples/fixed-placeholder-example/fixed-placeholder-example.component').then((m) => m.FixedPlaceholderExampleComponent),
	'forms-async-data-example': () =>
		import('@examples/forms-async-data-example/forms-async-data-example.component').then((m) => m.FormsAsyncDataExampleComponent),
	'forms-custom-template-example': () =>
		import('@examples/forms-custom-template-example/forms-custom-template-example.component').then((m) => m.FormsCustomTemplateExampleComponent),
	'forms-multi-select-example': () =>
		import('@examples/forms-multi-select-example/forms-multi-select-example.component').then((m) => m.FormsMultiSelectExampleComponent),
	'forms-reactive-example': () => import('@examples/forms-reactive-example/forms-reactive-example.component').then((m) => m.FormsReactiveExampleComponent),
	'forms-signal-example': () => import('@examples/forms-signal-example/forms-signal-example.component').then((m) => m.FormsSignalExampleComponent),
	'forms-single-select-example': () =>
		import('@examples/forms-single-select-example/forms-single-select-example.component').then((m) => m.FormsSingleSelectExampleComponent),
	'forms-template-driven-example': () =>
		import('@examples/forms-template-driven-example/forms-template-driven-example.component').then((m) => m.FormsTemplateDrivenExampleComponent),
	'forms-with-options-example': () =>
		import('@examples/forms-with-options-example/forms-with-options-example.component').then((m) => m.FormsWithOptionsExampleComponent),
	'group-children-example': () => import('@examples/group-children-example/group-children-example.component').then((m) => m.GroupChildrenExampleComponent),
	'group-default-example': () => import('@examples/group-default-example/group-default-example.component').then((m) => m.GroupDefaultExampleComponent),
	'group-function-example': () => import('@examples/group-function-example/group-function-example.component').then((m) => m.GroupFunctionExampleComponent),
	'group-selectable-example': () =>
		import('@examples/group-selectable-example/group-selectable-example.component').then((m) => m.GroupSelectableExampleComponent),
	'group-selectable-hidden-example': () =>
		import('@examples/group-selectable-hidden-example/group-selectable-hidden-example.component').then((m) => m.GroupSelectableHiddenExampleComponent),
	'material-appearances-example': () =>
		import('@examples/material-appearances-example/material-appearances-example.component').then((m) => m.MaterialAppearancesExampleComponent),
	'material-multiselect-example': () =>
		import('@examples/material-multiselect-example/material-multiselect-example.component').then((m) => m.MaterialMultiselectExampleComponent),
	'material-states-example': () => import('@examples/material-states-example/material-states-example.component').then((m) => m.MaterialStatesExampleComponent),
	'modal-ng-bootstrap-example': () =>
		import('@examples/modal-ng-bootstrap-example/modal-ng-bootstrap-example.component').then((m) => m.ModalNgBootstrapExampleComponent),
	'multi-checkbox-example': () => import('@examples/multi-checkbox-example/multi-checkbox-example.component').then((m) => m.MultiCheckboxExampleComponent),
	'multi-checkbox-group-example': () =>
		import('@examples/multi-checkbox-group-example/multi-checkbox-group-example.component').then((m) => m.MultiCheckboxGroupExampleComponent),
	'multi-select-custom-example': () =>
		import('@examples/multi-select-custom-example/multi-select-custom-example.component').then((m) => m.MultiSelectCustomExampleComponent),
	'multi-select-default-example': () =>
		import('@examples/multi-select-default-example/multi-select-default-example.component').then((m) => m.MultiSelectDefaultExampleComponent),
	'multi-select-disabled-example': () =>
		import('@examples/multi-select-disabled-example/multi-select-disabled-example.component').then((m) => m.MultiSelectDisabledExampleComponent),
	'multi-select-hidden-example': () =>
		import('@examples/multi-select-hidden-example/multi-select-hidden-example.component').then((m) => m.MultiSelectHiddenExampleComponent),
	'multi-select-limit-example': () =>
		import('@examples/multi-select-limit-example/multi-select-limit-example.component').then((m) => m.MultiSelectLimitExampleComponent),
	'multi-select-template-example': () =>
		import('@examples/multi-select-template-example/multi-select-template-example.component').then((m) => m.MultiSelectTemplateExampleComponent),
	'output-events-example': () => import('@examples/output-events-example/output-events-example.component').then((m) => m.OutputEventsExampleComponent),
	'popover-example': () => import('@examples/popover-example/popover-example.component').then((m) => m.PopoverExampleComponent),
	'search-autocomplete-example': () =>
		import('@examples/search-autocomplete-example/search-autocomplete-example.component').then((m) => m.SearchAutocompleteExampleComponent),
	'search-custom-example': () => import('@examples/search-custom-example/search-custom-example.component').then((m) => m.SearchCustomExampleComponent),
	'search-default-example': () => import('@examples/search-default-example/search-default-example.component').then((m) => m.SearchDefaultExampleComponent),
	'search-editable-example': () => import('@examples/search-editable-example/search-editable-example.component').then((m) => m.SearchEditableExampleComponent),
	'tags-backend-example': () => import('@examples/tags-backend-example/tags-backend-example.component').then((m) => m.TagsBackendExampleComponent),
	'tags-closed-dropdown-example': () =>
		import('@examples/tags-closed-dropdown-example/tags-closed-dropdown-example.component').then((m) => m.TagsClosedDropdownExampleComponent),
	'tags-custom-example': () => import('@examples/tags-custom-example/tags-custom-example.component').then((m) => m.TagsCustomExampleComponent),
	'tags-default-example': () => import('@examples/tags-default-example/tags-default-example.component').then((m) => m.TagsDefaultExampleComponent),
	'template-clear-example': () => import('@examples/template-clear-example/template-clear-example.component').then((m) => m.TemplateClearExampleComponent),
	'template-display-example': () =>
		import('@examples/template-display-example/template-display-example.component').then((m) => m.TemplateDisplayExampleComponent),
	'template-header-footer-example': () =>
		import('@examples/template-header-footer-example/template-header-footer-example.component').then((m) => m.TemplateHeaderFooterExampleComponent),
	'template-label-example': () => import('@examples/template-label-example/template-label-example.component').then((m) => m.TemplateLabelExampleComponent),
	'template-loading-example': () =>
		import('@examples/template-loading-example/template-loading-example.component').then((m) => m.TemplateLoadingExampleComponent),
	'template-optgroup-example': () =>
		import('@examples/template-optgroup-example/template-optgroup-example.component').then((m) => m.TemplateOptgroupExampleComponent),
	'template-option-example': () => import('@examples/template-option-example/template-option-example.component').then((m) => m.TemplateOptionExampleComponent),
	'template-placeholder-example': () =>
		import('@examples/template-placeholder-example/template-placeholder-example.component').then((m) => m.TemplatePlaceholderExampleComponent),
	'template-search-example': () => import('@examples/template-search-example/template-search-example.component').then((m) => m.TemplateSearchExampleComponent),
	'virtual-scroll-example': () => import('@examples/virtual-scroll-example/virtual-scroll-example.component').then((m) => m.VirtualScrollExampleComponent),
};
