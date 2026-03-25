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
  var VIEWBOX = { w: 340, h: 340 };
  /** Fix 8: node positions as fractions of canvas (340×340). */
  var COORD_FRAC = [
    [0.2, 0.25],
    [0.5, 0.15],
    [0.8, 0.22],
    [0.15, 0.5],
    [0.42, 0.42],
    [0.78, 0.48],
    [0.28, 0.72],
    [0.55, 0.65],
    [0.82, 0.72],
    [0.1, 0.8],
    [0.5, 0.85],
    [0.72, 0.88]
  ];
  var POS = COORD_FRAC.map(function (p) {
    return { x: p[0] * VIEWBOX.w, y: p[1] * VIEWBOX.h };
  });
  function edgeKey(a, b) { return a < b ? a + ',' + b : b + ',' + a; }
  function copyEdgeList(list) {
    return list.map(function (e) { return [e[0], e[1], e[2] == null ? 0.6 : e[2]]; });
  }
  function edgesToMap(edges) {
    var m = {};
    for (var ei = 0; ei < edges.length; ei++) {
      var e = edges[ei];
      m[edgeKey(e[0], e[1])] = e[2];
    }
    return m;
  }
  function mapToEdges(map) {
    var out = [];
    Object.keys(map).forEach(function (k) {
      var p = k.split(',');
      var lo = parseInt(p[0], 10);
      var hi = parseInt(p[1], 10);
      var w = map[k];
      if (w > 0.06) out.push([lo, hi, w]);
    });
    return out;
  }
  /** Fix 1 — Mind A: concrete / sensory associations */
  var DEFAULT_EDGES_A = copyEdgeList([
    [0, 1, 0.8], [1, 2, 0.75], [2, 3, 0.7], [3, 4, 0.55], [4, 11, 0.5],
    [5, 9, 0.72], [6, 7, 0.78], [7, 4, 0.52], [8, 9, 0.48], [10, 11, 0.5]
  ]);
  /** Fix 1 — Mind B: abstract / relational */
  var DEFAULT_EDGES_B = copyEdgeList([
    [0, 2, 0.76], [2, 3, 0.72], [5, 8, 0.52], [6, 4, 0.432], [8, 5, 0.74],
    [10, 6, 0.46], [7, 11, 0.5]
  ]);
  var STRANGERS_A = copyEdgeList([
    [3, 10, 0.88], [10, 11, 0.5], [3, 1, 0.25], [0, 5, 0.35], [5, 9, 0.9],
    [6, 7, 0.45], [4, 8, 0.4]
  ]);
  var STRANGERS_B = copyEdgeList([
    [3, 8, 0.9], [8, 5, 0.85], [5, 11, 0.5], [3, 2, 0.35], [2, 0, 0.4],
    [6, 10, 0.3], [1, 9, 0.5]
  ]);
  var OLD_FRIENDS_A = copyEdgeList(DEFAULT_EDGES_A);
  var OLD_FRIENDS_B = DEFAULT_EDGES_A.map(function (e) {
    return [e[0], e[1], Math.min(1, e[2] * 0.98 + 0.01)];
  });
  var TRANSLATION_A = copyEdgeList([
    [6, 7, 0.88], [6, 4, 0.82], [6, 2, 0.78], [6, 10, 0.8], [6, 9, 0.85], [6, 0, 0.72],
    [6, 3, 0.55], [7, 11, 0.5], [0, 1, 0.5], [3, 4, 0.45]
  ]);
  var TRANSLATION_B = copyEdgeList([
    [6, 4, 0.32], [6, 10, 0.22], [0, 1, 0.65], [1, 2, 0.6], [3, 8, 0.5],
    [5, 8, 0.7], [7, 11, 0.45], [9, 10, 0.4]
  ]);
  var edgesA = copyEdgeList(DEFAULT_EDGES_A);
  var edgesB = copyEdgeList(DEFAULT_EDGES_B);
  var activationA = [];
  var activationB = [];
  var timeouts = [];
  var captionTimer = null;
  var rafId = 0;
  var displayedPct = null;
  var pendingEdge = null;
  var lastFiredNode = null;
  var messageLock = null;
  var becomingActive = false;
  var becomingStart = 0;
  var becomingMapB0 = null;
  var becomingMapTarget = null;
  var selectedEditorEdge = null;
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
  var edgeWeightInput = document.getElementById('two-minds-edge-weight');
  var edgeWeightVal = document.getElementById('two-minds-edge-weight-val');
  function clearTimeouts() {
    timeouts.forEach(function (t) { clearTimeout(t); });
    timeouts = [];
  }
  function resonanceMean01() {
    var sum = 0;
    var c = 0;
    for (var ri = 0; ri < N; ri++) {
      var a = activationA[ri] || 0;
      var b = activationB[ri] || 0;
      if (a <= ACT_THR && b <= ACT_THR) continue;
      sum += 1 - Math.abs(a - b);
      c++;
    }
    return c === 0 ? null : sum / c;
  }
  function tierLabel(pct) {
    if (pct == null || isNaN(pct)) return '';
    if (pct < 20) return 'Distant minds';
    if (pct < 40) return 'A few shared echoes';
    if (pct < 60) return 'Real common ground';
    if (pct < 80) return 'Much in common';
    return 'Almost the same mind';
  }
  function applyResonanceStyle(pct) {
    if (!resonanceEl || !thermoFill) return;
    resonanceEl.classList.remove('is-amber', 'is-gold');
    thermoFill.classList.remove('is-amber', 'is-gold');
    if (pct == null) {
      resonanceEl.style.color = '';
      thermoFill.style.background = '';
      return;
    }
    if (pct < 30) {
      resonanceEl.style.color = '#64748b';
      thermoFill.style.background = '#94a3b8';
    } else if (pct < 60) {
      resonanceEl.classList.add('is-amber');
      thermoFill.classList.add('is-amber');
    } else {
      resonanceEl.classList.add('is-gold');
      thermoFill.classList.add('is-gold');
    }
  }
  function updateResonanceDOM(targetPct) {
    var pct = targetPct;
    if (pct != null) pct *= 100;
    if (displayedPct == null) displayedPct = pct != null ? pct : 0;
    if (pct != null) {
      displayedPct += (pct - displayedPct) * 0.08;
      if (Math.abs(pct - displayedPct) < 0.35) displayedPct = pct;
    }
    if (resonanceMean01() == null && !becomingActive) {
      if (resonanceEl) resonanceEl.textContent = '\u2014';
      if (thermoFill) thermoFill.style.height = '0%';
      if (tierEl) tierEl.textContent = '';
      applyResonanceStyle(null);
      if (centerGlow) centerGlow.style.opacity = '0.2';
      return;
    }
    var show = displayedPct != null ? displayedPct : 0;
    if (resonanceEl) resonanceEl.textContent = Math.round(show) + '%';
    if (thermoFill) thermoFill.style.height = Math.min(100, Math.max(0, show)) + '%';
    if (tierEl) tierEl.textContent = tierLabel(show);
    applyResonanceStyle(show);
    if (centerGlow) {
      centerGlow.style.opacity = String(0.22 + (show / 100) * 0.55);
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
      if (a > ACT_THR && b > ACT_THR) el.classList.add('is-both');
      else if (a > ACT_THR) el.classList.add('is-a');
      else if (b > ACT_THR) el.classList.add('is-b');
    }
  }
  function tick() {
    var m = resonanceMean01();
    updateResonanceDOM(m);
    updatePills();
    if (becomingActive) {
      var now = performance.now();
      var t = (now - becomingStart) / 3000;
      if (t >= 1) {
        t = 1;
        becomingActive = false;
        edgesB = copyEdgeList(DEFAULT_EDGES_A);
        renderBoth();
        setMessage('Minds drew closer. Click a concept to feel the overlap.');
        messageLock = null;
      } else {
        var eased = t * t * (3 - 2 * t);
        var outMap = {};
        var keys = {};
        Object.keys(becomingMapB0).forEach(function (k) { keys[k] = true; });
        Object.keys(becomingMapTarget).forEach(function (k) { keys[k] = true; });
        Object.keys(keys).forEach(function (k) {
          var w0 = becomingMapB0[k] != null ? becomingMapB0[k] : 0;
          var w1 = becomingMapTarget[k] != null ? becomingMapTarget[k] : 0;
          var w = w0 + eased * (w1 - w0);
          if (w > 0.07) outMap[k] = w;
        });
        edgesB = mapToEdges(outMap);
        renderBoth();
        setMessage('As their connections align, understanding grows.');
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
    return 0.8 + ((x - 0.1) / 0.9) * 2.2;
  }
  function scheduleContextCaption() {
    if (messageLock) return;
    if (becomingActive) return;
    clearTimeout(captionTimer);
    captionTimer = setTimeout(function () {
      if (messageLock || becomingActive) return;
      var r = resonanceMean01();
      var pct = r != null ? r * 100 : 0;
      var word = lastFiredNode != null ? LABELS[lastFiredNode] : 'it';
      if (lastFiredNode == null) {
        setMessage('Click any concept in either mind to think it. Watch how the same word ripples differently.');
        return;
      }
      if (pct > 65) {
        setMessage('High resonance — when you say "' + word + '", they hear almost what you mean.');
      } else if (pct < 25) {
        setMessage('Low resonance — same word, different worlds.');
      } else {
        setMessage('Partial overlap — some understanding, some gap.');
      }
    }, 750);
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
  function findEdge(mind, i, j) {
    var edges = mind === 'a' ? edgesA : edgesB;
    var k = edgeKey(i, j);
    for (var fi = 0; fi < edges.length; fi++) {
      if (edgeKey(edges[fi][0], edges[fi][1]) === k) return fi;
    }
    return -1;
  }
  function setEdgeWeight(mind, lo, hi, w, opts) {
    var edges = mind === 'a' ? edgesA : edgesB;
    var ix = findEdge(mind, lo, hi);
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
  function openEdgeEditor(mind, lo, hi, clientX, clientY) {
    var edges = mind === 'a' ? edgesA : edgesB;
    var ix = findEdge(mind, lo, hi);
    if (ix < 0) return;
    var e = edges[ix];
    selectedEditorEdge = { mind: mind, lo: e[0], hi: e[1], w: e[2] };
    if (edgeEditor && companionEl && edgeWeightInput && edgeWeightVal) {
      edgeEditor.hidden = false;
      edgeWeightInput.value = String(e[2]);
      edgeWeightVal.textContent = e[2].toFixed(2);
      var rect = companionEl.getBoundingClientRect();
      var x = clientX - rect.left - 80;
      var y = clientY - rect.top - 10;
      x = Math.max(4, Math.min(x, rect.width - 200));
      y = Math.max(4, Math.min(y, rect.height - 80));
      edgeEditor.style.left = x + 'px';
      edgeEditor.style.top = y + 'px';
    }
  }
  function closeEdgeEditor() {
    if (edgeEditor) edgeEditor.hidden = true;
    selectedEditorEdge = null;
  }
  function getNeighbors(mind, nodeIndex) {
    var edges = mind === 'a' ? edgesA : edgesB;
    var out = [];
    for (var i = 0; i < edges.length; i++) {
      var e = edges[i];
      if (e[0] === nodeIndex) out.push({ node: e[1], weight: e[2] });
      else if (e[1] === nodeIndex) out.push({ node: e[0], weight: e[2] });
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
    scheduleContextCaption();
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
            scheduleContextCaption();
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
          scheduleContextCaption();
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
          scheduleContextCaption();
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
      var lo = Math.min(e[0], e[1]);
      var hi = Math.max(e[0], e[1]);
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
      hit.setAttribute('data-i', String(lo));
      hit.setAttribute('data-j', String(hi));
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
      if (aA > 0.35 && aB > 0.35) nodeClass += ' tm-node-both';
      else if (act > 0.08) nodeClass += ' tm-node-active';
      else nodeClass += ' tm-node-rest';
      g.setAttribute('class', nodeClass);
      var circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('class', 'tm-node-shape');
      circle.setAttribute('cx', POS[j].x);
      circle.setAttribute('cy', POS[j].y);
      circle.setAttribute('r', act > 0.08 ? 24 : 20);
      var fill = restFill;
      var stroke = restStroke;
      var filter = '';
      if (aA > 0.35 && aB > 0.35) {
        fill = '#d4a030';
        stroke = '#b88920';
        filter = 'url(#ch12-gold-glow-' + mindId + ')';
      } else if (act > 0.08) {
        fill = actFill;
        stroke = isA ? '#2a6aa8' : '#a63d2a';
      }
      circle.setAttribute('fill', fill);
      circle.setAttribute('stroke', stroke);
      circle.setAttribute('stroke-width', act > 0.08 ? 2.2 : 1.4);
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
  function addEdge(mind, i, j) {
    if (i === j) return;
    var lo = Math.min(i, j);
    var hi = Math.max(i, j);
    var key = edgeKey(lo, hi);
    var edges = mind === 'a' ? edgesA : edgesB;
    if (edges.some(function (x) { return edgeKey(x[0], x[1]) === key; })) return;
    edges.push([lo, hi, 0.5]);
    renderBoth();
    flashNodes(mind, lo, hi);
    messageLock = null;
    setMessage('You changed a triggering relationship. The ripple will be different now.');
  }
  function removeEdge(mind, i, j) {
    var edges = mind === 'a' ? edgesA : edgesB;
    var key = edgeKey(i, j);
    for (var k = 0; k < edges.length; k++) {
      if (edgeKey(edges[k][0], edges[k][1]) === key) {
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
      for (var hi = 0; hi < hits.length; hi++) {
        hits[hi].onclick = function (ev) {
          ev.stopPropagation();
          var mi = this.getAttribute('data-mind');
          var ii = parseInt(this.getAttribute('data-i'), 10);
          var jj = parseInt(this.getAttribute('data-j'), 10);
          if (ev.shiftKey) {
            removeEdge(mi, ii, jj);
            return;
          }
          openEdgeEditor(mi, ii, jj, ev.clientX, ev.clientY);
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
    displayedPct = null;
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
      edgesA = copyEdgeList(STRANGERS_A);
      edgesB = copyEdgeList(STRANGERS_B);
      for (var s = 0; s < N; s++) {
        activationA[s] = 0;
        activationB[s] = 0;
      }
      lastFiredNode = 3;
      displayedPct = null;
      renderBoth();
      setTimeout(function () {
        runSpreading(3);
        messageLock = 'str';
        setMessage('Same word. Two different worlds.');
      }, 320);
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
      displayedPct = null;
      renderBoth();
      setTimeout(function () {
        runSpreading(3);
        messageLock = 'of';
        setMessage('Almost the same mind — years of shared experience.');
      }, 320);
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
      displayedPct = null;
      renderBoth();
      setTimeout(function () {
        runSpreading(6);
        messageLock = 'tr';
        setMessage('"Music" — one word, two completely different constellations.');
      }, 320);
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
      displayedPct = null;
      becomingMapB0 = edgesToMap(edgesB);
      becomingMapTarget = edgesToMap(DEFAULT_EDGES_A);
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
      setEdgeWeight(selectedEditorEdge.mind, selectedEditorEdge.lo, selectedEditorEdge.hi, w, null);
    });
    edgeWeightInput.addEventListener('change', function () {
      if (!selectedEditorEdge) return;
      var w = parseFloat(edgeWeightInput.value, 10);
      setEdgeWeight(selectedEditorEdge.mind, selectedEditorEdge.lo, selectedEditorEdge.hi, w, { flash: true, notify: true });
    });
  }
  var edgeClose = document.getElementById('two-minds-edge-close');
  if (edgeClose) {
    edgeClose.addEventListener('click', function () {
      if (selectedEditorEdge) {
        flashNodes(selectedEditorEdge.mind, selectedEditorEdge.lo, selectedEditorEdge.hi);
        messageLock = null;
        setMessage('You changed a triggering relationship. The ripple will be different now.');
      }
      closeEdgeEditor();
    });
  }
  if (companionEl) {
    companionEl.addEventListener('click', function (e) {
      if (e.target === companionEl) closeEdgeEditor();
    });
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
  rafId = requestAnimationFrame(tick);
})();
