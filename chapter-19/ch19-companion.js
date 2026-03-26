/**
 * Chapter XIX companion: frames, competition, limits.
 */
'use strict';

(function () {
  var F = window.GEBCh19Frames;
  if (!F) return;

  var SLOT_ORDER = {
    birthday: ['who', 'when', 'where', 'age', 'cake', 'presents', 'catering', 'partyGames'],
    restaurant: ['host', 'time', 'occasion', 'dressCode', 'menu', 'bill', 'tip', 'reservation'],
    doctor: ['patient', 'appointmentType', 'waitTime', 'paperwork', 'prescription', 'followUp'],
    job: ['candidate', 'format', 'duration', 'dressCode', 'thankYou']
  };
  var SLOT_CHIPS = {
    birthday: {
      where: ['park', 'restaurant'],
      age: ['8', '25']
    },
    restaurant: {
      time: ['lunch', 'dinner'],
      occasion: ['anniversary']
    }
  };

  var SLOT_HINTS = {
    who: 'birthday person',
    when: 'date / time',
    where: 'location (try “park” or “restaurant”)',
    age: "guest of honor's age",
    cake: 'yes / no / leave blank',
    presents: 'expected gifts',
    catering: 'outside food',
    partyGames: 'activities for kids',
    host: 'who invited you',
    time: 'lunch or dinner',
    occasion: 'e.g. anniversary',
    dressCode: 'updates with occasion',
    dressCodeJob: 'business professional default',
    menu: 'how menu is presented',
    bill: 'who pays',
    tip: 'gratuity norm',
    reservation: 'booking expectation',
    patient: 'who is seen',
    appointmentType: 'visit type',
    waitTime: 'typical delay',
    paperwork: 'forms',
    prescription: 'meds outcome',
    followUp: 'next steps',
    candidate: 'interviewee',
    format: 'in-person vs remote',
    duration: 'length',
    thankYou: 'after interview'
  };

  var SLOT_TITLES = {
    birthday: {
      who: 'Who',
      when: 'When',
      where: 'Where',
      age: 'Age',
      cake: 'Cake?',
      presents: 'Presents?',
      catering: 'Catering?',
      partyGames: 'Party games?'
    },
    restaurant: {
      host: 'Host',
      time: 'Time',
      occasion: 'Occasion',
      dressCode: 'Dress code',
      menu: 'Menu',
      bill: 'Bill',
      tip: 'Tip',
      reservation: 'Reservation'
    },
    doctor: {
      patient: 'Patient',
      appointmentType: 'Appointment type',
      waitTime: 'Wait time',
      paperwork: 'Paperwork',
      prescription: 'Prescription',
      followUp: 'Follow-up'
    },
    job: {
      candidate: 'Candidate',
      format: 'Format',
      duration: 'Duration',
      dressCode: 'Dress code',
      thankYou: 'Thank-you note'
    }
  };
  function narrativeFor(frameKey, values, defMap) {
    function get(id) {
      var v = values[id] && values[id].trim();
      return v ? v : (defMap[id] || '…');
    }
    if (frameKey === 'birthday') {
      return (
        'A birthday party for ' +
        get('who') +
        ', ' +
        get('when') +
        ', at ' +
        get('where') +
        '. Cake: ' +
        get('cake') +
        '. Presents: ' +
        get('presents') +
        '.'
      );
    }
    if (frameKey === 'restaurant') {
      var occ = values.occasion && values.occasion.trim();
      var occStr = occ ? 'a ' + occ + ' meal' : 'a meal';
      return (
        occStr +
        ' at ' +
        get('time') +
        '. Dress: ' +
        get('dressCode') +
        '. Bill: ' +
        get('bill') +
        '. Reservation: ' +
        get('reservation') +
        '.'
      );
    }
    if (frameKey === 'doctor') {
      return (
        'A ' +
        get('appointmentType') +
        ' for ' +
        get('patient') +
        '. Wait time: ' +
        get('waitTime') +
        '. Follow-up: ' +
        get('followUp') +
        '.'
      );
    }
    if (frameKey === 'job') {
      return (
        'An interview for ' +
        get('candidate') +
        ', ' +
        get('format') +
        ', lasting ' +
        get('duration') +
        '. Dress code: ' +
        get('dressCode') +
        '.'
      );
    }
    return '';
  }

  function hintFor(frame, sid) {
    if (frame === 'job' && sid === 'dressCode') return SLOT_HINTS.dressCodeJob || '';
    if (frame === 'restaurant' && sid === 'dressCode') return 'updates with occasion';
    return SLOT_HINTS[sid] || '';
  }

  var currentFrame = 'birthday';
  var state = {
    birthday: { values: {}, locks: {} },
    restaurant: { values: {}, locks: {} },
    doctor: { values: {}, locks: {} },
    job: { values: {}, locks: {} }
  };
  var prevDefaultStrings = {};

  var tabRoot = document.getElementById('ch19-frame-tabs');
  var slotPanel = document.getElementById('ch19-slot-panel');
  var btnInfer = document.getElementById('ch19-infer');
  var btnReset = document.getElementById('ch19-reset');
  var hasShownCascade = false;
  var s1Caption = document.querySelector('.ch19-s1-caption');

  function getSt() {
    return state[currentFrame];
  }

  function gatherValuesFromDom() {
    var st = getSt();
    if (!slotPanel) return st.values;
    slotPanel.querySelectorAll('.ch19-slot-row').forEach(function (row) {
      var id = row.getAttribute('data-slot');
      var inp = row.querySelector('.ch19-slot-input');
      if (inp) st.values[id] = inp.value;
    });
    return st.values;
  }

  function updateLocksFromDom() {
    var st = getSt();
    slotPanel.querySelectorAll('.ch19-slot-row').forEach(function (row) {
      var id = row.getAttribute('data-slot');
      var inp = row.querySelector('.ch19-slot-input');
      if (!inp) return;
      if (inp.value.trim()) st.locks[id] = true;
      else delete st.locks[id];
    });
  }

  function flashRow(row, on) {
    if (!row) return;
    row.classList.toggle('ch19-default-flash', !!on);
    if (on) {
      window.setTimeout(function () {
        row.classList.remove('ch19-default-flash');
      }, 1000);
    }
  }

  function recomputeUI() {
    gatherValuesFromDom();
    var vals = getSt().values;
    var locks = getSt().locks;
    var visible = F.listVisibleSlotIds(currentFrame, vals);
    var defMap = F.computeDefaultMap(currentFrame, vals);
    var tipEmph = currentFrame === 'restaurant' && F.restaurantTipEmphasized(vals);

    var nextPrev = {};
    SLOT_ORDER[currentFrame].forEach(function (sid) {
      var row = slotPanel && slotPanel.querySelector('.ch19-slot-row[data-slot="' + sid + '"]');
      if (!row) return;
      var show = visible.indexOf(sid) >= 0;
      var wasHidden = row.hidden;
      row.hidden = !show;
      if (wasHidden && show) {
        row.classList.add('ch19-slot-new');
        (function (rowEl) {
          window.setTimeout(function () {
            rowEl.classList.remove('ch19-slot-new');
          }, 500);
        })(row);
        if (s1Caption && sid === 'catering') {
          s1Caption.textContent = 'A park party changes things — catering becomes relevant.';
        } else if (s1Caption && sid === 'partyGames') {
          s1Caption.textContent =
            'Young guests change expectations — party games become the default.';
        }
      }
      if (!show) return;

      var badge = row.querySelector('.ch19-default-badge');
      var lockEl = row.querySelector('.ch19-lock');
      var inp = row.querySelector('.ch19-slot-input');
      var d = defMap[sid];
      var dText = d == null || d === '' ? '—' : d;
      if (badge) badge.textContent = 'default: ' + dText;

      var locked = !!locks[sid] && inp && inp.value.trim();
      if (lockEl) lockEl.hidden = !locked;

      row.classList.toggle('ch19-tip-emph', sid === 'tip' && tipEmph);

      var key = currentFrame + ':' + sid;
      var prev = prevDefaultStrings[key];
      if (
        prev !== undefined &&
        prev !== dText &&
        !locked &&
        (!inp || !inp.value.trim())
      ) {
        flashRow(row, true);
        if (badge) {
          badge.classList.add('ch19-badge-changed');
          (function (badgeEl) {
            window.setTimeout(function () {
              badgeEl.classList.remove('ch19-badge-changed');
            }, 1200);
          })(badge);
        }
        if (!hasShownCascade) {
          hasShownCascade = true;
          if (s1Caption) {
            s1Caption.textContent =
              "Notice: filling one slot changes what's inferred about others. Context doesn't just fill gaps — it reshapes the whole structure.";
          }
        }
      }
      nextPrev[key] = dText;
    });
    prevDefaultStrings = nextPrev;
    var narrativeEl = document.getElementById('ch19-frame-narrative');
    if (narrativeEl) {
      narrativeEl.textContent = narrativeFor(currentFrame, getSt().values, defMap);
    }
  }

  function buildSlotPanel() {
    if (!slotPanel) return;
    slotPanel.innerHTML = '';
    prevDefaultStrings = {};
    var titles = SLOT_TITLES[currentFrame];
    var order = SLOT_ORDER[currentFrame];
    var st = getSt();

    order.forEach(function (sid) {
      var chips = (SLOT_CHIPS[currentFrame] || {})[sid];
      var hintText = chips && chips.length ? '' : hintFor(currentFrame, sid);
      var row = document.createElement('div');
      row.className = 'ch19-slot-row';
      row.setAttribute('data-slot', sid);
      row.innerHTML =
        '<div class="ch19-slot-name">' +
        (titles[sid] || sid) +
        '</div>' +
        '<div class="ch19-slot-field-wrap">' +
        '<span class="ch19-slot-hint">' +
        hintText +
        '</span>' +
        '<input type="text" class="ch19-slot-input frame-input" autocomplete="off" aria-label="' +
        (titles[sid] || sid) +
        '" />' +
        '</div>' +
        '<span class="ch19-default-badge"></span>' +
        '<span class="ch19-lock" hidden title="Manually filled" aria-label="Locked">🔒</span>';
      var inp = row.querySelector('.ch19-slot-input');
      var fieldWrap = row.querySelector('.ch19-slot-field-wrap');
      if (inp) {
        inp.value = st.values[sid] || '';
        inp.addEventListener('input', function () {
          inp.classList.remove('ch19-inferred');
          updateLocksFromDom();
          recomputeUI();
        });
      }
      if (chips && chips.length && fieldWrap) {
        var chipWrap = document.createElement('div');
        chipWrap.className = 'ch19-slot-chips';
        chips.forEach(function (val) {
          var chip = document.createElement('button');
          chip.type = 'button';
          chip.className = 'ch19-chip';
          chip.textContent = 'Try: "' + val + '"';
          chip.setAttribute('data-fill', val);
          chip.addEventListener('click', function () {
            if (inp) {
              inp.value = val;
              inp.dispatchEvent(new Event('input'));
            }
          });
          chipWrap.appendChild(chip);
        });
        fieldWrap.appendChild(chipWrap);
      }
      slotPanel.appendChild(row);
    });
    recomputeUI();
  }

  function setActiveTab(key) {
    currentFrame = key;
    hasShownCascade = false;
    if (s1Caption) {
      s1Caption.textContent = 'Try typing "park" in the Where slot, or enter an age under 12. Watch what changes.';
    }
    if (tabRoot) {
      tabRoot.querySelectorAll('.ch19-frame-tab').forEach(function (b) {
        var on = b.getAttribute('data-frame') === key;
        b.classList.toggle('ch19-frame-tab-active', on);
        b.setAttribute('aria-selected', on ? 'true' : 'false');
      });
    }
    buildSlotPanel();
  }

  if (tabRoot) {
    tabRoot.querySelectorAll('.ch19-frame-tab').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var k = btn.getAttribute('data-frame');
        if (k) setActiveTab(k);
      });
    });
  }

  if (btnInfer) {
    btnInfer.addEventListener('click', function () {
      gatherValuesFromDom();
      var vals = getSt().values;
      var locks = getSt().locks;
      var visible = F.listVisibleSlotIds(currentFrame, vals);
      var defMap = F.computeDefaultMap(currentFrame, vals);
      slotPanel.querySelectorAll('.ch19-slot-row').forEach(function (row) {
        var sid = row.getAttribute('data-slot');
        if (visible.indexOf(sid) < 0) return;
        var inp = row.querySelector('.ch19-slot-input');
        if (!inp || inp.value.trim() || locks[sid]) return;
        var d = defMap[sid];
        if (d != null && d !== '') {
          inp.value = d;
          inp.classList.add('ch19-inferred');
          delete getSt().locks[sid];
        }
      });
      recomputeUI();
    });
  }

  if (btnReset) {
    btnReset.addEventListener('click', function () {
      state[currentFrame] = { values: {}, locks: {} };
      buildSlotPanel();
    });
  }

  setActiveTab('birthday');

  /* —— Section 2: frame competition —— */
  var compSentence = document.getElementById('ch19-comp-sentence');
  var panelMed = document.getElementById('ch19-comp-panel-med');
  var panelBall = document.getElementById('ch19-comp-panel-ball');
  var panelThird = document.getElementById('ch19-comp-panel-third');
  var compMid = document.getElementById('ch19-comp-mid');
  var compStatus = document.getElementById('ch19-comp-status');
  var compCaption = document.getElementById('ch19-comp-caption');
  var compSummary = document.getElementById('ch19-comp-summary');
  var compShotCtx = document.getElementById('ch19-comp-contexts-shot');
  var contextClickCount = 0;

  function clearCompClasses() {
    [panelMed, panelBall, panelThird].forEach(function (p) {
      if (!p) return;
      p.classList.remove(
        'ch19-comp-win',
        'ch19-comp-lose',
        'ch19-comp-both',
        'ch19-comp-pulse'
      );
    });
    if (compMid) compMid.classList.remove('ch19-comp-pulse-mid');
  }

  function setCompetitionState() {
    clearCompClasses();
    if (panelMed) {
      panelMed.classList.add('ch19-comp-both', 'ch19-comp-pulse');
    }
    if (panelBall) panelBall.classList.add('ch19-comp-both', 'ch19-comp-pulse');
    if (panelThird) {
      panelThird.hidden = true;
      panelThird.innerHTML = '';
    }
    if (compMid) {
      compMid.hidden = false;
      compMid.classList.add('ch19-comp-pulse-mid');
      compMid.textContent = 'Competition';
    }
    if (compStatus) compStatus.textContent = '';
    if (compCaption) {
      compCaption.textContent =
        'Both frames are partially activated. Choose a context to see which wins.';
    }
  }

  function showShotSentence() {
    contextClickCount = 0;
    if (compSummary) compSummary.hidden = true;
    if (compSentence) compSentence.textContent = '“She gave him a shot.”';
    if (compShotCtx) compShotCtx.hidden = false;
    if (panelMed) panelMed.hidden = false;
    if (panelBall) panelBall.hidden = false;
    setCompetitionState();
  }

  function resolveShot(ctx) {
    document.querySelectorAll('.ch19-comp-highlight').forEach(function (el) {
      el.classList.remove('ch19-comp-highlight');
    });
    clearCompClasses();
    if (panelThird) {
      panelThird.hidden = true;
      panelThird.innerHTML = '';
    }
    if (compMid) {
      compMid.classList.remove('ch19-comp-pulse-mid');
      compMid.textContent = '';
    }

    if (ctx === 'hospital') {
      if (panelMed) {
        panelMed.classList.add('ch19-comp-win');
        panelMed.classList.remove('ch19-comp-lose');
      }
      if (panelBall) panelBall.classList.add('ch19-comp-lose');
      if (compStatus) {
        compStatus.innerHTML =
          '<strong>Medical encounter</strong> activated. <strong>Basketball game</strong> suppressed.';
      }
      if (compCaption) {
        compCaption.textContent =
          'Hospital context confirms location: clinic / hospital — the medical frame wins.';
      }
      var loc = panelMed && panelMed.querySelector('[data-slot-line="location"]');
      if (loc) loc.classList.add('ch19-comp-highlight');
    } else if (ctx === 'freethrow') {
      if (panelBall) panelBall.classList.add('ch19-comp-win');
      if (panelMed) panelMed.classList.add('ch19-comp-lose');
      if (compStatus) {
        compStatus.innerHTML =
          '<strong>Basketball game</strong> activated. <strong>Medical encounter</strong> suppressed.';
      }
      if (compCaption) {
        compCaption.textContent =
          'The free-throw line belongs on the court — sports frame takes the sentence.';
      }
    } else if (ctx === 'espresso') {
      if (panelMed) panelMed.classList.add('ch19-comp-lose');
      if (panelBall) panelBall.classList.add('ch19-comp-lose');
      if (panelThird) {
        panelThird.hidden = false;
        panelThird.className = 'ch19-comp-panel ch19-comp-third';
        panelThird.innerHTML =
          '<strong>Frame: CAFÉ / BEVERAGE</strong><ul class="ch19-comp-slots">' +
          '<li>shot: espresso</li><li>instrument: demitasse / machine</li><li>location: café</li><li>purpose: caffeine / ritual</li></ul>';
        panelThird.classList.add('ch19-comp-win');
      }
      if (compStatus) {
        compStatus.innerHTML =
          '<strong>Café frame</strong> activated. Neither medical nor sports fit “of espresso.”';
      }
      if (compCaption) {
        compCaption.textContent =
          'Context did not just resolve the competition — it introduced a frame neither rival was anticipating.';
      }
    } else if (ctx === 'confidence') {
      if (panelMed) panelMed.classList.add('ch19-comp-lose');
      if (panelBall) panelBall.classList.add('ch19-comp-lose');
      if (panelThird) {
        panelThird.hidden = false;
        panelThird.className = 'ch19-comp-panel ch19-comp-third';
        panelThird.innerHTML =
          '<strong>Frame: PSYCHOLOGICAL / ABSTRACT</strong><ul class="ch19-comp-slots">' +
          '<li>shot: burst of confidence / encouragement</li><li>metaphorical extension</li><li>agent & recipient: social / emotional</li></ul>';
        panelThird.classList.add('ch19-comp-win');
      }
      if (compStatus) {
        compStatus.innerHTML =
          '<strong>Psychological frame</strong> activated. Literal medical and sports frames fall away.';
      }
      if (compCaption) {
        compCaption.textContent =
          'Metaphorical extension — frames handling language they were not built for.';
      }
    }

    contextClickCount++;
    if (compSummary && contextClickCount >= 2) {
      compSummary.hidden = false;
    }
  }

  if (compShotCtx) {
    compShotCtx.querySelectorAll('button[data-ctx]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        resolveShot(btn.getAttribute('data-ctx'));
      });
    });
  }
  showShotSentence();

  /* —— Section 3: limits —— */
  var lim1 = document.getElementById('ch19-lim-1');
  var lim2 = document.getElementById('ch19-lim-2');
  var lim3 = document.getElementById('ch19-lim-3');
  var lim1Anim = document.getElementById('ch19-lim-1-anim');
  var lim2Anim = document.getElementById('ch19-lim-2-anim');
  var lim3Anim = document.getElementById('ch19-lim-3-anim');

  function runLim1() {
    if (!lim1Anim || lim1Anim.dataset.started === '1') return;
    lim1Anim.dataset.started = '1';
    var lines = [
      { t: 'menu', x: 'prime numbers — no default applies' },
      { t: 'seating', x: 'questions — no category match' },
      { t: 'waiter', x: 'fog — entity type unknown' }
    ];
    var note1 = document.getElementById('ch19-lim-1-note');
    lim1Anim.innerHTML = '';
    var i = 0;
    function step() {
      if (i >= lines.length) {
        lim1Anim.innerHTML +=
          '<p class="ch19-lim-stall">Restaurant frame activation: <strong>~30%</strong> — stalled.</p>';
        if (note1) note1.style.display = 'block';
        return;
      }
      var row = document.createElement('div');
      row.className = 'ch19-lim-fail-row';
      row.innerHTML =
        '<span class="ch19-lim-slot">' +
        lines[i].t +
        '</span> <span class="ch19-lim-x">✗</span> <span class="ch19-lim-msg">' +
        lines[i].x +
        '</span>';
      lim1Anim.appendChild(row);
      i++;
      window.setTimeout(step, 700);
    }
    step();
  }

  function runLim2() {
    if (!lim2Anim || lim2Anim.dataset.started === '1') return;
    lim2Anim.dataset.started = '1';
    lim2Anim.innerHTML =
      '<div class="ch19-self-slot">Slot: <em>what slot should this slot describe?</em></div>' +
      '<div class="ch19-lim-spin" id="ch19-lim-spin">inferring…</div>';
    var spin = document.getElementById('ch19-lim-spin');
    var note2 = document.getElementById('ch19-lim-2-note');
    window.setTimeout(function () {
      if (spin) {
        spin.className = 'ch19-lim-infinity';
        spin.innerHTML = '∞ — infinite regress detected';
      }
      lim2Anim.classList.add('ch19-lim-glitch');
      if (note2) note2.style.display = 'block';
      window.setTimeout(function () {
        lim2Anim.classList.remove('ch19-lim-glitch');
      }, 1200);
    }, 2200);
  }

  function runLim3() {
    if (!lim3Anim || lim3Anim.dataset.started === '1') return;
    lim3Anim.dataset.started = '1';
    lim3Anim.innerHTML =
      '<div class="ch19-lim-search">Searching frames: EMOTION… COLOR… CALENDAR…</div>';
    window.setTimeout(function () {
      var d = document.createElement('div');
      d.className = 'ch19-lim-search-fail';
      d.innerHTML = 'No single frame matches <em>“a blue kind of Tuesday.”</em>';
      lim3Anim.appendChild(d);
    }, 1500);
    var note3 = document.getElementById('ch19-lim-3-note');
    window.setTimeout(function () {
      var b = document.createElement('div');
      b.className = 'ch19-lim-blend';
      b.innerHTML =
        '<span class="ch19-blend-a">mood</span> + <span class="ch19-blend-b">hue</span> + <span class="ch19-blend-c">weekday</span> → <strong>ad hoc blend</strong>';
      lim3Anim.appendChild(b);
      if (note3) note3.style.display = 'block';
    }, 2800);
  }

  function keyActivate(e, fn) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      fn();
    }
  }
  if (lim1) {
    lim1.addEventListener('click', runLim1);
    lim1.addEventListener('keydown', function (e) {
      keyActivate(e, runLim1);
    });
  }
  if (lim2) {
    lim2.addEventListener('click', runLim2);
    lim2.addEventListener('keydown', function (e) {
      keyActivate(e, runLim2);
    });
  }
  if (lim3) {
    lim3.addEventListener('click', runLim3);
    lim3.addEventListener('keydown', function (e) {
      keyActivate(e, runLim3);
    });
  }
})();
