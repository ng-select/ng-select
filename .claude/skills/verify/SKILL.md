---
name: verify
description: Use when verifying an ng-select change at runtime — launching the docs site, driving a component behavior in the browser, or running the repo's test/lint/build pipeline before claiming a change works.
---

# Verifying ng-select changes

## Launch the docs site

Use the Browser pane, never Bash: `preview_start {name: "docs"}` (config in `.claude/launch.json`, `astro dev --root website`). If port 4300 is taken by another session, `autoPort: true` lets it pick a free port.

The site is served under the `/ng-select` base, also locally: `http://localhost:<port>/ng-select/examples/forms/`, `/ng-select/examples/data-sources/`, etc. Pages are `website/src/content/docs/**/*.mdx`; each `<Demo example="<folder>" />` mounts `src/demo/app/examples/<folder>/` as an Angular island (`website/src/angular/demo-host.component.ts`), lazily and only in the browser.

## Drive component behaviors

- The ng-select theme switcher (Default/Material/Ant Design) is a dropdown in the site header next to the dark-mode toggle; it persists to `sessionStorage` (`ng-select-theme`) and reloads the page. Material theme is required for `appearance="outline"` / `appearance="fill"` styling.
- When changing styles, verify all three themes (`default`, `material`, `ant`) via the switcher — theme class names are part of the public styling contract (AGENTS.md).
- Outline-appearance selects live on `/ng-select/examples/material/`.
- To test on a non-white background: `javascript_tool` → `document.body.style.background = '#263238'` and clear card backgrounds.

## Gotchas

- **Each demo is its own Angular app** (Astro island). `NgSelectConfig` defaults (placeholder, material `appearance`) come from `DEMO_PROVIDERS` in `demo-host.component.ts`, not from a shared root injector.
- **Opening a select programmatically:** dispatch `keydown` Space on the `ng-select` host element (`new KeyboardEvent('keydown', {keyCode: 32, ...})`). Synthetic `mousedown` on the container is unreliable, and coordinate clicks fight scroll jumps.
- **RTL:** there is no RTL toggle in the site; set `document.documentElement.dir = 'rtl'` via javascript_tool to exercise the themes' `[dir='rtl']` rules.
- Unit tests run in **Vitest browser mode** — real headless Chromium via `@vitest/browser-playwright` (wired through `@angular/build:unit-test` + root `vitest.config.ts`), not jsdom — layout measurement (`offsetWidth` etc.) works in specs.
- **Failed specs save screenshots** to `src/ng-select/lib/__screenshots__/` — read them when diagnosing a browser-mode test failure.

## Pipeline (Definition of Done, AGENTS.md)

```bash
pnpm lint
pnpm exec ng test ng-select --watch=false   # fast: ng-select only
pnpm test:ci                                # full: both libraries + coverage (what CI runs)
pnpm run build
pnpm build:docs                             # docs site (Astro + Starlight), when website/ or examples changed
pnpm exec prettier --check <changed files>  # or: pnpm format:check (whole repo)
```
