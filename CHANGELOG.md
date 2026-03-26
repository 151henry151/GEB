# Changelog

All notable changes to the GEB Interactive Companion project are documented here. The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and the project uses [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.15.39] — 2026-03-25

### Changed

- Chapter 16 companion: add live **Match %** and side-by-side **Source / Output** diff (amber mismatches, red dash placeholders) with title “Output ≠ Source — not a quine”; green **OUTPUT = SOURCE** panel when equal; **fold-back** animation on **Run** when the quine matches; **Sound familiar?** Gödel callout (gold border); collapsible **How does this work without being circular?** with three steps and SVG; **The same structure in biology** comparison table plus dual-role SVG with golden loop and **animateMotion** dot; collapsible **Why this matters** closing panel; **DOUBLE-BUBBLE** and **ONE-STEP FAILURE** presets (auto-run + explanatory notes); extract **`quine-logic.js`** / **`ch16-companion.js`** with `quine-logic.test.js`; align **ENIUQ** simulated output with program source using `\n['` between template copies so the default quine matches.

## [0.15.38] — 2026-03-25

### Changed

- Chapter 15 companion: replace the single “Jump out” toggle with a three-part experience — **Inside and outside** (480×300 SVG box/field, proof-search tree, glowing G, Enter / Jump out with camera transform, staggered callouts, inside/outside table), **Infinite tower** (Add G as axiom up to G‴ with ellipsis and ∞), and **Lucas trap** (stepped argument, rebuttal stages, machine diagram, upgrade loop animation, verdict table); add capstone reveal after all three sections complete; add `ch15-companion.js` and wire it with a version query string.

## [0.15.37] — 2026-03-25

### Changed

- Chapter 14 companion: replace MIU proof-pair UI and two-button G demo with a three-act flow — **Act 1** TNT symbol builder with code table, **Encode** step animation (highlight → badges → prime product → large Gödel number) and **Decode** (after first encode) reversing losslessly; **Act 2** `Proof(m, n)` definition card and example table (third row updates after Act 3); **Act 3** six-step **Next →** reveal (fixed point, SVG golden self-loop with draw animation, branching SVG diagram, consistency capstone) plus delayed capstone lines.
- Chapter 14: add progress dots, act separators (“Step 2 of 3” / “Step 3 of 3”), palette per act, new companion caption, and `ch14-companion.js` loaded with a version query string.
- Chapter 14 Act 3 step 5: redraw the branching SVG with a **G** node, stem, fork dot, **L-shaped** paths to the midpoints of each case box, and **horizontal** connectors into the red and gold terminal boxes (aligned layout, consistent markers).

## [0.15.35] — 2026-03-25

### Changed

- Chapter 13: remove preset/custom radio mode—predicate field is always visible; **Quick fill** chips set the input (classic demos plus example predicates).
- Chapter 13: bound **N** constrained to **3–30** (default 10) with visible range hint and tip for `n * n == 144` vs BlooP’s lid.
- Chapter 13: add meter subtitles (**primitive recursive** / **general recursive (μ-recursive)**) and a short **computability** paragraph tying BlooP/FlooP to those tiers.
- Chapter 13: append `?v=0.15.35` to local script URLs so browsers fetch `predicate-eval.js` and `ch13-companion.js` instead of stale cached copies.

## [0.15.34] — 2026-03-25

### Changed

- Chapter 13 (`index.html`, new `ch13-companion.js`): animate BlooP and FlooP searches step-by-step with a scrollable log, **Search speed** slider (slow through instant), **Stop** control, BlooP **LID = N** bar with hit bounce, FlooP **∞** header, live **Checking: n = …** readouts, danger zone after 25 steps with pulsing red background, and a 60-step demo cap message.
- Replace the halting demo with **Build a Halting Oracle — then break it.**: four oracle cards, phased **Destroyer** card with SVG flowchart, thinking delay, verdict flicker, **ERROR: CANNOT DETERMINE**, and explanatory captions.
- Rework the Gödel panel into a **Next →** step reveal (with FlooP meter gold flash on step 3, panel glow and slow-fade conclusion on step 5); add **Try this** predicate chips, short predicate help copy, collapsible **GlooP** pseudo-code block, and updated companion captions.

## [0.15.33] — 2026-03-24

### Changed

