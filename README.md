[![npm version](https://badge.fury.io/js/%40ng-select%2Fng-select.svg)](https://badge.fury.io/js/%40ng-select%2Fng-select)
[![Socket Badge](https://badge.socket.dev/npm/package/@ng-select/ng-select/23.4.0)](https://badge.socket.dev/npm/package/@ng-select/ng-select/23.4.0)
[![Coverage Status][coveralls-image]][coveralls-url]
[![gzip size](https://img.shields.io/badge/GZip_size-18.7%20kB-2ca5e0?style=flat-square&logo=npm&labelColor=black)](https://img.shields.io/badge/GZip_size-18.7%20kB-2ca5e0?style=flat-square&logo=npm&labelColor=black)

[coveralls-image]: https://coveralls.io/repos/github/ng-select/ng-select/badge.svg?branch=master
[coveralls-url]: https://coveralls.io/github/ng-select/ng-select?branch=master
[ng-select-url]: https://unpkg.com/@ng-select/ng-select@latest

# Angular ng-select - Lightweight all in one UI Select, Multiselect and Autocomplete

See [Demo](https://ng-select.github.io/ng-select) page.

---

## Versions

**Warning**: Do not use versions 15.2.0, 16.0.0, 17.0.0, 18.0.0, 19.0.0, 20.0.0 as they contain unresolved issues

| Angular          |     ng-select      |
| ---------------- | :----------------: |
| >=22.0.0 <23.0.0 |      v23.x.x       |
| >=21.0.0 <22.0.0 |      v21.x.x       |
| >=20.0.0 <21.0.0 | <=15.1.3, >=20.0.1 |
| >=19.0.0 <20.0.0 |       v14.x        |
| >=18.0.0 <19.0.0 |       v13.x        |
| >=17.0.0 <18.0.0 |       v12.x        |
| >=16.0.0 <17.0.0 |       v11.x        |
| >=15.0.0 <16.0.0 |       v10.x        |
| >=14.0.0 <15.0.0 |        v9.x        |
| >=13.0.0 <14.0.0 |        v8.x        |
| >=12.0.0 <13.0.0 |        v7.x        |
| >=11.0.0 <12.0.0 |        v6.x        |
| >=10.0.0 <11.0.0 |        v5.x        |
| >=9.0.0 <10.0.0  |        v4.x        |
| >=8.0.0 <9.0.0   |        v3.x        |
| >=6.0.0 <8.0.0   |        v2.x        |
| v5.x.x           |        v1.x        |

---

## Browser Support

`ng-select` supports all browsers supported by Angular. For current list, see https://angular.io/guide/browser-support#browser-support. This includes the following specific versions:

```angular2html
Chrome	2 most recent versions
Firefox	latest and extended support release (ESR)
Edge	2 most recent major versions
Safari	2 most recent major versions
iOS	2 most recent major versions
Android	2 most recent major versions
```

# Table of contents

- [Features](#features)
- [Getting started](#getting-started)
- [Documentation and examples](#documentation-and-examples)
- [Dropdown panel rendering](#dropdown-panel-rendering)
- [Contributing](#contributing)
- [Development](#development)
- [Inspiration](#inspiration)

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
- [x] CDK overlay positioning (top-layer rendering, no clipping)
- [x] Group items
- [x] Output events
- [x] Accessibility
- [x] Signal Forms, Reactive Forms and Template-driven Forms
- [x] Good base functionality test coverage
- [x] Themes

## Warning

Library is under active development and may have API breaking changes for subsequent major versions after 1.0.0.

## Getting started

### Step 1: Install `ng-select` and its `@angular/cdk` peer dependency:

#### NPM

```shell
npm install --save @ng-select/ng-select @angular/cdk
```

#### Yarn

```shell
yarn add @ng-select/ng-select @angular/cdk
```

#### PNPM

```shell
pnpm add @ng-select/ng-select @angular/cdk
```

### Step 2:

#### Standalone: Import `NgSelectComponent` and Signal Forms' `FormField` directive:

```typescript
import { NgLabelTemplateDirective, NgOptionTemplateDirective, NgSelectComponent } from '@ng-select/ng-select';
import { FormField } from '@angular/forms/signals';

@Component({
	selector: 'example',
	standalone: true,
	template: './example.component.html',
	styleUrl: './example.component.scss',
	imports: [FormField, NgLabelTemplateDirective, NgOptionTemplateDirective, NgSelectComponent],
})
export class ExampleComponent {}
```

For Reactive Forms, import `ReactiveFormsModule`. For Template-driven Forms, import `FormsModule`.

#### NgModule compatibility: Import `NgSelectModule` and the forms module your application uses:

```typescript
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';

@NgModule({
	declarations: [AppComponent],
	imports: [NgSelectModule, FormsModule],
	bootstrap: [AppComponent],
})
export class AppModule {}
```

### Step 3: Include a theme:

To allow customization and theming, `ng-select` bundle includes only generic styles that are necessary for correct layout and positioning. To get full look of the control, include one of the themes in your application. If you're using the Angular CLI, you can add this to your `styles.scss` or include it in `.angular-cli.json` (Angular v5 and below) or `angular.json` (Angular v6 onwards).

```scss
@import '~@ng-select/ng-select/themes/default.theme.css';
// ... or
@import '~@ng-select/ng-select/themes/material.theme.css';
```

### Step 4 (Optional): Configuration

You can also set global configuration and localization messages by injecting NgSelectConfig service,
typically in your root component, and customize the values of its properties in order to provide default values.

```js
  constructor(private config: NgSelectConfig) {
      this.config.notFoundText = 'Custom not found';
      // set the bindValue to global config when you use the same
      // bindValue in most of the place.
      // You can also override bindValue for the specified template
      // by defining `bindValue` as property
      // Eg : <ng-select bindValue="some-new-value"></ng-select>
      this.config.bindValue = 'value';
  }
```

### Usage

ng-select supports Signal Forms, Reactive Forms and Template-driven Forms. Signal Forms is the recommended starting point for new Angular 22 applications.

Define the options shared by these examples:

```typescript
@Component({...})
export class ExampleComponent {
	readonly cars = [
		{ id: 1, name: 'Volvo' },
		{ id: 2, name: 'Saab' },
		{ id: 3, name: 'Opel' },
		{ id: 4, name: 'Audi' },
	];
}
```

#### Signal Forms

Bind a field from the tree returned by `form()`. A raw signal value is not a valid `formField` binding.

```typescript
import { signal } from '@angular/core';
import { form, FormField } from '@angular/forms/signals';

readonly carModel = signal({ selectedCarId: null as number | null });
readonly carForm = form(this.carModel);
```

```html
<ng-select [items]="cars" bindLabel="name" bindValue="id" [formField]="carForm.selectedCarId" />
```

#### Reactive Forms

```typescript
import { FormControl, ReactiveFormsModule } from '@angular/forms';

readonly selectedCarId = new FormControl<number | null>(null);
```

```html
<ng-select [items]="cars" bindLabel="name" bindValue="id" [formControl]="selectedCarId" />
```

#### Template-driven Forms

```typescript
import { FormsModule } from '@angular/forms';

selectedCarId: number | null = null;
```

```html
<!--Using ng-option and for loop-->
<ng-select [(ngModel)]="selectedCarId">
	@for (car of cars; track car.id) {
	<ng-option [value]="car.id">{{car.name}}</ng-option>
	}
</ng-select>

<!--Using items input-->
<ng-select [items]="cars" bindLabel="name" bindValue="id" [(ngModel)]="selectedCarId" />
```

For more detailed examples see [Demo](https://ng-select.github.io/ng-select#/data-sources) page

### SystemJS

If you are using SystemJS, you should also adjust your configuration to point to the UMD bundle.

In your systemjs config file, `map` needs to tell the System loader where to look for `ng-select`:

```js
map: {
  '@ng-select/ng-select': 'node_modules/@ng-select/ng-select/bundles/ng-select.umd.js',
}
```

## Documentation and examples

Full documentation, live examples and the complete API reference live on the docs site:

- [Getting started](https://ng-select.github.io/ng-select/#/getting-started/installation)
- [Examples](https://ng-select.github.io/ng-select/#/examples/data-sources) — data sources, bindings, forms, search, tags, templates, multiselect, grouping, virtual scroll and more
- [API reference](https://ng-select.github.io/ng-select/#/api) — inputs, outputs and methods for `NgSelectComponent`, `NgSelectConfig`, template directives and `NgOptionHighlightDirective`
- [Styling](https://ng-select.github.io/ng-select/#/getting-started/styling)
- [Change detection notes](https://ng-select.github.io/ng-select/#/getting-started/change-detection)

## Dropdown panel rendering

Since v24 the dropdown panel is positioned by [Angular CDK Overlay](https://material.angular.dev/cdk/overlay/overview) instead of the previous hand-rolled geometry code. `@angular/cdk` is a peer dependency — install it alongside the library. There is nothing to configure; every dropdown renders in an overlay attached to the document body, stays anchored to the select while any ancestor scrolls, resizes with the select, and `dropdownPosition="auto"` measures the real rendered panel (including header/footer templates) when deciding between top and bottom.

Things to know when migrating:

- **DOM location.** The panel is no longer a child of `<ng-select>` in the DOM — it lives inside `.cdk-overlay-container` (the same situation as `appendTo="body"` produced before). CSS that scoped panel styles through an ancestor of the select, like `.my-wrapper ng-dropdown-panel { ... }`, will no longer match. The panel still receives the select's `class`, `[class]`, and `[ngClass]` values, and you can add panel-only classes with `panelClass`. Scope panel styles through those classes: `.my-select-class.ng-dropdown-panel .ng-option { ... }`, or use separate host and panel classes: `class="my-select" panelClass="my-select-panel"`.
- **`appendTo` changed meaning; `popover` is a deprecated no-op.** Overlay rendering already solves the clipping/stacking problems both existed for, so most usages of `appendTo` can simply be removed. It still works — but it now controls where the overlay lives **in the DOM** (ancestor-scoped styles, stacking context, focus containment) rather than how the panel is positioned; painting and positioning stay viewport-based either way. `popover` has no effect anymore (the overlay uses the native Popover API top layer automatically) and logs a one-time dev-mode warning.
- **Stacking / z-index.** The hardcoded panel `z-index: 1050` is gone. In browsers with the native Popover API (all evergreen browsers), the CDK renders the overlay in the top layer, which paints above every `z-index` — including Bootstrap modals — with no configuration. In older browsers the panel falls back into `.cdk-overlay-container` with the CDK default `z-index: 1000` (declared in the `cdk-overlay` CSS layer). If you need the fallback to beat a higher stacking context such as a Bootstrap modal (`z-index: 1055`), raise the container in your global styles: `.cdk-overlay-container { z-index: 1056; }` — unlayered author CSS wins over the CDK's layered default regardless of specificity.
- **Custom themes.** The shipped themes no longer position the panel (`top: 100%`, `bottom: 100%`, `left: 0` and friends were removed — margins, borders, shadows and radii remain). The library neutralizes those offsets for panels rendered in the overlay, so themes copied from older versions keep working, but you should remove positional offsets from `.ng-dropdown-panel` rules when you update your own theme.

## Contributing

Contributions are welcome. You can start by looking at [issues](https://github.com/ng-select/ng-select/issues?q=is%3Aopen+is%3Aissue+label%3A%22help+wanted%22) with label _Help wanted_ or creating new Issue with proposal or bug report.
Note that we are using https://conventionalcommits.org/ commits format.

## Development

Perform the _clone-to-launch_ steps with these terminal commands.

### Run demo page in watch mode

```
git clone https://github.com/ng-select/ng-select
cd ng-select
pnpm i
pnpm run start
```

### Testing

```
pnpm test
or
pnpm test:watch
```

### Release

To release to npm just run `./release.sh`, of course if you have permissions ;)

## Inspiration

This component is inspired by [React select](https://github.com/JedWatson/react-select) and [Virtual scroll](https://github.com/rintoj/angular2-virtual-scroll). Check theirs amazing work and components :)
