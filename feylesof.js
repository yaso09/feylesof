/**
 * feylesof.js — Propositional Logic Theorem Prover Library
 * ──────────────────────────────────────────────────────────
 * Supports:
 *   - Natural Deduction (Fitch-style)
 *   - Resolution (CNF-based)
 *   - Analytic Tableau (Semantic Trees)
 *   - Truth Tables
 *   - Quantifier Instantiation (∀/∃ with guards)
 *   - Numeric / Equality Fact Computation
 *
 * Usage:
 *   const result = Feylesof.prove(inputText);
 *   // result.verdict, result.ndSteps, result.resSteps,
 *   // result.tableau, result.truthTable, result.instances, ...
 *
 * @version 1.0.0
 * @license MIT
 */

(function (root, factory) {
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = factory();
  } else {
    root.Feylesof = factory();
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  // ═══════════════════════════════════════════════════════
  // 1. TEXT NORMALIZATION
  // ═══════════════════════════════════════════════════════

  function normalizeFormula(text) {
    text = text.replace(/\/\/.*$/gm, '');
    text = text.replace(/<==>/g, '↔');
    text = text.replace(/<=>/g, '↔');
    text = text.replace(/===/g, '≡');
    text = text.replace(/=>/g, '→');
    text = text.replace(/\|\|/g, '∨');
    text = text.replace(/&&/g, '∧');
    text = text.replace(/~(?=\S)/g, '¬');
    text = text.replace(/~(?=\s)/g, '¬');
    text = text.replace(/>=/g, '≥');
    text = text.replace(/<=/g, '≤');
    text = text.replace(/\bher\s+(\S+)/g, '\u2200$1');
    text = text.replace(/\bbaz\u0131\s+(\S+)/g, '\u2203$1');
    text = text.replace(/\b(\S+)\s+eleman[ıi]d[ıi]r\s+(\S+)/g, '$1\u2208$2');
    text = text.replace(/(\S)\s+([><\u2265\u2264\u2260=!]+)\s+(\S)/g, function (m, a, op, b) {
      return a + op + b;
    });
    return text.trim();
  }

  function normLine(text) {
    return normalizeFormula(text);
  }

  function escapeRegex(s) {
    return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  // ═══════════════════════════════════════════════════════
  // 2. QUANTIFIER PARSING
  // ═══════════════════════════════════════════════════════

  function findTopLevelComma(s) {
    var depth = 0;
    for (var i = 0; i < s.length; i++) {
      if (s[i] === '(' || s[i] === '[') depth++;
      else if (s[i] === ')' || s[i] === ']') depth--;
      else if (s[i] === ',' && depth === 0) return i;
    }
    return -1;
  }

  function normalizeGuard(raw, qv) {
    var s = raw;
    s = s.replace(/\s*([><≥≤≠=!]+|>=|<=)\s*/g, function (m, op) { return op; });
    var re = new RegExp('\\b' + escapeRegex(qv) + '\\b');
    if (!re.test(s)) s = qv + s;
    return s;
  }

  function detectQuantifier(name, body) {
    var b = body.trim();
    var isForall = /^her\s+/i.test(b);
    var isExists = /^baz[ıi]\s+/i.test(b);
    var qtype = isForall ? 'forall' : isExists ? 'exists' : null;
    if (!qtype) return { name: name, raw: normLine(b), ast: null, err: null };

    var rest = b.replace(/^(her|baz[ıi])\s+/i, '');
    var varMatch = rest.match(/^(\S+)\s*(.*)/);
    if (!varMatch) return { name: name, raw: normLine(b), ast: null, err: null };
    var qv = varMatch[1];
    var afterVar = varMatch[2].trim();

    var domainMatch = afterVar.match(/^eleman[ıi]d[ıi]r\s+(\S+)\s*,\s*(.+)$/i);
    if (domainMatch) {
      var dom = domainMatch[1], pred = domainMatch[2].trim();
      return {
        name: name, type: qtype, quantVar: qv,
        guardType: 'member', domain: dom, guardTemplate: qv + '\u2208' + dom,
        concTemplate: pred,
        raw: '\u2200' + qv + '\u2208' + dom + ', ' + pred,
        displayFull: (qtype === 'forall' ? '\u2200' : '\u2203') + qv + '(' + qv + '\u2208' + dom + (qtype === 'forall' ? ' \u2192 ' : ' \u2227 ') + pred + ')',
        ast: null, err: null
      };
    }

    var commaIdx = findTopLevelComma(afterVar);
    if (commaIdx < 0) {
      var pred2 = afterVar.trim();
      if (!pred2) return { name: name, raw: normLine(b), ast: null, err: null };
      return {
        name: name, type: qtype, quantVar: qv,
        guardType: 'none', guardTemplate: null, concTemplate: pred2,
        raw: (qtype === 'forall' ? '\u2200' : '\u2203') + qv + ', ' + pred2,
        displayFull: (qtype === 'forall' ? '\u2200' : '\u2203') + qv + '(' + pred2 + ')',
        ast: null, err: null
      };
    }

    var guardRaw = afterVar.slice(0, commaIdx).trim();
    var concRaw = afterVar.slice(commaIdx + 1).trim();

    if (!guardRaw) {
      return {
        name: name, type: qtype, quantVar: qv,
        guardType: 'none', guardTemplate: null, concTemplate: concRaw,
        raw: (qtype === 'forall' ? '\u2200' : '\u2203') + qv + ', ' + concRaw,
        displayFull: (qtype === 'forall' ? '\u2200' : '\u2203') + qv + '(' + concRaw + ')',
        ast: null, err: null
      };
    }

    var guardNorm = normalizeGuard(guardRaw, qv);
    return {
      name: name, type: qtype, quantVar: qv,
      guardType: 'cond', guardTemplate: guardNorm, concTemplate: concRaw,
      raw: (qtype === 'forall' ? '\u2200' : '\u2203') + qv + '(' + guardNorm + (qtype === 'forall' ? ' \u2192 ' : ' \u2227 ') + concRaw + ')',
      displayFull: (qtype === 'forall' ? '\u2200' : '\u2203') + qv + '(' + guardNorm + (qtype === 'forall' ? ' \u2192 ' : ' \u2227 ') + concRaw + ')',
      ast: null, err: null
    };
  }

  // ═══════════════════════════════════════════════════════
  // 3. INPUT PARSER
  // ═══════════════════════════════════════════════════════

  /**
   * Parse raw editor text into axioms + goal.
   * @param {string} raw - Input text
   * @returns {{ axioms: Array, goal: object|null }}
   */
  function parseEditorText(raw) {
    var axioms = [], goal = null;
    var lines = raw.split('\n');

    for (var i = 0; i < lines.length; i++) {
      var line = lines[i].replace(/\/\/.*$/, '').trim();
      if (!line) continue;

      if (line.includes(';') && !line.match(/^[A-Za-zÇçĞğİıÖöŞşÜü]\w*\s*:/)) {
        var parts = line.split(';');
        var premStrs = parts[0].split(',').map(function (s) { return normLine(s.trim()); }).filter(Boolean);
        var concStr = normLine(parts[1].trim());
        premStrs.forEach(function (p, j) {
          axioms.push({ name: 'H' + (j + 1), raw: p, ast: null, err: null });
        });
        goal = { raw: concStr, ast: null, err: null };
        continue;
      }

      var goalMatch = line.match(/^(\|-|⊢|kanıtla\s*:)\s*(.+)$/i);
      if (goalMatch) {
        goal = { raw: normLine(goalMatch[2].trim()), ast: null, err: null };
        continue;
      }

      var axMatch = line.match(/^([A-Za-zÇçĞğİıÖöŞşÜü][A-Za-z0-9ÇçĞğİıÖöŞşÜü_]*)\s*:\s*(.+)$/);
      if (axMatch) {
        var axObj = detectQuantifier(axMatch[1], axMatch[2].trim());
        axioms.push(axObj);
        continue;
      }

      var bareObj = detectQuantifier('H' + (axioms.length + 1), line);
      axioms.push(bareObj);
    }

    axioms.forEach(function (ax) {
      if (ax.type === 'forall' || ax.type === 'exists') return;
      try { ax.ast = parseFormula(ax.raw); }
      catch (e) { ax.err = e.message; }
    });

    if (goal) {
      try { goal.ast = parseFormula(goal.raw); }
      catch (e) { goal.err = e.message; }
    }

    return { axioms: axioms, goal: goal };
  }

  // ═══════════════════════════════════════════════════════
  // 4. QUANTIFIER INSTANTIATION
  // ═══════════════════════════════════════════════════════

  function substVar(template, varName, term) {
    try {
      return template.replace(new RegExp('\\b' + escapeRegex(varName) + '\\b', 'g'), term);
    } catch (e) {
      return template.split(varName).join(term);
    }
  }

  var REL_OPS = [
    ['>=', function (a, b) { return a >= b; }], ['<=', function (a, b) { return a <= b; }],
    ['≥', function (a, b) { return a >= b; }], ['≤', function (a, b) { return a <= b; }],
    ['!=', function (a, b) { return a !== b; }], ['≠', function (a, b) { return a !== b; }],
    ['>', function (a, b) { return a > b; }], ['<', function (a, b) { return a < b; }],
    ['=', function (a, b) { return a === b; }]
  ];

  function evalNumericCond(expr) {
    for (var i = 0; i < REL_OPS.length; i++) {
      var op = REL_OPS[i][0], fn = REL_OPS[i][1];
      var idx = expr.indexOf(op);
      if (idx < 0) continue;
      var lhs = expr.slice(0, idx).trim(), rhs = expr.slice(idx + op.length).trim();
      var ln = parseFloat(lhs), rn = parseFloat(rhs);
      if (!isNaN(ln) && !isNaN(rn)) return fn(ln, rn) ? 'true' : 'false';
    }
    return 'unknown';
  }

  function applyEqualities(expr, equalities, qv, term) {
    var s = substVar(expr, qv, term);
    equalities.forEach(function (val, key) {
      try {
        var re = new RegExp('\\b' + escapeRegex(key) + '\\b', 'g');
        s = s.replace(re, val);
      } catch (e) { }
    });
    return s;
  }

  function collectGroundFacts(axioms) {
    var memberships = [];
    var equalities = new Map();
    var allTerms = new Set();

    axioms.forEach(function (ax) {
      if (ax.type) return;
      if (!ax.ast) return;
      (function gather(n) {
        if (!n) return;
        if (n.type === 'var') {
          var nm = n.name;
          allTerms.add(nm);
          var memM = nm.match(/^(.+)\u2208(.+)$/);
          if (memM) memberships.push({ term: memM[1].trim(), domain: memM[2].trim(), srcName: ax.name });
          var eqM = nm.match(/^([A-Za-z_\u00C0-\u024F][A-Za-z0-9_\u00C0-\u024F]*)=(.+)$/);
          if (eqM) {
            var lhs = eqM[1].trim(), rhs = eqM[2].trim();
            if (lhs && rhs) { equalities.set(lhs, rhs); allTerms.add(lhs); allTerms.add(rhs); }
          }
          var eqM2 = nm.match(/^([0-9][^=]*)=([A-Za-z_\u00C0-\u024F][A-Za-z0-9_\u00C0-\u024F]*)$/);
          if (eqM2) {
            var lhs2 = eqM2[2].trim(), rhs2 = eqM2[1].trim();
            if (lhs2 && rhs2) { equalities.set(lhs2, rhs2); allTerms.add(lhs2); allTerms.add(rhs2); }
          }
        }
        gather(n.left); gather(n.right); gather(n.value);
      })(ax.ast);
    });

    return { memberships: memberships, equalities: equalities, allTerms: allTerms };
  }

  function evalGuard(guardTemplate, qv, term, equalities, memberships) {
    if (!guardTemplate) return 'true';
    var expr = applyEqualities(guardTemplate, equalities, qv, term);
    var memM = expr.match(/^(.+)\u2208(.+)$/);
    if (memM) {
      var t2 = memM[1].trim(), dom = memM[2].trim();
      var found = memberships.some(function (mb) { return mb.term === t2 && mb.domain === dom; });
      return found ? 'true' : 'unknown';
    }
    return evalNumericCond(expr);
  }

  /**
   * Instantiate quantified axioms using known ground terms.
   * @param {Array} axioms
   * @returns {Array} instances
   */
  function instantiateQuantifiers(axioms) {
    var instances = [];
    var gf = collectGroundFacts(axioms);

    axioms.forEach(function (ax) {
      if (ax.type !== 'forall' && ax.type !== 'exists') return;
      var candidates = [];

      if (ax.guardType === 'member') {
        gf.memberships.forEach(function (mb) {
          if (mb.domain === ax.domain)
            candidates.push({ term: mb.term, src: mb.srcName, guardsOk: true });
        });
      } else if (ax.guardType === 'cond') {
        gf.allTerms.forEach(function (t) {
          if (t === ax.quantVar) return;
          var res = evalGuard(ax.guardTemplate, ax.quantVar, t, gf.equalities, gf.memberships);
          if (res === 'true') candidates.push({ term: t, src: '(' + ax.guardTemplate + ' sağlandı)', guardsOk: true });
        });
      } else {
        gf.allTerms.forEach(function (t) {
          if (t !== ax.quantVar) candidates.push({ term: t, src: '(genel)', guardsOk: true });
        });
      }

      if (ax.type === 'exists' && candidates.length === 0)
        candidates.push({ term: '_w_' + ax.quantVar, src: '(varoluş tanığı)', guardsOk: true });

      candidates.forEach(function (c) {
        var concInst = substVar(ax.concTemplate, ax.quantVar, c.term);
        var normConc = normalizeFormula(concInst);
        var instAst = null, instErr = null;
        try { instAst = parseFormula(normConc); } catch (e) { instErr = e.message; }
        instances.push({
          name: ax.name + '[' + c.term + ']',
          type: 'instance',
          raw: normConc,
          derivedFrom: ax.name,
          quantType: ax.type,
          term: c.term,
          src: c.src,
          ast: instAst,
          err: instErr
        });
      });
    });

    return instances;
  }

  // ═══════════════════════════════════════════════════════
  // 5. NUMERIC FACT COMPUTATION
  // ═══════════════════════════════════════════════════════

  /**
   * Derive numeric facts from equalities in axioms.
   * @param {Array} axioms
   * @param {object} goalAst
   * @returns {Array} numFacts
   */
  function computeNumericFacts(axioms, goalAst) {
    var gf = collectGroundFacts(axioms);
    var numFacts = [];
    var seenAtoms = new Set();

    var allAsts = [];
    axioms.forEach(function (ax) { if (!ax.type && ax.ast) allAsts.push(ax.ast); });
    if (goalAst) allAsts.push(goalAst);

    function gatherAtoms(n) {
      if (!n) return;
      if (n.type === 'var') seenAtoms.add(n.name);
      gatherAtoms(n.left); gatherAtoms(n.right); gatherAtoms(n.value);
    }
    allAsts.forEach(gatherAtoms);
    gf.equalities.forEach(function (val, key) { seenAtoms.add(key); seenAtoms.add(val); });

    seenAtoms.forEach(function (atom) {
      if (!atom) return;
      if (atom.match(/^[A-Za-z_][A-Za-z0-9_]*=[^=]/)) return;

      var substituted = atom;
      gf.equalities.forEach(function (val, key) {
        try {
          var re = new RegExp('\\b' + escapeRegex(key) + '\\b', 'g');
          substituted = substituted.replace(re, val);
        } catch (e) { }
      });

      var result = evalNumericCond(substituted);
      if (result === 'true') {
        var normAtom = normalizeFormula(atom);
        var ast = null;
        try { ast = parseFormula(normAtom); } catch (e) { }
        if (ast && ast.type === 'var') {
          var alreadyKnown = axioms.some(function (ax) { return !ax.type && ax.raw === normAtom; });
          if (!alreadyKnown) {
            numFacts.push({
              name: 'Hesap[' + atom + ']',
              type: 'computed',
              raw: normAtom,
              derivedFrom: substituted,
              ast: ast,
              err: null
            });
          }
        }
      }
    });

    return numFacts;
  }

  // ═══════════════════════════════════════════════════════
  // 6. FORMULA PARSER
  // ═══════════════════════════════════════════════════════

  function tokenize(src) {
    var i = 0, toks = [];
    while (i < src.length) {
      if (/\s/.test(src[i])) { i++; continue; }
      if (src[i] === '↔') { toks.push({ t: 'iff' }); i++; continue; }
      if (src[i] === '→') { toks.push({ t: 'imp' }); i++; continue; }
      if (src[i] === '≡') { toks.push({ t: 'iff' }); i++; continue; }
      if (src[i] === '∧') { toks.push({ t: 'and' }); i++; continue; }
      if (src[i] === '∨') { toks.push({ t: 'or' }); i++; continue; }
      if (src[i] === '¬') { toks.push({ t: 'not' }); i++; continue; }
      if (src[i] === '(') { toks.push({ t: 'lp' }); i++; continue; }
      if (src[i] === ')') { toks.push({ t: 'rp' }); i++; continue; }
      var j = i;
      while (j < src.length && !/[\s()↔→≡∧∨¬]/.test(src[j])) j++;
      if (j > i) { toks.push({ t: 'id', v: src.slice(i, j) }); i = j; continue; }
      throw new Error('Tanınmayan karakter: "' + src[i] + '"');
    }
    return toks;
  }

  /**
   * Parse a formula string into an AST.
   * @param {string} str
   * @returns {object} AST node
   */
  function parseFormula(str) {
    if (!str || !str.trim()) throw new Error('Boş formül');
    str = normLine(str);
    var toks = tokenize(str), p = 0;
    function cur() { return toks[p] || null; }
    function eat(t) {
      if (!cur() || cur().t !== t)
        throw new Error('Beklenen "' + t + '", bulunan ' + (cur() ? '"' + cur().t + '"' : 'son'));
      return toks[p++];
    }
    function pBi() { var l = pIm(); if (cur() && cur().t === 'iff') { p++; var r = pBi(); return { type: 'iff', left: l, right: r }; } return l; }
    function pIm() { var l = pOr(); if (cur() && cur().t === 'imp') { p++; var r = pIm(); return { type: 'imp', left: l, right: r }; } return l; }
    function pOr() { var l = pAnd(); while (cur() && cur().t === 'or') { p++; var r = pAnd(); l = { type: 'or', left: l, right: r }; } return l; }
    function pAnd() { var l = pNot(); while (cur() && cur().t === 'and') { p++; var r = pNot(); l = { type: 'and', left: l, right: r }; } return l; }
    function pNot() { if (cur() && cur().t === 'not') { p++; return { type: 'not', value: pNot() }; } return pAtom(); }
    function pAtom() {
      var t = cur();
      if (!t) throw new Error('Beklenmedik formül sonu');
      if (t.t === 'lp') { p++; var f = pBi(); eat('rp'); return f; }
      if (t.t === 'id') { p++; return { type: 'var', name: t.v }; }
      throw new Error('Beklenmedik: "' + t.t + '"');
    }
    var res = pBi();
    if (p < toks.length) throw new Error('Fazla simge: "' + toks[p].t + '"');
    return res;
  }

  // ═══════════════════════════════════════════════════════
  // 7. LOGIC UTILITIES
  // ═══════════════════════════════════════════════════════

  /**
   * Serialize an AST node to a string.
   * @param {object} n - AST node
   * @returns {string}
   */
  function formulaToString(n) {
    if (!n) return '?';
    switch (n.type) {
      case 'var': return n.name;
      case 'not': return '¬(' + formulaToString(n.value) + ')';
      case 'and': return '(' + formulaToString(n.left) + '∧' + formulaToString(n.right) + ')';
      case 'or': return '(' + formulaToString(n.left) + '∨' + formulaToString(n.right) + ')';
      case 'imp': return '(' + formulaToString(n.left) + '→' + formulaToString(n.right) + ')';
      case 'iff': return '(' + formulaToString(n.left) + '↔' + formulaToString(n.right) + ')';
      default: return '?';
    }
  }

  // Alias for internal use
  var ps = formulaToString;

  function neg(n) { return { type: 'not', value: n }; }
  function eqs(a, b) { return ps(a) === ps(b); }

  function evaluate(n, valuation) {
    switch (n.type) {
      case 'var': return !!valuation[n.name];
      case 'not': return !evaluate(n.value, valuation);
      case 'and': return evaluate(n.left, valuation) && evaluate(n.right, valuation);
      case 'or': return evaluate(n.left, valuation) || evaluate(n.right, valuation);
      case 'imp': return !evaluate(n.left, valuation) || evaluate(n.right, valuation);
      case 'iff': return evaluate(n.left, valuation) === evaluate(n.right, valuation);
    }
    return false;
  }

  function collectVarsFromNode(n, s) {
    if (!s) s = new Set();
    if (!n) return s;
    if (n.type === 'var') s.add(n.name);
    else { collectVarsFromNode(n.left, s); collectVarsFromNode(n.right, s); collectVarsFromNode(n.value, s); }
    return s;
  }

  function depth(n) {
    if (!n || n.type === 'var') return 0;
    if (n.type === 'not') return 1 + depth(n.value);
    return 1 + Math.max(depth(n.left) || 0, depth(n.right) || 0);
  }

  function allSubformulas(n, l, se) {
    if (!l) l = []; if (!se) se = new Set(); if (!n) return l;
    var s = ps(n); if (!se.has(s)) { se.add(s); l.push(n); }
    if (n.left) allSubformulas(n.left, l, se);
    if (n.right) allSubformulas(n.right, l, se);
    if (n.value) allSubformulas(n.value, l, se);
    return l;
  }

  function collectVars(asts) {
    var s = new Set();
    (asts || []).forEach(function (a) { if (a) collectVarsFromNode(a, s); });
    return Array.from(s).sort();
  }

  function allAssignments(vars) {
    var tot = Math.pow(2, vars.length), rows = [];
    for (var i = 0; i < tot; i++) {
      var v = {};
      vars.forEach(function (vr, j) { v[vr] = Boolean((i >> j) & 1); });
      rows.push(v);
    }
    return rows;
  }

  // ═══════════════════════════════════════════════════════
  // 8. NATURAL DEDUCTION
  // ═══════════════════════════════════════════════════════

  /**
   * Attempt natural deduction proof.
   * @param {Array} hyps - Array of AST nodes
   * @param {object} goal - AST node
   * @returns {Array|null} proof steps or null
   */
  function ndProve(hyps, goal) {
    var steps = [], derived = new Set(), ctr = { n: 0 }, LIMIT = 800;

    function fk(a) { return ps(a); }
    function has(a) { return derived.has(fk(a)); }
    function find(a) {
      var k = fk(a);
      for (var i = steps.length - 1; i >= 0; i--)
        if (steps[i].fkey === k) return steps[i];
      return null;
    }

    function add(ast, rule, deps, level, isHyp) {
      var k = fk(ast);
      if (!isHyp && derived.has(k)) return find(ast);
      var s = {
        num: steps.length + 1, fkey: k, fstr: ps(ast), ast: ast,
        rule: rule, deps: deps.map(function (d) { return d && d.num ? d.num : d; }),
        level: level, hyp: !!isHyp
      };
      steps.push(s);
      if (!isHyp) derived.add(k);
      return s;
    }

    function snap() { return { len: steps.length, der: new Set(derived) }; }
    function rollback(sn) {
      steps.length = sn.len;
      derived.clear(); sn.der.forEach(function (x) { derived.add(x); });
    }

    function saturate(level) {
      var changed = true, iters = 0;
      while (changed && iters++ < 50 && ctr.n < LIMIT) {
        changed = false;
        var n = steps.length;
        for (var i = 0; i < n; i++) {
          if (ctr.n++ > LIMIT) return;
          var fi = steps[i].ast, ni = steps[i].num;
          function tryAdd(ast, rule, deps) {
            if (!has(ast)) { add(ast, rule, deps, level); changed = true; return true; }
            return false;
          }
          if (fi.type === 'not' && fi.value && fi.value.type === 'not') tryAdd(fi.value.value, '¬¬E', [ni]);
          if (fi.type === 'and') { tryAdd(fi.left, '∧E', [ni]); tryAdd(fi.right, '∧E', [ni]); }
          if (fi.type === 'iff') {
            tryAdd({ type: 'imp', left: fi.left, right: fi.right }, '↔E', [ni]);
            tryAdd({ type: 'imp', left: fi.right, right: fi.left }, '↔E', [ni]);
          }
          if (fi.type === 'not' && fi.value && fi.value.type === 'and')
            tryAdd({ type: 'or', left: neg(fi.value.left), right: neg(fi.value.right) }, 'De Morgan', [ni]);
          if (fi.type === 'not' && fi.value && fi.value.type === 'or')
            tryAdd({ type: 'and', left: neg(fi.value.left), right: neg(fi.value.right) }, 'De Morgan', [ni]);
          for (var j = 0; j < n; j++) {
            if (i === j) continue;
            var fj = steps[j].ast, nj = steps[j].num;
            if (fi.type === 'imp' && eqs(fi.left, fj)) tryAdd(fi.right, '→E', [ni, nj]);
            if (fi.type === 'imp' && fj.type === 'not' && eqs(fi.right, fj.value)) tryAdd(neg(fi.left), 'MT', [ni, nj]);
            if (fi.type === 'or') {
              if (fj.type === 'not' && eqs(fi.left, fj.value)) tryAdd(fi.right, 'DS', [ni, nj]);
              if (fj.type === 'not' && eqs(fi.right, fj.value)) tryAdd(fi.left, 'DS', [ni, nj]);
            }
            if (fi.type === 'imp' && fj.type === 'imp' && eqs(fi.right, fj.left))
              tryAdd({ type: 'imp', left: fi.left, right: fj.right }, 'HS', [ni, nj]);
          }
        }
      }
    }

    function findContr() {
      for (var i = 0; i < steps.length; i++) {
        var fi = steps[i].ast;
        if (fi.type === 'not' && fi.value) { var p2 = find(fi.value); if (p2) return [steps[i], p2]; }
        else { var q = find(neg(fi)); if (q) return [steps[i], q]; }
      }
      return null;
    }

    function prove(goal, level, depthVal) {
      if (ctr.n++ > LIMIT || depthVal > 8) return false;
      saturate(level);
      if (has(goal)) return true;
      var sn = snap();

      if (goal.type === 'imp') {
        var h = add(goal.left, 'Varsayım', [], level + 1, true);
        if (prove(goal.right, level + 1, depthVal + 1)) {
          var c = find(goal.right); add(goal, '→I', [h.num, c.num], level); return true;
        }
        rollback(sn); return false;
      }
      if (goal.type === 'and') {
        if (prove(goal.left, level, depthVal + 1) && prove(goal.right, level, depthVal + 1)) {
          add(goal, '∧I', [find(goal.left).num, find(goal.right).num], level); return true;
        }
        rollback(sn); return false;
      }
      if (goal.type === 'or') {
        var sn2 = snap();
        if (prove(goal.left, level, depthVal + 1)) { add(goal, '∨I', [find(goal.left).num], level); return true; }
        rollback(sn2);
        if (prove(goal.right, level, depthVal + 1)) { add(goal, '∨I', [find(goal.right).num], level); return true; }
        rollback(sn); return false;
      }
      if (goal.type === 'iff') {
        var ab = { type: 'imp', left: goal.left, right: goal.right };
        var ba = { type: 'imp', left: goal.right, right: goal.left };
        if (prove(ab, level, depthVal + 1) && prove(ba, level, depthVal + 1)) {
          add(goal, '↔I', [find(ab).num, find(ba).num], level); return true;
        }
        rollback(sn); return false;
      }
      if (goal.type === 'not') {
        var h2 = add(goal.value, 'Varsayım (RAA)', [], level + 1, true);
        saturate(level + 1);
        var ct = findContr();
        if (ct) { add(goal, '¬I (RAA)', [h2.num, ct[0].num, ct[1].num], level); return true; }
        if (prove(neg(goal.value), level + 1, depthVal + 1)) {
          ct = findContr();
          if (ct) { add(goal, '¬I (RAA)', [h2.num, ct[0].num, ct[1].num], level); return true; }
        }
        rollback(sn); return false;
      }
      for (var i = 0; i < steps.length; i++) {
        var st = steps[i];
        if (st.ast.type === 'or') {
          var disj = st.ast, dn = st.num;
          var sn3 = snap();
          var h3 = add(disj.left, 'Varsayım (∨E)', [], level + 1, true);
          if (prove(goal, level + 1, depthVal + 1)) {
            var c1 = find(goal).num;
            var sn4 = snap(); rollback(sn3);
            var h4 = add(disj.right, 'Varsayım (∨E)', [], level + 1, true);
            if (prove(goal, level + 1, depthVal + 1)) {
              add(goal, '∨E', [dn, c1, find(goal).num], level); return true;
            }
            rollback(sn4);
          }
          rollback(sn3);
        }
      }
      return false;
    }

    hyps.forEach(function (h) { add(h, 'Aksiyom', [], 0, false); });
    var ok = prove(goal, 0, 0);
    if (!ok) { saturate(0); if (!has(goal)) return null; }
    steps.forEach(function (s, i) { s.num = i + 1; });
    return steps;
  }

  // ═══════════════════════════════════════════════════════
  // 9. RESOLUTION
  // ═══════════════════════════════════════════════════════

  function toCNF(n) {
    function elBi(n) { if (!n || n.type === 'var') return n; if (n.type === 'not') return { type: 'not', value: elBi(n.value) }; if (n.type === 'iff') return elBi({ type: 'and', left: { type: 'imp', left: n.left, right: n.right }, right: { type: 'imp', left: n.right, right: n.left } }); return { type: n.type, left: elBi(n.left), right: elBi(n.right) }; }
    function elImp(n) { if (!n || n.type === 'var') return n; if (n.type === 'not') return { type: 'not', value: elImp(n.value) }; if (n.type === 'imp') return elImp({ type: 'or', left: { type: 'not', value: n.left }, right: n.right }); return { type: n.type, left: elImp(n.left), right: elImp(n.right) }; }
    function pushNeg(n) { if (!n || n.type === 'var') return n; if (n.type === 'not') { var v = n.value; if (v.type === 'not') return pushNeg(v.value); if (v.type === 'and') return pushNeg({ type: 'or', left: { type: 'not', value: v.left }, right: { type: 'not', value: v.right } }); if (v.type === 'or') return pushNeg({ type: 'and', left: { type: 'not', value: v.left }, right: { type: 'not', value: v.right } }); return { type: 'not', value: pushNeg(v) }; } return { type: n.type, left: pushNeg(n.left), right: pushNeg(n.right) }; }
    function dist(n) { if (!n || n.type === 'var' || n.type === 'not') return n; if (n.type === 'and') return { type: 'and', left: dist(n.left), right: dist(n.right) }; var l = dist(n.left), r = dist(n.right); if (r.type === 'and') return dist({ type: 'and', left: { type: 'or', left: l, right: r.left }, right: { type: 'or', left: l, right: r.right } }); if (l.type === 'and') return dist({ type: 'and', left: { type: 'or', left: l.left, right: r }, right: { type: 'or', left: l.right, right: r } }); return { type: 'or', left: l, right: r }; }
    function getLits(n) { if (n.type === 'or') return getLits(n.left).concat(getLits(n.right)); if (n.type === 'var') return [{ pos: true, name: n.name }]; if (n.type === 'not' && n.value && n.value.type === 'var') return [{ pos: false, name: n.value.name }]; throw new Error('CNF hatası'); }
    function getCls(n) { if (n.type === 'and') return getCls(n.left).concat(getCls(n.right)); return [getLits(n)]; }
    function dd(c) { var s = new Set(), r = []; c.forEach(function (l) { var k = (l.pos ? '+' : '-') + l.name; if (!s.has(k)) { s.add(k); r.push(l); } }); return r; }
    function taut(c) { var ps2 = new Set(c.filter(function (l) { return l.pos; }).map(function (l) { return l.name; })); return c.some(function (l) { return !l.pos && ps2.has(l.name); }); }
    var r = dist(pushNeg(elImp(elBi(n))));
    return getCls(r).map(dd).filter(function (c) { return !taut(c); });
  }

  function clauseKey(c) { return c.map(function (l) { return (l.pos ? '+' : '-') + l.name; }).sort().join('|'); }

  /**
   * Serialize a clause to string.
   * @param {Array} c
   * @returns {string}
   */
  function clauseToString(c) {
    if (!c.length) return '⊥';
    return c.map(function (l) { return (l.pos ? '' : '¬') + l.name; }).join('∨');
  }

  function doResolve(c1, c2) {
    var res = [];
    for (var i = 0; i < c1.length; i++) for (var j = 0; j < c2.length; j++) {
      if (c1[i].name === c2[j].name && c1[i].pos !== c2[j].pos) {
        var merged = c1.filter(function (_, k) { return k !== i; }).concat(c2.filter(function (_, k) { return k !== j; }));
        var seen = new Set(), r = [];
        merged.forEach(function (l) { var k = (l.pos ? '+' : '-') + l.name; if (!seen.has(k)) { seen.add(k); r.push(l); } });
        var pos = new Set(r.filter(function (l) { return l.pos; }).map(function (l) { return l.name; }));
        if (!r.some(function (l) { return !l.pos && pos.has(l.name); }))
          res.push({ clause: r, lit: c1[i].name });
      }
    }
    return res;
  }

  /**
   * Attempt resolution proof.
   * @param {Array} hyps - AST nodes
   * @param {object} goal - AST node
   * @returns {Array|null} resolution steps or null
   */
  function resolutionProve(hyps, goal) {
    var MAX = 500, steps = [], keySet = new Set();
    function addClause(c, rule, from, lit, src) {
      var k = clauseKey(c);
      if (keySet.has(k)) return false;
      keySet.add(k);
      steps.push({ clause: c, rule: rule, from: from || [], lit: lit || '', src: src || '', num: steps.length + 1 });
      return true;
    }
    hyps.forEach(function (h, i) {
      try { toCNF(h).forEach(function (c) { addClause(c, 'Aksiyom', [], '', (i + 1)); }); } catch (e) { }
    });
    try { toCNF(neg(goal)).forEach(function (c) { addClause(c, '¬Hedef', [], '', -1); }); } catch (e) { return null; }
    if (keySet.has(clauseKey([]))) return steps;
    var changed = true;
    while (changed && steps.length < MAX) {
      changed = false;
      var n = steps.length;
      for (var i = 0; i < n && steps.length < MAX; i++) {
        for (var j = i + 1; j < n && steps.length < MAX; j++) {
          doResolve(steps[i].clause, steps[j].clause).forEach(function (r) {
            if (addClause(r.clause, 'Çözünürlük', [steps[i].num, steps[j].num], r.lit)) changed = true;
          });
          if (keySet.has(clauseKey([]))) return steps;
        }
      }
    }
    return null;
  }

  // ═══════════════════════════════════════════════════════
  // 10. ANALYTIC TABLEAU
  // ═══════════════════════════════════════════════════════

  var TAB_LIMIT = 400;

  function tIsLit(n) { return n.type === 'var' || (n.type === 'not' && n.value && n.value.type === 'var'); }

  function tRule(n) {
    if (tIsLit(n)) return null;
    if (n.type === 'and') return { a: true, fs: [n.left, n.right], sym: '∧' };
    if (n.type === 'or') return { a: false, l: [n.left], r: [n.right], sym: '∨' };
    if (n.type === 'imp') return { a: false, l: [neg(n.left)], r: [n.right], sym: '→' };
    if (n.type === 'iff') return { a: false, l: [n.left, n.right], r: [neg(n.left), neg(n.right)], sym: '↔' };
    if (n.type === 'not') {
      var v = n.value; if (!v) return null;
      if (v.type === 'not') return { a: true, fs: [v.value], sym: '¬¬' };
      if (v.type === 'and') return { a: false, l: [neg(v.left)], r: [neg(v.right)], sym: '¬∧' };
      if (v.type === 'or') return { a: true, fs: [neg(v.left), neg(v.right)], sym: '¬∨' };
      if (v.type === 'imp') return { a: true, fs: [v.left, neg(v.right)], sym: '¬→' };
      if (v.type === 'iff') return { a: false, l: [v.left, neg(v.right)], r: [neg(v.left), v.right], sym: '¬↔' };
    }
    return null;
  }

  function tContr(items) {
    var pos = {}, negMap = {};
    items.forEach(function (it) {
      var n = it.ast;
      if (n.type === 'var') pos[n.name] = it.row;
      else if (n.type === 'not' && n.value && n.value.type === 'var') negMap[n.value.name] = it.row;
    });
    for (var nm in pos) if (Object.prototype.hasOwnProperty.call(negMap, nm)) return [pos[nm], negMap[nm]];
    return null;
  }

  function tBuild(segRows, allPath, proc, rc) {
    if (rc.n > TAB_LIMIT) throw new Error('Çizelge sınırı aşıldı.');
    var ct = tContr(allPath);
    if (ct) return { type: 'closed', rows: segRows, by: ct };
    var toP = null;
    for (var i = 0; i < allPath.length; i++)
      if (!proc.has(allPath[i].row) && tRule(allPath[i].ast)) { toP = allPath[i]; break; }
    if (!toP) return { type: 'open', rows: segRows };
    var np = new Set(proc); np.add(toP.row);
    var rule = tRule(toP.ast);
    if (rule.a) {
      var ni = rule.fs.map(function (f) { return { row: ++rc.n, ast: f, from: toP.row, sym: rule.sym }; });
      return { type: 'alpha', rows: segRows, procRow: toP.row, child: tBuild(ni, allPath.concat(ni), np, rc) };
    }
    var li = rule.l.map(function (f) { return { row: ++rc.n, ast: f, from: toP.row, sym: rule.sym }; });
    var ri = rule.r.map(function (f) { return { row: ++rc.n, ast: f, from: toP.row, sym: rule.sym }; });
    return {
      type: 'beta', rows: segRows, procRow: toP.row,
      left: tBuild(li, allPath.concat(li), np, rc),
      right: tBuild(ri, allPath.concat(ri), np, rc)
    };
  }

  function tAllClosed(seg) {
    if (seg.type === 'closed') return true;
    if (seg.type === 'open') return false;
    if (seg.type === 'alpha') return tAllClosed(seg.child);
    return tAllClosed(seg.left) && tAllClosed(seg.right);
  }

  function tMarkProc(seg, set) {
    if (seg.procRow) set.add(seg.procRow);
    if (seg.child) tMarkProc(seg.child, set);
    if (seg.left) tMarkProc(seg.left, set);
    if (seg.right) tMarkProc(seg.right, set);
  }

  function tGetModel(seg) {
    if (seg.type === 'open') {
      var m = {};
      (seg.rows || []).forEach(function (it) {
        if (it.ast.type === 'var') m[it.ast.name] = true;
        else if (it.ast.type === 'not' && it.ast.value && it.ast.value.type === 'var') m[it.ast.value.name] = false;
      });
      return m;
    }
    if (seg.type === 'alpha') return tGetModel(seg.child);
    if (seg.type === 'beta') {
      if (!tAllClosed(seg.left)) return tGetModel(seg.left);
      if (!tAllClosed(seg.right)) return tGetModel(seg.right);
    }
    return null;
  }

  /**
   * Build analytic tableau for given formulas.
   * @param {Array} hyps - AST nodes
   * @param {object} goal - AST node
   * @returns {{ tree: object, closed: boolean, model: object|null, processedRows: Set }}
   */
  function buildTableau(hyps, goal) {
    var formulas = hyps.concat(goal ? [neg(goal)] : []);
    if (!formulas.length) return null;
    var rc = { n: formulas.length };
    var si = formulas.map(function (ast, i) { return { row: i + 1, ast: ast, from: null, sym: null }; });
    var tree = tBuild(si, si, new Set(), rc);
    var processedRows = new Set();
    tMarkProc(tree, processedRows);
    var closed = tAllClosed(tree);
    var model = closed ? null : tGetModel(tree);
    return { tree: tree, closed: closed, model: model, processedRows: processedRows };
  }

  // ═══════════════════════════════════════════════════════
  // 11. TRUTH TABLE
  // ═══════════════════════════════════════════════════════

  /**
   * Build a truth table for given hypotheses and goal.
   * @param {Array} hyps - AST nodes
   * @param {object|null} goal - AST node
   * @returns {{ vars, rows, subformulas, proved, validRows, status }}
   */
  function buildTruthTable(hyps, goal) {
    var allAsts = hyps.concat(goal ? [goal] : []);
    var vars = collectVars(allAsts);
    if (vars.length > 14) throw new Error('Çok fazla değişken (' + vars.length + '). Maks 14.');
    var assigns = allAssignments(vars);

    var seen = new Set(vars);
    var subformulas = [];
    allAsts.forEach(function (a) {
      allSubformulas(a).sort(function (x, y) {
        return depth(x) - depth(y) || ps(x).localeCompare(ps(y));
      }).forEach(function (e) {
        var k = ps(e); if (!seen.has(k)) { seen.add(k); subformulas.push(e); }
      });
    });

    var hypStrs = hyps.map(ps);
    var goalStr = goal ? ps(goal) : null;

    var rows = assigns.map(function (vals) {
      var row = {};
      vars.forEach(function (v) { row[v] = vals[v]; });
      subformulas.forEach(function (e) { row[ps(e)] = evaluate(e, vals); });
      return row;
    });

    var validRows = rows.filter(function (r) { return hyps.every(function (h) { return r[ps(h)]; }); });
    var proved = goal && validRows.length > 0 && validRows.every(function (r) { return r[goalStr]; });

    var status = null;
    if (!hyps.length && goal) {
      var allD = rows.every(function (r) { return r[goalStr]; });
      var anyD = rows.some(function (r) { return r[goalStr]; });
      status = allD ? 'tautology' : anyD ? 'contingent' : 'contradiction';
    }

    return {
      vars: vars,
      subformulas: subformulas,
      hypStrs: hypStrs,
      goalStr: goalStr,
      rows: rows,
      validRows: validRows,
      proved: proved,
      status: status
    };
  }

  // ═══════════════════════════════════════════════════════
  // 12. MAIN PROVE ENTRY POINT
  // ═══════════════════════════════════════════════════════

  /**
   * Parse input, run all proof engines, and return full result.
   * @param {string} inputText - Raw editor text
   * @returns {ProveResult}
   *
   * @typedef {Object} ProveResult
   * @property {boolean} proved
   * @property {string} goalStr
   * @property {Array} axioms
   * @property {object|null} goal
   * @property {Array} instances
   * @property {Array} numFacts
   * @property {Array} allEffective
   * @property {Array|null} ndSteps
   * @property {Array|null} resSteps
   * @property {{ tree, closed, model, processedRows }|null} tableau
   * @property {{ vars, rows, subformulas, proved, validRows, status }|null} truthTable
   * @property {Array} errors
   */
  function prove(inputText) {
    var parsed = parseEditorText(inputText);
    var errors = [];

    parsed.axioms.forEach(function (ax) {
      if (!ax.type && ax.err) errors.push(ax.name + ': ' + ax.err);
    });
    if (parsed.goal && parsed.goal.err) errors.push('Hedef: ' + parsed.goal.err);
    if (!parsed.goal) errors.push('Hedef belirtilmedi. "|- formül" veya "⊢ formül" şeklinde yazın.');

    if (errors.length) {
      return {
        proved: false, goalStr: null,
        axioms: parsed.axioms, goal: parsed.goal,
        instances: [], numFacts: [], allEffective: [],
        ndSteps: null, resSteps: null, tableau: null, truthTable: null,
        errors: errors
      };
    }

    var instances = instantiateQuantifiers(parsed.axioms);
    var numFacts = computeNumericFacts(parsed.axioms, parsed.goal.ast);

    var regularAxioms = parsed.axioms.filter(function (ax) { return !ax.type && ax.ast; });
    var validInstances = instances.filter(function (inst) { return inst.ast && !inst.err; });
    var allEffective = regularAxioms.concat(validInstances).concat(numFacts);

    var hyps = allEffective.map(function (ax) { return ax.ast; });
    var goal = parsed.goal.ast;
    var goalStr = ps(goal);

    var ndSteps = null, resSteps = null, tableau = null, truthTable = null;
    try { ndSteps = ndProve(hyps, goal); } catch (e) { }
    try { resSteps = resolutionProve(hyps, goal); } catch (e) { }
    try { tableau = buildTableau(hyps, goal); } catch (e) { }
    try { truthTable = buildTruthTable(hyps, goal); } catch (e) { }

    var proved = !!(ndSteps || resSteps || (tableau && tableau.closed));

    return {
      proved: proved,
      goalStr: goalStr,
      axioms: parsed.axioms,
      goal: parsed.goal,
      instances: instances,
      numFacts: numFacts,
      allEffective: allEffective,
      ndSteps: ndSteps,
      resSteps: resSteps,
      tableau: tableau,
      truthTable: truthTable,
      errors: errors
    };
  }

  // ═══════════════════════════════════════════════════════
  // PUBLIC API
  // ═══════════════════════════════════════════════════════

  return {
    // Main entry point
    prove: prove,

    // Parsing
    parseEditorText: parseEditorText,
    parseFormula: parseFormula,
    normalizeFormula: normalizeFormula,

    // Serialization
    formulaToString: formulaToString,
    clauseToString: clauseToString,

    // Individual engines
    ndProve: ndProve,
    resolutionProve: resolutionProve,
    buildTableau: buildTableau,
    buildTruthTable: buildTruthTable,

    // Helpers
    instantiateQuantifiers: instantiateQuantifiers,
    computeNumericFacts: computeNumericFacts,
    evaluate: evaluate,
    collectVars: collectVars,
    toCNF: toCNF,

    // Version
    version: '1.0.0'
  };
});