- Chapter 12 Two Minds (`two-minds.js`): model Mind A and Mind B as **directed** graphs with the twelve shared concept labels; give each mind the specified default edge lists (skip invalid warmth→comfort), identical fractional node positions on a 320×340 viewBox, and weight-based edge stroke widths.
- Make resonance a smoothed live readout from per-concept activation agreement (`1 − |Δ|`), tier labels and thermometer colors by band, em dash when idle; during **Becoming Similar** with no activations, drive the meter from **edge-weight agreement** so it rises as Mind B lerps toward Mind A.
- Fix directed edge editing: add/remove by `(from, to)`, edge hit targets use `data-from` / `data-to`, floating weight slider uses `from`/`to`; set preset auto-fire delays to 500ms; load Strangers with Mind A defaults and contrasting Mind B; remove dead becoming-map state.
- Update the chapter-12 companion caption for **Ctrl+click** (source then target); add a 1.5s onboarding pulse and “Try clicking here.” on **coffee** in Mind A (dismiss on first click in the companion); add `@keyframes` for the hint ring in `index.html`.

## [0.15.32] — 2026-03-24

### Changed

- Chapter 12 Two Minds: double SVG node label size (25px), center labels with `dominant-baseline="middle"`, enlarge node circles slightly, and scale label outline strokes for readability.

## [0.15.31] — 2026-03-24

### Changed

- Chapter 12 companion: use the shared light companion styling (white panel, `var(--text)` / `var(--border)` / `var(--panel)` / `var(--muted)`) instead of a dark outer shell; drop custom preset button colors so global secondary buttons match other chapters.

## [0.15.30] — 2026-03-24

### Changed

- Chapter 11 (`brains-thoughts.js`): stop unbounded reverberation by decaying EPSP in every neuron state and integrating excitatory synaptic input only while the target is resting (with a small EPSP cap and slightly faster decay).

## [0.15.29] — 2026-03-24

### Changed

- Chapter 12 companion: increase contrast for SVG node labels (larger bold type, white stroke halo, state-specific fills for rest / active / both-minds) and for preset `Reset` buttons on the dark panel (light button background and dark text); lighten companion copy and legend text for readability on the dark outer companion.

## [0.15.28] — 2026-03-24

### Changed

- Chapter 11 (Brains and Thoughts): replace the dual-mode toggle with a single 500×380 canvas, stacked neural and symbolic SVG layers cross-faded by a continuous “Neurons ↔ Thoughts” slider; add 60 spiking neurons in five Hebbian assemblies (dense intra, sparse inter, inhibitory interneurons), optional brain outline and “show regions” hint, signal dots on edges, coherence detection with first-time “same event” overlay (persisted via `localStorage`), three ordered narrative presets, dual bottom captions keyed to slider position, active-pattern readout bars, and secondary concept triggers with optional button subtitles (`brains-thoughts.js`).

## [0.15.27] — 2026-03-24

### Changed

- Chapter 12 Two Minds companion (`two-minds.js`): use distinct default graphs for Mind A and Mind B, blue/rose node styling with gold when both minds activate a node, weighted edge stroke widths and invisible hit targets, resonance mean over active nodes only with smoothed display plus thermometer and tier labels, horizontal pill readout, context captions after ripples, preset scenarios with delayed auto-fire and a ~3s “Becoming Similar” morph of Mind B toward Mind A, and edge editing via Ctrl/Cmd+click to add links, Shift+click to remove, and click-to-edit weight with a floating slider.

## [0.15.26] — 2026-03-15

### Added

- Chapter 13: `predicate-eval.js` and `predicate-eval.test.js` for safe evaluation of user predicates in `n` (run tests with `node chapter-13/predicate-eval.test.js`).

### Changed

- Chapter 13 companion: replace horizontal cell strips with vertical search-depth meters (BlooP vs FlooP), add preset and custom-predicate modes, add Gödel “why it matters” stepped panel and halting-predictor cards.

## [0.15.25] — 2026-03-15

### Changed

- Chapter 11 (Brains and Thoughts): replace the one-dimensional cellular automaton with the neuron-and-symbol companion (firing cascade, concept bubbles, neuron vs symbol mode, reductionism toggle) and light-themed styling for both views.
- Point `prompts/GEB_continue_improvement.md` at `GEB/prompts/GEB_companion_rebuild_spec.md` for the spec path.

## [0.15.24] — 2026-03-17

### Changed

- Chapter X (Ant Fugue): redraw zoomed-in ants with a clearer ant silhouette, including distinct body segments, six legs, and antennae, while keeping the colony view as small dots.

