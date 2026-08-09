ng-select can create new options on the fly using the `addTag` input, letting users add items that are not in the list.

## Default tags

{{ NgDocActions.demo("TagsDefaultExampleComponent") }}

{{ NgDocActions.demo("StackblitzButtonComponent", { container: false, inputs: { example: "tags-default-example" } }) }}

## Custom tags

{{ NgDocActions.demo("TagsCustomExampleComponent") }}

{{ NgDocActions.demo("StackblitzButtonComponent", { container: false, inputs: { example: "tags-custom-example" } }) }}

## Server side tags

{{ NgDocActions.demo("TagsBackendExampleComponent") }}

{{ NgDocActions.demo("StackblitzButtonComponent", { container: false, inputs: { example: "tags-backend-example" } }) }}

## Tags without dropdown panel

{{ NgDocActions.demo("TagsClosedDropdownExampleComponent") }}

{{ NgDocActions.demo("StackblitzButtonComponent", { container: false, inputs: { example: "tags-closed-dropdown-example" } }) }}

## API

Inputs used by the examples on this page:

| Input          | Type                                                 | Default    | Description                                                                                        |
| -------------- | ---------------------------------------------------- | ---------- | -------------------------------------------------------------------------------------------------- |
| [addTag]       | `boolean \| ((term: string) => any \| Promise<any>)` | `false`    | Allows to create custom options.                                                                   |
| addTagText     | `string`                                             | `Add item` | Set custom text when using tagging                                                                 |
| bindLabel      | `string`                                             | `label`    | Object property to use for label. Default `label`                                                  |
| [hideSelected] | `boolean`                                            | `false`    | Allows to hide selected items.                                                                     |
| [isOpen]       | `boolean`                                            | `-`        | Allows manual control of dropdown opening and closing. `true` - won't close. `false` - won't open. |
| [items]        | `Array<any>`                                         | `[]`       | Items array                                                                                        |
| [loading]      | `boolean`                                            | `-`        | You can set the loading state from the outside (e.g. async items loading)                          |
| [multiple]     | `boolean`                                            | `false`    | Allows to select multiple items.                                                                   |
| [selectOnTab]  | `boolean`                                            | `false`    | Select marked dropdown item using tab. Default `false`                                             |

See the `NgSelectComponent` API reference for the complete list of inputs and outputs.
