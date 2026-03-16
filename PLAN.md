# GEB Interactive Companion — Chapter Plan

## Design system
- **Colors:** background #f7f4ef, text #1a1a2e, accent #b5873b, secondary #2e6b8a, panel #eeeae3, border #d4cfc7, true #3a7d44, false #8b3a3a, undefined #7a6b3a
- **Fonts:** EB Garamond (headings), Inter (body/UI), monospace (logic/code)
- **Layout:** Two-pane (60% left: text + reading switcher; 40% right: companion). Stack on small screens.

## PDF page ranges (for Full Text iframe)
From TOC; PDF may use same printed page numbers in footer.
- intro: 10–28 (first content page through end of intro)
- ch01: 33–42, ch02: 46–60, ch03: 64–74, ch04: 82–102, ch05: 127–152, ch06: 158–176, ch07: 181–203, ch08: 204–230, ch09: 246–274, ch10: 285–310, ch11: 337–365, ch12: 369–390, ch13: 406–430, ch14: 438–460, ch15: 465–479, ch16: 495–548, ch17: 559–585, ch18: 594–632, ch19: 641–680, ch20: 684–719

---

## Introduction: A Musico-Logical Offering
- **Central idea:** Self-reference and strange loops link Bach (canons, Musical Offering), Escher (impossible figures, Drawing Hands), and Gödel (incompleteness). The book is a “Metamusical Offering” that improvises on these themes.
- **Companion:** **Strange-loop explorer** — User picks Bach / Escher / Gödel; see one concrete example (e.g. “Canon per Tonos”, Drawing Hands, liar sentence) with a one-line explanation. Optional: play a “crab canon” by toggling two lines that read the same forward/backward.

---

## Chapter I: The MU-puzzle
- **Central idea:** A formal system (MIU-system) with strings, axioms, and rules. Working “inside” vs “outside” the system; decision procedures. You cannot derive MU from MI by the given rules.
- **Companion:** **MIU-system toy** — Start with “MI”. Buttons: Rule I (double after M), Rule II (U→UU), Rule III (III→U), Rule IV (UU→remove). Derivation history. Goal: try to get “MU”. Illustrates rule application and the fact that MU is not derivable.

---

## Chapter II: Meaning and Form in Mathematics
- **Central idea:** The pq-system is meaningless by itself; “meaning” (addition) emerges from the form of theorems (isomorphism with number theory). Meaning and form are tied together.
- **Companion:** **pq-system explorer** — Enter p, q, hyphens; “Check theorem” validates form (e.g. --p---q-----). Optional: “Interpret” shows the addition fact (2+3=5). Add axioms and see generated theorems to feel the isomorphism.

---

## Chapter III: Figure and Ground
- **Central idea:** Figure vs ground in art and in formal systems (theorems vs nontheorems). Recursively enumerable vs recursive sets; the “figure” (theorems) may not fully determine the “ground” (nontheorems) in a computable way.
- **Companion:** **Figure–ground flip** — One Escher-like image (or simple shape) with a clear figure/ground. Toggle “See figure” / “See ground” to flip perception. Short caption on how this mirrors theorems vs non-theorems.

---

## Chapter IV: Consistency, Completeness, and Geometry
- **Central idea:** Consistency (no contradiction) vs completeness (every true statement provable). Non-Euclidean geometry as an example of consistent but “rival” systems; undefined terms and interpretation.
- **Companion:** **Geometry switcher** — Two “worlds”: Euclidean vs simple hyperbolic (e.g. Poincaré disk). Same “line” and “triangle” controls; user draws a line or triangle and sees how it looks in each geometry. Shows same axioms, different interpretation.

---

## Chapter V: Recursive Structures and Processes
- **Central idea:** Recursion everywhere: definitions that refer to themselves, fractals, grammar, programs. Same pattern at many scales.
- **Companion:** **Recursive tree** — Slider for depth. Click “Grow” to see a tree that branches and repeats the same branching pattern to that depth. Optional: change branching factor to feel recursion.

---

## Chapter VI: The Location of Meaning
- **Central idea:** Meaning is not “in” the message alone; it’s in the relation between message, decoder, and context (e.g. DNA, phonograph records, undeciphered script).
- **Companion:** **Message–decoder–receiver** — Three boxes: “Message” (e.g. a string or pattern), “Decoder” (choose: “Numbers”, “Letters”, “Morse”), “Output”. Changing decoder changes “meaning” of the same message. Shows meaning as relational.

---

## Chapter VII: The Propositional Calculus
- **Central idea:** Propositional logic as a formal system; symbols get meaning via rules and isomorphism with truth values. Formal manipulation and “meaning” align.
- **Companion:** **Propositional truth toy** — Input a small formula (e.g. P∧Q, ¬P→Q). Assign T/F to P, Q with toggles; see result highlight (green/red). Optional: one “derivation” step (e.g. given P and P→Q, conclude Q).

---

## Chapter VIII: Typographical Number Theory (TNT)
- **Central idea:** Arithmetic encoded as symbol manipulation; axioms and rules; every theorem is a number-theoretic truth. Setting up for Gödel.
- **Companion:** **TNT formula builder** — Buttons: 0, S, +, ·, =, variables. Build a term or equation (e.g. S0+S0=SS0). “Interpret” shows the number fact. Feel that form encodes number.

---

