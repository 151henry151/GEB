# Chapter 17 — Church, Turing, Tarski: Complete Rebuild

## What this companion must deliver

Three things, each building on the last:

1. **The halting problem proof by diagonalization** — the user should feel the trap close, exactly as with the Lucas argument in Chapter 15. Assume a halting oracle exists. Build something that defeats it. Watch the contradiction materialize.

2. **The family of diagonalization results** — Gödel, Turing, Tarski, and Cantor all proved the same thing in different disguises. The user should see this structural unity laid out clearly.

3. **Church's thesis** — what it means, why it matters, and why it's a thesis rather than a theorem.

The Collatz runner may be kept as a small illustrative sidebar but must not be the main event.

---

## Remove the current companion

The current companion is only a Collatz sequence runner. This demonstrates "we don't know if this halts" but entirely omits the chapter's central content: the proof that no general halting algorithm can exist, and the family of related undecidability results. Replace it with the three-section structure below. The Collatz runner may be kept as a small element within Section 1.

---

## Section 1: The Halting Oracle — proof by diagonalization

This section is structurally similar to Chapter 13's "Build a Halting Oracle — then break it" but goes further: it should fully walk through the diagonalization proof, not just show the contradiction.

### Phase 1: The Oracle seems possible

Show a "Halting Oracle" machine — a box with two inputs (a program description and an input value) and one output (HALTS or RUNS FOREVER).

Show three programs the oracle handles correctly:

- **"Count to 100"** → HALTS ✓
- **"Print all even numbers"** → RUNS FOREVER ✓
- **"Find the first prime > 1000"** → HALTS ✓

Caption: *"An oracle like this would be incredibly useful. Can we build one?"*

### Phase 2: The diagonalization construction

Present this as a step-by-step animated build. Each step appears on click ("Next →").

**Step 1:** *"Imagine we have a complete list of all programs: P₁, P₂, P₃, ..."*

Show a vertical list of program entries, scrolling off into the distance. Each entry Pᵢ has a description.

**Step 2:** *"The oracle can answer, for each program Pᵢ: does Pᵢ halt when run on its own description?"*

Show a table being filled in:

| Program | Halts on its own description? |
|---------|-------------------------------|
| P₁ | HALTS |
| P₂ | RUNS FOREVER |
| P₃ | HALTS |
| P₄ | HALTS |
| P₅ | RUNS FOREVER |
| ... | ... |

**Step 3:** *"Now build the Diagonal Program D: for each Pᵢ, D does the OPPOSITE of what the oracle says about Pᵢ."*

Animate a diagonal line cutting across the table — highlighting one cell per row, the cell on the diagonal. Caption: *"D looks at P₁'s answer and does the opposite. Then P₂'s answer and does the opposite. And so on."*

Formally:
```
D(i):
  if oracle says Pᵢ halts on i: run forever
  if oracle says Pᵢ runs forever on i: halt
```

**Step 4:** *"D is a program. So D appears somewhere in our list — say D = Pₖ."*

Highlight row k in the table. Caption: *"D is on the list. The oracle has an answer about D."*

**Step 5:** *"What does the oracle say about Pₖ (= D) running on input k?"*

Show the two cases as a branching diagram:

```
Oracle says D halts on k
    → D does the opposite → D runs forever on k
    → Oracle was wrong

Oracle says D runs forever on k
    → D does the opposite → D halts on k
    → Oracle was wrong
```

Both branches end in: **ORACLE WRONG — contradiction.**

Caption: *"No oracle can exist. The halting problem is not just unsolved — it is provably unsolvable."*

### Phase 3: The Collatz sidebar

After the proof, show the Collatz runner as a small interactive sidebar with this framing:

*"The Collatz sequence is a concrete example of this uncertainty. For every n tried, it eventually reaches 1. But no one has proved it always does. This is not the halting problem — but it has the same flavor: a simple rule, and we cannot always predict what it will do."*

Keep the existing run/display functionality but cap it visually as a sidebar, clearly labeled as illustrative rather than central.

---

## Section 2: The Diagonalization Family

### The core insight

Cantor, Gödel, Turing, and Tarski all used the same proof technique. They all constructed something that "disagrees with its own row in a complete table." Show this visually.

### A four-panel comparison

Display four panels in a 2×2 grid. Each panel shows the same abstract structure applied to a different domain:

**Panel 1 — Cantor (1891): Real numbers are uncountable**
- The "oracle" assumption: all real numbers can be listed in a sequence
- The diagonal construction: build a number that differs from entry n in the nth decimal place
- The contradiction: this number is not on the list — but we assumed the list was complete
- The result: no complete list of real numbers exists

**Panel 2 — Gödel (1931): Incompleteness**
- The "oracle" assumption: a formal system that proves all arithmetic truths
- The diagonal construction: build a sentence G that says "I am not provable" (the fixed point / arithmoquining)
- The contradiction: if provable → proves a falsehood; if not provable → true but unprovable
- The result: no complete consistent formal system for arithmetic exists

