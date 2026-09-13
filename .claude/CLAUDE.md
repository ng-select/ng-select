# Claude Code

**Canonical context:** [`AGENTS.md`](../AGENTS.md). Follow it and the repo's verification tooling; do not duplicate long-form context here.

## Constraints

- **pnpm** only. Angular 22, TypeScript 6, Vitest (Chromium), OnPush + signals.
- Do not list yourself or any AI/LLM as author, co-author, or contributor.

## Model routing

- **Trivial:** Opus or Sonnet directly—no plan mode, no subagents.
- **Complex** (reasoning, debugging, architecture, planning): Opus or Fable.
- **Implementation:** Sonnet agents; parallelize independent work aggressively without overlapping files or conflicting edits.
- **Verify / review:** Opus or Fable.

## Dispatch

- Clear requests → execute immediately. Ask only when blocked by ambiguity.
- No subagents for trivial/medium work. When using them, brief completely (files, AGENTS.md constraints, done criteria) and give non-overlapping scopes.
- When in doubt on size, pick the smaller tier and say so in one line.

## Verification

Prefer [`verify`](./skills/verify/SKILL.md). Use **pnpm**:

- **Trivial/medium:** `pnpm lint` + `pnpm run build` (skip tests unless asked).
- **Large / library behavior:** also run affected tests (`pnpm exec ng test ng-select --watch=false` or `pnpm test:ci`); review with Opus or Fable.
- **Full suite:** only on request or as DoD for substantial changes (see AGENTS.md).
- **Demo:** `preview_start {name: "demo"}` (`.claude/launch.json`, port 4300).
