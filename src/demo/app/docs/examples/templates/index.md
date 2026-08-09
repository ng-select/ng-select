ng-select lets you customize every part of the component — labels, options, headers, footers, and more — using `ng-template` directives.

## Custom label template

{{ NgDocActions.demo("TemplateLabelExampleComponent") }}

{{ NgDocActions.demo("StackblitzButtonComponent", { container: false, inputs: { example: "template-label-example" } }) }}

## Custom placeholder template

{{ NgDocActions.demo("TemplatePlaceholderExampleComponent") }}

{{ NgDocActions.demo("StackblitzButtonComponent", { container: false, inputs: { example: "template-placeholder-example" } }) }}

## Custom option template

{{ NgDocActions.demo("TemplateOptionExampleComponent") }}

{{ NgDocActions.demo("StackblitzButtonComponent", { container: false, inputs: { example: "template-option-example" } }) }}

## Custom optgroup template

{{ NgDocActions.demo("TemplateOptgroupExampleComponent") }}

{{ NgDocActions.demo("StackblitzButtonComponent", { container: false, inputs: { example: "template-optgroup-example" } }) }}

## Custom header and footer template

{{ NgDocActions.demo("TemplateHeaderFooterExampleComponent") }}

{{ NgDocActions.demo("StackblitzButtonComponent", { container: false, inputs: { example: "template-header-footer-example" } }) }}

## Custom info display templates

{{ NgDocActions.demo("TemplateDisplayExampleComponent") }}

{{ NgDocActions.demo("StackblitzButtonComponent", { container: false, inputs: { example: "template-display-example" } }) }}

## Custom search control

{{ NgDocActions.demo("TemplateSearchExampleComponent") }}

{{ NgDocActions.demo("StackblitzButtonComponent", { container: false, inputs: { example: "template-search-example" } }) }}

## Custom loading spinner

{{ NgDocActions.demo("TemplateLoadingExampleComponent") }}

{{ NgDocActions.demo("StackblitzButtonComponent", { container: false, inputs: { example: "template-loading-example" } }) }}

## Custom clear button

{{ NgDocActions.demo("TemplateClearExampleComponent") }}

{{ NgDocActions.demo("StackblitzButtonComponent", { container: false, inputs: { example: "template-clear-example" } }) }}

## API

| Template directive      | Purpose                                                                                                               |
| ----------------------- | --------------------------------------------------------------------------------------------------------------------- |
| `ng-label-tmp`          | Customizes how the selected item's label is rendered in the select input                                              |
| `ng-placeholder-tmp`    | Customizes the placeholder shown when no item is selected                                                             |
| `ng-option-tmp`         | Customizes how each option is rendered in the dropdown panel; exposes `item`, `index` and `searchTerm`                |
| `ng-optgroup-tmp`       | Customizes how group headers are rendered when `groupBy` is used                                                      |
| `ng-header-tmp`         | Renders custom content at the top of the dropdown panel (e.g. select/unselect all buttons or a custom search control) |
| `ng-footer-tmp`         | Renders custom content at the bottom of the dropdown panel (e.g. selected count)                                      |
| `ng-typetosearch-tmp`   | Customizes the message shown before the user starts typing when using `typeahead`                                     |
| `ng-notfound-tmp`       | Customizes the message shown when the search returns no results; exposes `searchTerm`                                 |
| `ng-loadingtext-tmp`    | Customizes the text shown while items are being loaded; exposes `searchTerm`                                          |
| `ng-loadingspinner-tmp` | Replaces the default loading spinner with custom markup                                                               |
| `ng-clearbutton-tmp`    | Replaces the default clear button with custom markup                                                                  |

### Inputs

| Input        | Type                   | Default | Description                                                                  |
| ------------ | ---------------------- | ------- | ---------------------------------------------------------------------------- |
| [items]      | `Array<any>`           | `[]`    | Items array                                                                  |
| bindLabel    | `string`               | `label` | Object property to use for label. Default `label`                            |
| bindValue    | `string`               | `-`     | Object property to use for selected model. By default binds to whole object. |
| [multiple]   | `boolean`              | `false` | Allows to select multiple items.                                             |
| [groupBy]    | `string` \| `Function` | null    | Allow to group items by key or function expression                           |
| [searchable] | `boolean`              | `true`  | Allow to search for value. Default `true`                                    |
| [loading]    | `boolean`              | `-`     | You can set the loading state from the outside (e.g. async items loading)    |
| [typeahead]  | `Subject`              | `-`     | Custom autocomplete or advanced filter.                                      |
| placeholder  | `string`               | `-`     | Placeholder text.                                                            |

See the `NgSelectComponent` API reference for the complete list of inputs and outputs.
