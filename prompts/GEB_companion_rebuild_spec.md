# GEB Interactive Companion — Full Critique & Rebuild Spec
## For Cursor Agent: Chapter-by-Chapter Instructions

This document covers every chapter page at hromp.com/geb/ (intro + chapters 1–20, skipping chapter 12 which has already been redesigned). For each chapter: a critique of the existing companion, a verdict (KEEP / IMPROVE / REPLACE), and a precise spec for what to build or change.

**Global design rules that apply to every companion:**
- Dark background, soft glowing aesthetic — consistent with the Chapter 12 redesign
- No "check your answer" grading unless the concept genuinely requires it
- Prioritize *feeling* the idea over *being told* the idea
- Evocative one-line caption below the widget that updates contextually
- Mobile-friendly (touch events alongside mouse events)
- React + SVG preferred; vanilla JS + Canvas acceptable for heavy animation

---

## Introduction: A Musico-Logical Offering

### Existing companion
Three buttons — Bach, Escher, Gödel — that presumably show a description or illustration of each figure's strange loop. This is a pure information display: click a name, read about it. No interactivity, no experience of the strange loop itself.

### Verdict: REPLACE

### What the intro is really about
The intro's job is to make the reader *feel* the strange loop before they understand it. The three examples (Bach's endlessly rising canon, Escher's impossible stairs, Gödel's self-referential sentence) are all instances of the same structure: you ascend through levels and find yourself back where you started. The companion should deliver that visceral experience — the vertigo of the loop — not just label it.

### What to build: "The Loop You Can't Escape"

An animated, three-panel experience. The user lands on a single canvas. There is a "START HERE" node. An arrow leads up and to the right, labeled "go higher." The arrow curves, rises, rises — and bends back to the START node. The label at the top reads "you are back." The user can click/drag along the path and watch themselves travel upward only to arrive where they began.

Below that, three tabs: **Bach**, **Escher**, **Gödel**. Each tab transforms the abstract loop into that domain:

**Bach tab:** An animated musical staff. A melodic line ascends through six key signatures (C → G → D → A → E → B → back to C, but one octave higher — which sounds identical). The note glows as it travels. When it completes the circle, a label appears: *"You went up six steps and arrived exactly where you started."* Use the Web Audio API to actually play the ascending notes (simple sine wave tones, no copyright issues). The user hears the loop.

**Escher tab:** An SVG of an Escher-style staircase (drawn in pure SVG — no image reproduction). A small figure walks up the stairs. The stairs loop: after four flights "up," the figure is at the same height it started. Animate the figure walking in an infinite loop. The user watches the impossible ascent.

**Gödel tab:** A sentence slowly types itself out: `"This sentence..."` — pause — `"...is not provable."` Then an arrow curves from the end of the sentence back to the beginning. A label: *"The sentence refers to itself. Following the arrow brings you back to the start."* The user clicks the arrow and watches the self-reference close.

**Single contextual caption** below all three tabs (updates per tab):
- Bach: *"The melody climbs forever and never leaves home."*
- Escher: *"Every step up is a step toward where you began."*
- Gödel: *"The sentence that talks about itself — and is right."*

**Why this is better:** The user *experiences* the strange loop in three different media before reading a word of the book. That is exactly what the intro promises to do.

---

## Chapter 1: The MU-Puzzle

### Existing companion
A string rewriter: shows current string (starts at `MI`), four rule buttons, apply one rule at a time, reset button. This is actually quite good. It lets the user play the game directly.

### Verdict: IMPROVE

### What's missing
The companion lets you play, but it doesn't deliver the *insight* — the moment when you realize *why* MU is unreachable. The "aha" of Chapter 1 is not "I tried and failed" but "I stepped outside and counted the I's." The companion should make that outside-view available and make it feel revelatory.

### Changes to make

1. **Add a live I-count display** alongside the current string. Show: `I-count: 1` in a small badge. As the user applies rules, the count updates. Color it: green if not divisible by 3, red if divisible by 3. The user watches it never turn red (never ≡ 0 mod 3).

2. **Add a "Step Outside" button** that appears after ~5 moves. When clicked, it opens an overlay panel that explains: *"Notice: the number of I's started at 1. Rule I doubles it. Rule II adds one. Rule III removes three. Rule IV doesn't touch I's. The count mod 3 has been: [list of values so far]. It never reaches 0. MU has zero I's — divisible by 3. So MU is unreachable."* Crucially, it should highlight the I-count history as a little sparkline.

3. **Show the derivation history** as a scrollable list of steps taken, so the user can see the path they've walked inside the system.

4. **Add a "Try to reach MU" progress bar** that shows how close the user is to getting the I-count to 0 mod 3 — it never reaches the goal, visually reinforcing the impossibility.

These changes preserve what's good (actually playing the game) and add the key intellectual payoff that's currently absent.

---

## Chapter 2: Meaning and Form in Mathematics

### Existing companion
A text field where you type a pq-string (e.g. `--p---q-----`), click "Check theorem," and it tells you if it's valid and what addition fact it encodes.

### Verdict: IMPROVE

