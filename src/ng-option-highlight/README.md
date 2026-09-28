## Getting started

### Step 1: Install `ng-option-highlight`:

#### NPM

```shell
npm install --save @ng-select/ng-option-highlight
```

#### YARN

```shell
yarn add @ng-select/ng-option-highlight
```

### Step 2: Import the NgOptionHighlightDirective:

`NgOptionHighlightDirective` is standalone. Add it to your component's `imports` (or to an NgModule's `imports` next to `NgSelectModule`):

```ts
import { Component } from '@angular/core';
import { NgOptionTemplateDirective, NgSelectComponent } from '@ng-select/ng-select';
import { NgOptionHighlightDirective } from '@ng-select/ng-option-highlight';

@Component({
	selector: 'app-example',
	imports: [NgSelectComponent, NgOptionTemplateDirective, NgOptionHighlightDirective],
	templateUrl: './example.component.html',
})
export class ExampleComponent {}
```

### Step 3: Add directive in your template:

```html
<ng-select>
	...
	<ng-template ng-option-tmp let-item="item" let-search="searchTerm">
		<span [ngOptionHighlight]="search">{{item.title}}</span>
	</ng-template>
</ng-select>
```

## Development

### Build

Run `ng build ng-option-highlight` to build the project. The build artifacts will be stored in the `dist/` directory.

### Publishing

After building your library with `ng build ng-option-highlight`, go to the dist folder `cd dist/ng-option-highlight` and run `npm publish`.

### Running unit tests

Run `ng test ng-option-highlight` to execute the unit tests via Vitest