## [0.15.23] — 2026-03-17

### Changed

- Chapter X (Ant Fugue): render ants as ant-shaped silhouettes in the zoomed-in view and keep them as tiny dots in the colony view while preserving per-ant variation in body shape and leg motion.

## [0.15.22] — 2026-03-17

### Changed

- Chapter X (Ant Fugue): release all ants from the nest at once, vary each ant’s speed and squiggle profile independently, and keep trail-following local so the motion reads as many distinct ants instead of a shared sway.

## [0.15.21] — 2026-03-17

### Changed

- Chapter X (Ant Fugue): remove the food-directed prebias from searching ants, require a closer pheromone encounter before trail-following starts, and keep the return path wiggly without forcing a corridor band.

## [0.15.20] — 2026-03-17

### Changed

- Chapter X (Ant Fugue): release ants from the nest one at a time on staggered intervals, make searching ants wander first and only lock onto pheromone when they come close, and strengthen the return trail so the corridor forms from repeated trips rather than from a fixed middle band.

## [0.15.19] — 2026-03-17

### Changed

- Chapter X (Ant Fugue): replace the per-ant lane pull with a shared corridor center, strengthen the food/nest steering, and increase pheromone-following weight so the trail stays narrow and stretched instead of blooming into a spiral.

## [0.15.18] — 2026-03-17

### Changed

- Chapter X (Ant Fugue): add a per-ant home-lane pull to keep the zoomed stream inside the corridor, reduce vertical drift toward the crop edge, and preserve two visibly populated directions.

## [0.15.17] — 2026-03-17

### Changed

- Chapter X (Ant Fugue): increase the ant population to keep a steadier stream across the zoomed corridor, slow the ants down, and spread their starting positions more widely so the two directions stay visibly populated.

## [0.15.16] — 2026-03-17

### Changed

- Chapter X (Levels of Description, and Computer Systems): keep the right-side Level 2 dashboard as one uninterrupted column, move the FA explanation callout into the lower-left grid area, and retain the carry bus, FA row, and sum rails as a coordinated physical-signals display.
- Chapter X (Ant Fugue): zoom the ant view into the central corridor, render ants as black dots in both views, spread the ant stream across the visible band in two opposing directions, and increase wandering so the ants stray farther from the center line while still reading as a colony-level trail.

## [0.15.15] — 2026-03-15

### Changed

- Chapter IX (Mumon and Gödel): show theorem text G in a persistent banner above phase content so it remains visible during corridors, chamber, and MU while explanations unfold.

## [0.15.14] — 2026-03-18

### Changed

- Chapter VIII (Typographical Number Theory): retitle Gödel section to "Every Formula Is Also a Number"; add "Why primes?" callout (Fundamental Theorem of Arithmetic, unique reversible encoding); highlight prime bases in the Gödel product and show "Primes by position" line; add "Why this creates self-reference" block and closing footer after animation; extend derivation encoding for ∀, a, b, : on axiom lines.

- Chapter VIII (Typographical Number Theory): replace derivation chain with axiom selector (four preset axioms with meanings and Gödel numbers), rule palette (Specification, Successor, Symmetry, Transitivity, Add S to both sides) with applicability highlighting and tooltips, scrollable chain with justification tags, numeric interpretations, Gödel badges, line selection for Transitivity, Reset, "You just proved" summary, three "Watch" preset derivations (1+0=1, 1+1=2, 2=2), and capstone text after three lines linking proofs to Gödel-numbered sequences.

## [0.15.13] — 2026-03-17

### Changed

- Chapter VIII (Typographical Number Theory): add Gödel numbering panel with symbol table (0→1, S→2, +→3, ·→4, =→5, (→6, )→7), "Assign Gödel number" button, animation showing symbol codes then prime-power product and result, and updating captions. Add derivation chain with three preset axioms (0+0=0, S0+0=S0, 0+S0=S0), "Derive" button that applies "add S to both sides" to append theorem lines, and chain display with labels. Update companion caption to mention Gödel number and derivation chain.

## [0.15.12] — 2026-03-17

### Fixed

- Chapter VII (Propositional Calculus): rename parser right-subtree variable from `r` to `rFn` in `parseAnd`, `parseOr`, and `parseImpl` so the evaluation closure no longer shadows the `r` parameter (truth value for R), fixing "r is not a function" and enabling build-your-own formulas with ∧, ∨, ⊃ to evaluate and display truth tables correctly.

