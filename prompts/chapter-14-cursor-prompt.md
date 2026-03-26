# Chapter 14 — "TNT Looks in the Mirror": Complete Rethink

## The experience this companion must deliver

Three sequential revelations, each building on the last:

1. **Formulas are numbers.** You take a TNT formula, watch each symbol become a code, watch those codes combine into one huge Gödel number. You realize: this formula *is* that number.

2. **Numbers can describe formulas.** TNT can ask arithmetic questions about that number — and arithmetic questions about that number are questions *about the formula*. TNT is talking about itself without knowing it.

3. **The fixed point.** One particular formula talks about its own Gödel number. It says: "the formula with this number has no proof." That formula *is* the formula with that number. The loop closes. G is born.

---

## Remove the old sections

- **Remove the MIU proof-pair entry form entirely.** It uses the wrong formal system (MIU is from Chapter 1) and doesn't demonstrate the self-referential mechanism that makes Chapter 14 important. MIU has no self-referential capacity.
- **Remove the two-button "Try to prove G / So G is true" section.** It is replaced by Act 3's branching diagram below.
- **Update the introductory caption** from "Two ideas from the chapter..." to: *"Three steps: a formula becomes a number, arithmetic discusses proofs, and one sentence names itself."*

---

## Act 1: The Encoding — watch a formula become a number

### Layout

A TNT formula builder with symbol buttons: `0`, `S`, `+`, `·`, `=`, `(`, `)`, `∀`, `∃`, `¬`, `∧`. If the Chapter 8 symbol builder already exists and is importable, reuse it. Otherwise build a simple version with the same buttons.

**Preset formula on load:** `S0=S0` (meaning "1 = 1" — simple, true, and short enough to make the animation legible).

### Symbol code reference table

Display this table below the formula builder:

| Symbol | Code |
|--------|------|
| `0`  | 1  |
| `S`  | 2  |
| `+`  | 3  |
| `·`  | 4  |
| `=`  | 5  |
| `(`  | 6  |
| `)`  | 7  |
| `∀`  | 8  |
| `∃`  | 9  |
| `¬`  | 10 |
| `∧`  | 11 |

### The "Encode" button animation

When clicked, run this animation sequence:

1. Each symbol in the formula highlights in sequence left to right, 300ms per symbol
2. As each symbol highlights, its code number appears below it in a small badge
3. Below the formula, the prime factorization assembles term by term: `2^(code1) × 3^(code2) × 5^(code3) × ...` — each factor appears as its symbol highlights
4. After all symbols are processed, the final Gödel number appears — a single large integer displayed prominently

**Example for `S0=S0`** (symbols: S, 0, =, S, 0 → codes: 2, 1, 5, 2, 1):

`2² × 3¹ × 5⁵ × 7² × 11¹ = 20,213,100`

Display this number large and glowing. It should feel significant.

**Caption after encoding completes:**
*"This formula is now a number. TNT speaks arithmetic. So TNT can speak about this formula — it just has to speak about this number."*

### The "Decode" button

Takes the Gödel number and runs the animation in reverse:
- Factor the number into prime powers
- Recover each symbol code from the exponents
- Reassemble the formula symbol by symbol, right to left

This reversal is philosophically crucial — it shows the encoding is **lossless**. The formula and the number are genuinely interchangeable. Place the Decode button next to Encode; it should only appear after Encode has been run at least once.

---

## Act 2: The Proof Predicate — arithmetic talks about proofs

Below Act 1, a second section titled **"Arithmetic can discuss proofs."**

### The predicate display

Show a schematic box (styled as a definition card) containing:

```
Proof(m, n)  means:
  "m is the Gödel number of a valid proof
   whose last line has Gödel number n"
```

Below this, a small three-row table of examples:

| m | n | Proof(m, n)? |
|---|---|---|
| [some small number] | Gödel# of `S0=S0` | ✓ Yes — m encodes a valid proof of "1 = 1" |
| [a different number] | Gödel# of `S0=S0` | ✗ No — m doesn't encode a valid proof |
| [any number] | Gödel# of G | ? — revealed in Act 3 |

The third row should be grayed out with a `?` in the result column. It updates to `✗ No — nothing encodes a proof of G` after Act 3 is completed.

### Key insight text

*"Proof(m, n) is a purely arithmetic relation — it only involves numbers and their properties. TNT can express it as a formula. So TNT can say 'formula n has a proof' or 'formula n has no proof' — in the language of arithmetic, about numbers."*

### Bridge sentence

*"TNT is now equipped to talk about its own theorems. The only question is: can it build a sentence that talks about itself specifically?"*

---

## Act 3: The Fixed Point — the sentence that names itself

Title: **"The sentence that says its own name."**

This is the dramatic heart of the companion. Present as a step-by-step animated construction. Each step is hidden until the user clicks **"Next →"**. Steps fade in with a 200ms transition.

