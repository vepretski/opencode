# Repository Audit (2026-05-19)

## Current status
- Repository is a Bun monorepo with Turbo workspaces and multiple packages under `packages/*`.
- CI workflows already exist for tests, typechecks, docs, release, and automation.
- Core contribution and security docs exist (`CONTRIBUTING.md`, `SECURITY.md`).

## Problems found
1. GitHub templates were inconsistent (`kebab-case` and mixed formats), making intake less standardized.
2. No `task` issue template for operational/tracking work.
3. No root-level Dependabot configuration for npm + workflow dependency automation.
4. No shared label-definition file for reproducible label setup across forks.
5. Pull request template existed only as lowercase path; some automation/tools expect uppercase conventional path.

## Changes made
- Added standardized PR template at `.github/PULL_REQUEST_TEMPLATE.md`.
- Added standardized issue templates:
  - `.github/ISSUE_TEMPLATE/bug_report.yml`
  - `.github/ISSUE_TEMPLATE/feature_request.yml`
  - `.github/ISSUE_TEMPLATE/task.yml`
- Added `.github/dependabot.yml` for npm and GitHub Actions updates.
- Added `.github/labels.yml` with a practical baseline label set.

## Validation run
- `bun run lint` (repo root)
- `bun --cwd packages/opencode typecheck`
- `bun --cwd packages/opencode test`

## CI status impact
- Existing workflows were not replaced; repository behavior is preserved.
- Added automation config files are additive and safe for current CI.

## Security notes
- No secrets were added.
- No runtime auth or permission model changes were introduced.
- Dependabot and issue templates improve maintenance hygiene without expanding attack surface.

## Remaining recommended improvements
1. Add a labels sync workflow (e.g., `crazy-max/ghaction-github-labeler`) to apply `.github/labels.yml` automatically.
2. Align duplicate legacy issue templates (`bug-report.yml` / `feature-request.yml`) after maintainers confirm migration.
3. Add CI path filters to reduce unnecessary workflow runs on docs-only changes.
4. Add a dedicated `lint` workflow if maintainers want quicker feedback before full `test.yml` completion.
5. Review CODEOWNERS for full repo ownership coverage.

## Next 7 actions for Igor
1. Merge this branch and monitor first Dependabot run.
2. Enable auto-merge policy for dependency-only PRs if desired.
3. Add branch protection requiring `test` and `typecheck` workflows.
4. Decide whether to deprecate legacy issue template files.
5. Add repository labels from `.github/labels.yml` via script or action.
6. Confirm CODEOWNERS assignments for all top-level packages.
7. Add a release checklist section to `CONTRIBUTING.md` if release operations are delegated.
