# Chapter 18 — AI Retrospects: Complete Rebuild

## What this companion must deliver

Two experiences that capture the chapter's arc:

1. **The frame problem** — the most vivid and concrete demonstration of why symbolic AI hit a wall. The user should feel firsthand the impossibility of writing rules for "what doesn't change."

2. **The brittleness demonstration** — a rule-based system that works brilliantly inside its domain and fails completely outside it. The user should feel both the genuine intelligence of symbolic AI and its characteristic failure mode.

End with the open question the chapter leaves: can rules — more rules, better rules, self-modifying rules — ever add up to understanding?

---

## Remove the current companion entirely

The three-level sort demo duplicates Chapter 10's concept (levels of description applied to a computation) and misses everything distinctive about Chapter 18. Replace it completely.

---

## Section 1: The Frame Problem

### Setup

Title: **"The frame problem: what stays the same?"**

Introductory text: *"In 1969, AI researchers John McCarthy and Patrick Hayes identified a problem that would haunt symbolic AI for decades. When something changes in the world, how does a reasoning system know what DIDN'T change?"*

### The world

Show a simple room — an SVG illustration, top-down view, ~400×300px. The room contains:
- A table with a cup and a book on it
- A lamp on the floor
- A robot in the corner
- A window on the far wall

### The action

A button: **"Robot moves the cup to the floor."**

When clicked, animate: the cup slides from the table to the floor. The animation takes ~800ms.

### The question cascade

After the animation, a series of questions appears one at a time, each with a YES/NO answer that the reasoning system must provide:

1. "Is the cup on the table?" → NO *(changed)*
2. "Is the book still on the table?" → YES *(didn't change)*
3. "Is the lamp still on the floor?" → YES *(didn't change)*
4. "Is the window still in the wall?" → YES *(didn't change)*
5. "Is the robot still in the room?" → YES *(didn't change)*

For questions 1–3, the YES/NO answers appear automatically with green/amber coloring. Then:

**"How did the system answer questions 2–5?"**

A rule card appears:

```
FRAME AXIOM: "If an action A does not directly affect object X,
              then X's properties are unchanged after A."
```

Caption: *"Simple enough. But how does the system know whether A 'directly affects' X? That requires more rules..."*

### The explosion

Now click **"Add a complication."**

Each click adds one more scenario that breaks the frame axiom:

**Click 1 — Vibration:** *"The robot moving the cup vibrates the table. Does the book move?"* New rule needed: rules about vibration propagation.

**Click 2 — Shadows:** *"The lamp casts a shadow. When the cup moved, did the shadow change?"* New rule needed: rules about lighting and shadows.

**Click 3 — The robot's memory:** *"The robot remembers where the cup was. Has its memory changed?"* New rule needed: rules about mental state updates.

**Click 4 — Causation:** *"The book was leaning against the cup. Does it fall?"* New rule needed: rules about physical support and stability.

After 4 clicks, a counter appears: **"Rules needed so far: 14 and counting."**

A button appears: **"Keep going?"** — clicking it adds: *"For a realistic world model, the rules needed to handle all possible interactions are effectively infinite. This is the frame problem."*

Final caption: *"The frame problem is not solved by adding more rules. Every new rule creates new edge cases. Common sense — the thing humans handle effortlessly — requires knowing implicitly what matters and what doesn't. Symbolic AI had no way to represent that implicitness."*

---

## Section 2: Brittleness — the expert system

### Setup

Title: **"The expert system: brilliant inside, blind outside."**

Introductory text: *"Symbolic AI's greatest achievement was the expert system: a program encoding human expertise as explicit rules. Within its domain, it could match or exceed human performance. Outside it, it was helpless."*

### The expert system interface

Show a mock "Medical Diagnosis Expert System" — a simple decision-tree interface that asks yes/no questions and diagnoses a condition. The questions are well-chosen to lead to a correct diagnosis within a narrow domain.

**In-domain flow (works correctly):**

Show a preset patient description: *"Patient presents with fever, fatigue, and a rash on the torso. No recent travel. No known allergies."*

The system asks five questions (clicking YES or NO each time):
1. "Is body temperature above 38°C?" → YES
2. "Is the rash ring-shaped?" → YES
3. "Was the patient recently in wooded or grassy areas?" → YES (note: contradicts the setup — but show the system catching this)

After 3 questions, diagnosis: **"Probable Lyme disease. Recommend blood test and antibiotic course."**

Label: ✓ *"Within its domain: confident, specific, correct."*

### Out-of-domain failure

Now show a second preset case: *"Patient presents with difficulty breathing, confusion, and a fear of water."*

The system asks its questions again:
1. "Is body temperature above 38°C?" → NO
2. "Is the rash ring-shaped?" → NO
3. "Has the patient been in wooded areas?" → NO

System output: **"Condition does not match known profiles. Unable to diagnose."**

A small label appears: *"The symptoms describe rabies — outside this system's rule set."*

Now add: *"A human doctor hearing 'fear of water' would immediately recognize the significance. The expert system has no mechanism for 'this symptom is unusual and important.' It only checks its rules."*

### The brittleness slider

Add a "Domain breadth" slider with three positions:

- **Narrow domain:** System answers 9/10 questions correctly, confidently
- **Medium domain:** System answers 6/10 correctly, confidence drops
- **General intelligence:** System answers 3/10 correctly — no better than chance for most questions

Caption: *"Symbolic AI systems were extraordinarily good at their narrow domain and nearly useless outside it. Expanding the domain required exponentially more rules — and each new rule interacted with all existing rules in unpredictable ways."*

---

## Section 3: The Spectrum — from rules to something more

### The historical arc

Show a horizontal timeline with five entries, each clickable:

**1956 — The Dartmouth Conference**
*"Founding moment of AI. McCarthy, Minsky, Shannon, and others gather. Prediction: within a generation, machines will be able to do any work a human can do."*

**1966 — ELIZA**
*"Joseph Weizenbaum's chatbot. Simple pattern-matching rules produce surprisingly human-seeming responses. People confide in it. Weizenbaum is disturbed."*

**1972 — MYCIN**
*"Medical expert system. 600 rules for diagnosing bacterial infections. Outperforms medical students and matches specialists — within its narrow domain."*

**1969 — The frame problem named**
*"McCarthy and Hayes publish the paper. The AI community begins to realize common sense is not just 'more rules.'"*

**1979 — GEB published**
*"Hofstadter asks: can formal rules, no matter how many or how clever, constitute understanding? He leaves the question open."*

Each entry is a small card. Clicking expands it with the description above. The timeline runs left to right chronologically.

### The open question

After the timeline, a final panel — no buttons, no interactivity, just text and a question:

*"Symbolic AI succeeded at tasks that seemed to require intelligence — game playing, theorem proving, diagnosis — and failed at tasks that seemed trivially easy for humans: understanding context, applying common sense, knowing what matters."*

*"Hofstadter's suggestion: what's missing is not more rules, but the right kind of structure — multi-level, self-referential, able to represent itself. The strange loop that appears in Gödel's sentence, in quines, in brains — perhaps that structure is what turns rule-following into understanding."*

Then, in larger text, the open question:

> *"Can enough rules, organized in the right way, add up to mind? Or is there something that rules — however many, however cleverly arranged — fundamentally cannot do?"*

No answer. Just the question. The chapter ends this way, and so should the companion.

---

## Visual design notes

### Section 1 (frame problem)
- The room SVG should be clean and slightly charming — top-down view, simple shapes, readable at a glance
- The "complication" clicks should each add a new visual element to the room (a shadow indicator, a memory icon near the robot, etc.) making the complexity physically visible
- The rule counter should feel ominous as it grows — increase font size slightly with each click, change color toward amber

### Section 2 (expert system)
- Style the interface to look like a genuine 1970s/80s computer terminal — monospace font, slightly greenish or amber tint to the text panel, bordered by a thick frame
- The diagnosis output should look authoritative — bold, styled as a formal medical readout
- The "outside domain" failure should contrast sharply — same interface, same authority, but manifestly wrong or helpless

### Section 3 (timeline)
- Clean horizontal timeline with year markers
- Each card should be compact — title, one-sentence description, expands on click
- The open question at the end should have more visual breathing room than everything else — larger margins, slightly larger font, centered

### General
- This companion should feel historically grounded — less mathematical than Chapters 13–17, more humanistic and reflective
- The tone shifts here: GEB is moving from formal systems toward consciousness and AI, and the companion should feel that shift
