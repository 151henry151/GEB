/**
 * Chapter 15 companion: inside/outside, infinite tower, Lucas trap.
 */
'use strict';

(function () {
  var S1 = {
    cam: document.getElementById('ch15-s1-camera'),
    stage: document.getElementById('ch15-s1-stage'),
    btnEnter: document.getElementById('ch15-enter-btn'),
    btnJump: document.getElementById('ch15-jump-btn'),
    cap: document.getElementById('ch15-s1-caption'),
    callouts: document.getElementById('ch15-s1-callouts'),
    proofCount: document.getElementById('ch15-proof-count'),
    proofList: document.getElementById('ch15-proof-list'),
    step: 0
  };

  var proofTimer = null;
  var proofN = 1247;

  var NAMES = ['TNT', 'TNT+G', 'TNT+G+G′', 'TNT+G+G′+G″', 'TNT+G+G′+G″+G‴'];

  function markSectionDone(which) {
    document.getElementById('ch15-root').setAttribute('data-done-' + which, '1');
    tryCapstone();
  }

  function tryCapstone() {
    var root = document.getElementById('ch15-root');
    if (!root) return;
    if (root.getAttribute('data-done-s1') !== '1') return;
    if (root.getAttribute('data-done-s2') !== '1') return;
    if (root.getAttribute('data-done-s3') !== '1') return;
    var cap = document.getElementById('ch15-capstone');
    if (cap && cap.hidden) {
      cap.hidden = false;
      requestAnimationFrame(function () {
        cap.classList.add('ch15-capstone-visible');
      });
    }
  }

  function stopProofTimer() {
    if (proofTimer) {
      clearInterval(proofTimer);
      proofTimer = null;
    }
  }

  function startProofTimer() {
    stopProofTimer();
    proofTimer = setInterval(function () {
      proofN++;
      if (S1.proofCount) S1.proofCount.textContent = String(proofN).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      if (S1.proofList) {
        var line = document.createElement('div');
        line.className = 'ch15-proof-line';
        var attempts = [
          '⊢ SS0+SSS0=SSSSS0',
          '⊢ ∀a:a=a',
          '⊢ ¬∃p:Proof(p,⌜G⌝)',
          '⊢ S0=S0 → SS0=SS0',
          'Ind. schema (instance 17)',
          '⊢ (Ax.4) instance',
          '⊢ modus ponens chain …',
          '⊢ ∀x:¬Proof(x,⌜G⌝) [fail]'
        ];
        line.textContent = attempts[Math.floor(Math.random() * attempts.length)] + '  →  does not close G';
        S1.proofList.insertBefore(line, S1.proofList.firstChild);
        while (S1.proofList.children.length > 14) {
          S1.proofList.removeChild(S1.proofList.lastChild);
        }
      }
    }, 700);
  }

  function setS1View(inside) {
    if (!S1.stage) return;
    S1.stage.classList.toggle('ch15-s1-inside', inside);
    if (S1.cap) {
      S1.cap.innerHTML = inside
        ? '<em>You are inside TNT. You only have proofs.</em>'
        : '<em>You are outside TNT. You can see everything.</em>';
    }
    if (S1.btnEnter) S1.btnEnter.hidden = inside;
    if (S1.btnJump) S1.btnJump.hidden = !inside;
    if (S1.callouts) {
      S1.callouts.innerHTML = '';
      S1.callouts.classList.remove('is-visible');
    }
    if (inside) {
      startProofTimer();
    } else {
      stopProofTimer();
    }
  }

  if (S1.btnEnter) {
    S1.btnEnter.addEventListener('click', function () {
      setS1View(true);
    });
  }

  if (S1.btnJump) {
    S1.btnJump.addEventListener('click', function () {
      stopProofTimer();
      setS1View(false);
      showCalloutsSequence();
    });
  }

  function showCalloutsSequence() {
    if (!S1.callouts) return;
    var items = [
      {
        q: 'Does TNT prove G?',
        a: 'No. The machine never finds a proof.',
        cls: 'ch15-callout-to-box'
      },
      {
        q: 'What does G say?',
        a: '“I am not provable in TNT.”',
        cls: 'ch15-callout-to-g'
      },
      {
        q: 'Is G true?',
        a: 'Yes. What G says is exactly right. G is true — and TNT cannot prove it.',
        cls: 'ch15-callout-g-gold'
      }
    ];
    var i = 0;
    S1.callouts.classList.add('is-visible');
    function next() {
      if (i >= items.length) {
        if (S1.cap) {
          S1.cap.innerHTML =
            '<em>We didn\'t prove G from inside. We reasoned about TNT from outside. That\'s the jump.</em>';
        }
        markSectionDone('s1');
        return;
      }
      var row = document.createElement('div');
      row.className = 'ch15-callout-row ' + items[i].cls;
      row.style.opacity = '0';
      row.style.transition = 'opacity 0.35s ease';
      row.innerHTML =
        '<div class="ch15-callout-q">' +
        items[i].q +
        '</div><div class="ch15-callout-a">' +
        items[i].a +
        '</div>';
      S1.callouts.appendChild(row);
      requestAnimationFrame(function () {
        row.style.opacity = '1';
      });
      i++;
      setTimeout(next, 1100);
    }
    setTimeout(next, 500);
  }

  /* ——— Section 2 tower ——— */
  var towerBtn = document.getElementById('ch15-tower-btn');
  var towerStack = document.getElementById('ch15-tower-stack');
  var towerInf = document.getElementById('ch15-tower-inf');
  var towerViewport = document.querySelector('.ch15-tower-viewport');
  var towerBtnNote = document.getElementById('ch15-tower-btn-note');
  var towerClicks = 0;

  function addTowerLevel() {
    if (!towerStack || !towerInf || towerClicks >= 4) return;
    towerClicks++;
    var gLabels = ['G', 'G′', 'G″', 'G‴'];
    var idx = towerClicks - 1;

    var gChip = document.createElement('div');
    gChip.className = 'ch15-tower-g';
    gChip.textContent = gLabels[idx];
    towerStack.insertBefore(gChip, towerInf);

    var band = document.createElement('div');
    band.className = 'ch15-tower-band';
    band.textContent = NAMES[towerClicks];
    towerStack.insertBefore(band, towerInf);

    if (towerViewport) towerViewport.scrollTop = 0;

    if (towerClicks >= 4) {
      if (towerInf) towerInf.hidden = false;
      if (towerBtn) towerBtn.disabled = true;
      if (towerBtnNote) {
        towerBtnNote.hidden = false;
        towerBtnNote.textContent = "It doesn't stop. Every system has a sentence it cannot prove.";
      }
      markSectionDone('s2');
    }
  }

  if (towerBtn) {
    towerBtn.addEventListener('click', addTowerLevel);
  }

  /* ——— Section 3 Lucas ——— */
  var lucasStep = 0;
  var lucasStepsEl = document.getElementById('ch15-lucas-steps');
  var lucasNext = document.getElementById('ch15-lucas-next');
  var lucasCompel = document.getElementById('ch15-lucas-compel');
  var lucasReb = document.getElementById('ch15-lucas-rebuttal');
  var lucasRebStage = 0;
  var lucasRebAdvance = document.getElementById('ch15-lucas-reb-advance');
  var lucasLoop = document.getElementById('ch15-lucas-loop');

  var LUCAS_TEXT = [
    'Given any machine M, I can find a Gödel sentence G_M that M cannot prove.',
    'But I can see that G_M is true — just by understanding the construction.',
    'So I can do something the machine cannot: recognize G_M as true.',
    'Therefore I am not a machine.'
  ];

  function showLucasStep() {
    if (!lucasStepsEl || lucasStep >= 4) return;
    var block = document.createElement('div');
    block.className = 'ch15-lucas-step-block';
    block.textContent = LUCAS_TEXT[lucasStep];
    lucasStepsEl.appendChild(block);
    lucasStep++;
    if (lucasStep >= 4) {
      if (lucasNext) lucasNext.hidden = true;
      if (lucasCompel) lucasCompel.hidden = false;
    }
  }

  if (lucasNext) {
    lucasNext.addEventListener('click', showLucasStep);
  }

  if (lucasCompel) {
    lucasCompel.addEventListener('click', function () {
      lucasCompel.hidden = true;
      if (lucasReb) lucasReb.hidden = false;
      lucasRebStage = 1;
      var s1 = document.getElementById('ch15-reb-s1');
      if (s1) s1.hidden = false;
      if (lucasRebAdvance) lucasRebAdvance.hidden = false;
    });
  }

  if (lucasRebAdvance) {
    lucasRebAdvance.addEventListener('click', function () {
      var s1 = document.getElementById('ch15-reb-s1');
      var s2 = document.getElementById('ch15-reb-s2');
      var s3 = document.getElementById('ch15-reb-s3');
      var fin = document.getElementById('ch15-lucas-final');

      if (lucasRebStage === 1) {
        if (s2) s2.hidden = false;
        lucasRebStage = 2;
        if (lucasLoop) {
          lucasLoop.classList.remove('ch15-loop-running');
          void lucasLoop.offsetWidth;
          lucasLoop.classList.add('ch15-loop-running');
        }
      } else if (lucasRebStage === 2) {
        if (s3) s3.hidden = false;
        lucasRebStage = 3;
      } else if (lucasRebStage === 3) {
        if (fin) fin.hidden = false;
        lucasRebAdvance.hidden = true;
        markSectionDone('s3');
      }
    });
  }
})();
