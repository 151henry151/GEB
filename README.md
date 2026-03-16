# GEB — Interactive Companion

An interactive, chapter-by-chapter companion to **Gödel, Escher, Bach: An Eternal Golden Braid** by Douglas R. Hofstadter.

Live at [hromp.com/geb](https://hromp.com/geb).

## What this is

- **Landing page** — Lists all chapters (Introduction + Chapters I–XX) with short descriptions and links.
- **Per-chapter pages** — Each chapter has:
  - **Reading level switcher:** ELI5, ELI10, ELI20, and Full Text (original chapter in the book PDF).
  - **Left pane:** Explanations at three levels (ELI5/ELI10/ELI20) or the full chapter via embedded PDF.
  - **Right pane:** A unique **interactive companion** for that chapter (e.g. MIU-system toy for Ch I, pq-system checker for Ch II, figure–ground toggle for Ch III).
- **Design** — Vanilla HTML/CSS/JS; shared `shared/style.css` and `shared/nav.js`; fonts: EB Garamond (headings), Inter (body). Color palette and layout follow the project design system.

## Structure

- `index.html` — Landing page (chapter grid).
- `intro/index.html` — Introduction: A Musico-Logical Offering.
- `chapter-01/` … `chapter-20/` — One folder per chapter, each with `index.html`.
- `shared/style.css` — Global styles.
- `shared/nav.js` — Footer, prev/next chapter links, reading-level switcher logic.
- `pdfs/` — One PDF per chapter (intro.pdf, chapter-01.pdf … chapter-20.pdf), used by the Full Text iframe on each page so only that chapter is shown.
- `Hofstadter-GEB.pdf` — Full book PDF (source for generating `pdfs/`).
- `scripts/split_geb_pdf.py` — Script to regenerate `pdfs/` from the full PDF (requires Python 3 and pypdf: `pip install pypdf`). Run from repo root: `python3 scripts/split_geb_pdf.py`.
- `PLAN.md` — Chapter plan (central ideas and companion concepts).

## Build

No build step. Serve the directory as static files (e.g. from `/geb/` on the server). Each chapter page embeds only its segment from `pdfs/`, so the viewer cannot scroll into other chapters.

## License / Credits

The book is by Douglas R. Hofstadter. This companion is a fan-made educational project. The PDF in this repo is from a third-party source (see project history).
