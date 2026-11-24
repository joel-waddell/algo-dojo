/* Runs user code in a sandboxed Web Worker (blob URL) so infinite loops can be killed. */
(function(){
  function workerMain(){
    // ---- helpers available to user code ----
    class ListNode { constructor(val = 0, next = null){ this.val = val; this.next = next; } }
    class TreeNode { constructor(val = 0, left = null, right = null){ this.val = val; this.left = left; this.right = right; } }
    class MinHeap {
      // new MinHeap() for numbers, or new MinHeap((a, b) => a[0] - b[0]) for custom order
      constructor(cmp = (a, b) => a - b){ this.cmp = cmp; this.a = []; }
      get size(){ return this.a.length; }
      peek(){ return this.a[0]; }
      push(x){ const a = this.a; a.push(x); let i = a.length - 1;
        while (i > 0){ const p = (i - 1) >> 1; if (this.cmp(a[i], a[p]) >= 0) break; [a[i], a[p]] = [a[p], a[i]]; i = p; } }
      pop(){ const a = this.a; if (!a.length) return undefined; const top = a[0], last = a.pop();
        if (a.length){ a[0] = last; let i = 0; for(;;){ const l = 2*i+1, r = l+1; let m = i;
          if (l < a.length && this.cmp(a[l], a[m]) < 0) m = l; if (r < a.length && this.cmp(a[r], a[m]) < 0) m = r;
          if (m === i) break; [a[i], a[m]] = [a[m], a[i]]; i = m; } } return top; }
    }
    const toList = arr => { let d = new ListNode(), c = d; for (const v of arr){ c.next = new ListNode(v); c = c.next; } return d.next; };
    const fromList = (h, cap = 10000) => { const out = []; while (h && cap--){ out.push(h.val); h = h.next; } return out; };
    const toTree = arr => { if (!arr.length || arr[0] === null) return null; const root = new TreeNode(arr[0]); const q = [root]; let i = 1;
      while (q.length && i < arr.length){ const n = q.shift();
        if (i < arr.length && arr[i] !== null){ n.left = new TreeNode(arr[i]); q.push(n.left); } i++;
        if (i < arr.length && arr[i] !== null){ n.right = new TreeNode(arr[i]); q.push(n.right); } i++; } return root; };
    const fromTree = root => { const out = [], q = [root]; while (q.length){ const n = q.shift(); if (n){ out.push(n.val); q.push(n.left, n.right); } else out.push(null); }
      while (out.length && out[out.length - 1] === null) out.pop(); return out; };
    const clone = x => x === undefined ? x : JSON.parse(JSON.stringify(x));
    const key = x => JSON.stringify(x);
    const norm = (x, mode) => {
      if (!Array.isArray(x)) return x;
      if (mode === 'unordered') return x.slice().sort((a, b) => key(a) < key(b) ? -1 : 1);
      if (mode === 'unorderedDeep') return x.map(y => Array.isArray(y) ? y.slice().sort((a, b) => key(a) < key(b) ? -1 : 1) : y).sort((a, b) => key(a) < key(b) ? -1 : 1);
      return x;
    };
    const equal = (a, b, mode) => {
      if (mode === 'approx') return typeof a === 'number' && Math.abs(a - b) < 1e-5;
      return key(norm(a, mode)) === key(norm(b, mode));
    };
    const fmt = v => { try { const s = JSON.stringify(v); return s === undefined ? String(v) : s; } catch(e){ return String(v); } };

    self.onmessage = (e) => {
      const m = e.data;
      if (m.kind === 'test') return runTests(m);
      if (m.kind === 'measure') return measure(m);
    };

    function compile(code, fn){
      return new Function('ListNode','TreeNode','MinHeap','console', '"use strict";\n' + code + `\n;return (typeof ${fn} !== 'undefined') ? ${fn} : undefined;`);
    }

    function runTests({ code, fn, tests, argTypes = [], returnType, compare, returnArg }){
      const logs = [];
      const con = { log: (...a) => { if (logs.length < 200) logs.push(a.map(x => typeof x === 'string' ? x : fmt(x)).join(' ')); } };
      con.error = con.warn = con.info = con.log;
      let f;
      try { f = compile(code, fn)(ListNode, TreeNode, MinHeap, con); }
      catch (err){ return self.postMessage({ type: 'done', error: 'Syntax/compile error: ' + err.message, logs }); }
      if (typeof f !== 'function') return self.postMessage({ type: 'done', error: `Couldn't find a function named "${fn}". Keep the function name from the starter code.`, logs });
      const results = [];
      for (let i = 0; i < tests.length; i++){
        const t = tests[i];
        self.postMessage({ type: 'progress', i });
        const before = logs.length;
        let args = clone(t.args).map((a, j) => argTypes[j] === 'list' ? toList(a) : argTypes[j] === 'tree' ? toTree(a) : a);
        let got, err = null; const t0 = performance.now();
        try {
          got = f(...args);
          if (returnArg !== undefined) got = args[returnArg];
          if (returnType === 'list') got = fromList(got);
          else if (returnType === 'tree') got = fromTree(got);
        } catch (ex){ err = (ex && ex.name ? ex.name + ': ' : '') + (ex && ex.message || String(ex)); }
        const ms = performance.now() - t0;
        let pass = !err && equal(got, t.expected, compare);
        if (pass && t.isBig && ms > 700){ pass = false; err = `Time limit exceeded: took ${Math.round(ms)} ms on n = ${t.n.toLocaleString()} (limit 700 ms). Look for a hidden O(n) call inside a loop.`; }
        const cut = s => s && s.length > 300 ? s.slice(0, 300) + ' …' : s;
        results.push({ pass, input: t.isBig ? `big hidden test, n = ${t.n.toLocaleString()}` : cut(t.args.map(fmt).join(', ')), expected: cut(fmt(t.expected)), got: err ? null : cut(fmt(got)), err, ms, logs: logs.slice(before), hidden: !!t.hidden, big: !!t.isBig });
      }
      self.postMessage({ type: 'done', results, logs });
    }

    // Empirical growth: time fn at doubling n
    function measure({ code, fn, gen, maxMs = 3500 }){
      let f, g;
      const con = { log(){}, error(){}, warn(){}, info(){} };
      try { f = compile(code, fn)(ListNode, TreeNode, MinHeap, con); } catch (err){ return self.postMessage({ type: 'done', error: 'Compile error: ' + err.message }); }
      if (typeof f !== 'function') return self.postMessage({ type: 'done', error: `Couldn't find a function named "${fn}".` });
      try { g = new Function('return (' + gen + ')')(); } catch (err){ return self.postMessage({ type: 'done', error: 'Input generator error: ' + err.message }); }
      const pts = []; const start = performance.now();
      for (let n = 16; n <= 4194304; n *= 2){
        let args; try { args = g(n); } catch (err){ return self.postMessage({ type: 'done', error: 'Input generator error: ' + err.message }); }
        // Timer resolution is coarse (~0.1 ms), so batch fast calls until a batch takes >= 4 ms.
        let best = Infinity, single = 0;
        try {
          for (let rep = 0; rep < 3; rep++){
            let k = 1, dt = 0;
            for (;;){
              const t0 = performance.now();
              for (let j = 0; j < k; j++) f(...args);
              dt = performance.now() - t0;
              if (dt >= 4 || k >= 4096) break;
              k *= 4;
            }
            best = Math.min(best, dt / k); single = Math.max(single, dt);
            if (dt > 150) break;
          }
        } catch (err){ return self.postMessage({ type: 'done', error: `Function threw at n=${n}: ${err.message}`, pts }); }
        pts.push({ n, ms: best });
        self.postMessage({ type: 'progress', pts });
        if (best > 120 || performance.now() - start > maxMs) break;
      }
      self.postMessage({ type: 'done', pts });
    }
  }

  const src = '(' + workerMain.toString() + ')()';
  let url = null;
  function makeWorker(){
    if (!url) url = URL.createObjectURL(new Blob([src], { type: 'text/javascript' }));
    return new Worker(url);
  }

  function run(payload, { timeout = 4000, onProgress } = {}){
    return new Promise((resolve) => {
      let w;
      try { w = makeWorker(); } catch (e){ return resolve({ error: 'Your browser blocked the code runner: ' + e.message }); }
      let current = 0, last = null;
      const timer = setTimeout(() => { w.terminate(); resolve({ timeout: true, at: current, partial: last }); }, timeout);
      w.onmessage = (e) => {
        const m = e.data;
        if (m.type === 'progress'){ current = m.i; last = m.pts; onProgress && onProgress(m); return; }
        if (m.type === 'done'){ clearTimeout(timer); w.terminate(); resolve(m); }
      };
      w.onerror = (e) => { clearTimeout(timer); w.terminate(); resolve({ error: e.message || 'Runtime error' }); e.preventDefault && e.preventDefault(); };
      w.postMessage(payload);
    });
  }

  // Generators for large hidden performance tests (expected values computed directly)
  const BIG = {
    distinct: (t) => ({ args: [Array.from({ length: t.n }, (_, i) => i)], expected: t.expected }),
    orders: (t) => {
      const n = t.n, users = [], orders = [], expected = [];
      for (let i = 0; i < n; i++) users.push({ id: i * 2, name: 'u' + i });
      for (let i = 0; i < n; i++) {
        const uid = ((i * 7919) % n) * 2 + (i % 50 === 0 ? 1 : 0);
        orders.push({ id: i, userId: uid });
        expected.push({ id: i, userId: uid, userName: uid % 2 ? null : 'u' + (uid / 2) });
      }
      return { args: [orders, users], expected };
    },
    uniqueBy: (t) => {
      const n = t.n, half = n / 2, items = [], expected = [];
      for (let i = 0; i < n; i++) { const it = { id: i % half, v: i }; items.push(it); if (i < half) expected.push(it); }
      return { args: [items, 'id'], expected };
    },
  };
  const expand = tests => tests.map(t => t.big ? Object.assign({ hidden: true, isBig: true, n: t.n }, BIG[t.big](t)) : t);

  window.Runner = {
    expand,
    test: (code, p) => run({ kind: 'test', code, fn: p.fn, tests: expand(p.tests), argTypes: p.argTypes, returnType: p.returnType, compare: p.compare, returnArg: p.returnArg }, { timeout: 6000 }),
    measure: (code, fn, gen, onProgress) => run({ kind: 'measure', code, fn, gen }, { timeout: 9000, onProgress }),
    _workerMain: workerMain,
  };
})();
