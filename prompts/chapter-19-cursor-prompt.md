# Chapter 19 — AI Prospects: Substantial Improvement

## What this companion must deliver

Three ideas from the chapter, each more interesting than the last:

1. **Frames and defaults** — how a situation type activates a whole schema of expected values, and how filling one slot changes what's inferred about others
2. **Frame competition** — the same input activates multiple frames; context picks the winner; this is where meaning and ambiguity live
3. **The limits of frames** — frames handle typical situations beautifully and fail at genuinely novel ones; the chapter is honest about this

The current single birthday party frame with five slots illustrates none of these ideas adequately. Expand it substantially.

---

## Keep the existing frame widget as a starting point

Don't discard the birthday party frame — it's a reasonable foundation. Expand it and add two more sections around it.

---

## Section 1: Frames and default reasoning (expand the existing widget)

### More frames, not one

Add a frame selector at the top of the widget. The user can choose from four frames:

- **Birthday party** (current)
- **Restaurant visit**
- **Doctor's appointment**
- **Job interview**

Each frame has its own slot set and default values. Switching frames completely changes the slot panel.

**Restaurant visit slots and defaults:**
- host: [no default — must be filled]
- time: lunch
- dress code: casual
- menu: printed menu
- bill: split or one pays
- tip: expected
- reservation: recommended

**Doctor's appointment slots and defaults:**
- patient: [no default]
- appointment type: checkup
- wait time: 15–30 minutes
- paperwork: yes
- prescription: possible
- follow-up: scheduled if needed

**Job interview slots and defaults:**
- candidate: [no default]
- format: in-person
- duration: 45–60 minutes
- dress code: business professional
- thank-you note: expected after

### Context-sensitive defaults

This is the key idea that's currently missing. When the user fills certain slots, other slots' defaults should update automatically — not just when they click "Infer defaults," but live as they type.

Implement "cascade inference": when a slot value changes, re-evaluate all unfilled slots' defaults based on the new context.

**Examples of cascading defaults:**

For Birthday party:
- If `where` = "park" → `cake` default changes from "yes" to "probably, but simpler" and `catering` slot appears with default "no"
- If `age` slot is added and filled with "5" → `presents` default changes to "toys/games" and a new slot `party games` appears with default "yes"
- If `where` = "restaurant" → `cake` default changes to "ordered from venue"

For Restaurant:
- If `occasion` = "anniversary" → `dress code` default changes from "casual" to "smart casual or formal" and `reservation` default changes from "recommended" to "essential"
- If `time` = "lunch" → `bill` default changes to "individual pays own"
- If `time` = "dinner" → `tip` prominence increases

**Implementation:** Each slot has a default value AND a set of conditional overrides keyed by other slot values. When any slot is filled, run through all conditional overrides and update unfilled slots accordingly. Show updated defaults with a subtle amber highlight that fades after 1 second — so the user can see which slots changed.

### The slot panel itself

Redesign the slot display to show more information per slot:

Each slot row contains:
- Slot name (bold)
- Input field or dropdown for the value
- A "default" badge showing the current default in muted text (e.g. `default: yes`) — this updates when context changes
- A small lock icon if the slot has been manually filled (overriding the default)

Caption beneath the widget: *"Notice: filling one slot changes what's inferred about others. Context doesn't just fill gaps — it reshapes the whole structure."*

---

## Section 2: Frame competition — same words, two worlds

Title: **"The same input, two frames."**

Introductory text: *"Frames don't activate one at a time. Ambiguous language activates multiple frames simultaneously. Context resolves the competition — but the competition itself is where meaning lives."*

### The ambiguous sentence display

Show a sentence in large text at the top:

> *"She gave him a shot."*

Below it, two frame panels appear side by side, both partially activated:

**Frame: MEDICAL ENCOUNTER**
- agent: She (doctor / nurse)
- recipient: him (patient)
- instrument: needle / syringe
- location: clinic / hospital
- purpose: treatment / vaccination

**Frame: BASKETBALL GAME**
- agent: She (player)
- recipient: him (defender)
- instrument: basketball
- location: court
- purpose: score / assist

Both frames are shown in amber/gold "activated" state. A "Competition" label sits between them with a small animation — two panels slightly vibrating, neither fully winning.

### The context resolver

Below the two frames, a row of context buttons:

- **"...in the hospital."** → Medical frame wins. Basketball frame dims. Medical slot `location` highlights: "hospital confirmed."
- **"...at the free-throw line."** → Basketball frame wins. Medical frame dims.
- **"...of espresso."** → Both frames lose. A third frame appears: CAFÉ/BEVERAGE. Caption: *"Context didn't just resolve the competition — it introduced a frame neither was anticipating."*
- **"...of confidence."** → Both frames lose. A PSYCHOLOGICAL frame appears with `shot` interpreted as "burst of confidence." Caption: *"Metaphorical extension — frames handling language they weren't built for."*