### Changed

- Chapter VII (Propositional Calculus): treat build mode as implication when the built formula is P⊃Q so the modus ponens explanation and "Show modus ponens" button work in Build your own; update fallback message to "Build P⊃Q (click P, then ⊃, then Q) or switch to Preset to see modus ponens."

## [0.15.11] — 2026-03-16

### Changed

- Chapter VI (The Location of Meaning): keep existing encoding converter companion at top. Add "The Decoder's Gift" below: Panel 1 fixed abstract marks (triangle/circle/line SVG); Panel 2 three decoders (A: shapes → number, B: shapes → melody via Web Audio, C: shapes → compass path on canvas); Panel 3 "Lose the decoder" grays decoders and shows [unknown] with contextual captions. Add Scramble order and Reset order for the mark sequence; add Reset button to restore from lost state and reset sequence.

## [0.15.10] — 2026-03-16

### Changed

- Chapter V (Recursive Structures and Processes): add three-panel companion with unifying caption. Recursive tree: single Grow click animates through all levels (1.5 s between levels), max depth 10, larger canvas (320×280) and scaled geometry for visibility; re-enable Grow when slider is moved below max after full grow. Recursion in language: clause-by-clause nesting with highlighted relative clauses, Add Nesting button switches to Reset at max nesting (Reset restarts from first sentence). Trace the call stack: factorial(4) Step/Reset with explainer text describing push/unwind; green styling for returned frames.

## [0.15.9] — 2026-03-16

### Changed

- Chapter IV (Consistency, Completeness, and Geometry): add Part 1 Consistency/Completeness Machine with two scenarios (incomplete system: axioms P, Q, P→R and statements P, Q, R, ¬P, S; inconsistent system: P, ¬P, Q and statements P, ¬P). Show axioms as colored tiles; present statements one at a time with PROVABLE / DISPROVABLE / NEITHER buttons; show INCOMPLETE (yellow) or INCONSISTENT (red) badge and contextual caption; add closing line on arithmetic. Reframe geometry as Part 2: Same Axioms, Different Worlds; add live angle-sum readout to slider; add three contextual captions per spec.

## [0.15.8] — 2026-03-16

### Changed

- Chapter III (Figure and Ground): remove figure/ground toggle buttons; add discover-by-click (left/center/right highlights face/vase/face with label). Add Part 2: formal-systems widget with Figure (theorems) list that auto-fills, Ground column as ???, and "Can we list the ground?" button with typing animation. Update caption for discovery. Keep existing SVG and light color scheme.

## [0.15.7] — 2026-03-16

### Changed

- Chapter I (MU-puzzle): add live I-count badge (green when not divisible by 3, red when divisible by 3). Add Step outside button after 5 moves with overlay and I-count history sparkline. Add progress bar for reaching MU (I-count ≡ 0 mod 3). Shorten companion caption to end at "Try to reach MU."

## [0.15.6] — 2026-03-16

### Changed

- Chapter II (Meaning and Form): replace pq-string text input with visual builder (three rows: hyphens before p, between p and q, after q; +/- buttons). Add two-panel layout (form vs meaning); meaning panel starts blurred, Interpret reveals theorem/not only (no arithmetic). After five Interpret clicks, show Explain button to reveal addition fact. Add Random theorem button. Update caption to avoid revealing addition before Explain.

## [0.15.5] — 2026-03-16

### Changed

- Introduction companion: add Bach tab with self-hosted first-track audio and inline player; add Escher tab with self-hosted Ascending and Descending image and staircase text; add Gödel tab with KaTeX-rendered equation. Override intro companion box min-height and hide empty result area so box fits the three buttons when idle. Add cdn.jsdelivr.net to CSP font-src for KaTeX.

## [0.15.4] — 2026-03-16

### Changed

- Scale PDF viewer to fit viewport so the full page is visible without scrolling; add ResizeObserver to re-fit on resize. Commit pdfs/chapter-16.pdf.

## [0.15.3] — 2026-03-16

### Changed

- Replace PDF iframe with PDF.js-based canvas viewer for Full Text on all chapter pages and intro. Add shared/pdf-viewer.js (loads PDF via Mozilla PDF.js from CDN, renders current page to canvas with Prev/Next and page indicator). Ensures reliable display on all devices including Chrome on Android where iframe PDF often fails. Remove iframe fallback link from nav.js; viewer shows fallback link if PDF fails to load.

