'use strict';

var assert = require('assert');
var F = require('./ch19-frames-logic.js');

assert.strictEqual(F.computeDefaultMap('birthday', {}).cake, 'yes');
assert.strictEqual(F.computeDefaultMap('birthday', { where: 'at the park' }).cake, 'probably, but simpler');
assert.strictEqual(F.computeDefaultMap('birthday', { where: 'restaurant' }).cake, 'ordered from venue');
assert.ok(F.listVisibleSlotIds('birthday', { where: 'central park' }).includes('catering'));
assert.ok(!F.listVisibleSlotIds('birthday', { where: 'home' }).includes('catering'));
assert.ok(F.listVisibleSlotIds('birthday', { age: '5' }).includes('partyGames'));
assert.strictEqual(F.computeDefaultMap('birthday', { age: '5' }).presents, 'toys/games');

assert.strictEqual(F.computeDefaultMap('restaurant', { time: 'lunch' }).bill, 'individual pays own');
assert.strictEqual(
  F.computeDefaultMap('restaurant', { occasion: 'anniversary' }).dressCode,
  'smart casual or formal'
);
assert.strictEqual(
  F.computeDefaultMap('restaurant', { occasion: 'anniversary' }).reservation,
  'essential'
);
assert.strictEqual(F.restaurantTipEmphasized({ time: 'dinner' }), true);
assert.strictEqual(F.restaurantTipEmphasized({ time: 'lunch' }), false);

console.log('ch19-frames-logic.test.js: ok');