### What's missing
The companion is a *verifier* — it checks whether something you already typed is correct. But the chapter's core insight is about *emergence*: you watch a meaningless formal game produce something that, when you squint at it right, suddenly *means* addition. The companion should make that emergence visceral, not just mechanical.

### Changes to make

1. **Replace the text input with a visual builder.** Show three rows of dash-buttons: one for "hyphens before p," one for "hyphens between p and q," one for "hyphens after q." The user clicks `+` to add dashes. As they build, the string assembles visually (dashes animating into place).

2. **Two-panel reveal.** Left panel: the formal string, colored purely as shapes — dashes are just dashes, p and q are just glyphs, no meaning stated. Right panel: initially blurred/hidden. A button reads **"Interpret."** When clicked, the right panel unblurs to show: `[count before p] + [count between] = [count after]` with the arithmetic equation. The moment of reveal should feel like putting on glasses — meaning snaps into focus.

3. **Add an "Axiom Generator"** that produces a random valid pq-theorem and challenges the user to predict the addition fact before clicking Interpret. This makes the isomorphism tangible through repeated, playful encounters.

4. **Add a short animated sequence** (triggered once on first load) that shows three strings appearing one by one with their interpretations fading in, ending with the caption: *"The rules never mentioned numbers. But look what they produced."*

---

## Chapter 3: Figure and Ground

### Existing companion
A toggle button — "See figure (vase)" / "See ground (faces)" — that presumably flips a Rubin vase image between two readings. The description says it shows the classic Rubin vase and labels it as "Figure: the vase."

### Verdict: REPLACE

### What's missing
This is the weakest possible implementation of figure/ground. Toggling between two labeled views teaches nothing — the user doesn't *discover* the ambiguity, they're just shown it. More critically, the chapter's real intellectual content is about *formal systems*: the set of theorems (figure) vs. the set of non-theorems (ground), and the deep asymmetry between them (theorems are listable; non-theorems may not be). The visual metaphor is just the entry point — the companion stops there and never reaches the formal idea.

### What to build: "What You Don't See"

A two-part companion:

**Part 1: The Perceptual Loop**
An SVG image (drawn in code — not a reproduction of any copyrighted artwork) that is genuinely ambiguous: either a goblet/vase or two facing profiles. The image is drawn with a single contour that serves as both the vase's edge and the profiles' faces. Crucially, the user does NOT get a toggle button. Instead, they hover/click on either side of the image. If they click the left, the left face glows and a label appears: *"Face."* If they click the right, it glows: *"Face."* If they click the center, the vase glows: *"Vase."* The user discovers that the same contour is doing double duty. Caption: *"The line between them belongs to neither — and to both."*

**Part 2: Figure and Ground in Formal Systems**
Below the image, a live formal-system widget. A small MIU-like system runs and generates strings one by one, appending them to a scrolling **Figure** column (theorems). A **Ground** column on the right is labeled "everything else." But the ground column just shows `???` — it cannot be listed, only implied. 

A toggle: **"Can we list the ground?"** When clicked, an animation attempts to enumerate non-theorems but keeps getting interrupted: *"Wait — is 'MUI' a non-theorem? We'd have to search forever to be sure..."* The widget shows that the figure (theorems) generates itself; the ground is defined only by absence, and absence is hard to certify.

Caption updates:
- Hovering vase: *"The figure — what stands out."*
- Hovering faces: *"The ground — what was always there, unseen."*
- In the formal system: *"Theorems announce themselves. Non-theorems stay silent."*

---

## Chapter 4: Consistency, Completeness, and Geometry

### Existing companion
A slider that morphs a triangle between flat (Euclidean) geometry and curved geometry, showing the angle sum change from 180°.

### Verdict: IMPROVE (significantly)

### What's missing
The geometry demo is visually nice but it demonstrates only one half of the chapter: the "multiple models" idea (same axioms, different worlds). It entirely omits the chapter's central logical content — consistency vs. completeness — which is what the chapter is *named* for and what leads directly to Gödel.

### Changes to make

**Keep the geometry slider** but reframe it as "Part 2: Same Axioms, Different Worlds." Add labels for the two geometries. Show the angle sum updating live as the slider moves. Good.

**Add Part 1: The Consistency/Completeness Machine** — a small interactive logic game. The user is given a tiny formal system with 3 axioms (shown as colored tiles). Below, a list of statements appears one at a time. The user must decide: PROVABLE, DISPROVABLE (opposite is provable), or NEITHER.

- If the system can prove both a statement and its negation → a red "INCONSISTENT" explosion appears
- If there are statements the system can neither prove nor disprove → a yellow "INCOMPLETE" badge appears
- The goal: find a system that is both consistent AND complete (for these statements)

The user quickly discovers it's easy for small systems, and learns that for arithmetic-sized systems, Gödel says it's impossible. A small label after playing: *"For systems rich enough to describe arithmetic, you must choose: consistent or complete. You cannot have both."*

**Contextual captions:**
- On inconsistency: *"A contradiction means everything becomes provable — the system collapses."*
- On incompleteness: *"Some truths live outside the reach of any proof."*
- On the geometry slider: *"The same axioms. Two different worlds. Both consistent."*

