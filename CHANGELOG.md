# Changelog

All notable changes to the GEB Interactive Companion project are documented here. The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and the project uses [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.10.0] — 2026-03-16

### Fixed

- Chapter IX PDF now starts on first page of chapter (was including last page of Chapter VIII); update split script and regenerate pdfs/chapter-08.pdf and chapter-09.pdf.

### Changed

- Chapter IX Gödel companion: add Setup box explaining G and self-reference; display sentence G in a blockquote; replace single-result buttons with two paths—Path 1 “Try to prove G” reveals why no proof exists, Path 2 “Assume G is false” reveals contradiction and that G is true; conclusion box updates as paths are explored and states Gödel’s first incompleteness theorem when both paths are seen.

## [0.9.1] — 2026-03-16

### Changed

- Chapter VIII TNT companion: add “How it works” legend explaining symbols (0, S, +, ·, =) and how to use the builder and Interpret button.

## [0.9.0] — 2026-03-16

### Fixed

- Chapter VIII PDF now starts on first page of chapter (was including last page of Chapter VII); update split script and regenerate pdfs/chapter-07.pdf and chapter-08.pdf.

### Changed

- Chapter VIII TNT companion: replace static text with interactive formula builder (insert 0, S, +, ·, =, parentheses; Back, Clear), Interpret button parses term or equation and shows number value or left=right with true/false; parser supports successor, addition, multiplication, and grouping.

## [0.8.0] — 2026-03-16

### Fixed

- Chapter VII PDF now starts on first page of chapter (was including last page of Chapter VI); update split script and regenerate pdfs/chapter-06.pdf and chapter-07.pdf.

### Changed

- Chapter VII propositional calculus companion: formula selector (P∧Q, P∨Q, ~P, P⊃Q, ~(P∧Q), P↔Q, P⊕Q), live truth table with highlighted current row, result display with truth/false styling, and modus ponens explainer that updates when P⊃Q is selected.

## [0.7.2] — 2026-03-16

### Changed

- Chapter VI encoding companion: default input mode to Binary, default message to 01000001, decoder remains ASCII (binary in, ASCII out).

## [0.7.1] — 2026-03-16

### Fixed

