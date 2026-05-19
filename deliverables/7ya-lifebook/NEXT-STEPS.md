# Manage 7ya.io — What was done, and what you do now

## What is already done
- Lifebook package scaffold created under `deliverables/7ya-lifebook/`.
- RTL Hebrew `book.html` with title, subtitle, source cards, and 40-section structure.
- Source registry (`data/archive.csv`) with public links and verification notes.
- `person.schema.json` JSON-LD identity metadata.
- Press kit, launch texts, SEO snippet, and 10 social-ready lines.

## What you do now (execution order)
1. Capture **dated screenshots** for every row in `data/archive.csv`.
2. Save each screenshot under `assets/` using this pattern:
   - `A-00X-platform-YYYY-MM-DD.png`
3. Update `data/archive.csv` columns:
   - `screenshot_or_image` with relative path
   - `date` with capture date
   - `exposure_metrics` with exact visible counters only
4. Add 20–50 more verified rows (posts, interviews, videos, articles).
5. Expand `book.html` from structure to full chapter content using only verified rows.
6. Render final exports:
   - PDF (print)
   - DOCX (editable)
   - keep HTML as web edition
7. Publish to 7ya.io content stack:
   - HTML page
   - schema JSON-LD in page head
   - press-kit page and download links

## Definition of done
- No placeholders
- No invented numbers
- Every claim has URL source
- Every media item has dated screenshot
- Final package includes HTML + PDF + DOCX + assets + archive CSV
