Ng-select filters items as you type and supports custom search functions, server-side typeahead, and autocomplete scenarios.

## Default search

{{ NgDocActions.demo("SearchDefaultExampleComponent") }}

{{ NgDocActions.demo("StackblitzButtonComponent", { container: false, inputs: { example: "search-default-example" } }) }}

## Search across multiple fields using [searchFn]

{{ NgDocActions.demo("SearchCustomExampleComponent") }}

{{ NgDocActions.demo("StackblitzButtonComponent", { container: false, inputs: { example: "search-custom-example" } }) }}

## Custom server-side search

{{ NgDocActions.demo("SearchAutocompleteExampleComponent") }}

{{ NgDocActions.demo("StackblitzButtonComponent", { container: false, inputs: { example: "search-autocomplete-example" } }) }}

## Editable search value

{{ NgDocActions.demo("SearchEditableExampleComponent") }}

{{ NgDocActions.demo("StackblitzButtonComponent", { container: false, inputs: { example: "search-editable-example" } }) }}

## API

Inputs used by the examples on this page:

| Input                  | Type                                                 | Default          | Description                                                                                                  |
| ---------------------- | ---------------------------------------------------- | ---------------- | ------------------------------------------------------------------------------------------------------------ |
| [items]                | `Array<any>`                                         | `[]`             | Items array                                                                                                  |
| bindLabel              | `string`                                             | `label`          | Object property to use for label. Default `label`                                                            |
| bindValue              | `string`                                             | `-`              | Object property to use for selected model. By default binds to whole object.                                 |
| [searchable]           | `boolean`                                            | `true`           | Allow to search for value. Default `true`                                                                    |
| [searchFn]             | `(term: string, item: any) => boolean`               | `null`           | Allow to filter by custom search function                                                                    |
| [typeahead]            | `Subject`                                            | `-`              | Custom autocomplete or advanced filter.                                                                      |
| [minTermLength]        | `number`                                             | `0`              | Minimum term length to start a search. Should be used with `typeahead`                                       |
| typeToSearchText       | `string`                                             | `Type to search` | Set custom text when using Typeahead                                                                         |
| [editableSearchTerm]   | `boolean`                                            | `false`          | Allow to edit search query if option selected. Default `false`. Works only if multiple is `false`.           |
| [searchWhileComposing] | `boolean`                                            | `true`           | Whether items should be filtered while composition started                                                   |
| notFoundText           | `string`                                             | `No items found` | Set custom text when filter returns empty result                                                             |
| [loading]              | `boolean`                                            | `-`              | You can set the loading state from the outside (e.g. async items loading)                                    |
| [addTag]               | `boolean \| ((term: string) => any \| Promise<any>)` | `false`          | Allows to create custom options.                                                                             |
| [multiple]             | `boolean`                                            | `false`          | Allows to select multiple items.                                                                             |
| [hideSelected]         | `boolean`                                            | `false`          | Allows to hide selected items.                                                                               |
| [trackByFn]            | `(item: any) => any`                                 | `null`           | Provide custom trackBy function                                                                              |
| [clearSearchOnAdd]     | `boolean`                                            | `true`           | Clears search input when item is selected. Default `true`. Default `false` when **closeOnSelect** is `false` |

See the `NgSelectComponent` API reference for the complete list of inputs and outputs.
