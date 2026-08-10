ng-select can render large lists efficiently by enabling `[virtualScroll]="true"`, which only renders the options currently visible in the dropdown viewport.

## Virtual scroll

{{ NgDocActions.demo("VirtualScrollExampleComponent") }}

{{ NgDocActions.demo("StackblitzButtonComponent", { container: false, inputs: { example: "virtual-scroll-example" } }) }}

## API

Inputs used by the examples on this page:

| Input           | Type         | Default | Description                                                                                                                                                     |
| --------------- | ------------ | ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [virtualScroll] | `boolean`    | false   | Enable virtual scroll for better performance when rendering a lot of data                                                                                       |
| bufferAmount    | `number`     | 4       | Used in virtual scrolling, the `bufferAmount` property controls the number of items preloaded in the background to ensure smoother and more seamless scrolling. |
| [items]         | `Array<any>` | `[]`    | Items array                                                                                                                                                     |
| [loading]       | `boolean`    | `-`     | You can set the loading state from the outside (e.g. async items loading)                                                                                       |
| bindLabel       | `string`     | `label` | Object property to use for label. Default `label`                                                                                                               |
| bindValue       | `string`     | `-`     | Object property to use for selected model. By default binds to whole object.                                                                                    |
| placeholder     | `string`     | `-`     | Placeholder text.                                                                                                                                               |

Outputs used by the examples on this page:

| Output        | Description                                                                                                                                                                                                                                   |
| ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| (scroll)      | Fired when scrolled (only when `[virtualScroll]="true"`). Provides the start and end index of the currently available items. Can be used for loading more items in chunks before the user has scrolled all the way to the bottom of the list. |
| (scrollToEnd) | Fired when scrolled to the end of items. Can be used for loading more items in chunks.                                                                                                                                                        |

See the `NgSelectComponent` API reference for the complete list of inputs and outputs.
