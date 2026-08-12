If you are not happy with the default styles you can easily override them with increased selector specificity or by creating your own theme. This applies if you are using no `ViewEncapsulation` or adding styles to a global stylesheet.

```html
<ng-select class="custom"></ng-select>
```

```css
.ng-select.custom {
	border: 0px;
	min-height: 0px;
	border-radius: 0;
}
.ng-select.custom .ng-select-container {
	min-height: 0px;
	border-radius: 0;
}
```

If you are using `ViewEncapsulation`, you could use the special `::ng-deep` selector which will prevent scoping for nested selectors, although this is more of a workaround and we recommend the solution described above.

```css
.ng-select.custom ::ng-deep .ng-select-container {
	min-height: 0px;
	border-radius: 0;
}
```

> **Warning**
> Keep in mind that `::ng-deep` is deprecated and there is no alternative to it yet. See [angular/angular#17867](https://github.com/angular/angular/issues/17867).

## Validation state

By default, when you use reactive forms validators or template driven forms validators, the css class `ng-invalid` will be applied on ng-select. You can show the error state by adding a custom css style:

```css
ng-select.ng-invalid.ng-touched .ng-select-container {
	border-color: #dc3545;
	box-shadow:
		inset 0 1px 1px rgba(0, 0, 0, 0.075),
		0 0 0 3px #fde6e8;
}
```
