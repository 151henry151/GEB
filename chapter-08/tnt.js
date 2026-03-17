(function () {
  var display = document.getElementById('tnt-display');
  var resultEl = document.getElementById('tnt-result');
  var formula = 'S0+S0=SS0';

  var GODEL_SYMBOLS = { '0': 1, 'S': 2, '+': 3, '\u00B7': 4, '·': 4, '=': 5, '(': 6, ')': 7 };
  var PRIMES = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97];

  function getFormula() { return (display && display.textContent) || formula; }
  function setFormula(s) { formula = s; if (display) display.textContent = s; }

  function tokenize(str) {
    var tokens = [];
    var s = String(str).replace(/\s/g, '');
    for (var i = 0; i < s.length; i++) {
      var c = s[i];
      var dot = '\u00B7';
        if (c === '0' || c === 'S' || c === '+' || c === dot || c === '=' || c === '(' || c === ')') tokens.push(c);
    }
    return tokens;
  }

  function godelNumber(tokens) {
    var num = 1;
    for (var i = 0; i < tokens.length; i++) {
      var code = GODEL_SYMBOLS[tokens[i]];
      if (code === undefined) return null;
      var p = PRIMES[i];
      if (!p) return null;
      num *= Math.pow(p, code);
    }
    return tokens.length ? num : null;
  }

  function runGodelAnimation() {
    var godelResult = document.getElementById('tnt-godel-result');
    var godelCaption = document.getElementById('tnt-godel-caption');
    var str = getFormula();
    var tokens = tokenize(str);
    if (!tokens.length) {
      if (godelResult) godelResult.innerHTML = 'Build a formula first.';
      if (godelCaption) godelCaption.textContent = '';
      return;
    }
    var gn = godelNumber(tokens);
    if (gn === null) {
      if (godelResult) godelResult.innerHTML = 'Formula contains a symbol with no code.';
      if (godelCaption) godelCaption.textContent = '';
      return;
    }
    var codes = tokens.map(function (t) { return t + '\u2192' + GODEL_SYMBOLS[t]; }).join(', ');
    godelResult.innerHTML = 'Symbol codes: ' + codes;
    godelResult.classList.remove('godel-glow');
    if (godelCaption) godelCaption.textContent = '';
    setTimeout(function () {
      var parts = [];
      for (var j = 0; j < tokens.length; j++) {
        parts.push(PRIMES[j] + '<sup>' + GODEL_SYMBOLS[tokens[j]] + '</sup>');
      }
      godelResult.innerHTML = parts.join(' \u00D7 ') + ' = <strong class="logic">' + gn.toLocaleString() + '</strong>';
      godelResult.classList.add('godel-glow');
      if (godelCaption) godelCaption.textContent = 'This formula is also a number. TNT can talk about this number. So TNT can talk about this formula.';
    }, 400);
    setTimeout(function () {
      if (godelCaption) godelCaption.textContent = 'Every formula has a number. Every proof has a number. Arithmetic can therefore discuss proofs.';
    }, 2200);
  }

  var TNT_AXIOMS = ['0+0=0', 'S0+0=S0', '0+S0=S0'];
  var derivationLines = [];

  function initDerivation() {
    derivationLines = TNT_AXIOMS.map(function (ax, i) { return { label: 'Axiom ' + (i + 1), formula: ax }; });
    renderDerivation();
  }

  function addSBothSides(formulaStr) {
    var eqIdx = formulaStr.indexOf('=');
    if (eqIdx === -1) return null;
    var left = formulaStr.slice(0, eqIdx).trim();
    var right = formulaStr.slice(eqIdx + 1).trim();
    return 'S' + left + '=' + 'S' + right;
  }

  function deriveOne() {
    if (derivationLines.length === 0) initDerivation();
    var last = derivationLines[derivationLines.length - 1].formula;
    var next = addSBothSides(last);
    if (!next) return;
    derivationLines.push({ label: 'Theorem ' + (derivationLines.length - 3 + 1), formula: next });
    renderDerivation();
  }

  function escapeHtml(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function renderDerivation() {
    var container = document.getElementById('tnt-derivation-chain');
    if (!container) return;
    if (derivationLines.length === 0) {
      container.innerHTML = '<p class="tnt-hint" style="margin:0;">Axioms will appear here. Click Derive to add a line from the last one.</p>';
      return;
    }
    container.innerHTML = derivationLines.map(function (line, i) {
      var rule = i >= 3 ? ' (add S to both sides)' : '';
      return '<div class="tnt-derivation-line"><span class="tnt-derivation-label">' + line.label + '</span><code class="logic">' + escapeHtml(line.formula) + '</code>' + rule + '</div>';
    }).join('');
  }

  function parseAtom(tokens, idx) {
    if (idx >= tokens.length) return null;
    if (tokens[idx] === '0') return { val: 0, next: idx + 1 };
    if (tokens[idx] === 'S') {
      var inner = parseAtom(tokens, idx + 1);
      if (!inner) return null;
      return { val: 1 + inner.val, next: inner.next };
    }
    if (tokens[idx] === '(') {
      var term = parseTerm(tokens, idx + 1);
      if (!term || term.next >= tokens.length || tokens[term.next] !== ')') return null;
      return { val: term.val, next: term.next + 1 };
    }
    return null;
  }

  function parseProduct(tokens, idx) {
    var left = parseAtom(tokens, idx);
    if (!left) return null;
    var v = left.val;
    idx = left.next;
    var dot = '\u00B7';
        while (idx < tokens.length && tokens[idx] === dot) {
      var right = parseAtom(tokens, idx + 1);
      if (!right) return null;
      v = v * right.val;
      idx = right.next;
    }
    return { val: v, next: idx };
  }

  function parseTerm(tokens, idx) {
    var left = parseProduct(tokens, idx);
    if (!left) return null;
    var v = left.val;
    idx = left.next;
    while (idx < tokens.length && tokens[idx] === '+') {
      var right = parseProduct(tokens, idx + 1);
      if (!right) return null;
      v = v + right.val;
      idx = right.next;
    }
    return { val: v, next: idx };
  }

  function interpret() {
    var str = getFormula();
    var tokens = tokenize(str);
    if (tokens.length === 0) {
      if (resultEl) resultEl.innerHTML = 'Enter a term or equation (e.g. S0+S0=SS0).';
      return;
    }
    var eqCount = 0, eqIdx = -1;
    for (var i = 0; i < tokens.length; i++) { if (tokens[i] === '=') { eqCount++; eqIdx = i; } }
    if (eqCount === 0) {
      var t = parseTerm(tokens, 0);
      if (!t || t.next !== tokens.length) {
        if (resultEl) resultEl.innerHTML = 'Invalid term.';
        return;
      }
      if (resultEl) resultEl.innerHTML = 'Term value: <strong>' + t.val + '</strong>';
      return;
    }
    if (eqCount !== 1) {
      if (resultEl) resultEl.innerHTML = 'Use exactly one = for an equation.';
      return;
    }
    var left = parseTerm(tokens, 0);
    var right = parseTerm(tokens, eqIdx + 1);
    if (!left || left.next !== eqIdx) {
      if (resultEl) resultEl.innerHTML = 'Invalid left side.';
      return;
    }
    if (!right || right.next !== tokens.length) {
      if (resultEl) resultEl.innerHTML = 'Invalid right side.';
      return;
    }
    var ok = left.val === right.val;
    if (resultEl) resultEl.innerHTML = 'Interpretation: <strong>' + left.val + ' = ' + right.val + '</strong>. Equation is <span class="' + (ok ? 'truth-true' : 'truth-false') + '">' + (ok ? 'true' : 'false') + '</span>.';
  }

  document.querySelectorAll('[data-insert]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      setFormula(getFormula() + btn.getAttribute('data-insert'));
    });
  });
  var backBtn = document.getElementById('tnt-back');
  if (backBtn) backBtn.addEventListener('click', function () {
    var s = getFormula();
    if (s.length) setFormula(s.slice(0, -1));
  });
  var clearBtn = document.getElementById('tnt-clear');
  if (clearBtn) clearBtn.addEventListener('click', function () { setFormula(''); });
  var interpBtn = document.getElementById('tnt-interpret');
  if (interpBtn) interpBtn.addEventListener('click', interpret);
  var godelBtn = document.getElementById('tnt-godel-btn');
  if (godelBtn) godelBtn.addEventListener('click', runGodelAnimation);

  var deriveBtn = document.getElementById('tnt-derive-btn');
  if (deriveBtn) deriveBtn.addEventListener('click', deriveOne);

  interpret();
  initDerivation();
})();
