# Zoneless Change Detection Support Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Officially support zoneless change detection (#2570) with zoneless as the repo's default posture (default test lane, demo, StackBlitz examples) while a dedicated zone.js test lane guarantees zone-based apps keep working unchanged.

**Architecture:** Library runtime code does not change (audit found zero zoneless-breaking patterns) — only comments and a lint guard are added to source. The work is test-infrastructure: normalize 22 zone-timing-dependent spec call sites, flip the default Vitest lane to a zoneless TestBed via angular.json polyfills, add a `test-zone` lane preserving today's zone-based run byte-for-byte, and flip the demo + StackBlitz generator to zoneless as permanent dogfood.

**Tech Stack:** Angular 22, `@angular/build:unit-test` (Vitest browser mode, Chromium via Playwright), pnpm, ESLint flat config, semantic-release.

## Global Constraints

- Package manager: **pnpm only** (`pnpm run …`); never npm/yarn.
- No public API, DOM structure, CSS class, keyboard/ARIA, or CD-timing changes to either published library.
- Keep every `runOutsideAngular` / `zone.run` / `markForCheck` / `detectChanges` call in library source.
- `zone.js` must NOT be added to either library's `dependencies`/`peerDependencies` (currently absent — keep it that way).
- Conventional Commits (required by semantic-release); library changes here are `feat`/`test`/`docs`/`build` scoped, no breaking-change markers.
- Working branch: `fix` (spec already committed there as 983587b4).
- The zone lane (`test:zone`) must remain byte-identical to today's test behavior: polyfills `["zone.js", "zone.js/testing", "zone.js/plugins/vitest-patch"]`.

---

### Task 1: Normalize the 22 direct `await fixture.whenStable()` spec call sites

Under zone.js, `fixture.whenStable()` drains zone-tracked macrotasks; under zoneless it only awaits the render scheduler. The repo already has the dual-mode helper `tickAndDetectChanges` (`src/ng-select/testing/helpers.ts:14-19`: detectChanges → whenStable → flushAsync (microtask + one macrotask hop) → detectChanges), used 434 times. This task funnels the 22 stragglers through it **before** any zoneless lane exists, gated by the current zone suite, proving behavior-neutrality.

**Files:**
- Modify: `src/ng-select/lib/ng-select.component.spec.ts` (lines ~1879, 1912, 1950, 1985, 3317, 3338, 3354, 3393, 3416, 3441, 3473, 3499, 3537, 3684, 3694, 4185, 4464, 4486, 5836, 5860, 5888, 5912)

**Interfaces:**
- Consumes: `tickAndDetectChanges(fixture)` from `src/ng-select/testing/helpers.ts` (already imported in this spec).
- Produces: a spec file with zero direct `await fixture.whenStable()` calls (verifiable via grep), green under the current zone-based suite.

- [ ] **Step 1: Baseline — run the current zone-based suite**

Run: `pnpm run test:ci`
Expected: PASS (all tests green). If not green, STOP — fix the pre-existing failure first or report it.

- [ ] **Step 2: Replace each call site**

Mechanical rule, applied to each of the 22 sites (find them with `grep -n "await fixture.whenStable()" src/ng-select/lib/ng-select.component.spec.ts`):

1. Replace the line `await fixture.whenStable();` with `await tickAndDetectChanges(fixture);`
2. If the immediately preceding non-blank statement is a bare `fixture.detectChanges();`, delete that preceding line (tickAndDetectChanges starts with detectChanges).
3. Preserve any trailing comment by moving it to the new line, e.g. line 3684:

```ts
// Before
fixture.detectChanges();
await fixture.whenStable(); // Flush pending effects

// After
await tickAndDetectChanges(fixture); // Flush pending effects
```

```ts
// Before (site pattern like line 1912 — follows a tickAndDetectChanges, no preceding detectChanges)
await tickAndDetectChanges(fixture);

await fixture.whenStable();
expect(outsideClick).not.toHaveBeenCalled();

// After
await tickAndDetectChanges(fixture);

await tickAndDetectChanges(fixture);
expect(outsideClick).not.toHaveBeenCalled();
```

- [ ] **Step 3: Verify zero direct call sites remain**

