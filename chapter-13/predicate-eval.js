/**
 * Safe evaluation of simple predicates in n (non-negative integer).
 * Supports: + - * / %, unary -, (), comparisons == != < <= > >=, && ||.
 */
'use strict';

function tokenize(s) {
  var i = 0;
  var out = [];
  while (i < s.length) {
    if (/\s/.test(s[i])) {
      i++;
      continue;
    }
    var two = s.slice(i, i + 2);
    if (two === '<=') {
      out.push({ t: '<=' });
      i += 2;
      continue;
    }
    if (two === '>=') {
      out.push({ t: '>=' });
      i += 2;
      continue;
    }
    if (two === '==') {
      out.push({ t: '==' });
      i += 2;
      continue;
    }
    if (two === '!=') {
      out.push({ t: '!=' });
      i += 2;
      continue;
    }
    if (two === '&&') {
      out.push({ t: '&&' });
      i += 2;
      continue;
    }
    if (two === '||') {
      out.push({ t: '||' });
      i += 2;
      continue;
    }
    var c = s[i];
    if (c === 'n') {
      if (i + 1 < s.length && /[a-zA-Z0-9_]/.test(s[i + 1])) {
        throw new Error('Invalid identifier');
      }
      out.push({ t: 'n' });
      i++;
      continue;
    }
    if (/\d/.test(c)) {
      var j = i;
      while (j < s.length && /\d/.test(s[j])) j++;
      out.push({ t: 'num', v: parseInt(s.slice(i, j), 10) });
      i = j;
      continue;
    }
    if ('+-*/%()'.indexOf(c) >= 0) {
      out.push({ t: c });
      i++;
      continue;
    }
    if (c === '<' || c === '>') {
      out.push({ t: c });
      i++;
      continue;
    }
    throw new Error('Invalid character');
  }
  out.push({ t: 'EOF' });
  return out;
}

function evaluatePredicate(str, n) {
  if (typeof n !== 'number' || n !== Math.floor(n) || n < 0) {
    throw new Error('n must be a non-negative integer');
  }
  var trimmed = String(str).trim();
  if (!trimmed) throw new Error('Empty expression');

  var tokens = tokenize(trimmed);
  var p = 0;
  var N = n;

  function peek() {
    return tokens[p];
  }
  function eat(expected) {
    if (peek().t !== expected) throw new Error('Syntax error');
    p++;
  }

  function isRelop(t) {
    return t === '==' || t === '!=' || t === '<' || t === '<=' || t === '>' || t === '>=';
  }

  function parseBoolOr() {
    var left = parseBoolAnd();
    while (peek().t === '||') {
      p++;
      var right = parseBoolAnd();
      left = Boolean(left) || Boolean(right);
    }
    return left;
  }

  function parseBoolAnd() {
    var left = parseBoolAtom();
    while (peek().t === '&&') {
      p++;
      var right = parseBoolAtom();
      left = Boolean(left) && Boolean(right);
    }
    return left;
  }

  function parseBoolAtom() {
    var left = parseArithmetic();
    if (isRelop(peek().t)) {
      var op = peek().t;
      p++;
      var right = parseArithmetic();
      switch (op) {
        case '==':
          return left === right;
        case '!=':
          return left !== right;
        case '<':
          return left < right;
        case '<=':
          return left <= right;
        case '>':
          return left > right;
        case '>=':
          return left >= right;
        default:
          throw new Error('Internal');
      }
    }
    if (typeof left === 'number' && (left !== left || !isFinite(left))) return false;
    return left !== 0;
  }

  function parseArithmetic() {
    return parseAdd();
  }

  function parseAdd() {
    var left = parseMul();
    while (peek().t === '+' || peek().t === '-') {
      var op = peek().t;
      p++;
      var right = parseMul();
      left = op === '+' ? left + right : left - right;
    }
    return left;
  }

  function parseMul() {
    var left = parseUnary();
    while (peek().t === '*' || peek().t === '/' || peek().t === '%') {
      var op = peek().t;
      p++;
      var right = parseUnary();
      if (op === '*') left = left * right;
      else if (op === '/') left = right === 0 ? NaN : left / right;
      else left = right === 0 ? NaN : left % right;
    }
    return left;
  }

  function parseUnary() {
    if (peek().t === '-') {
      p++;
      return -parseUnary();
    }
    return parsePrimary();
  }

  function parsePrimary() {
    var t = peek().t;
    if (t === 'n') {
      p++;
      return N;
    }
    if (t === 'num') {
      var v = peek().v;
      p++;
      return v;
    }
    if (t === '(') {
      p++;
      var e = parseArithmetic();
      if (peek().t !== ')') throw new Error('Expected )');
      p++;
      return e;
    }
    throw new Error('Syntax error');
  }

  var result = parseBoolOr();
  if (peek().t !== 'EOF') throw new Error('Trailing input');
  return Boolean(result);
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { evaluatePredicate };
}
if (typeof window !== 'undefined') {
  window.ch13EvaluatePredicate = evaluatePredicate;
}
