(function () {
  'use strict';
  var LABELS = ['coffee', 'morning', 'rain', 'childhood', 'warmth', 'fear', 'home', 'music', 'silence', 'time', 'dream', 'color'];
  var N = LABELS.length;
  var BASE_DELAY = 300;
  var DECAY = 0.75;
  var VIEWBOX = { w: 280, h: 320 };
  function circlePositions(cx, cy, r) {
    var out = [];
    for (var i = 0; i < N; i++) {
      var t = (i / N) * 2 * Math.PI - Math.PI / 2;
      out.push({ x: cx + r * Math.cos(t), y: cy + r * Math.sin(t) });
    }
    return out;
  }
  var POS = circlePositions(VIEWBOX.w / 2, VIEWBOX.h / 2, 115);
  function edgeKey(a, b) { return a < b ? a + ',' + b : b + ',' + a; }
  function copyEdgeList(list) {
    return list.map(function (e) { return [e[0], e[1], e[2] == null ? 0.6 : e[2]]; });
  }
  var DEFAULT_EDGES_A = [[0,1,0.8],[1,4,0.7],[4,6,0.9],[6,3,0.5],[3,10,0.6],[10,11,0.5],[11,8,0.4],[8,2,0.6],[2,0,0.5],[5,6,0.8],[7,8,0.7],[9,0,0.5],[9,3,0.4]];
  var DEFAULT_EDGES_B = [[0,2,0.6],[2,5,0.7],[5,6,0.8],[6,3,0.6],[3,10,0.5],[10,11,0.6],[11,7,0.7],[7,1,0.5],[1,4,0.6],[4,6,0.5],[8,9,0.8],[9,0,0.4],[8,2,0.5]];
  var STRANGERS_A = [[0,1,0.9],[1,4,0.8],[4,6,0.9],[6,3,0.7],[3,10,0.6],[5,6,0.85],[7,8,0.75],[9,0,0.6],[2,0,0.5],[11,8,0.4]];
  var STRANGERS_B = [[6,2,0.8],[2,5,0.9],[5,11,0.5],[11,7,0.6],[7,1,0.4],[0,9,0.7],[3,8,0.5],[4,10,0.6],[8,9,0.8],[1,4,0.3]];
  var OLD_FRIENDS_A = [[0,1,0.8],[1,4,0.7],[4,6,0.9],[6,3,0.6],[3,10,0.6],[5,6,0.8],[7,8,0.7],[9,0,0.5],[2,0,0.5],[6,8,0.5],[11,10,0.5]];
  var OLD_FRIENDS_B = [[0,1,0.75],[1,4,0.7],[4,6,0.85],[6,3,0.6],[3,10,0.55],[5,6,0.8],[7,8,0.7],[9,0,0.5],[2,0,0.55],[6,8,0.45],[11,10,0.5]];
  var TRANSLATION_A = [[7,0,0.8],[7,4,0.7],[7,6,0.8],[7,8,0.9],[7,10,0.7],[0,1,0.6],[4,6,0.7],[8,2,0.5],[3,10,0.6],[5,6,0.5],[11,7,0.6]];
  var TRANSLATION_B = [[6,4,0.8],[6,3,0.7],[0,1,0.7],[7,11,0.4],[7,8,0.3],[8,2,0.6],[5,6,0.8],[9,0,0.5],[1,4,0.6],[3,10,0.5]];
  var edgesA = copyEdgeList(DEFAULT_EDGES_A);
  var edgesB = copyEdgeList(DEFAULT_EDGES_B);
  var activationA = []; var activationB = [];
  var selected = { mind: null, node: null };
  var timeouts = [];
  for (var i = 0; i < N; i++) { activationA[i] = 0; activationB[i] = 0; }
  var resonanceEl = document.getElementById('resonance-display');
  var messageEl = document.getElementById('two-minds-message');
  var svgA = document.getElementById('mind-a-svg');
  var svgB = document.getElementById('mind-b-svg');
  function clearTimeouts() { timeouts.forEach(function(t){ clearTimeout(t); }); timeouts = []; }
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
    var actA = activationA.slice(), actB = activationB.slice();
    actA[fromNode] = 1; actB[fromNode] = 1;
    activationA = actA; activationB = actB;
    updateResonance(); renderBoth();
    function spread(mind, nodeIdx, value, depth) {
      if (depth > 6) return;
      var neighbors = getNeighbors(mind, nodeIdx);
      for (var i = 0; i < neighbors.length; i++) {
        var n = neighbors[i];
        var newVal = value * DECAY * n.weight;
        if (newVal < 0.08) continue;
        var delay = Math.round(BASE_DELAY / n.weight);
        (function(m, target, val, d) {
          timeouts.push(setTimeout(function() {
            if (m === 'a') { if (activationA[target] < val) activationA[target] = val; }
            else { if (activationB[target] < val) activationB[target] = val; }
            updateResonance(); renderBoth();
            spread(m, target, val, d + 1);
          }, delay));
        })(mind, n.node, newVal, depth);
      }
    }
    var na = getNeighbors('a', fromNode), nb = getNeighbors('b', fromNode);
    for (var i = 0; i < na.length; i++) {
      var delay = Math.round(BASE_DELAY / na[i].weight);
      (function(t, v) {
        timeouts.push(setTimeout(function() {
          if (activationA[t] < v) activationA[t] = v;
          updateResonance(); renderBoth();
          spread('a', t, v, 1);
        }, delay));
      })(na[i].node, DECAY * na[i].weight);
    }
    for (var j = 0; j < nb.length; j++) {
      var delay = Math.round(BASE_DELAY / nb[j].weight);
      (function(t, v) {
        timeouts.push(setTimeout(function() {
          if (activationB[t] < v) activationB[t] = v;
          updateResonance(); renderBoth();
          spread('b', t, v, 1);
        }, delay));
      })(nb[j].node, DECAY * nb[j].weight);
    }
  }
  function resonanceScore() {
    var sum = 0, count = 0;
    for (var i = 0; i < N; i++) {
      var a = activationA[i] || 0, b = activationB[i] || 0;
      if (a > 0 || b > 0) { sum += 1 - Math.abs(a - b); count++; }
    }
    return count === 0 ? 0 : sum / count;
  }
  function updateResonance() {
    var pct = Math.round(resonanceScore() * 100);
    if (resonanceEl) resonanceEl.textContent = pct + '%';
  }
  function renderMind(svgId, mindId, edges, activations) {
    var svg = document.getElementById(svgId);
    if (!svg) return;
    svg.innerHTML = '';
    var isA = mindId === 'a';
    for (var i = 0; i < edges.length; i++) {
      var e = edges[i];
      var line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', POS[e[0]].x); line.setAttribute('y1', POS[e[0]].y);
      line.setAttribute('x2', POS[e[1]].x); line.setAttribute('y2', POS[e[1]].y);
      line.setAttribute('stroke', 'rgba(120,120,140,0.5)'); line.setAttribute('stroke-width', '2');
      line.setAttribute('class', 'two-minds-edge');
      line.setAttribute('data-mind', mindId); line.setAttribute('data-i', e[0]); line.setAttribute('data-j', e[1]);
      svg.appendChild(line);
    }
    for (var j = 0; j < N; j++) {
      var act = activations[j] || 0;
      var g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      g.setAttribute('data-node', j); g.setAttribute('data-mind', mindId); g.setAttribute('class', 'two-minds-node');
      var circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', POS[j].x); circle.setAttribute('cy', POS[j].y);
      circle.setAttribute('r', act > 0 ? 14 : 12);
      var fill, stroke;
      if (act > 0.5 && (activationA[j]||0) > 0.5 && (activationB[j]||0) > 0.5) {
        fill = 'rgba(232,197,71,0.9)'; stroke = '#e8c547';
      } else if (act > 0) {
        if (isA) { fill = 'rgba(91,143,185,0.85)'; stroke = '#5b8fb9'; }
        else { fill = 'rgba(185,107,143,0.85)'; stroke = '#b96b8f'; }
      } else { fill = 'rgba(40,45,55,0.9)'; stroke = 'rgba(120,120,140,0.6)'; }
      circle.setAttribute('fill', fill); circle.setAttribute('stroke', stroke);
      circle.setAttribute('stroke-width', act > 0 ? 2.5 : 1.5);
      g.appendChild(circle);
      var text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('x', POS[j].x); text.setAttribute('y', POS[j].y + 4);
      text.setAttribute('text-anchor', 'middle'); text.setAttribute('font-size', '14');
      text.setAttribute('fill', act > 0 ? '#1a1a2e' : '#c0beb8');
      text.textContent = LABELS[j]; g.appendChild(text);
      svg.appendChild(g);
    }
  }
  function renderBoth() {
    renderMind('mind-a-svg', 'a', edgesA, activationA);
    renderMind('mind-b-svg', 'b', edgesB, activationB);
    attachListeners();
  }
  function setMessage(text) { if (messageEl) messageEl.textContent = text; }
  function addEdge(mind, i, j) {
    if (i === j) return;
    var e = i < j ? [i, j, 0.6] : [j, i, 0.6];
    var key = edgeKey(i, j);
    var edges = mind === 'a' ? edgesA : edgesB;
    if (!edges.some(function(x){ return edgeKey(x[0],x[1]) === key; })) {
      edges.push(e); renderBoth();
      setMessage('You changed a triggering relationship.');
    }
  }
  function removeEdge(mind, i, j) {
    var edges = mind === 'a' ? edgesA : edgesB;
    var key = edgeKey(i, j);
    for (var k = 0; k < edges.length; k++) {
      if (edgeKey(edges[k][0], edges[k][1]) === key) {
        edges.splice(k, 1); renderBoth();
        setMessage('You removed a link.'); return;
      }
    }
  }
  function attachListeners() {
    [svgA, svgB].forEach(function(svg) {
      if (!svg) return;
      var mind = svg.id === 'mind-a-svg' ? 'a' : 'b';
      var nodes = svg.querySelectorAll('.two-minds-node');
      for (var i = 0; i < nodes.length; i++) {
        nodes[i].onclick = function(e) {
          e.stopPropagation();
          var node = parseInt(this.getAttribute('data-node'), 10);
          if (selected.mind === mind && selected.node !== null) {
            if (selected.node !== node) addEdge(mind, selected.node, node);
            selected.mind = null; selected.node = null;
          } else {
            selected.mind = mind; selected.node = node;
            clearTimeouts();
            setMessage('Thinking "' + LABELS[node] + '"…');
            runSpreading(node);
          }
          document.querySelectorAll('.two-minds-node').forEach(function(n){ n.classList.remove('selected'); });
          if (selected.node !== null) {
            var sel = document.querySelector('#' + svg.id + ' .two-minds-node[data-node="' + selected.node + '"]');
            if (sel) sel.classList.add('selected');
          }
        };
      }
      var edgeEls = svg.querySelectorAll('.two-minds-edge');
      for (var j = 0; j < edgeEls.length; j++) {
        edgeEls[j].onclick = function(ev) {
          if (ev.shiftKey) {
            var mi = this.getAttribute('data-mind');
            var i = parseInt(this.getAttribute('data-i'), 10);
            var j = parseInt(this.getAttribute('data-j'), 10);
            removeEdge(mi, i, j);
          }
        };
      }
    });
  }
  function resetActivations() {
    clearTimeouts();
    for (var i = 0; i < N; i++) { activationA[i] = 0; activationB[i] = 0; }
    updateResonance(); renderBoth();
    setMessage('Click any concept to think it. Watch meaning ripple.');
  }
  function loadPreset(name) {
    clearTimeouts();
    if (name === 'default') { edgesA = copyEdgeList(DEFAULT_EDGES_A); edgesB = copyEdgeList(DEFAULT_EDGES_B); }
    else if (name === 'strangers') { edgesA = copyEdgeList(STRANGERS_A); edgesB = copyEdgeList(STRANGERS_B); }
    else if (name === 'oldfriends') { edgesA = copyEdgeList(OLD_FRIENDS_A); edgesB = copyEdgeList(OLD_FRIENDS_B); }
    else if (name === 'translation') { edgesA = copyEdgeList(TRANSLATION_A); edgesB = copyEdgeList(TRANSLATION_B); }
    else if (name === 'becoming') {
      edgesA = copyEdgeList(OLD_FRIENDS_A); edgesB = copyEdgeList(STRANGERS_B);
      resetActivations();
      setMessage('Mind B shifts toward Mind A. Watch resonance.');
      var steps = 30, step = 0;
      var targetEdges = copyEdgeList(edgesA);
      var edgeMapB = {}; edgesB.forEach(function(e){ edgeMapB[edgeKey(e[0],e[1])] = e[2]; });
      var edgeMapT = {}; targetEdges.forEach(function(e){ edgeMapT[edgeKey(e[0],e[1])] = e[2]; });
      var allKeys = {}; Object.keys(edgeMapB).forEach(function(k){ allKeys[k]=true; });
      Object.keys(edgeMapT).forEach(function(k){ allKeys[k]=true; });
      var keys = Object.keys(allKeys);
      function tick() {
        step++;
        var t = step / steps;
        var newB = [];
        for (var i = 0; i < keys.length; i++) {
          var k = keys[i];
          var parts = k.split(',');
          var a = parseInt(parts[0],10), b = parseInt(parts[1],10);
          var wB = edgeMapB[k] != null ? edgeMapB[k] : 0;
          var wT = edgeMapT[k] != null ? edgeMapT[k] : 0;
          var w = wB + t * (wT - wB);
          if (w > 0.15) newB.push([a, b, w]);
        }
        edgesB = newB; renderBoth();
        if (step < steps) setTimeout(tick, 100);
        else setMessage('Minds more similar. Click a concept to see resonance.');
      }
      tick();
      return;
    }
    resetActivations();
  }
  document.querySelectorAll('.two-minds-preset').forEach(function(btn) {
    btn.addEventListener('click', function() { loadPreset(this.getAttribute('data-preset')); });
  });
  var resetBtn = document.getElementById('two-minds-reset');
  if (resetBtn) resetBtn.addEventListener('click', resetActivations);
  resetActivations();
})();
