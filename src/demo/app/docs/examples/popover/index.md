The `popover` input is **deprecated and has no effect**: the dropdown panel always renders in an Angular CDK overlay, and the CDK uses the browser's native Popover API top layer automatically wherever it is supported. The panel can never be clipped by `overflow: hidden` containers and never ends up behind another element's stacking context — including native dialogs and Bootstrap modals.

## Top layer rendering

{{ NgDocActions.demo("PopoverExampleComponent") }}

{{ NgDocActions.demo("StackblitzButtonComponent", { container: false, inputs: { example: "popover-example" } }) }}

## API

Inputs used by the examples on this page:

| Input       | Type         | Default | Description                                                                                                                       |
| ----------- | ------------ | ------- | --------------------------------------------------------------------------------------------------------------------------------- |
| [popover]   | `boolean`    | `false` | **Deprecated — has no effect.** The CDK overlay renders in the native Popover API top layer automatically in supporting browsers. |
| [items]     | `Array<any>` | `[]`    | Items array                                                                                                                       |
| bindLabel   | `string`     | `label` | Object property to use for label. Default `label`                                                                                 |
| placeholder | `string`     | `-`     | Placeholder text.                                                                                                                 |

See the `NgSelectComponent` API reference for the complete list of inputs and outputs.
