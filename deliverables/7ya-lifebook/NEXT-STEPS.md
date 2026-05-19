# Manage 7ya.io — Source Package Handoff

## What is already done
- Lifebook source package created under `deliverables/7ya-lifebook/`.
- RTL Hebrew `book.html` with title, subtitle, source cards, and 40-section structure.
- Source registry (`data/archive.csv`) with public links and verification notes.
- `person.schema.json` JSON-LD identity metadata.
- Press kit, launch texts, SEO snippet, and 10 social-ready lines.

## What this PR intentionally does not include
- Binary PDF export.
- Binary DOCX export.
- Screenshot bundles.
- Private or non-public counters.

These are release artifacts generated after source review. They must not be invented or committed before capture.

## Release execution order
1. Capture dated screenshots for archive rows.
2. Save screenshots in the release bundle.
3. Record exact visible counters only.
4. Add additional verified rows where needed.
5. Expand the HTML content from verified rows.
6. Generate final PDF and DOCX from `book.html`.
7. Publish the HTML page, schema, and press kit.

## Source PR acceptance checklist
- No invented numbers.
- Every public claim has a source URL or explicit verification note.
- JSON-LD remains valid JSON.
- HTML remains standalone and RTL-ready.
- Binary release artifacts are excluded from this source PR.
