(function () {
  'use strict';
  /** Concept order matches Fix 8 layout list (indices 0…11). */
  var LABELS = [
    'coffee', 'morning', 'warmth', 'home', 'childhood', 'rain',
    'music', 'memory', 'fear', 'silence', 'time', 'loss'
  ];
  var N = LABELS.length;
  var BASE_DELAY = 280;
  var DECAY = 0.76;
  var ACT_THR = 0.03;
  var ACTIVE_VISUAL_THR = 0.08;
  var BOTH_VISUAL_THR = ACTIVE_VISUAL_THR;
  var VIEWBOX = { w: 320, h: 340 };
  /** Shared layout (fractions of 320×340); same positions both minds — edges differ. */
  var COORD_FRAC = [
    [0.5, 0.1],
    [0.2, 0.22],
    [0.78, 0.22],
    [0.15, 0.45],
    [0.5, 0.38],
    [0.82, 0.42],
    [0.25, 0.65],
    [0.55, 0.62],
    [0.85, 0.68],
    [0.12, 0.75],
    [0.5, 0.82],
    [0.72, 0.85]
  ];
  var POS = COORD_FRAC.map(function (p) {
    return { x: p[0] * VIEWBOX.w, y: p[1] * VIEWBOX.h };
  });
  /** Directed edge key: from → to */
  function dirKey(from, to) { return from + '>' + to; }
  function copyEdgeList(list) {
    return list.map(function (e) { return [e[0], e[1], e[2] == null ? 0.6 : e[2]]; });
  }
  function seededJitter(a, b) {
    var x = Math.sin(a * 17.9 + b * 31.1 + 4.2) * 43758.5453;
    return x - Math.floor(x);
  }
  function directedEdgesToMap(edges) {
    var m = {};
    for (var ei = 0; ei < edges.length; ei++) {
      var e = edges[ei];
      m[dirKey(e[0], e[1])] = e[2];
    }
    return m;
  }
  function mapToDirectedEdges(map) {
    var out = [];
    Object.keys(map).forEach(function (k) {
      var p = k.split('>');
      var from = parseInt(p[0], 10);
      var to = parseInt(p[1], 10);
      var w = map[k];
      if (w > 0.06) out.push([from, to, w]);
    });
    return out;
  }
  /**
   * Mind A — concrete / sensory (directed).
   * coffee=0 morning=1 warmth=2 home=3 childhood=4 rain=5 music=6 memory=7 fear=8 silence=9 time=10 loss=11
   */
  var DEFAULT_EDGES_A = copyEdgeList([
    [0, 1, 0.8], [0, 2, 0.45], [1, 2, 0.75], [1, 9, 0.38], [2, 3, 0.7], [3, 4, 0.55], [3, 2, 0.5],
    [4, 7, 0.62], [4, 11, 0.48], [5, 9, 0.72], [5, 8, 0.35], [6, 7, 0.78], [6, 4, 0.42],
    [7, 4, 0.55], [7, 11, 0.52], [8, 9, 0.58], [8, 11, 0.4], [10, 11, 0.5], [10, 7, 0.44], [9, 8, 0.3]
  ]);
  /** Mind B — abstract / relational (directed); skipped invalid warmth→comfort */
  var DEFAULT_EDGES_B = copyEdgeList([
    [0, 2, 0.76], [0, 1, 0.4], [1, 10, 0.62], [2, 3, 0.55], [2, 4, 0.48], [3, 7, 0.6], [3, 10, 0.42],
    [4, 2, 0.58], [4, 6, 0.5], [5, 8, 0.74], [5, 10, 0.45], [6, 10, 0.68], [6, 7, 0.52],
    [7, 11, 0.58], [7, 10, 0.5], [8, 11, 0.62], [8, 5, 0.38], [10, 11, 0.55], [10, 6, 0.42],
    [9, 7, 0.52], [9, 10, 0.4], [11, 9, 0.48], [11, 10, 0.35]
  ]);
  /** Strangers: Mind B = contrasting directed web (~80%+ different edges); Mind A = DEFAULT_EDGES_A. */
  var STRANGERS_B = copyEdgeList([
    [0, 11, 0.7], [0, 8, 0.55], [1, 5, 0.65], [1, 9, 0.25], [2, 7, 0.5], [2, 6, 0.45], [3, 8, 0.6], [3, 9, 0.55],
    [4, 10, 0.58], [4, 5, 0.5], [5, 7, 0.68], [5, 11, 0.42], [6, 8, 0.65], [6, 9, 0.4], [7, 9, 0.55], [7, 8, 0.48],
    [8, 6, 0.52], [8, 0, 0.38], [9, 11, 0.45], [9, 2, 0.35], [10, 0, 0.55], [10, 1, 0.48], [11, 1, 0.5], [11, 2, 0.45]
  ]);
  var OLD_FRIENDS_A = copyEdgeList(DEFAULT_EDGES_A);
  var OLD_FRIENDS_B = DEFAULT_EDGES_A.map(function (e) {
    var w = e[2] + (seededJitter(e[0], e[1]) - 0.5) * 0.1;
    return [e[0], e[1], Math.max(0.1, Math.min(1, w))];
  });
  /** Lost in translation: music hub in A, peripheral in B */
  var TRANSLATION_A = copyEdgeList([
    [6, 0, 0.55], [6, 1, 0.52], [6, 2, 0.58], [6, 3, 0.56], [6, 4, 0.55], [6, 7, 0.72], [6, 9, 0.51], [6, 10, 0.54],
    [0, 1, 0.5], [3, 4, 0.5], [5, 8, 0.45], [8, 11, 0.4]
  ]);
  var TRANSLATION_B = copyEdgeList([
    [6, 7, 0.35], [6, 10, 0.38], [0, 2, 0.5], [1, 10, 0.55], [3, 7, 0.5], [4, 6, 0.42], [5, 8, 0.6], [8, 11, 0.5],
    [9, 7, 0.45], [11, 10, 0.4]
  ]);
  var edgesA = copyEdgeList(DEFAULT_EDGES_A);
  var edgesB = copyEdgeList(DEFAULT_EDGES_B);
  var activationA = [];
  var activationB = [];
  var timeouts = [];
  var captionTimer = null;
  var rafId = 0;
  var displayedResonance = 0;
  var pendingEdge = null;
  var lastFiredNode = null;
  var messageLock = null;
  var becomingActive = false;
  var becomingStart = 0;
  var selectedEditorEdge = null;
  var hintOnCoffee = false;
  var hasInteracted = false;
  var hintTimer = null;
  for (var i = 0; i < N; i++) {
    activationA[i] = 0;
    activationB[i] = 0;
  }
  var resonanceEl = document.getElementById('resonance-display');
  var thermoFill = document.getElementById('resonance-thermo-fill');
  var tierEl = document.getElementById('resonance-tier');
  var centerGlow = document.getElementById('two-minds-center-glow');
  var messageEl = document.getElementById('two-minds-message');
  var svgA = document.getElementById('mind-a-svg');
  var svgB = document.getElementById('mind-b-svg');
  var companionEl = document.getElementById('two-minds-companion');
  var pillsEl = document.getElementById('two-minds-pills');
  var edgeEditor = document.getElementById('two-minds-edge-editor');
  var edgeEditorTitle = document.getElementById('two-minds-edge-editor-title');
  var edgeWeightInput = document.getElementById('two-minds-edge-weight');
  var edgeWeightVal = document.getElementById('two-minds-edge-weight-val');
  function clearTimeouts() {
    timeouts.forEach(function (t) { clearTimeout(t); });
    timeouts = [];
  }
  function anyMindActivity() {
    var i;
    for (i = 0; i < N; i++) {
      if ((activationA[i] || 0) > 0.02 || (activationB[i] || 0) > 0.02) return true;
    }
    return false;
  }
  function edgeStructuralResonance() {
    var mapA = directedEdgesToMap(edgesA);
    var mapB = directedEdgesToMap(edgesB);
    var keys = {};
    Object.keys(mapA).forEach(function (k) { keys[k] = true; });
    Object.keys(mapB).forEach(function (k) { keys[k] = true; });
    var list = Object.keys(keys);
    if (list.length === 0) return 0;
    var sum = 0;
    var j;
    for (j = 0; j < list.length; j++) {
      var wa = mapA[list[j]] != null ? mapA[list[j]] : 0;
      var wb = mapB[list[j]] != null ? mapB[list[j]] : 0;
      sum += 1 - Math.abs(wa - wb);
    }
    return sum / list.length;
  }
  function computeResonance() {
    if (becomingActive && !anyMindActivity()) {
      return edgeStructuralResonance();
    }
    var total = 0;
    var i;
    for (i = 0; i < N; i++) {
      var actA = Math.min(1, activationA[i] || 0);
      var actB = Math.min(1, activationB[i] || 0);
      total += 1 - Math.abs(actA - actB);
    }
    return total / N;
  }
  function tierLabelFromUnit(u) {
    if (u < 0.2) return 'Distant minds';
    if (u < 0.4) return 'A few shared echoes';
    if (u < 0.6) return 'Real common ground';
    if (u < 0.8) return 'Much in common';
    return 'Almost the same mind';
  }
  function resonanceColorForPct(pct) {
    if (pct < 25) return '#999999';
    if (pct < 50) return '#c09040';
    if (pct < 75) return '#d4a030';
    return '#e8b820';
  }
  function thermoColorForPct(pct) {
    if (pct < 50) return '#c09040';
    if (pct < 75) return '#d4a030';
    return '#e8b820';
  }
  function updateResonanceDOM() {
    var raw = computeResonance();
    if (!anyMindActivity() && !becomingActive) {
      displayedResonance = 0;
      if (resonanceEl) {
        resonanceEl.textContent = '\u2014';
        resonanceEl.style.color = '';
      }
      if (thermoFill) {
        thermoFill.style.height = '0%';
        thermoFill.style.background = '';
      }
      if (tierEl) tierEl.textContent = '';
      if (centerGlow) centerGlow.style.opacity = '0.2';
      return;
    }
    displayedResonance += (raw - displayedResonance) * 0.06;
    var pct = Math.round(displayedResonance * 100);
    var col = resonanceColorForPct(pct);
    if (resonanceEl) {
      resonanceEl.textContent = pct + '%';
      resonanceEl.style.color = col;
    }
    if (thermoFill) {
      thermoFill.style.height = Math.min(100, Math.max(0, displayedResonance * 100)) + '%';
      thermoFill.style.background = pct < 25 ? '#b0b0b0' : thermoColorForPct(pct);
    }
    if (tierEl) tierEl.textContent = tierLabelFromUnit(displayedResonance);
    if (centerGlow) {
      centerGlow.style.opacity = String(0.22 + displayedResonance * 0.55);
    }
  }
  function updateCaptionLive() {
    if (!messageEl || messageLock) return;
    if (becomingActive) return;
    var word = lastFiredNode != null ? LABELS[lastFiredNode] : null;
    var r = displayedResonance;
    if (!word) {
      messageEl.textContent = 'Click any concept in either mind to think it. Watch how the same word ripples differently.';
      return;
    }
    if (r > 0.65) {
      messageEl.textContent = 'High resonance — when you say "' + word + '", they hear almost what you mean.';
    } else if (r < 0.25) {
      messageEl.textContent = 'Low resonance — same word, different worlds.';
    } else {
      messageEl.textContent = 'Partial overlap — some understanding, some gap.';
    }
  }
  function updatePills() {
    if (!pillsEl) return;
    var pills = pillsEl.querySelectorAll('.two-minds-pill');
    for (var pi = 0; pi < N; pi++) {
      var el = pills[pi];
      if (!el) continue;
      var a = activationA[pi] || 0;
      var b = activationB[pi] || 0;
      el.classList.remove('is-a', 'is-b', 'is-both');
      if (a > BOTH_VISUAL_THR && b > BOTH_VISUAL_THR) el.classList.add('is-both');
      else if (a > ACT_THR) el.classList.add('is-a');
      else if (b > ACT_THR) el.classList.add('is-b');
    }
  }
  function tick() {
    updateResonanceDOM();
    updatePills();
    updateCaptionLive();
    if (becomingActive) {
      var now = performance.now();
      var mapA = directedEdgesToMap(DEFAULT_EDGES_A);
      var mapB = directedEdgesToMap(edgesB);
      var keys = {};
      Object.keys(mapA).forEach(function (k) { keys[k] = true; });
      Object.keys(mapB).forEach(function (k) { keys[k] = true; });
      var outMap = {};
      Object.keys(keys).forEach(function (k) {
        var wa = mapA[k] != null ? mapA[k] : 0;
        var wb = mapB[k] != null ? mapB[k] : 0;
        var w = wb + (wa - wb) * 0.008;
        if (w > 0.06) outMap[k] = w;
      });
      edgesB = mapToDirectedEdges(outMap);
      renderBoth();
      setMessage('As their connections align, understanding grows.');
      if (now - becomingStart >= 3000) {
        becomingActive = false;
        edgesB = copyEdgeList(DEFAULT_EDGES_A);
        renderBoth();
        setMessage('Minds drew closer. Click a concept to feel the overlap.');
        messageLock = null;
      }
    }
    rafId = requestAnimationFrame(tick);
  }
  function buildPills() {
    if (!pillsEl) return;
    pillsEl.innerHTML = '';
    for (var bi = 0; bi < N; bi++) {
      var span = document.createElement('span');
      span.className = 'two-minds-pill';
      span.setAttribute('role', 'listitem');
      span.textContent = LABELS[bi];
      span.setAttribute('data-i', String(bi));
      pillsEl.appendChild(span);
    }
  }
  function edgeStrokeWidth(w) {
    var x = Math.max(0.1, Math.min(1, w));
    return (0.6 + x * 2.8).toFixed(2);
  }
  function flashNodes(mind, idxA, idxB) {
    var svg = mind === 'a' ? svgA : svgB;
    if (!svg) return;
    [idxA, idxB].forEach(function (idx) {
      var g = svg.querySelector('.two-minds-node[data-node="' + idx + '"]');
      if (g) {
        g.classList.add('flash');
        setTimeout(function () { g.classList.remove('flash'); }, 700);
      }
    });
  }
  function findEdge(mind, from, to) {
    var edges = mind === 'a' ? edgesA : edgesB;
    for (var fi = 0; fi < edges.length; fi++) {
      if (edges[fi][0] === from && edges[fi][1] === to) return fi;
    }
    return -1;
  }
  function setEdgeWeight(mind, from, to, w, opts) {
    var edges = mind === 'a' ? edgesA : edgesB;
    var ix = findEdge(mind, from, to);
    if (ix < 0) return;
    edges[ix][2] = Math.max(0.1, Math.min(1, w));
    renderBoth();
    if (opts && opts.flash) {
      flashNodes(mind, edges[ix][0], edges[ix][1]);
    }
    if (opts && opts.notify) {
      messageLock = null;
      setMessage('You changed a triggering relationship. The ripple will be different now.');
    }
  }
  function openEdgeEditor(mind, from, to) {
    var edges = mind === 'a' ? edgesA : edgesB;
    var ix = findEdge(mind, from, to);
    if (ix < 0) return;
    var e = edges[ix];
    selectedEditorEdge = { mind: mind, from: e[0], to: e[1], w: e[2] };
    if (edgeEditor && edgeWeightInput && edgeWeightVal) {
      edgeEditor.hidden = false;
      edgeWeightInput.value = String(e[2]);
      edgeWeightVal.textContent = e[2].toFixed(2);
      if (edgeEditorTitle) {
        edgeEditorTitle.textContent =
          'Editing link: ' + LABELS[e[0]] + ' → ' + LABELS[e[1]] + ' (' + (mind === 'a' ? 'Mind A' : 'Mind B') + ')';
      }
    }
  }
  function closeEdgeEditor() {
    if (edgeEditor) edgeEditor.hidden = true;
    if (edgeEditorTitle) edgeEditorTitle.textContent = 'Editing link';
    selectedEditorEdge = null;
  }
  function hideOnboardingHint() {
    if (hintTimer != null) {
      clearTimeout(hintTimer);
      hintTimer = null;
    }
    hintOnCoffee = false;
  }
  function scheduleOnboardingHint() {
    hideOnboardingHint();
    hintTimer = setTimeout(function () {
      hintTimer = null;
      if (!hasInteracted) {
        hintOnCoffee = true;
        renderBoth();
      }
    }, 1500);
  }
  function getNeighbors(mind, nodeIndex) {
    var edges = mind === 'a' ? edgesA : edgesB;
    var out = [];
    for (var i = 0; i < edges.length; i++) {
      var e = edges[i];
      if (e[0] === nodeIndex) out.push({ node: e[1], weight: e[2] });
    }
    return out;
  }
  function runSpreading(fromNode) {
    clearTimeouts();
    lastFiredNode = fromNode;
    var actA = activationA.slice();
    var actB = activationB.slice();
    actA[fromNode] = 1;
    actB[fromNode] = 1;
    activationA = actA;
    activationB = actB;
    renderBoth();
    function spread(mind, nodeIdx, value, depth) {
      if (depth > 6) return;
      var neighbors = getNeighbors(mind, nodeIdx);
      for (var si = 0; si < neighbors.length; si++) {
        var n = neighbors[si];
        var newVal = value * DECAY * n.weight;
        if (newVal < 0.07) continue;
        var delay = Math.round(BASE_DELAY / n.weight);
        (function (m, target, val, d) {
          timeouts.push(setTimeout(function () {
            if (m === 'a') {
              if (activationA[target] < val) activationA[target] = val;
            } else if (activationB[target] < val) {
              activationB[target] = val;
            }
            renderBoth();
            spread(m, target, val, d + 1);
          }, delay));
        })(mind, n.node, newVal, depth);
      }
    }
    var na = getNeighbors('a', fromNode);
    var nb = getNeighbors('b', fromNode);
    for (var ia = 0; ia < na.length; ia++) {
      var delayA = Math.round(BASE_DELAY / na[ia].weight);
      (function (t, v) {
        timeouts.push(setTimeout(function () {
          if (activationA[t] < v) activationA[t] = v;
          renderBoth();
          spread('a', t, v, 1);
        }, delayA));
      })(na[ia].node, DECAY * na[ia].weight);
    }
    for (var ib = 0; ib < nb.length; ib++) {
      var delayB = Math.round(BASE_DELAY / nb[ib].weight);
      (function (t, v) {
        timeouts.push(setTimeout(function () {
          if (activationB[t] < v) activationB[t] = v;
          renderBoth();
          spread('b', t, v, 1);
        }, delayB));
      })(nb[ib].node, DECAY * nb[ib].weight);
    }
  }
  function renderMind(svgId, mindId, edges, activations) {
    var svg = document.getElementById(svgId);
    if (!svg) return;
    var isA = mindId === 'a';
    var edgeBase = isA ? 'rgba(90,159,192,0.4)' : 'rgba(192,112,96,0.4)';
    var edgeHot = isA ? 'rgba(58,143,209,0.92)' : 'rgba(209,80,58,0.92)';
    var restFill = isA ? '#c8dff0' : '#f0d0c8';
    var actFill = isA ? '#3a8fd1' : '#d1503a';
    var restStroke = isA ? '#5a9fc0' : '#c07060';
    svg.innerHTML = '';
    for (var ei = 0; ei < edges.length; ei++) {
      var e = edges[ei];
      var x1 = POS[e[0]].x;
      var y1 = POS[e[0]].y;
      var x2 = POS[e[1]].x;
      var y2 = POS[e[1]].y;
      var aw = Math.max(activations[e[0]] || 0, activations[e[1]] || 0);
      var sw = edgeStrokeWidth(e[2]);
      var stroke = aw > 0.12 ? edgeHot : edgeBase;
      var line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', x1);
      line.setAttribute('y1', y1);
      line.setAttribute('x2', x2);
      line.setAttribute('y2', y2);
      line.setAttribute('stroke', stroke);
      line.setAttribute('stroke-width', String(sw));
      line.setAttribute('stroke-linecap', 'round');
      svg.appendChild(line);
      var hit = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      hit.setAttribute('x1', x1);
      hit.setAttribute('y1', y1);
      hit.setAttribute('x2', x2);
      hit.setAttribute('y2', y2);
      hit.setAttribute('class', 'two-minds-edge-hit');
      hit.setAttribute('stroke-width', '14');
      hit.setAttribute('data-mind', mindId);
      hit.setAttribute('data-from', String(e[0]));
      hit.setAttribute('data-to', String(e[1]));
      svg.appendChild(hit);
    }
    for (var j = 0; j < N; j++) {
      var act = activations[j] || 0;
      var aA = activationA[j] || 0;
      var aB = activationB[j] || 0;
      var g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      g.setAttribute('data-node', j);
      g.setAttribute('data-mind', mindId);
      var nodeClass = 'two-minds-node';
      if (aA > BOTH_VISUAL_THR && aB > BOTH_VISUAL_THR) nodeClass += ' tm-node-both';
      else if (act > ACTIVE_VISUAL_THR) nodeClass += ' tm-node-active';
      else nodeClass += ' tm-node-rest';
      g.setAttribute('class', nodeClass);
      var circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('class', 'tm-node-shape');
      circle.setAttribute('cx', POS[j].x);
      circle.setAttribute('cy', POS[j].y);
      circle.setAttribute('r', act > ACTIVE_VISUAL_THR ? 24 : 20);
      var fill = restFill;
      var stroke = restStroke;
      var filter = '';
      if (aA > BOTH_VISUAL_THR && aB > BOTH_VISUAL_THR) {
        fill = '#d4a030';
        stroke = '#b88920';
        filter = 'url(#ch12-gold-glow-' + mindId + ')';
      } else if (act > ACTIVE_VISUAL_THR) {
        fill = actFill;
        stroke = isA ? '#2a6aa8' : '#a63d2a';
      }
      circle.setAttribute('fill', fill);
      circle.setAttribute('stroke', stroke);
      circle.setAttribute('stroke-width', act > ACTIVE_VISUAL_THR ? 2.2 : 1.4);
      if (filter) circle.setAttribute('filter', filter);
      g.appendChild(circle);
      var text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('class', 'two-minds-node-label');
      text.setAttribute('x', POS[j].x);
      text.setAttribute('y', POS[j].y);
      text.setAttribute('text-anchor', 'middle');
      text.setAttribute('dominant-baseline', 'middle');
      text.setAttribute('font-size', '25');
      text.setAttribute('font-weight', '700');
      text.textContent = LABELS[j];
      g.appendChild(text);
      svg.appendChild(g);
    }
    if (mindId === 'a' && hintOnCoffee && !hasInteracted) {
      var hcx = POS[0].x;
      var hcy = POS[0].y;
      var hintG = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      hintG.setAttribute('class', 'tm-onboard-hint');
      hintG.setAttribute('transform', 'translate(' + hcx + ',' + hcy + ')');
      var hintRing = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      hintRing.setAttribute('class', 'tm-onboard-ring');
      hintRing.setAttribute('cx', '0');
      hintRing.setAttribute('cy', '0');
      hintRing.setAttribute('r', '28');
      hintRing.setAttribute('fill', 'none');
      hintRing.setAttribute('stroke', 'rgba(58,143,209,0.55)');
      hintRing.setAttribute('stroke-width', '2.5');
      hintG.appendChild(hintRing);
      var hintLbl = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      hintLbl.setAttribute('class', 'tm-onboard-label');
      hintLbl.setAttribute('x', '0');
      hintLbl.setAttribute('y', '44');
      hintLbl.setAttribute('text-anchor', 'middle');
      hintLbl.setAttribute('font-size', '11');
      hintLbl.setAttribute('font-weight', '600');
      hintLbl.setAttribute('fill', '#334155');
      hintLbl.textContent = 'Try clicking here.';
      hintG.appendChild(hintLbl);
      svg.appendChild(hintG);
    }
    var defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    var f = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
    f.setAttribute('id', 'ch12-gold-glow-' + mindId);
    f.setAttribute('x', '-50%');
    f.setAttribute('y', '-50%');
    f.setAttribute('width', '200%');
    f.setAttribute('height', '200%');
    var blur = document.createElementNS('http://www.w3.org/2000/svg', 'feGaussianBlur');
    blur.setAttribute('in', 'SourceAlpha');
    blur.setAttribute('stdDeviation', '3');
    blur.setAttribute('result', 'blur');
    var merge = document.createElementNS('http://www.w3.org/2000/svg', 'feMerge');
    var n1 = document.createElementNS('http://www.w3.org/2000/svg', 'feMergeNode');
    n1.setAttribute('in', 'blur');
    var n2 = document.createElementNS('http://www.w3.org/2000/svg', 'feMergeNode');
    n2.setAttribute('in', 'SourceGraphic');
    merge.appendChild(n1);
    merge.appendChild(n2);
    f.appendChild(blur);
    f.appendChild(merge);
    defs.appendChild(f);
    svg.insertBefore(defs, svg.firstChild);
  }
  function renderGraph() {
    renderMind('mind-a-svg', 'a', edgesA, activationA);
    renderMind('mind-b-svg', 'b', edgesB, activationB);
  }
  function renderBoth() {
    renderGraph();
    attachListeners();
  }
  function setMessage(text) { if (messageEl) messageEl.textContent = text; }
  function addEdge(mind, from, to) {
    if (from === to) return;
    var edges = mind === 'a' ? edgesA : edgesB;
    if (findEdge(mind, from, to) >= 0) return;
    edges.push([from, to, 0.5]);
    renderBoth();
    flashNodes(mind, from, to);
    messageLock = null;
    setMessage('You changed a triggering relationship. The ripple will be different now.');
  }
  function removeEdge(mind, from, to) {
    var edges = mind === 'a' ? edgesA : edgesB;
    for (var k = 0; k < edges.length; k++) {
      if (edges[k][0] === from && edges[k][1] === to) {
        edges.splice(k, 1);
        closeEdgeEditor();
        renderBoth();
        setMessage('You removed a link.');
        return;
      }
    }
  }
  function attachListeners() {
    [svgA, svgB].forEach(function (svg) {
      if (!svg) return;
      var mind = svg.id === 'mind-a-svg' ? 'a' : 'b';
      var nodes = svg.querySelectorAll('.two-minds-node');
      for (var ni = 0; ni < nodes.length; ni++) {
        nodes[ni].onclick = function (e) {
          e.stopPropagation();
          var node = parseInt(this.getAttribute('data-node'), 10);
          if (e.ctrlKey || e.metaKey) {
            if (pendingEdge && pendingEdge.mind === mind && pendingEdge.node !== node) {
              addEdge(mind, pendingEdge.node, node);
              pendingEdge = null;
            } else {
              pendingEdge = { mind: mind, node: node };
            }
            document.querySelectorAll('.two-minds-node').forEach(function (n) { n.classList.remove('selected'); });
            if (pendingEdge) {
              var sel = document.querySelector('#' + svg.id + ' .two-minds-node[data-node="' + pendingEdge.node + '"]');
              if (sel) sel.classList.add('selected');
            }
            return;
          }
          pendingEdge = null;
          document.querySelectorAll('.two-minds-node').forEach(function (n) { n.classList.remove('selected'); });
          clearTimeouts();
          setMessage('Thinking "' + LABELS[node] + '"…');
          messageLock = null;
          runSpreading(node);
        };
      }
      var hits = svg.querySelectorAll('.two-minds-edge-hit');
      for (var hx = 0; hx < hits.length; hx++) {
        hits[hx].onclick = function (ev) {
          ev.stopPropagation();
          var mi = this.getAttribute('data-mind');
          var fr = parseInt(this.getAttribute('data-from'), 10);
          var t = parseInt(this.getAttribute('data-to'), 10);
          if (ev.shiftKey) {
            removeEdge(mi, fr, t);
            return;
          }
          openEdgeEditor(mi, fr, t);
        };
      }
    });
  }
  function resetActivations() {
    clearTimeouts();
    clearTimeout(captionTimer);
    captionTimer = null;
    becomingActive = false;
    messageLock = null;
    closeEdgeEditor();
    pendingEdge = null;
    lastFiredNode = null;
    displayedResonance = 0;
    for (var ri = 0; ri < N; ri++) {
      activationA[ri] = 0;
      activationB[ri] = 0;
    }
    renderBoth();
    setMessage('Click any concept in either mind to think it. Watch how the same word ripples differently.');
  }
  function loadPreset(name) {
    clearTimeouts();
    clearTimeout(captionTimer);
    captionTimer = null;
    becomingActive = false;
    closeEdgeEditor();
    pendingEdge = null;
    if (name === 'default') {
      edgesA = copyEdgeList(DEFAULT_EDGES_A);
      edgesB = copyEdgeList(DEFAULT_EDGES_B);
      resetActivations();
      return;
    }
    if (name === 'strangers') {
      edgesA = copyEdgeList(DEFAULT_EDGES_A);
      edgesB = copyEdgeList(STRANGERS_B);
      for (var s = 0; s < N; s++) {
        activationA[s] = 0;
        activationB[s] = 0;
      }
      lastFiredNode = 3;
      displayedResonance = 0;
      renderBoth();
      setTimeout(function () {
        runSpreading(3);
        messageLock = 'str';
        setMessage('Same word. Two different worlds.');
      }, 500);
      return;
    }
    if (name === 'oldfriends') {
      edgesA = copyEdgeList(OLD_FRIENDS_A);
      edgesB = copyEdgeList(OLD_FRIENDS_B);
      for (var o = 0; o < N; o++) {
        activationA[o] = 0;
        activationB[o] = 0;
      }
      lastFiredNode = 3;
      displayedResonance = 0;
      renderBoth();
      setTimeout(function () {
        runSpreading(3);
        messageLock = 'of';
        setMessage('Almost the same mind — years of shared experience.');
      }, 500);
      return;
    }
    if (name === 'translation') {
      edgesA = copyEdgeList(TRANSLATION_A);
      edgesB = copyEdgeList(TRANSLATION_B);
      for (var t = 0; t < N; t++) {
        activationA[t] = 0;
        activationB[t] = 0;
      }
      lastFiredNode = 6;
      displayedResonance = 0;
      renderBoth();
      setTimeout(function () {
        runSpreading(6);
        messageLock = 'tr';
        setMessage('"Music" — one word, two completely different constellations.');
      }, 500);
      return;
    }
    if (name === 'becoming') {
      edgesA = copyEdgeList(DEFAULT_EDGES_A);
      edgesB = copyEdgeList(STRANGERS_B);
      for (var b = 0; b < N; b++) {
        activationA[b] = 0;
        activationB[b] = 0;
      }
      lastFiredNode = null;
      displayedResonance = 0;
      becomingActive = true;
      becomingStart = performance.now();
      messageLock = 'be';
      renderBoth();
      setMessage('As their connections align, understanding grows.');
      return;
    }
    resetActivations();
  }
  if (edgeWeightInput) {
    edgeWeightInput.addEventListener('input', function () {
      if (!selectedEditorEdge) return;
      var w = parseFloat(edgeWeightInput.value, 10);
      if (edgeWeightVal) edgeWeightVal.textContent = w.toFixed(2);
      setEdgeWeight(selectedEditorEdge.mind, selectedEditorEdge.from, selectedEditorEdge.to, w, null);
    });
    edgeWeightInput.addEventListener('change', function () {
      if (!selectedEditorEdge) return;
      var w = parseFloat(edgeWeightInput.value, 10);
      setEdgeWeight(selectedEditorEdge.mind, selectedEditorEdge.from, selectedEditorEdge.to, w, { flash: true, notify: true });
    });
  }
  function dismissUserHint() {
    var hadRing = hintOnCoffee;
    hideOnboardingHint();
    hasInteracted = true;
    if (hadRing) renderBoth();
  }
  if (companionEl) {
    companionEl.addEventListener('click', dismissUserHint, true);
  }
  document.querySelectorAll('.two-minds-preset').forEach(function (btn) {
    btn.addEventListener('click', function () {
      loadPreset(this.getAttribute('data-preset'));
    });
  });
  var resetBtn = document.getElementById('two-minds-reset');
  if (resetBtn) resetBtn.addEventListener('click', resetActivations);
  buildPills();
  resetActivations();
  scheduleOnboardingHint();
  rafId = requestAnimationFrame(tick);
})();
