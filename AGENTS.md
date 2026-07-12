- To regenerate the JavaScript SDK, run `./packages/sdk/js/script/build.ts`.
- ALWAYS USE PARALLEL TOOLS WHEN APPLICABLE.
- The default branch in this repo is `dev`.
- Local `main` ref may not exist; use `dev` or `origin/dev` for diffs.
- Prefer automation: execute requested actions without confirmation unless blocked by missing info or safety/irreversibility.

## Style Guide

### General Principles

- Keep things in one function unless composable or reusable
- Do not extract single-use helpers preemptively. Inline the logic at the call site unless the helper is reused, hides a genuinely complex boundary, or has a clear independent name that improves the caller.
- Avoid `try`/`catch` where possible
- Avoid using the `any` type
- Use Bun APIs when possible, like `Bun.file()`
- Rely on type inference when possible; avoid explicit type annotations or interfaces unless necessary for exports or clarity
- Prefer functional array methods (flatMap, filter, map) over for loops; use type guards on filter to maintain type inference downstream
- In `src/config`, follow the existing self-export pattern at the top of the file (for example `export * as ConfigAgent from "./agent"`) when adding a new config module.

Reduce total variable count by inlining when a value is only used once.

```ts
// Good
const journal = await Bun.file(path.join(dir, "journal.json")).json()

// Bad
const journalPath = path.join(dir, "journal.json")
const journal = await Bun.file(journalPath).json()
```

### Destructuring

Avoid unnecessary destructuring. Use dot notation to preserve context.

```ts
// Good
obj.a
obj.b

// Bad
const { a, b } = obj
```

### Variables

Prefer `const` over `let`. Use ternaries or early returns instead of reassignment.

```ts
// Good
const foo = condition ? 1 : 2

// Bad
let foo
if (condition) foo = 1
else foo = 2
```

### Control Flow

Avoid `else` statements. Prefer early returns.

```ts
// Good
function foo() {
  if (condition) return 1
  return 2
}

// Bad
function foo() {
  if (condition) return 1
  else return 2
}
```

### Schema Definitions (Drizzle)

Use snake_case for field names so column names don't need to be redefined as strings.

```ts
// Good
const table = sqliteTable("session", {
  id: text().primaryKey(),
  project_id: text().notNull(),
  created_at: integer().notNull(),
})

// Bad
const table = sqliteTable("session", {
  id: text("id").primaryKey(),
  projectID: text("project_id").notNull(),
  createdAt: integer("created_at").notNull(),
})
```

## Testing

- Avoid mocks as much as possible
- Test actual implementation, do not duplicate logic into tests
- Tests cannot run from repo root (guard: `do-not-run-tests-from-root`); run from package dirs like `packages/opencode`.

## Type Checking

- Always run `bun typecheck` from package directories (e.g., `packages/opencode`), never `tsc` directly.

## 7YA.IO Control Mode

When the user invokes `7YA CONTROL MODE` or asks to manage 7ya.io, do not rely on chat memory as the source of truth. Use GitHub as the code and deployment system, 7ya.io as the public result, and Datasite as the governance and evidence room.

Canonical production facts to verify before making changes:

- Canonical repository: `7guard-io/7ya.io`
- Default branch: `main`
- Production workflow: `.github/workflows/pages.yml`
- Workflow name: `Publish 7YA Production Site`
- Publishing target: GitHub Pages
- Deployment trigger: manual `workflow_dispatch`
- Known blocker: GitHub Actions remains quarantined while issue `#83` is open

Required operating sequence:

1. Verify the canonical repository, default branch, production host, deployment workflow, live domain, open blockers, and latest production commit.
2. Read `docs/7YA_OPERATING_CONTRACT.md`, `docs/DEPLOYMENT_RUNBOOK.md`, `docs/LIVE_VERIFICATION_CHECKLIST.md`, and `docs/RELEASE_STATE.json` before changing anything.
3. Inspect the live site and capture before-state evidence for the affected route or component.
4. Use a dedicated branch and pull request. Never work from ZIP files, obsolete repositories, random copies, temporary environments, or remembered assumptions.
5. Make the minimum required change and validate homepage, assets, semantic HTML, metadata, mobile layout, analytics coverage, `/pass/`, `/radar/`, and all required public routes.
6. Review the final diff before integration.
7. Merge only after validation, confirm the merged commit on `main`, and publish only through the currently verified production workflow.
8. Never claim a change is published, live, or fixed until the workflow succeeds and the live site is independently verified on desktop and mobile.
9. Archive commit SHA, pull request, workflow run, screenshots, route results, remaining blockers, and rollback point in Datasite.
10. If instructions conflict, stop the conflicting action and follow the latest verified operating contract stored in the canonical repository and Datasite.

Do not store raw passwords, deployment tokens, or API keys in ordinary documents. Store only where each secret is managed and who controls it.

