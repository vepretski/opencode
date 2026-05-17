# 7ya.io Command Center

Operational control document for managing **7ya.io** as a live civic platform (not just a campaign page).

## Mission

Build trust through a lawful, privacy-safe, data-driven civic workflow that turns neighborhood reports into structured follow-up with relevant authorities.

## 72-Hour Execution Plan

### Hour 0–12: Stabilize the system
- Confirm domain, SSL, uptime monitoring, and incident contact channel.
- Verify all form fields match the civic intake policy (no ID numbers, no minor-identifying details, no naming suspects).
- Enable admin-only access for moderation and exports.
- Publish a short public disclosure:
  - what data is collected,
  - why it is collected,
  - where it is stored,
  - how to request deletion.

### Hour 12–24: Launch controlled intake
- Share the reporting link to 15–20 trusted local participants.
- Start triage workflow using statuses:
  - `green` usable,
  - `yellow` missing details,
  - `red` unsafe/unverifiable,
  - `blue` anonymized-ready.
- Require minimum evidence quality before escalation.

### Hour 24–48: Produce first evidence brief
- Publish a **non-representative preliminary snapshot** only after minimum thresholds are met.
- Extract first pattern set:
  - top neighborhoods,
  - top issue types,
  - common time windows,
  - prior contact with authorities.
- Prepare one concise outreach letter to municipality/police liaison with anonymized annex.

### Hour 48–72: Operationalize recurring cycle
- Move from one-off posts to repeatable daily cycle:
  - intake,
  - validation,
  - anonymization,
  - pattern report,
  - authority outreach,
  - follow-up log.
- Assign owners for moderation, data QA, and external communications.

## Operating Rules (Non-Negotiable)
1. Legal and truthful only.
2. Never publish identifying personal data.
3. Never publish unverified accusations.
4. Never frame preliminary data as representative statistics.
5. Every public output must include what is known, what is unknown, and next action.

## Minimum Viable Data Model
- report_id
- created_at
- city
- neighborhood
- zone_description
- issue_type
- incident_time_window
- affected_group
- contacted_authority (yes/no + channel)
- callback_consent (yes/no)
- anonymized_publish_consent (yes/no)
- validation_status (green/yellow/red/blue)
- urgency_level (low/medium/high)
- follow_up_owner
- follow_up_status

## Weekly KPIs
- Raw submissions
- Usable submissions (green + blue)
- Distinct mapped areas
- Consent for callback
- Authority escalations sent
- Authority responses received
- Median time from intake to triage

## Public Message Template

> We are collecting initial neighborhood safety reports to map patterns and support structured follow-up with relevant authorities.
> This is a preliminary intake phase and not yet a representative sample.
> Personal identifying details are removed before any public sharing.

## Internal Escalation Trigger
Escalate immediately when:
- multiple independent reports identify the same location/time pattern,
- incidents involve vulnerable populations,
- there is active risk requiring emergency routing.

Emergency events should be routed to official emergency services first; 7ya.io is a civic coordination layer, not an emergency response replacement.
