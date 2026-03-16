(function () {
  var display = document.getElementById('tnt-display');
  var resultEl = document.getElementById('tnt-result');
  var formula = 'S0+S0=SS0';

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
  interpret();
})();
