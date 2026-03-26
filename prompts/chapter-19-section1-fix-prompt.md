# Chapter 19 — Section 1: Frame Widget Improvements

## The core problem

The cascade inference is technically implemented but perceptually invisible. Users type natural values, nothing visibly changes, and the widget feels like a static form. The goal is to make the cascade *obvious and surprising* — the user should feel the frame reshaping itself in response to what they type.

The logic in `ch19-frames-logic.js` is correct. The fixes below are all in `ch19-companion.js`, `index.html` (minor HTML additions), and the `<style>` block.

---

## Fix 1: Make new-slot appearance dramatic

When `catering` or `partyGames` become visible (triggered by `where = "park"` or a young `age`), the row currently just appears from `hidden = false` with no visual signal. Add an entrance animation.

**Add to the `<style>` block in `index.html`:**

```css
@keyframes ch19-slot-appear {
  from {
    opacity: 0;
    transform: translateY(-6px);
    background: rgba(212, 160, 48, 0.2);
  }
  to {
    opacity: 1;
    transform: translateY(0);
    background: transparent;
  }
}
.ch19-slot-row.ch19-slot-new {
  animation: ch19-slot-appear 0.5s ease forwards;
}
```

**In `recomputeUI()` in `ch19-companion.js`**, track which slots were previously hidden. When a slot transitions from hidden to visible, add `.ch19-slot-new` and remove it after 500ms:

```javascript
// Replace the existing: row.hidden = !show;
// With:
var wasHidden = row.hidden;
row.hidden = !show;
if (wasHidden && show) {
  row.classList.add('ch19-slot-new');
  window.setTimeout(function () {
    row.classList.remove('ch19-slot-new');
  }, 500);
}
```

Also update a dynamic caption element (see Fix 6) when a new slot appears, with specific text:
- When `catering` appears: *"A park party changes things — catering becomes relevant."*
- When `partyGames` appears: *"Young guests change expectations — party games become the default."*

---

## Fix 2: Add "Try this" chip buttons for key cascade-triggering slots

The cascade is only triggered by specific values ("park", "restaurant", low age numbers, "anniversary", "lunch", "dinner"). Nothing currently invites the user to type these. Add small chip buttons directly below the input for slots that have known interesting triggers.

**Add to the `<style>` block:**

```css
.ch19-slot-chips {
  display: flex;
  gap: 0.3rem;
  flex-wrap: wrap;
  margin-top: 0.2rem;
}
.ch19-chip {
  font-size: 0.65rem;
  padding: 0.15rem 0.4rem;
  border: 1px solid var(--border);
  border-radius: 999px;
  background: var(--bg);
  color: var(--muted);
  cursor: pointer;
  transition: border-color 0.15s ease, color 0.15s ease;
}
.ch19-chip:hover {
  border-color: #d4a030;
  color: var(--text);
}
```

**In `ch19-companion.js`**, add a `SLOT_CHIPS` map at the top of the IIFE (near `SLOT_ORDER`):

```javascript
var SLOT_CHIPS = {
  birthday: {
    where: ['park', 'restaurant'],
    age:   ['8', '25']
  },
  restaurant: {
    time:     ['lunch', 'dinner'],
    occasion: ['anniversary']
  }
};
```

**In `buildSlotPanel()`**, after creating the input element and before closing `.ch19-slot-field-wrap`, check for chips and append them:

```javascript
var chips = (SLOT_CHIPS[currentFrame] || {})[sid];
if (chips && chips.length) {
  var chipWrap = document.createElement('div');
  chipWrap.className = 'ch19-slot-chips';
  chips.forEach(function (val) {
    var chip = document.createElement('button');
    chip.type = 'button';
    chip.className = 'ch19-chip';
    chip.textContent = 'Try: "' + val + '"';
    chip.setAttribute('data-fill', val);
    chip.addEventListener('click', function () {
      if (inp) {
        inp.value = val;
        inp.dispatchEvent(new Event('input'));
      }
    });
    chipWrap.appendChild(chip);
  });
  fieldWrap.appendChild(chipWrap);
}
```

Remove the old `ch19-slot-hint` span for slots that now have chips (those hints were the only invitation before; chips replace them). Keep hints only for slots without chips (they remain useful context).

---

## Fix 3: Make the default badge change more visible

The badge changes from e.g. `"default: yes"` to `"default: probably, but simpler"` in small muted text. This is easy to miss. Two improvements:

**1. Increase badge prominence. Update `.ch19-default-badge` in `<style>`:**

```css
.ch19-default-badge {
  font-size: 0.78rem;       /* was 0.72rem */
  color: var(--text);       /* was var(--muted) */
  opacity: 0.7;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
```

**2. Flash the badge text gold when it changes. Add to `<style>`:**

```css
.ch19-default-badge.ch19-badge-changed {
  color: #d4a030;
  font-weight: 700;
}
```

**In `recomputeUI()`**, when `prev !== dText` and the slot is not locked, also add `.ch19-badge-changed` to the badge and remove it after 1200ms:

```javascript
if (prev !== undefined && prev !== dText && !locked && (!inp || !inp.value.trim())) {
  flashRow(row, true);
  // Also flash the badge text:
  if (badge) {
    badge.classList.add('ch19-badge-changed');
    window.setTimeout(function () {
      badge.classList.remove('ch19-badge-changed');
    }, 1200);
  }
}
```

