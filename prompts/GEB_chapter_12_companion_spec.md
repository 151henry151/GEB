# Interactive Companion Spec: "Two Minds Meeting"
### Spreading Activation + Partial Isomorphism Visualizer
#### GEB Chapter 12 — Minds and Thoughts

---

## Core Concept / What It Demonstrates

Two side-by-side concept networks ("Mind A" and "Mind B"), each a graph of labeled concept nodes connected by weighted edges representing triggering relationships. When a node is activated, activation spreads outward through its connections in an animated wave. Both minds fire simultaneously from their corresponding node. Nodes that activate in *both* minds at *similar* times glow gold — this is the "resonance," the partial isomorphism, the mechanism of mutual understanding. Nodes that fire in only one mind glow that mind's color. The user edits connections, watches the resonance change, and intuitively grasps that meaning = structure of connections, and understanding = structural overlap.

---

## Layout

- Full-width canvas split into two halves, left (Mind A, blue theme) and right (Mind B, red/rose theme)
- A central vertical strip (~80px wide) shows a live **Resonance Score** (0–100%) as a glowing number and an animated arc or bridge graphic between the two minds — the gold "understanding" indicator
- Below the canvas: a small legend and instruction strip
- Overall aesthetic: dark background, soft glowing nodes, fluid animations — think neural/cosmic, not graph-theory textbook

---

## Nodes

- ~10–12 preset concept nodes per mind with human, evocative labels: `coffee`, `morning`, `rain`, `childhood`, `warmth`, `fear`, `home`, `music`, `silence`, `time`, `dream`, `color`
- Both minds start with the **same node labels** (this is important — the isomorphism question is about structure, not labels, so matching labels make the structural differences legible)
- Nodes are circular, ~48px diameter, with a soft drop shadow / glow
- Node label rendered inside or just below
- Nodes are positioned using a force-directed layout (d3-force or similar) — or hand-tuned positions that look good statically (simpler, more reliable)
- Each node has state: `idle | activating | active | fading`
  - **idle:** dim, base color
  - **activating:** brightening, pulsing ring
  - **active:** fully lit, bright glow
  - **fading:** slowly dimming back to idle

---

## Edges

- Undirected weighted edges (weights: 0.2–1.0, representing triggering strength)
- Rendered as curved or straight lines, thickness proportional to weight, low opacity when idle
- When activation travels along an edge, animate a small traveling dot/pulse along it
- Both minds start with **different edge configurations** — same nodes, different connections. This is the whole point. Preset them thoughtfully:

**Mind A edges:**
`coffee→morning`, `morning→warmth`, `warmth→home`, `home→childhood`, `childhood→dream`, `music→silence`, `rain→silence`, `fear→time`, `color→dream`

**Mind B edges:**
`coffee→warmth`, `warmth→music`, `music→childhood`, `childhood→home`, `home→morning`, `rain→fear`, `fear→dream`, `silence→time`, `color→silence`

These are different enough to produce noticeably different ripples, but overlapping enough to show partial resonance.

---

## Activation / Spreading Mechanics

- User clicks any node in either mind to "think" it — triggers a spreading activation in **both minds simultaneously**, starting from the node with the matching label
- Activation spreads outward via BFS/Dijkstra-like propagation:
  - Each neighbor fires after a delay = `base_delay / edge_weight` (stronger connections = faster)
  - `base_delay` ~300ms, so a weight-1.0 edge fires in 300ms, weight-0.5 fires in 600ms
  - Activation decays: each hop reduces activation level by a factor (~0.75), so distant nodes activate dimmer and shorter
  - Nodes with activation below a threshold (~0.15) don't visually respond
- Activation is **additive** — clicking multiple nodes builds up overlapping ripples (until you reset)
- A **Reset** button clears all activation state

---

## Resonance Calculation

- After each activation event (or on a short rolling basis), compute resonance:
  - For each node label, compare its activation level in Mind A vs Mind B
  - Resonance contribution per node = `1 - |activationA - activationB|`
  - Overall resonance = mean across all nodes, expressed as 0–100%
- Nodes that both activated significantly (both > 0.5) render with a **gold glow** — shared understanding
- Nodes that only activated in one mind render in that mind's color (blue or rose)
- The central resonance score updates live with a smooth numeric transition

---

## Editing

- **Add edge:** click a node, then click another node in the *same* mind — draws an edge with default weight 0.6
- **Remove edge:** shift+click an existing edge to delete it
- **Edge weight:** after creating an edge, a small draggable slider appears on it (or a simple popup) to set weight 0.1–1.0
- Editing immediately affects future activations (does not re-run the current one)

---

## Preset Scenarios / Guided Moments

A small row of buttons below the canvas for preset scenarios that tell a micro-story:

1. **"Strangers"** — load two very different edge configurations; fire `home`; resonance is low (~20%)
2. **"Old Friends"** — load two similar edge configurations; fire `home`; resonance is high (~80%)
3. **"Lost in Translation"** — load configurations where `music` is central in Mind A but peripheral in Mind B; fire `music`; show how the same word triggers totally different constellations
4. **"Becoming Similar"** — an animated sequence where Mind B's edges slowly shift toward Mind A's over 3 seconds, and the resonance score climbs in real time

These presets are the "guided discovery" layer — they let someone who doesn't want to edit graphs still have the core insights delivered.

---

## Explanatory Text

Below the canvas, a **single line of contextual text** updates based on what just happened:

- After firing a node with resonance > 70%: *"High resonance — when you say 'home,' they hear almost what you mean."*
- After firing a node with resonance < 30%: *"Low resonance — same word, different worlds."*
- After editing an edge: *"You changed a triggering relationship. Meaning shifted."*
- Default: *"Click any concept to think it. Watch meaning ripple."*

This text should be minimal, evocative, not over-explained.

---

## Tech Stack

- React + SVG for the canvas (SVG handles curved edges, glow filters, and animation well)
- CSS animations / `requestAnimationFrame` for the spreading pulse dots
- SVG `<filter>` with `feGaussianBlur` for the glow effects (standard soft-light neural aesthetic)
- No external graph libraries needed — the graphs are small enough to manage manually
- State managed in React (`useReducer` recommended — the activation state machine is complex enough to warrant it)

---

## What NOT To Do

- Don't make it feel like a graph theory exercise — no "check isomorphism" button, no correctness grading
- Don't over-label or over-explain — the experience of watching the ripple IS the explanation
- Don't use bright primary colors — keep it dark, soft, glowing
- Don't make editing the primary mode — activation/play is primary, editing is secondary