**Panel 3 — Turing (1936): Halting undecidability**
- The "oracle" assumption: a program H that decides halting for all programs
- The diagonal construction: program D that does the opposite of H on diagonal inputs
- The contradiction: D cannot be correctly described by H
- The result: no general halting algorithm exists

**Panel 4 — Tarski (1933): Truth undefinability**
- The "oracle" assumption: a truth predicate True(x) definable within the language
- The diagonal construction: the sentence "True(⌈this sentence⌉) is false" (the liar paradox, formalized)
- The contradiction: the sentence is true iff it is false
- The result: truth for a language cannot be defined within that language

### The unifying structure

Below the four panels, show an abstract template:

```
1. Assume a complete self-describing mechanism M exists
2. Use M to construct an object D that "disagrees with itself"
   (D is built by diagonalizing over M's outputs)
3. Ask: what does M say about D?
4. Both answers lead to contradiction
5. Therefore M cannot exist
```

Caption: *"Cantor, Gödel, Turing, and Tarski all proved the same theorem. The subject changed — sets, formulas, programs, truth — but the proof never did."*

### Interactive element

Add a "Trace the diagonal" interactive component. Show a 5×5 grid with rows labeled P₁–P₅ and columns labeled inputs 1–5. Each cell shows HALTS or LOOPS (randomly assigned but fixed). A diagonal highlight runs from top-left to bottom-right. The user clicks each diagonal cell and sees the "flip" — the entry that D would use (HALTS → LOOPS, LOOPS → HALTS). After clicking all 5, the diagonal entry sequence assembles into the definition of D. Caption: *"This is all diagonalization is: read your own table and do the opposite."*

---

## Section 3: Church's Thesis

### What it says

Church's thesis (also called the Church-Turing thesis) states:

*"Any function that can be computed by an effective procedure can be computed by a Turing machine."*

Present this in a callout box, styled prominently.

### Why it's a thesis, not a theorem

A short explanation panel:

*"Church's thesis cannot be proved — because 'effective procedure' is an informal concept. We cannot formally prove that our formal definition of computation captures everything we intuitively mean by computation."*

*"What we CAN prove: many different formal models of computation — Turing machines, lambda calculus, recursive functions, register machines, modern programming languages — all compute exactly the same set of functions. They are all equivalent to each other."*

### The equivalence diagram

Show a circular diagram with five nodes:

- Turing machines
- Lambda calculus (Church)
- General recursive functions (Gödel/Kleene)
- Register machines
- Modern programming languages (Python, C, etc.)

Each pair connected by a double arrow labeled "computes same functions." The circle of equivalences. Caption: *"Every reasonable model of computation turns out to be equivalent. This is evidence — though not proof — that Church's thesis is correct."*

### The philosophical weight

*"If Church's thesis is true, then Turing's result is not just about Turing machines — it is about all computation, including human computation. The halting problem is undecidable not just for Turing machines but for any computational process whatsoever — including, if the thesis holds, the human brain."*

A question appears at the end, not answered: *"Is human reasoning subject to these limits? Or does jumping out of the system — reasoning about formal systems from outside — escape them?"* (This points forward to the book's final chapters.)

---

## Capstone

After all three sections, a closing reflection:

*"Three mathematicians. Three problems. Three domains — sets, programs, truth. One proof. The diagonal argument is the most powerful tool in the foundations of mathematics. It marks the edge of what any formal system, any computer, any language can do from inside itself."*

---

## Visual design notes

### Section 1 (halting proof)
- Use the same visual style as Chapter 15's branching diagram for the contradiction branches
- The diagonal line animation across the table is the key visual — animate it drawing itself slowly (SVG stroke-dashoffset, ~1s) to give weight to the construction
- The ORACLE WRONG terminal boxes should be red (`#c0392b`) matching Chapter 15's inconsistency boxes — visual consistency across the undecidability results

### Section 2 (four panels)
- Each panel should be a compact card, ~220px wide
- All four cards share the same layout: header (person + year), four rows (oracle / diagonal / contradiction / result)
- Use subtle color-coding per domain: Cantor (purple), Gödel (gold, matching Ch14), Turing (blue), Tarski (green)
- The abstract template below the cards should be in a slightly different style — monospace font, slightly indented — to signal it is the distilled structure

### Section 3 (Church's thesis)
- The equivalence diagram should be a clean SVG pentagon with nodes and edges
- The philosophical reflection at the end should be slightly larger font, more space above and below — it's the chapter's emotional landing

### Collatz sidebar
- Keep the existing functionality
- Reduce its visual prominence — it is illustrative, not central
- Add a label above it: *"An unsolved instance — not a proof of undecidability, but a taste of it"*
