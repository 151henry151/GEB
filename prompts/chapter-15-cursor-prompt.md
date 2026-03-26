# Chapter 15 — "Jumping out of the System": Complete Rebuild

## What this companion must deliver

Three experiences, in order:

1. **The claustrophobia of inside, then the relief of outside.** The user must feel what it is like to be *inside* TNT — confined, working only with proofs, unable to assess G — and then feel the genuine expansion of jumping outside to see the whole machine.

2. **The infinite tower.** Adding G doesn't fix incompleteness. G' appears. Adding G' produces G''. The user should feel this as a vertiginous infinite regress, not just read about it.

3. **The Lucas trap.** The user should be invited to make the Lucas argument ("I can see G is true, so I'm not a machine"), feel its pull, and then watch it carefully dismantled.

---

## Remove the current companion entirely

The current companion is a single "Jump out" toggle button that changes a text label. Replace it completely with the three-section experience below.

---

## Section 1: Inside and Outside

### The spatial metaphor

Render a canvas (~480px wide × 300px tall) divided into two zones:

**The Box (Inside TNT):** The left two-thirds of the canvas. Dark walls (thick SVG border, `#2a3a4a`), dark interior background (`#0f1520`). Inside the box, a proof-search machine animates continuously: a branching tree of proof attempts grows and spreads, each branch labeled with a formula. The branches never reach G. A small label inside the box reads `TNT` in the upper corner. The machine looks busy — lots of activity — but purposeless from the outside. G floats just above the top wall of the box, *outside* it, unreachable.

**The Field (Outside TNT):** The right third and the space above the box. Lighter background (`#f5f9fd`). The user's viewpoint starts here. From here, you can see the whole box, the machine inside it, and G floating above.

**G** is rendered as a glowing sentence: *"I am not provable in TNT."* It floats just above the box's top wall, slightly outside. From inside the box, it's invisible — the walls block the view. From outside, it's clearly visible.

### The interaction

**Step 1 — Start outside.** The user sees the full canvas: the box with the machine inside, and G floating above. A label reads: *"You are outside TNT. You can see everything."*

**Step 2 — "Enter the system" button.** When clicked, animate the camera "entering" the box: the walls of the box expand to fill the canvas, the exterior disappears, the user is now inside. G disappears — it's above the walls, no longer visible. The proof-search tree fills the view. A label reads: *"You are inside TNT. You only have proofs."*

Inside the box, show a simple proof-search interface: a scrolling list of attempted derivations, each one failing to reach G. A counter: `Proofs checked: 1,247… 1,248… 1,249…` The counter increments slowly. Below it: `Status of G: unknown (no proof found yet)`. The machine looks like it could keep going forever and never tell you whether G is true.

**Step 3 — "Jump out of the system" button.** Animate the camera pulling back out of the box. The walls shrink back to the left portion of the canvas. G reappears above the box. The field reappears.

Now, in the field (outside), three callouts appear one at a time:

- *"Does TNT prove G?"* — arrow points into the box at the proof-search machine → *"No. The machine never finds a proof."*
- *"What does G say?"* — arrow points to G → *"'I am not provable in TNT.'"*
- *"Is G true?"* — a golden highlight around G → *"Yes. What G says is exactly right. G is true — and TNT cannot prove it."*

**Caption:** *"We didn't prove G from inside. We reasoned about TNT from outside. That's the jump."*

### The key distinction panel

Below the canvas, a small two-column panel:

| Inside TNT | Outside TNT |
|---|---|
| Only formal derivations | Can describe TNT as an object |
| G has no proof | G is recognizably true |
| "Undecidable" | "True but unprovable" |
| Bounded by its own rules | Can see the rules from above |

---

## Section 2: The Infinite Tower

### The core idea

Adding G as an axiom to TNT creates TNT+G. But TNT+G is still consistent and still powerful enough for arithmetic — so it has its own Gödel sentence G'. Adding G' creates TNT+G+G', which has G''. This never ends. You cannot patch your way to completeness.

### The visualization

An animated tower of systems, rendered vertically on the canvas (tall and narrow, ~200px wide × 400px tall, scrollable):

```
TNT+G+G'+G''+ ···  ←— and so on forever
     G'''
TNT+G+G'+G''
     G''
TNT+G+G'
     G'
TNT+G
     G
TNT              ←— start here
```

Each system is a horizontal band. Each Gödel sentence floats between its system and the one above it. The tower extends upward, with the topmost visible entry fading into a `···` and an infinity symbol.

