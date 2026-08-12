Every theme exposes its colours, sizes and shadows as CSS custom properties, so the recommended way to restyle ng-select is to set a few `--ng-select-*` variables. No `::ng-deep`, no specificity battles, and because custom properties resolve at runtime you can switch palettes without recompiling.

## Theming with CSS variables

Import a theme as usual, then override the variables you care about:

```css
@import '@ng-select/ng-select/themes/default.theme.css';

:root {
	--ng-select-highlight: #7aa2f7;
	--ng-select-border: #3a4152;
	--ng-select-bg: #1f2430;
}
```

{{ NgDocActions.demo("CssVariablesExampleComponent") }}

> **Warning**
> The dropdown panel renders in a CDK overlay attached to `<body>`, not inside the `<ng-select>` element. Declare the variables on a common ancestor of both — `:root`, `html` or `body` — or the panel keeps the default palette. Scoping them to a wrapper `<div>` only restyles the select control.

### Dark mode

Because the variables are read at paint time, a dark palette is just a second declaration block:

```css
@media (prefers-color-scheme: dark) {
	:root {
		--ng-select-bg: #1f2430;
		--ng-select-border: #3a4152;
		--ng-select-primary-text: #d8dee9;
		--ng-select-dropdown-bg: #1f2430;
		--ng-select-dropdown-option-text: #d8dee9;
		--ng-select-marked: #2a3145;
		--ng-select-selected: #2f3a52;
	}
}
```

For a class-driven toggle (the Tailwind `dark:` convention), swap the media query for `html.dark { ... }`.

> **Note**
> Some shades are derived from a base colour — `--ng-select-selected` and `--ng-select-marked` are tints of `--ng-select-highlight`, for example. CSS cannot recompute them, so changing `--ng-select-highlight` alone will not recolour them; set the derived variables too. The tables below mark which ones are derived. Overriding in Sass instead _does_ recompute them — see **Overriding with Sass** further down.

### Variables — default theme

| Variable                               | Default                       | Applies to                         |
| -------------------------------------- | ----------------------------- | ---------------------------------- |
| `--ng-select-highlight`                | `#007eff`                     | Focused border                     |
| `--ng-select-primary-text`             | `#333`                        | Control text                       |
| `--ng-select-disabled-text`            | `#f9f9f9`                     | Disabled control background        |
| `--ng-select-border`                   | `#ccc`                        | Control and dropdown borders       |
| `--ng-select-border-radius`            | `4px`                         | Control and dropdown corners       |
| `--ng-select-bg`                       | `#ffffff`                     | Control background                 |
| `--ng-select-height`                   | `36px`                        | Control height                     |
| `--ng-select-box-shadow`               | focus ring                    | Focused control shadow             |
| `--ng-select-container-hover-shadow`   | `0 1px 0 rgba(0, 0, 0, 0.06)` | Control hover shadow               |
| `--ng-select-value-padding-left`       | `10px`                        | Value container inset              |
| `--ng-select-value-font-size`          | `0.9em`                       | Multi-select chip text             |
| `--ng-select-value-text`               | `#333`                        | Multi-select chip text             |
| `--ng-select-input-text`               | `#000000`                     | Search input text                  |
| `--ng-select-placeholder` \*           | `#999999`                     | Placeholder text                   |
| `--ng-select-selected`                 | `rgb(234.6, 244.68, 255)`     | Selected option / chip background  |
| `--ng-select-selected-text`            | `#333`                        | Selected option text               |
| `--ng-select-selected-hover` \*        | `rgb(209.1, 231.78, 255)`     | Chip remove-icon hover             |
| `--ng-select-selected-border` \*       | `rgb(183.6, 218.88, 255)`     | Chip remove-icon divider           |
| `--ng-select-marked`                   | `rgb(244.8, 249.84, 255)`     | Keyboard-marked option background  |
| `--ng-select-marked-text`              | `#333`                        | Keyboard-marked option text        |
| `--ng-select-arrow` \*                 | `#999999`                     | Arrow and clear icon               |
| `--ng-select-arrow-hover` \*           | `#666666`                     | Arrow hover                        |
| `--ng-select-arrow-active` \*          | `#333333`                     | Arrow while open                   |
| `--ng-select-clear` \*                 | `#999999`                     | Clear icon                         |
| `--ng-select-clear-hover`              | `#d0021b`                     | Clear icon hover / focus           |
| `--ng-select-border-dark` \*           | `rgb(178.5, 178.5, 178.5)`    | Top border while open              |
| `--ng-select-border-light` \*          | `rgb(216.75, 216.75, 216.75)` | Bottom border while open           |
| `--ng-select-border-lighter` \*        | `rgb(229.5, 229.5, 229.5)`    | Panel edge merged with the control |
| `--ng-select-dropdown-bg`              | `#ffffff`                     | Panel background                   |
| `--ng-select-dropdown-border`          | `#ccc`                        | Panel border                       |
| `--ng-select-dropdown-shadow`          | `0 1px 0 rgba(0, 0, 0, 0.06)` | Panel shadow                       |
| `--ng-select-dropdown-option-bg`       | `#ffffff`                     | Option background                  |
| `--ng-select-dropdown-option-text`     | `rgba(0, 0, 0, 0.87)`         | Option text                        |
| `--ng-select-dropdown-option-disabled` | `#cccccc`                     | Disabled option text               |
| `--ng-select-dropdown-optgroup-text`   | `rgba(0, 0, 0, 0.54)`         | Group label text                   |
| `--ng-select-dropdown-optgroup-marked` | `rgba(0, 0, 0, 0.54)`         | Selected group label text          |

