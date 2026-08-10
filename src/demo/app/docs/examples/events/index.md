ng-select emits output events for user interactions such as open, close, change, search, focus, blur, and scroll, so you can react to what happens inside the select.

## Output events

{{ NgDocActions.demo("OutputEventsExampleComponent") }}

{{ NgDocActions.demo("StackblitzButtonComponent", { container: false, inputs: { example: "output-events-example" } }) }}

## API

| Output        | Description                                                                                                                                                                                                                                   |
| ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| (add)         | Fired when item is added while `[multiple]="true"`. Outputs added item                                                                                                                                                                        |
| (blur)        | Fired on select blur                                                                                                                                                                                                                          |
| (change)      | Fired on model change. Outputs whole model                                                                                                                                                                                                    |
| (close)       | Fired on select dropdown close                                                                                                                                                                                                                |
| (clear)       | Fired on clear icon click                                                                                                                                                                                                                     |
| (focus)       | Fired on select focus                                                                                                                                                                                                                         |
| (search)      | Fired while typing search term. Outputs search term with filtered items                                                                                                                                                                       |
| (open)        | Fired on select dropdown open                                                                                                                                                                                                                 |
| (remove)      | Fired when item is removed while `[multiple]="true"`                                                                                                                                                                                          |
| (scroll)      | Fired when scrolled (only when `[virtualScroll]="true"`). Provides the start and end index of the currently available items. Can be used for loading more items in chunks before the user has scrolled all the way to the bottom of the list. |
| (scrollToEnd) | Fired when scrolled to the end of items. Can be used for loading more items in chunks.                                                                                                                                                        |

### Methods

| Name  | Description                      |
| ----- | -------------------------------- |
| open  | Opens the select dropdown panel  |
| close | Closes the select dropdown panel |
| focus | Focuses the select element       |
| blur  | Blurs the select element         |

See the `NgSelectComponent` API reference for the complete list of inputs and outputs.
