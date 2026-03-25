(function () {
  'use strict';

  var VIEW = { w: 500, h: 380 };
  var NS = 'http://www.w3.org/2000/svg';
  var N_PER = 12;
  var SCATTER_R = 55;
  var COHERE_NEED = 6;
  var COHERE_MS = 200;
  var COHERE_DELAY = 400;
  var FIRING_MS = 70;
  var REFRACTORY_MS = 160;
  /** Per animation frame (~60fps). Applied in all states so EPSP cannot pile up during refractory. */
  var EPSP_DECAY = 0.94;
  var EPSP_CAP = 1.15;
  var THR_BASE = 0.52;
  var THR_JITTER = 0.08;

  var ASSEMBLIES = [
    { key: 'danger', label: 'DANGER', phrase: 'alert / withdraw', cx: 390, cy: 90, color: '#e05a3a' },
    { key: 'hunger', label: 'HUNGER', phrase: 'seeking / lack', cx: 250, cy: 310, color: '#d4a030' },
    { key: 'warmth', label: 'WARMTH', phrase: 'comfort / shelter', cx: 100, cy: 180, color: '#3a9fd4' },
    { key: 'curiosity', label: 'CURIOSITY', phrase: 'explore / reach', cx: 130, cy: 75, color: '#7a5dc7' },
    { key: 'comfort', label: 'COMFORT', phrase: 'rest / settle', cx: 400, cy: 295, color: '#4ab87a' }
  ];

  var REST_COLOR = '#8899aa';
  var INHIB_COLOR = '#445566';
  var EDGE_IDLE_OPACITY = 0.25;
  var EDGE_STROKE = 0.6;

  function seeded01(i, salt) {
    var x = Math.sin(i * 12.9898 + (salt || 0) * 78.233 + 0.12345) * 43758.5453;
    return x - Math.floor(x);
  }

  function buildNodes() {
    var nodes = [];
    var ai, li, a, ang, rr, idx;
    for (ai = 0; ai < ASSEMBLIES.length; ai++) {
      a = ASSEMBLIES[ai];
      for (li = 0; li < N_PER; li++) {
        idx = ai * N_PER + li;
        ang = seeded01(idx, 1) * Math.PI * 2;
        rr = SCATTER_R * (0.35 + 0.65 * seeded01(idx, 2));
        var inhibitory = li >= 10;
        nodes.push({
          id: idx,
          assemblyIndex: ai,
          localIndex: li,
          x: a.cx + Math.cos(ang) * rr,
          y: a.cy + Math.sin(ang) * rr,
          inhibitory: inhibitory,
          state: 'resting',
          stateSince: 0,
          epsp: 0,
          threshold: THR_BASE + (seeded01(idx, 3) - 0.5) * 2 * THR_JITTER,
          inhibitedUntil: 0
        });
      }
    }
    return nodes;
  }

  /** @returns {{from:number,to:number,weight:number,delayMs:number,inhibitory:boolean}[]} */
  function buildSynapses(nodes) {
    var syn = [];
    var seen = {};

    function addSyn(a, b, w, d, inh) {
      if (a === b) return;
      var k = a + '>' + b;
      if (seen[k]) return;
      seen[k] = true;
      syn.push({ from: a, to: b, weight: w, delayMs: d, inhibitory: inh });
    }

    function randDelay(lo, hi, salt) {
      return Math.round(lo + seeded01(salt, 4) * (hi - lo));
    }

    var ai, li, i, j, k, steps, other, t, oi, oj;
    for (ai = 0; ai < ASSEMBLIES.length; ai++) {
      for (li = 0; li < N_PER; li++) {
        i = ai * N_PER + li;
        var n = nodes[i];
        steps = 0;
        for (k = 1; k <= 7 && steps < 7; k++) {
          j = ai * N_PER + ((li + k) % N_PER);
          if (i === j) continue;
          var w = 0.45 + seeded01(i * 17 + j, 5) * 0.2;
          var d = randDelay(30, 60, i * 31 + j);
          if (n.inhibitory || nodes[j].inhibitory) {
            w *= 0.55;
            d = Math.round(d * 1.1);
          }
          addSyn(i, j, w, d, false);
          steps++;
        }
      }
    }

    for (ai = 0; ai < ASSEMBLIES.length; ai++) {
      for (li = 0; li < N_PER; li++) {
        i = ai * N_PER + li;
        if (nodes[i].inhibitory) continue;
        var nOut = 1 + (seeded01(i, 6) > 0.55 ? 1 : 0);
        for (t = 0; t < nOut; t++) {
          do {
            oi = (ai + 1 + Math.floor(seeded01(i * 19 + t, 7) * (ASSEMBLIES.length - 1))) % ASSEMBLIES.length;
          } while (oi === ai);
          oj = Math.floor(seeded01(i * 23 + t, 8) * 10);
          j = oi * N_PER + oj;
          var iw = 0.15 + seeded01(i * 29 + j, 9) * 0.13;
          var id = randDelay(80, 140, i * 41 + j);
          addSyn(i, j, iw, id, false);
        }
      }
    }

    for (ai = 0; ai < ASSEMBLIES.length; ai++) {
      for (li = 10; li < 12; li++) {
        i = ai * N_PER + li;
        for (k = 0; k < 5; k++) {
          oi = (ai + 1 + k) % ASSEMBLIES.length;
          oj = Math.floor(seeded01(i * 47 + k, 10) * 10);
          j = oi * N_PER + oj;
          if (nodes[j].inhibitory) oj = (oj + 3) % 10;
          j = oi * N_PER + oj;
          var hw = 0.22 + seeded01(i * 53 + j, 11) * 0.18;
          var hd = randDelay(80, 130, i * 59 + j);
          addSyn(i, j, hw, hd, true);
        }
      }
    }

    var comfortAi = 4;
    var dangerAi = 0;
    for (li = 10; li < 12; li++) {
      i = comfortAi * N_PER + li;
      for (k = 0; k < 4; k++) {
        j = dangerAi * N_PER + k;
        addSyn(i, j, 0.32 + seeded01(i * 61 + k, 12) * 0.1, randDelay(70, 110, i * 67 + k), true);
      }
    }

    return syn;
  }

  function interAssemblyStrength(synapses, a, b) {
    var s = 0;
    var i, e;
    for (i = 0; i < synapses.length; i++) {
      e = synapses[i];
      if (e.inhibitory) continue;
      var fa = Math.floor(e.from / N_PER);
      var ta = Math.floor(e.to / N_PER);
      if ((fa === a && ta === b) || (fa === b && ta === a)) s += e.weight;
    }
    return s;
  }

  var root = document.getElementById('ch11-companion');
  var wrap = document.getElementById('ch11-canvas-wrap');
  var sliderEl = document.getElementById('ch11-focus-slider');
  var focusLabelEl = document.getElementById('ch11-focus-label');
  var captionBottom = document.getElementById('ch11-caption');
  var questionEl = document.getElementById('ch11-question');
  var readoutEl = document.getElementById('ch11-readout');
  var readoutBars = document.getElementById('ch11-readout-bars');
  var resetBtn = document.getElementById('ch11-reset-btn');
  var hintToggle = document.getElementById('ch11-hint-toggle');
  var regionToggle = document.getElementById('ch11-region-toggle');
  var presetBtns = document.querySelectorAll('.ch11-preset');
  var overlay = document.getElementById('ch11-aha-overlay');
  var conceptBtns = document.querySelectorAll('.ch11-concept');

  var svgBg = document.getElementById('ch11-svg-bg');
  var svgNeu = document.getElementById('ch11-svg-neurons');
  var svgSym = document.getElementById('ch11-svg-symbols');

  var nodes = [];
  var synapses = [];
  var eventQueue = [];
  var assemblyFires = [];
  var travelDots = [];
  var coherent = {};
  var lastPerturbTime = -1e12;
  var focus = 0.35;
  var showRegions = false;
  var lastFrame = 0;
  var seenBlindClick = false;
  var seenThoughtView = false;
  var ahaShown = false;

  try {
    ahaShown = localStorage.getItem('geb_ch11_aha') === '1';
  } catch (e) { /* ignore */ }

  function setFocus(v) {
    focus = Math.max(0, Math.min(1, v));
    if (wrap) wrap.style.setProperty('--focus', String(focus));
    if (sliderEl) sliderEl.value = String(focus);
    updateFocusLabel();
    updateBottomCaption();
    if (focus > 0.75) seenThoughtView = true;
    updateQuestion();
  }

  function updateFocusLabel() {
    if (!focusLabelEl) return;
    var t;
    if (focus < 0.2) {
      t = 'At this level: voltage. Firing. Electrochemistry. No thoughts visible here.';
    } else if (focus > 0.8) {
      t = 'At this level: thoughts. Hunger. Danger. No voltage visible here.';
    } else if (focus >= 0.4 && focus <= 0.6) {
      t = 'Both levels at once. The same event, two descriptions.';
    } else if (focus < 0.5) {
      t = 'Mostly voltage — meaning is still a ghost in the pattern.';
    } else {
      t = 'Mostly meaning — the pattern underneath is still there.';
    }
    focusLabelEl.textContent = t;
  }

  function assemblyBurstCount(ai, now) {
    var arr = assemblyFires[ai] || [];
    var c = 0;
    var i;
    for (i = 0; i < arr.length; i++) {
      if (now - arr[i] <= COHERE_MS) c++;
    }
    return c;
  }

  function pruneAssemblyFires(now) {
    var ai;
    for (ai = 0; ai < ASSEMBLIES.length; ai++) {
      if (!assemblyFires[ai]) assemblyFires[ai] = [];
      assemblyFires[ai] = assemblyFires[ai].filter(function (t) { return now - t <= COHERE_MS * 2; });
    }
  }

  function updateCoherence(now) {
    if (now < lastPerturbTime + COHERE_DELAY) return;
    var ai;
    var anyNew = false;
    for (ai = 0; ai < ASSEMBLIES.length; ai++) {
      if (assemblyBurstCount(ai, now) >= COHERE_NEED) {
        if (!coherent[ai]) anyNew = true;
        coherent[ai] = true;
      }
    }
    if (anyNew && !ahaShown) {
      showAhaOverlay();
      ahaShown = true;
      try { localStorage.setItem('geb_ch11_aha', '1'); } catch (e) { /* ignore */ }
    }
  }

  function showAhaOverlay() {
    if (!overlay) return;
    overlay.hidden = false;
    overlay.setAttribute('aria-hidden', 'false');
    setTimeout(function () {
      overlay.hidden = true;
      overlay.setAttribute('aria-hidden', 'true');
      updateQuestion();
    }, 3000);
  }

  function updateQuestion() {
    if (!questionEl) return;
    if (ahaShown || Object.keys(coherent).length) {
      questionEl.textContent = 'You just saw it. Are they?';
      return;
    }
    if (seenBlindClick && seenThoughtView) {
      questionEl.textContent = 'Same pattern — two descriptions. Are thoughts “just” neurons?';
      return;
    }
    questionEl.textContent = 'Are thoughts “just” neurons?';
  }

  function updateBottomCaption() {
    if (!captionBottom) return;
    var now = performance.now();
    var activeList = [];
    var ai;
    for (ai = 0; ai < ASSEMBLIES.length; ai++) {
      if (coherent[ai] || assemblyBurstCount(ai, now) >= 4) {
        activeList.push(ai);
      }
    }
    if (focus < 0.25) {
      if (activeList.length === 0) {
        captionBottom.textContent = 'At this level, there are no named thoughts — only spikes and delays.';
        return;
      }
      var parts = activeList.map(function (aid) {
        var a = ASSEMBLIES[aid];
        var n = assemblyBurstCount(aid, now);
        return 'assembly ' + (aid + 1) + ' — ' + Math.min(12, n) + '+ of 12 neurons in a burst';
      });
      captionBottom.textContent = 'Current pattern: ' + parts.join('; ') + '.';
      return;
    }
    if (focus > 0.78) {
      if (activeList.length === 0) {
        captionBottom.textContent = 'No stable thought pattern yet — nudge the network.';
        return;
      }
      var names = activeList.map(function (aid) {
        var a = ASSEMBLIES[aid];
        return a.label + ' — ' + a.phrase;
      });
      captionBottom.textContent = 'Current thought: ' + names.join('; ') + '.';
      return;
    }
    captionBottom.textContent = 'Two descriptions of the same activity — drag the slider to weigh each.';
  }

  function updateReadout(now) {
    if (!readoutBars) return;
    readoutBars.innerHTML = '';
    var maxB = 0;
    var scores = ASSEMBLIES.map(function (_, ai) {
      var s = assemblyBurstCount(ai, now);
      if (s > maxB) maxB = s;
      return s;
    });
    if (maxB < 1) maxB = 1;
    for (var ai = 0; ai < ASSEMBLIES.length; ai++) {
      var row = document.createElement('div');
      row.className = 'ch11-readout-row';
      var lab = document.createElement('span');
      lab.className = 'ch11-readout-name';
      lab.textContent = ASSEMBLIES[ai].label;
      lab.style.color = ASSEMBLIES[ai].color;
      var bar = document.createElement('div');
      bar.className = 'ch11-readout-bar';
      var fill = document.createElement('div');
      fill.className = 'ch11-readout-fill';
      fill.style.width = (100 * scores[ai] / 12) + '%';
      fill.style.background = ASSEMBLIES[ai].color;
      if (coherent[ai]) fill.classList.add('is-coherent');
      bar.appendChild(fill);
      row.appendChild(lab);
      row.appendChild(bar);
      readoutBars.appendChild(row);
    }
  }

  function enqueueEvent(t, kind, data) {
    eventQueue.push({ t: t, kind: kind, data: data });
    eventQueue.sort(function (a, b) { return a.t - b.t; });
  }

  function emitFromNeuron(fromIdx, now) {
    var i, s, arrival;
    for (i = 0; i < synapses.length; i++) {
      s = synapses[i];
      if (s.from !== fromIdx) continue;
      arrival = now + s.delayMs;
      enqueueEvent(arrival, 'synapse', { synIndex: i });
      travelDots.push({
        synIndex: i,
        start: now,
        end: arrival,
        inhibitory: s.inhibitory
      });
    }
  }

  function tryFire(idx, now, manual) {
    var n = nodes[idx];
    if (n.state !== 'resting') return false;
    if (!manual && now < n.inhibitedUntil) return false;
    if (n.epsp < n.threshold && !manual) return false;
    n.state = 'firing';
    n.stateSince = now;
    n.epsp = 0;
    emitFromNeuron(idx, now);
    if (!assemblyFires[n.assemblyIndex]) assemblyFires[n.assemblyIndex] = [];
    assemblyFires[n.assemblyIndex].push(now);
    return true;
  }

  function forceFire(idx, now) {
    var n = nodes[idx];
    n.state = 'resting';
    n.epsp = n.threshold + 0.2;
    n.inhibitedUntil = 0;
    tryFire(idx, now, true);
  }

  function processEvents(now) {
    while (eventQueue.length && eventQueue[0].t <= now) {
      var ev = eventQueue.shift();
      if (ev.kind === 'synapse') {
        var s = synapses[ev.data.synIndex];
        var target = nodes[s.to];
        if (s.inhibitory) {
          target.epsp = Math.max(0, target.epsp - s.weight * 1.2);
          target.inhibitedUntil = Math.max(target.inhibitedUntil, now + 100);
        } else {
          /* Integrate excitation only while resting; otherwise spikes arriving during
             firing/refractory would stack and force an immediate re-fire — perpetual loop. */
          if (target.state === 'resting') {
            target.epsp = Math.min(EPSP_CAP, target.epsp + s.weight);
          }
        }
      }
    }
  }

  function stepNeurons(now, dt) {
    var i, n;
    for (i = 0; i < nodes.length; i++) {
      n = nodes[i];
      n.epsp *= EPSP_DECAY;
      if (n.state === 'resting') {
        if (n.epsp >= n.threshold && now >= n.inhibitedUntil) {
          tryFire(i, now, false);
        }
      } else if (n.state === 'firing') {
        if (now - n.stateSince >= FIRING_MS) {
          n.state = 'refractory';
          n.stateSince = now;
        }
      } else if (n.state === 'refractory') {
        if (now - n.stateSince >= REFRACTORY_MS) {
          n.state = 'resting';
          n.stateSince = now;
        }
      }
    }
  }

  var edgeEls = [];
  var nodeBodyEls = [];
  var hitEls = [];

  function el(name) {
    return document.createElementNS(NS, name);
  }

  function drawBrainOutline(svg) {
    var p = el('path');
    p.setAttribute('class', 'ch11-brain-outline');
    p.setAttribute('d', 'M 120 200 C 100 120 180 60 260 75 C 340 65 410 110 395 185 C 405 250 360 310 280 320 C 200 335 130 280 120 200 Z');
    p.setAttribute('fill', 'none');
    svg.appendChild(p);
  }

  function layoutSynapseGeom(s) {
    var a = nodes[s.from];
    var b = nodes[s.to];
    var mx = (a.x + b.x) / 2;
    var my = (a.y + b.y) / 2;
    var dx = b.x - a.x;
    var dy = b.y - a.y;
    var len = Math.sqrt(dx * dx + dy * dy) || 1;
    var bend = Math.min(22, len * 0.12);
    return {
      x1: a.x, y1: a.y, x2: b.x, y2: b.y,
      cx: mx - (dy / len) * bend, cy: my + (dx / len) * bend
    };
  }

  function buildDom() {
    svgBg.innerHTML = '';
    svgNeu.innerHTML = '';
    svgSym.innerHTML = '';
    drawBrainOutline(svgBg);

    var defs = el('defs');
    var blur = el('filter');
    blur.setAttribute('id', 'ch11-fire-glow');
    blur.setAttribute('x', '-50%');
    blur.setAttribute('y', '-50%');
    blur.setAttribute('width', '200%');
    blur.setAttribute('height', '200%');
    var gb = el('feGaussianBlur');
    gb.setAttribute('in', 'SourceGraphic');
    gb.setAttribute('stdDeviation', '4');
    blur.appendChild(gb);
    defs.appendChild(blur);

    var symBlur = el('filter');
    symBlur.setAttribute('id', 'ch11-halo-blur');
    var gb2 = el('feGaussianBlur');
    gb2.setAttribute('in', 'SourceGraphic');
    gb2.setAttribute('stdDeviation', '18');
    symBlur.appendChild(gb2);
    defs.appendChild(symBlur);
    svgNeu.appendChild(defs);

    var edgeG = el('g');
    edgeG.setAttribute('class', 'ch11-edges');
    svgNeu.appendChild(edgeG);

    edgeEls = [];
    var si, s, line, g;
    for (si = 0; si < synapses.length; si++) {
      s = synapses[si];
      line = el('path');
      line.setAttribute('class', 'ch11-syn');
      line.setAttribute('fill', 'none');
      line.setAttribute('stroke-width', String(EDGE_STROKE));
      line.setAttribute('stroke-linecap', 'round');
      line.setAttribute('opacity', String(EDGE_IDLE_OPACITY));
      edgeG.appendChild(line);
      edgeEls.push(line);
    }

    var nodeG = el('g');
    nodeG.setAttribute('class', 'ch11-nodes');
    svgNeu.appendChild(nodeG);

    nodeBodyEls = [];
    hitEls = [];
    for (var i = 0; i < nodes.length; i++) {
      g = el('g');
      g.setAttribute('transform', 'translate(' + nodes[i].x + ',' + nodes[i].y + ')');
      var shape;
      if (nodes[i].inhibitory) {
        shape = el('rect');
        shape.setAttribute('x', '-5');
        shape.setAttribute('y', '-5');
        shape.setAttribute('width', '10');
        shape.setAttribute('height', '10');
        shape.setAttribute('transform', 'rotate(45)');
        shape.setAttribute('class', 'ch11-inhib');
      } else {
        shape = el('circle');
        shape.setAttribute('r', '6');
        shape.setAttribute('class', 'ch11-exc');
      }
      g.appendChild(shape);
      nodeG.appendChild(g);
      nodeBodyEls.push(shape);

      var hit = el('circle');
      hit.setAttribute('r', '14');
      hit.setAttribute('fill', 'transparent');
      hit.setAttribute('class', 'ch11-hit');
      hit.setAttribute('data-idx', String(i));
      hit.style.cursor = 'pointer';
      g.appendChild(hit);
      hitEls.push(hit);
      hit.addEventListener('click', onNeuronClick);
    }

    var travelG = el('g');
    travelG.setAttribute('class', 'ch11-travel-layer');
    svgNeu.appendChild(travelG);

    buildSymbolLayer();
  }

  var symHaloEls = [];
  var symLabelEls = [];
  var symLinkEls = [];

  function buildSymbolLayer() {
    var defs2 = el('defs');
    var blur = el('filter');
    blur.setAttribute('id', 'ch11-symbol-halo');
    var gb = el('feGaussianBlur');
    gb.setAttribute('stdDeviation', '14');
    blur.appendChild(gb);
    defs2.appendChild(blur);
    svgSym.appendChild(defs2);

    var ai, a, ellipse, text;
    symHaloEls = [];
    symLabelEls = [];
    for (ai = 0; ai < ASSEMBLIES.length; ai++) {
      a = ASSEMBLIES[ai];
      ellipse = el('ellipse');
      ellipse.setAttribute('cx', String(a.cx));
      ellipse.setAttribute('cy', String(a.cy));
      ellipse.setAttribute('rx', '72');
      ellipse.setAttribute('ry', '58');
      ellipse.setAttribute('fill', a.color);
      ellipse.setAttribute('class', 'ch11-halo');
      svgSym.appendChild(ellipse);
      symHaloEls.push(ellipse);

      text = el('text');
      text.setAttribute('x', String(a.cx));
      text.setAttribute('y', String(a.cy + 5));
      text.setAttribute('text-anchor', 'middle');
      text.setAttribute('class', 'ch11-concept-label');
      text.textContent = a.label;
      svgSym.appendChild(text);
      symLabelEls.push(text);
    }

    symLinkEls = [];
    for (ai = 0; ai < ASSEMBLIES.length; ai++) {
      for (var bi = ai + 1; bi < ASSEMBLIES.length; bi++) {
        var str = interAssemblyStrength(synapses, ai, bi);
        var ca = ASSEMBLIES[ai];
        var cb = ASSEMBLIES[bi];
        var mx = (ca.cx + cb.cx) / 2;
        var my = (ca.cy + cb.cy) / 2;
        var dx = cb.cx - ca.cx;
        var dy = cb.cy - ca.cy;
        var len = Math.sqrt(dx * dx + dy * dy) || 1;
        var bend = 40;
        var path = el('path');
        path.setAttribute('class', 'ch11-thought-link');
        path.setAttribute('fill', 'none');
        path.setAttribute('stroke-width', String(2 + Math.min(4, str * 2)));
        path.setAttribute('d', 'M ' + ca.cx + ' ' + ca.cy + ' Q ' + (mx - dy / len * bend) + ' ' + (my + dx / len * bend) + ' ' + cb.cx + ' ' + cb.cy);
        path.dataset.a = String(ai);
        path.dataset.b = String(bi);
        var baseOp = 0.12 + Math.min(0.35, str * 0.08);
        path.style.opacity = String(baseOp);
        path.dataset.baseOp = String(baseOp);
        svgSym.appendChild(path);
        symLinkEls.push({ el: path, ai: ai, bi: bi, baseOp: baseOp });
      }
    }
  }

  function onNeuronClick(e) {
    var idx = parseInt(e.target.getAttribute('data-idx'), 10);
    if (isNaN(idx)) return;
    seenBlindClick = true;
    lastPerturbTime = performance.now();
    forceFire(idx, lastPerturbTime);
    updateQuestion();
  }

  function renderEdges(now) {
    var si, s, geom, d;
    for (si = 0; si < synapses.length; si++) {
      s = synapses[si];
      geom = layoutSynapseGeom(s);
      d = 'M ' + geom.x1 + ' ' + geom.y1 + ' Q ' + geom.cx + ' ' + geom.cy + ' ' + geom.x2 + ' ' + geom.y2;
      edgeEls[si].setAttribute('d', d);
      var hot = travelDots.some(function (tr) {
        return tr.synIndex === si && now >= tr.start && now <= tr.end;
      });
      edgeEls[si].setAttribute('opacity', hot ? '0.75' : String(EDGE_IDLE_OPACITY));
    }
  }

  function pointOnSynapse(s, t) {
    var g = layoutSynapseGeom(s);
    var u = 1 - t;
    return {
      x: u * u * g.x1 + 2 * u * t * g.cx + t * t * g.x2,
      y: u * u * g.y1 + 2 * u * t * g.cy + t * t * g.y2
    };
  }

  function renderTravel(now) {
    var layer = svgNeu.querySelector('.ch11-travel-layer');
    if (!layer) return;
    while (layer.firstChild) layer.removeChild(layer.firstChild);
    travelDots = travelDots.filter(function (tr) { return now <= tr.end + 40; });
    var i, tr, s, u, p, c;
    for (i = 0; i < travelDots.length; i++) {
      tr = travelDots[i];
      if (now < tr.start) continue;
      s = synapses[tr.synIndex];
      u = (now - tr.start) / (tr.end - tr.start);
      if (u > 1) u = 1;
      p = pointOnSynapse(s, u);
      c = el('circle');
      c.setAttribute('cx', String(p.x));
      c.setAttribute('cy', String(p.y));
      c.setAttribute('r', '2.5');
      c.setAttribute('fill', tr.inhibitory ? '#8899aa' : '#ffffff');
      c.setAttribute('opacity', String(0.85 * (1 - u * 0.4)));
      layer.appendChild(c);
    }
  }

  function renderNodes(now) {
    var i, n, shape, firing;
    for (i = 0; i < nodes.length; i++) {
      n = nodes[i];
      shape = nodeBodyEls[i];
      firing = n.state === 'firing';
      var regionTint = showRegions ? ASSEMBLIES[n.assemblyIndex].color : null;

      if (n.inhibitory) {
        shape.setAttribute('fill', INHIB_COLOR);
        shape.style.filter = firing ? 'url(#ch11-fire-glow)' : 'none';
      } else {
        if (showRegions && regionTint) {
          shape.setAttribute('fill', firing ? '#fffef5' : REST_COLOR);
          shape.style.opacity = firing ? '1' : '0.92';
          shape.setAttribute('stroke', regionTint);
          shape.setAttribute('stroke-width', firing ? '2' : '0.5');
        } else {
          shape.setAttribute('fill', firing ? '#ffffff' : REST_COLOR);
          shape.setAttribute('stroke', 'none');
          shape.style.filter = firing ? 'url(#ch11-fire-glow)' : 'none';
        }
      }
    }
  }

  function renderSymbols(now) {
    var ai, bright, coh;
    for (ai = 0; ai < ASSEMBLIES.length; ai++) {
      coh = coherent[ai] || assemblyBurstCount(ai, now) >= 4;
      bright = coh && focus > 0.2;
      symHaloEls[ai].setAttribute('opacity', String(bright ? 0.55 : 0.18));
      symLabelEls[ai].style.opacity = String(Math.max(0.15, focus));
      symLabelEls[ai].style.fontWeight = bright ? '800' : '600';
    }

    var pairActive = {};
    var activeAssemblies = [];
    for (ai = 0; ai < ASSEMBLIES.length; ai++) {
      if (coherent[ai] || assemblyBurstCount(ai, now) >= 5) activeAssemblies.push(ai);
    }
    var j, a1, a2, key, link;
    for (j = 0; j < activeAssemblies.length; j++) {
      for (var k = j + 1; k < activeAssemblies.length; k++) {
        a1 = activeAssemblies[j];
        a2 = activeAssemblies[k];
        key = Math.min(a1, a2) + ',' + Math.max(a1, a2);
        pairActive[key] = true;
      }
    }
    for (j = 0; j < symLinkEls.length; j++) {
      link = symLinkEls[j];
      key = link.ai + ',' + link.bi;
      var pulse = pairActive[key];
      link.el.classList.toggle('is-pulse', !!pulse);
      link.el.style.opacity = String(pulse ? 0.55 : link.baseOp);
    }
  }

  function frame(now) {
    if (!lastFrame) lastFrame = now;
    var dt = now - lastFrame;
    lastFrame = now;
    processEvents(now);
    stepNeurons(now, dt);
    pruneAssemblyFires(now);
    updateCoherence(now);
    renderEdges(now);
    renderTravel(now);
    renderNodes(now);
    renderSymbols(now);
    updateBottomCaption();
    updateReadout(now);
    requestAnimationFrame(frame);
  }

  function reset() {
    var i;
    nodes = buildNodes();
    synapses = buildSynapses(nodes);
    eventQueue = [];
    travelDots = [];
    coherent = {};
    assemblyFires = ASSEMBLIES.map(function () { return []; });
    lastPerturbTime = -1e12;
    lastFrame = 0;
    buildDom();
    updateQuestion();
  }

  function fireAssemblyRandom(assemblyIndex, count, now) {
    var pool = [];
    var li;
    for (li = 0; li < 10; li++) pool.push(li);
    var picks = [];
    var c;
    for (c = 0; c < count && pool.length; c++) {
      var r = Math.floor(seeded01(now + c * 31 + assemblyIndex * 7, 88) * pool.length);
      picks.push(pool.splice(r, 1)[0]);
    }
    for (c = 0; c < picks.length; c++) {
      forceFire(assemblyIndex * N_PER + picks[c], now);
    }
  }

  var presetRunning = false;

  function runPreset(which) {
    if (presetRunning) return;
    presetRunning = true;
    var now = performance.now();
    lastPerturbTime = now;
    reset();
    now = performance.now();

    if (which === 1) {
      var dangerAi = 0;
      fireAssemblyRandom(dangerAi, 4, now);
      captionBottom.textContent = 'Something triggered the danger assembly. No neuron “knew” there was danger. The pattern knew.';
      setTimeout(function () { presetRunning = false; }, 500);
      return;
    }
    if (which === 2) {
      var hungerAi = 1;
      fireAssemblyRandom(hungerAi, 2, now);
      setTimeout(function () {
        fireAssemblyRandom(hungerAi, 2, performance.now());
      }, 800);
      setTimeout(function () {
        fireAssemblyRandom(hungerAi, 2, performance.now());
        captionBottom.textContent = 'No single moment caused the hunger. It accumulated — just like real hunger does.';
        presetRunning = false;
      }, 1600);
      captionBottom.textContent = 'Building hunger in stages…';
      return;
    }
    if (which === 3) {
      fireAssemblyRandom(0, 4, now);
      captionBottom.textContent = 'Danger first — watch the pattern hold.';
      setTimeout(function () {
        var t = performance.now();
        fireAssemblyRandom(4, 3, t);
        captionBottom.textContent = 'Comfort rises. One pattern can quiet another.';
        setTimeout(function () {
          presetRunning = false;
        }, 1200);
      }, 1000);
      return;
    }
    presetRunning = false;
  }

  sliderEl.addEventListener('input', function () {
    setFocus(parseFloat(sliderEl.value, 10));
  });

  resetBtn.addEventListener('click', function () {
    reset();
    captionBottom.textContent = 'Network reset. Click a neuron to perturb.';
  });

  hintToggle.addEventListener('change', function () {
    document.body.classList.toggle('ch11-hint-concepts', hintToggle.checked);
  });

  regionToggle.addEventListener('change', function () {
    showRegions = regionToggle.checked;
    root.classList.toggle('ch11-show-regions', showRegions);
  });

  for (var pb = 0; pb < presetBtns.length; pb++) {
    presetBtns[pb].addEventListener('click', function () {
      var w = parseInt(this.getAttribute('data-preset'), 10);
      runPreset(w);
    });
  }

  for (var cb = 0; cb < conceptBtns.length; cb++) {
    conceptBtns[cb].addEventListener('click', function () {
      var key = this.getAttribute('data-concept');
      var ai = ASSEMBLIES.map(function (x) { return x.key; }).indexOf(key);
      if (ai < 0) return;
      lastPerturbTime = performance.now();
      fireAssemblyRandom(ai, 3, lastPerturbTime);
    });
  }

  nodes = buildNodes();
  synapses = buildSynapses(nodes);
  assemblyFires = ASSEMBLIES.map(function () { return []; });
  buildDom();
  setFocus(0.35);
  updateQuestion();
  requestAnimationFrame(frame);
})();
