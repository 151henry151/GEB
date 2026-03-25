/**
 * Run: node chapter-13/predicate-eval.test.js
 */
'use strict';
var path = require('path');
var assert = require('assert');
var { evaluatePredicate } = require(path.join(__dirname, 'predicate-eval.js'));

function ok(expr, n, expected) {
  assert.strictEqual(
    evaluatePredicate(expr, n),
    expected,
    expr + ' @ n=' + n
  );
}

ok('n * n == 25', 5, true);
ok('n * n == 25', 4, false);
ok('n > 100', 101, true);
ok('n > 100', 100, false);
ok('n % 2 == 0', 4, true);
ok('n % 2 == 0', 3, false);
ok('n > 2 && n % 2 == 0', 4, true);
ok('n > 2 && n % 2 == 0', 2, false);
ok('(n + 1) * (n - 1) == 24', 5, true); // 6*4=24
ok('n == 0 || n == 7', 7, true);
ok('n * n < 0', 5, false);

assert.throws(function () { evaluatePredicate('', 0); });
assert.throws(function () { evaluatePredicate('n +', 0); });
assert.throws(function () { evaluatePredicate('foo', 0); });

console.log('predicate-eval.test.js: all passed');
