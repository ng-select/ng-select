Control where the dropdown panel opens relative to the select — top, bottom, or auto based on available space.

## Dropdown position

{{ NgDocActions.demo("DropdownPositionExampleComponent") }}

{{ NgDocActions.demo("StackblitzButtonComponent", { container: false, inputs: { example: "dropdown-position-example" } }) }}

## API

Inputs used by the examples on this page:

| Input            | Type                        | Default | Description                               |
| ---------------- | --------------------------- | ------- | ----------------------------------------- |
| dropdownPosition | `bottom` \| `top` \| `auto` | `auto`  | Set the dropdown position on open         |
| [items]          | `Array<any>`                | `[]`    | Items array                               |
| [searchable]     | `boolean`                   | `true`  | Allow to search for value. Default `true` |

See the `NgSelectComponent` API reference for the complete list of inputs and outputs.
