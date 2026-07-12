# 7YA.IO Operating Contract

## Purpose

7ya.io must be operated from durable infrastructure records, not from chat memory. Chat context may help an operator understand prior work, but it is never the source of truth for repository identity, publishing authority, deployment state, release evidence, or rollback decisions.

## Canonical Systems

| System | Role |
| --- | --- |
| GitHub | Code, branches, commits, pull requests, and production deployment |
| 7ya.io | Live public result |
| Datasite | Governance vault, evidence, approvals, release records, and audit trail |
| ChatGPT | Operator that reads current state, edits through GitHub, and verifies the result |
| Chat memory | Helpful context only; never the source of truth |

Datasite must not be treated as the website editor or deployment platform. It holds institutional memory, approvals, evidence, and control records so operators do not improvise.

## Canonical Production Facts

Operators must verify these facts before changing the platform:

- Canonical repository: `7guard-io/7ya.io`
- Default branch: `main`
- Production workflow: `.github/workflows/pages.yml`
- Workflow name: `Publish 7YA Production Site`
- Publishing target: GitHub Pages
- Deployment trigger: manual `workflow_dispatch`
- Known blocker: GitHub Actions remains quarantined while issue `#83` is open

## Authority Matrix

| Area | Authority |
| --- | --- |
| Source edits | GitHub pull requests against `7guard-io/7ya.io` |
| Production publishing | Manual run of `Publish 7YA Production Site` after validation and merge |
| Governance records | Datasite project `7YA.IO Sovereign Control Room` |
| Evidence archive | Datasite evidence folders plus repository release records where appropriate |
| Secrets | Secret manager or platform settings only; documents may record location and owner, not raw values |
| Live truth | Independently verified `https://7ya.io` after workflow success |

## Non-Forgetting Publishing Protocol

Every 7ya.io task must follow this sequence:

1. Identify the canonical repository: confirm `7guard-io/7ya.io`, confirm `main`, and check whether the deployment architecture changed.
2. Inspect production: open the live site, check the exact broken route or component, and record before-state evidence.
3. Read governance: read this operating contract, the deployment runbook, current blockers, and release status.
4. Edit safely: create a dedicated branch, make the minimum required changes, and never edit ZIP files, obsolete repositories, temporary environments, or remembered copies.
5. Validate: run route checks, validate semantic HTML, metadata, mobile layout, assets, `/pass/`, `/radar/`, and all required public routes; review the diff.
6. Integrate: open a pull request, merge only after validation, and confirm the merged commit exists on `main`.
7. Publish: run `Publish 7YA Production Site` manually. Do not claim success merely because code was merged.
8. Verify production: confirm the workflow succeeded, open `https://7ya.io`, test changed routes on mobile and desktop, and confirm the live source contains the intended release.
9. Archive evidence: save commit SHA, workflow run, screenshots, route results, and rollback point in Datasite.

## Required Final Report

Every 7ya.io operating task must report:

- Production status
- Repository and branch used
- Files changed
- Tests completed
- Pull request and commit
- Deployment workflow result
- Live routes verified
- Evidence archived
- Remaining blockers
- Exact rollback point
