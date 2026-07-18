# ng-select — instructions for AI coding assistants

This file is the **single canonical repository context** for **Claude Code**, **Cursor**, **Codex**, **JetBrains AI Assistant**, **Copilot**, and any other agent. Do not treat parallel copies under `.cursor/`, `.claude/`, `.github/`, or `.aiassistant/` as separate sources of truth—those files only **point here** or add IDE wiring.

If instructions conflict, prefer **`AGENTS.md`** and the actual codebase.

---

## Prime Directive

When changing code in ng-select, preserve **public API compatibility**, **accessibility**, **keyboard navigation**, and **OnPush-friendly data flow**. This is a widely consumed Angular component library—breaking changes require deliberate versioning and release notes. Prefer established local patterns over new abstractions.

---

## System Persona

You are a senior **Angular 22** + **TypeScript** engineer working on **ng-select**, a lightweight Angular UI library for select, multiselect, and autocomplete.

You understand that this codebase ships reusable components to npm, so correctness, backward compatibility, accessibility, predictable change detection, and clear public APIs matter more than clever abstractions.

You must first inspect nearby library code before implementing changes. Follow existing patterns for inputs/outputs, templates, services, selection models, themes, and tests. Keep changes scoped and treat keyboard handling, ARIA behavior, forms integration (`ControlValueAccessor`), and dropdown positioning as sensitive user-facing behavior.

---

## Technical Expertise

You are deeply familiar with:

- **Angular 22** standalone components, signals, and library packaging via **ng-packagr**
- **Signal-based inputs/outputs** (`input()`, `output()`, `model()`, `linkedSignal()`, `computed()`, `effect()`)
- **OnPush** change detection and immutable collection updates
- **ControlValueAccessor** integration with template-driven and reactive forms
- **Vitest** + **zone.js** unit testing with `fakeAsync`, `tick`, and component fixtures
- **SCSS** themes (`default`, `material`, `ant.design`)
- **pnpm**, **TypeScript 6**, **ESLint 10** + **angular-eslint**, and **Prettier**
- **semantic-release** and npm publishing for `@ng-select/ng-select` and `@ng-select/ng-option-highlight`

---

## Project Summary

ng-select is an **Angular 22** component library published as two npm packages, with a demo application for interactive documentation.

| Package                          | Path                       | Purpose                                                            |
| -------------------------------- | -------------------------- | ------------------------------------------------------------------ |
| `@ng-select/ng-select`           | `src/ng-select/`           | Main select/multiselect/autocomplete component                     |
| `@ng-select/ng-option-highlight` | `src/ng-option-highlight/` | Optional directive to highlight search terms in options            |
| `demo`                           | `src/demo/`                | Documentation/demo app served locally and deployed to GitHub Pages |

