[![npm version](https://badge.fury.io/js/%40ng-select%2Fng-select.svg)](https://badge.fury.io/js/%40ng-select%2Fng-select)
[![Build Status][travis-badge]][travis-badge-url]
[![Coverage Status][coveralls-image]][coveralls-url]

[travis-badge]: https://travis-ci.org/ng-select/ng-select.svg?branch=master
[travis-badge-url]: https://travis-ci.org/ng-select/ng-select
[coveralls-image]: https://coveralls.io/repos/github/ng-select/ng-select/badge.svg?branch=master
[coveralls-url]: https://coveralls.io/github/ng-select/ng-select?branch=master

# Angular ng-select - All in One UI Select, Multiselect and Autocomplete
See [Demos](https://ng-select.github.io/ng-select) or try in [Plunker](https://plnkr.co/edit/NaQ27M?p=preview)

Table of contents
=================

  * [Features](#features)
  * [Getting started](#getting-started)
  * [Roadmap](#roadmap)
  * [Examples](#examples)
    * [API](#api)
    * [Basic example](#basic-example)
    * [Flexible autocomplete](#flexible-autocomplete)
    * [Custom display and option templates](#custom-display-and-option-templates)
    * [Validation state](#validation-state)
  * [Contributing](#contributing)
  * [Development](#development)
  * [Inspiration](#inspiration)

## Features
- [x] Custom bindings to property or object
- [x] Custom option and label templates
- [x] Virtual Scroll support with large data sets (>5000 items).
- [x] Keyboard navigation
- [x] Correct keyboard events behaviour
- [x] Multiselect
- [x] Flexible autocomplete with client/server filtering
- [x] Custom tags

## Warning
Library is under active development and may not work as expected until stable 1.0.0 release.

## Getting started
After installing the above dependencies, install `ng-select` via:
```shell
npm install --save @ng-select/ng-select
```
Once installed you need to import our main module:
```js
import {NgSelectModule} from '@ng-select/ng-select';
```
The only remaining part is to list the imported module in your application module.:
```js
import {NgSelectModule} from '@ng-select/ng-select';

@NgModule({
  declarations: [AppComponent],
  imports: [NgSelectModule],  
  bootstrap: [AppComponent]
})
export class AppModule {
}
```
You can also configure global configuration and localization messages by using NgSelectModule.forRoot:
```js
NgSelectModule.forRoot({notFoundText: 'Your custom not found text', typeToSearchText: 'Your custom type to search text'})
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
- [ ] Accessibility

## API
| Input  | Type | Default | Required | Description |
| ------------- | ------------- | ------------- | ------------- | ------------- |
| [items] | Array<NgOption> | `[]` | yes | Items array |
| bindLabel  | string | `label` | no | Object property to use for label. Default `label`  |
| bindValue  | string | `-` | no | Object property to use for selected model. By default binds to whole object. |
| [clearable] | boolean | `true` | no | Allow to clear selected value. Default `true`|
| [markFirst] | boolean | `true` | no | Marks first item as focused when opening/filtering. Default `true`|
| [searchable] | boolean | `true` | no | Allow to search for value. Default `true`|
| multiple | boolean | `false` | no | Allows to select multiple items. |
| [addTag] | Function or boolean | `false` | no | Allows to create custom options. Using boolean simply adds tag with value as bindLabel. If you want custom properties add function which returns object. |
| placeholder | string | `-` | no | Placeholder text. |
| notFoundText | string | `No items found` | no | Set custom text when filter returns empty result |
| typeToSearchText | string | `Type to search` | no | Set custom text when using Typeahead |
| clearAllText | string | `Clear all` | no | Set custom text for clear all icon title |
| addTagText | string | `Add item` | no | Set custom text when using tagging |
| [typeahead] | Subject |  `-` | no | Custom autocomplete or filter. |
| [disableVirtualScroll] | boolean |  false | no | Disable virtual scroll |
| dropdownPosition | `bottom` | `top` |  `'bottom'` | no | Set the dropdown position on open |

| Output  | Description |
| ------------- | ------------- |
| (focus)  | Fired on select focus |
| (blur)  | Fired on select blur |
| (change)  | Fired on selected value change |
| (open)  | Fired on select dropdown open |
| (close)  | Fired on select dropdown close |
| (clear)  | Fired on clear icon click |
| (add)  | Fired when item is selected |
| (remove)  | Fired when item is removed |

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
    
    // event emmiter is just RxJs Subject
    typeahead = new EventEmitter<string>();

    constructor(private http: HttpClient) {
        this.typeahead
            .distinctUntilChanged()
            .debounceTime(200)
            .switchMap(term => this.loadGithubUsers(term))
            .subscribe(items => {
                this.items = items;
            }, (err) => {
                console.log(err);
                this.items = [];
            });
    }

    loadGithubUsers(term: string): Observable<any[]> {
        return this.http.get<any>(`https://api.github.com/search/users?q=${term}`).map(rsp => rsp.items);
    }
}
```

### Custom display and option templates
This example in [Plunkr](https://plnkr.co/edit/csZbjH?p=preview)

To customize look of input display or option item you can use `ng-template` with `ng-label-tmp` or `ng-option-tmp` directives applied to it.
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
            <ng-template ng-label-tmp let-item="item">
               <b>({{item.id}})</b> {{item.title}}
            </ng-template>
            <ng-template ng-option-tmp let-item="item">
                <div>Title: {{item.title}}</div>
                <small><b>Id:</b> {{item.id}} | <b>UserId:</b> {{item.userId}}</small>
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
