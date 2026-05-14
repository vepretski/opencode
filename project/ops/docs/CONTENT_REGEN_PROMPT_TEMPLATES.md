# Content Regeneration Prompt Templates (Deterministic MVP)

These templates define target structure and constraints for future model-backed generation.
In this MVP, local deterministic templates implement the same output contract.

## Global System Constraints
- Output language must be exactly `he` or `en`.
- Include channel, language, title/hook, body, CTA, source reference.
- CTA phrase must be `Manage 7ya.io`.
- CTA URL must be `https://7ya.io`.
- Keep meaning faithful to source; no invented facts.

## Shared Input Envelope
- Source title
- Source summary
- Key points (up to 5)
- Source path
- Channel
- Language

## Channel Templates

### X / Twitter
- 1 hook line
- 2-4 short lines in body
- 1 CTA line

### LinkedIn
- 1 professional hook
- 2 short paragraphs
- 3 bullet takeaways
- 1 CTA line

### Instagram
- 1 hook
- 1 concise narrative paragraph
- 3 hashtags
- 1 CTA line

### TikTok / Shorts Script
- Hook spoken line
- 3 beat script
- End CTA spoken line

### Newsletter Summary
- Subject-style hook
- 2 paragraph digest
- 3 key points
- CTA + source reference

### Blog Draft
- Title
- Intro paragraph
- 3 sections with headings
- CTA and source reference footer
