# Chapter 18 — Bug Fixes and Polish Pass

## Overview

The implementation is substantially correct — the frame problem, expert system, and timeline are all working. These fixes address specific bugs (domain slider, Lyme diagnosis logic, terminal layout) and polish issues (rule count growth, section bridging, timeline expansion placement).

---

## Fix 1: Replace the domain slider with a segmented button group

The current `<input type="range" min="0" max="2" step="1">` looks like a smooth continuous slider but only has three discrete positions. Users drag it and nothing appears to happen until they snap to exactly position 1 or 2. This makes the slider feel broken.

**Replace the range input with three explicit buttons styled as a segmented control:**

```html
<div class="ch18-domain-btns" role="group" aria-label="Domain breadth">
  <button type="button" class="ch18-domain-btn ch18-domain-active" data-level="0">Narrow</button>
  <button type="button" class="ch18-domain-btn" data-level="1">Medium</button>
  <button type="button" class="ch18-domain-btn" data-level="2">General</button>
</div>
```

**CSS for the segmented control:**
- Buttons sit adjacent with no gap between them, sharing borders
- Left button: `border-radius: 6px 0 0 6px`
- Middle button: `border-radius: 0`, `border-left: none`, `border-right: none`
- Right button: `border-radius: 0 6px 6px 0`
- Active button (`.ch18-domain-active`): accent background color, light text
- Inactive buttons: panel background, muted text

**JS — update the click handler in ch18-companion.js:**

Remove the `slider.addEventListener('input', syncSlider)` block entirely. Replace with:

```javascript
var domainBtns = document.querySelectorAll('.ch18-domain-btn');
var SLIDER_TEXT = [
  '<strong>Narrow domain:</strong> system answers ~9/10 in-domain questions correctly, with high confidence.',
  '<strong>Medium domain:</strong> ~6/10 correct as rules overlap; confidence drops; contradictions multiply.',
  '<strong>General intelligence:</strong> ~3/10 — no better than chance on open-world questions.'
];
var ACCURACY = [90, 60, 30];

function syncDomainLevel(level) {
  domainBtns.forEach(function(b) {
    b.classList.toggle('ch18-domain-active', parseInt(b.getAttribute('data-level'), 10) === level);
  });
  if (sliderOut) {
    sliderOut.innerHTML = SLIDER_TEXT[level] +
      '<div class="ch18-acc-bar-wrap">' +
      '<span class="ch18-acc-label">Accuracy: ~' + Math.round(ACCURACY[level] / 10) + '/10</span>' +
      '<div class="ch18-acc-bar"><div class="ch18-acc-fill" style="width:' + ACCURACY[level] + '%"></div></div>' +
      '</div>';
  }
}

domainBtns.forEach(function(btn) {
  btn.addEventListener('click', function() {
    syncDomainLevel(parseInt(btn.getAttribute('data-level'), 10));
  });
});
syncDomainLevel(0); // initialize
```

**CSS for the accuracy bar:**
```css
.ch18-acc-bar-wrap { margin-top: 0.45rem; }
.ch18-acc-label { font-size: 0.78rem; color: var(--muted); }
.ch18-acc-bar { height: 8px; background: var(--border); border-radius: 4px; margin-top: 0.25rem; overflow: hidden; }
.ch18-acc-fill { height: 100%; background: var(--accent); border-radius: 4px; transition: width 0.4s ease; }
```

**Remove** the `<input type="range">` element from `index.html` and its associated CSS entirely.

---

## Fix 2: Fix RULE_TOTALS to feel exponential

In `ch18-companion.js`, change:

```javascript
var RULE_TOTALS = [5, 8, 11, 14];
```

to:

```javascript
var RULE_TOTALS = [4, 9, 18, 34];
```

These values reflect genuine combinatorial explosion (roughly doubling each time) rather than a neat arithmetic sequence of +3. The progression 4 → 9 → 18 → 34 feels like the problem is accelerating, not growing linearly.

Also update the rule count display: when `complicateN >= 4` (the count reaches 34), append a small annotation after the count number:

