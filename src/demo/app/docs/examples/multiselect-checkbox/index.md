Render checkboxes inside dropdown options by using custom option templates in multiselect mode.

## Multi select with checkboxes

{{ NgDocActions.demo("MultiCheckboxExampleComponent") }}

{{ NgDocActions.demo("StackblitzButtonComponent", { container: false, inputs: { example: "multi-checkbox-example" } }) }}

## Grouped multi select with checkboxes

{{ NgDocActions.demo("MultiCheckboxGroupExampleComponent") }}

{{ NgDocActions.demo("StackblitzButtonComponent", { container: false, inputs: { example: "multi-checkbox-group-example" } }) }}

## API

Inputs used by the examples on this page:

| Input                    | Type                   | Default | Description                                                                  |
| ------------------------ | ---------------------- | ------- | ---------------------------------------------------------------------------- |
| [items]                  | `Array<any>`           | `[]`    | Items array                                                                  |
| [multiple]               | `boolean`              | `false` | Allows to select multiple items.                                             |
| bindLabel                | `string`               | `label` | Object property to use for label. Default `label`                            |
| bindValue                | `string`               | `-`     | Object property to use for selected model. By default binds to whole object. |
| [groupBy]                | `string` \| `Function` | null    | Allow to group items by key or function expression                           |
| [selectableGroup]        | `boolean`              | false   | Allow to select group when groupBy is used                                   |
| [selectableGroupAsModel] | `boolean`              | true    | Indicates whether to select all children or group itself                     |
| [closeOnSelect]          | `boolean`              | true    | Whether to close the menu when a value is selected                           |

See the `NgSelectComponent` API reference for the complete list of inputs and outputs.