---

## Chapter 5: Recursive Structures and Processes

### Existing companion
A recursive tree that grows as you increase a depth slider. Depth 3 → more branches → more branches.

### Verdict: IMPROVE

### What's missing
A fractal tree is the most clichéd possible illustration of recursion — it's on every CS101 slide deck. The chapter is much richer: it covers recursion in music (themes within themes), in language (nested clauses), in mathematics (factorial, Fibonacci), and in programs (self-calling functions). More importantly, it's setting up the *generative power* of recursive rules — a *finite* description producing *infinite* complexity — which is what makes Gödel's construction possible.

### Changes to make

1. **Keep the tree but make it feel alive.** Animate the branching — each branch should grow visually from its parent, with a short delay, so the user *watches* the recursion unfold rather than seeing a static result at each depth. Add a "Grow" button that animates one level at a time.

2. **Add a "Recursion in Language" panel.** Show a sentence being built recursively: `"The cat chased the mouse"` → `"The dog that the cat chased bit the mouse"` → `"The fish that the dog that the cat chased bit swam away."` Each nesting adds a highlighted layer. The user can click an "Add Nesting" button to go deeper. After 4 nestings, a label: *"Finite grammar, infinite sentences."*

3. **Add a "Trace the Call Stack" panel.** Show factorial(4) being computed. Each recursive call adds a card to a visual stack: `factorial(4) calls factorial(3) calls factorial(2) calls factorial(1) = 1`. Then the stack unwinds, passing values back up. This makes the process — not just the structure — visible.

4. **Unifying caption:** *"One rule, applied to itself. Finite instructions, infinite reach."*

---

## Chapter 6: The Location of Meaning

### Existing companion
An encoding converter: enter a message, pick input mode (ASCII/binary/hex/etc.), pick output mode, see the reinterpretation. So `01000001` in binary → `A` in ASCII.

### Verdict: REPLACE

### What's missing
The encoding converter is technically a demonstration of "same bits, different meaning," but it completely misses *why* that matters and where the chapter's emotional and philosophical weight lies. The chapter is about the relationship between message, decoder, and receiver — and about the idea that meaning is never "in" the marks alone. The phonograph record example, the DNA example, the undeciphered-script example — these are all stories about how context and decoder *together* constitute meaning. A hex-to-ASCII converter feels like a programmer tool, not a philosophical insight.

### What to build: "The Decoder's Gift"

A three-panel interactive:

**Panel 1: The Message**
A string of abstract marks (not letters — use invented glyphs or geometric shapes: circles, triangles, lines). The marks sit there, inert. Caption: *"What does this mean?"*

**Panel 2: Choose Your Decoder**
Three decoder buttons:
- **Decoder A:** counts shapes (triangle=1, circle=2, line=3) → interprets the sequence as a number
- **Decoder B:** maps shapes to musical intervals → plays a short melody (Web Audio API, simple tones)
- **Decoder C:** maps shapes to compass directions → draws a path on a small map

When the user picks a decoder, the marks on the left glow and the interpretation appears on the right — the number, or the melody plays, or the path is drawn. The *same marks*, three completely different meanings.

**Panel 3: The Missing Decoder**
A fourth decoder slot labeled **"???"** with placeholder marks underneath. Caption: *"What if we lost the decoder? The marks would still exist. The meaning would be gone."* A "Lose the decoder" button grays out Panel 2 and replaces the interpretation with `[unknown]`, leaving the marks stranded and meaningless.

**The key moment:** The user realizes the marks haven't changed at all. Only the decoder changed. Meaning was never *in* the marks.

**Contextual captions:**
- Before choosing decoder: *"Marks without a decoder are just shapes."*
- After choosing decoder: *"Meaning appeared — but it was in the relation, not the marks."*
- After losing decoder: *"The information is still there. But for whom?"*

---

## Chapter 7: The Propositional Calculus

### Existing companion
A truth table builder: pick a formula (P∧Q, P∨Q, etc.), flip P and Q truth values, see the result highlighted in a truth table. Includes modus ponens explanation.

### Verdict: KEEP (with minor improvements)

### Assessment
This is one of the better companions. The truth table is the right tool for propositional logic, and the interactivity (flipping truth values and watching the table highlight) genuinely illustrates how the formula's truth depends only on its *form*, not on what P and Q "mean." That's exactly Chapter 7's point.

### Minor improvements

1. **Add a "Build your own formula" mode** with clickable connective buttons (∧, ∨, ¬, ⊃) and letter buttons (P, Q, R) so the user can compose novel formulas and see their truth tables auto-generated. This extends the "form determines truth" insight to user-created formulas.

2. **Add a Tautology Detector.** When all rows in the truth table are TRUE, the formula glows gold with a label: *"Tautology — true no matter what P and Q mean. This is a theorem of the propositional calculus."* This connects the formal system (theorems) to semantic truth (tautologies) — the isomorphism the chapter is celebrating.