\* Derived shade — computed in Sass from a base colour. Set it explicitly when overriding that base colour through CSS variables.

### Variables — ant.design theme

| Variable                             | Default                        | Applies to                        |
| ------------------------------------ | ------------------------------ | --------------------------------- |
| `--ng-select-highlight`              | `#40a9ff`                      | Focused / open border             |
| `--ng-select-primary-text`           | `rgba(0, 0, 0, 0.65)`          | Control and option text           |
| `--ng-select-disabled-text`          | `rgba(0, 0, 0, 0.25)`          | Disabled text, arrow              |
| `--ng-select-disabled-bg`            | `#f5f5f5`                      | Disabled background               |
| `--ng-select-border`                 | `#d9d9d9`                      | Control border                    |
| `--ng-select-border-radius`          | `4px`                          | Control, panel and option corners |
| `--ng-select-bg`                     | `#ffffff`                      | Control and panel background      |
| `--ng-select-selected`               | `rgba(24, 144, 255, 0.2)`      | Focus ring                        |
| `--ng-select-selected-bg`            | `#fafafa`                      | Selected option background        |
| `--ng-select-marked`                 | `#e6f7ff`                      | Keyboard-marked option            |
| `--ng-select-placeholder` \*         | `rgba(153, 153, 153, 0.65)`    | Placeholder text                  |
| `--ng-select-value-bg`               | `#fafafa`                      | Multi-select chip background      |
| `--ng-select-value-border` \*        | `rgb(232.3, 232.3, 232.3)`     | Multi-select chip border          |
| `--ng-select-border-lighter` \*      | `rgb(242.5, 242.5, 242.5)`     | Panel edge next to the control    |
| `--ng-select-clear` \*               | `#a6a6a6`                      | Clear icon                        |
| `--ng-select-clear-bg`               | `rgba(0, 0, 0, 0.25)`          | Clear button background           |
| `--ng-select-clear-bg-hover`         | `rgba(0, 0, 0, 0.45)`          | Clear button hover / focus        |
| `--ng-select-clear-icon`             | `#fff`                         | Clear glyph                       |
| `--ng-select-dropdown-optgroup-text` | `rgba(0, 0, 0, 0.45)`          | Group label text                  |
| `--ng-select-dropdown-shadow`        | `0 2px 8px rgba(0, 0, 0, .15)` | Panel elevation                   |

\* Derived shade — computed in Sass from a base colour. Set it explicitly when overriding that base colour through CSS variables.

### Variables — material theme

| Variable                           | Default                     | Applies to                           |
| ---------------------------------- | --------------------------- | ------------------------------------ |
| `--ng-select-highlight`            | `#3f51b5`                   | Focused underline, label, selection  |
| `--ng-select-primary-text`         | `rgba(0, 0, 0, 0.87)`       | Control and option text              |
| `--ng-select-primary-light-text`   | `rgba(255, 255, 255, 0.87)` | Chip remove-icon hover               |
| `--ng-select-secondary-text`       | `rgba(0, 0, 0, 0.54)`       | Placeholder, arrow, clear, group     |
| `--ng-select-secondary-light-text` | `rgba(255, 255, 255, 0.54)` | Chip remove icon                     |
| `--ng-select-disabled-text`        | `rgba(0, 0, 0, 0.38)`       | Disabled text                        |
| `--ng-select-disabled-value-text`  | `rgba(0, 0, 0, 0.26)`       | Disabled chip text                   |
| `--ng-select-divider`              | `rgba(0, 0, 0, 0.12)`       | Outline, selected row, panel shadow  |
| `--ng-select-bg`                   | `#ffffff`                   | Panel background, chip text          |
| `--ng-select-underline`            | `rgba(0, 0, 0, 0.42)`       | Resting underline                    |
| `--ng-select-marked`               | `rgba(0, 0, 0, 0.04)`       | Keyboard-marked option               |
| `--ng-select-fill-bg`              | `rgba(0, 0, 0, 0.06)`       | `ng-appearance-fill` background      |
| `--ng-select-fill-disabled-bg`     | `rgba(0, 0, 0, 0.02)`       | Disabled fill background             |
| `--ng-select-outline-width`        | `1px` / `2px`               | `ng-appearance-outline` border width |

## Overriding with Sass

The Sass variables still work and seed the custom properties above, so existing setups keep compiling unchanged:

```scss
@use '@ng-select/ng-select/scss/default.theme' with (
	$ng-select-highlight: #7aa2f7,
	$ng-select-border: #3a4152
);
```

The older `@import` form with variables declared beforehand also still works.

Unlike the CSS variables, Sass overrides **do** recompute the derived shades: setting `$ng-select-highlight` alone also recolours `$ng-select-selected` and `$ng-select-marked`, because Sass evaluates `color.adjust()` at build time. Reach for this when you want one base colour to drive the whole palette; reach for the CSS variables when you need the palette to change at runtime.

## Overriding with selectors

For anything the variables do not cover, override the styles with increased selector specificity or create your own theme. This applies if you are using no `ViewEncapsulation` or adding styles to a global stylesheet.

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
