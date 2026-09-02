ng-select supports Signal Forms, Reactive Forms and Template-driven Forms, in that order of recommendation for new Angular 22 code.

Define options in your consuming component:

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

## Signal Forms

Import `FormField` from `@angular/forms/signals`, create a form field tree, and bind the field—not the raw signal value:

```typescript
import { signal } from '@angular/core';
import { form, FormField } from '@angular/forms/signals';

readonly carModel = signal({ selectedCarId: null as number | null });
readonly carForm = form(this.carModel);
```

```html
<ng-select [items]="cars" bindLabel="name" bindValue="id" [formField]="carForm.selectedCarId" />
```

## Reactive Forms

```typescript
import { FormControl, ReactiveFormsModule } from '@angular/forms';

readonly selectedCarId = new FormControl<number | null>(null);
```

```html
<ng-select [items]="cars" bindLabel="name" bindValue="id" [formControl]="selectedCarId" />
```

## Template-driven Forms

```typescript
import { FormsModule } from '@angular/forms';

selectedCarId: number | null = null;
```

```html
<!-- Using ng-option and for loop -->
<ng-select [(ngModel)]="selectedCarId">
	@for (car of cars; track car.id) {
	<ng-option [value]="car.id">{{ car.name }}</ng-option>
	}
</ng-select>

<!-- Using items input -->
<ng-select [items]="cars" bindLabel="name" bindValue="id" [(ngModel)]="selectedCarId" />
```
