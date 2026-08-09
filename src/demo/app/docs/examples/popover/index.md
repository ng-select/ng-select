ng-select works inside native popovers and other top layer elements, keeping its dropdown visible above the popover content.

## Popover top layer

{{ NgDocActions.demo("PopoverExampleComponent") }}

{{ NgDocActions.demo("StackblitzButtonComponent", { container: false, inputs: { example: "popover-example" } }) }}

## API

Inputs used by the examples on this page:

| Input       | Type         | Default | Description                                                                                                                                                                            |
| ----------- | ------------ | ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [popover]   | `boolean`    | `false` | Display the dropdown in the top-layer using the native Popover API. Useful when the dropdown is clipped or hidden behind dialogs or other stacking contexts. Alternative to `appendTo` |
| [items]     | `Array<any>` | `[]`    | Items array                                                                                                                                                                            |
| bindLabel   | `string`     | `label` | Object property to use for label. Default `label`                                                                                                                                      |
| placeholder | `string`     | `-`     | Placeholder text.                                                                                                                                                                      |

See the `NgSelectComponent` API reference for the complete list of inputs and outputs.
