/**
 * Chapter XVI ENIUQ companion: diff, match %, presets, fold animation.
 */
'use strict';

(function () {
  var Q = window.GEBCh16Quine;
  if (!Q) return;

  var sourceInput = document.getElementById('quine-source');
  var templateInput = document.getElementById('quine-template');
  var outputEl = document.getElementById('quine-output');
  var verdictEl = document.getElementById('quine-verdict');
  var matchPctEl = document.getElementById('quine-match-pct');
  var diffWrap = document.getElementById('quine-diff-wrap');
  var diffBody = document.getElementById('quine-diff-body');
  var diffTitle = document.getElementById('quine-diff-title');
  var successPanel = document.getElementById('quine-success-panel');
  var foldRoot = document.getElementById('quine-fold-root');
  var presetNote = document.getElementById('quine-preset-note');

  var lastPreset = null;

  function currentOutput() {
    return Q.eniuqOutput(templateInput.value);
  }

  function renderDiff(source, out) {
    if (!diffBody || !diffTitle || !diffWrap || !successPanel) return;
    var equal = source === out;
    if (equal) {
      diffWrap.hidden = true;
      successPanel.hidden = false;
      diffTitle.textContent = '';
      if (verdictEl) {
        verdictEl.textContent = '';
        verdictEl.className = 'quine-verdict';
      }
      return;
    }
    successPanel.hidden = true;
    diffWrap.hidden = false;
    diffTitle.textContent = 'Output ≠ Source — not a quine';
    var rows = Q.buildLineDiffRows(source, out);
    diffBody.innerHTML = '';
    var grid = document.createElement('div');
    grid.className = 'quine-diff-grid';
    var hL = document.createElement('div');
    var hR = document.createElement('div');
    hL.className = 'quine-diff-cell quine-diff-left quine-diff-header';
    hR.className = 'quine-diff-cell quine-diff-right quine-diff-header';
    hL.textContent = 'Source';
    hR.textContent = 'Output';
    grid.appendChild(hL);
    grid.appendChild(hR);
    rows.forEach(function (row) {
      var lc = document.createElement('div');
      var rc = document.createElement('div');
      lc.className = 'quine-diff-cell quine-diff-left' + (row.eq ? '' : ' quine-diff-mismatch');
      rc.className = 'quine-diff-cell quine-diff-right' + (row.eq ? '' : ' quine-diff-mismatch');
      if (row.l === null) {
        lc.innerHTML = '<span class="quine-diff-placeholder">—</span>';
      } else {
        lc.textContent = row.l;
      }
      if (row.r === null) {
        rc.innerHTML = '<span class="quine-diff-placeholder">—</span>';
      } else {
        rc.textContent = row.r;
      }
      grid.appendChild(lc);
      grid.appendChild(rc);
    });
    diffBody.appendChild(grid);
    if (verdictEl) {
      verdictEl.textContent =
        'Output ≠ program source. Adjust template or source until they match for self-reproduction.';
      verdictEl.className = 'quine-verdict truth-undefined';
    }
  }

  function updateLiveMatch() {
    var source = sourceInput.value;
    var out = currentOutput();
    var pct = Q.charMatchPercent(source, out);
    if (matchPctEl) matchPctEl.textContent = String(pct);
    renderDiff(source, out);
  }

  function playFold() {
    if (!foldRoot) return;
    foldRoot.classList.remove('ch16-fold-play');
    void foldRoot.offsetWidth;
    foldRoot.classList.add('ch16-fold-play');
    window.setTimeout(function () {
      foldRoot.classList.remove('ch16-fold-play');
    }, 420);
  }

  function run() {
    var template = templateInput.value;
    var source = sourceInput.value;
    var out = Q.eniuqOutput(template);
    outputEl.textContent = out;
    if (out === source) {
      playFold();
    }
    updateLiveMatch();
  }

  function reset() {
    templateInput.value = Q.QUINE_TEMPLATE;
    sourceInput.value = Q.programSource(Q.QUINE_TEMPLATE);
    outputEl.textContent = '—';
    lastPreset = null;
    if (presetNote) {
      presetNote.hidden = true;
      presetNote.textContent = '';
    }
    updateLiveMatch();
    if (verdictEl) {
      verdictEl.textContent = '';
      verdictEl.className = 'quine-verdict';
    }
  }

  function setDoubleBubble() {
    templateInput.value = 'DOUBLE-BUBBLE';
    sourceInput.value = Q.programSource('DOUBLE-BUBBLE');
    lastPreset = 'double';
    if (presetNote) {
      presetNote.hidden = false;
      presetNote.innerHTML =
        '<strong>DOUBLE-BUBBLE:</strong> a non-quine. The output is the template printed twice — but this doesn’t equal the full program. It shows what happens when the fixed point condition isn’t satisfied. The output contains the data but not the instructions.';
    }
    run();
  }

  function setOneStepFailure() {
    var t = Q.oneStepFailureTemplate();
    templateInput.value = t;
    sourceInput.value = Q.programSource(t);
    lastPreset = 'onestep';
    if (presetNote) {
      presetNote.hidden = false;
      presetNote.innerHTML =
        '<strong>ONE-STEP FAILURE:</strong> the template differs by one character from the quine (<code>ENIUY</code> vs <code>ENIUQ</code>). The diff highlights where the program and output diverge — the quine condition is strict.';
    }
    run();
  }

  function syncPresetNoteVisibility() {
    if (!presetNote || lastPreset === null) return;
    if (lastPreset === 'double') {
      var okD =
        templateInput.value === 'DOUBLE-BUBBLE' &&
        sourceInput.value === Q.programSource('DOUBLE-BUBBLE');
      if (!okD) {
        lastPreset = null;
        presetNote.hidden = true;
        presetNote.textContent = '';
      }
    } else if (lastPreset === 'onestep') {
      var t0 = Q.oneStepFailureTemplate();
      var okO =
        templateInput.value === t0 && sourceInput.value === Q.programSource(t0);
      if (!okO) {
        lastPreset = null;
        presetNote.hidden = true;
        presetNote.textContent = '';
      }
    }
  }

  function onEdit() {
    syncPresetNoteVisibility();
    updateLiveMatch();
  }
  sourceInput.addEventListener('input', onEdit);
  templateInput.addEventListener('input', onEdit);

  document.getElementById('quine-run').addEventListener('click', run);
  document.getElementById('quine-reset').addEventListener('click', reset);
  document.getElementById('quine-double').addEventListener('click', setDoubleBubble);
  var oneStepBtn = document.getElementById('quine-one-step');
  if (oneStepBtn) oneStepBtn.addEventListener('click', setOneStepFailure);

  sourceInput.value = Q.programSource(Q.QUINE_TEMPLATE);
  templateInput.value = Q.QUINE_TEMPLATE;
  updateLiveMatch();
})();
