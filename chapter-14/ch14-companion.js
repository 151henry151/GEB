/**
 * Chapter 14 companion: Gödel encoding, proof predicate, fixed point (Acts 1–3).
 */
'use strict';

(function () {
  var SYMBOL_ORDER = ['0', 'S', '+', '·', '=', '(', ')', '∀', '∃', '¬', '∧'];
  var SYMBOL_MAP = { '0': 1, 'S': 2, '+': 3, '·': 4, '=': 5, '(': 6, ')': 7, '∀': 8, '∃': 9, '¬': 10, '∧': 11 };
  var CODE_TO_CHAR = {};
  SYMBOL_ORDER.forEach(function (ch) {
    CODE_TO_CHAR[SYMBOL_MAP[ch]] = ch;
  });
  var PRIMES = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97];

  var ENCODE_MS = 300;

  var formulaEl = document.getElementById('ch14-formula-display');
  var encodeBtn = document.getElementById('ch14-encode-btn');
  var decodeBtn = document.getElementById('ch14-decode-btn');
  var factorEl = document.getElementById('ch14-factor-build');
  var gnEl = document.getElementById('ch14-gn-result');
  var act1Caption = document.getElementById('ch14-act1-caption');
  var progressDots = document.querySelectorAll('.ch14-progress-dot');

  var lastGn = null;
  var lastFormula = '';
  var encodingBusy = false;

  function formatBigInt(n) {
    return n.toLocaleString('en-US');
  }

  function encodeGodel(formula) {
    var codes = [];
    for (var i = 0; i < formula.length; i++) {
      var ch = formula[i];
      var c = SYMBOL_MAP[ch];
      if (c == null) throw new Error('Invalid symbol: ' + ch);
      codes.push(c);
    }
    var gn = 1n;
    for (var j = 0; j < codes.length; j++) {
      gn *= BigInt(PRIMES[j]) ** BigInt(codes[j]);
    }
    return { codes: codes, gn: gn };
  }

  function decodeGodel(gn) {
    var n = BigInt(gn);
    var codes = [];
    for (var i = 0; i < PRIMES.length && n > 1n; i++) {
      var p = BigInt(PRIMES[i]);
      var e = 0;
      while (n % p === 0n) {
        n /= p;
        e++;
      }
      codes.push(e);
    }
    if (n !== 1n) throw new Error('Could not factor Gödel number');
    return codes;
  }

  function codesToFormula(codes) {
    var s = '';
    for (var i = 0; i < codes.length; i++) {
      var ch = CODE_TO_CHAR[codes[i]];
      if (!ch) throw new Error('Invalid code: ' + codes[i]);
      s += ch;
    }
    return s;
  }

  function renderFormulaSpans(formula) {
    if (!formulaEl) return [];
    formulaEl.innerHTML = '';
    var spans = [];
    for (var i = 0; i < formula.length; i++) {
      var sp = document.createElement('span');
      sp.className = 'ch14-formula-char';
      sp.setAttribute('data-i', String(i));
      sp.textContent = formula[i];
      formulaEl.appendChild(sp);
      spans.push(sp);
    }
    return spans;
  }

  function getFormulaString() {
    if (!formulaEl) return '';
    return Array.prototype.map.call(formulaEl.querySelectorAll('.ch14-formula-char'), function (s) {
      return s.textContent;
    }).join('');
  }

  function setFormulaFromString(s) {
    renderFormulaSpans(s);
  }

  function setProgress(act) {
    var n = Math.max(0, Math.min(3, act));
    progressDots.forEach(function (dot, idx) {
      dot.classList.toggle('is-on', idx < n);
    });
  }

  function observeActs() {
    var acts = [
      document.getElementById('ch14-act1'),
      document.getElementById('ch14-act2'),
      document.getElementById('ch14-act3')
    ];
    setProgress(1);
    if (!acts[0] || typeof IntersectionObserver === 'undefined') {
      return;
    }
    var seen = [false, false, false];
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (en) {
          if (!en.isIntersecting) return;
          var id = en.target.id;
          if (id === 'ch14-act1') seen[0] = true;
          if (id === 'ch14-act2') seen[1] = true;
          if (id === 'ch14-act3') seen[2] = true;
          var level = seen[2] ? 3 : seen[1] ? 2 : seen[0] ? 1 : 1;
          setProgress(level);
        });
      },
      { threshold: 0.15 }
    );
    acts.forEach(function (el) {
      if (el) io.observe(el);
    });
  }

  document.querySelectorAll('.ch14-symbol-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var sym = btn.getAttribute('data-sym');
      if (sym == null || sym === '' || !formulaEl || encodingBusy) return;
      var sp = document.createElement('span');
      sp.className = 'ch14-formula-char';
      sp.textContent = sym;
      formulaEl.appendChild(sp);
      if (act1Caption) act1Caption.textContent = '';
    });
  });

  var backBtn = document.getElementById('ch14-back-btn');
  var clearBtn = document.getElementById('ch14-clear-btn');
  if (backBtn) {
    backBtn.addEventListener('click', function () {
      if (encodingBusy) return;
      var chs = formulaEl.querySelectorAll('.ch14-formula-char');
      if (chs.length) chs[chs.length - 1].remove();
      if (act1Caption) act1Caption.textContent = '';
    });
  }
  if (clearBtn) {
    clearBtn.addEventListener('click', function () {
      if (encodingBusy) return;
      setFormulaFromString('');
      if (act1Caption) act1Caption.textContent = '';
    });
  }

  function runEncodeAnimation() {
    var formula = getFormulaString();
    if (!formula.length) {
      if (act1Caption) act1Caption.textContent = 'Build a formula first.';
      return;
    }
    var data;
    try {
      data = encodeGodel(formula);
    } catch (e) {
      if (act1Caption) act1Caption.textContent = e.message || String(e);
      return;
    }
    encodingBusy = true;
    if (encodeBtn) encodeBtn.disabled = true;
    if (decodeBtn) decodeBtn.disabled = true;
    if (factorEl) factorEl.innerHTML = '';
    if (gnEl) {
      gnEl.textContent = '';
      gnEl.classList.remove('is-lit');
    }
    if (act1Caption) act1Caption.textContent = '';

    var spans = renderFormulaSpans(formula);
    var codes = data.codes;
    var gn = data.gn;

    function step(idx) {
      if (idx >= codes.length) {
        lastGn = gn;
        lastFormula = formula;
        if (gnEl) {
          gnEl.textContent = formatBigInt(gn);
          gnEl.classList.add('is-lit');
        }
        if (act1Caption) {
          act1Caption.innerHTML =
            '<em>This formula is now a number. TNT speaks arithmetic. So TNT can speak about this formula — it just has to speak about this number.</em>';
        }
        if (decodeBtn) decodeBtn.hidden = false;
        encodingBusy = false;
        if (encodeBtn) encodeBtn.disabled = false;
        if (decodeBtn) decodeBtn.disabled = false;
        return;
      }
      spans.forEach(function (s, j) {
        s.classList.toggle('is-highlight', j === idx);
      });
      var oldB = spans[idx].querySelector('.ch14-code-badge');
      if (oldB) oldB.remove();
      var badge = document.createElement('span');
      badge.className = 'ch14-code-badge';
      badge.textContent = String(codes[idx]);
      spans[idx].appendChild(badge);

      var prime = PRIMES[idx];
      var factorChunk = document.createElement('span');
      factorChunk.className = 'ch14-factor-chunk';
      factorChunk.innerHTML =
        (idx ? ' <span class="ch14-times">×</span> ' : '') +
        '<span class="ch14-prime-base">' +
        prime +
        '</span><sup>' +
        codes[idx] +
        '</sup>';
      if (factorEl) factorEl.appendChild(factorChunk);

      setTimeout(function () {
        spans[idx].classList.remove('is-highlight');
        step(idx + 1);
      }, ENCODE_MS);
    }
    step(0);
  }

  function runDecodeAnimation() {
    if (lastGn == null || encodingBusy) return;
    encodingBusy = true;
    if (encodeBtn) encodeBtn.disabled = true;
    if (decodeBtn) decodeBtn.disabled = true;
    if (factorEl) factorEl.innerHTML = '';
    if (formulaEl) formulaEl.innerHTML = '';
    if (gnEl) {
      gnEl.textContent = formatBigInt(lastGn);
      gnEl.classList.add('is-lit');
    }
    if (act1Caption) act1Caption.textContent = '';

    var codes;
    try {
      codes = decodeGodel(lastGn);
    } catch (e) {
      encodingBusy = false;
      if (encodeBtn) encodeBtn.disabled = false;
      if (decodeBtn) decodeBtn.disabled = false;
      if (act1Caption) act1Caption.textContent = e.message || String(e);
      return;
    }

    var fi = 0;

    function addFactorThenSymbols() {
      if (fi >= codes.length) {
        var ri = codes.length - 1;
        function prependSym() {
          if (ri < 0) {
            encodingBusy = false;
            if (encodeBtn) encodeBtn.disabled = false;
            if (decodeBtn) decodeBtn.disabled = false;
            if (act1Caption) {
              act1Caption.innerHTML =
                '<em>Same number, same formula — the coding is lossless. Syntax and arithmetic meet in one object.</em>';
            }
            return;
          }
          var sym = CODE_TO_CHAR[codes[ri]];
          var sp = document.createElement('span');
          sp.className = 'ch14-formula-char';
          sp.textContent = sym;
          formulaEl.insertBefore(sp, formulaEl.firstChild);
          ri--;
          setTimeout(prependSym, ENCODE_MS);
        }
        prependSym();
        return;
      }
      var factorChunk = document.createElement('span');
      factorChunk.className = 'ch14-factor-chunk';
      factorChunk.innerHTML =
        (fi ? ' <span class="ch14-times">×</span> ' : '') +
        '<span class="ch14-prime-base">' +
        PRIMES[fi] +
        '</span><sup>' +
        codes[fi] +
        '</sup>';
      if (factorEl) factorEl.appendChild(factorChunk);
      fi++;
      setTimeout(addFactorThenSymbols, ENCODE_MS);
    }

    addFactorThenSymbols();
  }

  if (encodeBtn) encodeBtn.addEventListener('click', runEncodeAnimation);
  if (decodeBtn) decodeBtn.addEventListener('click', runDecodeAnimation);

  setFormulaFromString('S0=S0');
  if (decodeBtn) decodeBtn.hidden = true;

  observeActs();

  /* ——— Act 3 steps ——— */
  var act3Max = 1;
  var act3Next = document.getElementById('ch14-act3-next');
  var act3Steps = document.querySelectorAll('.ch14-act3-step');
  var loopPath = document.getElementById('ch14-loop-path');
  var tableGRow = document.getElementById('ch14-proof-row-g');

  function revealAct3Step(n) {
    act3Steps.forEach(function (el) {
      var s = parseInt(el.getAttribute('data-step'), 10);
      if (s === n) el.classList.add('ch14-act3-revealed');
    });
    if (n >= 4 && loopPath) {
      try {
        var len = loopPath.getTotalLength();
        loopPath.style.strokeDasharray = String(len);
        loopPath.style.strokeDashoffset = String(len);
      } catch (e) {
        loopPath.style.strokeDasharray = '500';
        loopPath.style.strokeDashoffset = '500';
      }
      loopPath.style.animation = 'none';
      loopPath.offsetHeight;
      loopPath.style.animation = 'ch14-draw-loop 0.85s ease forwards';
      loopPath.style.animationFillMode = 'forwards';
    }
    if (act3Next) {
      if (n >= 6) {
        act3Next.hidden = true;
        runCapstone();
        if (tableGRow) {
          var cell = tableGRow.querySelector('.ch14-proof-result');
          if (cell) {
            cell.innerHTML = '✗ No — nothing encodes a proof of G';
            cell.classList.remove('is-pending');
          }
        }
      } else {
        act3Next.textContent = n >= 5 ? 'Next →' : 'Next →';
      }
    }
  }

  if (act3Next) {
    act3Next.addEventListener('click', function () {
      if (act3Max >= 6) return;
      act3Max++;
      revealAct3Step(act3Max);
    });
  }

  var capstoneStarted = false;
  var capstoneTimer = null;
  function runCapstone() {
    if (capstoneStarted) return;
    capstoneStarted = true;
    capstoneTimer = setTimeout(function () {
      var cap = document.getElementById('ch14-capstone');
      if (!cap) return;
      cap.hidden = false;
      var lines = cap.querySelectorAll('.ch14-capstone-line');
      lines.forEach(function (ln, i) {
        ln.style.opacity = '0';
        setTimeout(function () {
          ln.style.transition = 'opacity 0.5s ease';
          ln.style.opacity = '1';
        }, i * 800);
      });
    }, 1000);
  }

  revealAct3Step(1);
})();
