---
name: verify
description: Use when verifying an ng-select change at runtime — launching the demo app, driving a component behavior in the browser, or running the repo's test/lint/build pipeline before claiming a change works.
---

# Verifying ng-select changes

## Launch the demo app

Use the Browser pane, never Bash: `preview_start {name: "demo"}` (config in `.claude/launch.json`, pnpm ng serve). If port 4300 is taken by another session, `autoPort: true` lets it pick a free port.

Demo routes are hash-based: `http://localhost:<port>/#/forms`, `#/data-sources`, etc. (see `src/demo/app/routes.ts`).

## Drive component behaviors

- Theme switcher and LTR/RTL toggle are dropdowns in the demo header. Material theme is required for `appearance="outline"` / `appearance="fill"` styling.
- Outline-appearance selects live on `#/forms` ("Reactive form using ng-option" example).
- To test on a non-white background: `javascript_tool` → `document.body.style.background = '#263238'` and clear card backgrounds.

## Gotchas

- **Theme resets to `default` on full page reload** (component state, not persisted) — re-select Material after any force reload before judging appearance styles.
- **Opening a select programmatically:** dispatch `keydown` Space on the `ng-select` host element (`new KeyboardEvent('keydown', {keyCode: 32, ...})`). Synthetic `mousedown` on the container is unreliable, and coordinate clicks fight scroll jumps.

- **Demo RTL does not exercise theme RTL rules.** The demo nests themes under `:host.<x>-theme ::ng-deep` (app.component.scss) and puts `dir` on an inner div, so the themes' `@include rtl` rules (`[dir='rtl'] …` at root) never match in the demo. To verify RTL as real consumers see it, set `document.documentElement.dir = 'rtl'` via javascript_tool.
- Unit tests run in real Chromium (Vitest + browser-playwright), not jsdom — layout measurement (`offsetWidth` etc.) works in specs.

## Pipeline (Definition of Done, AGENTS.md)

```bash
pnpm lint
pnpm exec ng test ng-select --watch=false
pnpm run build
pnpm exec prettier --check <changed files>
```
