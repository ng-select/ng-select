ng-select ships with a bundled Material Design theme stylesheet (`@ng-select/ng-select/themes/material.theme.css`) that styles the select to match Angular Material form fields.

## Material appearances (default / outline / fill)

{{ NgDocActions.demo("MaterialAppearancesExampleComponent") }}

{{ NgDocActions.demo("StackblitzButtonComponent", { container: false, inputs: { example: "material-appearances-example" } }) }}

## Material outline and fill states

{{ NgDocActions.demo("MaterialStatesExampleComponent") }}

{{ NgDocActions.demo("StackblitzButtonComponent", { container: false, inputs: { example: "material-states-example" } }) }}

## Material multiselect appearances

{{ NgDocActions.demo("MaterialMultiselectExampleComponent") }}

{{ NgDocActions.demo("StackblitzButtonComponent", { container: false, inputs: { example: "material-multiselect-example" } }) }}

## API

Inputs used by the examples on this page:

| Input           | Type         | Default     | Description                                                                                                                      |
| --------------- | ------------ | ----------- | -------------------------------------------------------------------------------------------------------------------------------- |
| appearance      | `string`     | `underline` | Allows to select dropdown appearance. Set to `outline` or `fill` for Material form-field styles (applies only to Material theme) |
| bindLabel       | `string`     | `label`     | Object property to use for label. Default `label`                                                                                |
| [clearable]     | `boolean`    | `true`      | Allow to clear selected value. Default `true`                                                                                    |
| [closeOnSelect] | `boolean`    | true        | Whether to close the menu when a value is selected                                                                               |
| [items]         | `Array<any>` | `[]`        | Items array                                                                                                                      |
| [multiple]      | `boolean`    | `false`     | Allows to select multiple items.                                                                                                 |
| placeholder     | `string`     | `-`         | Placeholder text.                                                                                                                |

See the `NgSelectComponent` API reference for the complete list of inputs and outputs.
