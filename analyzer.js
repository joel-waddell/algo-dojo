/* Lightweight JS tokenizer, syntax highlighter and heuristic complexity scanner. */
(function(){
  const KW = new Set('break case catch class const continue debugger default delete do else export extends finally for function if import in instanceof let new of return super switch this throw try typeof var void while with yield async await null undefined true false'.split(' '));
  const BUILTIN = new Set('Math Map Set Array Object String Number JSON Infinity NaN console ListNode TreeNode MinHeap BigInt Symbol'.split(' '));

  function tokenize(src){
    const out = []; let i = 0, line = 1; const n = src.length;
    const push = (t, v) => { out.push({ t, v, line }); line += (v.match(/\n/g) || []).length; };
    while (i < n){
      const c = src[i], d = src[i + 1];
      if (c === '/' && d === '/'){ let j = src.indexOf('\n', i); if (j < 0) j = n; push('c', src.slice(i, j)); i = j; continue; }
      if (c === '/' && d === '*'){ let j = src.indexOf('*/', i + 2); j = j < 0 ? n : j + 2; push('c', src.slice(i, j)); i = j; continue; }
      if (c === '"' || c === "'" || c === '`'){
        let j = i + 1, depth = 0;
        while (j < n){
          if (src[j] === '\\'){ j += 2; continue; }
          if (c === '`' && src[j] === '$' && src[j + 1] === '{'){ depth++; j += 2; continue; }
          if (c === '`' && depth && src[j] === '}'){ depth--; j++; continue; }
          if (src[j] === c && !depth){ j++; break; }
          if (c !== '`' && src[j] === '\n') break;
          j++;
        }
        push('s', src.slice(i, j)); i = j; continue;
      }
      if (/\s/.test(c)){ let j = i; while (j < n && /\s/.test(src[j])) j++; push('w', src.slice(i, j)); i = j; continue; }
      if (/[0-9]/.test(c) || (c === '.' && /[0-9]/.test(d))){ let j = i; while (j < n && /[0-9a-fA-FxXoObBn_.eE]/.test(src[j])) j++; push('n', src.slice(i, j)); i = j; continue; }
      if (/[A-Za-z_$]/.test(c)){ let j = i; while (j < n && /[A-Za-z0-9_$]/.test(src[j])) j++; const v = src.slice(i, j); push(KW.has(v) ? 'k' : 'i', v); i = j; continue; }
      const three = src.substr(i, 3), two = src.substr(i, 2);
      if (['...', '===', '!==', '>>>', '**=', '<<=', '>>='].includes(three)){ push('p', three); i += 3; continue; }
      if (['=>', '==', '!=', '<=', '>=', '&&', '||', '??', '?.', '++', '--', '+=', '-=', '*=', '/=', '%=', '>>', '<<', '**', '|=', '&=', '^='].includes(two)){ push('p', two); i += 2; continue; }
      push('p', c); i++;
    }
    return out;
  }

  const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  function highlight(src, hlLines){
    const toks = tokenize(src);
    let html = '';
    toks.forEach((tk, idx) => {
      let cls = null;
      if (tk.t === 'c') cls = 'tk-c'; else if (tk.t === 's') cls = 'tk-s'; else if (tk.t === 'n') cls = 'tk-n'; else if (tk.t === 'k') cls = 'tk-k';
      else if (tk.t === 'i'){
        let j = idx + 1; while (toks[j] && toks[j].t === 'w') j++;
        if (BUILTIN.has(tk.v)) cls = 'tk-b'; else if (toks[j] && toks[j].v === '(') cls = 'tk-f';
      }
      html += cls ? `<span class="${cls}">${esc(tk.v)}</span>` : esc(tk.v);
    });
    // wrap lines (spans never cross lines except comments/templates; close/reopen safely by splitting on raw text lines when needed)
    if (!hlLines || !hlLines.length) return html;
    const lines = html.split('\n');
    return lines.map((l, i) => `<span class="ln${hlLines.includes(i + 1) ? ' hl' : ''}">${l || ' '}</span>`).join('');
  }

  const ITER = new Set(['forEach', 'map', 'filter', 'reduce', 'reduceRight', 'some', 'every', 'find', 'findIndex', 'findLast', 'findLastIndex', 'flatMap']);
  const LINEAR = { includes: 'scans the array/string', indexOf: 'scans the array/string', lastIndexOf: 'scans the array', slice: 'copies elements', splice: 'shifts elements', shift: 'shifts every element left', unshift: 'shifts every element right', concat: 'copies both arrays', join: 'visits every element', split: 'visits every character', reverse: 'visits every element', fill: 'writes every slot', keys: 'builds an array of all keys', values: 'builds an array of all values', entries: 'builds an array of all entries', stringify: 'serializes the whole value', repeat: 'builds a string of that length', flat: 'copies elements', substring: 'copies characters', toSorted: 'sorts a copy (n log n)', from: 'copies an iterable' };

  function analyze(src){
    const all = tokenize(src);
    const T = all.filter(t => t.t !== 'w' && t.t !== 'c');
    const findings = []; const stack = []; // entries: {ch:'{'|'(', loop:bool, kind:'n'|'log'|..., virtual}
    const funcs = []; // {name, depthIndex, selfCalls, line, memo}
    let pendingLoop = null; // {kind, line} -> next '{' becomes a loop block
    let awaitHeader = null; // for/while header paren tracking
    let maxPath = { n: 0, log: 0 };
    const loopKinds = () => stack.filter(s => s.loop).map(s => s.kind);
    const pathCost = (extra) => { const ks = loopKinds(); if (extra) ks.push(extra); return { n: ks.filter(k => k === 'n').length, log: ks.filter(k => k === 'log').length, nlog: ks.filter(k => k === 'nlog').length }; };
    const consider = (c) => { const n = c.n + (c.nlog || 0), log = c.log + (c.nlog || 0); if (n > maxPath.n || (n === maxPath.n && log > maxPath.log)) maxPath = { n, log }; };
    const curFunc = () => { for (let k = stack.length - 1; k >= 0; k--) if (stack[k].func) return stack[k].func; return null; };
    const loops = [];

    const isHalving = (from, to) => { for (let k = from; k < to && k < T.length; k++){ const v = T[k].v; if (v === 'mid' || v === '>>' || v === '>>=' || v === '>>>' || ((v === '/' || v === '/=' || v === '*=') && T[k + 1] && T[k + 1].v === '2') || (v === 'Math' && T[k + 2] && T[k + 2].v === 'log2')) return true; } return false; };
    const blockEnd = (k) => { // index of matching close for T[k] which is '{' or '('
      const open = T[k].v, close = open === '{' ? '}' : ')'; let d = 0; for (let j = k; j < T.length; j++){ if (T[j].v === open) d++; else if (T[j].v === close){ d--; if (!d) return j; } } return T.length; };

    for (let k = 0; k < T.length; k++){
      const tk = T[k], v = tk.v, prev = T[k - 1], next = T[k + 1];
      if (tk.virtualLoop){ stack.push({ ch: 'v', loop: true, kind: tk.virtualLoop, virtual: true }); consider(pathCost()); }
      // function declarations
      if (v === 'function' && next && next.t === 'i' && T[k + 2] && T[k + 2].v === '('){ const pe = blockEnd(k + 2); if (T[pe + 1] && T[pe + 1].v === '{') T[pe + 1].funcName = next.v; }
      if ((v === 'const' || v === 'let' || v === 'var') && next && next.t === 'i' && T[k + 2] && T[k + 2].v === '='){
        // const f = (..) => {  |  const f = function(..){  | const f = x => {
        let j = k + 3; if (T[j] && T[j].v === 'async') j++;
        if (T[j] && T[j].v === 'function'){ j++; if (T[j] && T[j].t === 'i') j++; }
        if (T[j] && T[j].v === '('){ const pe = blockEnd(j); let q = pe + 1; if (T[q] && T[q].v === '=>') q++; if (T[q] && T[q].v === '{') T[q].funcName = next.v; }
        else if (T[j] && T[j].t === 'i' && T[j + 1] && T[j + 1].v === '=>' && T[j + 2] && T[j + 2].v === '{') T[j + 2].funcName = next.v;
      }
      if ((v === 'for' || v === 'while') && next && next.v === '('){
        if (v === 'while' && prev && prev.v === '}' && prev.closedDo) continue;
        const he = blockEnd(k + 1);
        let bodyEnd = T[he + 1] && T[he + 1].v === '{' ? blockEnd(he + 1) : he + 1;
        const headerHalving = isHalving(k + 1, he);
        const bodyHalving = v === 'while' && isHalving(he + 1, bodyEnd);
        const kind = (headerHalving || bodyHalving) ? 'log' : 'n';
        const isForOfObj = false;
        loops.push({ line: tk.line, kind, kw: v });
        if (T[he + 1] && T[he + 1].v === '{') T[he + 1].loopKind = kind; else T[he + 1] && (T[he + 1].virtualLoop = kind);
        continue;
      }
      if (v === 'do' && next && next.v === '{'){ next.loopKind = 'n'; next.isDo = true; loops.push({ line: tk.line, kind: 'n', kw: 'do' }); continue; }
      if (v === '{' || v === '('){
        const entry = { ch: v, loop: false, line: tk.line };
        if (v === '{' && tk.loopKind){ entry.loop = true; entry.kind = tk.loopKind; entry.isDo = tk.isDo; }
        if (v === '(' && tk.iterParen){ entry.loop = true; entry.kind = tk.iterParen; }
        if (v === '{' && tk.funcName){ entry.func = { name: tk.funcName, selfCalls: 0, lines: [], line: tk.line, memo: false }; funcs.push(entry.func); }
        stack.push(entry);
        if (entry.loop) consider(pathCost());
        continue;
      }
      if (v === '}' || v === ')'){
        const e = stack.pop(); if (e && e.isDo) tk.closedDo = true;
        while (stack.length && stack[stack.length - 1].virtual && v === '}'){ /* virtual loops end at ; */ break; }
        continue;
      }
      if (v === ';'){ while (stack.length && stack[stack.length - 1].virtual) stack.pop(); }
      // method calls
      if (prev && (prev.v === '.' || prev.v === '?.') && tk.t === 'i' && next && next.v === '('){
        if (ITER.has(v)){ next.iterParen = 'n'; const c = pathCost('n'); consider(c); findings.push({ line: tk.line, sev: c.n > 1 ? 'warn' : 'info', msg: `.${v}() loops over every element${c.n > 1 ? `, and it sits inside ${c.n - 1} other loop(s)` : ''}.` }); }
        else if (v === 'sort' || v === 'toSorted'){ const c = pathCost('nlog'); consider(c); findings.push({ line: tk.line, sev: loopKinds().length ? 'warn' : 'info', msg: `.${v}() costs O(n log n)${loopKinds().length ? ' and runs inside a loop, so that cost repeats every iteration' : ''}.` }); }
        else if (LINEAR[v] && !(v === 'keys' || v === 'values' || v === 'entries') || ((v === 'keys' || v === 'values' || v === 'entries') && T[k - 2] && T[k - 2].v === 'Object') || (v === 'stringify' && T[k - 2] && T[k - 2].v === 'JSON') || (v === 'from' && T[k - 2] && T[k - 2].v === 'Array')){
          if ((v === 'slice' || v === 'substring') && false) {}
          const inLoop = loopKinds().length;
          const c = pathCost('n'); if (inLoop) consider(c);
          findings.push({ line: tk.line, sev: inLoop ? 'warn' : 'info', msg: `.${v}() is O(n): it ${LINEAR[v]}.${inLoop ? ' It runs inside a loop, so it multiplies the loop\'s cost (hidden nested loop).' : ''}` });
        }
        else if ((v === 'has' || v === 'get' || v === 'set' || v === 'add' || v === 'delete' || v === 'push' || v === 'pop') && loopKinds().length){
          // O(1) ops: nothing to flag
        }
      }
      if (v === '...' && loopKinds().length){ const c = pathCost('n'); consider(c); findings.push({ line: tk.line, sev: 'warn', msg: 'Spread (...) copies every element, and here it runs inside a loop.' }); }
      if (v === 'new' && next && (next.v === 'Set' || next.v === 'Map') && T[k + 2] && T[k + 2].v === '(' && T[k + 3] && T[k + 3].v !== ')' && loopKinds().length){ const c = pathCost('n'); consider(c); findings.push({ line: tk.line, sev: 'warn', msg: `new ${next.v}(iterable) copies every element, inside a loop.` }); }
      if (v === '+=' && next && next.t === 's' && loopKinds().length){ findings.push({ line: tk.line, sev: 'info', msg: 'String += in a loop. Engines usually optimize this, but in an interview say "builds a new string each time; I could push to an array and join".' }); }
      // recursion
      if (tk.t === 'i' && next && next.v === '(' && !(prev && (prev.v === '.' || prev.v === 'function'))){
        for (let s = stack.length - 1; s >= 0; s--){ const f = stack[s].func; if (f && f.name === v){ f.selfCalls++; f.lines.push(tk.line); break; } }
      }
      if (tk.t === 'i' && /^(memo|cache|dp|seen|visited)$/i.test(v)){ const f = curFunc(); if (f) f.memo = true; for (const ff of funcs) if (stack.some(s => s.func === ff)) ff.memo = ff.memo || /memo|cache|dp/i.test(v); }
    }

    // summarize
    const recursive = funcs.filter(f => f.selfCalls > 0);
    recursive.forEach(f => {
      if (f.selfCalls >= 2 && !f.memo) findings.push({ line: f.lines[0], sev: 'warn', msg: `${f.name}() calls itself ${f.selfCalls} times per call (branching recursion). Without memoization that is roughly O(${f.selfCalls}^depth), i.e. exponential.` });
      else if (f.selfCalls >= 2 && f.memo) findings.push({ line: f.lines[0], sev: 'info', msg: `${f.name}() branches into ${f.selfCalls} recursive calls but looks memoized: cost ≈ (number of distinct states) × (work per state).` });
      else findings.push({ line: f.lines[0], sev: 'info', msg: `${f.name}() is recursive (one self-call). Cost ≈ recursion depth × work per call; space includes the call stack O(depth).` });
    });
    loops.forEach(l => { if (l.kind === 'log') findings.push({ line: l.line, sev: 'info', msg: `This ${l.kw} loop halves/doubles something each step, so it likely runs O(log n) times.` }); });

    let estimate;
    if (recursive.some(f => f.selfCalls >= 2 && !f.memo)) estimate = 'O(2ⁿ)-ish (branching recursion)';
    else {
      const { n, log } = maxPath;
      const parts = [];
      if (n === 1) parts.push('n'); else if (n > 1) parts.push('n' + ['', '', '²', '³', '⁴', '⁵'][Math.min(n, 5)]);
      if (log === 1) parts.push('log n'); else if (log > 1) parts.push(`log${['', '', '²', '³'][Math.min(log, 3)]} n`);
      estimate = 'O(' + (parts.join(' ') || '1') + ')';
      if (recursive.length) estimate += ' per call, × recursion';
    }
    findings.sort((a, b) => a.line - b.line);
    return { estimate, findings, loops, funcs, maxPath };
  }

  function firstFunctionName(src){
    const m = src.match(/function\s+([A-Za-z_$][\w$]*)/) || src.match(/(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=\s*(?:async\s*)?(?:function|\(|[A-Za-z_$][\w$]*\s*=>)/);
    return m ? m[1] : '';
  }

  window.JSA = { tokenize, highlight, analyze, firstFunctionName };
})();