3. **Visual modus ponens.** Instead of just describing it in text, animate it: show P=T glowing, then P⊃Q=T glowing, then an arrow pointing to Q=T lighting up. The inference rule becomes a visual event.

---

## Chapter 8: Typographical Number Theory

### Existing companion
A TNT formula builder: click symbol buttons (0, S, +, ·, =, parens, backspace) to build a formula, then click "Interpret" to see the numeric value or check the equation.

### Verdict: IMPROVE

### What's missing
The builder is good but it's a calculator dressed in TNT costume. The chapter's *key* insight — the one that makes Gödel possible — is **arithmetization of syntax**: the idea that you can assign numbers to formulas, and therefore that TNT can *talk about its own formulas* using number-theoretic statements. The companion never touches this. The builder also gives no sense of the *derivation* process — how theorems are produced from axioms by rules, which is the point of having a formal system at all.

### Changes to make

1. **Keep the formula builder** — it's useful for getting comfortable with TNT notation.

2. **Add a "Gödel Numbering" panel.** When the user has built a formula, a button appears: **"Assign Gödel Number."** Clicking it runs an animation: each symbol in the formula gets a number (0→6, S→7, +→2, etc.), then the formula's Gödel number is computed (product of primes raised to symbol-code powers, or a simplified version). The number appears — huge, glowing. Caption: *"This formula is also a number. TNT can talk about this number. So TNT can talk about this formula."*

3. **Add a simple derivation chain.** Show 3 preset axioms at the top. A "Derive" button applies a rule to produce a new formula, appended to the chain. The user sees the chain grow: Axiom 1 → [rule applied] → Theorem 1 → [rule applied] → Theorem 2. This makes "derivation" concrete, not abstract.

4. **Add a caption that updates:** When the user clicks "Gödel Number": *"Every formula has a number. Every proof has a number. Arithmetic can therefore discuss proofs."*

---

## Chapter 9: Mumon and Gödel

### Existing companion
A two-path explorer: the user clicks "Try to prove G" or "Assume G is false," and text reveals the argument. It's a static text-reveal widget — like an accordion/FAQ.

### Verdict: REPLACE

### What's missing
Chapter 9 is the emotional and intellectual climax of the first half of the book — the moment the Gödel sentence is revealed, the moment truth and provability come apart. The existing companion presents this as a text you click through, which is barely better than just reading the chapter. The experience of the Gödel argument should feel like a *trap closing* — first one path closes, then the other, leaving you with an inescapable conclusion.

### What to build: "The Inescapable Sentence"

A dramatic, step-by-step animated argument presented as a visual maze with two corridors.

**Setup:** A glowing sentence at the top of the screen: `G: "I am not provable in TNT."` Below it, two doors:

**Door 1: "Let's prove G."** The user opens it. They walk down a corridor (animated, like steps): *"If TNT proves G..."* → *"...then G is a theorem..."* → *"...but G says it has no proof..."* → *"...so TNT proved something false."* → A wall appears, labeled **INCONSISTENCY**. A door slams. Caption: *"If TNT is consistent, this path is blocked."*

**Door 2: "Let's say G is false."** The user opens it. Another corridor: *"If G is false..."* → *"...then 'I am not provable' is false..."* → *"...so G IS provable..."* → *"...but Door 1 shows it can't be proved..."* → Another wall: **CONTRADICTION**. Caption: *"This path collapses too."*

**The chamber between the doors:** Both doors are now shown closed. In the center, G still glows. A third label fades in: *"G is not provable — and that's exactly what G says. So G is true."* A final caption: *"Truth and provability have come apart."*

Then, a **Zen moment:** A second screen fades in showing the word **MU** — a nod to the chapter's Zen connection — with the caption: *"To ask 'is G true or provable?' is to ask the wrong question. Step outside the system."*

The whole experience should feel like a logical trap snapping shut around the user, then releasing them into a wider view.

---

## Chapter 10: Levels of Description and Computer Systems

### Existing companion
A three-level computer simulator: the user steps through adding two numbers at Level 0 (goal: "add A and B"), Level 1 (machine instructions: LOAD, ADD, STORE), and Level 2 (binary representations). All three update together.

### Verdict: IMPROVE

### What's missing
The three-level simulator is a reasonable start, but it's missing the chapter's most distinctive and compelling element: the **Ant Fugue** and the idea of emergent behavior and tangled hierarchies. A CPU adding numbers is a clean, one-directional hierarchy (high level → low level). The chapter's real excitement is about *tangled* hierarchies where higher-level patterns influence or are described by lower-level rules in ways that loop back. Also, the existing companion's binary display (Level 2) is a distraction — binary arithmetic is a different topic entirely.

### Changes to make

1. **Reframe Level 2.** Instead of binary, make Level 2 the *hardware physics* level — not binary numbers, but a cartoon of transistors switching (just visual, not a working simulation). This better illustrates the three levels: intentional (add), algorithmic (LOAD/ADD/STORE), physical (gates switching). The point is that the *same event* is described at all three levels simultaneously.

