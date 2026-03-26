'use strict';

(function () {
  function byId(id) {
    return document.getElementById(id);
  }
  var dot1 = byId('ch20-dot-1');
  var dot2 = byId('ch20-dot-2');
  var dot3 = byId('ch20-dot-3');
  var p2 = byId('ch20-panel-escher');
  var p3 = byId('ch20-panel-godel');
  var unlockEscher = byId('ch20-unlock-escher');
  var unlockGodel = byId('ch20-unlock-godel');
  var revealBraidBtn = byId('ch20-reveal-braid');
  var braidSection = byId('ch20-braid-section');
  var iSection = byId('ch20-i-section');
  var finalQ = byId('ch20-final-q');
  var finalSrc = byId('ch20-final-src');

  var bachBtn = byId('ch20-bach-play');
  var bachReplay = byId('ch20-bach-replay');
  var bachDot = byId('ch20-bach-dot');
  var bachMsg = byId('ch20-bach-msg');
  var bachCaption = byId('ch20-bach-caption');
  var bachLoopNote = byId('ch20-bach-loop-note');

  var escherLabel = byId('ch20-escher-label');
  var godelCompute = byId('ch20-godel-compute');
  var godelNumber = byId('ch20-godel-number');
  var godelLoop = byId('ch20-godel-loop');
  var godelBranches = byId('ch20-godel-branches');
  var godelCaption = byId('ch20-godel-caption');

  var strandA = byId('ch20-strand-a');
  var strandB = byId('ch20-strand-b');
  var strandC = byId('ch20-strand-c');
  var phase1 = byId('ch20-braid-phase1');
  var phase2 = byId('ch20-braid-phase2');

  var audioCtx;
  var bachPlaying = false;
  var escherCycleTimer;
  var braidStartTs = 0;
  var rafId = 0;

  function setDots(n) {
    if (dot1) dot1.textContent = n >= 1 ? '●' : '○';
    if (dot2) dot2.textContent = n >= 2 ? '●' : '○';
    if (dot3) dot3.textContent = n >= 3 ? '●' : '○';
    if (dot1) dot1.classList.toggle('ch20-dot-on', n >= 1);
    if (dot2) dot2.classList.toggle('ch20-dot-on', n >= 2);
    if (dot3) dot3.classList.toggle('ch20-dot-on', n >= 3);
  }

  function playCanon(ctx) {
    var freqs = [261.6, 293.7, 329.6, 370.0, 415.3, 466.2, 523.3];
    var now = ctx.currentTime;
    freqs.forEach(function (freq, i) {
      var osc = ctx.createOscillator();
      var gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = freq;
      osc.type = 'sine';
      gain.gain.setValueAtTime(0, now + i * 0.7);
      gain.gain.linearRampToValueAtTime(0.3, now + i * 0.7 + 0.05);
      gain.gain.linearRampToValueAtTime(0, now + i * 0.7 + 0.6);
      osc.start(now + i * 0.7);
      osc.stop(now + i * 0.7 + 0.7);
    });
  }

  function animateBachDot() {
    if (!bachDot) return;
    var points = [
      [36, 78],
      [78, 70],
      [120, 62],
      [162, 54],
      [204, 46],
      [246, 38],
      [288, 30]
    ];
    points.forEach(function (pt, i) {
      window.setTimeout(function () {
        bachDot.setAttribute('cx', String(pt[0]));
        bachDot.setAttribute('cy', String(pt[1]));
      }, i * 700);
    });
    window.setTimeout(function () {
      bachDot.setAttribute('cx', '36');
      bachDot.setAttribute('cy', '78');
      if (bachLoopNote) bachLoopNote.hidden = false;
      if (bachCaption) bachCaption.hidden = false;
      if (bachReplay) bachReplay.hidden = false;
      if (unlockEscher) unlockEscher.hidden = false;
      bachPlaying = false;
      if (bachMsg) bachMsg.textContent = "You went up six steps. You're back where you started.";
    }, 5200);
  }

  function runBach() {
    if (bachPlaying) return;
    bachPlaying = true;
    if (!audioCtx) {
      var Ctx = window.AudioContext || window.webkitAudioContext;
      if (Ctx) audioCtx = new Ctx();
    }
    if (audioCtx) {
      if (audioCtx.state === 'suspended') audioCtx.resume();
      playCanon(audioCtx);
    }
    if (bachMsg) bachMsg.textContent = 'Ascending...';
    animateBachDot();
  }

  function unlockEscherPanel() {
    if (p2) p2.hidden = false;
    setDots(2);
    if (escherCycleTimer) window.clearTimeout(escherCycleTimer);
    escherCycleTimer = window.setTimeout(function () {
      if (escherLabel) escherLabel.hidden = false;
      if (unlockGodel) unlockGodel.hidden = false;
    }, 8000);
  }

  function unlockGodelPanel() {
    if (p3) p3.hidden = false;
    setDots(3);
  }

  function runGodel() {
    if (!godelCompute || !godelNumber) return;
    godelCompute.disabled = true;
    godelNumber.hidden = false;
    var target = 631842917;
    var steps = 22;
    var n = 0;
    var iv = window.setInterval(function () {
      n++;
      var v = Math.floor((target / steps) * n);
      godelNumber.textContent = 'g = ' + String(v);
      if (n >= steps) {
        window.clearInterval(iv);
        godelNumber.textContent = 'g = 631842917';
        if (godelLoop) {
          godelLoop.hidden = false;
          godelLoop.classList.add('ch20-loop-draw');
        }
        if (godelBranches) godelBranches.hidden = false;
        if (godelCaption) godelCaption.hidden = false;
        if (revealBraidBtn) revealBraidBtn.hidden = false;
      }
    }, 70);
  }

  function braidPath(phase) {
    var yStart = 120;
    var yEnd = 245;
    var x0 = 64;
    var w = 390;
    var amp = 52;
    var seg = 56;
    var d = 'M ' + x0 + ' ' + yStart;
    for (var i = 1; i <= seg; i++) {
      var t = i / seg;
      var x = x0 + t * w;
      var y = yStart + t * (yEnd - yStart) + Math.sin(t * Math.PI * 8 + phase) * amp * (1 - t * 0.65);
      d += ' L ' + x.toFixed(2) + ' ' + y.toFixed(2);
    }
    return d;
  }

  function animateBraid(ts) {
    if (!braidStartTs) braidStartTs = ts;
    var t = (ts - braidStartTs) / 1000;
    if (phase1) phase1.style.opacity = t < 1.5 ? '1' : '0';
    if (phase2) phase2.style.opacity = t >= 1.5 && t < 3.5 ? '1' : '0';

    var showStrands = t >= 3.2;
    if (strandA) strandA.style.opacity = showStrands ? '1' : '0';
    if (strandB) strandB.style.opacity = showStrands ? '1' : '0';
    if (strandC) strandC.style.opacity = showStrands ? '1' : '0';
    var p = t * 1.3;
    if (strandA) strandA.setAttribute('d', braidPath(p + 0));
    if (strandB) strandB.setAttribute('d', braidPath(p + (Math.PI * 2) / 3));
    if (strandC) strandC.setAttribute('d', braidPath(p + (Math.PI * 4) / 3));

    rafId = window.requestAnimationFrame(animateBraid);
  }

  function revealBraid() {
    if (!braidSection) return;
    braidSection.hidden = false;
    if (!rafId) rafId = window.requestAnimationFrame(animateBraid);
    window.setTimeout(function () {
      if (iSection) {
        iSection.hidden = false;
        iSection.classList.add('ch20-show');
      }
    }, 6500);
    window.setTimeout(function () {
      if (finalQ) {
        finalQ.hidden = false;
        finalQ.classList.add('ch20-show');
      }
    }, 8200);
    window.setTimeout(function () {
      if (finalSrc) {
        finalSrc.hidden = false;
        finalSrc.classList.add('ch20-show');
      }
    }, 10200);
  }

  if (bachBtn) bachBtn.addEventListener('click', runBach);
  if (bachReplay) bachReplay.addEventListener('click', runBach);
  if (unlockEscher) unlockEscher.addEventListener('click', unlockEscherPanel);
  if (unlockGodel) unlockGodel.addEventListener('click', unlockGodelPanel);
  if (godelCompute) godelCompute.addEventListener('click', runGodel);
  if (revealBraidBtn) revealBraidBtn.addEventListener('click', revealBraid);

  setDots(1);
})();