When a context button is clicked:
- The winning frame expands slightly and its border brightens
- The losing frame(s) dim to 30% opacity
- A label appears: *"[Frame] activated. [Other frame] suppressed."*
- The caption updates with the observation about what happened

After the user has tried at least two contexts, a summary appears:

*"The same three words. Four completely different meanings. The frames aren't just templates — they're lenses. Context chooses the lens."*

### A second ambiguous sentence

Add a toggle: "Try another sentence." This loads:

> *"Time flies like an arrow."*

Which activates: TEMPORAL OBSERVATION frame ("time passes quickly") vs. ENTOMOLOGY frame ("a species of flies called 'time flies' enjoy arrows") vs. IMPERATIVE frame ("measure the speed of flies the way you'd measure an arrow"). This is Hofstadter's own favorite example of structural ambiguity. Show all three briefly, then let context resolve them.

---

## Section 3: The limits — what frames still can't do

Title: **"What frames still miss."**

Introductory text: *"Frames handle typical situations beautifully. But Hofstadter is honest: frames still can't handle genuine novelty, self-reference, or the kind of fluid understanding that lets humans recognize when a situation has no frame at all."*

### Three failure cases — interactive

Show three scenario cards. The user clicks each to see what happens when frames meet something genuinely novel.

**Card 1: "The frame that doesn't exist"**

Scenario: *"You arrive at what appears to be a restaurant. The menu lists only prime numbers. The waiter is made of fog. There are no chairs — only questions."*

Show the RESTAURANT frame trying to activate: slots appear one by one, but each fails to match:
- `menu`: ✗ "prime numbers — no default applies"
- `seating`: ✗ "questions — no category match"
- `waiter`: ✗ "fog — entity type unknown"

The frame activates to 30%, then stalls. Caption: *"The frame started activating — then couldn't complete. Human readers laugh at this. They know it's absurd. A frame-based system would either crash or pick the closest match and get everything wrong."*

**Card 2: "The self-referential situation"**

Scenario: *"You are in a frame about frames. The current slot is: 'what slot should this slot describe?'"*

Show a frame panel where one slot contains itself. The system starts to fill defaults, encounters the self-reference, and shows a spinning indicator that eventually resolves to: `∞ — infinite regress detected`.

Caption: *"Frames can represent most situations. They cannot represent themselves representing themselves. For that, you'd need — as Hofstadter suggests — a strange loop."*

**Card 3: "The novel situation"**

Scenario: *"Your friend tells you she's experiencing 'a blue kind of Tuesday.' You immediately understand what she means, even though no frame in your library covers this combination."*

Show a search across frames: EMOTION frames, COLOR frames, CALENDAR frames — none match. Then show a "blending" animation where elements of all three merge into a new temporary structure.

Caption: *"Human understanding doesn't fail here — it blends, metaphorizes, reaches for the nearest structure and adapts it. This fluid, on-the-fly frame construction is what symbolic AI — frames included — has never achieved."*

### The closing question

After all three cards, the same open question from Chapter 18 reappears, now sharpened:

*"Frames are a genuine advance over pure rule-following. They encode typicality, context, and inheritance. But they still fail at novelty, self-reference, and metaphor — the things that feel most distinctively human about thought."*

*"Hofstadter's prospect: perhaps the missing ingredient isn't better frames, but the strange loop — a representational system that can turn its own representations into objects of representation."*

---

## Visual design notes

### Section 1 (frame widget)
- Frame selector: a horizontal row of tab-style buttons at the top of the widget panel
- Slot rows: clean, consistent — name | input | default badge | lock icon
- Cascading default highlights: `background: rgba(212, 160, 48, 0.15)` fading over 1s using CSS transition
- Keep the existing amber/warm color scheme

### Section 2 (frame competition)
- Two frame panels side by side, identical width, slightly smaller than full-width
- Winning frame: border brightens, slight scale-up (transform: scale(1.02))
- Losing frame: opacity drops to 0.3
- Competition state (both active): subtle pulse animation on both borders, alternating
- Context buttons: styled as clickable sentence-completion chips, slightly larger than normal buttons

### Section 3 (frame limits)
- Three cards in a row (or stacked on mobile)
- Each card has a scenario text at top (italic, evocative) and the frame-failure animation below
- Card 2's self-referential slot should render with a small ∞ symbol and a slight visual glitch effect (brief CSS filter: hue-rotate animation)
- The closing question should have extra vertical breathing room — same treatment as Chapter 18's open question panel
