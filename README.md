[![npm version](https://badge.fury.io/js/%40ng-select%2Fng-select.svg)](https://badge.fury.io/js/%40ng-select%2Fng-select)
[![Build Status][travis-badge]][travis-badge-url]

[travis-badge]: https://travis-ci.org/ng-select/ng-select.svg?branch=master
[travis-badge-url]: https://travis-ci.org/ng-select/ng-select

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
- [x] Expose usefull events like blur, change, focus, close, open ...
- [x] Correct keyboard events behaviour
- [x] Integration app generated with angular-cli
- [ ] HTML5 Standart https://developer.mozilla.org/en/docs/Web/HTML/Element/select except multiselect
- [ ] Good base functionality test coverage
- [ ] First alpha release and documentation
- [ ] Multiselect support
- [ ] Accessibility

### Usage
| Input  | Type | Default | Required | Description |
| ------------- | ------------- | ------------- | ------------- | ------------- |
| [items] | Array<NgOption> | `[]` | yes | Items array|
| bindLabel  | string | `label` | no | Bind option display text to object property. Default `label`  |
| bindValue  | string | `value` | no | Bind selected option model value to property or whole object if used as `bindValue="this"`. Default  `value`|
| [clearable] | boolean | `true` | no | Set is allowed to clear selected value. Default `true`|
| placeholder | string | `null` | no | Set placeholder text. Default `null`|
| [filterFunc] | function|  `null` | no | Set custom filter function. Default `null`|

| Output  | Description |
| ------------- | ------------- |
| (focus)  | Fired on select focus |
| (blur)  | Fired on select blur |
| (change)  | Fired on selected value change |
| (open)  | Fired on select dropdown open |
| (close)  | Fired on select dropdown close |


### Contributing

Contributions are welcome. You can start by looking at issues with label Help wanted https://github.com/ng-select/ng-select/issues?q=is%3Aopen+is%3Aissue+label%3A%22help+wanted%22 or creating new Issue with proposal or bug.

### Clone and play

Perform the _clone-to-launch_ steps with these terminal commands.

#### Run demo
```
git clone https://github.com/ng-select/ng-select
cd ng-select
npm install
npm run serve-demo
```
#### Testing
```
npm run test
or
npm run test-watch
```

