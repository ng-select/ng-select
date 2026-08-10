ng-select allows you to provide a custom selection implementation using `SELECTION_MODEL_FACTORY`. To override the [default](https://github.com/ng-select/ng-select/blob/master/src/ng-select/lib/selection-model.ts) logic, provide your factory method in your Angular module or application providers:

```typescript
// app.config.ts / app.module.ts
providers: [{ provide: SELECTION_MODEL_FACTORY, useValue: <SelectionModelFactory>CustomSelectionFactory }];

// selection-model.ts
export function CustomSelectionFactory() {
	return new CustomSelectionModel();
}

export class CustomSelectionModel implements SelectionModel {
	// ...
}
```