```javascript
if (complicateN >= 4 && ruleCountWrap) {
  var annotation = document.createElement('span');
  annotation.style.cssText = 'font-size:0.72rem;color:var(--muted);margin-left:0.4rem;font-style:italic;';
  annotation.textContent = 'and growing faster than linearly…';
  ruleCountWrap.appendChild(annotation);
}
```

---

## Fix 3: Move case description inside the terminal

Currently `termPreset` is a `<p>` element outside the terminal box, breaking the terminal illusion. The case description should be the first thing printed inside the terminal.

**In `index.html`:** Add `hidden` to the `<p id="ch18-term-preset">` element:
```html
<p class="ch18-preset-box" id="ch18-term-preset" hidden>Select a case below.</p>
```

**In `ch18-companion.js`**, in `startLyme()`, replace:
```javascript
if (termPreset) termPreset.textContent = 'Patient presents with...';
```
with:
```javascript
termPrint('&gt; CASE FILE:');
termPrint('&gt; <em>Patient presents with fever, fatigue, and a rash on the torso. No recent travel. No known allergies.</em>');
termPrint('');
```

In `startRabies()`, replace:
```javascript
if (termPreset) termPreset.textContent = 'Patient presents with...';
```
with:
```javascript
termPrint('&gt; CASE FILE:');
termPrint('&gt; <em>Patient presents with difficulty breathing, confusion, and a fear of water.</em>');
termPrint('');
```

---

## Fix 4: Fix the Lyme case NO-to-Q3 path

Currently if the user answers NO to Q3 ("wooded or grassy areas?"), the code prints a placeholder and calls `finishLyme()` — which still produces a Lyme diagnosis. This is logically wrong: without tick exposure, Lyme disease should not be the confident diagnosis.

**In `ch18-companion.js`**, find the `lyme3` handler's `else` branch:

```javascript
} else {
  termPrint('');
  termPrint('(Path without exposure — demo skips to alternate branch.)');
  termPrint('');
  finishLyme();
}
```

**Replace with:**

```javascript
} else {
  termPrint('');
  termPrint('Q4: Has the patient recently used any new medications or detergents?');
  addYn('lyme4');
}
```

**Add a new handler for `lyme4` inside `onExpertAnswer`**, after the existing `lyme3` handler:

```javascript
} else if (step === 'lyme4') {
  termPrint('');
  termPrint('<span class="ch18-term-catch">No matching rule combination for current symptom set.</span>');
  termPrint('Differential: viral exanthem, drug reaction, or other dermatological condition.');
  termPrint('');
  termPrint('<div class="ch18-diagnosis" style="border-color:#fbbf24;background:#1c1500;color:#fef9c3;"><strong>ASSESSMENT:</strong> No confident diagnosis. Recommend specialist referral and further investigation.</div>');
  var ok = document.getElementById('ch18-lyme-ok');
  if (ok) ok.hidden = false;
}
```

This makes the expert system feel genuinely rule-driven: it only confidently diagnoses when the full rule chain fires, and hedges when it doesn't — which is more realistic and more illustrative of both the system's genuine usefulness and its limitations.

---

## Fix 5: Add a bridging sentence between sections 1 and 2

In `index.html`, between the closing `</div>` of the frame-problem section and the `<h2>` opening section 2, add:

```html
<p class="ch18-caption" style="border-left:3px solid var(--border);padding-left:0.65rem;margin:0.85rem 0;">
  The frame problem and brittleness are two faces of the same limitation: symbolic AI could encode what it knew, but had no way to represent what it <em>didn't</em> know — or what mattered and what didn't.
</p>
```

---

## Fix 6: Fix timeline expand panel placement

Currently all `.ch18-tl-expand` panels appear below the entire track container. Clicking a card may show its expansion far away from the card, requiring scrolling. Fix by placing each expand panel immediately after its card.

**In `index.html`**, restructure the timeline HTML. Wrap each card and its expand panel together:

