[![npm version](https://badge.fury.io/js/%40ng-select%2Fng-select.svg)](https://badge.fury.io/js/%40ng-select%2Fng-select)
[![Build Status][travis-badge]][travis-badge-url]
[![Coverage Status][coveralls-image]][coveralls-url]
[![gzip bundle size](http://img.badgesize.io/https://unpkg.com/@ng-select/ng-select@latest/bundles/ng-select.umd.min.js?compression=gzip&style=flat-square)][ng-select-url]

[travis-badge]: https://travis-ci.org/ng-select/ng-select.svg?branch=master
[travis-badge-url]: https://travis-ci.org/ng-select/ng-select
[coveralls-image]: https://coveralls.io/repos/github/ng-select/ng-select/badge.svg?branch=master
[coveralls-url]: https://coveralls.io/github/ng-select/ng-select?branch=master
[ng-select-url]: https://unpkg.com/@ng-select/ng-select@latest

# Angular ng-select - Lightweight all in one UI Select, Multiselect and Autocomplete
See [Demos](https://ng-select.github.io/ng-select) or try in [Stackblitz](https://stackblitz.com/edit/ng-select?file=app%2Fapp.component.ts) or [Plunker](https://plnkr.co/edit/NaQ27M?p=preview)

Table of contents
=================

  * [Features](#features)
  * [Getting started](#getting-started)
  * [Roadmap](#roadmap)
  * [API](#api)
  * [Change detection](#change-detection)
  * [Custom styles](#custom-styles)
  * [Examples](#examples)
    * [Basic example](#basic-example)
    * [Flexible autocomplete](#flexible-autocomplete)
    * [Custom display templates](#custom-display-templates)
    * [Validation state](#validation-state)
  * [Contributing](#contributing)
  * [Development](#development)
  * [Inspiration](#inspiration)

## Features
- [x] Custom model bindings to property or object
- [x] Custom option, label, header and footer templates
- [x] Virtual Scroll support with large data sets (>5000 items).
- [x] Keyboard navigation
- [x] Multiselect
- [x] Flexible autocomplete with client/server filtering
- [x] Custom tags
- [x] Append to body
- [x] Group items

## Warning
Library is under active development and may have API breaking changes until stable 1.0.0 release or subsequent major versions after 1.0.0.

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
### Step 2: Import the component module:
```js
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
  declarations: [AppComponent],
  imports: [NgSelectModule],  
  bootstrap: [AppComponent]
})
export class AppModule {}
```

### Step 3: Include a theme: 
To allow customization and theming, `ng-select` bundle includes only generic styles that are necessary for correct layout and positioning. To get full look of the control, include one of the themes in your application. If you're using the Angular CLI, you can add this to your `styles.scss` or include it in `angular-cli.json`.

```scss
@import "~@ng-select/ng-select/themes/default.theme.css";
// ... or 
@import "~@ng-select/ng-select/themes/material.theme.css";

```


### Step 4 (Optional): Configuration 
You can also set global configuration and localization messages by providing custom NG_SELECT_DEFAULT_CONFIG
```js
    providers: [
        {
            provide: NG_SELECT_DEFAULT_CONFIG,
            useValue: {
                notFoundText: 'Custom not found'
            }
        }
    ]
```
### SystemJS
If you are using SystemJS, you should also adjust your configuration to point to the UMD bundle.

In your systemjs config file, `map` needs to tell the System loader where to look for `ng-select`:
```js
map: {
  '@ng-select/ng-select': 'node_modules/@ng-select/ng-select/bundles/ng-select.umd.js',
}
```

## Roadmap

- [x] Custom binding to property or object
- [x] Custom option and label templates
- [x] Virtual Scroll support with large data sets (>5000 items).
- [x] Filter data by display text
- [x] Filter data by custom filter function
- [x] Expose useful events like blur, change, focus, close, open ...
- [x] Correct keyboard events behaviour
- [x] Integration app generated with angular-cli
- [x] Good base functionality test coverage
- [x] Multiselect support
- [x] Autocomplete
- [x] Custom tags
- [x] Themes
- [x] Items grouping
- [ ] Accessibility
- [ ] Many more

## API
| Input  | Type | Default | Required | Description |
| ------------- | ------------- | ------------- | ------------- | ------------- |
| [addTag] | `boolean \| ((term: string) => any \| Promise<any>)`  | `false` | no | Allows to create custom options. |
| addTagText | `string` | `Add item` | no | Set custom text when using tagging |
| appendTo | `string` |  null | no | Append drodown to body or any other element using css selector |
| bindValue  | `string` | `-` | no | Object property to use for selected model. By default binds to whole object. |
| bindLabel  | `string` | `label` | no | Object property to use for label. Default `label`  |
| closeOnSelect | `boolean` |  true | no | Whether to close the menu when a value is selected |
| [clearable] | `boolean` | `true` | no | Allow to clear selected value. Default `true`|
| clearAllText | `string` | `Clear all` | no | Set custom text for clear all icon title |
| dropdownPosition | `bottom`,`top`,`auto` |  `bottom` | no | Set the dropdown position on open |
| [groupBy] | `string` | null | no | Allow to group items by key |
| [selectableGroup] | `boolean` | false | no | Allow to select group when groupBy is used |
| [items] | `Array<NgOption>` | `[]` | yes | Items array |
| loading | `boolean` |  `-` | no | You can set the loading state from the outside (e.g. async items loading) |
| loadingText | `string` | `Loading...` | no | Set custom text when for loading items |
| [markFirst] | `boolean` | `true` | no | Marks first item as focused when opening/filtering. Default `true`|
| maxSelectedItems | `number` | none | no | When multiple = true, allows to set a limit number of selection. |
| showSelected | `boolean` | `true` | no | When multiple = true, allows to set a hide selected items. |
| multiple | `boolean` | `false` | no | Allows to select multiple items. |
| notFoundText | `string` | `No items found` | no | Set custom text when filter returns empty result |
| placeholder | `string` | `-` | no | Placeholder text. |
| [searchable] | `boolean` | `true` | no | Allow to search for value. Default `true`|
| [typeahead] | `Subject` |  `-` | no | Custom autocomplete or filter. |
| typeToSearchText | `string` | `Type to search` | no | Set custom text when using Typeahead |
| [virtualScroll] | `boolean` |  false | no | Enable virtual scroll for better performance when rendering a lot of data |

| Output  | Description |
| ------------- | ------------- |
| (add)  | Fired when item is selected |
| (blur)  | Fired on select blur |
| (change)  | Fired on selected value change |
| (close)  | Fired on select dropdown close |
| (clear)  | Fired on clear icon click |
| (focus)  | Fired on select focus |
| (open)  | Fired on select dropdown open |
| (remove)  | Fired when item is removed |
| (scrollToEnd)  | Fired when scrolled to the end of items. Can be used for loading more items in chunks. |

## Change Detection
Ng-select component implements `OnPush` change detection which means the dirty checking checks for immutable 
data types. That means if you do object mutations like:

```javascript
this.items.push({id: 1, name: 'New item'})
``` 

Component will not detect a change. Instead you need to do:

```javascript
this.items.push({id: 1, name: 'New item'})
this.items = [...this.items];
```

This will cause the component to detect the change and update. Some might have concerns that
this is a pricey operation, however, it is much more performant than running `ngDoCheck` and
constantly diffing the array.

## Custom styles
If you are not happy with default styles you can easily override them with increased selector specificity. E.g.

```html
<ng-select class="custom"></ng-select>
```

```css
.ng-select.custom {
    border:0px;
    min-height: 0px;
    border-radius: 0;
}
.ng-select.custom .ng-control  {            
    min-height: 0px;
    border-radius: 0;
}
```

## Examples
### Basic example
This example in [Plunkr](https://plnkr.co/edit/hjZX6W?p=preview)

```js
@Component({
    selector: 'cities-page',
    template: `
        <label>City</label>
        <ng-select [items]="cities"
                   bindLabel="name"
                   bindValue="id"
                   placeholder="Select city"
                   [(ngModel)]="selectedCityId">
        </ng-select>
        <p>
            Selected city ID: {{selectedCityId}}
        </p>
    `
})
export class CitiesPageComponent {
    cities = [
        {id: 1, name: 'Vilnius'},
        {id: 2, name: 'Kaunas'},
        {id: 3, name: 'Pabradė'}
    ];
    selectedCityId: any;
}
```

### Flexible autocomplete

This example in [Plunkr](https://plnkr.co/edit/KFpvA9?p=preview)

In case of autocomplete you can get full control by creating simple `EventEmmiter` and passing it as an input to ng-select. When you type text, ng-select will fire events to EventEmmiter to which you can subscribe and control bunch of things like debounce, http cancellation and so on.
```js
import { Component, ChangeDetectionStrategy, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { catchError, map, debounceTime, switchMap } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import { ChangeDetectorRef } from '@angular/core';

@Component({
    selector: 'select-autocomplete',
    template: `
        <label>Search with autocomplete in Github accounts</label>
        <ng-select [items]="items"
                   bindLabel="login"
                   placeholder="Type to search"
                   [typeahead]="typeahead"
                   [(ngModel)]="githubAccount">
            <ng-template ng-option-tmp let-item="item">
                <img [src]="item.avatar_url" width="20px" height="20px"> {{item.login}}
            </ng-template>
        </ng-select>
        <p>
            Selected github account:
            <span *ngIf="githubAccount">
                <img [src]="githubAccount.avatar_url" width="20px" height="20px"> {{githubAccount.login}}
            </span>
        </p>
    `
})
export class SelectAutocompleteComponent {

    githubAccount: any;
    items = [];
    typeahead = new EventEmitter<string>();

    constructor(private http: HttpClient, private cd: ChangeDetectorRef) {
        this.typeahead
            .pipe(
                debounceTime(200),
                switchMap(term => this.loadGithubUsers(term))
            )
            .subscribe(items => {
                this.items = items;
                this.cd.markForCheck();
            }, (err) => {
                console.log('error', err);
                this.items = [];
                this.cd.markForCheck();
            });
    }

    loadGithubUsers(term: string): Observable<any[]> {
        return this.http.get<any>(`https://api.github.com/search/users?q=${term}`).pipe(
            catchError(() => of(({items: []}))),
            map(rsp => rsp.items),
        );
    }
}
```

### Custom display templates
This example in [Plunkr](https://plnkr.co/edit/csZbjH?p=preview)

To customize look of ng-select you can use `ng-template` with `ng-label-tmp`, `ng-option-tmp`, `ng-header-tmp`, `ng-footer-tmp` directives applied to it.
```js
import {Component, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';
import {NgSelectModule} from '@ng-select/ng-select';
import {HttpClient, HttpClientModule} from '@angular/common/http';

@Component({
    selector: 'select-custom-templates',
    template: `
        <label>Demo for ng-select with custom templates</label>
        <ng-select [items]="albums"
                   [(ngModel)]="selectedAlbumId"
                   bindLabel="title"
                   bindValue="id"
                   placeholder="Select album">
            <ng-template ng-header-tmp>
               Custom header
            </ng-template>
            <ng-template ng-label-tmp let-item="item">
               <b>({{item.id}})</b> {{item.title}}
            </ng-template>
            <ng-template ng-option-tmp let-item="item">
                <div>Title: {{item.title}}</div>
                <small><b>Id:</b> {{item.id}} | <b>UserId:</b> {{item.userId}}</small>
            </ng-template>
            <ng-template ng-footer-tmp>
               Custom footer
            </ng-template>
        </ng-select>
        <p>Selected album ID: {{selectedAlbumId || 'none'}}</p>
    `
})
export class SelectCustomTemplatesComponent {
    albums = [];
    selectedAlbumId = null;

    constructor(http: HttpClient) {
        http.get<any[]>('https://jsonplaceholder.typicode.com/albums').subscribe(albums => {
            this.albums = albums;
        });
    }
}
```

### Validation state
By default when you use reactive forms validators or template driven forms validators css class `ng-invalid` will be applied on ng-select. You can show errors state by having adding this custom css style

```css
ng-select.ng-invalid.ng-touched .ng-control {
    border-color: #dc3545;
    box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 0 3px #fde6e8;
}
```

### More demos
Visit [demos](https://github.com/ng-select/ng-select/tree/master/demo/app/examples) for more examples.


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
This component is inspired by [React select](https://github.com/JedWatson/react-select) and [Vitual scroll](https://github.com/rintoj/angular2-virtual-scroll). Check theirs amazing work and components :)