2. **Add an Ant Colony panel** (the chapter's dialogue). Show a grid of ants (dots) moving randomly. At the ant level: just individual dots. Click a button: **"Zoom Out."** The camera pulls back and a higher-level pattern becomes visible — the ants have formed a trail, a structure. Caption: *"At the ant level: no intelligence. At the colony level: purpose."* The user can toggle between the two views. This is the core of the Ant Fugue.

3. **Add a "Which level is real?" toggle** that asks the user to decide: is the addition happening at the goal level, the instruction level, or the gate level? When they pick one, a counter-example shows why the other levels are equally valid. Caption: *"All levels are real. None is the only real one."*

---

## Chapter 11: Brains and Thoughts

### Existing companion
A 1D cellular automaton: cells are ON or OFF, click to toggle, a cell turns ON if it has ≥2 ON neighbors, Step button advances one generation.

### Verdict: REPLACE

### What's missing
A 1D binary cellular automaton is a thin, abstract metaphor for neural activation, and it's not even a very accurate one — the rule (turn ON if ≥2 neighbors are ON) doesn't illustrate any interesting emergent behavior in the way the chapter needs. The chapter's core ideas are: (1) neurons are low-level, thoughts are high-level, (2) the same physical system supports multiple levels of description, (3) whether "thought" is "reducible" to neuron-firing is a question about levels of description. The 1D automaton is too minimal to demonstrate any of these interestingly.

### What to build: "From Firing to Feeling"

A two-level neural network toy:

**Lower level — Neuron View:** A network of ~20 circular nodes (neurons) connected by lines (synapses). Nodes have a threshold; if enough connected nodes are firing, they fire too. The user can click any neuron to fire it manually. Activation cascades through the network with delays. Nodes glow when firing, fade when quiet. This feels like a real neural firing pattern.

**Higher level — Symbol View:** Above the neuron network, a small set of labeled concept bubbles: HUNGER, WARMTH, DANGER, COMFORT, CURIOSITY. These are connected (by the preset weights of the neuron network) to specific patterns of neuron activation. When a pattern of neurons fires that corresponds to one of the concepts, the concept bubble above glows and a word appears.

**The key interaction:** The user fires a cluster of neurons. Neurons cascade. A concept lights up above. Caption: *"The neurons don't know what 'hunger' means. But their pattern does."*

Then: the user can **switch levels** — view the same event as neuron firings or as symbolic concepts. Same event, two descriptions.

**The reductionism button:** A toggle: *"Are thoughts 'just' neurons?"* When clicked, it shows the neuron view with all concept labels stripped — just raw firing. Caption: *"At this level, there is no hunger. Only voltage."* Toggle back: *"At this level, there is no voltage. Only hunger."* Caption: *"Which level is the 'real' one?"*

---

## Chapter 13: BlooP and FlooP and GlooP

### Existing companion
A search simulator: the user picks a search (has solution / no solution) and a bound N. BlooP checks 0..N and stops. FlooP checks until it finds or hits a demo cap of 20. Animated strip shows progress.

### Verdict: IMPROVE

### What's missing
The existing companion correctly demonstrates bounded vs. unbounded search. But it only offers pre-written searches — the user has no agency over what's being searched for. And crucially, the companion doesn't connect BlooP/FlooP to their mathematical significance: primitive recursive vs. general recursive functions, and the link to Gödel (the proof predicate is BlooP; "there exists a proof" requires FlooP). The companion treats BlooP/FlooP as a curiosity rather than as the conceptual scaffolding for incompleteness.

### Changes to make

1. **Add a "Write your own predicate" mode.** Let the user type a simple predicate like `n * n == 25` or `n > 100`. BlooP runs it up to bound N. FlooP runs it unbounded. This gives agency and makes the bounded/unbounded distinction personal.

2. **Add a halting predictor.** Show three programs: one that obviously halts (loops 10 times), one that obviously doesn't (infinite loop), one that might or might not (Collatz sequence). Ask the user: "Can you always tell?" Lead them to the realization that no general algorithm exists.

3. **Add a "Why it matters" panel** that connects to Gödel. Show: `"Is there a proof of G?"` → *"To answer this, search all possible proofs..."* → *"That search is unbounded."* → *"So 'G is provable' requires FlooP."* → *"FlooP programs might not halt."* → *"So the system can't decide its own completeness."* This makes the chapter's payoff explicit.

4. **Better visual:** Replace the horizontal strip with a vertical "search depth" meter that fills up as FlooP runs, with a red "NEVER HALTS" zone at the top that FlooP enters when there's no solution.

---

## Chapter 14: On Formally Undecidable Propositions of TNT

### Existing companion
Two widgets: (1) a MIU proof-pair checker (enter a 4-line derivation, check if it's a valid proof-pair), (2) a two-button Gödel sentence explorer ("Try to prove G" and "So G is true from outside").

### Verdict: REPLACE

### What's missing
This chapter is about the *construction* of the Gödel sentence — Gödel numbering as a concrete mechanism. The companion's first widget (MIU proof-pair) is overly technical and fiddly. The second widget is nearly identical to the Chapter 9 companion. Neither delivers the chapter's signature insight: that **syntax can be encoded as arithmetic**, creating a mirror inside TNT where TNT sees itself.

### What to build: "TNT Looks in the Mirror"

A three-act companion focused on Gödel numbering as a transformation:

**Act 1: Assign the Numbers**
Show the TNT alphabet as a row of symbols: `0, S, +, ·, =, (, ), ∀, ∃, ¬, ∧, ∨, ⊃`. Each symbol has a number (preset). The user can hover a symbol and see its code light up. Caption: *"Every symbol gets a number. This is the dictionary."*

**Act 2: Encode a Formula**
Below the alphabet, a preset formula appears (e.g. `S0=S0`, meaning "1=1"). The user clicks **"Encode."** An animation runs: each symbol lifts off and transforms into its number. The numbers combine into a single large Gödel number (using a simplified but accurate formula shown step-by-step — prime factorization). The Gödel number appears: huge, glowing. Caption: *"This formula is now a number. TNT can talk about numbers. So TNT can talk about this formula."*

**Act 3: The Self-Reference Loop**
A third panel. A statement appears: `"The formula with Gödel number G says: 'The formula with Gödel number G has no proof.'"` Animate an arrow: the Gödel number points back to the formula that contains that number. The loop closes visually — a glowing circuit. Caption: *"The formula refers to itself. This is not a trick. This is arithmetic."*

Then: a **"What follows?"** button that leads to the Chapter 9-style inescapable argument — but now the user has *seen* the mechanism, not just the conclusion.

---

## Chapter 15: Jumping Out of the System

### Existing companion
A single "Jump out of the system" button that switches a text panel from "Inside TNT — no proof of G; status unknown" to "Outside — G is true."

### Verdict: REPLACE

### What's missing
A button that changes a text label is not an experience. The chapter's insight — that we can see the truth of G because we have a description of TNT from outside it — is one of the most profound in the book. The companion reduces it to a binary toggle. There's no sense of what "jumping out" *feels* like, no sense of what the "inside" view looks like vs. the "outside" view, no sense of why the outside view has more power.

### What to build: "Inside/Outside"

A spatial metaphor companion. The canvas is divided into two zones:

**The Box (Inside TNT):** A walled enclosure with a dark interior. Inside the box, a proof-search machine is animating — churning through possible proofs, represented as branching tree nodes spreading out. None of them reach G. The machine keeps searching. A counter ticks up: "Proofs checked: 1,247..." The box has walls; it cannot see outside. Caption inside: *"From in here, G is just... missing."*

**The Field (Outside TNT):** The area outside the box. The user starts here. They can see the box from above — they can see the machine searching, they can see G floating above the box, unreachable from inside. A label on G: *"G: 'I am not provable.'"* Caption outside: *"From out here, we can see the whole machine. And we can see that it never finds G."*

**The key interaction:** A button: **"What does G say?"** → *"I am not provable in TNT."* → **"Does TNT prove G?"** → *"No — the machine never reaches it."* → **"So is G true?"** → *"Yes — what G says is correct. TNT cannot prove G, and G says exactly that."* Each step is a glowing callout appearing in the field, outside the box.

Then: **"Add G as an axiom."** The user clicks, G is dropped into the box. The machine resumes. After a moment, a new undecidable sentence G′ floats up above the box. Caption: *"Every time you patch the hole, a new one opens. Incompleteness is essential, not accidental."*

---

## Chapter 16: Self-Ref and Self-Rep

### Existing companion
An ENIUQ quine simulator: the user can edit a "program" and a "template," run ENIUQ, see the output, and compare it to the source. A "Reset to quine" button shows the self-reproducing case.

### Verdict: KEEP (with cosmetic improvements)

### Assessment
This is actually one of the best companions on the site. Quines are inherently interactive — you can *run* a self-replicating program and see the output equal the source. The ENIUQ framing is true to the book. The editable program/template distinction captures the "description/execution" duality that the chapter cares about.

### Minor improvements

1. **Add a live diff view.** When the output is compared to the source, show a diff: matching sections highlighted in green, mismatches in red. When it's a perfect quine, everything is green and a message appears: *"Output = Source. The program reproduced itself."*

2. **Add a biological parallel panel.** Below ENIUQ, a tiny two-step animation: DNA strand → replication → copy strand. Three labels: *"Template"*, *"Mechanism"*, *"Copy"*. Parallel labels point to ENIUQ: *"Template (data)"*, *"ENIUQ (program)"*, *"Output (copy)"*. Caption: *"Life does this too — and has for four billion years."*

3. **Add a "Why does this work?" reveal button** that explains, in one animated diagram, how the template acts as both instructions and data — the same duality Gödel used and DNA uses.

---

## Chapter 17: Church, Turing, Tarski, and Others

### Existing companion
A Collatz sequence runner: input a starting number, run the 3n+1 sequence, see the last 15 values. Caption notes no one has found an n that runs forever, no one has proved they all stop.

### Verdict: REPLACE

### What's missing
The Collatz sequence is an interesting mathematical object, but it is a *tangential example* — a cute aside — not the chapter's core. The chapter is about the **halting problem** (no algorithm can decide in general whether a program halts), **Church's thesis** (all reasonable models of computation are equivalent), and **Tarski's undefinability theorem** (truth can't be defined in its own language). The Collatz sequence illustrates "we don't know if this halts" but doesn't explain *why no general algorithm can decide halting*, which is the chapter's central proof.

### What to build: "The Halting Oracle That Can't Exist"

A proof-by-contradiction interactive:

**Setup:** The user is told: *"Suppose we had a perfect Halting Oracle — a machine that, given any program P and input X, always correctly answers: HALTS or RUNS FOREVER."*

**The Oracle appears:** A glowing machine with an input slot (program) and an output slot (HALTS / RUNS FOREVER). The user can feed it 3 preset programs and see it correctly answer (it's just preset logic, but it feels like an oracle).

**The Trap:** A button: **"Build the Destroyer."** The user builds (step by step, clicking through) a program D that:
1. Takes a program P as input
2. Asks the Oracle: "Does P halt when run on itself?"
3. If Oracle says HALTS → D runs forever
4. If Oracle says RUNS FOREVER → D halts

Each step is an animated block in a flowchart that the user assembles.

**The Paradox:** **"Now feed D to itself."** The user drags D into D's input slot. The Oracle lights up, tries to answer, and... sparks. A loop forms. Caption: *"If D halts, it must run forever. If it runs forever, it must halt. The Oracle cannot answer."*

**Conclusion panel:** *"No Oracle can exist. The halting problem is undecidable. This is not a limitation of technology — it is a mathematical impossibility."*

Then a second smaller panel: **Tarski** — showing that "This sentence is false" can't be assigned a truth value in its own language, paralleling the halting problem. Caption: *"Truth, like halting, cannot be defined from inside."*

---

## Chapter 18: Artificial Intelligence — Retrospects

### Existing companion
A three-level sort demo: enter three numbers, click Run, see bubble sort described at "human," "rules," and "code" levels simultaneously.

### Verdict: REPLACE

### What's missing
The three-level sort is literally the same concept as Chapter 10's companion (levels of description) — it's a duplicate with different content. Chapter 18 is specifically about the *history and limitations of symbolic AI*: the frame problem, brittleness, the gap between rule-following and understanding. The companion ignores all of this and just repeats the levels-of-description theme. It does not engage with the chapter's actual content at all.

### What to build: "The Brittle Mind"

An interactive demonstration of symbolic AI's characteristic failure mode — brittleness — alongside its successes.

**Part 1: The Expert System**
A small tree of yes/no rules for diagnosing "what animal is this?" (a tiny, self-contained decision tree, not reproducing anything). The user answers questions (Has fur? Eats meat? Has stripes?) and the system confidently identifies the animal. It works great. Caption: *"Rules + logic = intelligence. Or so it seemed."*

**Part 2: The Frame Problem**
Now shift context. The user is shown a simple world: a table, a cup, a book. A robot follows rules. The user clicks **"Move the cup."** The robot moves the cup. The user then asks: **"Is the book still on the table?"** The robot must check every rule... and has no rule for "things not mentioned don't change." It outputs: `UNKNOWN`. 

The user can add rules to help: "If X is moved and Y is not X, Y stays put." But then: **"What if there's an earthquake?"** The robot fails again. Caption: *"To know what doesn't change, you have to know everything that could. The rules never end."*

**Part 3: The Gap**
A slider: "How many rules?" goes from 10 to 10,000 to 10,000,000. At each level, a counter shows: "Situations handled: X" and "Situations not handled: ∞." Caption: *"Symbolic AI added more rules. The gap never closed."*

The companion ends with a question, not an answer: *"What would it take to cross the gap?"* — pointing forward to Chapter 19.

---

## Chapter 19: Artificial Intelligence — Prospects

### Existing companion
A Minsky-style frame widget: a "Birthday party" frame with slots (who, when, where, cake?, presents?). Fill some slots, click "Infer defaults," the rest fill with typical values.

### Verdict: IMPROVE

### What's missing
The frame demo is actually on-topic — frames are exactly what the chapter discusses. But it's too static and single-example. The insight of frames is *context-sensitive default reasoning*: when you say "I went to a restaurant," a whole frame activates (host, menu, waiter, bill, tip) and you don't have to state every slot. The companion lets you fill one frame but doesn't demonstrate how frames *compete*, how frames *inherit*, or how the *wrong frame* causes misunderstanding — which is the chapter's most interesting territory.

### Changes to make

1. **Add multiple frames**: Birthday party, Restaurant, Doctor's office, Classroom. Show them as cards. When the user types or clicks a context trigger word ("birthday," "menu," "prescription"), the matching frame activates with a glow.

2. **Add "Frame Competition."** Show an ambiguous sentence: *"She gave him a shot."* → Two frames activate: MEDICAL (doctor, needle, injection) and BASKETBALL (player, ball, attempt). Both light up. The user picks which interpretation seems right. Then a context is revealed ("...at the hospital.") and the medical frame wins, the other fades. Caption: *"Context selects the frame. The frame fills the gaps."*

3. **Add "Frame Inheritance."** Show that FANCY RESTAURANT inherits from RESTAURANT: all the same slots plus new ones (sommelier, dress code). The user can see slots being shared down the chain.

4. **Add an "Exception" slot.** Let the user override a default ("cake? → NO") and watch the frame update gracefully. Caption: *"Defaults are just the best guess until you know better."*

5. **Connecting caption:** *"Frames are what intelligence uses instead of logic — the shortcuts that make understanding fast."*

---

## Chapter 20: Strange Loops, Or Tangled Hierarchies

### Existing companion
A "tangled hierarchy" game where on your turn you can either move a token OR change the rule. The levels (game rules and game moves) are tangled because you can modify the rules from within the game.

### Verdict: REPLACE

### What's missing
The game-with-changeable-rules is an interesting idea, but it's confusing in practice (what is the rule? what does "change the rule" do? there's no clear feedback or payoff), and it only illustrates one small aspect of strange loops. Chapter 20 is the capstone — it should bring together Bach, Escher, and Gödel for a final, unified, emotionally resonant experience. The companion should feel like the end of a journey, not a puzzle-game with unclear mechanics.

### What to build: "The Eternal Golden Braid"

A final, beautiful, unified companion that shows all three strange loops simultaneously and makes their common structure visible.

**Layout:** Three vertical panels side by side, one per domain, plus a central "braid" animation connecting them.

**Panel 1 — Bach:** The Canon per Tonos, simplified. An animated staff with a melody that rises through the keys. Use Web Audio API to play 6 ascending tones that resolve back to the starting pitch (just a scale, not reproducing any copyrighted melody — just ascending notes in the equal-tempered scale). A loop-arrow curves back: *"After 6 steps up, you're home."* The animation loops continuously, gently, like breathing.

**Panel 2 — Escher:** An SVG-drawn impossible staircase (original SVG code, not reproducing Escher's artwork). A small figure walks up, and up, and up — and is back at the start. The loop is spatial. The animation loops continuously.

**Panel 3 — Gödel:** The sentence G types itself out, completes, then an arrow curves from the end back to `"I"` at the beginning. The loop is logical. It also loops continuously.

**The Central Braid:** Between the three panels, three colored threads (SVG paths) weave together and loop — an actual braid visualization, animated. The three threads represent the three domains, interweaving.

**The Interactive Layer:** The user can click any panel to pause/play its loop. A slider: **"What makes it a strange loop?"** drags a highlight across all three panels simultaneously, pointing to: (1) the ascending/rising motion, (2) the return to the start, (3) the crossing of levels. All three panels light up together at each stage.

**The Final Message:** Below the braid, as the user has explored all three: text fades in slowly — *"In each: a system that rises through its own levels and finds itself at the beginning. This is the structure of self-reference. This, Hofstadter suggests, may be the structure of 'I.'"*

**Why this works:** The user ends the book's companion feeling the unity of the three strands — not reading about it, but watching the braid turn. The final message is not an explanation but a resonance.

---

## Summary Table

| Chapter | Verdict | Core Change |
|---|---|---|
| Intro | REPLACE | Animated multi-domain strange loop experience |
| 1: MU-Puzzle | IMPROVE | Add I-count tracker, "Step Outside" reveal |
| 2: pq-system | IMPROVE | Visual builder, two-panel meaning reveal |
| 3: Figure/Ground | REPLACE | Ambiguous SVG + formal system ground demo |
| 4: Consistency/Completeness | IMPROVE | Add consistency/completeness game + keep geometry slider |
| 5: Recursion | IMPROVE | Animated tree growth + language nesting + call stack |
| 6: Location of Meaning | REPLACE | Multi-decoder meaning-emergence experience |
| 7: Propositional Calculus | KEEP | Add formula builder + tautology detector + visual modus ponens |
| 8: TNT | IMPROVE | Add Gödel numbering panel + derivation chain |
| 9: Mumon & Gödel | REPLACE | Two-corridor inescapable argument + Zen moment |
| 10: Levels of Description | IMPROVE | Add ant colony panel + reframe Level 2 |
| 11: Brains & Thoughts | REPLACE | Two-level neuron/symbol network with level toggle |
| 12: Minds & Thoughts | ALREADY REDESIGNED | — |
| 13: BlooP/FlooP | IMPROVE | User-written predicates + Gödel connection panel |
| 14: Undecidable Propositions | REPLACE | Three-act Gödel numbering mirror experience |
| 15: Jumping Out | REPLACE | Spatial inside/outside box metaphor |
| 16: Self-Ref/Self-Rep | KEEP | Add diff view + biological parallel panel |
| 17: Church/Turing/Tarski | REPLACE | Halting Oracle proof-by-contradiction interactive |
| 18: AI Retrospects | REPLACE | Brittle mind / frame problem demo |
| 19: AI Prospects | IMPROVE | Multiple frames, frame competition, inheritance |
| 20: Strange Loops | REPLACE | Unified Bach/Escher/Gödel braid with Web Audio |
