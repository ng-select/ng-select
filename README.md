
# Warning

Library is under development. Library build process is forked from https://github.com/filipesilva/angular-quickstart-lib but I changed SystemJs build system to Webpack for faster builds and easer deployments to github pages.

# Angular customizable select
[![Build Status][travis-badge]][travis-badge-url]

[travis-badge]: https://travis-ci.org/anjmao/ang-select.svg?branch=master
[travis-badge-url]: https://travis-ci.org/anjmao/ang-select

## Installation
```
TODO
```


## API
### Inputs
| Name  | Description |
| ------------- | ------------- |
| `@Input() items: any[] = [];` | Data array  |
| `@Input() bindLabel: string;`  | Set which property to display as text in dropdown |
| `@Input() bindValue: string;`  | Set which property to bind to model on dropdown select |
| `@Input() placeholder: string;`  | Set input placeholder |
| `@Input() allowClear: boolean;`  | Allow to clear selected value |
| `@Input() allowSearch: boolean;`  | Allow to search in dropdown list by `bindLabel` property |

### Clone and play

Perform the _clone-to-launch_ steps with these terminal commands.

#### Run demo
```
git clone https://github.com/anjmao/ang-select.git
cd ang-select
npm install
npm run serve-demo
```
#### Testing
```
npm run test
or
npm run test-watch
```

### Contributing
Contributions are welcome. Lets make best angular select together! Just create new issue with proposal :)
