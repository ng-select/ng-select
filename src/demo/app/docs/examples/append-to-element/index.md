The dropdown panel renders in an Angular CDK overlay and paints in the browser's top layer wherever the native Popover API is supported, so the clipping and stacking problems that used to require `appendTo` are solved out of the box. The `appendTo` input now controls where the overlay lives **in the DOM**: pass any css selector when ancestor-scoped styles, a stacking context, or focus containment require the panel to be a descendant of a specific element. Positioning stays viewport-based either way, and the panel keeps following the select while scrolling.

## Clipped and scrollable containers

{{ NgDocActions.demo("AppendToExampleComponent") }}

{{ NgDocActions.demo("StackblitzButtonComponent", { container: false, inputs: { example: "append-to-example" } }) }}

## Bootstrap modal

The overlay renders in the browser's top layer (native Popover API) wherever supported, so the panel paints above the modal without any configuration:

{{ NgDocActions.demo("ModalNgBootstrapExampleComponent") }}

{{ NgDocActions.demo("StackblitzButtonComponent", { container: false, inputs: { example: "modal-ng-bootstrap-example" } }) }}

## API

Inputs used by the examples on this page:

| Input       | Type         | Default | Description                                                                                                                                                                                |
| ----------- | ------------ | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| appendTo    | `string`     | null    | Append the dropdown overlay to any element using a css selector. Painting and positioning are unaffected; the target determines DOM containment (ancestor-scoped styles, focus enclosure). |
| [items]     | `Array<any>` | `[]`    | Items array                                                                                                                                                                                |
| bindLabel   | `string`     | `label` | Object property to use for label. Default `label`                                                                                                                                          |
| placeholder | `string`     | `-`     | Placeholder text.                                                                                                                                                                          |

See the `NgSelectComponent` API reference for the complete list of inputs and outputs.
