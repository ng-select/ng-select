 [![npm version](https://badge.fury.io/js/%40ng-select%2Fng-select.svg)](https://badge.fury.io/js/%40ng-select%2Fng-select)
[![Coverage Status][coveralls-image]][coveralls-url]
[![gzip bundle size](http://img.badgesize.io/https://unpkg.com/@ng-select/ng-select@latest/bundles/ng-select-ng-select.umd.min.js?compression=gzip&style=flat-square)][ng-select-url]

[coveralls-image]: https://coveralls.io/repos/github/ng-select/ng-select/badge.svg?branch=master
[coveralls-url]: https://coveralls.io/github/ng-select/ng-select?branch=master
[ng-select-url]: https://unpkg.com/@ng-select/ng-select@latest

# Angular ng-select - Lightweight all in one UI Select, Multiselect and Autocomplete
See [Demo](https://ng-select.github.io/ng-select) page.

---

## Versions

| Angular| ng-select|
| ------|:------:| 
| >=8.0.0 <9.0.0  | v3.x |
| >=6.0.0 <8.0.0  | v2.x |
| v5.x.x  | v1.x |

---

Table of contents
=================

  * [Features](#features)
  * [Getting started](#getting-started)
  * [API](#api)
  * [Change detection](#change-detection)
  * [Custom styles](#custom-styles)
    * [Validation state](#validation-state)
  * [Contributing](#contributing)
  * [Development](#development)
  * [Inspiration](#inspiration)

## Features
- [x] Custom binding to property or object
- [x] Custom option, label, header and footer templates
- [x] Virtual Scroll support with large data sets (>5000 items).
- [x] Infinite scroll
- [x] Keyboard navigation
- [x] Multiselect
- [x] Flexible autocomplete with client/server filtering
- [x] Custom search
- [x] Custom tags
- [x] Append to
- [x] Group items
- [x] Output events
- [x] Accessibility
- [x] Good base functionality test coverage
- [x] Themes

## Warning
Library is under active development and may have API breaking changes for subsequent major versions after 1.0.0.

## Getting started
### Step 1: Install `ng-select`:

#### NPM
```shell
npm install --save @ng-select/ng-select
```
#### YARN
```shell
yarn add @ng-select/ng-select
```
### Step 2: Import the NgSelectModule and angular FormsModule module:
```js
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [AppComponent],
  imports: [NgSelectModule, FormsModule],
  bootstrap: [AppComponent]
})
export class AppModule {}
```

### Step 3: Include a theme: 
To allow customization and theming, `ng-select` bundle includes only generic styles that are necessary for correct layout and positioning. To get full look of the control, include one of the themes in your application. If you're using the Angular CLI, you can add this to your `styles.scss` or include it in `.angular-cli.json` (Angular v5 and below) or `angular.json` (Angular v6 onwards).

```scss
@import "~@ng-select/ng-select/themes/default.theme.css";
// ... or 
@import "~@ng-select/ng-select/themes/material.theme.css";

```


### Step 4 (Optional): Configuration 

You can also set global configuration and localization messages by injecting NgSelectConfig service,
typically in your root component, and customize the values of its properties in order to provide default values.

```js
  constructor(private config: NgSelectConfig) {
      this.config.notFoundText = 'Custom not found';
      this.config.appendTo = 'body';
      // set the bindValue to global config when you use the same 
      // bindValue in most of the place. 
      // You can also override bindValue for the specified template 
      // by defining `bindValue` as property
      // Eg : <ng-select bindValue="some-new-value"></ng-select>
      this.config.bindValue = 'value';
  }
```
### SystemJS
If you are using SystemJS, you should also adjust your configuration to point to the UMD bundle.

In your systemjs config file, `map` needs to tell the System loader where to look for `ng-select`:
```js
map: {
  '@ng-select/ng-select': 'node_modules/@ng-select/ng-select/bundles/ng-select.umd.js',
}
```

## API
### Inputs
| Input  | Type | Default | Required | Description |
| ------------- | ------------- | ------------- | ------------- | ------------- |
| [addTag] | `boolean \| ((term: string) => any \| Promise<any>)`  | `false` | no | Allows to create custom options. |
| addTagText | `string` | `Add item` | no | Set custom text when using tagging |
| appearance | `string` | `underline` | no | Allows to select dropdown appearance. Set to `outline` to add border instead of underline (applies only to Material theme) |
| appendTo | `string` |  null | no | Append dropdown to body or any other element using css selector. For correct positioning `body` should have `position:relative` |
| bindValue  | `string` | `-` | no | Object property to use for selected model. By default binds to whole object. |
| bindLabel  | `string` | `label` | no | Object property to use for label. Default `label`  |
| [closeOnSelect] | `boolean` |  true | no | Whether to close the menu when a value is selected |
| clearAllText | `string` | `Clear all` | no | Set custom text for clear all icon title |
| [clearable] | `boolean` | `true` | no | Allow to clear selected value. Default `true`|
| [clearOnBackspace] | `boolean` | `true` | no | Clear selected values one by one when clicking backspace. Default `true`|
| [compareWith] | `(a: any, b: any) => boolean` | `(a, b) => a === b` | no | A function to compare the option values with the selected values. The first argument is a value from an option. The second is a value from the selection(model). A boolean should be returned. |
| dropdownPosition | `bottom` \| `top` \| `auto` |  `auto` | no | Set the dropdown position on open |
| [groupBy] | `string` \| `Function` | null | no | Allow to group items by key or function expression |
| [groupValue] |  `(groupKey: string, cildren: any[]) => Object` | - | no | Function expression to provide group value |
| [selectableGroup] | `boolean` | false | no | Allow to select group when groupBy is used |
| [selectableGroupAsModel] | `boolean` | true | no | Indicates whether to select all children or group itself  |
| [items] | `Array<any>` | `[]` | yes | Items array |
| [loading] | `boolean` |  `-` | no | You can set the loading state from the outside (e.g. async items loading) |
| loadingText | `string` | `Loading...` | no | Set custom text when for loading items |
| labelForId | `string` | `-` | no | Id to associate control with label. |
| [markFirst] | `boolean` | `true` | no | Marks first item as focused when opening/filtering. |
| [isOpen] | `boolean` | `-` | no | Allows manual control of dropdown opening and closing. `True` - won't close. `False` - won't open. |
| maxSelectedItems | `number` | none | no | When multiple = true, allows to set a limit number of selection. |
| [hideSelected] | `boolean` | `false` | no | Allows to hide selected items. |
| [multiple] | `boolean` | `false` | no | Allows to select multiple items. |
| notFoundText | `string` | `No items found` | no | Set custom text when filter returns empty result |
| placeholder | `string` | `-` | no | Placeholder text. |
| [searchable] | `boolean` | `true` | no | Allow to search for value. Default `true`|
| [readonly] | `boolean` | `false` | no | Set ng-select as readonly. Mostly used with reactive forms. |
| [searchFn] | `(term: string, item: any) => boolean` | `null` | no | Allow to filter by custom search function |
| [searchWhileComposing] | `boolean` | `true` | no | Whether items should be filtered while composition started |
| [trackByFn] | `(item: any) => any` | `null` | no | Provide custom trackBy function |
| [clearSearchOnAdd] | `boolean` | `true` | no | Clears search input when item is selected. Default `true`. Default `false` when **closeOnSelect** is `false` |
| [editableSearchTerm] | `boolean` |  `false` | no | Allow to edit search query if option selected. Default `false`. Works only if multiple is `false`. |
| [selectOnTab] | `boolean` | `false` | no | Select marked dropdown item using tab. Default `false`|
| [openOnEnter] | `boolean` | `true` | no | Open dropdown using enter. Default `true`|
| [typeahead] | `Subject` |  `-` | no | Custom autocomplete or advanced filter. |
| [minTermLength] | `number` |  `0` | no | Minimum term length to start a search. Should be used with `typeahead` |
| typeToSearchText | `string` | `Type to search` | no | Set custom text when using Typeahead |
| [virtualScroll] | `boolean` |  false | no | Enable virtual scroll for better performance when rendering a lot of data |
| [inputAttrs] | `{ [key: string]: string }` |  `-` | no | Pass custom attributes to underlying `input` element |
| [tabIndex] | `number` |  `-` | no | Set tabindex on ng-select |
| [keyDownFn] | `($event: KeyboardEvent) => bool` |  `true` | no | Provide custom keyDown function. Executed before default handler. Return false to suppress execution of default key down handlers  |

### Outputs

| Output  | Description |
| ------------- | ------------- |
| (add)  | Fired when item is added while `[multiple]="true"`. Outputs added item |
| (blur)  | Fired on select blur |
| (change)  | Fired on model change. Outputs whole model |
| (close)  | Fired on select dropdown close |
| (clear)  | Fired on clear icon click |
| (focus)  | Fired on select focus |
| (search) | Fired while typing search term. Outputs search term with filtered items |
| (open)  | Fired on select dropdown open |
| (remove)  | Fired when item is removed while `[multiple]="true"` |
| (scroll)  | Fired when scrolled. Provides the start and end index of the currently available items. Can be used for loading more items in chunks before the user has scrolled all the way to the bottom of the list. |
| (scrollToEnd)  | Fired when scrolled to the end of items. Can be used for loading more items in chunks. |


### Methods
 Name  | Description |
| ------------- | ------------- |
| open  | Opens the select dropdown panel |
| close  | Closes the select dropdown panel |
| focus  | Focuses the select element |
| blur  | Blurs the select element |

### Other
 Name  | Type | Description |
| ------------- | ------------- | ------------- |
| [ngOptionHighlight] | directive | Highlights search term in option. Accepts search term. Should be used on option element. [README](https://github.com/ng-select/ng-select/blob/master/src/ng-option-highlight/README.md) |
| NgSelectConfig | configuration | Configuration provider for the NgSelect component. You can inject this service and provide application wide configuration. |
| SELECTION_MODEL_FACTORY | service | DI token for SelectionModel implementation. You can provide custom implementation changing selection behaviour. |

## Custom selection logic
Ng-select allows to provide custom selection implementation using `SELECTION_MODEL_FACTORY`. To override [default](https://github.com/ng-select/ng-select/blob/master/src/ng-select/lib/selection-model.ts) logic provide your factory method in your angular module.

```javascript
// app.module.ts
providers: [
    { provide: SELECTION_MODEL_FACTORY, useValue: <SelectionModelFactory>CustomSelectionFactory }
]

// selection-model.ts
export function CustomSelectionFactory() {
    return new CustomSelectionModel();
}

export class CustomSelectionModel implements SelectionModel {
    ...
}
```

## Change Detection
Ng-select component implements `OnPush` change detection which means the dirty checking checks for immutable 
data types. That means if you do object mutations like:

```javascript
this.items.push({id: 1, name: 'New item'})
``` 

Component will not detect a change. Instead you need to do:

```javascript
this.items = [...this.items, {id: 1, name: 'New item'}];
```

This will cause the component to detect the change and update. Some might have concerns that
this is a pricey operation, however, it is much more performant than running `ngDoCheck` and
constantly diffing the array.

## Custom styles
If you are not happy with default styles you can easily override them with increased selector specificity or creating your own theme. This applies if you are using no `ViewEncapsulation` or adding styles to global stylesheet. E.g.

```html
<ng-select class="custom"></ng-select>
```

```css
.ng-select.custom {
    border:0px;
    min-height: 0px;
    border-radius: 0;
}
.ng-select.custom .ng-select-container  {            
    min-height: 0px;
    border-radius: 0;
}
```

If you are using `ViewEncapsulation`, you could use special `::ng-deep` selector which will prevent scoping for nested selectors altough this is more of a workaround and we recommend using solution described above.

```css
.ng-select.custom ::ng-deep .ng-select-container  {            
    min-height: 0px;
    border-radius: 0;
}
```
WARNING: Keep in mind that ng-deep is deprecated and there is no alternative to it yet. See [Here](https://github.com/angular/angular/issues/17867).

### Validation state
By default when you use reactive forms validators or template driven forms validators css class `ng-invalid` will be applied on ng-select. You can show errors state by adding custom css style

```css
ng-select.ng-invalid.ng-touched .ng-select-container {
    border-color: #dc3545;
    box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 0 3px #fde6e8;
}
```

## Contributing

Contributions are welcome. You can start by looking at [issues](https://github.com/ng-select/ng-select/issues?q=is%3Aopen+is%3Aissue+label%3A%22help+wanted%22) with label *Help wanted*  or creating new Issue with proposal or bug report.
Note that we are using https://conventionalcommits.org/ commits format.

## Development

Perform the _clone-to-launch_ steps with these terminal commands.

### Run demo page in watch mode
```
git clone https://github.com/ng-select/ng-select
cd ng-select
yarn
yarn run start
```
### Testing
```
yarn run test
or
yarn run test:watch
```

### Release

To release to npm just run `./release.sh`, of course if you have permissions ;)

## Inspiration
This component is inspired by [React select](https://github.com/JedWatson/react-select) and [Virtual scroll](https://github.com/rintoj/angular2-virtual-scroll). Check theirs amazing work and components :)