- Chapter III Rubin vase: use same off-white/beige (#e9ddaf) for ground-mode background instead of pure white so it matches the vase color between the two faces.

## [0.7.0] — 2026-03-16

### Changed

- Chapter III Rubin vase companion: replace inline path with Inkscape-derived SVG (background rect, rounded vase rect, two face-profile paths); keep figure/ground toggle by swapping only background fill (black ↔ white); script updates background only.

## [0.6.0] — 2026-03-16

### Changed

- Chapter III Rubin vase companion: rebuild from scratch using a single SVG path (300×420 viewBox) that reads as vase or two face profiles; “See figure (vase)” shows white shape on black background, “See ground (faces)” shows black shape on white background (same path, only fill and background colors swap); buttons update state and invert the SVG colors; add 0.3s ease transition on fill; label below shows “Figure: the vase.” or “Ground: the faces.”.

## [0.5.0] — 2026-03-16

### Changed

- Chapter III Rubin vase companion: redraw contour so the shape reads clearly as a vase (narrow neck, wide body, base) and the dark regions read as two faces in profile; add drop-shadow filter when “See figure (vase)” is active and thick gold stroke on contour when “See ground (faces)” is active so the buttons have an obvious visual effect.

### Fixed

- Chapter III figure/ground buttons now update the display (filter and stroke) and guard against missing elements so the script does not fail silently.

## [0.4.0] — 2026-03-15

### Fixed

- Chapter VI PDF now starts on first page of chapter (was including last page of Chapter V); update split script STARTS and regenerate pdfs/chapter-05.pdf and chapter-06.pdf.

### Added

- Chapter VI message–decoder companion: user-editable message, input mode (ASCII/text, Binary, Hex, Decimal, Octal, Base64) and decoder/show-as (same six options); convert between any input and output pair (e.g. input ASCII "A", decoder Binary → "01000001").

## [0.3.0] — 2025-03-15

### Changed

- Default reading view on intro and all chapter pages to Full Text (was ELI5); ELI5/10/20 still available via tabs; saved preference in localStorage still applied when set.
- Chapter III figure/ground companion: replace separate vase and face shapes with a single Rubin vase illusion (one contour read as vase or two faces); toggle highlights which interpretation to see.

### Added

- Landing page link to complete book PDF (Hofstadter-GEB.pdf).
- Per-chapter PDFs in `pdfs/` (intro.pdf, chapter-01.pdf … chapter-20.pdf) so the Full Text viewer shows only the current chapter.
- `scripts/split_geb_pdf.py` to regenerate `pdfs/` from `Hofstadter-GEB.pdf` (pypdf required).

### Changed (0.2.x)

- Full Text iframe now embeds the segment PDF for that page (e.g. `../pdfs/chapter-01.pdf`) instead of the full book with `#page=N`.
- Correct PDF start pages in `shared/nav.js` so chapter boundaries align with the first page of each chapter (fixes “starting a page after” when using full PDF elsewhere).

### Fixed (audit pass)

- Fix footer "All chapters" link on Introduction page (use ../index.html when on any chapter, including intro).
- Fix MIU rule labels in Chapter I (Rule I: Mx to Mxx, Rule II: xI to xIU).
- Fix recursive tree stroke color in Chapter V (use hex #2e6b8a; canvas 2D context does not resolve CSS variables).
- Add pointer-events="none" to Chapter XX diagram text so circle clicks register.
- Add aria-label="Reading level" to reading switcher on chapters 6, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20.
- Remove unused homeHref from shared/nav.js.
- Fix Chapter X iframe title (was "Chapter VIII", now "Chapter X").
- Use correct spelling "Gödel" (with umlaut) throughout the project (chapters 9, 13–20, CHANGELOG).
- Add "The full chapter appears in the book. Read it in the PDF below." to Full Text panels on Chapters VI, IX, XI, XII (was missing).
- Standardize all chapter iframe titles to "Chapter N — full text (PDF)" (Chapters IX, XI–XX).
- Add aria-selected="false" to inactive reading-level tabs on chapters 6, 11–20 for accessibility.
- Add EB Garamond italic variant (1,400) to font preload on chapters 6, 11–20 for consistent typography.
- Add "Built with care." to site footer (shared/nav.js) per project spec.

## [0.2.0] — 2025-03-15

### Added

- Complete chapter-specific ELI5, ELI10, and ELI20 summaries for Chapters XIII through XX (replacing placeholder content).
- Unique interactive companions for Chapters XIII–XX: BlooP vs FlooP (bounded/unbounded search), Gödel sentence step-through, Inside/Outside jump, quine toy, 3n+1 halting demo, same-task three levels, Birthday party frame slots, Bach–Escher–Gödel loop diagram.

## [0.1.0] — 2025-03-15

### Added

- Add landing page (`index.html`) with book title, short description, ELI reading-level note, and chapter grid linking to intro and chapters I–XX.
- Add shared design system: `shared/style.css` (colors, typography, two-pane layout, reading switcher, chapter nav, footer) and `shared/nav.js` (CHAPTERS data, footer injection, prev/next links, reading-level switcher with localStorage).
- Add Introduction page (`intro/index.html`) with ELI5/ELI10/ELI20 summaries and Full Text (PDF iframe), and Strange-loop explorer companion (Bach / Escher / Gödel).
- Add Chapter I (MU-puzzle) page with ELI5/ELI10/ELI20, Full Text PDF, and MIU-system interactive companion (rules I–IV, reset, derivation log).
- Add Chapter II (Meaning and Form) page with pq-system checker companion (input pq-string, check theorem, show interpretation).
- Add Chapter III (Figure and Ground) page with figure–ground companion (vase vs two faces toggle).
- Add Chapter IV (Consistency, Completeness, and Geometry) page with geometry curvature slider (flat vs curved triangle).
- Add Chapter V (Recursive Structures) page with recursive tree canvas (depth slider).
- Add Chapter VI (Location of Meaning) page with message–decoder companion (same binary string, ASCII vs number decoder).
- Add Chapter VII (Propositional Calculus) page with P-and-Q truth toggles.
- Add Chapter VIII (TNT) page with TNT formula example (S0+S0=SS0).
- Add Chapter IX (Mumon and Gödel) page with Gödel sentence companion (Try to prove G / Assume G false).
- Add Chapter X (Levels of Description) page with level 0 / level 1 add-machine companion.
- Add Chapter XI (Brains and Thoughts) page with neuron-row companion (toggle cells, Step rule).
- Add Chapter XII (Minds and Thoughts) page with symbol-in-context companion (arrow vs fifth item).
- Add Chapter XIII (BlooP and FlooP and GlooP) with chapter-specific ELI5/ELI10/ELI20 and BlooP vs FlooP companion (bounded vs unbounded search, same predicate).
- Add Chapter XIV (On Formally Undecidable Propositions) with ELI text and Gödel sentence step-through companion (three steps plus TRUE but not PROVABLE verdict).
- Add Chapter XV (Jumping out of the System) with ELI text and Inside vs Outside companion (toggle view, jump out to see G is true).
- Add Chapter XVI (Self-Ref and Self-Rep) with ELI text and quine companion (editable source, run outputs self; change one character to break reproduction).
- Add Chapter XVII (Church, Turing, Tarski) with ELI text and halting companion (3n+1 rule, pick n, run with step cap, show sequence and verdict).
- Add Chapter XVIII (AI Retrospects) with ELI text and same-task-different-level companion (sort three numbers: human / rules / code, run to see result).
- Add Chapter XIX (AI Prospects) with ELI text and frame-slots companion (Birthday party: who, when, where, cake?; Infer defaults).
- Add Chapter XX (Strange Loops) with ELI text and Bach–Escher–Gödel loop diagram (click node to highlight loop and caption).
- Add `PLAN.md` with chapter list, central ideas, companion concepts, and implementation order.
- Add `VERSION` and `CHANGELOG.md`.
