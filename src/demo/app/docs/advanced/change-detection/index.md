The ng-select component implements `OnPush` change detection, which means the dirty checking checks for immutable data types. That means if you do object mutations like:

```typescript
this.items.push({ id: 1, name: 'New item' });
```

the component will not detect a change. Instead you need to do:

```typescript
this.items = [...this.items, { id: 1, name: 'New item' }];
```

This will cause the component to detect the change and update. Some might have concerns that this is a pricey operation; however, it is much more performant than running `ngDoCheck` and constantly diffing the array.

## Zoneless change detection

`@ng-select/ng-select` and `@ng-select/ng-option-highlight` fully support [zoneless change detection](https://angular.dev/guide/zoneless) — the default for new Angular apps since v21. No setup is required: the libraries do not depend on `zone.js` (it is not in their dependency graphs) and work identically whether your app is zoneless or still uses `zone.js`. Both modes are covered by the unit-test suite in CI, and this docs site runs zoneless.
