/**
 * Chapter 13 companion: BlooP/FlooP search animation, halting oracle, Gödel walk.
 */
'use strict';

(function () {
  /** After 25 completed checks with no match, FlooP is in the "never halts" zone (26th check onward). */
  var FLOOP_DANGER_AFTER = 25;
  var FLOOP_CAP = 60;
  var DEFAULT_SLIDER = 50;

  var boundInput = document.getElementById('bloop-bound');
  var problemSelect = document.getElementById('bloop-problem');
  var resultDiv = document.getElementById('bloop-result');
  var speedSlider = document.getElementById('ch13-speed-slider');
  var stopBtn = document.getElementById('ch13-search-stop');
  var runBloopBtn = document.getElementById('bloop-run');
  var runFloopBtn = document.getElementById('floop-run');
  var logEl = document.getElementById('ch13-search-log');
  var logInner = document.getElementById('ch13-search-log-inner');

  var fillB = document.getElementById('ch13-fill-bloop');
  var fillF = document.getElementById('ch13-fill-floop');
  var meterB = document.getElementById('ch13-meter-bloop');
  var meterF = document.getElementById('ch13-meter-floop');
  var depthB = document.getElementById('ch13-depth-bloop');
  var depthF = document.getElementById('ch13-depth-floop');
  var checkB = document.getElementById('ch13-checking-bloop');
  var checkF = document.getElementById('ch13-checking-floop');
  var lidB = document.getElementById('ch13-lid-bloop');
  var lidLabelB = document.getElementById('ch13-lid-label-bloop');

  var ev = typeof window.ch13EvaluatePredicate === 'function' ? window.ch13EvaluatePredicate : null;

  var searchToken = 0;
  var searchTimeouts = [];

  function clearSearchTimers() {
    searchTimeouts.forEach(function (id) { clearTimeout(id); });
    searchTimeouts = [];
  }

  function schedule(fn, ms) {
    var id = setTimeout(function () {
      searchTimeouts = searchTimeouts.filter(function (x) { return x !== id; });
      fn();
    }, ms);
    searchTimeouts.push(id);
    return id;
  }

  function getStepDelayMs() {
    if (!speedSlider) return 120;
    var s = parseInt(speedSlider.value, 10);
    if (s <= 50) {
      return Math.round(1000 + (120 - 1000) * (s / 50));
    }
    return Math.round(120 + (0 - 120) * ((s - 50) / 50));
  }

  function setSearchRunning(on) {
    if (stopBtn) stopBtn.hidden = !on;
    if (runBloopBtn) runBloopBtn.disabled = on;
    if (runFloopBtn) runFloopBtn.disabled = on;
  }

  function appendLog(line) {
    if (!logInner) return;
    var row = document.createElement('div');
    row.className = 'ch13-log-line';
    row.textContent = line;
    logInner.appendChild(row);
    if (logEl) logEl.scrollTop = logEl.scrollHeight;
  }

  function clearLog() {
    if (logInner) logInner.innerHTML = '';
  }

  function getPredicate() {
    var preset = document.querySelector('input[name="ch13-src"]:checked');
    if (preset && preset.value === 'custom') {
      if (!ev) throw new Error('Predicate engine failed to load');
      var src = (document.getElementById('ch13-predicate') || {}).value || '';
      return function (n) {
        return ev(src.trim(), n);
      };
    }
    var v = problemSelect ? problemSelect.value : 'square';
    if (v === 'square') return function (n) { return n * n === 25; };
    if (v === 'even') return function (n) { return n > 2 && n % 2 === 0; };
    return function (n) { return n > 0 && n < 0; };
  }

  function resetMeters() {
    if (fillB) fillB.style.height = '0%';
    if (fillF) fillF.style.height = '0%';
    if (meterB) {
      meterB.classList.remove('is-danger', 'is-found', 'is-danger-zone');
    }
    if (meterF) {
      meterF.classList.remove('is-danger', 'is-found', 'is-danger-zone');
    }
    if (depthB) depthB.textContent = '—';
    if (depthF) depthF.textContent = '—';
    if (checkB) checkB.textContent = 'Checking: n = —';
    if (checkF) checkF.textContent = 'Checking: n = —';
    if (lidB) lidB.classList.remove('ch13-lid-bounce');
  }

  function setFill(el, meterEl, pct, found, danger) {
    if (!el || !meterEl) return;
    el.style.height = Math.min(100, Math.max(0, pct)) + '%';
    meterEl.classList.toggle('is-found', !!found);
    meterEl.classList.toggle('is-danger', !!danger);
  }

  function updateLidLabel(N) {
    if (lidLabelB) lidLabelB.textContent = 'LID = ' + N;
  }

  function stopSearch() {
    searchToken++;
    clearSearchTimers();
    setSearchRunning(false);
  }

  function runBlooP() {
    var pred;
    try {
      pred = getPredicate();
      pred(0);
    } catch (e) {
      if (resultDiv) {
        resultDiv.textContent = 'Predicate error: ' + (e.message || String(e));
        resultDiv.className = 'truth-undefined';
      }
      return;
    }
    var N = Math.min(200, Math.max(1, parseInt(boundInput.value, 10) || 10));
    if (boundInput) boundInput.value = N;
    stopSearch();
    var myTok = ++searchToken;
    clearLog();
    resetMeters();
    updateLidLabel(N);
    setSearchRunning(true);
    if (resultDiv) {
      resultDiv.textContent = '';
      resultDiv.className = '';
    }

    var totalUnits = N + 1;

    function step(n) {
      if (myTok !== searchToken) return;
      var delay = getStepDelayMs();
      if (checkB) checkB.textContent = 'Checking: n = ' + n;
      if (depthB) depthB.textContent = 'n = ' + n;

      function afterPause() {
        if (myTok !== searchToken) return;
        var pFalse = 'Checking n = ' + n + ' … P(' + n + ') = false';
        var pTrue = 'Checking n = ' + n + ' … P(' + n + ') = TRUE ✓ Found!';
        try {
          var ok = pred(n);
          if (ok) {
            appendLog(pTrue);
            var pctFound = ((n + 1) / totalUnits) * 100;
            setFill(fillB, meterB, pctFound, true, false);
            if (resultDiv) {
              resultDiv.textContent = 'BlooP: found smallest n = ' + n + ' (within bound).';
              resultDiv.className = 'truth-true';
            }
            setSearchRunning(false);
            return;
          }
          appendLog(pFalse);
        } catch (err) {
          appendLog('Error at n = ' + n + ': ' + err.message);
          if (resultDiv) {
            resultDiv.textContent = 'Error at n=' + n + ': ' + err.message;
            resultDiv.className = 'truth-undefined';
          }
          setSearchRunning(false);
          return;
        }
        var pct = ((n + 1) / totalUnits) * 100;
        setFill(fillB, meterB, pct, false, false);
        if (n >= N) {
          appendLog('Reached bound N = ' + N + '. Stopping.');
          setFill(fillB, meterB, 100, false, false);
          if (lidB) {
            lidB.classList.add('ch13-lid-bounce');
            setTimeout(function () { lidB.classList.remove('ch13-lid-bounce'); }, 650);
          }
          if (depthB) depthB.textContent = 'stopped at N = ' + N;
          if (resultDiv) {
            resultDiv.textContent = 'BlooP (bound ' + N + '): no n in 0…' + N + ' satisfies P(n). Stopped.';
            resultDiv.className = 'truth-undefined';
          }
          setSearchRunning(false);
          return;
        }
        var nextN = n + 1;
        if (delay <= 0) {
          step(nextN);
        } else {
          schedule(function () { step(nextN); }, delay);
        }
      }

      if (delay <= 0) {
        afterPause();
      } else {
        schedule(afterPause, delay);
      }
    }

    if (getStepDelayMs() <= 0) {
      var foundB = false;
      var nn;
      for (nn = 0; nn <= N && myTok === searchToken; nn++) {
        if (checkB) checkB.textContent = 'Checking: n = ' + nn;
        if (depthB) depthB.textContent = 'n = ' + nn;
        try {
          if (pred(nn)) {
            appendLog('Checking n = ' + nn + ' … P(' + nn + ') = TRUE ✓ Found!');
            setFill(fillB, meterB, ((nn + 1) / totalUnits) * 100, true, false);
            if (resultDiv) {
              resultDiv.textContent = 'BlooP: found smallest n = ' + nn + ' (within bound).';
              resultDiv.className = 'truth-true';
            }
            foundB = true;
            break;
          }
          appendLog('Checking n = ' + nn + ' … P(' + nn + ') = false');
        } catch (err) {
          appendLog('Error at n = ' + nn + ': ' + err.message);
          if (resultDiv) {
            resultDiv.textContent = 'Error at n=' + nn + ': ' + err.message;
            resultDiv.className = 'truth-undefined';
          }
          setSearchRunning(false);
          return;
        }
        setFill(fillB, meterB, ((nn + 1) / totalUnits) * 100, false, false);
      }
      if (myTok !== searchToken) return;
      if (foundB) {
        setSearchRunning(false);
        return;
      }
      appendLog('Reached bound N = ' + N + '. Stopping.');
      setFill(fillB, meterB, 100, false, false);
      if (lidB) {
        lidB.classList.add('ch13-lid-bounce');
        setTimeout(function () { if (lidB) lidB.classList.remove('ch13-lid-bounce'); }, 650);
      }
      if (depthB) depthB.textContent = 'stopped at N = ' + N;
      if (resultDiv) {
        resultDiv.textContent = 'BlooP (bound ' + N + '): no n in 0…' + N + ' satisfies P(n). Stopped.';
        resultDiv.className = 'truth-undefined';
      }
      setSearchRunning(false);
      return;
    }
    step(0);
  }

  function runFlooP() {
    var pred;
    try {
      pred = getPredicate();
    } catch (e) {
      if (resultDiv) {
        resultDiv.textContent = 'Predicate error: ' + (e.message || String(e));
        resultDiv.className = 'truth-undefined';
      }
      return;
    }
    stopSearch();
    var myTok = ++searchToken;
    clearLog();
    resetMeters();
    setSearchRunning(true);
    if (resultDiv) {
      resultDiv.textContent = '';
      resultDiv.className = '';
    }

    var n = 0;
    var steps = 0;

    function oneStep() {
      if (myTok !== searchToken) return;
      steps++;
      if (checkF) checkF.textContent = 'Checking: n = ' + n;
      if (depthF) depthF.textContent = 'step ' + steps + ' (n = ' + n + ')';
      var delay = getStepDelayMs();

      function applyResult() {
        if (myTok !== searchToken) return;
        if (steps > FLOOP_DANGER_AFTER && meterF) {
          meterF.classList.add('is-danger-zone');
        }
        var pct = Math.min(96, (steps / FLOOP_CAP) * 92);
        setFill(fillF, meterF, pct, false, steps > FLOOP_DANGER_AFTER);

        try {
          if (pred(n)) {
            appendLog('Checking n = ' + n + ' … P(' + n + ') = TRUE ✓ Found!');
            setFill(fillF, meterF, Math.max(pct, 25), true, false);
            if (meterF) meterF.classList.remove('is-danger-zone');
            if (resultDiv) {
              resultDiv.textContent = 'FlooP: found smallest n = ' + n + '.';
              resultDiv.className = 'truth-true';
            }
            setSearchRunning(false);
            return;
          }
          appendLog('Checking n = ' + n + ' … P(' + n + ') = false');
        } catch (err) {
          appendLog('Error at n = ' + n + ': ' + err.message);
          if (resultDiv) {
            resultDiv.textContent = 'Error at n=' + n + ': ' + err.message;
            resultDiv.className = 'truth-undefined';
          }
          setSearchRunning(false);
          return;
        }

        if (steps >= FLOOP_CAP) {
          appendLog('Demo capped — real FlooP would run forever');
          setFill(fillF, meterF, 98, false, true);
          if (depthF) depthF.textContent = 'demo cap (' + FLOOP_CAP + ' steps)';
          if (resultDiv) {
            resultDiv.textContent = 'FlooP demo: capped at ' + FLOOP_CAP + ' steps. If no n satisfies P(n), real FlooP never halts.';
            resultDiv.className = 'truth-undefined';
          }
          setSearchRunning(false);
          return;
        }

        if (steps > FLOOP_DANGER_AFTER) {
          appendLog('Still searching… n = ' + n);
        }

        n++;
        if (delay <= 0) {
          oneStep();
        } else {
          schedule(oneStep, delay);
        }
      }

      if (delay <= 0) {
        applyResult();
      } else {
        schedule(applyResult, delay);
      }
    }

    if (getStepDelayMs() <= 0) {
      var checks;
      for (checks = 0; checks < FLOOP_CAP && myTok === searchToken; checks++) {
        if (checkF) checkF.textContent = 'Checking: n = ' + n;
        if (depthF) depthF.textContent = 'step ' + (checks + 1) + ' (n = ' + n + ')';
        var stepNum = checks + 1;
        if (stepNum > FLOOP_DANGER_AFTER && meterF) meterF.classList.add('is-danger-zone');
        var pct0 = Math.min(96, (stepNum / FLOOP_CAP) * 92);
        setFill(fillF, meterF, pct0, false, stepNum > FLOOP_DANGER_AFTER);
        try {
          if (pred(n)) {
            appendLog('Checking n = ' + n + ' … P(' + n + ') = TRUE ✓ Found!');
            setFill(fillF, meterF, Math.max(pct0, 25), true, false);
            if (meterF) meterF.classList.remove('is-danger-zone');
            if (resultDiv) {
              resultDiv.textContent = 'FlooP: found smallest n = ' + n + '.';
              resultDiv.className = 'truth-true';
            }
            setSearchRunning(false);
            return;
          }
          appendLog('Checking n = ' + n + ' … P(' + n + ') = false');
        } catch (err) {
          appendLog('Error at n = ' + n + ': ' + err.message);
          if (resultDiv) {
            resultDiv.textContent = 'Error at n=' + n + ': ' + err.message;
            resultDiv.className = 'truth-undefined';
          }
          setSearchRunning(false);
          return;
        }
        if (stepNum > FLOOP_DANGER_AFTER) {
          appendLog('Still searching… n = ' + n);
        }
        n++;
      }
      if (myTok !== searchToken) return;
      appendLog('Demo capped — real FlooP would run forever');
      setFill(fillF, meterF, 98, false, true);
      if (depthF) depthF.textContent = 'demo cap (' + FLOOP_CAP + ' steps)';
      if (resultDiv) {
        resultDiv.textContent = 'FlooP demo: capped at ' + FLOOP_CAP + ' steps. If no n satisfies P(n), real FlooP never halts.';
        resultDiv.className = 'truth-undefined';
      }
      setSearchRunning(false);
      return;
    }
    oneStep();
  }

  if (runBloopBtn) runBloopBtn.addEventListener('click', runBlooP);
  if (runFloopBtn) runFloopBtn.addEventListener('click', runFlooP);
  if (stopBtn) stopBtn.addEventListener('click', stopSearch);

  document.querySelectorAll('input[name="ch13-src"]').forEach(function (r) {
    r.addEventListener('change', function () {
      var custom = r.value === 'custom';
      var pw = document.getElementById('ch13-preset-wrap');
      var cw = document.getElementById('ch13-custom-wrap');
      if (pw) pw.style.display = custom ? 'none' : 'block';
      if (cw) cw.style.display = custom ? 'block' : 'none';
    });
  });

  document.querySelectorAll('.ch13-predicate-chip').forEach(function (chip) {
    chip.addEventListener('click', function () {
      var expr = chip.getAttribute('data-expr');
      var inp = document.getElementById('ch13-predicate');
      var customRadio = document.querySelector('input[name="ch13-src"][value="custom"]');
      if (customRadio) {
        customRadio.checked = true;
        customRadio.dispatchEvent(new Event('change', { bubbles: true }));
      }
      if (inp && expr != null) inp.value = expr;
    });
  });

  /* ——— Gödel step reveal ——— */
  var godelIndex = 1;
  var godelNextBtn = document.getElementById('ch13-godel-next');
  var godelPanel = document.getElementById('ch13-godel-panel');
  var godelFinal = document.getElementById('ch13-godel-final');

  function revealGodelStep(num) {
    var el = document.querySelector('.ch13-godel-step[data-step="' + num + '"]');
    if (!el) return;
    el.classList.add('ch13-godel-revealed');
    if (num === 3 && meterF) {
      meterF.classList.add('ch13-meter-flash-gold');
      setTimeout(function () { meterF.classList.remove('ch13-meter-flash-gold'); }, 900);
    }
    if (num === 5) {
      if (godelPanel) godelPanel.classList.add('ch13-godel-panel-glow');
      if (godelFinal) godelFinal.classList.add('ch13-godel-final-visible');
    }
  }

  if (godelNextBtn) {
    godelNextBtn.addEventListener('click', function () {
      if (godelIndex >= 5) {
        godelIndex = 1;
        document.querySelectorAll('.ch13-godel-step').forEach(function (el) {
          el.classList.remove('ch13-godel-revealed');
        });
        if (godelPanel) godelPanel.classList.remove('ch13-godel-panel-glow');
        if (godelFinal) {
          godelFinal.classList.remove('ch13-godel-final-visible');
        }
        revealGodelStep(1);
        godelNextBtn.textContent = 'Next →';
        return;
      }
      godelIndex++;
      revealGodelStep(godelIndex);
      if (godelIndex >= 5) {
        godelNextBtn.textContent = 'Start over';
      }
    });
  }

  /* ——— Halting oracle ——— */
  var oraclePhase = 1;
  var oracleClicked = {};
  var oracleClickCount = 0;
  var destroyerCard = document.getElementById('ch13-destroyer-card');
  var oracleDisplay = document.getElementById('ch13-oracle-display');
  var oracleCaption = document.getElementById('ch13-oracle-caption');
  var oracleSub = document.getElementById('ch13-oracle-sub');
  var destroyerRun = document.getElementById('ch13-destroyer-run');

  function setOracleText(html, className) {
    if (!oracleDisplay) return;
    oracleDisplay.innerHTML = html;
    oracleDisplay.className = 'ch13-oracle-display' + (className ? ' ' + className : '');
  }

  function maybeShowDestroyer() {
    if (oraclePhase !== 1 || !destroyerCard) return;
    if (oracleClickCount >= 2) {
      oraclePhase = 2;
      destroyerCard.hidden = false;
      destroyerCard.classList.add('ch13-destroyer-appear');
    }
  }

  document.querySelectorAll('.ch13-halt-card[data-oracle]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var k = btn.getAttribute('data-oracle');
      if (oraclePhase >= 3) return;
      if (k === 'destroyer') return;
      if (!oracleClicked[k]) {
        oracleClicked[k] = true;
        oracleClickCount++;
      }
      var verdict = btn.getAttribute('data-verdict');
      var label = verdict === 'forever' ? 'RUNS FOREVER ✓' : 'HALTS ✓';
      setOracleText(label, 'is-ok');
      btn.classList.add('ch13-halt-done');
      if (oracleCaption) {
        oracleCaption.textContent = 'So far so good. The oracle seems to work.';
      }
      if (oracleSub) oracleSub.textContent = '';
      maybeShowDestroyer();
    });
  });

  function runDestroyerSequence() {
    if (oraclePhase >= 3) return;
    oraclePhase = 3;
    if (destroyerRun) destroyerRun.disabled = true;
    setOracleText(
      '<span class="ch13-oracle-spinner" aria-hidden="true"></span> Thinking…',
      'is-thinking'
    );
    if (oracleCaption) oracleCaption.textContent = '';
    if (oracleSub) oracleSub.textContent = '';

    var flickerStart = 1500;

    schedule(function () {
      var phase = 'A';
      var interval = 420;
      var swaps = 0;
      var maxSwaps = 14;

      function flickerTick() {
        phase = phase === 'A' ? 'B' : 'A';
        setOracleText(
          phase === 'A' ? 'HALTS' : 'RUNS FOREVER',
          'is-flicker'
        );
        swaps++;
        interval = Math.max(45, interval * 0.72);
        if (swaps < maxSwaps) {
          schedule(flickerTick, interval);
        } else {
          setOracleText('ERROR: CANNOT DETERMINE', 'is-error');
          if (oracleCaption) {
            oracleCaption.textContent =
              'If the Oracle says HALTS, the Destroyer runs forever — making the Oracle wrong. If it says RUNS FOREVER, the Destroyer halts — making the Oracle wrong. No Oracle can exist. The halting problem is undecidable.';
          }
          schedule(function () {
            if (oracleSub) {
              oracleSub.textContent =
                'This is not a limitation of technology. It is a mathematical proof. No program — no matter how sophisticated — can decide halting in general.';
              oracleSub.classList.add('ch13-oracle-sub-visible');
            }
          }, 400);
        }
      }
      schedule(flickerTick, 0);
    }, flickerStart);
  }

  if (destroyerRun) {
    destroyerRun.addEventListener('click', runDestroyerSequence);
  }

  if (speedSlider) {
    speedSlider.value = String(DEFAULT_SLIDER);
  }
  function syncLidLabel() {
    if (!boundInput || !lidLabelB) return;
    var n0 = Math.min(200, Math.max(1, parseInt(boundInput.value, 10) || 10));
    lidLabelB.textContent = 'LID = ' + n0;
  }
  syncLidLabel();
  if (boundInput) boundInput.addEventListener('change', syncLidLabel);
  if (boundInput) boundInput.addEventListener('input', syncLidLabel);
})();
