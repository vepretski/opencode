# 7YA.IO Deployment Runbook

## Production Deployment Model

- Repository: `7guard-io/7ya.io`
- Default branch: `main`
- Workflow file: `.github/workflows/pages.yml`
- Workflow name: `Publish 7YA Production Site`
- Target: GitHub Pages
- Trigger: manual `workflow_dispatch`

The production workflow validates the homepage, assets, public routes, GA4 coverage, builds an immutable `dist` artifact, and deploys through GitHub Pages.

## Pre-Change Checks

1. Confirm the repository is `7guard-io/7ya.io` and the default branch is `main`.
2. Confirm the production workflow file and workflow name have not changed.
3. Confirm the live domain is `https://7ya.io`.
4. Check open blockers, especially issue `#83` while GitHub Actions is quarantined.
5. Read `docs/7YA_OPERATING_CONTRACT.md`, this runbook, `docs/LIVE_VERIFICATION_CHECKLIST.md`, and `docs/RELEASE_STATE.json`.
6. Capture before-state evidence for the affected live route or component.

## Change Procedure

1. Create a dedicated branch from the latest `main`.
2. Make the minimum required changes.
3. Do not edit ZIP exports, obsolete repositories, random copies, or temporary environments.
4. Run available validations and route checks.
5. Inspect the final diff.
6. Open a pull request.
7. Merge only after validation has passed.
8. Confirm the merged commit exists on `main`.

## Publishing Procedure

1. Start the `Publish 7YA Production Site` workflow manually with `workflow_dispatch`.
2. Wait for the workflow to complete.
3. Treat a merge without a successful workflow as unpublished.
4. If the workflow fails, keep production status as blocked or failed and archive the failure evidence.

## Post-Publish Verification

1. Open `https://7ya.io` on desktop and mobile viewport sizes.
2. Verify the changed routes or components.
3. Verify required public routes, including `/pass/` and `/radar/`.
4. Confirm source, metadata, assets, analytics coverage, and semantic HTML where relevant.
5. Record the production commit, workflow run, route results, screenshots, remaining blockers, and rollback point in Datasite.

## Rollback Procedure

1. Identify the last known-good production commit from `docs/RELEASE_STATE.json` and Datasite release records.
2. Open a rollback branch or revert pull request against `main`.
3. Validate the rollback with the same route and asset checks.
4. Merge only after validation.
5. Run the production workflow manually.
6. Verify live production independently before claiming rollback complete.
7. Archive rollback evidence and update release state.