Run: `grep -c "await fixture.whenStable()" src/ng-select/lib/ng-select.component.spec.ts`
Expected: `0`

- [ ] **Step 4: Run the zone suite again**

Run: `pnpm run test:ci`
Expected: PASS, same test count as Step 1. If a specific test fails from the extra leading `detectChanges` (e.g. a spy call-count assertion), revert ONLY that site to `await fixture.whenStable(); await flushAsync(); fixture.detectChanges();` (import `flushAsync` from `../testing/helpers` if needed) and re-run.

- [ ] **Step 5: Commit**

```bash
git add src/ng-select/lib/ng-select.component.spec.ts
git commit -m "test: normalize direct whenStable() waits to tickAndDetectChanges helper"
```

---

### Task 2: Flip the default test lane to zoneless; add the `test-zone` compatibility lane

The Angular 22 unit-test builder decides zone strategy from the `test-build` target's `polyfills` (verified in `@angular/build/src/builders/unit-test/runners/vitest/build-options.js`: `zone.js/testing` present → zone TestBed with `provideZoneChangeDetection()`; empty polyfills → generated init skips `zone.js/testing` behind `typeof Zone !== 'undefined'` and omits the zone provider → genuinely zoneless TestBed, since zoneless is the framework default when zone.js is absent).

**Files:**
- Modify: `angular.json` (ng-select `test-build`/`test` at lines 23-45, ng-option-highlight `test-build`/`test` at lines 147-162)
- Modify: `package.json` (scripts block)

**Interfaces:**
- Consumes: existing `test-build` / `test` architect targets and `vitest.config.ts` (shared; needs no change — zone choice lives entirely in the buildTarget polyfills).
- Produces: `pnpm test` / `ng test ng-select` = zoneless lane; `pnpm run test:zone` = today's zone lane; `pnpm run test:ci` runs both. Later tasks and CI rely on these exact script names.

- [ ] **Step 1: Edit angular.json — ng-select project**

Replace the `test-build` target (lines 23-29) with:

```json
"test-build": {
	"builder": "@angular/build:application",
	"options": {
		"tsConfig": "src/ng-select/tsconfig.spec.json",
		"polyfills": []
	},
	"configurations": {
		"zone": {
			"polyfills": ["zone.js", "zone.js/testing", "zone.js/plugins/vitest-patch"]
		}
	}
},
```

Then add a `test-zone` target directly after the existing `test` target (after line 45):

```json
"test-zone": {
	"builder": "@angular/build:unit-test",
	"options": {
		"buildTarget": "ng-select:test-build:zone",
		"runnerConfig": "vitest.config.ts",
		"coverage": false
	}
},
```

(`coverage: false` so the zone lane never clobbers `coverage/ng-select/lcov.info` used by coveralls.)

- [ ] **Step 2: Edit angular.json — ng-option-highlight project**

Same shape: `test-build` gets `"polyfills": []` plus the identical `"zone"` configuration; add:

```json
"test-zone": {
	"builder": "@angular/build:unit-test",
	"options": {
		"buildTarget": "ng-option-highlight:test-build:zone",
		"runnerConfig": "vitest.config.ts",
		"coverage": false
	}
},
```

- [ ] **Step 3: Edit package.json scripts**

```json
"test:watch": "ng test ng-select --watch",
"test": "ng test ng-select --coverage && ng test ng-option-highlight --coverage",
"test:zone": "ng run ng-select:test-zone && ng run ng-option-highlight:test-zone",
"test:ci": "ng test ng-select --watch=false --coverage && ng test ng-option-highlight --watch=false --coverage && ng run ng-select:test-zone --watch=false && ng run ng-option-highlight:test-zone --watch=false",
```

(`test`/`test:watch` command text is unchanged — they simply now run zoneless because the default `test-build` has no zone polyfills.)

- [ ] **Step 4: Prove the zone lane is byte-identical to the old default**

Run: `pnpm run test:zone`
Expected: PASS with the same test counts as Task 1 Step 4 (this is the exact old configuration, reached via the `zone` build configuration).

- [ ] **Step 5: Run the new zoneless default lane**

