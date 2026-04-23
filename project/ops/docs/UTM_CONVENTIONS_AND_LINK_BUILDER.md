# UTM Convention Template + Canonical Link Builder Guidance

Use this guide to keep attribution consistent across all Igor Vepretski platforms and campaigns.

## Canonical URL rule

- Always start from the canonical 7ya.io destination URL.
- Keep one canonical host variant across channels (for example, `https://7ya.io/...`).
- Do not add tracking parameters to internal canonical tags on-page; UTMs are for inbound campaign links only.

## UTM taxonomy

### `utm_source` (where traffic comes from)

Recommended examples:
- `x`
- `linkedin`
- `youtube`
- `instagram`
- `tiktok`
- `telegram`
- `github`
- `newsletter_partner`
- `podcast_guest`

### `utm_medium` (channel type)

Recommended examples:
- `social`
- `video`
- `email`
- `referral`
- `community`

### `utm_campaign` (campaign identifier)

Format:
- `yyyy_mm_theme_offer`

Examples:
- `2026_04_story_origin_launch`
- `2026_04_7ya_identity_push`
- `2026_05_case_study_authority`

### Optional fields

- `utm_content` for creative variant (`hook_a`, `shorts_cut_3`, `hebrew_caption`)
- `utm_term` for paid or keyword-specific usage

## Naming rules

- Use lowercase only.
- Use underscores for campaign slugs.
- Avoid spaces and special characters.
- Keep values stable after launch.

## Canonical link builder workflow

1. Copy the canonical destination page from 7ya.io.
2. Append `utm_source`, `utm_medium`, and `utm_campaign`.
3. Add `utm_content` when testing multiple creatives.
4. Validate the final URL opens correctly and preserves page path.
5. Store generated links in the campaign checklist or launch sheet.

## Examples

- X post:
  - `https://7ya.io/story?utm_source=x&utm_medium=social&utm_campaign=2026_04_story_origin_launch&utm_content=thread_a`
- YouTube description:
  - `https://7ya.io/story?utm_source=youtube&utm_medium=video&utm_campaign=2026_04_story_origin_launch&utm_content=longform_desc`
- Partner newsletter mention:
  - `https://7ya.io/story?utm_source=newsletter_partner&utm_medium=email&utm_campaign=2026_04_story_origin_launch`

## QA before publishing links

- [ ] URL resolves to expected canonical page on 7ya.io
- [ ] `utm_source` and `utm_medium` match the destination platform
- [ ] `utm_campaign` matches the campaign checklist slug
- [ ] No duplicate or conflicting UTM keys
