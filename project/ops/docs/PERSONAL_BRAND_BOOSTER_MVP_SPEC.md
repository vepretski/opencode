# PERSONAL BRAND BOOSTER MVP SPEC

## Command

`bun run personal-brand:boost --source <path> --lang en|he|both --out <output-dir>`

Default output directory: `./outputs/personal-brand-booster`.

## Goal

Generate a deterministic, local-only personal-brand promotion package for Igor Vepretski / 7ya.io from one source file.

## Constraints

- No UI, database, auth, or external model calls.
- Keep deterministic output for same args and source.
- Enforce CTA in generated platform markdown:
  - `Manage 7ya.io`
  - `https://7ya.io`
- Preserve bilingual support (`en`, `he`, `both`).
- Preserve six channels:
  - X / Twitter
  - LinkedIn
  - Instagram
  - TikTok / Shorts
  - Newsletter
  - Blog draft

## Output Files

Always generate:

1. `brief.json`
2. `campaign-plan.json`
3. `validation.json`
4. `README.md`
5. `daily-posting-plan.md`
6. `hook-bank.md`
7. `cta-bank.md`
8. `repurposing-map.md`

Generate per requested language:

- `en-x-post.md`
- `en-linkedin-post.md`
- `en-instagram-caption.md`
- `en-tiktok-shorts-script.md`
- `en-newsletter-summary.md`
- `en-blog-draft.md`
- `he-x-post.md`
- `he-linkedin-post.md`
- `he-instagram-caption.md`
- `he-tiktok-shorts-script.md`
- `he-newsletter-summary.md`
- `he-blog-draft.md`

## Validation Rules

Validate each generated platform markdown file and write status in `validation.json`.

Fail when any of the following is missing:

- CTA phrase
- CTA link
- `channel`
- `language`
- file content
- supported language (`en` or `he`)
