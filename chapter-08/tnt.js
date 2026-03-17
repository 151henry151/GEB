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
    var primeSeqEl = document.getElementById('tnt-godel-prime-sequence');
    var selfrefEl = document.getElementById('tnt-godel-selfref');
    var footerEl = document.getElementById('tnt-godel-footer');
    var str = getFormula();
    var tokens = tokenize(str);
    if (!tokens.length) {
      if (godelResult) godelResult.innerHTML = 'Build a formula first.';
      if (godelCaption) godelCaption.textContent = '';
      if (primeSeqEl) primeSeqEl.textContent = '';
      if (selfrefEl) selfrefEl.style.display = 'none';
      if (footerEl) footerEl.style.display = 'none';
      return;
    }
    var gn = godelNumber(tokens);
    if (gn === null) {
      if (godelResult) godelResult.innerHTML = 'Formula contains a symbol with no code.';
      if (godelCaption) godelCaption.textContent = '';
      if (primeSeqEl) primeSeqEl.textContent = '';
      if (selfrefEl) selfrefEl.style.display = 'none';
      if (footerEl) footerEl.style.display = 'none';
      return;
    }
    var codes = tokens.map(function (t) { return t + '\u2192' + GODEL_SYMBOLS[t]; }).join(', ');
    godelResult.innerHTML = 'Symbol codes: ' + codes;
    godelResult.classList.remove('godel-glow');
    if (godelCaption) godelCaption.textContent = '';
    if (primeSeqEl) primeSeqEl.textContent = '';
    if (selfrefEl) selfrefEl.style.display = 'none';
    if (footerEl) footerEl.style.display = 'none';
    setTimeout(function () {
      var parts = [];
      var primesUsed = [];
      for (var j = 0; j < tokens.length; j++) {
        var p = PRIMES[j];
        primesUsed.push(p);
        parts.push('<span class="godel-prime">' + p + '</span><sup>' + GODEL_SYMBOLS[tokens[j]] + '</sup>');
      }
      godelResult.innerHTML = parts.join(' \u00D7 ') + ' = <strong class="logic">' + gn.toLocaleString() + '</strong>';
      godelResult.classList.add('godel-glow');
      if (primeSeqEl) primeSeqEl.textContent = 'Primes by position: ' + primesUsed.join(', ') + (tokens.length < PRIMES.length ? ' \u2026' : '');
      if (godelCaption) godelCaption.textContent = 'This formula is also a number. TNT can talk about this number. So TNT can talk about this formula.';
    }, 400);
    setTimeout(function () {
      if (godelCaption) godelCaption.textContent = 'Every formula has a number. Every proof has a number. Arithmetic can therefore discuss proofs.';
      if (selfrefEl) selfrefEl.style.display = 'block';
      if (footerEl) footerEl.style.display = 'block';
    }, 2200);
  }

  function escapeHtml(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function interpretEquation(formulaStr) {
    var s = String(formulaStr).replace(/\s/g, '');
    var toks = tokenize(s);
    if (!toks.length) return null;
    var eqIdx = -1;
    for (var i = 0; i < toks.length; i++) { if (toks[i] === '=') { eqIdx = i; break; } }
    if (eqIdx === -1) return null;
    var left = parseTerm(toks, 0);
    if (!left || left.next !== eqIdx) return null;
    var right = parseTerm(toks, eqIdx + 1);
    if (!right || right.next !== toks.length) return null;
    return left.val + ' = ' + right.val;
  }

  var DERIV_AXIOMS = [
    { formula: '\u2200a: (a + 0) = a', meaning: 'Adding zero changes nothing', gn: null },
    { formula: '\u2200a: \u2200b: (a + Sb) = S(a + b)', meaning: 'Successor distributes over addition', gn: null },
    { formula: 'S0 = S0', meaning: '1 = 1', gn: null },
    { formula: '(S0 + S0) = SS0', meaning: '1 + 1 = 2', gn: null }
  ];

  var GODEL_DERIV = { '0': 1, 'S': 2, '+': 3, '=': 5, '(': 6, ')': 7, '\u2200': 8, 'a': 9, 'b': 10, ':': 11 };
  function tokenizeDeriv(s) {
    var out = [];
    s = String(s).replace(/\s/g, '');
    for (var i = 0; i < s.length; i++) {
      if (s.slice(i, i + 1) === '\u2200') { out.push('\u2200'); continue; }
      var c = s[i];
      if (GODEL_DERIV[c] !== undefined) out.push(c);
    }
    return out;
  }
  function godelNumberDeriv(tokens) {
    var n = 1;
    for (var i = 0; i < tokens.length; i++) {
      var c = GODEL_DERIV[tokens[i]];
      if (c === undefined) return null;
      var p = PRIMES[i];
      if (!p) return null;
      n *= Math.pow(p, c);
    }
    return tokens.length ? n : null;
  }
  function computeAxiomGN() {
    DERIV_AXIOMS.forEach(function (ax) {
      var t = tokenizeDeriv(ax.formula);
      ax.gn = godelNumberDeriv(t);
    });
  }

  var derivChain = [];
  var selectedAxiomIndex = null;
  var transitivitySelection = [];
  var derivAnimating = false;

  function getLastFormula() {
    return derivChain.length ? derivChain[derivChain.length - 1].formula : null;
  }

  function applySpecification(formula, lineNum) {
    if (formula.indexOf('\u2200a: (a + 0) = a') !== -1) return { formula: '(S0 + 0) = S0', justification: '[Spec, line ' + lineNum + ': a \u2192 S0]' };
    if (formula.indexOf('\u2200a: \u2200b: (a + Sb) = S(a + b)') !== -1) return { formula: '(S0 + S0) = S(S0 + 0)', justification: '[Spec, line ' + lineNum + ': a \u2192 S0, b \u2192 0]' };
    return null;
  }
  function applySuccessor(formula, lineNum) {
    var eq = formula.indexOf('=');
    if (eq === -1) return null;
    var left = formula.slice(0, eq).trim();
    var right = formula.slice(eq + 1).trim();
    return { formula: 'S' + left + ' = S' + right, justification: '[Successor, line ' + lineNum + ']' };
  }
  function applySymmetry(formula, lineNum) {
    var eq = formula.indexOf('=');
    if (eq === -1) return null;
    var left = formula.slice(0, eq).trim();
    var right = formula.slice(eq + 1).trim();
    return { formula: right + ' = ' + left, justification: '[Symmetry, line ' + lineNum + ']' };
  }
  function applyAddS(formula, lineNum) {
    return applySuccessor(formula, lineNum);
  }
  function applyTransitivity(line1, line2) {
    var eq1 = line1.formula.indexOf('=');
    var eq2 = line2.formula.indexOf('=');
    if (eq1 === -1 || eq2 === -1) return null;
    var l1 = line1.formula.slice(0, eq1).trim();
    var r1 = line1.formula.slice(eq1 + 1).trim();
    var l2 = line2.formula.slice(0, eq2).trim();
    var r2 = line2.formula.slice(eq2 + 1).trim();
    if (r1 !== l2) return null;
    return { formula: l1 + ' = ' + r2, justification: '[Transitivity, lines ' + (derivChain.indexOf(line1) + 1) + ', ' + (derivChain.indexOf(line2) + 1) + ']' };
  }

  function ruleApplies(ruleId, lineIdx) {
    var formula = derivChain[lineIdx].formula;
    if (ruleId === 'spec') return formula.indexOf('\u2200') === 0;
    if (ruleId === 'successor' || ruleId === 'addS') return formula.indexOf('=') >= 0;
    if (ruleId === 'symmetry') return formula.indexOf('=') >= 0;
    if (ruleId === 'transitivity') return transitivitySelection.length === 2;
    return false;
  }

  function renderAxiomCards() {
    var el = document.getElementById('tnt-axiom-cards');
    if (!el) return;
    computeAxiomGN();
    el.innerHTML = DERIV_AXIOMS.map(function (ax, i) {
      var selected = selectedAxiomIndex === i;
      var grayed = selectedAxiomIndex !== null && selectedAxiomIndex !== i;
      var gnStr = ax.gn != null ? ax.gn.toLocaleString() : '—';
      return '<div class="tnt-axiom-card' + (selected ? ' selected' : '') + (grayed ? ' grayed' : '') + '" data-axiom="' + i + '"><div class="axiom-formula">' + escapeHtml(ax.formula) + '</div><div class="axiom-meaning">' + escapeHtml(ax.meaning) + '</div><div class="axiom-gn">G\u00f6del # ' + gnStr + '</div></div>';
    }).join('');
    el.querySelectorAll('.tnt-axiom-card').forEach(function (card) {
      if (card.classList.contains('grayed')) return;
      card.addEventListener('click', function () {
        var idx = parseInt(card.getAttribute('data-axiom'), 10);
        selectedAxiomIndex = idx;
        derivChain = [{ formula: DERIV_AXIOMS[idx].formula, justification: '[Axiom ' + (idx + 1) + ']', interpretation: DERIV_AXIOMS[idx].meaning, godelNumber: DERIV_AXIOMS[idx].gn, isNew: false }];
        transitivitySelection = [];
        renderAxiomCards();
        renderRulePalette();
        renderDerivChain();
        updateWhatProved();
        updateCapstone();
      });
    });
  }

  var RULES = [
    { id: 'spec', name: 'Specification', pattern: '\u2200x: F[x] \u2192 F[t]', english: 'If it holds for all numbers, it holds for any one.', apply: function (lineNum) { return applySpecification(derivChain[lineNum].formula, lineNum + 1); } },
    { id: 'successor', name: 'Successor', pattern: 't = u \u2192 St = Su', english: 'If two things are equal, their successors are equal.', apply: function (lineNum) { return applySuccessor(derivChain[lineNum].formula, lineNum + 1); } },
    { id: 'symmetry', name: 'Symmetry', pattern: 't = u \u2192 u = t', english: 'Equals can be flipped.', apply: function (lineNum) { return applySymmetry(derivChain[lineNum].formula, lineNum + 1); } },
    { id: 'transitivity', name: 'Transitivity', pattern: 't=u and u=v \u2192 t=v', english: 'If a=b and b=c, then a=c.', apply: function () { if (transitivitySelection.length !== 2) return null; var r = applyTransitivity(derivChain[transitivitySelection[0]], derivChain[transitivitySelection[1]]); return r; } },
    { id: 'addS', name: 'Add S to both sides', pattern: 't = u \u2192 (St) = (Su)', english: 'Wrap both sides in \u201cone more\u201d.', apply: function (lineNum) { return applyAddS(derivChain[lineNum].formula, lineNum + 1); } }
  ];

  function renderRulePalette() {
    var el = document.getElementById('tnt-rule-palette');
    if (!el) return;
    var lastIdx = derivChain.length - 1;
    var transOk = transitivitySelection.length === 2;
    el.innerHTML = RULES.map(function (r) {
      var applicable = false;
      var grayed = false;
      var reason = '';
      if (derivChain.length === 0) { grayed = true; reason = 'Select an axiom first.'; }
      else if (r.id === 'transitivity') {
        applicable = transOk;
        if (!applicable) { grayed = true; reason = 'Select two lines (click line numbers), then click Apply.'; }
      } else {
        applicable = r.id !== 'transitivity' && ruleApplies(r.id, lastIdx);
        if (!applicable && !grayed) { grayed = true; reason = r.id === 'spec' ? 'Last line must be universally quantified.' : 'Apply to last line.'; }
      }
      return '<div class="tnt-rule-card' + (applicable ? ' applicable' : '') + (grayed ? ' grayed' : '') + '" title="' + escapeHtml(reason) + '" data-rule="' + r.id + '"><div class="rule-name">' + escapeHtml(r.name) + '</div><div class="rule-pattern">' + escapeHtml(r.pattern) + '</div><div class="rule-english">' + escapeHtml(r.english) + '</div></div>';
    }).join('');
    el.querySelectorAll('.tnt-rule-card').forEach(function (card) {
      if (card.classList.contains('grayed')) return;
      card.addEventListener('click', function () {
        if (derivAnimating) return;
        var ruleId = card.getAttribute('data-rule');
        var result = null;
        if (ruleId === 'transitivity' && transitivitySelection.length === 2) {
          result = RULES[3].apply();
          transitivitySelection = [];
          document.getElementById('tnt-transitivity-hint').style.display = 'none';
        } else if (ruleId !== 'transitivity') {
          result = RULES.filter(function (x) { return x.id === ruleId; })[0].apply(lastIdx);
        }
        if (result) {
          var interp = interpretEquation(result.formula);
          var tok = tokenizeDeriv(result.formula);
          var gn = godelNumberDeriv(tok);
          derivChain.push({ formula: result.formula, justification: result.justification, interpretation: interp || '', godelNumber: gn, isNew: true });
          renderDerivChain();
          renderRulePalette();
          updateWhatProved();
          updateCapstone();
        }
      });
    });
  }

  function renderDerivChain() {
    var container = document.getElementById('tnt-derivation-chain');
    if (!container) return;
    if (derivChain.length === 0) {
      container.innerHTML = '<p class="tnt-hint" style="margin:0;">Select an axiom above to start the derivation.</p>';
      return;
    }
    container.innerHTML = derivChain.map(function (line, i) {
      var lineNum = i + 1;
      var gnStr = line.godelNumber != null ? line.godelNumber.toLocaleString() : '';
      var interp = line.interpretation ? '<div class="line-interpretation">' + escapeHtml(line.interpretation) + '</div>' : '';
      var gnBadge = gnStr ? '<div class="line-gn">G\u00f6del # ' + gnStr + '</div>' : '';
      var transSel = transitivitySelection.indexOf(i) >= 0 ? ' trans-selected' : '';
      return '<div class="tnt-derivation-line' + (line.isNew ? ' new-line' : '') + transSel + '" data-line="' + i + '"><div class="line-head"><span class="line-num">' + lineNum + '.</span><span class="line-formula">' + escapeHtml(line.formula) + '</span><span class="line-justification">' + escapeHtml(line.justification) + '</span></div>' + interp + gnBadge + '</div>';
    }).join('');
    derivChain.forEach(function (_, i) { if (derivChain[i]) derivChain[i].isNew = false; });
    container.querySelectorAll('.tnt-derivation-line[data-line]').forEach(function (row) {
      row.addEventListener('click', function () {
        if (derivAnimating) return;
        var idx = parseInt(row.getAttribute('data-line'), 10);
        if (transitivitySelection.indexOf(idx) >= 0) {
          transitivitySelection = transitivitySelection.filter(function (x) { return x !== idx; });
        } else if (transitivitySelection.length < 2) {
          transitivitySelection.push(idx);
        }
        if (transitivitySelection.length === 2) document.getElementById('tnt-transitivity-hint').style.display = 'inline';
        else document.getElementById('tnt-transitivity-hint').style.display = 'none';
        renderDerivChain();
        renderRulePalette();
      });
    });
  }

  function updateWhatProved() {
    var el = document.getElementById('tnt-what-proved');
    if (!el) return;
    if (derivChain.length === 0) { el.style.display = 'none'; return; }
    var last = derivChain[derivChain.length - 1];
    var interp = last.interpretation || interpretEquation(last.formula);
    if (!interp) { el.style.display = 'none'; return; }
    el.style.display = 'block';
    el.innerHTML = 'You just proved: <strong>' + escapeHtml(interp) + '</strong>';
  }

  var CAPSTONE = 'You just ran a proof. Each step was pure symbol manipulation \u2014 the rules never \u201cknew\u201d what the symbols meant. Yet the last line, when interpreted, is a true arithmetic fact. This is TNT: a formal game whose theorems turn out to be truths.<br><br>Now notice: this chain of formulas is itself a sequence of strings. Each string has a G\u00f6del number. The whole chain \u2014 the entire proof \u2014 is therefore a sequence of numbers. And a sequence of numbers can be encoded as a single number. So this proof, right here, is also a number. And TNT can talk about numbers\u2026';
  function updateCapstone() {
    var el = document.getElementById('tnt-deriv-capstone');
    if (!el) return;
    if (derivChain.length >= 3) { el.style.display = 'block'; el.innerHTML = CAPSTONE; } else { el.style.display = 'none'; }
  }

  function runPreset(steps) {
    if (derivAnimating || steps.length === 0) return;
    derivAnimating = true;
    selectedAxiomIndex = steps[0].axiomIndex;
    derivChain = [{ formula: DERIV_AXIOMS[steps[0].axiomIndex].formula, justification: '[Axiom ' + (steps[0].axiomIndex + 1) + ']', interpretation: DERIV_AXIOMS[steps[0].axiomIndex].meaning, godelNumber: DERIV_AXIOMS[steps[0].axiomIndex].gn, isNew: false }];
    computeAxiomGN();
    renderAxiomCards();
    renderDerivChain();
    var stepIdx = 1;
    function next() {
      if (stepIdx >= steps.length) { derivAnimating = false; renderRulePalette(); updateWhatProved(); updateCapstone(); return; }
      var step = steps[stepIdx];
      if (step.addAxiom !== undefined) {
        var ax = DERIV_AXIOMS[step.addAxiom];
        derivChain.push({ formula: ax.formula, justification: '[Axiom ' + (step.addAxiom + 1) + ']', interpretation: ax.meaning, godelNumber: ax.gn, isNew: true });
      } else if (step.apply) {
        var result = step.apply();
        if (result) {
          var interp = interpretEquation(result.formula);
          var tok = tokenizeDeriv(result.formula);
          derivChain.push({ formula: result.formula, justification: result.justification, interpretation: interp || '', godelNumber: godelNumberDeriv(tok), isNew: true });
        }
      }
      renderDerivChain();
      updateWhatProved();
      updateCapstone();
      stepIdx++;
      setTimeout(next, 800);
    }
    setTimeout(next, 800);
  }

  function initDerivation() {
    renderAxiomCards();
    renderRulePalette();
    renderDerivChain();
    updateWhatProved();
    updateCapstone();
    document.getElementById('tnt-deriv-reset').addEventListener('click', function () {
      if (derivAnimating) return;
      if (selectedAxiomIndex !== null && derivChain.length > 0) {
        derivChain = [{ formula: DERIV_AXIOMS[selectedAxiomIndex].formula, justification: '[Axiom ' + (selectedAxiomIndex + 1) + ']', interpretation: DERIV_AXIOMS[selectedAxiomIndex].meaning, godelNumber: DERIV_AXIOMS[selectedAxiomIndex].gn, isNew: false }];
        transitivitySelection = [];
        document.getElementById('tnt-transitivity-hint').style.display = 'none';
        renderDerivChain();
        renderRulePalette();
        updateWhatProved();
        updateCapstone();
      }
    });
    document.getElementById('tnt-watch-1+0').addEventListener('click', function () {
      runPreset([
        { axiomIndex: 0 },
        { apply: function () { return applySpecification(DERIV_AXIOMS[0].formula, 1); } }
      ]);
    });
    document.getElementById('tnt-watch-1+1').addEventListener('click', function () {
      runPreset([
        { axiomIndex: 0 },
        { apply: function () { return applySpecification(derivChain[0].formula, 1); } },
        { addAxiom: 1 },
        { apply: function () { return applySpecification(derivChain[2].formula, 3); } },
        { apply: function () { return applySuccessor(derivChain[1].formula, 2); } },
        { apply: function () { return applyTransitivity(derivChain[3], derivChain[4]); } }
      ]);
    });
    document.getElementById('tnt-watch-2=2').addEventListener('click', function () {
      runPreset([
        { axiomIndex: 2 },
        { apply: function () { return applySuccessor(DERIV_AXIOMS[2].formula, 1); } }
      ]);
    });
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

  interpret();
  initDerivation();
})();
