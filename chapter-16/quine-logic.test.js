/**
 * Run: node chapter-16/quine-logic.test.js
 */
'use strict';
var path = require('path');
var assert = require('assert');
var Q = require(path.join(__dirname, 'quine-logic.js'));

var t = Q.QUINE_TEMPLATE;
var src = Q.programSource(t);
var out = Q.eniuqOutput(t);
assert.strictEqual(out, src, 'quine: output equals source');

assert.strictEqual(Q.charMatchPercent('abc', 'abc'), 100);
assert.strictEqual(Q.charMatchPercent('ab', 'abc'), 67);
assert.strictEqual(Q.charMatchPercent('', 'a'), 0);
assert.strictEqual(Q.charMatchPercent('', ''), 100);

var rows = Q.buildLineDiffRows('a\nb', 'a\nc');
assert.strictEqual(rows.length, 2);
assert.strictEqual(rows[0].eq, true);
assert.strictEqual(rows[1].eq, false);

var rows2 = Q.buildLineDiffRows('x', 'x\ny');
assert.strictEqual(rows2[1].l, null);
assert.strictEqual(rows2[1].r, 'y');

var almost = Q.oneStepFailureTemplate();
assert.notStrictEqual(Q.eniuqOutput(almost), Q.programSource(almost), 'one-step failure is not a quine');
assert.ok(almost.indexOf('ENIUY') !== -1);

console.log('quine-logic.test.js: all passed');
