# Content Regeneration MVP Spec (Thin Slice)

## Purpose
This MVP converts one source file into a deterministic bilingual content package for Igor Vepretski / 7ya.io.

The pipeline is local-only and file-based. No UI, DB, auth, or existing platform refactor is included.

## Inputs
- `--source <path>`: Required path to `.md` or `.txt` source file.
- `--lang <he|en|both>`: Optional. Defaults to `both`.
- `--out <path>`: Optional. Defaults to `./outputs/content-regeneration`.

## Mandatory Channels
The generator must create six channels:
1. X / Twitter
2. LinkedIn
3. Instagram
4. TikTok / Shorts script
5. Newsletter summary
6. Blog draft

## Languages
Hebrew and English are first-class outputs.
- `he` -> Hebrew files only
- `en` -> English files only
- `both` -> Hebrew + English files

## Output Contract
The output folder must contain:
- `brief.json`
- `validation.json`
- One markdown file per channel+language

When `--lang both`:
- `x.he.md`, `x.en.md`
- `linkedin.he.md`, `linkedin.en.md`
- `instagram.he.md`, `instagram.en.md`
- `shorts-script.he.md`, `shorts-script.en.md`
- `newsletter.he.md`, `newsletter.en.md`
- `blog-draft.he.md`, `blog-draft.en.md`

## Content Requirements per Output
Each generated markdown file must include:
- channel
- language
- title/hook
- body
- CTA
- source reference

## CTA Rules (Required)
All outputs must include:
- CTA phrase: `Manage 7ya.io`
- CTA link: `https://7ya.io`

Validation fails if either is missing in any generated artifact.

## Deterministic Generation Rules
- Source first heading (`# ...`) becomes the base title.
- First non-empty paragraph becomes the summary seed.
- First up to five bullet points become key points.
- Output text is deterministic template rendering (no randomization).

## Validation
`validation.json` reports:
- source path
- output path
- generated files
- per-file checks (`has_cta_phrase`, `has_cta_link`)
- aggregate `valid`

## Non-Goals
- No publishing/scheduling integration
- No model orchestration runtime
- No multi-user or authentication
- No persistence beyond generated files
