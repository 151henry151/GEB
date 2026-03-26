/**
 * Pure frame default / visibility logic for Chapter XIX companion (browser + Node tests).
 */
'use strict';

function norm(s) {
  return String(s == null ? '' : s)
    .trim()
    .toLowerCase();
}

function containsWord(hay, word) {
  var n = norm(hay);
  var w = norm(word);
  if (!w) return false;
  return new RegExp('\\b' + w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b').test(n) || n === w;
}

function isPark(where) {
  return containsWord(where, 'park');
}

function isRestaurant(where) {
  return containsWord(where, 'restaurant');
}

function isLunch(time) {
  var t = norm(time);
  return t.indexOf('lunch') >= 0 || t === 'lunch';
}

function isDinner(time) {
  var t = norm(time);
  return t.indexOf('dinner') >= 0 || t === 'dinner';
}

function isAnniversary(occasion) {
  return containsWord(occasion, 'anniversary');
}

function parseChildAge(ageVal) {
  var n = parseInt(norm(ageVal), 10);
  if (Number.isNaN(n)) return null;
  if (norm(ageVal) === '') return null;
  return n;
}

/**
 * @param {'birthday'|'restaurant'|'doctor'|'job'} frameKey
 * @param {Record<string, string>} values slot id -> raw input
 * @returns {string[]}
 */
function listVisibleSlotIds(frameKey, values) {
  values = values || {};
  if (frameKey === 'birthday') {
    var ids = ['who', 'when', 'where', 'age', 'cake', 'presents'];
    if (isPark(values.where)) ids.push('catering');
    var a = parseChildAge(values.age);
    if (a !== null && a <= 12) ids.push('partyGames');
    return ids;
  }
  if (frameKey === 'restaurant') {
    return ['host', 'time', 'occasion', 'dressCode', 'menu', 'bill', 'tip', 'reservation'];
  }
  if (frameKey === 'doctor') {
    return ['patient', 'appointmentType', 'waitTime', 'paperwork', 'prescription', 'followUp'];
  }
  if (frameKey === 'job') {
    return ['candidate', 'format', 'duration', 'dressCode', 'thankYou'];
  }
  return [];
}

/**
 * Effective default strings for cascade display / infer (null = no default).
 * @param {'birthday'|'restaurant'|'doctor'|'job'} frameKey
 * @param {Record<string, string>} values
 * @returns {Record<string, string|null>}
 */
function computeDefaultMap(frameKey, values) {
  values = values || {};
  if (frameKey === 'birthday') {
    var cake = 'yes';
    if (isPark(values.where)) cake = 'probably, but simpler';
    if (isRestaurant(values.where)) cake = 'ordered from venue';
    var presents = 'yes';
    var a = parseChildAge(values.age);
    if (a !== null && a <= 12) presents = 'toys/games';
    return {
      who: 'the birthday person',
      when: 'afternoon',
      where: 'home or party venue',
      age: null,
      cake: cake,
      presents: presents,
      catering: 'no',
      partyGames: 'yes'
    };
  }
  if (frameKey === 'restaurant') {
    var dress = 'casual';
    var reservation = 'recommended';
    if (isAnniversary(values.occasion)) {
      dress = 'smart casual or formal';
      reservation = 'essential';
    }
    var bill = 'split or one pays';
    if (isLunch(values.time)) bill = 'individual pays own';
    var tip = 'expected';
    return {
      host: null,
      time: 'lunch',
      occasion: null,
      dressCode: dress,
      menu: 'printed menu',
      bill: bill,
      tip: tip,
      reservation: reservation
    };
  }
  if (frameKey === 'doctor') {
    return {
      patient: null,
      appointmentType: 'checkup',
      waitTime: '15–30 minutes',
      paperwork: 'yes',
      prescription: 'possible',
      followUp: 'scheduled if needed'
    };
  }
  if (frameKey === 'job') {
    return {
      candidate: null,
      format: 'in-person',
      duration: '45–60 minutes',
      dressCode: 'business professional',
      thankYou: 'expected after'
    };
  }
  return {};
}

/**
 * Whether "tip" should get visual prominence (dinner context).
 */
function restaurantTipEmphasized(values) {
  return isDinner((values || {}).time);
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    norm,
    listVisibleSlotIds,
    computeDefaultMap,
    restaurantTipEmphasized,
    isPark,
    isRestaurant,
    isLunch,
    isDinner,
    isAnniversary
  };
}

if (typeof window !== 'undefined') {
  window.GEBCh19Frames = {
    listVisibleSlotIds,
    computeDefaultMap,
    restaurantTipEmphasized
  };
}
