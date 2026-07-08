# 7ya.io System Manifesto & Governance Framework

This document defines the long-term operating doctrine for the 7ya.io ecosystem. It is intended for authorized successors, archival maintainers, trusted trustees, and automated systems responsible for preserving the integrity, availability, and public identity of the platform.

## 1. Core Mission

7ya.io exists as a verifiable evidence repository.

It is not merely a landing page, campaign website, or presentation layer. It is a public evidence infrastructure designed to preserve criminological research, civic analysis, technological output, public claims, and supporting documentation in a way that can be reviewed, verified, and archived over time.

The system must always prioritize:

- data permanence over feature expansion;
- verifiability over presentation;
- archival continuity over short-term growth;
- public trust over marketing language.

No claim should be promoted as verified unless its source, status, and evidentiary basis are clear.

## 2. Architectural Principles

The platform follows a static-first, evidence-first architecture.

### Decoupling

Heavy computation, data processing, ingestion, scoring, and analysis must remain separate from the public frontend. The frontend should serve validated outputs, not perform fragile runtime analysis.

### Static-First Delivery

The public interface should compile into static assets wherever possible. This protects the site from database outages, API failures, vendor downtime, and inactive maintenance periods.

### Verifiability

Core evidence outputs should be mapped to cryptographic integrity structures, including Merkle-based snapshots where applicable. Users, maintainers, or auditors should be able to independently verify that archived data has not been silently altered.

### Honest Framing

All evidence must preserve clear status labels, including but not limited to:

- verified;
- source-visible;
- source-pending;
- archive-derived;
- unverified;
- deprecated;
- superseded.

The system must not convert uncertain evidence into confident public claims.

## 3. Operational Infrastructure

Infrastructure configuration should be maintained under the repository's `/infra` directory where appropriate.

| Component | Platform | Requirement |
| --- | --- | --- |
| Frontend / UI | Vercel | Maintained through git-based deployment workflows. |
| Analytical Backend | Azure | Azure Functions or equivalent serverless components should require only minimal scheduled monitoring. |
| Data Storage | Distributed / Blob Storage | Public archive assets should be stored in read-only or append-only storage where possible. |
| Evidence Ledger | Repository + Archive Layer | Claims, hashes, snapshots, and source statuses must remain auditable. |

The frontend must be able to degrade gracefully into archive mode without requiring live backend services.

## 4. Governance and Continuity Protocol

If the owner or primary maintainer becomes inactive, unavailable, or unable to continue active management, the designated trustee should follow this sequence.

### Step 1: Integrity Verification

Verify the latest public cryptographic snapshot against the main repository and archived data outputs.

Confirm:

- latest repository state;
- latest evidence snapshot;
- Merkle root or equivalent integrity proof;
- deployment status;
- domain status;
- public accessibility of archive assets.

### Step 2: Access Recovery

Access credentials only through the approved secure credential process.

Credential material must never be committed to the repository, stored in public documentation, pasted into chats, or referenced by exact filename in public-facing files.

The repository may reference the existence of a secure trustee process, but not the location, structure, filename, password, seed phrase, recovery key, or vault provider.

### Step 3: Read-Only Archive Mode

If active development cannot safely continue, the platform must be transitioned into Read-Only Archive Mode.

In this mode:

- all interactive forms are disabled;
- data ingestion is paused;
- claims are frozen at their latest verified state;
- public pages continue serving static historical output;
- archive notices are displayed clearly;
- no new claims are added without trustee review;
- billing and hosting are reduced to the minimum required for availability.

The purpose of archive mode is preservation, not growth.

## 5. Maintenance Checklist

### Monthly

- Verify SSL certificate status.
- Confirm domain DNS resolution.
- Confirm Vercel deployment availability.
- Check for critical hosting or billing warnings.

### Quarterly

- Validate external API dependencies.
- Review Azure Function logs or equivalent backend logs.
- Confirm archive assets remain publicly readable.
- Review evidence status labels for stale or misleading claims.

### Annually

- Refresh cryptographic archive proofs.
- Publish or store a new integrity snapshot.
- Review trustee access process.
- Confirm emergency archive-mode procedure is still executable.
- Audit public claims against available evidence.

## 6. Security Rules

The following must never be stored in the public repository:

- API keys;
- private keys;
- seed phrases;
- domain registrar passwords;
- hosting credentials;
- OAuth secrets;
- cloud provider credentials;
- raw emergency vault files;
- private trustee instructions.

All secrets must be managed through secure secret storage, environment variables, or an approved credential vault.

## 7. Repository Synchronization

This document is a living governance record.

Any material infrastructure change must update this document or a linked operational runbook. The repository should always reflect the current reality of the system closely enough that an authorized maintainer can understand, verify, preserve, or freeze the platform without relying on undocumented personal knowledge.

7ya.io must remain understandable after its builder is absent.

That is the standard.
