/**
 * Chapter XVIII companion: frame problem, expert-system brittleness, AI timeline.
 */
'use strict';

(function () {
  /* —— Section 1: Frame problem —— */
  var cup = document.getElementById('ch18-cup');
  var btnMove = document.getElementById('ch18-btn-move-cup');
  var frameQuestions = document.getElementById('ch18-frame-questions');
  var frameAfterQs = document.getElementById('ch18-frame-after-qs');
  var btnComplicate = document.getElementById('ch18-btn-complicate');
  var complicateN = 0;
  var ruleCountEl = document.getElementById('ch18-rule-count');
  var ruleCountWrap = document.getElementById('ch18-rule-count-wrap');
  var btnKeepGoing = document.getElementById('ch18-btn-keep-going');
  var keepGoingPanel = document.getElementById('ch18-keep-going-panel');
  var roomWrap = document.getElementById('ch18-room-wrap');

  var RULE_TOTALS = [5, 8, 11, 14];

  if (btnMove) {
    btnMove.addEventListener('click', function () {
      btnMove.disabled = true;
      if (cup) cup.classList.add('ch18-cup-on-floor');
      window.setTimeout(function () {
        if (frameQuestions) frameQuestions.hidden = false;
        runQuestionCascade();
      }, 820);
    });
  }

  function runQuestionCascade() {
    var items = [
      { q: 'Is the cup on the table?', a: 'NO', cls: 'ch18-ans-no' },
      { q: 'Is the book still on the table?', a: 'YES', cls: 'ch18-ans-yes' },
      { q: 'Is the lamp still on the floor?', a: 'YES', cls: 'ch18-ans-yes' },
      { q: 'Is the window still in the wall?', a: 'YES', cls: 'ch18-ans-yes' },
      { q: 'Is the robot still in the room?', a: 'YES', cls: 'ch18-ans-yes' }
    ];
    var i = 0;
    function next() {
      if (i >= items.length) {
        if (frameAfterQs) frameAfterQs.hidden = false;
        return;
      }
      var row = document.createElement('div');
      row.className = 'ch18-q-row';
      row.innerHTML =
        '<span class="ch18-q-text">' +
        items[i].q +
        '</span>' +
        '<span class="ch18-q-ans ' +
        items[i].cls +
        '">' +
        items[i].a +
        '</span>';
      frameQuestions.appendChild(row);
      i++;
      window.setTimeout(next, 650);
    }
    next();
  }

  if (btnComplicate) {
    btnComplicate.addEventListener('click', function () {
      if (complicateN >= 4) return;
      complicateN++;
      var block = document.getElementById('ch18-complicate-' + complicateN);
      if (block) block.hidden = false;
      if (roomWrap) roomWrap.classList.add('ch18-complicate-' + complicateN);
      if (ruleCountEl && ruleCountWrap) {
        ruleCountEl.textContent = String(RULE_TOTALS[complicateN - 1]);
        ruleCountWrap.hidden = false;
        ruleCountEl.className = 'ch18-rule-num ch18-rule-n' + complicateN;
      }
      if (complicateN >= 4) {
        btnComplicate.disabled = true;
        if (btnKeepGoing) btnKeepGoing.hidden = false;
      }
    });
  }

  if (btnKeepGoing) {
    btnKeepGoing.addEventListener('click', function () {
      btnKeepGoing.disabled = true;
      if (keepGoingPanel) keepGoingPanel.hidden = false;
    });
  }

  /* —— Section 2: Expert system —— */
  var termBody = document.getElementById('ch18-term-body');
  var termPreset = document.getElementById('ch18-term-preset');
  var expertState = 'idle';

  function clearTerm() {
    if (termBody) termBody.innerHTML = '';
  }

  function termPrint(html) {
    if (!termBody) return;
    var d = document.createElement('div');
    d.className = 'ch18-term-line';
    d.innerHTML = html;
    termBody.appendChild(d);
    termBody.scrollTop = termBody.scrollHeight;
  }

  function resetExpertChrome() {
    var note = document.getElementById('ch18-rabies-note');
    if (note) note.hidden = true;
    var ok = document.getElementById('ch18-lyme-ok');
    if (ok) ok.hidden = true;
  }

  function startLyme() {
    resetExpertChrome();
    clearTerm();
    expertState = 'lyme';
    if (termPreset) termPreset.textContent =
      'Patient presents with fever, fatigue, and a rash on the torso. No recent travel. No known allergies.';
    termPrint('&gt; <strong>MED-DIAG v2.1</strong> — session start');
    termPrint('&gt; Loading rule base… OK');
    termPrint('');
    termPrint('Q1: Is body temperature above 38°C?');
    addYn('lyme1');
  }

  function startRabies() {
    resetExpertChrome();
    clearTerm();
    expertState = 'rabies';
    if (termPreset) termPreset.textContent =
      'Patient presents with difficulty breathing, confusion, and a fear of water.';
    termPrint('&gt; <strong>MED-DIAG v2.1</strong> — session start');
    termPrint('&gt; Loading rule base… OK');
    termPrint('');
    termPrint('Q1: Is body temperature above 38°C?');
    addYn('rabies1');
  }

  function addYn(step) {
    var wrap = document.createElement('div');
    wrap.className = 'ch18-term-yn';
    wrap.innerHTML =
      '<button type="button" class="btn ch18-btn-yes" data-step="' +
      step +
      '" data-val="yes">YES</button> ' +
      '<button type="button" class="btn ch18-btn-no" data-step="' +
      step +
      '" data-val="no">NO</button>';
    termBody.appendChild(wrap);
    wrap.querySelectorAll('button').forEach(function (b) {
      b.addEventListener('click', onExpertAnswer);
    });
    termBody.scrollTop = termBody.scrollHeight;
  }

  function removeYn() {
    var y = termBody && termBody.querySelector('.ch18-term-yn');
    if (y) y.remove();
  }

  function onExpertAnswer(e) {
    var step = e.target.getAttribute('data-step');
    var val = e.target.getAttribute('data-val');
    removeYn();
    termPrint('… ' + (val === 'yes' ? 'YES' : 'NO'));

    if (step === 'lyme1') {
      termPrint('');
      termPrint('Q2: Is the rash ring-shaped (or bull’s-eye)?');
      addYn('lyme2');
    } else if (step === 'lyme2') {
      termPrint('');
      termPrint('Q3: Was the patient recently in wooded or grassy areas?');
      addYn('lyme3');
    } else if (step === 'lyme3') {
      if (val === 'yes') {
        termPrint('');
        termPrint(
          '<span class="ch18-term-catch">⚠ CONFLICT:</span> Case notes record <em>no recent travel</em>. Tick exposure is inconsistent. Rule: flag for clinician review.'
        );
        termPrint('');
        termPrint(
          '<button type="button" class="btn btn-secondary ch18-override" id="ch18-lyme-override">Continue with documented exposure anyway →</button>'
        );
        var ov = document.getElementById('ch18-lyme-override');
        if (ov) {
          ov.addEventListener('click', function () {
            ov.remove();
            termPrint('… Override logged. Applying Lyme rule chain.');
            finishLyme();
          });
        }
      } else {
        termPrint('');
        termPrint('(Path without exposure — demo skips to alternate branch.)');
        termPrint('');
        finishLyme();
      }
    } else if (step === 'rabies1') {
      termPrint('');
      termPrint('Q2: Is the rash ring-shaped (or bull’s-eye)?');
      addYn('rabies2');
    } else if (step === 'rabies2') {
      termPrint('');
      termPrint('Q3: Has the patient been in wooded or grassy areas?');
      addYn('rabies3');
    } else if (step === 'rabies3') {
      termPrint('');
      termPrint('<span class="ch18-term-fail">Condition does not match known profiles. Unable to diagnose.</span>');
      var note = document.getElementById('ch18-rabies-note');
      if (note) note.hidden = false;
    }
  }

  function finishLyme() {
    termPrint('');
    termPrint(
      '<div class="ch18-diagnosis"><strong>DIAGNOSIS:</strong> Probable Lyme disease.<br>Recommend blood test and antibiotic course.</div>'
    );
    var ok = document.getElementById('ch18-lyme-ok');
    if (ok) ok.hidden = false;
  }

  var sl = document.getElementById('ch18-start-lyme');
  var sr = document.getElementById('ch18-start-rabies');
  if (sl) sl.addEventListener('click', startLyme);
  if (sr) sr.addEventListener('click', startRabies);

  var slider = document.getElementById('ch18-domain-slider');
  var sliderOut = document.getElementById('ch18-slider-readout');
  var SLIDER_TEXT = [
    '<strong>Narrow domain:</strong> system answers ~9/10 in-domain questions correctly, with high confidence.',
    '<strong>Medium domain:</strong> ~6/10 correct as rules overlap; confidence drops; contradictions multiply.',
    '<strong>General intelligence:</strong> ~3/10 — no better than chance on open-world questions.'
  ];
  if (slider && sliderOut) {
    function syncSlider() {
      var v = parseInt(slider.value, 10);
      sliderOut.innerHTML = SLIDER_TEXT[v];
    }
    slider.addEventListener('input', syncSlider);
    syncSlider();
  }

  /* —— Section 3: Timeline (accordion) —— */
  function openTimelineCard(card) {
    var id = card.getAttribute('data-expand');
    var panel = id ? document.getElementById(id) : null;
    document.querySelectorAll('.ch18-tl-card').forEach(function (c) {
      c.classList.remove('ch18-tl-open');
    });
    document.querySelectorAll('.ch18-tl-expand').forEach(function (p) {
      p.hidden = true;
    });
    if (panel) {
      card.classList.add('ch18-tl-open');
      panel.hidden = false;
    }
  }

  document.querySelectorAll('.ch18-tl-card').forEach(function (card) {
    card.addEventListener('click', function () {
      if (card.classList.contains('ch18-tl-open')) {
        card.classList.remove('ch18-tl-open');
        var id = card.getAttribute('data-expand');
        var p = id ? document.getElementById(id) : null;
        if (p) p.hidden = true;
      } else {
        openTimelineCard(card);
      }
    });
    card.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.click();
      }
    });
  });
})();