## Chapter IX: Mumon and Gödel
- **Central idea:** Gödel’s construction: a statement that says “I am not provable.” Paradox is avoided by distinguishing proof-in-the-system from truth. Zen and “mu” as a hint.
- **Companion:** **Self-referential sentence** — One sentence: “This sentence is not provable in this system.” Buttons: “Try to prove it” (fails), “Assume it’s false” (leads to contradiction). Text explains: so it’s true but unprovable.

---

## Chapter X: Levels of Description, and Computer Systems
- **Central idea:** Multiple levels of description (hardware, machine code, high-level program); “tangled” levels and how systems can describe or run other systems.
- **Companion:** **Level stack** — A simple “machine” (e.g. add two numbers). Show level 0: “add”, level 1: “LOAD A; ADD B; STORE C”, level 2: binary. User clicks “Step” at one level and sees corresponding effect at other levels. Illustrates same process, different description.

---

## Chapter XI: Brains and Thoughts
- **Central idea:** Brains as physical systems; neurons and symbols; whether mental states are “just” physical states and how levels of description apply to the brain.
- **Companion:** **Neuron chain** — A row of “neurons” (circles). User can turn on/off a few; simple rule: “fire if 2+ neighbors on”. Propagate one step and see activation spread. No quiz—just feel the parallel, distributed process.

---

## Chapter XII: Minds and Thoughts
- **Central idea:** Mind, meaning, and intentionality; whether minds can be understood in the same multilevel way as computers and brains.
- **Companion:** **Symbol grounding** — Same symbol “↑” in two contexts: “arrow” vs “number 5 in a sequence”. User sees that the “meaning” depends on context (receiver/decoder). Reinforces location-of-meaning idea at the level of mind.

---

## Chapter XIII: BlooP and FlooP and GlooP
- **Central idea:** Primitive recursive (BlooP) vs general recursive (FlooP) vs unbounded search (GlooP). Some functions are not BlooP; this prefigures incompleteness.
- **Companion:** **BlooP vs FlooP** — Two “programs”: one “BlooP” (bounded loop: “find smallest n&lt;N such that …”) and one “FlooP” (unbounded: “find smallest n such that …”). Same predicate; user sees that for some inputs BlooP stops, FlooP might not (or we show “running…”). Illustrates the difference between bounded and unbounded search.

---

## Chapter XIV: On Formally Undecidable Propositions of TNT
- **Central idea:** Gödel’s theorem: a consistent TNT has a true but unprovable sentence (the Gödel sentence). Arithmetization of syntax; the sentence “says” it is not provable.
- **Companion:** **Gödel sentence builder** — Step-through: (1) “We assign numbers to formulas,” (2) “We build a formula that talks about its own number,” (3) “That formula says: I am not a theorem.” Display the sentence and “TRUE but not PROVABLE” with a short explanation.

---

## Chapter XV: Jumping out of the System
- **Central idea:** We “see” the truth of the Gödel sentence from outside the system. Essential incompleteness; Lucas-style argument and its critique.
- **Companion:** **Inside vs outside** — Same Gödel sentence. Two views: “Inside TNT” (no proof; “?”) and “Outside” (we see it’s true). Button to “Jump out” and see the sentence turn green. Caption: “What we can see from outside the system.”

---

## Chapter XVI: Self-Ref and Self-Rep
- **Central idea:** Self-reference and self-reproduction (e.g. quines, self-replicating programs, DNA). Logic and biology meet.
- **Companion:** **Quine toy** — A one-line “program” that outputs itself. User clicks “Run”; the output is the same as the source. Optional: change one character and see it no longer reproduces. Shows self-reference in code.

---

## Chapter XVII: Church, Turing, Tarski, and Others
- **Central idea:** Undecidability, uncomputability, and the indefinability of truth (Tarski). Limits of formal systems and computation.
- **Companion:** **Halting intuition** — A very simple “program” (e.g. “while n≠1: if even n→n/2 else n→3n+1”). User picks n; we run (with a step limit) and show “halts” or “not yet” or “stopped after 100 steps.” No proof—just to feel that “will it stop?” is non-obvious.

---

## Chapter XVIII: Artificial Intelligence: Retrospects
- **Central idea:** History of AI; symbolic AI, limits, and the debate over whether machines can think.
- **Companion:** **Same task, different level** — One task (e.g. “sort these three numbers”). User sees “human instructions” vs “rule list” vs “code.” Same outcome, different description level. Illustrates that “intelligence” might be described at many levels.

---

## Chapter XIX: Artificial Intelligence: Prospects
- **Central idea:** Frames, representation, and how AI might capture meaning and context. Integration of multiple levels.
- **Companion:** **Frame slots** — One “frame” (e.g. “Birthday party”) with slots: who, when, where, cake?. User fills slots; “Infer” suggests default or related (e.g. “cake? → likely yes”). Shows knowledge as structured, context-dependent slots.

---

## Chapter XX: Strange Loops, Or Tangled Hierarchies
- **Central idea:** Strange loops tie the book together: Bach, Escher, Gödel; self-reference that creates meaning and the sense of “I.” Tangled hierarchies and the emergence of consciousness.
- **Companion:** **Strange loop summary** — One interactive diagram: three nodes “Bach,” “Escher,” “Gödel” with arrows (e.g. “canons ↔ impossible figures ↔ incompleteness”). Clicking a node highlights the loop. Short text: “The same pattern in music, art, and logic.” Optional: play a few seconds of a canon or show one Escher image.

---

## Implementation order
1. Shared CSS and nav
2. Landing page
3. Intro page (full)
4. Chapters 1–20 one by one (left pane: ELI5/10/20 + Full Text PDF iframe; right pane: companion)