Run: `pnpm test`
Expected: mostly PASS. Record every failure verbatim — each is either (a) a test still assuming zone timing, or (b) a real library zoneless bug. Do NOT silence failures with extra `fixture.detectChanges()` sprinkles (that masks missing-notification bugs); fix tests via `tickAndDetectChanges`/`flushAsync`, and fix library bugs at the mutation site with `markForCheck()`/signal writes (ng-bootstrap's equivalent bug was a one-line `markForCheck` in a programmatic `open()`). A zoneless-TestBed `ExpressionChangedAfterItHasBeenChecked` error is a real library bug — investigate, don't suppress.

- [ ] **Step 6: Iterate until both lanes are green**

Run: `pnpm test && pnpm run test:zone`
Expected: PASS and PASS. Any library-source fix made here must also pass the zone lane (it will — `markForCheck` is mode-neutral).

- [ ] **Step 7: Commit**

```bash
git add angular.json package.json src/ng-select src/ng-option-highlight
git commit -m "feat: run unit tests zoneless by default with a zone.js compatibility lane (#2570)"
```

(If Step 5 surfaced library fixes, mention them in the commit body, one line each.)

---

### Task 3: Flip the demo app to zoneless (permanent dogfood canary)

On Angular 22, bootstrapping with no zone.js loaded and no zone provider is zoneless by default — `src/demo/main.ts` needs no change. Also removes the vestigial `src/demo/polyfills.ts` (referenced only by tsconfig `files`, never bundled — a trap for future edits).

**Files:**
- Modify: `angular.json:91` (demo build `polyfills`)
- Delete: `src/demo/polyfills.ts`
- Modify: `src/demo/tsconfig.app.json:7`

**Interfaces:**
- Consumes: nothing from earlier tasks (independent of Tasks 1-2).
- Produces: a zoneless demo at `http://localhost:4200`; the repo's `verify` skill (demo smoke flow) is the acceptance gate.

- [ ] **Step 1: Remove zone.js from the demo build**

In `angular.json` demo build options change line 91:

```json
"polyfills": [],
```

- [ ] **Step 2: Delete the vestigial polyfills file**

```bash
git rm src/demo/polyfills.ts
```

In `src/demo/tsconfig.app.json` change line 7:

```json
"files": ["main.ts"],
```

- [ ] **Step 3: Verify the demo runs zoneless**

Start the demo dev server (use the repo `verify` skill / launch config; `pnpm start` equivalent) and smoke-test in the browser:
1. Console shows no `NG0908` (zone.js missing) and no errors on load.
2. Open a basic select example — dropdown opens on click, options render, selection updates the model, dropdown closes on outside click.
3. Search/typeahead example — typing filters/loads options.
4. Virtual scroll example — scrolling the panel renders new option ranges.
5. `appendTo` example — panel positions correctly.
6. Keyboard: ArrowDown/Enter selects; Esc closes.
7. Confirm zoneless is actually active: run `typeof Zone` in the browser console → `"undefined"`.

Expected: all pass with no console errors. Any breakage here is a real library zoneless bug — fix at the mutation site (`markForCheck()`/signal write), re-run `pnpm test && pnpm run test:zone`, and note the fix in the Task 3 commit body.

- [ ] **Step 4: Build the demo for production**

Run: `pnpm run build:demo`
Expected: succeeds within existing budgets (bundle shrinks — zone.js drops out).

- [ ] **Step 5: Commit**

```bash
git add angular.json src/demo/tsconfig.app.json
git commit -m "feat(demo): run the demo app zoneless as a permanent canary (#2570)"
```

---

### Task 4: Source guardrails — invariant comments and MockNgZone removal

No behavior changes. Protects the load-bearing calls the audit identified from future "cleanup" regressions, and removes the unused zone mock so zone-mocking cannot creep back into tests.

**Files:**
- Modify: `src/ng-select/lib/ng-select.component.ts` (~lines 1035, 1090)
- Modify: `src/ng-select/lib/ng-dropdown-panel.component.ts` (~lines 371, 388)
- Modify: `src/ng-select/testing/mocks.ts` (delete `MockNgZone`, keep `MockConsole`)

**Interfaces:**
- Consumes: nothing.
- Produces: nothing new — comments only; `MockNgZone` ceases to exist (grep confirms no spec imports it).

- [ ] **Step 1: Add invariant comments**

In `src/ng-select/lib/ng-select.component.ts`, above the `this._cd.markForCheck();` inside the `_keyPress$` subscription (~line 1035):

```ts
// Required under zoneless CD: this subscription fires from a debounce timer,
// which schedules nothing by itself
```

Above `this._cd.markForCheck();` at the end of `_updateNgModel()` (~line 1090):

```ts
// Required under zoneless CD: sole notifier for programmatic selection APIs
// (select/unselect/clearModel/clearItem) called from non-Angular contexts
```

In `src/ng-select/lib/ng-dropdown-panel.component.ts`, above the `this._zone.run(...)` emit block in `_renderItemsRange` (~line 371):

```ts
// These outputs must stay template-bound in ng-select.component.html: the
// template listener wrapper is what schedules CD under zoneless (zone.run
// is a no-op there). A programmatic subscribe would need markForCheck.
```

Above `this.update.emit([first]);` in `_measureDimensions` (~line 388):

```ts
// Relies on synchronous template execution: the emitted item renders in the
// same CD pass (parent listener runs mid-pass, @for sits later in the
// template), so the microtask below measures real DOM in zone and zoneless
```

- [ ] **Step 2: Delete MockNgZone**

In `src/ng-select/testing/mocks.ts`, delete the `MockNgZone` class and its `NgZone` import; keep `MockConsole`.

- [ ] **Step 3: Verify**

Run: `grep -rn "MockNgZone" src && pnpm run lint`
Expected: grep finds nothing (exit 1); lint passes.

Run: `pnpm test`
Expected: PASS (comments don't change behavior; proves mocks.ts still compiles).

- [ ] **Step 4: Commit**

```bash
git add src/ng-select/lib/ng-select.component.ts src/ng-select/lib/ng-dropdown-panel.component.ts src/ng-select/testing/mocks.ts
git commit -m "test: document zoneless-load-bearing CD calls and drop unused MockNgZone"
```

---

### Task 5: ESLint ban on zone-stability APIs

The only NgZone APIs incompatible with zoneless are `onStable`, `onMicrotaskEmpty`, `onUnstable`, `isStable` (they never emit / are always true). The library uses none today; this rule keeps it that way (same idea as angular/components' `no-zone-dependencies` rule).

**Files:**
- Modify: `eslint.config.js` (append a config block to the `defineConfig([...])` array)

**Interfaces:**
- Consumes: existing flat-config array in `eslint.config.js`.
- Produces: `pnpm run lint` fails on any `.onStable`/`.onMicrotaskEmpty`/`.onUnstable`/`.isStable` member access in library source.

- [ ] **Step 1: Add the config block**

Append to the `defineConfig([...])` array in `eslint.config.js` (after the last existing block):

```js
{
	files: ['src/ng-select/**/*.ts', 'src/ng-option-highlight/**/*.ts'],
	ignores: ['**/*.spec.ts', 'src/ng-select/testing/**'],
	rules: {
		'no-restricted-syntax': [
			'error',
			{
				selector:
					"MemberExpression[property.name='onStable'], MemberExpression[property.name='onMicrotaskEmpty'], MemberExpression[property.name='onUnstable'], MemberExpression[property.name='isStable']",
				message:
					'Zone-stability APIs never fire under zoneless change detection. Use afterNextRender/afterEveryRender instead (see docs/superpowers/specs/2026-07-19-zoneless-support-design.md).',
			},
		],
	},
},
```

- [ ] **Step 2: Verify the rule catches violations**

Temporarily add `const x = (this as any)._zone.isStable;` inside any method of `src/ng-select/lib/ng-dropdown-panel.component.ts`, run `pnpm run lint`, expect FAIL with the message above. Remove the line.

- [ ] **Step 3: Verify clean lint**

Run: `pnpm run lint`
Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add eslint.config.js
git commit -m "build: lint-ban zone-stability APIs in library source"
```

---

### Task 6: Zoneless StackBlitz example generator

Generated examples currently pin `zone.js ^0.12.0` (Angular 14-era) with a zone polyfills template. Minimal zoneless conversion — no template modernization (the NgModule scaffold stays; `provideZonelessChangeDetection` works in NgModule providers).

**Files:**
- Modify: `src/demo/app/shared/example-viewer/stackblitz-button/stackblitz.service.ts:8,26`
- Modify: `src/demo/assets/stackblitz/app.module.ts`
- Modify: `src/demo/assets/stackblitz/main.ts:1`
- Modify: `src/demo/assets/stackblitz/angular.json` (polyfills entry)
- Delete: `src/demo/assets/stackblitz/polyfills.ts`

**Interfaces:**
- Consumes: nothing from earlier tasks.
- Produces: generated StackBlitz projects with no zone.js dependency and zoneless bootstrap.

- [ ] **Step 1: Edit the service**

In `stackblitz.service.ts` line 8 remove `'polyfills.ts'` from `TEMPLATE_FILES`:

```ts
const TEMPLATE_FILES = ['index.html', 'styles.css', 'data.service.ts', 'main.ts', 'app.module.ts', 'angular.json'];
```

Line 26: delete the `'zone.js': '^0.12.0',` entry from `dependencies`.

- [ ] **Step 2: Edit the template files**

`src/demo/assets/stackblitz/app.module.ts` — add the zoneless provider:

```ts
import { Component, NgModule, provideZonelessChangeDetection } from '@angular/core';
```

```ts
	providers: [provideZonelessChangeDetection(), provideHttpClient(withFetch())],
```

`src/demo/assets/stackblitz/main.ts` — delete line 1 (`import './polyfills';`).

`src/demo/assets/stackblitz/angular.json` — remove the `"polyfills": "polyfills.ts",` line from build options.

```bash
git rm src/demo/assets/stackblitz/polyfills.ts
```

- [ ] **Step 3: Verify**

Run: `pnpm run build:demo`
Expected: succeeds (template assets are copied verbatim; the service compiles). Full StackBlitz runtime verification is manual/best-effort — note in the commit body that the generated scaffold was smoke-checked only by build.

- [ ] **Step 4: Commit**

```bash
git add src/demo/app/shared/example-viewer/stackblitz-button/stackblitz.service.ts src/demo/assets/stackblitz
git commit -m "feat(demo): generate zoneless StackBlitz examples"
```

---

### Task 7: README documentation

**Files:**
- Modify: `README.md` (add a section after the Versions table)

**Interfaces:**
- Consumes: shipped behavior from Tasks 2-3 (both lanes green, demo zoneless).
- Produces: the public compatibility statement for #2570.

- [ ] **Step 1: Add the section**

Insert after the Versions/compatibility table in `README.md`:

```markdown
## Zoneless change detection

`@ng-select/ng-select` and `@ng-select/ng-option-highlight` fully support
[zoneless change detection](https://angular.dev/guide/zoneless) — the default for new
Angular apps since v21. No setup is required: the libraries do not depend on `zone.js`
(it is not in their dependency graphs) and work identically whether your app is zoneless
or still uses `zone.js`. Both modes are covered by the unit-test suite in CI, and the
[demo site](https://ng-select.github.io/ng-select) runs zoneless.
```

- [ ] **Step 2: Verify formatting**

Run: `pnpm run format:check`
Expected: PASS (run `pnpm run format` first if it flags README.md).

- [ ] **Step 3: Commit**

```bash
git add README.md
git commit -m "docs: document zoneless change detection support (#2570)"
```

---

### Task 8: Final verification sweep

**Files:** none (verification only).

**Interfaces:**
- Consumes: everything above.
- Produces: the evidence block for the PR description / issue #2570 update.

- [ ] **Step 1: Full pipeline**

Run: `pnpm run lint && pnpm run test:ci && pnpm run build && pnpm run build:demo`
Expected: every stage passes; `test:ci` shows the zoneless lane AND the zone lane both green for both libraries.

- [ ] **Step 2: Confirm packaging unchanged**

Run: `grep -n "zone" src/ng-select/package.json src/ng-option-highlight/package.json dist/ng-select/package.json 2>/dev/null`
Expected: no matches — zone.js still absent from published dependency graphs.

- [ ] **Step 3: Wrap up**

Use superpowers:finishing-a-development-branch. Summarize: what changed, both-lane test evidence, demo verification, and the suggested #2570 comment text (posting the comment itself needs the maintainer's go-ahead).
