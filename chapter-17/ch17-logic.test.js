/**
 * Run: node chapter-17/ch17-logic.test.js
 */
'use strict';
var path = require('path');
var assert = require('assert');
var L = require(path.join(__dirname, 'ch17-logic.js'));

assert.strictEqual(L.flipHaltingLabel('HALTS'), 'LOOPS');
assert.strictEqual(L.flipHaltingLabel('LOOPS'), 'HALTS');
assert.strictEqual(L.flipHaltingLabel('halts'), 'LOOPS');
assert.strictEqual(L.flipHaltingLabel('RUNS FOREVER'), 'HALTS');

console.log('ch17-logic.test.js: all passed');
