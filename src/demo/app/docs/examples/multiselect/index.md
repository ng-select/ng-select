Setting `[multiple]="true"` enables multiselect mode, allowing users to select more than one item at a time.

## Multi select

{{ NgDocActions.demo("MultiSelectDefaultExampleComponent") }}

{{ NgDocActions.demo("StackblitzButtonComponent", { container: false, inputs: { example: "multi-select-default-example" } }) }}

## Hidden selected items

{{ NgDocActions.demo("MultiSelectHiddenExampleComponent") }}

{{ NgDocActions.demo("StackblitzButtonComponent", { container: false, inputs: { example: "multi-select-hidden-example" } }) }}

## Limited number of selections

{{ NgDocActions.demo("MultiSelectLimitExampleComponent") }}

{{ NgDocActions.demo("StackblitzButtonComponent", { container: false, inputs: { example: "multi-select-limit-example" } }) }}

## Disabled select

{{ NgDocActions.demo("MultiSelectDisabledExampleComponent") }}

{{ NgDocActions.demo("StackblitzButtonComponent", { container: false, inputs: { example: "multi-select-disabled-example" } }) }}

## Custom selected item template

{{ NgDocActions.demo("MultiSelectTemplateExampleComponent") }}

{{ NgDocActions.demo("StackblitzButtonComponent", { container: false, inputs: { example: "multi-select-template-example" } }) }}

## Custom selected items template

{{ NgDocActions.demo("MultiSelectCustomExampleComponent") }}

{{ NgDocActions.demo("StackblitzButtonComponent", { container: false, inputs: { example: "multi-select-custom-example" } }) }}

## API

Inputs used by the examples on this page:

| Input              | Type         | Default  | Description                                                                                                               |
| ------------------ | ------------ | -------- | ------------------------------------------------------------------------------------------------------------------------- |
| [items]            | `Array<any>` | `[]`     | Items array                                                                                                               |
| [multiple]         | `boolean`    | `false`  | Allows to select multiple items.                                                                                          |
| maxSelectedItems   | `number`     | none     | When multiple = true, allows to set a limit number of selection.                                                          |
| [hideSelected]     | `boolean`    | `false`  | Allows to hide selected items.                                                                                            |
| [closeOnSelect]    | `boolean`    | true     | Whether to close the menu when a value is selected                                                                        |
| [clearOnBackspace] | `boolean`    | `true`   | Clear selected values one by one when clicking backspace. Default `true`                                                  |
| [clearSearchOnAdd] | `boolean`    | `true`   | Clears search input when item is selected. Default `true`. Default `false` when **closeOnSelect** is `false`              |
| [deselectOnClick]  | `boolean`    | `false`  | Deselects a selected item when it is clicked in the dropdown. Default `false`. Default `true` when **multiple** is `true` |
| removeText         | `string`     | `Remove` | Set custom text prefixed to the option label in the aria-label of the remove icon on selected values (multiple mode)      |
| bindLabel          | `string`     | `label`  | Object property to use for label. Default `label`                                                                         |
| bindValue          | `string`     | `-`      | Object property to use for selected model. By default binds to whole object.                                              |
| placeholder        | `string`     | `-`      | Placeholder text.                                                                                                         |
| [searchable]       | `boolean`    | `true`   | Allow to search for value. Default `true`                                                                                 |

See the `NgSelectComponent` API reference for the complete list of inputs and outputs.
