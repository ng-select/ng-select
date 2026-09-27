# 24.0.0

Major release consolidating work incorrectly shipped as **23.7.0–23.9.0** minors, plus intentional breaking/behavior changes. Use **[23.10.0](.github/RELEASE_NOTES_v23.10.0.md)** if you need a safe `^23` line without Overlay.

**Compare:** from [v23.6.0](https://github.com/ng-select/ng-select/releases/tag/v23.6.0) / [v23.10.0](https://github.com/ng-select/ng-select/releases/tag/v23.10.0) → 24.0.0

---

## Breaking changes

### 1. Dropdown panel renders in Angular CDK Overlay ([#2848](https://github.com/ng-select/ng-select/pull/2848))

| Change              | Before (≤23.6 / 23.10)                           | After (24.0)                                                                         |
| ------------------- | ------------------------------------------------ | ------------------------------------------------------------------------------------ |
| **DOM location**    | Panel child of `<ng-select>` (unless `appendTo`) | CDK overlay (typically `.cdk-overlay-container`)                                     |
| **CSS scoping**     | `.my-wrapper ng-dropdown-panel { … }`            | Scope via select classes: `.my-select-class.ng-dropdown-panel …`                     |
| **Peer**            | No CDK                                           | **`@angular/cdk` `^22.0.0` required**                                                |
| **`z-index: 1050`** | Hardcoded on panel                               | Removed; top layer in evergreen browsers; fallback ~1000 on `.cdk-overlay-container` |
| **`appendTo`**      | DOM parent + positioning                         | DOM containment only; positioning stays viewport-based                               |
| **`popover`**       | Opt-in                                           | Deprecated no-op (top layer automatic)                                               |
| **Custom themes**   | Often set `top`/`bottom`/`left` on panel         | Remove positional offsets from forked themes                                         |

```bash
pnpm add @ng-select/ng-select@24 @angular/cdk
```

Issues addressed by Overlay: [#2788](https://github.com/ng-select/ng-select/issues/2788), [#2829](https://github.com/ng-select/ng-select/issues/2829), [#2687](https://github.com/ng-select/ng-select/issues/2687), [#2575](https://github.com/ng-select/ng-select/issues/2575), [#2571](https://github.com/ng-select/ng-select/issues/2571), [#2092](https://github.com/ng-select/ng-select/issues/2092).

### 2. Behavioral breaks

| Area                                                                        | Change                                               | Action                                                  |
| --------------------------------------------------------------------------- | ---------------------------------------------------- | ------------------------------------------------------- |
| **Typeahead** ([#1504](https://github.com/ng-select/ng-select/issues/1504)) | Emits on typing only; select/close/clear do not emit | Use `(close)` / `(clear)`                               |
| **Escape** ([#2849](https://github.com/ng-select/ng-select/issues/2849))    | `preventDefault` only when closing an open dropdown  | Parent dialogs can receive Escape when select is closed |

---

## Features

- **CSS-variable theming** ([#2850](https://github.com/ng-select/ng-select/pull/2850)) — themes expose CSS custom properties; styling docs + demo ([#2375](https://github.com/ng-select/ng-select/issues/2375), [#2452](https://github.com/ng-select/ng-select/issues/2452))
- **Variable virtual-scroll heights** — separate option vs group header heights ([#2762](https://github.com/ng-select/ng-select/issues/2762))
- **Non-searchable copy** ([#2669](https://github.com/ng-select/ng-select/issues/2669)) — also in 23.10.0

---

## Bug fixes

| Issue                                                       | Fix                                     | Also in 23.10?    |
| ----------------------------------------------------------- | --------------------------------------- | ----------------- |
| [#2517](https://github.com/ng-select/ng-select/issues/2517) | Disabled × / `clearItem` ignored        | Yes               |
| [#2549](https://github.com/ng-select/ng-select/issues/2549) | Event replay `preventDefault`           | Yes               |
| [#2669](https://github.com/ng-select/ng-select/issues/2669) | Copy selected label when not searchable | Yes               |
| [#1475](https://github.com/ng-select/ng-select/issues/1475) | `offsetHeight` includes borders         | Yes               |
| [#1504](https://github.com/ng-select/ng-select/issues/1504) | Typeahead emit contract                 | No (breaking)     |
| [#2849](https://github.com/ng-select/ng-select/issues/2849) | Escape only when open                   | No (breaking)     |
| [#2762](https://github.com/ng-select/ng-select/issues/2762) | groupBy + custom template heights       | No (Overlay-tied) |
| [#2744](https://github.com/ng-select/ng-select/issues/2744) | typeahead empty→items keyboard scroll   | No (Overlay-tied) |

---

## Relationship to 23.7–23.9 and 23.10

| Version     | Role                                               |
| ----------- | -------------------------------------------------- |
| 23.7–23.9   | Accidental minors; avoid for new installs          |
| **23.10.0** | Rollback `^23` line = 23.6 + small safe fixes      |
| **24.0.0**  | Correct major: Overlay + theming + remaining fixes |

If you already run 23.7–23.9 in production, treat **24.0.0** as the supported upgrade path and follow the Breaking changes section above.
