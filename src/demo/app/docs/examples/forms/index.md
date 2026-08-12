ng-select works seamlessly with Angular reactive forms — bind it with `formControlName` to get value tracking, validation, and form state out of the box.

## Single select with required validation

{{ NgDocActions.demo("FormsSingleSelectExampleComponent") }}

{{ NgDocActions.demo("StackblitzButtonComponent", { container: false, inputs: { example: "forms-single-select-example" } }) }}

## Multi select with clear button

{{ NgDocActions.demo("FormsMultiSelectExampleComponent") }}

{{ NgDocActions.demo("StackblitzButtonComponent", { container: false, inputs: { example: "forms-multi-select-example" } }) }}

## Reactive form using ng-option

{{ NgDocActions.demo("FormsWithOptionsExampleComponent") }}

{{ NgDocActions.demo("StackblitzButtonComponent", { container: false, inputs: { example: "forms-with-options-example" } }) }}

## Reactive forms using async data

{{ NgDocActions.demo("FormsAsyncDataExampleComponent") }}

{{ NgDocActions.demo("StackblitzButtonComponent", { container: false, inputs: { example: "forms-async-data-example" } }) }}

## Reactive forms with custom template

{{ NgDocActions.demo("FormsCustomTemplateExampleComponent") }}

{{ NgDocActions.demo("StackblitzButtonComponent", { container: false, inputs: { example: "forms-custom-template-example" } }) }}

## API

Inputs used by the examples on this page:

| Input            | Type                        | Default     | Description                                                                                                                      |
| ---------------- | --------------------------- | ----------- | -------------------------------------------------------------------------------------------------------------------------------- |
| [items]          | `Array<any>`                | `[]`        | Items array                                                                                                                      |
| bindLabel        | `string`                    | `label`     | Object property to use for label. Default `label`                                                                                |
| bindValue        | `string`                    | `-`         | Object property to use for selected model. By default binds to whole object.                                                     |
| [multiple]       | `boolean`                   | `false`     | Allows to select multiple items.                                                                                                 |
| [clearable]      | `boolean`                   | `true`      | Allow to clear selected value. Default `true`                                                                                    |
| [readonly]       | `boolean`                   | `false`     | Set ng-select as readonly. Mostly used with reactive forms.                                                                      |
| [searchable]     | `boolean`                   | `true`      | Allow to search for value. Default `true`                                                                                        |
| placeholder      | `string`                    | `-`         | Placeholder text.                                                                                                                |
| labelForId       | `string`                    | `-`         | Id to associate control with label.                                                                                              |
| appearance       | `string`                    | `underline` | Allows to select dropdown appearance. Set to `outline` or `fill` for Material form-field styles (applies only to Material theme) |
| appendTo         | `string`                    | null        | Append dropdown to body or any other element using css selector. For correct positioning `body` should have `position:relative`  |
| dropdownPosition | `bottom` \| `top` \| `auto` | `auto`      | Set the dropdown position on open                                                                                                |
| clearAllText     | `string`                    | `Clear all` | Set custom text for clear all icon title                                                                                         |
| [selectOnTab]    | `boolean`                   | `false`     | Select marked dropdown item using tab. Default `false`                                                                           |
| [virtualScroll]  | `boolean`                   | false       | Enable virtual scroll for better performance when rendering a lot of data                                                        |

Outputs used by the examples on this page:

| Output   | Description                                |
| -------- | ------------------------------------------ |
| (change) | Fired on model change. Outputs whole model |

See the `NgSelectComponent` API reference for the complete list of inputs and outputs.
