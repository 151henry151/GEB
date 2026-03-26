/**
 * Chapter 17 helpers — flip halting labels for diagonal trace demo.
 * Browser: window.GEBCh17Logic; Node: module.exports
 */
'use strict';

function flipHaltingLabel(s) {
  var t = String(s).toUpperCase();
  if (t === 'HALTS' || t === 'H') return 'LOOPS';
  if (t === 'LOOPS' || t === 'L' || t === 'RUNS FOREVER') return 'HALTS';
  return 'LOOPS';
}

var api = { flipHaltingLabel: flipHaltingLabel };

if (typeof module !== 'undefined' && module.exports) {
  module.exports = api;
}
if (typeof window !== 'undefined') {
  window.GEBCh17Logic = api;
}
