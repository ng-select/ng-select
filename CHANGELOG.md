# Changelog

## 6.1.1

### 🐛 Fixes

- Fixed ng-input elements taking up space even when selects weren't searchable

## 6.1.0

### 🔧 Changes

- Add a sizing constraint to option icons to avoid external global influences
- Updated colors to rely on Forge colors with backups
- Remove min-heights and refactor container to use padding to better match CA system form fields

### 🐛 Fixes

- Removed custom padding values related to old Neutrif line-height issues

## 6.0.0

### 🔥 BREAKING CHANGES

- Update ng-select to be compatible with Angular 16

### 🔧 Changes

- Reworked keyboard controls to use new divided methods provided by ng-select

## 5.0.2

### 🔧 Changes

- Updated handle key deletion method of multi-select chip lists (chip deletion and set focus on next chip or element)

## 5.0.0

### 🔥 BREAKING CHANGES

- Updated ng-select Angular version to 15.x

### 🔧 Changes

- Updated spacing method of multi-select chip lists (margins to gaps)
- Fixed line-height issues in dropdown options

### 🐛 Fixes

- Remove invalid ARIA properties from wrapper and input
- Remove unnecessary `aria-owns` from input
- Add back accessible name for listbox dropdown panel
- Fix missing spaces in multi-select inputs between chips and other elements
- Fix input value overlap with clear icon

## 5.0.0-rc2

### 🐛 Fixes

- Remove invalid ARIA properties from wrapper and input
- Remove unnecessary `aria-owns` from input
- Add back accessible name for listbox dropdown panel
- Fix missing spaces in multi-select inputs between chips and other elements
- Fix input value overlap with clear icon

## 5.0.0-rc1

### 🔥 BREAKING CHANGES

- Updated ng-select Angular version to 15.x

### 🔧 Changes

- Updated spacing method of multi-select chip lists (margins to gaps)
- Fixed line-height issues in dropdown options

## 4.0.3

* Fix disappearing dropdown on search/typeahead
* Remove incorrect ARIA role on text input within combobox div
* Remove invalid aria-expanded attribute from text input
* Fix border-radius disappearing on item hover
* Remove console logs on keypresses

## 4.0.2

* Fix new styles not being included in package

## 4.0.1

* Fix visible ng-value
* Fix centering of clear button within wrapper

## 4.0.0

* **Breaking**: Update to Angular 11 compatible version
* Reintroduce ng-value for displaying values (to allow for templated value display)

## 3.2.0

### Enhancement

* 🔥 remove small addition to angular json ([1f85b90](https://github.com/ng-select/ng-select/commit/1f85b90f90599d16888c1a63689eb2a7bd3bf1c5))
* 🔖 bump to version 3.2.0 ([d5dcef6](https://github.com/ng-select/ng-select/commit/d5dcef61a5b74a0e615d575116996a92dbdf2cd1))
* 💄 consolidate styles to a single selector ([7762c6d](https://github.com/ng-select/ng-select/commit/7762c6d1418cd07a12c566d43e8b70a71e53f013))
* PTS-12669: added new placeholder styling under ng-select-single ([0fc3b6d](https://github.com/ng-select/ng-select/commit/0fc3b6d3dd1d604f2ac3085850bbbb8bd4ca54df))
* PTS-12668: added new placeholder styling under ng-select-multiple ([56ff1c1](https://github.com/ng-select/ng-select/commit/56ff1c16441178d0e88657876a195a39b682f851))

## 3.1.4

### Bug Fixes

* :lipstick: fix misalignment issue with default min height ([a5041d7](https://github.com/ng-select/ng-select/commit/a5041d719d2089342fb506e6be12be7aa8727d41))

## 3.1.3

### Bug Fixes

* :lipstick: fix misalignment issue with default min height ([a5041d7](https://github.com/ng-select/ng-select/commit/a5041d719d2089342fb506e6be12be7aa8727d41))

## 3.1.2

### Bug Fixes

* :wheelchair: add back missing describedBy attribute to input ([ffcbbd3](https://github.com/ng-select/ng-select/commit/ffcbbd322b2028b3d293abce32b9ff0fdf7e57e4))

## 3.1.1

### Bug Fixes

* :wheelchair: remove duplicative listbox role and simplify dropdown content area ([1fedcaf](https://github.com/ng-select/ng-select/commit/1fedcafddf62fe3fc72dde69dd1176a797106c9e))

### Features

* :lipstick: remove redundant selected class, rely on option-level ([5cc318c](https://github.com/ng-select/ng-select/commit/5cc318c828f02e9c8d324fbc75603b4b9f9d19ab))

## 3.1.0

### Bug Fixes

* remove github flows and templates ([71348b4](https://github.com/ng-select/ng-select/commit/71348b436dfa8d6fac0edb6c233adba367089f6c))
* resolve merge conflicts resulting in duplicative props/functions ([eaf7de5](https://github.com/ng-select/ng-select/commit/eaf7de53d048c78e2d8e3093d460805665db370e))
* revert commented out default theme ([06f1d95](https://github.com/ng-select/ng-select/commit/06f1d95937a69d07c86c9332d3f848fc01f955f9))
* **a11y:** add back a focus state that isn't just a color change ([775334e](https://github.com/ng-select/ng-select/commit/775334e710bdb0405bc981c96384740eec401e68))
* **a11y:** remove autocomplete attr again as its used incorrectly ([195fd3d](https://github.com/ng-select/ng-select/commit/195fd3de5f843fdc5b371da5f40409229e709f4e))
* **a11y:** remove optional role when chosen value is in single select ([f011931](https://github.com/ng-select/ng-select/commit/f0119319a9df7a6f1124cfb68293dae857b39952))
* **a11y:** update to focus style for Chromium update ([fb133a7](https://github.com/ng-select/ng-select/commit/fb133a79c6c7b787ea42452a0ece4677e95f77c8))
* **input:** add missing attribute setting ([142ec02](https://github.com/ng-select/ng-select/commit/142ec027aa694c49a71bbed006fc44dfc9772037))
* **publish:** remove public flag ([2bb35ac](https://github.com/ng-select/ng-select/commit/2bb35ac593e124bfa55b3aaf58fc7dbf012fc353))

### Features

* **themes:** :fire: remove theme stylesheets as they are unused ([f4cfe44](https://github.com/ng-select/ng-select/commit/f4cfe44eb6135791b7dde72140bc84b2dd9b0280))
