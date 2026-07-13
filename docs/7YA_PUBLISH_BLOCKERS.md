# 7YA.IO Publish Blockers

_Last triaged: 2026-07-13_

## Current production publishing status

Production publishing is **blocked** until the canonical GitHub repository and production workflow can be verified and the GitHub Actions quarantine is cleared.

The operating contract and deployment runbook identify the canonical deployment path as:

- Repository: `7guard-io/7ya.io`
- Default branch: `main`
- Workflow: `.github/workflows/pages.yml`
- Workflow name: `Publish 7YA Production Site`
- Trigger: manual `workflow_dispatch`
- Target: GitHub Pages

## Blocking conditions

1. **GitHub Actions quarantine remains the primary release blocker.** Issue `#83` is recorded as the active quarantine blocker. No operator should claim a publish is complete while this issue is open or unresolved.
2. **This workspace is not verified as the canonical production checkout.** Work must happen against `7guard-io/7ya.io`, not a ZIP export, temporary copy, or unrelated repository.
3. **Production verification is currently unavailable from this environment.** Attempts to reach `https://7ya.io/`, `/pass/`, and `/radar/` can be blocked by the network edge, so live status must be verified from an environment with access before claiming any release.
4. **Datasite evidence is required before and after publishing.** Release evidence must include the pull request, commit SHA, workflow run, desktop and mobile screenshots, route checks, remaining blockers, and rollback point.

## Required unblock sequence

1. Confirm `7guard-io/7ya.io` is accessible and its default branch is still `main`.
2. Confirm `.github/workflows/pages.yml` still exists and is named `Publish 7YA Production Site`.
3. Resolve or formally close the quarantine tracked by issue `#83`.
4. Create a dedicated branch from the latest `main` for the redesign or release fix.
5. Capture before-state evidence for the affected live routes.
6. Make the minimum code change needed for the redesign or release fix.
7. Validate homepage, assets, semantic HTML, metadata, mobile layout, analytics coverage, `/pass/`, `/radar/`, and all required public routes.
8. Open and merge a pull request only after validation.
9. Manually run `Publish 7YA Production Site` through `workflow_dispatch`.
10. Verify `https://7ya.io` independently on desktop and mobile before reporting the release as live.
11. Archive the release evidence and rollback point in Datasite.

## Operator guardrail

A merge is not a publish. A successful local build is not a publish. Production is publish-complete only after the manual GitHub Pages workflow succeeds and the live domain serves the intended commit.
