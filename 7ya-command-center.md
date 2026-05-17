# 7ya.io Command Center

Operational command document for managing **7ya.io** as a production system with three linked tracks:
- platform reliability,
- civic intake operations,
- audience and trust growth.

## Outcome Definition

7ya.io is considered "managed" only when all three tracks are active:
1. **System is stable** (fast, reachable, monitored).
2. **Intake is trustworthy** (lawful collection, triage, anonymization, follow-up).
3. **Public loop is alive** (clear updates, evidence briefs, accountable escalation).

## 72-Hour Plan

### Hour 0–12: Platform hardening
- Confirm domain DNS, SSL validity, and uptime monitoring.
- Publish status owner and incident contact channel.
- Verify form and dashboard authentication boundaries.
- Add/update public disclosure page:
  - what is collected,
  - legal basis and purpose,
  - retention window,
  - deletion request process.

### Hour 12–24: Controlled data intake
- Open intake to 15–20 trusted participants first.
- Accept only structured reports with required minimum fields.
- Start moderation queue with statuses:
  - `green` usable,
  - `yellow` incomplete,
  - `red` unsafe/unverifiable,
  - `blue` approved for anonymized publication.

### Hour 24–48: First operational brief
- Produce preliminary snapshot with mandatory disclaimer:
  - "Initial intake, not a representative sample."
- Report only verified aggregates:
  - leading neighborhoods,
  - leading issue types,
  - recurring time windows,
  - previous authority contact rate.
- Prepare one concise escalation letter with anonymized annex.

### Hour 48–72: Recurring operating cycle
- Run repeatable daily loop:
  - intake → triage → anonymize → summarize → escalate → follow up.
- Assign named owner for each stage.
- Start weekly KPI tracking and publish first transparent operations note.

## Minimum Data Contract

Required fields:
- `report_id`
- `created_at`
- `city`
- `neighborhood`
- `zone_description`
- `issue_type`
- `incident_time_window`
- `affected_group`
- `contacted_authority` (yes/no + channel)
- `callback_consent` (yes/no)
- `anonymized_publish_consent` (yes/no)
- `validation_status` (green/yellow/red/blue)
- `urgency_level` (low/medium/high)
- `follow_up_owner`
- `follow_up_status`

Never collect:
- ID numbers,
- exact home addresses,
- minor-identifying details,
- named accusations against private individuals.

## Operating Rules (Non-Negotiable)
1. Legal and factual only.
2. No personally identifying publication.
3. No unverified accusations.
4. No inflated claims from early data.
5. Every public output must state: knowns, unknowns, next action.
6. Emergency risk is routed to official emergency services first.

## Ownership Matrix

- **Ops Lead**: uptime, incidents, release sign-off.
- **Data Lead**: triage quality, deduplication, export controls.
- **Privacy Lead**: consent policy, deletion requests, publication review.
- **Community Lead**: inbound communication and callback scheduling.
- **Escalation Lead**: municipality/police liaison letters and follow-up log.


## Command Cadence (Daily)

Run this fixed cadence every day:
1. **09:00 UTC — Systems check**: uptime, SSL, auth, ingestion health.
2. **12:00 UTC — Triage checkpoint**: clear `yellow` backlog and reclassify.
3. **16:00 UTC — Escalation window**: send/track authority follow-ups.
4. **20:00 UTC — Public note**: publish anonymized, evidence-based update.

If a checkpoint is missed, log cause and recovery action in the follow-up tracker.

## First Week Deliverables
- Day 1: intake live + privacy notice live + role assignment complete.
- Day 2: first 30 raw reports triaged and deduplicated.
- Day 3: first preliminary brief published with disclaimer.
- Day 4: first escalation letter sent with anonymized annex.
- Day 5: response tracker updated and callback queue processed.
- Day 6: KPI baseline captured.
- Day 7: weekly operations report published.

## Weekly KPIs
- raw_submissions
- usable_submissions (`green + blue`)
- unique_mapped_zones
- callback_consent_rate
- escalations_sent
- responses_received
- median_triage_time
- median_days_to_follow_up

## Public Update Template

> We are collecting initial neighborhood safety reports to identify patterns and support structured follow-up with relevant authorities.
> This is a preliminary intake phase and not yet a representative sample.
> Identifying details are removed before any public sharing.

## Escalation Trigger
Escalate when:
- multiple independent reports converge on the same zone and timeframe,
- vulnerable populations are repeatedly affected,
- risk indicators suggest urgent intervention.

7ya.io is a civic coordination layer and does not replace emergency responders or legal authorities.
