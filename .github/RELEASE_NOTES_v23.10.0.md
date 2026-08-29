# 23.10.0 (rollback)

Restores a safe **23.x** line after **23.7.0–23.9.0** shipped the CDK Overlay migration (and related work) as minors. Those versions remain on npm but are superseded for `^23` by this release.

**Base:** [v23.6.0](https://github.com/ng-select/ng-select/releases/tag/v23.6.0)  
**Intent:** same pre-Overlay behavior as 23.6, plus a few small non-breaking fixes backported from 23.9.

> Prefer **24.0.0** if you want Overlay, CSS-variable theming, typeahead/Escape behavior updates, and the full virtual-scroll improvements. See the 24.0.0 release notes for breaking changes.

## Why this release

| Version | Problem |
| --- | --- |
| 23.7.0 | Introduced CDK Overlay (breaking) as a minor |
| 23.8.0 | CSS-variable theming (moved to 24.0.0) |
| 23.9.0 | More Overlay-tied fixes + behavioral typeahead/Escape changes |

**23.10.0 > 23.9.0**, so `npm install @ng-select/ng-select@^23` resolves here instead of 23.7–23.9.

## Included (safe backports from 23.9)

| Issue | Fix |
| --- | --- |
| [#2517](https://github.com/ng-select/ng-select/issues/2517) | Disabled select / disabled items cannot be removed via × or `clearItem` |
| [#2549](https://github.com/ng-select/ng-select/issues/2549) | Skip `preventDefault` during Angular event replay (SSR/hydration) |
| [#2669](https://github.com/ng-select/ng-select/issues/2669) | Allow copy/select of selected label when `searchable=false` |
| [#1475](https://github.com/ng-select/ng-select/issues/1475) | Virtual scroll measures option height with `offsetHeight` (includes borders) |

## Explicitly **not** included (ship in 24.0.0)

- CDK Overlay dropdown / `@angular/cdk` peer / `appendTo`·`popover` / z-index changes ([#2848](https://github.com/ng-select/ng-select/pull/2848))
- CSS-variable theming ([#2850](https://github.com/ng-select/ng-select/pull/2850))
- Typeahead emit-on-typing-only contract ([#1504](https://github.com/ng-select/ng-select/issues/1504))
- Escape `preventDefault` only when open ([#2849](https://github.com/ng-select/ng-select/issues/2849))
- Variable group/option heights + empty→items panel sync ([#2762](https://github.com/ng-select/ng-select/issues/2762), [#2744](https://github.com/ng-select/ng-select/issues/2744))

## Upgrade notes

- From **23.6.0**: safe to take 23.10.0 (bugfixes only).
- From **23.7–23.9**: pin `23.10.0` to leave Overlay, **or** move to **24.0.0** and follow its breaking-change guide.
- No new peer dependencies vs 23.6.0 (still no `@angular/cdk` on this line).
