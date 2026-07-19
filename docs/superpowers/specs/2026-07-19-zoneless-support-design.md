# Zoneless change detection support — design

**Issue:** [#2570 — Add zoneless change detection support](https://github.com/ng-select/ng-select/issues/2570)
**Date:** 2026-07-19
**Decision:** Go fully zoneless-first across the repository, while guaranteeing zone.js
applications keep working unchanged.

## Goal

Officially support `provideZonelessChangeDetection()` (stable since Angular 20.2, the
default for new apps since Angular 21) in `@ng-select/ng-select` and
`@ng-select/ng-option-highlight`, with **zero breaking changes** for existing zone.js
applications: no public API, DOM structure, CSS class, keyboard/ARIA, or change-detection
timing changes.

## Audit conclusion (why no runtime rewrite is needed)

A full audit of the library found **no zoneless-breaking patterns**:

- Every user interaction enters through template or host bindings
  (`ng-select.component.html`, `@HostListener('keydown')`). Angular's listener wrapper
  marks views dirty and notifies the zoneless scheduler in both modes.
- `ng-dropdown-panel.component.ts` registers its manual listeners (panel scroll,
  document outside-click/scroll, dropdown mousedown, ResizeObserver) outside Angular and
  either performs pure DOM writes or re-enters via `zone.run(() => output.emit(...))`.
  All four outputs (`update`, `scroll`, `scrollToEnd`, `outsideClick`) are template-bound
  in the parent, so the emits schedule CD even when `zone.run` is a no-op under zoneless.
- The only async paths in `ng-select.component.ts` (the `debounceTime(200)` keypress
  pipeline and the async `addTag` promise) terminate in `ChangeDetectorRef.markForCheck()`.
  `writeValue`, `setDisabledState`, and `_updateNgModel` call it explicitly.
- The synchronous `detectChanges()` calls in `open()`/`close()`/`_onSelectionChanged()`
  are zone-independent and preserve identical timing in both modes (issue #2765 behavior).
- Zero uses of the only zoneless-incompatible NgZone APIs (`onStable`,
  `onMicrotaskEmpty`, `onUnstable`, `isStable`) anywhere in library code.
- Support classes are pure synchronous state (`ItemsList`, `DefaultSelectionModel`,
  `NgDropdownPanelService`) or already signal-driven (`NgOptionComponent` via
  `afterEveryRender`, `NgItemLabelDirective` via `effect`, `NgOptionHighlightDirective`
  via `afterNextRender`).
- `zone.js` is not a dependency or peer dependency of either published package.

Therefore: **library runtime code does not change** (comments and lint guards only).

## Design

### 1. Library runtime — no behavior changes

- Keep every `runOutsideAngular` / `zone.run` wrapper. Angular's zoneless guide states
  removing them regresses performance for zone.js consumers; they are no-ops under
  zoneless. (Angular CDK still uses them.)
- Keep every `markForCheck()` / `detectChanges()`.
- Add short comments at load-bearing call sites so they are not removed as "redundant":
  `_updateNgModel()` markForCheck, keypress-pipeline markForCheck, `open()`/`close()`
  detectChanges, and the template-bound-output invariant on the dropdown panel's
  `_renderItemsRange` emits.

### 2. Tests — zoneless is the default lane, zone.js is the compatibility lane

- Normalize the 22 direct `await fixture.whenStable()` call sites in
  `ng-select.component.spec.ts` to the existing `tickAndDetectChanges` helper.
  Semantics are identical under zone.js; deterministic under zoneless (whenStable does
  not drain component-scheduled macrotasks without a zone).
- angular.json, for both `test-build` targets (`ng-select`, `ng-option-highlight`):
  - Default `polyfills` becomes `[]` → the Angular 22 unit-test builder then generates a
    TestBed with no `zone.js/testing` import and no `provideZoneChangeDetection()`
    (verified in `@angular/build` source) — a genuinely zoneless TestBed.
  - New `zone` configuration restores
    `["zone.js", "zone.js/testing", "zone.js/plugins/vitest-patch"]`.
  - New `test-zone` architect target pointing at `test-build:zone`, reusing the same
    `vitest.config.ts` (no second Vitest project).
- Scripts: `pnpm test` runs zoneless (matches Angular 21+ defaults);
  `pnpm test:zone` runs the zone lane; `pnpm test:ci` runs **both**. The zone lane is
  the permanent regression gate for zone.js applications.
- Fix any real bugs the zoneless lane surfaces (zoneless TestBed throws on unnotified
  binding changes — treat those as library bugs, expected ng-bootstrap-scale one-liners).
- Delete unused `MockNgZone` from `src/ng-select/testing/mocks.ts` so zone mocking
  cannot come back.

### 3. Demo — fully zoneless (permanent dogfood canary)

- Remove `"zone.js"` from the demo build `polyfills` in angular.json. On Angular 22,
  bootstrapping without zone.js and without zone providers is zoneless by default;
  `src/demo/main.ts` needs no change. (ng-bootstrap has run its demo zoneless since
  v17.0.1 and caught real bugs that way.)
- Delete vestigial `src/demo/polyfills.ts` and its `tsconfig.app.json` reference — it is
  type-checked but never bundled, so editing it is a trap. (The demo already runs
  without `@angular/localize/init` being bundled, so nothing is lost.)

### 4. StackBlitz example generator — zoneless examples

- Generated examples currently pin `zone.js ^0.12.0` (Angular 14-era) and include a
  zone.js polyfills template. Switch generated examples to zoneless: drop the zone.js
  dependency and the polyfills template. Bug reporters who need a zone repro can add
  zone.js back in one line.

### 5. Guardrails

- ESLint `no-restricted-syntax`/`no-restricted-properties` rule banning
  `NgZone.onStable`, `onMicrotaskEmpty`, `onUnstable`, and `isStable` in library source
  (same idea as angular/components' `no-zone-dependencies` rule).

### 6. Documentation and release

- README: add a "Zoneless change detection" section — supported out of the box; zone.js
  is not a dependency of the library; both modes are CI-tested.
- Post the plan/outcome on issue #2570.
- Ships as `feat:` in a minor release of v15 — no breaking changes.

## Compatibility guarantees for zone.js applications

1. No runtime code changes — no CD strategy, timing, or API changes.
2. The zone-based test suite keeps running in CI (`test:zone`) exactly as today,
   gating every future PR.
3. `zone.js` remains outside the published packages' dependency graphs (unchanged).

## Out of scope

- Converting remaining plain template-read fields (`viewPortItems`, `escapeHTML`,
  `ItemsList` internals) to signals — no compatibility gain, churns hot paths, and
  would risk changing the synchronous-render timing that #2765 depends on. Possible
  incremental follow-ups, not part of #2570.
- Live-updating `NgSelectConfig` via signals (behavior change).
- The pre-existing stale-label edge in `NgOptionHighlightDirective` (identical in both
  modes).

## Test plan

1. Zone lane green before and after the 22 whenStable normalizations (proves the
   normalization is behavior-neutral under zone.js).
2. Zoneless lane green for both libraries.
3. Demo builds and runs zoneless; manual smoke of dropdown open/close, typeahead,
   virtual scroll, appendTo positioning, outside click, keyboard nav.
4. `pnpm run lint` passes with the new zone-API ban.
