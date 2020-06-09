# Changelog

Started to maintain versions made from Common App for forked version.

## 3.0.2

### Bug fixes

- Remove hostbinding from dropdown panel which was cancelling out the ID applied directly, causing aria-controls to break
- Fix incorrect role applied to single-select chosen values

## 3.0.1

### Bug fixes

- Update clear button text to 'Clear selection' for better applications across single or multiselect dropdowns
- Add non-color-based focus state to clear button
- Remove outline from input on focus to counter Chromium's new default focus states (active focus styles is handled higher up in the component)

## 3.0.0

### Major release

Continued versioning from last iteration of CA release (2.7.*). This release is considered major as it was fully rolled back prior to CA changes, and a11y and styling changes were introduced manually to resolve merge issues and some poor branch management practices.

### Features

- Improved accessibility
- Updated styles to match new design system for Rec

### Fixes

- Resolve issue where selected values and placeholders would not show up
