/**
 * Chapter XVII companion: halting diagonalization proof, diagonal family, Church thesis, Collatz sidebar.
 */
'use strict';

(function () {
  var L = window.GEBCh17Logic;
  if (!L) return;

  var root = document.getElementById('ch17-root');
  var maxCollatzSteps = 500;

  function markDone(which) {
    if (!root) return;
    root.setAttribute('data-done-' + which, '1');
    tryCapstone();
  }

  function tryCapstone() {
    if (!root) return;
    if (root.getAttribute('data-done-s1') !== '1') return;
    if (root.getAttribute('data-done-s2') !== '1') return;
    var cap = document.getElementById('ch17-capstone');
    if (cap && cap.hidden) {
      cap.hidden = false;
      requestAnimationFrame(function () {
        cap.classList.add('ch17-capstone-visible');
      });
    }
  }

  /* —— Collatz —— */
  function runCollatz() {
    var inp = document.getElementById('ch17-collatz-n');
    var seqEl = document.getElementById('ch17-collatz-seq');
    var vEl = document.getElementById('ch17-collatz-verdict');
    if (!inp || !seqEl || !vEl) return;
    var n = parseInt(inp.value, 10) || 7;
    if (n < 1) n = 7;
    var seq = [];
    var x = n;
    var steps = 0;
    while (x !== 1 && steps < maxCollatzSteps) {
      seq.push(x);
      x = x % 2 === 0 ? x / 2 : 3 * x + 1;
      steps++;
    }
    if (x === 1) seq.push(1);
    seqEl.textContent = seq.slice(-15).join(' → ');
    if (x === 1) {
      vEl.textContent = 'Halted at 1 after ' + steps + ' steps.';
      vEl.className = 'ch17-collatz-verdict truth-true';
    } else {
      vEl.textContent =
        'Stopped after ' + maxCollatzSteps + ' steps (limit). We do not know if it would eventually reach 1.';
      vEl.className = 'ch17-collatz-verdict truth-undefined';
    }
  }

  var runBtn = document.getElementById('ch17-collatz-run');
  if (runBtn) runBtn.addEventListener('click', runCollatz);

  /* —— Section 1 proof —— */
  var oraclePhase = document.getElementById('ch17-oracle-phase');
  var proofPhase = document.getElementById('ch17-proof-phase');
  var collatzWrap = document.getElementById('ch17-collatz-wrap');
  var proofNext = document.getElementById('ch17-proof-next');
  var oracleContinue = document.getElementById('ch17-oracle-continue');
  var proofStep = 0;

  function refreshProofUI() {
    var i;
    for (i = 1; i <= 5; i++) {
      var p = document.getElementById('ch17-proof-panel-' + i);
      if (p) p.hidden = i > proofStep;
    }
    var wrap = document.getElementById('ch17-diag-table-wrap');
    if (wrap) wrap.classList.toggle('ch17-diagonal-on', proofStep >= 3);
    var diag = document.getElementById('ch17-diagonal-svg');
    if (diag) {
      diag.classList.toggle('ch17-diagonal-draw', proofStep >= 3);
      diag.setAttribute('aria-hidden', proofStep >= 3 ? 'false' : 'true');
    }
    var rowD = document.getElementById('ch17-table-row-d');
    if (rowD) rowD.classList.toggle('ch17-row-d-highlight', proofStep >= 4);
    if (proofNext) {
      proofNext.textContent = proofStep >= 5 ? 'Finish Section 1 →' : 'Next →';
    }
  }

  if (oracleContinue) {
    oracleContinue.addEventListener('click', function () {
      if (oraclePhase) oraclePhase.hidden = true;
      if (proofPhase) proofPhase.hidden = false;
      proofStep = 1;
      refreshProofUI();
    });
  }

  if (proofNext) {
    proofNext.addEventListener('click', function () {
      if (proofStep < 5) {
        proofStep++;
        refreshProofUI();
      } else if (proofStep === 5) {
        proofStep++;
        markDone('s1');
        if (collatzWrap) collatzWrap.hidden = false;
        proofNext.hidden = true;
      }
    });
  }

  /* —— Section 2 trace grid —— */
  var traceCells = [0, 1, 2, 3, 4].map(function (i) {
    return document.querySelector('[data-ch17-trace="' + i + '"]');
  });
  var traceFlipped = [false, false, false, false, false];

  function checkTraceComplete() {
    if (traceFlipped.every(Boolean)) {
      markDone('s2');
      var cap = document.getElementById('ch17-trace-caption');
      if (cap) cap.hidden = false;
    }
  }

  function flipTraceCell(idx) {
    var cell = traceCells[idx];
    if (!cell || traceFlipped[idx]) return;
    var raw = cell.getAttribute('data-raw') || 'HALTS';
    var flipped = L.flipHaltingLabel(raw);
    cell.textContent = flipped;
    cell.classList.add('ch17-trace-flipped');
    cell.setAttribute('aria-pressed', 'true');
    traceFlipped[idx] = true;
    checkTraceComplete();
  }

  traceCells.forEach(function (cell, idx) {
    if (!cell) return;
    cell.addEventListener('click', function () {
      flipTraceCell(idx);
    });
    cell.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        flipTraceCell(idx);
      }
    });
  });

})();
