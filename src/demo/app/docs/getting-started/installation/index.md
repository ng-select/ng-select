ng-select is a lightweight all-in-one UI select, multiselect and autocomplete component for Angular.

## Install

```shell group="install" name="npm" active
npm i @ng-select/ng-select
```

```shell group="install" name="pnpm"
pnpm i @ng-select/ng-select
```

```shell group="install" name="yarn"
yarn add @ng-select/ng-select
```

## Import

### Standalone

Import `NgSelectComponent` and other necessary directives directly:

```typescript
import { NgLabelTemplateDirective, NgOptionTemplateDirective, NgSelectComponent } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';

@Component({
	selector: 'example',
	templateUrl: './example.component.html',
	styleUrl: './example.component.scss',
	imports: [NgLabelTemplateDirective, NgOptionTemplateDirective, NgSelectComponent],
})
export class ExampleComponent {}
```

### NgModule

Import the `NgSelectModule` and Angular `FormsModule`:

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

## Include a theme

To allow customization and theming, the ng-select bundle includes only generic styles that are necessary for correct layout and positioning. To get the full look of the control, include one of the themes in your application styles:

```scss
@import '@ng-select/ng-select/themes/default.theme.css';
// ... or
@import '@ng-select/ng-select/themes/material.theme.css';
```

## Global configuration (optional)

You can set global configuration and localization messages by injecting the `NgSelectConfig` service, typically in your root component:

```typescript
constructor(private config: NgSelectConfig) {
	this.config.notFoundText = 'Custom not found';
	this.config.appendTo = 'body';
	// set the bindValue to global config when you use the same
	// bindValue in most places.
	this.config.bindValue = 'value';
}
```

## Usage

Define options in your consuming component:

```typescript
@Component({...})
export class ExampleComponent {
	selectedCar: number;

	cars = [
		{ id: 1, name: 'Volvo' },
		{ id: 2, name: 'Saab' },
		{ id: 3, name: 'Opel' },
		{ id: 4, name: 'Audi' },
	];
}
```

In the template, use the `ng-select` component with your options:

```html
<!-- Using ng-option and for loop -->
<ng-select [(ngModel)]="selectedCar">
	@for (car of cars; track car.id) {
	<ng-option [value]="car.id">{{ car.name }}</ng-option>
	}
</ng-select>

<!-- Using items input -->
<ng-select [items]="cars" bindLabel="name" bindValue="id" [(ngModel)]="selectedCar"></ng-select>
```
