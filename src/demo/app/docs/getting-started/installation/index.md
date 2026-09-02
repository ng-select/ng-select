ng-select is a lightweight all-in-one UI select, multiselect and autocomplete component for Angular.

## Install

```shell group="install" name="npm" active
npm i @ng-select/ng-select @angular/cdk
```

```shell group="install" name="pnpm"
pnpm i @ng-select/ng-select @angular/cdk
```

```shell group="install" name="yarn"
yarn add @ng-select/ng-select @angular/cdk
```

## Import

### Standalone

Import `NgSelectComponent` and Signal Forms' `FormField` directive. Import any template directives you use alongside them:

```typescript
import { NgLabelTemplateDirective, NgOptionTemplateDirective, NgSelectComponent } from '@ng-select/ng-select';
import { FormField } from '@angular/forms/signals';

@Component({
	selector: 'example',
	templateUrl: './example.component.html',
	styleUrl: './example.component.scss',
	imports: [FormField, NgLabelTemplateDirective, NgOptionTemplateDirective, NgSelectComponent],
})
export class ExampleComponent {}
```

For Reactive Forms, import `ReactiveFormsModule`. For Template-driven Forms, import `FormsModule`.

### NgModule

The standalone component is preferred. Existing NgModule applications can continue to import `NgSelectModule` with the forms module they use. This Template-driven Forms example uses `FormsModule`:

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
	// set the bindValue to global config when you use the same
	// bindValue in most places.
	this.config.bindValue = 'value';
}
```
