# Warning

Library is under development

# Angular customizable select
[![Build Status][travis-badge]][travis-badge-url]

[travis-badge]: https://travis-ci.org/filipesilva/angular-quickstart-lib.svg?branch=master
[travis-badge-url]: https://travis-ci.org/filipesilva/angular-quickstart-lib

## Installation

```
npm install ang-select --save
```

```js
import {AngSelectModule} from 'ang-select';

// ...

@NgModule({
    imports: [AngSelectModule]
})

```

## API
### Inputs
| Name  | Description |
| ------------- | ------------- |
|  `@Input() items: any[] = [];` | Data array  |
| `@Input() bindText: string;`  | Set which property to display as text in dropdown |
| `@Input() bindValue: string;`  | Set which property to bind to model on dropdown select |
| `@Input() allowClear: boolean;`  | Allow to clear selected value |
| `@Input() allowSearch: boolean;`  | Allow to search in dropdown list by `bindText` property |

### Clone

Perform the _clone-to-launch_ steps with these terminal commands.

```
git clone https://github.com/anjmao/ang-select.git
cd ang-select
npm install
npm start
```

