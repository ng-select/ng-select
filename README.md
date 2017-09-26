[![npm version](https://badge.fury.io/js/%40ng-select%2Fng-select.svg)](https://badge.fury.io/js/%40ng-select%2Fng-select)
[![Build Status][travis-badge]][travis-badge-url]
[![Coverage Status][coveralls-image]][coveralls-url]

[travis-badge]: https://travis-ci.org/ng-select/ng-select.svg?branch=master
[travis-badge-url]: https://travis-ci.org/ng-select/ng-select
[coveralls-image]: https://coveralls.io/repos/github/ng-select/ng-select/badge.svg?branch=master
[coveralls-url]: https://coveralls.io/github/ng-select/ng-select?branch=master

# Angular ng-select - All in One UI Select, Multiselect and Autocomplete
See [Demos](https://ng-select.github.io/ng-select) or try in [Plunker](https://plnkr.co/edit/V5tFfNY28fiaLlNwvcWb?p=preview)

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
  * [Contributing](#contributing)
  * [Development](#development)

## Features
- [x] Custom bindings to property or object
- [x] Custom option and label templates
- [x] Virtual Scroll support with large data sets (>5000 items).
- [x] Keyboard navigation
- [x] Correct keyboard events behaviour
- [x] Multiselect
- [x] Flexible autocomplete with client/server filtering

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
  declarations: [AppComponent, ...],
  imports: [NgSelectModule, ...],  
  bootstrap: [AppComponent]
})
export class AppModule {
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
- [ ] Custom tags
- [ ] Accessibility

## Examples

### API
| Input  | Type | Default | Required | Description |
| ------------- | ------------- | ------------- | ------------- | ------------- |
| [items] | Array<NgOption> | `[]` | yes | Items array |
| bindLabel  | string | `label` | no | Object property to use for label. Default `label`  |
| bindValue  | string | `-` | no | Object property to use for selected model. By default binds to whole object. |
| [clearable] | boolean | `true` | no | Allow to clear selected value. Default `true`|
| placeholder | string | `-` | no | Placeholder text. |
| [typeahead] | Subject |  `-` | no | Custom autocomplete or filter. |

| Output  | Description |
| ------------- | ------------- |
| (focus)  | Fired on select focus |
| (blur)  | Fired on select blur |
| (change)  | Fired on selected value change |
| (open)  | Fired on select dropdown open |
| (close)  | Fired on select dropdown close |

### Basic example
This example in [Plunkr](https://plnkr.co/edit/tjxQgDY2Pn8RRPsoVAa0?p=preview)

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

This example in [Plunkr](https://plnkr.co/edit/sArBdPLJDUy4Da7zBOGJ?p=preview)

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
This example in [Plunkr](https://plnkr.co/edit/IXZ53DD6jRaIPlei8yVI?p=preview)

To customize look of input display or option item you can use `ng-template` with `ng-display-tmp` or `ng-option-tmp` directives applied to it.
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
            <ng-template ng-display-tmp let-item="item">
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

### More demos
Visit https://github.com/ng-select/ng-select/tree/master/src/demo/app for more examples


## Contributing

Contributions are welcome. You can start by looking at issues with label Help wanted https://github.com/ng-select/ng-select/issues?q=is%3Aopen+is%3Aissue+label%3A%22help+wanted%22 or creating new Issue with proposal or bug report.

## Development

Perform the _clone-to-launch_ steps with these terminal commands.

### Run demo page in watch mode
```
git clone https://github.com/ng-select/ng-select
cd ng-select
npm install
npm run serve-demo
```
### Testing
```
npm run test
or
npm run test-watch
```

### Deploy demo to gh-pages
```
npm run gh-pages

// after swith to gh-pages branch run
./publish-demo.sh
```

### Commits
Follow https://conventionalcommits.org/
