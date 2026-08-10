The `appendTo` input is **deprecated and has no effect**: the dropdown panel now always renders in an Angular CDK overlay attached to the document body, so the clipping and stacking problems `appendTo` existed for are solved out of the box. Remove the input from your templates and from `NgSelectConfig`.

## Clipped and scrollable containers

{{ NgDocActions.demo("AppendToExampleComponent") }}

{{ NgDocActions.demo("StackblitzButtonComponent", { container: false, inputs: { example: "append-to-example" } }) }}

## Bootstrap modal

The overlay renders in the browser's top layer (native Popover API) wherever supported, so the panel paints above the modal without any configuration:

{{ NgDocActions.demo("ModalNgBootstrapExampleComponent") }}

{{ NgDocActions.demo("StackblitzButtonComponent", { container: false, inputs: { example: "modal-ng-bootstrap-example" } }) }}

## API

Inputs used by the examples on this page:

| Input       | Type         | Default | Description                                                                                                       |
| ----------- | ------------ | ------- | ----------------------------------------------------------------------------------------------------------------- |
| appendTo    | `string`     | null    | **Deprecated — has no effect.** The dropdown panel always renders in a CDK overlay attached to the document body. |
| [items]     | `Array<any>` | `[]`    | Items array                                                                                                       |
| bindLabel   | `string`     | `label` | Object property to use for label. Default `label`                                                                 |
| placeholder | `string`     | `-`     | Placeholder text.                                                                                                 |

See the `NgSelectComponent` API reference for the complete list of inputs and outputs.