## [0.15.2] — 2026-03-16

### Changed

- Replace all ELI5, ELI10, and ELI20 chapter summaries with rewritten copy (intro and chapters I–XX). Update ELI-summaries.md in repo to the same rewritten text. Add scripts/import_eli_summaries.py to import from a markdown file into chapter HTML.

## [0.15.1] — 2026-03-16

### Changed

- Chapter XII (Minds and Thoughts) isomorphism companion: make networks editable (click two nodes to add a link, Shift+click a link to remove); add live isomorphism check and structure-preserving mapping display; add chapter quotes on partial isomorphism and "does not exist between any pair of human beings"; add "Propose your mapping" section with dropdowns and "Check this mapping" with feedback for invalid or non-structure-preserving pairings.

## [0.15.0] — 2026-03-16

### Changed

- Chapter XII (Minds and Thoughts): replace symbol-grounding companion with <strong>isomorphism</strong> companion. Two side-by-side symbol networks (same graph structure, different node labels: e.g. cat/dog/run/animal/move vs chat/chien/courir/animal/bouger). “Show isomorphism (pair nodes)” reveals the structure-preserving one-to-one mapping with matching colors and a short explanation that isomorphism = same structure/different names and that partial isomorphism between brains explains how we understand each other.

## [0.14.9] — 2026-03-16

### Changed

- Chapter XIV companion: replace static step-through with interactive demo. (1) MIU proof-pair: user enters 4-line MIU derivation; Check validates rules and shows Gödel numbers m, n and “proof-pair.” (2) Gödel sentence G: “Try to prove G” runs a short proof-search then explains why no proof exists; “So G is true (from outside)” explains TRUE but not PROVABLE and incompleteness.
- Chapter XIX companion: make frame slots work as intended. Infer now fills empty slots with default values in the inputs; result shows bullet list with “(default)” beside inferred slots; add “presents?” slot and Reset button; improve labels and layout.

## [0.14.8] — 2026-03-16

### Fixed

- Chapter XVIII PDF: start one page earlier (601) so the first page of the chapter is included; was missing the first page.
- Chapter XIX PDF: start two pages later (649) so the first two pages of the previous chapter are trimmed off.

## [0.14.7] — 2026-03-16

### Changed

- Chapter XX companion: remove “Eternal Golden Braid” (Bach/Escher/Gödel) section; keep only Tangled Hierarchy interactive (board, token, move/change rule).

## [0.14.6] — 2026-03-16

### Fixed

- Chapter XVII, XVIII, XX PDFs: correct start pages so each opens on the first page of the chapter. XVII +1 (566), XVIII +2 (602), XX +2 (692). Updated STARTS in scripts/split_geb_pdf.py and pdfPage in shared/nav.js; regenerated chapter-17, 18, 19, 20 PDFs.

### Changed

- Chapter XX (Strange Loops): replace static diagram with two interactive sections. (1) <strong>Eternal Golden Braid</strong>: click Bach / Escher / Gödel to see the strange loop in each domain—Bach canon animation (rise and return), Escher Drawing Hands sketch, Gödel sentence with “Try to prove it” and explanation. (2) <strong>Tangled Hierarchy</strong>: 3×3 board with one token; on your turn you may move the token (rule determines valid moves) or change the rule (cycle through five rules). Illustrates the chapter’s “rules that change themselves” and collapse of game vs metarules.

## [0.14.5] — 2026-03-16

### Fixed

- Chapter XIV, XV, and XVI PDFs: correct start pages so each opens on the first page of the chapter (not the last page of the previous chapter). Updated STARTS in scripts/split_geb_pdf.py and pdfPage in shared/nav.js; regenerated pdfs/chapter-14.pdf, chapter-15.pdf, chapter-16.pdf.

## [0.14.4] — 2026-03-16

### Changed

- Chapter XVI quine companion: make program source editable (textarea); Run compares output to current program source; Reset and DOUBLE-BUBBLE set both source and template; hint updated so user can edit either.

## [0.14.3] — 2026-03-16

### Changed

- Chapter XVI (Self-Ref and Self-Rep): replace quine companion with ENIUQ-based interactive. Show two-part structure (instructions vs template) from the chapter; program source displays definition plus template in brackets with template highlighted; editable template with “Run ENIUQ” (output = template + " ['" + template + "]."), “Reset to quine”, and “Try: DOUBLE-BUBBLE” preset; verdict explains self-reproduction when template is quine and output ≠ source when template is changed; explainer describes Quine construction (instructions + data) and one string as program and data.

