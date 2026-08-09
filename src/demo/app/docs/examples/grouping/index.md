Use the `groupBy` input to group options by an item key or a function expression.

## Group by item key

{{ NgDocActions.demo("GroupDefaultExampleComponent") }}

{{ NgDocActions.demo("StackblitzButtonComponent", { container: false, inputs: { example: "group-default-example" } }) }}

## Group by function expression

{{ NgDocActions.demo("GroupFunctionExampleComponent") }}

{{ NgDocActions.demo("StackblitzButtonComponent", { container: false, inputs: { example: "group-function-example" } }) }}

## Selectable groups

{{ NgDocActions.demo("GroupSelectableExampleComponent") }}

{{ NgDocActions.demo("StackblitzButtonComponent", { container: false, inputs: { example: "group-selectable-example" } }) }}

## Selectable groups with hidden selected items

{{ NgDocActions.demo("GroupSelectableHiddenExampleComponent") }}

{{ NgDocActions.demo("StackblitzButtonComponent", { container: false, inputs: { example: "group-selectable-hidden-example" } }) }}

## Items with already grouped children array

{{ NgDocActions.demo("GroupChildrenExampleComponent") }}

{{ NgDocActions.demo("StackblitzButtonComponent", { container: false, inputs: { example: "group-children-example" } }) }}

## API

Inputs used by the examples on this page:

| Input                    | Type                                            | Default             | Description                                                                                                                                                                                    |
| ------------------------ | ----------------------------------------------- | ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [groupBy]                | `string` \| `Function`                          | null                | Allow to group items by key or function expression                                                                                                                                             |
| [groupValue]             | `(groupKey: string, children: any[]) => Object` | -                   | Function expression to provide group value                                                                                                                                                     |
| [selectableGroup]        | `boolean`                                       | false               | Allow to select group when groupBy is used                                                                                                                                                     |
| [selectableGroupAsModel] | `boolean`                                       | true                | Indicates whether to select all children or group itself                                                                                                                                       |
| [hideSelected]           | `boolean`                                       | `false`             | Allows to hide selected items.                                                                                                                                                                 |
| [items]                  | `Array<any>`                                    | `[]`                | Items array                                                                                                                                                                                    |
| [multiple]               | `boolean`                                       | `false`             | Allows to select multiple items.                                                                                                                                                               |
| [closeOnSelect]          | `boolean`                                       | true                | Whether to close the menu when a value is selected                                                                                                                                             |
| [compareWith]            | `(a: any, b: any) => boolean`                   | `(a, b) => a === b` | A function to compare the option values with the selected values. The first argument is a value from an option. The second is a value from the selection(model). A boolean should be returned. |
| bindLabel                | `string`                                        | `label`             | Object property to use for label. Default `label`                                                                                                                                              |
| bindValue                | `string`                                        | `-`                 | Object property to use for selected model. By default binds to whole object.                                                                                                                   |

See the `NgSelectComponent` API reference for the complete list of inputs and outputs.
