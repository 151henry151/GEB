/**
 * ENIUQ / quine helpers — usable in browser (global GEBCh16Quine) and Node (CommonJS).
 */
'use strict';

var DEF =
  'DEFINE PROCEDURE "ENIUQ" [TEMPLATE]: PRINT [TEMPLATE, " [", QUOTE, TEMPLATE, QUOTE, "]."].';
var QUINE_TEMPLATE = DEF + '\n\nENIUQ';

function programSource(template) {
  return DEF + '\n\nENIUQ\n[\'' + template + '\'].';
}

function eniuqOutput(template) {
  return template + "\n['" + template + "'].";
}

/** Positional character match rate: matching chars at shared indices / max length. */
function charMatchPercent(source, output) {
  var max = Math.max(source.length, output.length);
  if (max === 0) return 100;
  var min = Math.min(source.length, output.length);
  var matches = 0;
  for (var i = 0; i < min; i++) {
    if (source.charCodeAt(i) === output.charCodeAt(i)) matches++;
  }
  return Math.round((100 * matches) / max);
}

/**
 * Line-aligned side-by-side rows (naive by line index; fine for quine comparison).
 * null = missing line on that side (show placeholder).
 */
function buildLineDiffRows(source, output) {
  var A = source.split('\n');
  var B = output.split('\n');
  var n = Math.max(A.length, B.length);
  var rows = [];
  for (var i = 0; i < n; i++) {
    var l = i < A.length ? A[i] : null;
    var r = i < B.length ? B[i] : null;
    rows.push({
      eq: l !== null && r !== null && l === r,
      l: l,
      r: r
    });
  }
  return rows;
}

/** One character changed in the template line (ENIUQ → ENIUY): almost a quine. */
function oneStepFailureTemplate() {
  return DEF + '\n\nENIUY';
}

var api = {
  DEF: DEF,
  QUINE_TEMPLATE: QUINE_TEMPLATE,
  programSource: programSource,
  eniuqOutput: eniuqOutput,
  charMatchPercent: charMatchPercent,
  buildLineDiffRows: buildLineDiffRows,
  oneStepFailureTemplate: oneStepFailureTemplate
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = api;
}
if (typeof window !== 'undefined') {
  window.GEBCh16Quine = api;
}
