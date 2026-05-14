# Personal Brand Booster MVP Spec (Thin Slice)

## Purpose
Automate deterministic local personal-brand amplification for Igor Vepretski / 7ya.io by building on the content regeneration contract.

## Command
`bun run personal-brand:boost --source ./input/example.md --lang both --out ./outputs/personal-brand-booster`

## Constraints
- No UI
- No DB
- No auth
- No platform refactor
- Deterministic local file generation only

## Required Outputs
- brief.json
- campaign-plan.json
- validation.json
- README.md
- en-x-post.md
- en-linkedin-post.md
- en-instagram-caption.md
- en-tiktok-shorts-script.md
- en-newsletter-summary.md
- en-blog-draft.md
- he-x-post.md
- he-linkedin-post.md
- he-instagram-caption.md
- he-tiktok-shorts-script.md
- he-newsletter-summary.md
- he-blog-draft.md
- daily-posting-plan.md
- hook-bank.md
- cta-bank.md
- repurposing-map.md

## Validation Rules
Every platform markdown file must include:
- channel
- language
- title/hook
- body
- CTA
- source reference

Fail if:
- CTA phrase missing
- CTA link missing
- channel missing
- language missing
- file empty
- unsupported language used

## CTA Policy
All CTA variants must include:
- `Manage 7ya.io`
- `https://7ya.io`