```html
<div class="ch18-tl">
  <div class="ch18-tl-track">

    <div class="ch18-tl-item">
      <div class="ch18-tl-card" data-expand="ch18-tl-1956" tabindex="0" role="button">
        <div class="ch18-tl-year">1956</div>
        <div class="ch18-tl-blurb">Dartmouth — AI named; bold predictions.</div>
      </div>
      <div id="ch18-tl-1956" class="ch18-tl-expand" hidden>
        <strong>The Dartmouth Conference.</strong> Founding moment of AI. McCarthy, Minsky, Shannon, and others gather. Prediction: within a generation, machines will be able to do any work a human can do.
      </div>
    </div>

    <div class="ch18-tl-item">
      <div class="ch18-tl-card" data-expand="ch18-tl-1966" tabindex="0" role="button">
        <div class="ch18-tl-year">1966</div>
        <div class="ch18-tl-blurb">ELIZA — pattern rules, human-seeming talk.</div>
      </div>
      <div id="ch18-tl-1966" class="ch18-tl-expand" hidden>
        <strong>ELIZA.</strong> Joseph Weizenbaum's chatbot. Simple pattern-matching rules produce surprisingly human-seeming responses. People confide in it. Weizenbaum is disturbed.
      </div>
    </div>

    <div class="ch18-tl-item">
      <div class="ch18-tl-card" data-expand="ch18-tl-1969" tabindex="0" role="button">
        <div class="ch18-tl-year">1969</div>
        <div class="ch18-tl-blurb">Frame problem named — common sense isn't "more rules."</div>
      </div>
      <div id="ch18-tl-1969" class="ch18-tl-expand" hidden>
        <strong>The frame problem named.</strong> McCarthy and Hayes publish the paper. The AI community begins to realize common sense is not just "more rules."
      </div>
    </div>

    <div class="ch18-tl-item">
      <div class="ch18-tl-card" data-expand="ch18-tl-1972" tabindex="0" role="button">
        <div class="ch18-tl-year">1972</div>
        <div class="ch18-tl-blurb">MYCIN — 600 rules; excels in a narrow clinic.</div>
      </div>
      <div id="ch18-tl-1972" class="ch18-tl-expand" hidden>
        <strong>MYCIN.</strong> Medical expert system. Roughly 600 rules for diagnosing bacterial infections. Outperforms medical students and matches specialists — within its narrow domain.
      </div>
    </div>

    <div class="ch18-tl-item">
      <div class="ch18-tl-card" data-expand="ch18-tl-1979" tabindex="0" role="button">
        <div class="ch18-tl-year">1979</div>
        <div class="ch18-tl-blurb">GEB — can rules ever be understanding?</div>
      </div>
      <div id="ch18-tl-1979" class="ch18-tl-expand" hidden>
        <strong>GEB published.</strong> Hofstadter asks: can formal rules, no matter how many or how clever, constitute understanding? He leaves the question open.
      </div>
    </div>

  </div>
</div>
```

**Update CSS** — change `.ch18-tl-track` to allow items to wrap, and add `.ch18-tl-item`:

```css
.ch18-tl-track {
  display: flex;
  gap: 0.5rem;
  align-items: flex-start;  /* changed from stretch */
  flex-wrap: nowrap;
  min-width: min-content;
  padding: 0.25rem 0;
}
.ch18-tl-item {
  flex: 0 0 140px;
  display: flex;
  flex-direction: column;
}
.ch18-tl-card {
  flex: none;  /* remove the flex-basis from the card itself; it's now on the item */
}
.ch18-tl-expand {
  margin-top: 0.35rem;
  width: 100%;
}
```

The expand panel now appears directly below its card within the same flex item column.

---

## Fix 7: Verify cup animation geometry

The cup element has `cy=192` (ellipse center) and the rect starting at `y=182`, so the bottom of the cup is approximately `y=200`. The floor rect runs from `y=268` to `y=300`. The current transform `translate(0px, 78px)` places the cup bottom at approximately `y=278`, which lands within the floor area. This appears correct.

**One thing to verify visually:** at small screen sizes the SVG scales down and the cup may end up overlapping the robot (positioned at approximately x=255–291, y=198–254). The cup starts at x=186–214 (±14 from cx=200) so there is adequate horizontal separation. No code change needed — just confirm visually at mobile viewport widths.
