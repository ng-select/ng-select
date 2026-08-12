Use the `appendTo` input to render the dropdown panel outside the component (e.g. `body`) to escape overflow and z-index issues in scrollable or clipped containers.

## Append to position

{{ NgDocActions.demo("AppendToExampleComponent") }}

{{ NgDocActions.demo("StackblitzButtonComponent", { container: false, inputs: { example: "append-to-example" } }) }}

## Bootstrap modal

{{ NgDocActions.demo("ModalNgBootstrapExampleComponent") }}

{{ NgDocActions.demo("StackblitzButtonComponent", { container: false, inputs: { example: "modal-ng-bootstrap-example" } }) }}

## API

Inputs used by the examples on this page:

| Input       | Type         | Default | Description                                                                                                                     |
| ----------- | ------------ | ------- | ------------------------------------------------------------------------------------------------------------------------------- |
| appendTo    | `string`     | null    | Append dropdown to body or any other element using css selector. For correct positioning `body` should have `position:relative` |
| [items]     | `Array<any>` | `[]`    | Items array                                                                                                                     |
| bindLabel   | `string`     | `label` | Object property to use for label. Default `label`                                                                               |
| placeholder | `string`     | `-`     | Placeholder text.                                                                                                               |

See the `NgSelectComponent` API reference for the complete list of inputs and outputs.