## [0.14.2] — 2026-03-16

### Changed

- Chapter XIII BlooP/FlooP companion: add problem selector—“Has solution” (n &gt; 2 and n even, answer 4) vs “No solution” (n &gt; 0 and n &lt; 0; FlooP never halts); make bound N a labeled control (N = input); when “No solution” is selected, FlooP animates 20 steps then shows “no match … would run forever (never halt).”

## [0.14.1] — 2026-03-16

### Changed

- Chapter XIII BlooP/FlooP companion: add “What you’re seeing” explainer; visual search strips for BlooP and FlooP with step-by-step animation (checked/found/bound states); BlooP strip shows BOUND at N and stops at or before N; FlooP strip has no bound and animates until found; tip to set N=3 to see BlooP “not in range” while FlooP finds 4; separate result area and CSS for strip cells.

## [0.14.0] — 2026-03-16

### Changed

- Standardize and expand ELI5, ELI10, and ELI20 explanations across Introduction and all twenty chapters. ELI5: single short paragraph, age-5 accessible, core idea only. ELI10: roughly 3–4× length of ELI5, age-10 accessible, accurate core meaning with 2–4 subsections. ELI20: roughly 3–4× length of ELI10, in-depth and accurate, slightly simplified from full chapter, age-20 accessible. Rewrote all panels for consistency, clarity, and correct length ratios; added script scripts/update_eli_texts.py for batch updates (used for Chapter V).

## [0.13.1] — 2026-03-16

### Fixed

- Chapter XII PDF now starts on first page of chapter (was including last page of Chapter XI); update split script and regenerate pdfs/chapter-11.pdf and chapter-12.pdf.

### Changed

- Chapter XII symbol companion: remove S/E labels from grid (use color only for start path and end cell); rename “Symbol grounding” to “What this shows” and tighten copy; rename “Context 1/2” to “Interpretation 1: As directions” and “Interpretation 2: As position numbers” with short explanations (start at center, path = where you go, darker = end; position code ↑=5 etc.); add “Your message” and “Read as” / “Decoded” labels for clarity.

## [0.13.0] — 2026-03-16

### Changed

- Chapter XII symbol-grounding companion: replace static text with interactive companion; add “Symbol grounding” explainer; message builder with ↑ ↓ → ← buttons and Clear; same message decoded in two contexts—Context 1 (arrows) shows direction names and a 5×5 grid with path from start to end, Context 2 (sequence) maps symbols to positions 1–5 and shows decoded sequence; switch full-text iframe to per-chapter PDF (chapter-12.pdf).

## [0.12.3] — 2026-03-16

### Changed

- Chapter XI neuron companion: reduce chain from 20 to 12 cells.

## [0.12.2] — 2026-03-16

### Changed

- Chapter XI neuron companion: restore rule to “a cell turns ON if it has at least two neighbors that are ON” (was temporarily “at least one”); update caption, How it works, and step label; set default pattern so a first Step fills in gaps (e.g. 1,0,1 → 1,1,1).

## [0.12.1] — 2026-03-16

### Fixed

- Chapter XI PDF now starts on first page of chapter (was including last page of Chapter X); update split script and regenerate pdfs/chapter-10.pdf and chapter-11.pdf.

## [0.12.0] — 2026-03-16

### Fixed

- Chapter XI neuron companion: Step button now applies the rule on every click (rule changed from “2+ neighbors” to “at least one neighbor on” so activation spreads over multiple steps).

### Changed

- Chapter XI neuron companion: expand from 8 to 20 cells; add “How it works” explainer and step counter; add Reset button; switch full-text iframe to per-chapter PDF (chapter-11.pdf).

## [0.11.0] — 2026-03-16

### Fixed

- Chapter X PDF now starts on first page of chapter (was including last page of Chapter IX); update split script and regenerate pdfs/chapter-09.pdf and chapter-10.pdf.

### Changed

- Chapter X levels companion: replace static text with interactive level-stack; add “Levels of description” explainer; number inputs for A and B (0–15); Step button to run LOAD A → ADD B → STORE C one instruction at a time; Reset button; Level 0 shows goal and live values (A, B, C); Level 1 shows three instructions with current step highlighted and accumulator/C; Level 2 shows same values in binary; step label describes each phase.

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