**Interaction:** A "Add G as axiom" button at the bottom. Each click:
1. Animates a new system band appearing above the current top (slide up)
2. The new Gödel sentence materializes between the old top and the new band
3. A label on the new sentence: `G'` (then `G''`, then `G'''`, etc.)
4. After 4 clicks, the `···` and ∞ appear and the button is disabled, replaced by text: *"It doesn't stop. Every system has a sentence it cannot prove."*

**Caption beneath the tower:** *"Each fix creates a new hole. Incompleteness is not a defect to be repaired — it is a structural feature of any system powerful enough to describe arithmetic."*

---

## Section 3: The Lucas Trap

### Setup

Title: **"Does Gödel prove that minds aren't machines?"**

Introductory text: *"In 1961, philosopher J.R. Lucas made a striking argument. Read it, then decide if it works."*

### Present the Lucas argument as a dialogue the user clicks through

Show Lucas's argument as four steps, each revealed on click:

**Step 1:** *"Given any machine M, I can find a Gödel sentence G_M that M cannot prove."*

**Step 2:** *"But I can see that G_M is true — just by understanding the construction."*

**Step 3:** *"So I can do something the machine cannot: recognize G_M as true."*

**Step 4:** *"Therefore I am not a machine."*

After Step 4, a button appears: **"This argument is compelling. Does it work?"**

### The rebuttal — interactive

When clicked, the rebuttal unfolds in three stages:

**Rebuttal Stage 1:**
*"Can a machine also output 'G_M is true'?"*

Show a small "machine" diagram with an input slot and output slot. Feed it the description of TNT. Output: `"G_TNT is true"`. Caption: *"Yes — we can program a machine to output its own Gödel sentence as true. We just add that as a rule."*

**Rebuttal Stage 2:**
*"But then that machine has a NEW Gödel sentence — one it can't prove."*

Show G' appearing above the machine, unreachable. Caption: *"True. And Lucas can see G' is true. But can't we also program the machine to output G' as true? Then G'' appears..."*

A small animated loop: machine gets upgraded → new G appears → machine upgraded again → newer G appears → repeat. The loop spins three times, then stops.

Caption: *"Lucas and the machine are in the same position: each can handle the current G, but a new one always appears. The argument doesn't separate them."*

**Rebuttal Stage 3:**
*"The deeper problem: Lucas assumes he can always see the truth of G. But can he?"*

Two questions appear:
- *"If you were a formal system — could you know it?"*
- *"If you can't know whether you're a formal system, how do you know Gödel applies to you?"*

Caption: *"Gödel's theorem applies to formal systems. Whether human minds are formal systems is precisely the question Lucas is trying to answer. He can't use Gödel to answer it without first assuming the answer."*

**Final panel — the verdict:**

A balanced two-column summary:

| Lucas's argument | The rebuttal |
|---|---|
| "I can see G is true" | So can a suitably programmed machine |
| "The machine can't see G is true" | It can, once G-recognition is added as a rule |
| "Therefore I'm not a machine" | The argument is circular — it assumes what it tries to prove |

Below: *"Hofstadter's conclusion: Gödel's theorem does not prove that minds are not machines. The question remains open — and fascinating."*

---

## Capstone

After all three sections, a closing thought appears (auto-revealed after the user has interacted with all three sections):

*"Jumping out of the system is real — we do it every time we reason about formal systems from outside. Whether that jumping-out is itself mechanical is the question GEB spends its final chapters exploring."*

---

## Visual and UX design notes

### Section 1 camera animation
Use CSS transforms (`transform: scale()` and `transform: translate()`) on the canvas SVG to simulate the camera entering and leaving the box. The box should appear to grow to fill the canvas (entering) and shrink back (leaving). Duration: ~600ms, ease-in-out.

### Section 2 tower
The tower should start with just TNT visible. The "Add G as axiom" button should be satisfying to press — each click should feel like an attempt to solve the problem, and the appearance of a new G should feel like a small defeat. After 4 clicks, the infinity symbol should feel genuinely vertiginous.

### Section 3 dialogue pacing
The Lucas argument steps should appear one at a time with a 200ms fade-in. Don't rush — the argument should feel compelling before the rebuttal. If the user reaches Step 4 too quickly they won't feel the pull of the argument.

### Color palette
- Inside TNT: dark navy/midnight blues (`#0f1520`, `#1a2a3a`) — claustrophobic
- Outside TNT / field: cool light blue-white (`#f0f6ff`, `#e8f0f8`) — expansive
- G sentence: glowing amber/gold (`#d4a030`) throughout — it is always "true" colored
- Tower: gradient from dark at bottom (TNT) to lighter at top (increasingly abstract systems)
- Lucas section: neutral grays — it is a philosophical debate, not a revelation
