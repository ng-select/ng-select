[![Build Status][travis-badge]][travis-badge-url]

[travis-badge]: https://travis-ci.org/ng-select/ng-select.svg?branch=master
[travis-badge-url]: https://travis-ci.org/ng-select/ng-select

# Warning

Library is under active development and may not work as expected until stable 1.0.0 release.
## Roadmap

- [x] Custom binding to property or object
- [x] Custom option and label templates
- [x] Virtual Scroll support with large data sets (>5000 items).
- [x] Filter data by display text
- [x] Filter data by custom filter function
- [x] Expose usefull events like blur, change, focus, close, open ...
- [x] Correct keyboard events behaviour
- [ ] HTML5 Standart https://developer.mozilla.org/en/docs/Web/HTML/Element/select except multiselect
- [ ] Good base functionality test coverage
- [ ] Integration app generated with angular-cli
- [ ] First alpha release and documentation
- [ ] Multiselect support
- [ ] Accessibility

### Usage
| Input  | Description |
| ------------- | ------------- |
| bindLabel  | Bind option display text to object property. Default `label`  |
| bindValue  | Bind selected option model value to property or whole object if used as `bindValue="this"`. Default  `value`|
| [clearable] | Set is allowed to clear selected value. Default `true`|
| placeholder | Set placeholder text. Default `null`|
| [filterFunc] | Set custom filter function. Default `null`|

| Output  | Description |
| ------------- | ------------- |
| (focus)  | Fired on select focus |
| (blur)  | Fired on select blur |
| (change)  | Fired on selected value change |
| (open)  | Fired on select dropdown open |
| (close)  | Fired on select dropdown close |

### Installation
```
npm install @ng-select/ng-select --save
```

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

