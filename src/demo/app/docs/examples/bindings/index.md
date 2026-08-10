ng-select can bind to plain values, whole objects, or nested properties using `bindLabel` and `bindValue`.

## Bind to default values

{{ NgDocActions.demo("BindingsDefaultExampleComponent") }}

{{ NgDocActions.demo("StackblitzButtonComponent", { container: false, inputs: { example: "bindings-default-example" } }) }}

## Bind to custom values

{{ NgDocActions.demo("BindingsCustomExampleComponent") }}

{{ NgDocActions.demo("StackblitzButtonComponent", { container: false, inputs: { example: "bindings-custom-example" } }) }}

## Bind to nested properties

{{ NgDocActions.demo("BindingsNestedExampleComponent") }}

{{ NgDocActions.demo("StackblitzButtonComponent", { container: false, inputs: { example: "bindings-nested-example" } }) }}

## API

Inputs used by the examples on this page:

| Input         | Type                          | Default             | Description                                                                                                                                                                                    |
| ------------- | ----------------------------- | ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [items]       | `Array<any>`                  | `[]`                | Items array                                                                                                                                                                                    |
| bindLabel     | `string`                      | `label`             | Object property to use for label. Default `label`                                                                                                                                              |
| bindValue     | `string`                      | `-`                 | Object property to use for selected model. By default binds to whole object.                                                                                                                   |
| placeholder   | `string`                      | `-`                 | Placeholder text.                                                                                                                                                                              |
| [compareWith] | `(a: any, b: any) => boolean` | `(a, b) => a === b` | A function to compare the option values with the selected values. The first argument is a value from an option. The second is a value from the selection(model). A boolean should be returned. |

See the `NgSelectComponent` API reference for the complete list of inputs and outputs.
