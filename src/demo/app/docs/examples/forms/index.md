ng-select supports Signal Forms, Reactive Forms and Template-driven Forms through the same control value accessor.

## Signal Forms

Import `FormField` from `@angular/forms/signals` and bind a field from the tree returned by `form()`. `FormsModule` is not required for this integration.

```typescript
import { signal } from '@angular/core';
import { form, FormField, required } from '@angular/forms/signals';
import { NgSelectComponent } from '@ng-select/ng-select';

@Component({
	imports: [FormField, NgSelectComponent],
})
export class CityEditor {
	readonly model = signal({ cityId: null as number | null });
	readonly cityForm = form(this.model, (path) => required(path.cityId));
}
```

```html
<ng-select [items]="cities" bindLabel="name" bindValue="id" [formField]="cityForm.cityId" />
```

The example also covers initial values before async items arrive, multiple selection, validation, disabled state, and recreating the control with `@if`.

{{ NgDocActions.demo("FormsSignalExampleComponent") }}

{{ NgDocActions.demo("StackblitzButtonComponent", { container: false, inputs: { example: "forms-signal-example" } }) }}

### Validation classes

Signal Forms keeps validation state on the field tree and does not add Angular's legacy `ng-valid`, `ng-invalid`, `ng-touched`, and `ng-dirty` classes unless configured. Applications that use those classes with an ng-select theme can enable the compatibility preset:

```typescript
import { provideSignalFormsConfig } from '@angular/forms/signals';
import { NG_STATUS_CLASSES } from '@angular/forms/signals/compat';

bootstrapApplication(AppComponent, {
	providers: [provideSignalFormsConfig({ classes: NG_STATUS_CLASSES })],
});
```

## Reactive Forms

Import `ReactiveFormsModule` and bind ng-select with `formControl`, `formControlName`, or a containing `FormGroup`.

{{ NgDocActions.demo("FormsReactiveExampleComponent") }}

{{ NgDocActions.demo("StackblitzButtonComponent", { container: false, inputs: { example: "forms-reactive-example" } }) }}

### Single select with required validation

{{ NgDocActions.demo("FormsSingleSelectExampleComponent") }}

{{ NgDocActions.demo("StackblitzButtonComponent", { container: false, inputs: { example: "forms-single-select-example" } }) }}

### Multi select with clear button

{{ NgDocActions.demo("FormsMultiSelectExampleComponent") }}

{{ NgDocActions.demo("StackblitzButtonComponent", { container: false, inputs: { example: "forms-multi-select-example" } }) }}

### Reactive form using ng-option

{{ NgDocActions.demo("FormsWithOptionsExampleComponent") }}

{{ NgDocActions.demo("StackblitzButtonComponent", { container: false, inputs: { example: "forms-with-options-example" } }) }}

### Reactive Forms using async data

{{ NgDocActions.demo("FormsAsyncDataExampleComponent") }}

{{ NgDocActions.demo("StackblitzButtonComponent", { container: false, inputs: { example: "forms-async-data-example" } }) }}

### Reactive Forms with a custom template

{{ NgDocActions.demo("FormsCustomTemplateExampleComponent") }}

{{ NgDocActions.demo("StackblitzButtonComponent", { container: false, inputs: { example: "forms-custom-template-example" } }) }}

## Template-driven Forms

Import `FormsModule`, bind with `[(ngModel)]`, and provide `name` when the control is inside a form.

{{ NgDocActions.demo("FormsTemplateDrivenExampleComponent") }}

{{ NgDocActions.demo("StackblitzButtonComponent", { container: false, inputs: { example: "forms-template-driven-example" } }) }}

## API

Inputs used by the examples on this page:

| Input            | Type                        | Default     | Description                                                                                                                      |
| ---------------- | --------------------------- | ----------- | -------------------------------------------------------------------------------------------------------------------------------- |
| [items]          | `Array<any>`                | `[]`        | Items array                                                                                                                      |
| bindLabel        | `string`                    | `label`     | Object property to use for label. Default `label`                                                                                |
| bindValue        | `string`                    | `-`         | Object property to use for selected model. By default binds to whole object.                                                     |
| [multiple]       | `boolean`                   | `false`     | Allows to select multiple items.                                                                                                 |
| [clearable]      | `boolean`                   | `true`      | Allow to clear selected value. Default `true`                                                                                    |
| [readonly]       | `boolean`                   | `false`     | Set ng-select as readonly.                                                                                                       |
| [searchable]     | `boolean`                   | `true`      | Allow to search for value. Default `true`                                                                                        |
| placeholder      | `string`                    | `-`         | Placeholder text.                                                                                                                |
| labelForId       | `string`                    | `-`         | Id to associate control with label.                                                                                              |
| appearance       | `string`                    | `underline` | Allows to select dropdown appearance. Set to `outline` or `fill` for Material form-field styles (applies only to Material theme) |
| dropdownPosition | `bottom` \| `top` \| `auto` | `auto`      | Set the dropdown position on open                                                                                                |
| clearAllText     | `string`                    | `Clear all` | Set custom text for clear all icon title                                                                                         |
| [selectOnTab]    | `boolean`                   | `false`     | Select marked dropdown item using tab. Default `false`                                                                           |
| [virtualScroll]  | `boolean`                   | false       | Enable virtual scroll for better performance when rendering a lot of data                                                        |

Outputs used by the examples on this page:

| Output   | Description                                |
| -------- | ------------------------------------------ |
| (change) | Fired on model change. Outputs whole model |

See the `NgSelectComponent` API reference for the complete list of inputs and outputs.