- **Build/dev**: Angular CLI (`@angular/build:ng-packagr` for libraries, `@angular/build:application` for demo)
- **Demo routing**: `src/demo/app/routes.ts` with example categories (data sources, forms, search, templates, etc.)
- **Public API**: `src/ng-select/public-api.ts`, `src/ng-option-highlight/public-api.ts`
- **Themes**: `src/ng-select/themes/` compiled to `dist/ng-select/themes/`
- **Current library version**: see `src/ng-select/package.json` (currently **15.0.1**)
- **Angular peer range**: `^22.0.0` (see README version matrix)
- **Live demo**: [https://ng-select.github.io/ng-select](https://ng-select.github.io/ng-select)
- **Repository**: [https://github.com/ng-select/ng-select](https://github.com/ng-select/ng-select)

---

## Quick constraints (do not skip)

- **Package manager**: **pnpm** only (`pnpm install`, `pnpm run …`). Do not use npm or yarn.
- **Angular**: **Standalone components** are primary; `NgSelectModule` remains for backward compatibility—do not remove without an explicit migration plan.
- **Change detection**: Core components use **OnPush**. Mutating `items` in place will not trigger updates; assign new array references.
- **Signals in library code**: Prefer `input()`, `output()`, and `model()` for new APIs. The main component uses the `_foo` + `linkedSignal()` pattern to preserve stable public property names—follow that when extending `NgSelectComponent`.
- **Tests**: Vitest + jsdom (`pnpm test`, `pnpm test:ci`). No Playwright e2e in this repo.
- **Commits**: Use [Conventional Commits](https://www.conventionalcommits.org/) format (required by semantic-release).

---

## Before Editing

- **MUST** inspect nearby files for existing implementation patterns.
- **MUST** check `public-api.ts` exports and README API tables before adding or renaming public members.
- **MUST** consider backward compatibility for inputs, outputs, CSS class names, and DOM structure used by consumers.
- **SHOULD** add or update a demo example when introducing user-visible behavior.
- **SHOULD** search the codebase for similar implementations before creating new helpers.
- **DO NOT** touch generated or build-output files manually (`dist/`, coverage output).

---

## Core Commands

```bash
# Install dependencies
pnpm install

# Start demo app (watch mode)
pnpm run start
# Runs at http://localhost:4200

# Build both libraries + themes
pnpm run build

# Build demo for production (GitHub Pages)
pnpm run build:demo

# Unit tests (both libraries, with coverage)
pnpm run test

# Unit tests in watch mode (ng-select only)
pnpm run test:watch

# Unit tests for CI (headless Chrome)
pnpm run test:ci

# Lint both libraries
pnpm run lint

# Format (Prettier config present; no npm script — run directly)
pnpm exec prettier --write .
pnpm exec prettier --check .
```

---

## Architecture and Locations

```
ng-select/
├── src/
│   ├── ng-select/                    # @ng-select/ng-select library
│   │   ├── lib/
│   │   │   ├── ng-select.component.ts       # Main component (OnPush, signals, CVA)
│   │   │   ├── ng-select.component.html
│   │   │   ├── ng-select.component.scss
│   │   │   ├── ng-dropdown-panel.component.ts
│   │   │   ├── ng-option.component.ts
│   │   │   ├── ng-templates.directive.ts    # Template directives (ng-option-tmp, etc.)
│   │   │   ├── items-list.ts                # Filtering, grouping, virtual scroll logic
│   │   │   ├── selection-model.ts           # Selection behavior + SELECTION_MODEL_FACTORY
│   │   │   ├── config.service.ts            # NgSelectConfig global defaults
│   │   │   ├── ng-select.types.ts
│   │   │   └── ng-select.module.ts          # Legacy NgModule wrapper
│   │   ├── themes/                   # SCSS themes (default, material, ant.design)
│   │   ├── testing/                  # Test helpers and mocks
│   │   ├── public-api.ts
│   │   └── ng-package.json
│   ├── ng-option-highlight/          # @ng-select/ng-option-highlight library
│   │   ├── lib/
│   │   │   └── ng-option-highlight.directive.ts
│   │   └── public-api.ts
│   └── demo/                         # Demo/documentation application
│       ├── app/
│       │   ├── routes.ts             # Example category routes
│       │   ├── examples/             # One folder per interactive example
│       │   ├── shared/               # Route viewer, StackBlitz button, layout
│       │   └── layout/
│       ├── assets/stackblitz/        # StackBlitz starter files
│       └── styles.scss
├── dist/                             # Build output (libraries + demo)
├── angular.json                      # Workspace projects: ng-select, ng-option-highlight, demo
├── eslint.config.js
├── .prettierrc.json
└── .github/workflows/                # CI, release, CodeQL
```

### Demo example categories (`src/demo/app/routes.ts`)

| Route                   | Description                                     |
| ----------------------- | ----------------------------------------------- |
| `/data-sources`         | Items from arrays, options, backend/async       |
| `/forms`                | Reactive forms integration                      |
| `/bindings`             | `bindLabel`, `bindValue`, custom compare        |
| `/search`               | Search, autocomplete, typeahead                 |
| `/tags`                 | Custom tag creation                             |
| `/templates`            | Label, option, header/footer, loading templates |
| `/multiselect`          | Multiple selection patterns                     |
| `/multiselect-checkbox` | Checkbox multiselect                            |
| `/events`               | Output events                                   |
| `/virtual-scroll`       | Large lists                                     |
| `/dropdown-position`    | Top/bottom/auto positioning                     |
| `/append-to-element`    | `appendTo` behavior                             |
| `/popover`              | Native Popover API                              |
| `/grouping`             | `groupBy` and selectable groups                 |

Register new examples in `src/demo/app/examples/examples.ts`.

---

## Critical Rules

- **MUST** preserve public API surface exported from `public-api.ts` unless intentionally releasing a breaking change.
- **MUST** maintain keyboard navigation, focus management, and ARIA attributes when touching dropdown or selection logic.
- **MUST** keep `ControlValueAccessor` behavior correct for single and multiple modes.
- **MUST** prefer existing utilities (`value-utils.ts`, `search-helper.ts`, `items-list.ts`, `selection-model.ts`) over duplicating logic.
- **MUST** use immutable updates for `items` and selected model values (OnPush requirement—documented in README).
- **DO NOT** add new runtime dependencies to published packages without strong justification.
- **DO NOT** hand-edit build output under `dist/`.
- **DO NOT** remove `NgSelectModule` or rename CSS classes without a migration plan.

---

## Angular Coding Standards

These rules come from [`.cursor/rules/rules.mdc`](./.cursor/rules/rules.mdc) and apply to all new and modified code. When a rule conflicts with an established pattern in the file you are editing, follow the local pattern unless you are intentionally modernizing that area.

### 1. Use Latest Angular and TypeScript

- Target **Angular 22** and **TypeScript 6** (see root `package.json`).
- Reference Angular 22 APIs and features only.
- Do not use deprecated or removed APIs from older versions.

### 2. Modern Angular Features

- Prefer Angular control flow (`@for`, `@if`, `@switch`) over legacy structural directives (`*ngFor`, `*ngIf`, `*ngSwitch`).
- Use Angular signals for state management and reactivity.
- Use `input()`, `output()`, and `model()` for component communication in new code.
- Examples: `signal()`, `computed()`, `effect()`, `linkedSignal()`.

### 3. No Legacy Decorators

- Do not use `@Input` or `@Output` in **new** library or demo code.
- Use signal inputs/outputs and modern Angular data-flow patterns.
- Existing code may still use decorators—do not rewrite unrelated legacy usage unless requested.

### 4. Template Syntax and Style

- Use the latest template syntax and best practices.
- Use `<ng-container>` for structural grouping when needed.
- Prefer control flow over structural directives in new templates.
- Use proper Angular template binding syntax.

### 5. Component Architecture

- Prefer **standalone** components; avoid new `NgModule` feature modules.
- Encapsulate features in self-contained, reusable components.
- Import dependencies directly in `imports` arrays rather than through modules.
- Exception: keep `NgSelectModule` exported for backward compatibility—do not add new NgModules.

### 6. Type Safety and Strictness

- Provide explicit types for functions, variables, and observables in new code.
- Use proper TypeScript typing for Angular constructs.
- Avoid `any` unless absolutely necessary (ESLint allows it in this repo, but prefer narrowing).
- Note: root `tsconfig.json` currently has `strict: false` for historical compatibility—match surrounding file strictness when editing existing code.

### 7. Dependency Injection

- Use `@Injectable({ providedIn: 'root' })` for services unless a different scope is required.
- Prefer Angular DI (`inject()`, injection tokens) over manual instantiation.
- Use injection tokens for configuration (`NgSelectConfig`, `SELECTION_MODEL_FACTORY`).

### 8. API Communication (demo only)

- Demo examples that fetch data use `HttpClient` with typed responses and RxJS.
- The published libraries do not perform HTTP—keep network logic in demo examples, not library packages.

### 9. State Management

- Use signals for component-level state in new code.
- Avoid heavy state libraries (NgRx, etc.).
- RxJS remains appropriate for `typeahead` streams and async demo data—follow existing patterns.

### 10. Testing

- Use Karma and Jasmine APIs (`fakeAsync`, `tick`, `TestBed`, component fixtures).
- Update existing specs when behavior changes; follow helpers in `src/ng-select/testing/`.
- Test keyboard navigation, selection, and forms integration for library changes.

### 11. Accessibility

- Follow WCAG guidelines and Angular accessibility best practices.
- Use proper ARIA attributes and semantic HTML.
- Keyboard navigation and screen-reader support are core to ng-select—regressions are high severity.
- ESLint enables `angular.configs.templateAccessibility` for templates.

### 12. Documentation and Comments

- Comment public APIs, inputs, and outputs.
- Follow the Angular style guide for structure and naming.
- Use JSDoc for complex functions and services.
- Document new component inputs, outputs, and lifecycle behavior in README when user-facing.

### 13. No Deprecated APIs

- Do not introduce deprecated Angular APIs, patterns, or features.
- Check [update.angular.io](https://update.angular.io/) for breaking changes when upgrading.

### 14. Package Manager

- Always use **pnpm** for installs and scripts.

### Code Generation Checklist

When generating Angular code:

- Use the latest Angular syntax and patterns.
- Include proper TypeScript typing.
- Use signals for state management.
- Implement proper error handling where applicable.
- Follow Angular style guide conventions.
- Include accessibility considerations.
- Update or extend existing tests when behavior changes.

---

## Angular 22 Library Conventions

This project targets **Angular 22** with a signal-first component architecture in the core library. Follow what nearby code already does.

### Change detection and reactivity

- `NgSelectComponent` uses `ChangeDetectionStrategy.OnPush`.
- Consumers must replace `items` arrays rather than mutating them in place (see README _Change Detection_ section).
- Internal state uses `signal`, `computed`, `linkedSignal`, and `effect` where appropriate.

### Input/output pattern in `NgSelectComponent`

The main component uses a backward-compatible input pattern:

```typescript
readonly _placeholder = input<string>(this.config.placeholder, { alias: 'placeholder' });
readonly placeholder = linkedSignal(() => this._placeholder());
```

When adding new inputs to `NgSelectComponent`, follow this `_name` + `alias` + `linkedSignal` pattern so existing template bindings and programmatic access keep working.

### Components and modules

- `NgSelectComponent`, `NgOptionComponent`, `NgDropdownPanelComponent`, and template directives are **standalone**.
- `NgSelectModule` re-exports them and provides `SELECTION_MODEL_FACTORY` via `provideNgSelect()` for legacy consumers.
- **DO NOT** create new NgModules for library features.
- Selector conventions (enforced by ESLint): element `ng-*` (kebab-case), attribute directives `ng*` (camelCase).

### Templates

- Prefer Angular control flow (`@for`, `@if`, `@switch`) in demo examples and new template code.
- Library templates use content projection and `ng-template` directives (`ng-option-tmp`, `ng-label-tmp`, etc.)—preserve these APIs.

### Forms integration

- `NgSelectComponent` implements `ControlValueAccessor` via `NG_VALUE_ACCESSOR`.
- Demo examples show both template-driven (`ngModel`) and reactive forms usage.
- Preserve `readonly`, `disabled`, and validation CSS class behavior (`ng-invalid`, `ng-touched`).

### Selection model

- Default selection logic lives in `selection-model.ts`.
- Consumers can override via `SELECTION_MODEL_FACTORY` injection token.
- **DO NOT** change default selection semantics without tests covering single and multiple modes.

### Dropdown positioning

- `NgDropdownPanelService` handles positioning, scrolling, and virtual scroll.
- `appendTo` and `popover` are alternative strategies for overflow/stacking issues—preserve both.

---

## Themes and Styling

- Source themes: `src/ng-select/themes/*.theme.scss`
- Built CSS: `dist/ng-select/themes/*.theme.css` (via `pnpm run build:themes`)
- SCSS copies: `dist/ng-select/scss/` (via `pnpm run copy-sass`)
- `ViewEncapsulation.None` on the main component—styles are global; theme class names are part of the public styling contract.
- Demo supports `default`, `ant`, and `material` theme switching via `AppComponent`.

When changing styles, verify all three themes and check validation-state styling documented in README.

---

## Testing Expectations

- **DO NOT** add new unit tests unless explicitly requested or needed to cover changed behavior.
- **SHOULD** update existing specs when modifying behavior already covered by tests.
- Test stack: **Vitest** + **jsdom** + `zone.js/testing`.
- Main spec: `src/ng-select/lib/ng-select.component.spec.ts` (extensive coverage—follow its patterns).
- Helpers: `src/ng-select/testing/helpers.ts`, mocks in `src/ng-select/testing/mocks.ts`.
- Use `fakeAsync`, `tick`, `tickAndDetectChanges`, and `selectOption` helpers for keyboard/dropdown interactions.
- CI runs `pnpm test:ci` (headless Chrome) and reports coverage to Coveralls.
- Code coverage excludes: `testing/*`, barrel files, `console.service.ts`, `search-helper.ts`, `ng-templates.directive.ts`.

For substantial library changes:

- Run `pnpm lint`, `pnpm test` (or `pnpm test:ci`), and `pnpm build` when practical.
- Add a demo example when the change is user-visible.

---

## Release and CI

### CI (`.github/workflows/ci.yml`)

On push/PR affecting `*.ts`, `*.html`, `*.scss`:

1. `pnpm install`
2. `pnpm lint`
3. `pnpm test:ci`
4. `pnpm build:demo`
5. Coveralls upload

### Release (`.github/workflows/release.yml`)

On push to `master`:

1. `pnpm build` (libraries + themes)
2. `semantic-release` publishes `@ng-select/ng-select` from `dist/ng-select`
3. Version-synced publish of `@ng-select/ng-option-highlight`
4. `pnpm build:demo` and deploy to `gh-pages`

Commits must follow Conventional Commits for semantic-release to work.

---

## Accessibility

- Keyboard navigation (arrows, Enter, Escape, Tab, Backspace) is core functionality—regressions are high severity.
- ARIA labels (`ariaLabel`, `ariaLabelDropdown`, `labelForId`) support screen readers.
- Template accessibility rules are enabled in ESLint (`angular.configs.templateAccessibility`).
- Test keyboard flows in specs when changing dropdown or focus behavior.

---

## Special Considerations

- **Backward compatibility** is the highest priority for library API, DOM structure, and CSS hooks.
- **Virtual scroll** and **infinite scroll** interact with `ItemsList` and scroll events—test with large datasets.
- **Typeahead** uses RxJS `Subject`—preserve debounce and min-term-length behavior.
- **patch-package** runs on `postinstall`/`prepare`—do not remove without checking for patches.
- Path aliases in `tsconfig.json` map `@ng-select/ng-select` and `@ng-select/ng-option-highlight` to source for local development.

---

## Definition of Done

For substantial code changes:

- Run lint, tests, and build when practical.
- Report any checks that were skipped or failed.
- Summarize changed files and behavior.
- Call out public API, accessibility, theming, or test coverage impacts when relevant.
- Update README or demo examples if user-facing behavior or API changed.

---

## Useful References

- `README.md` — installation, API tables, change detection, custom styles
- `package.json` — scripts and dependency versions
- `angular.json` — project definitions
- `src/ng-select/public-api.ts` — exported library surface
- `src/ng-select/lib/ng-select.component.ts` — main component implementation
- `src/ng-select/lib/ng-select.component.spec.ts` — behavioral test reference
- `src/demo/app/examples/` — interactive examples
- `src/ng-option-highlight/README.md` — highlight directive usage

---

## IDE and Editor Setup (optional)

These tips are **not** a second source of truth; they only help humans and assistants working inside an IDE.

### JetBrains (WebStorm, IntelliJ, etc.)

- In **Settings → Languages & Frameworks → Node.js**, prefer **pnpm** for installs/scripts.
- Enable the **Angular** plugin for standalone components, templates, and library paths.
- Wire **ESLint** to `eslint.config.js`. Formatting: `pnpm exec prettier --write .`
- Create run configurations from `package.json` for `start`, `build`, `test`, `lint`.

### VS Code / Cursor

- Use workspace ESLint settings; run `pnpm lint` before commit.
- Run `pnpm exec prettier --check .` for formatting verification.

---

## Wrapper Files (do not duplicate content)

| Location                                                               | Purpose                                                          |
| ---------------------------------------------------------------------- | ---------------------------------------------------------------- |
| [`.cursor/rules/rules.mdc`](./.cursor/rules/rules.mdc)                 | Cursor always-applied rule: short pointer + critical constraints |
| [`.github/copilot-instructions.md`](./.github/copilot-instructions.md) | GitHub Copilot: pointer to this file                             |

When editing agent instructions, update **`AGENTS.md` first**, then adjust wrapper files to point here.