---

### Step 1

Display:
```
¬∃m: Proof(m, n)
```

Caption: *"This formula says: 'There is no proof of the formula with Gödel number n.' For any specific value of n we plug in, it makes a claim about that formula."*

---

### Step 2

An animated arrow appears pointing to `n` in the formula.

Caption: *"Now — what if n is the Gödel number of THIS formula itself?"*

---

### Step 3

Animate a substitution: the `n` transforms into a glowing placeholder `g`. A new equation appears beside the formula:

```
g  =  Gödel number of [¬∃m: Proof(m, g)]
```

Caption: *"We need a number g such that when g is plugged into the formula, the resulting formula has Gödel number g. This is the fixed point — the formula that names itself. The diagonal lemma guarantees such a g exists."*

---

### Step 4 — the visual centerpiece

Show the formula and its Gödel number side by side, connected by a **circular glowing arrow** that curves from the Gödel number back to the formula. The loop should be rendered in SVG, visually beautiful — a golden arc with an arrowhead completing the circle.

```
  ¬∃m: Proof(m, g)   ←———————————————┐
           │                           │
           │  has Gödel number         │
           └──────────────  g  ────────┘
```

Caption: *"This is G. It says: 'The formula with Gödel number g has no proof.' And that formula is G itself. So G says: 'I have no proof.'"*

---

### Step 5 — the branching diagram

Render the two-path argument as an SVG diagram with boxes and arrows. Do NOT use ASCII art — use proper SVG rounded-rectangle boxes, colored terminals, and labeled arrows.

Structure:

```
                    ┌──────────────────────────────────────────┐
  IF TNT proves G → │ G says "I have no proof"                 │
                    │ But TNT just proved it                   │ → [RED BOX] INCONSISTENCY
                    │ TNT proved something false               │
                    └──────────────────────────────────────────┘

G ──────────────────────────────────────────────────────────────────

                    ┌──────────────────────────────────────────┐
  IF TNT does NOT → │ G says "I have no proof"                 │
  prove G           │ That is exactly correct                  │ → [GOLD BOX] TRUE BUT UNPROVABLE
                    │ G is true                                │
                    └──────────────────────────────────────────┘
```

**Red terminal box:** Background `#c0392b`, white text: `INCONSISTENCY — system breaks`

**Gold terminal box:** Background `#d4a030`, dark text: `TRUE BUT UNPROVABLE`

Caption: *"Both paths have been explored. One leads to contradiction. One leads to incompleteness."*

---

### Step 6

A third branch fades in below the diagram:

```
  Assuming TNT is consistent →  the left branch is impossible
                                 So: G is true and unprovable
                                 TNT is INCOMPLETE
```

Reveal the third row of the Act 2 table (updating `?` to `✗ No — nothing encodes a proof of G`).

Caption: *"Truth and provability are not the same thing. There are true sentences that no proof will ever reach. This is Gödel's first incompleteness theorem."*

---

## Capstone — auto-revealed after Act 3 completes

After Step 6 is shown, a final section appears automatically (no click required) after a 1000ms delay.

Three sentences appear one at a time, 800ms between each, fading in:

1. *"Every sufficiently powerful formal system contains a sentence it cannot prove."*
2. *"Adding G as an axiom creates a new system — with its own unprovable sentence."*
3. *"Incompleteness is not a bug. It is a theorem."*

---

## Visual design

### Color palette per act

- **Act 1 (encoding):** Cool blue tones. Panel background `#f5f9fd`. Accent `#3a8fd1`. Feels technical and precise.
- **Act 2 (proof predicate):** Neutral gray tones. Panel background `#f6f6f6`. Feels mathematical and formal.
- **Act 3 (fixed point):** Warm gold tones building to the revelation. Panel background `#fdf6e8`. Accent `#d4a030`. Feels significant.
- **Capstone:** Dark background `#1a1a2e`, light text — a moment of stillness after the revelation.

### The self-reference arrow (Step 4)

This is the visual centerpiece of the entire companion. Invest effort here. It should be a smooth SVG arc, golden (`#d4a030`), with a soft drop-shadow glow (`filter: drop-shadow(0 0 6px rgba(212,160,48,0.6))`), arrowhead at the formula end. The formula box it points to should have a faint golden border. Animate it drawing itself (SVG stroke-dashoffset animation, ~800ms) when Step 4 is revealed.

### Act separators

Each act is separated by a horizontal rule with a small centered label:
- Between Act 1 and 2: `▼ Step 2 of 3`
- Between Act 2 and 3: `▼ Step 3 of 3`

### Progress indicator

At the top of the companion, a simple three-dot progress indicator:
`● ○ ○` → `● ● ○` → `● ● ●`

Updates as each act becomes active (user has scrolled to or interacted with it).