---

## Fix 4: Visually distinguish inferred values from user-typed values

After clicking "Infer defaults", inferred values and user-typed values look identical. The user cannot see which values came from the frame versus which they entered themselves.

**Add to `<style>`:**

```css
.ch19-slot-input.ch19-inferred {
  color: var(--muted);
  font-style: italic;
  background: rgba(212, 160, 48, 0.06);
}
```

**In the `btnInfer` click handler**, when writing a default value into an input, add `.ch19-inferred`:

```javascript
if (d != null && d !== '') {
  inp.value = d;
  inp.classList.add('ch19-inferred');
  delete getSt().locks[sid];
}
```

**When a user types into a field**, remove `.ch19-inferred`. In the input's event listener (inside `buildSlotPanel`):

```javascript
inp.addEventListener('input', function () {
  inp.classList.remove('ch19-inferred');
  updateLocksFromDom();
  recomputeUI();
});
```

Result: after "Infer defaults", user-filled slots have normal black text; frame-inferred slots have italic muted text with a faint amber tint. The "I told it this" vs "the frame assumed this" distinction is immediately visible.

---

## Fix 5: Add a live narrative sentence

Below the slot panel (above the action buttons), add a paragraph that generates a human-readable sentence summarising the frame's current state. Update it live as slots are filled or defaults cascade.

**Add to `index.html`** inside `.ch19-frame-widget`, between `<div id="ch19-slot-panel">` and `<div class="ch19-frame-actions">`:

```html
<p id="ch19-frame-narrative" class="ch19-frame-narrative"></p>
```

**Add to `<style>`:**

```css
.ch19-frame-narrative {
  font-size: 0.84rem;
  font-style: italic;
  color: var(--text);
  padding: 0.45rem 0.55rem;
  background: rgba(212, 160, 48, 0.07);
  border-radius: 6px;
  margin: 0.45rem 0 0 0;
  border-left: 3px solid #d4a030;
  line-height: 1.5;
  min-height: 2.4rem;
  transition: background 0.4s ease;
}
```

**In `ch19-companion.js`**, add a `narrativeFor()` function after the `SLOT_TITLES` declaration:

```javascript
function narrativeFor(frameKey, values, defMap) {
  function get(id) {
    var v = values[id] && values[id].trim();
    return v ? v : (defMap[id] || '…');
  }
  if (frameKey === 'birthday') {
    return 'A birthday party for ' + get('who') + ', ' + get('when') +
      ', at ' + get('where') + '. Cake: ' + get('cake') +
      '. Presents: ' + get('presents') + '.';
  }
  if (frameKey === 'restaurant') {
    var occ = values.occasion && values.occasion.trim();
    var occStr = occ ? 'a ' + occ + ' meal' : 'a meal';
    return occStr + ' at ' + get('time') + '. Dress: ' + get('dressCode') +
      '. Bill: ' + get('bill') + '. Reservation: ' + get('reservation') + '.';
  }
  if (frameKey === 'doctor') {
    return 'A ' + get('appointmentType') + ' for ' + get('patient') +
      '. Wait time: ' + get('waitTime') +
      '. Follow-up: ' + get('followUp') + '.';
  }
  if (frameKey === 'job') {
    return 'An interview for ' + get('candidate') + ', ' + get('format') +
      ', lasting ' + get('duration') +
      '. Dress code: ' + get('dressCode') + '.';
  }
  return '';
}
```

**In `recomputeUI()`**, call it at the end:

```javascript
var narrativeEl = document.getElementById('ch19-frame-narrative');
if (narrativeEl) {
  narrativeEl.textContent = narrativeFor(currentFrame, getSt().values, defMap);
}
```

The narrative sentence updates live as the user types, showing the frame's evolving "mental model" of the situation. When a cascade fires and a default changes (e.g. cake changes from "yes" to "probably, but simpler"), the sentence updates simultaneously — making the cascade obvious even if the user missed the badge flash.

---

## Fix 6: Replace the static caption with a dynamic guide

The current static caption tells the user to notice something without telling them *what to do*. Replace it with a dynamic element that guides first-time users and then confirms what they experienced.

**In `index.html`**, the caption paragraph already has class `ch19-s1-caption`. Keep it but empty its initial content — it will be set by JS.

**In `ch19-companion.js`**, add at the top of the IIFE:

```javascript
var hasShownCascade = false;
var s1Caption = document.querySelector('.ch19-s1-caption');
```

Set the initial text on load:

```javascript
// called once after setActiveTab('birthday'):
if (s1Caption) {
  s1Caption.textContent = 'Try typing "park" in the Where slot, or enter an age under 12. Watch what changes.';
}
```

**In `recomputeUI()`**, when any flash fires for the first time, update the caption:

```javascript
if (!hasShownCascade && prev !== undefined && prev !== dText && !locked) {
  hasShownCascade = true;
  if (s1Caption) {
    s1Caption.textContent = 'Notice: filling one slot changes what\'s inferred about others. Context doesn\'t just fill gaps — it reshapes the whole structure.';
  }
}
```

Also reset `hasShownCascade = false` and restore the invite text when the frame tab is switched, so each new frame starts with the invitation again.
