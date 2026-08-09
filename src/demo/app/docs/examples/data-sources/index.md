ng-select accepts items from an array of objects, inline `ng-option` elements, or asynchronous/observable data.

## Array of objects

Bind an array of objects (or primitives) to the `items` input.

{{ NgDocActions.demo("DataSourceArrayExampleComponent") }}

{{ NgDocActions.demo("StackblitzButtonComponent", { container: false, inputs: { example: "data-source-array-example" } }) }}

## Display data using ng-option

For simple use cases, omit the items array and declare options directly in the template with `ng-option`.

{{ NgDocActions.demo("DataSourceOptionsExampleComponent") }}

{{ NgDocActions.demo("StackblitzButtonComponent", { container: false, inputs: { example: "data-source-options-example" } }) }}

## Backend data with async pipe

Load items from a backend as an observable and bind them with the `async` pipe.

{{ NgDocActions.demo("DataSourceBackendExampleComponent") }}

{{ NgDocActions.demo("StackblitzButtonComponent", { container: false, inputs: { example: "data-source-backend-example" } }) }}

## API

Inputs used by the examples on this page:

| Input       | Type         | Default      | Description                                                                  |
| ----------- | ------------ | ------------ | ---------------------------------------------------------------------------- |
| [items]     | `Array<any>` | `[]`         | Items array                                                                  |
| bindLabel   | `string`     | `label`      | Object property to use for label. Default `label`                            |
| bindValue   | `string`     | `-`          | Object property to use for selected model. By default binds to whole object. |
| [multiple]  | `boolean`    | `false`      | Allows to select multiple items.                                             |
| [loading]   | `boolean`    | `-`          | You can set the loading state from the outside (e.g. async items loading)    |
| loadingText | `string`     | `Loading...` | Set custom text when for loading items                                       |

See the `NgSelectComponent` API reference for the complete list of inputs and outputs.
