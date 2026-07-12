# 7YA.IO Live Verification Checklist

Use this checklist before and after publishing. Record evidence in Datasite under `7YA.IO Sovereign Control Room`.

## Before-State Evidence

- Capture the current live page for each affected route.
- Record the current production commit if available.
- Record the exact issue, route, viewport, browser, and timestamp.

## Build and Route Validation

- Homepage loads successfully.
- Required assets load successfully.
- Public routes exist and return the expected content.
- `/pass/` exists and renders correctly.
- `/radar/` exists and renders correctly.
- Semantic HTML is valid for changed pages.
- Metadata and SEO fields are present for changed pages.
- GA4 coverage remains present where required.
- Mobile layout is checked for changed pages.
- Desktop layout is checked for changed pages.

## Deployment Verification

- `Publish 7YA Production Site` completed successfully.
- GitHub Pages deployment points to the intended commit.
- `https://7ya.io` serves the intended release.
- Live source or visible release marker confirms the intended build.

## Evidence to Archive

- Pull request URL.
- Commit SHA.
- Workflow run URL and result.
- Screenshots for desktop and mobile checks.
- Route test output.
- Remaining blockers.
- Exact rollback point.
