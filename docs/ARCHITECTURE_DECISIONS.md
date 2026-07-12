# 7YA.IO Architecture Decisions

## ADR-001: GitHub Is the Code and Deployment System

Status: Active

7ya.io source changes, branches, commits, pull requests, and production deployment are controlled through GitHub. Operators must not treat Datasite, chat tools, ZIP files, temporary environments, or obsolete repositories as the source of code truth.

## ADR-002: GitHub Pages Is the Production Publishing Target

Status: Active

Production publishing targets GitHub Pages through `.github/workflows/pages.yml`, named `Publish 7YA Production Site`, and triggered manually with `workflow_dispatch`.

## ADR-003: Datasite Is the Governance and Evidence Room

Status: Active

Datasite stores governance records, approvals, evidence, release records, incident records, and rollback points. It is not the website editor or deployment platform.

## ADR-004: Chat Memory Is Not Authoritative

Status: Active

Chat memory may provide context but must never be used as the authoritative record for repository identity, deployment architecture, production status, evidence, approvals, or rollback points.

## ADR-005: Secrets Are Never Stored in Ordinary Documents

Status: Active

Documents may record where secrets are managed and who controls them. Raw passwords, deployment tokens, and API keys must remain in approved secret-management systems or platform settings.
