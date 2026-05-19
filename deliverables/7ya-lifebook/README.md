# 7YA Lifebook Deliverables

Project package for:
**"Igor Vepretski / #7YA — ספר חיים מלא עד כה"**

## Included artifacts
- `book.html` — RTL Hebrew interactive narrative shell with 40-book-gate structure.
- `data/archive.csv` — source registry (IDs, platforms, links, stage tags, verification notes).
- `person.schema.json` — JSON-LD `Person` with canonical alternate names.
- `press-kit/short-press-kit.md` — short public press profile.
- `launch-texts.md` — launch copy for Facebook / Instagram / LinkedIn.
- `10-posts-ready.md` — ready-to-publish social lines.
- `seo-snippet-7yaio.md` — SEO summary for 7ya.io.

## Production policy
- Only public or owner-authorized materials.
- No stock substitutes for personal photos.
- No invented metrics.
- Every public claim must map to a source URL.

## Rendering
- HTML is ready.
- PDF/DOCX render from `book.html` using local tooling (e.g. pandoc/chromium/libreoffice) in deployment pipeline.

## Operational next step for manage-7ya.io
1. Capture dated screenshots for each row in `data/archive.csv`.
2. Fill `screenshot_or_image` and `exposure_metrics` per item.
3. Generate print-ready PDF and editable DOCX.
4. Publish short press kit and schema to 7ya.io content stack.
