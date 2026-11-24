(function(){
'use strict';
const $ = (s, el = document) => el.querySelector(s);
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const hl = (code, lines) => window.JSA.highlight(code, lines);
const codeBlock = (code, lines) => `<pre class="code">${hl(code, lines)}</pre>`;
const DAY = 86400000;
const today = () => { const d = new Date(); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); };
const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--){ const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

// ---------- content index ----------
const UNITS = window.UNITS;
const ALL = [];
UNITS.forEach((u, ui) => u.items.forEach((item, idx) => ALL.push({ id: u.id + ':' + idx, unit: u, ui, idx, item })));
const BY_ID = Object.fromEntries(ALL.map(e => [e.id, e]));
const KIND_LABEL = { complexity: 'Analyze: complexity', pattern: 'Pick the pattern', bug: 'Find the bug', output: 'Predict the output', concept: 'Concept check' };
const TYPE_ICON = { lesson: '📖', mcq: '?', parsons: '≡', code: '</>' };
const XP = { lesson: 5, mcq: 10, parsons: 15, code: { easy: 20, medium: 30, hard: 40 } };
const xpFor = (it, firstTry) => { let x = it.type === 'code' ? XP.code[it.difficulty] || 25 : XP[it.type]; return firstTry ? x : Math.ceil(x / 3); };

// ---------- persistence ----------
const KEY = 'algodojo.v1';
let S;
function load(){
  try { S = JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e){ S = {}; }
  S.items = S.items || {}; S.xp = S.xp || 0; S.days = S.days || {}; S.drafts = S.drafts || {}; S.goal = S.goal || 40;
}
function save(){ try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e){} }
load();

const INTERVALS = [0, 1, 3, 7, 16, 35, 75];
function record(id, correct, opts = {}){
  const it = BY_ID[id].item; const rec = S.items[id] || (S.items[id] = { box: 0, attempts: 0, correct: 0 });
  const isReview = !!opts.review; const now = Date.now();
  rec.attempts++; rec.last = now;
  if (correct) rec.correct++;
  if (it.type === 'lesson'){ rec.status = 'done'; }
  else {
    if (correct){ rec.box = Math.min((rec.box || 0) + 1, INTERVALS.length - 1); rec.status = 'done'; }
    else { rec.box = 0; if (rec.status !== 'done' || isReview) rec.status = 'missed'; }
    rec.due = now + INTERVALS[rec.box] * DAY - (correct ? 3600000 : 0);
  }
  const gained = isReview ? (correct ? 5 : 1) : xpFor(it, correct);
  addXP(gained);
  save();
  return gained;
}
function addXP(n){ S.xp += n; const d = today(); S.days[d] = (S.days[d] || 0) + n; }
function streak(){
  let n = 0; const d = new Date();
  if (!S.days[today()]) d.setDate(d.getDate() - 1); // today not done yet: streak still alive from yesterday
  for (;;){ const k = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); if (S.days[k]) { n++; d.setDate(d.getDate() - 1); } else break; }
  return n;
}
const dueItems = () => ALL.filter(e => { const r = S.items[e.id]; return r && e.item.type !== 'lesson' && r.due && r.due <= Date.now(); }).sort((a, b) => S.items[a.id].due - S.items[b.id].due);
const unitProgress = u => { const es = ALL.filter(e => e.unit === u); const done = es.filter(e => (S.items[e.id] || {}).status === 'done').length; return { done, total: es.length, pct: Math.round(100 * done / es.length) }; };
const nextNew = (n, unit) => ALL.filter(e => (!unit || e.unit === unit) && !S.items[e.id]).slice(0, n);

// ---------- toast ----------
let toastT; function toast(msg){ const t = $('#toast'); t.textContent = msg; t.classList.add('show'); clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('show'), 1800); }

// ---------- routing ----------
const view = $('#view');
let current = { name: 'home' };
let history = [];
function go(name, params = {}, push = true){
  if (push && current) history.push(current);
  current = { name, ...params };
  render();
}
function back(){ current = history.pop() || { name: 'home' }; render(); }
function setTab(name){ history = []; go(name, {}, false); }
document.querySelectorAll('#tabbar .tab').forEach(b => b.addEventListener('click', () => setTab(b.dataset.tab)));

function render(){
  document.body.classList.toggle('in-session', current.name === 'session');
  const tabName = { home: 'home', unit: 'home', session: current.from || 'home', review: 'review', lab: 'lab', ref: 'ref', stats: 'stats' }[current.name];
  document.querySelectorAll('#tabbar .tab').forEach(b => b.classList.toggle('active', b.dataset.tab === tabName));
  const due = dueItems().length; const badge = $('#dueBadge'); badge.hidden = !due; badge.textContent = due;
  hideKeybar();
  ({ home: renderHome, unit: renderUnit, session: renderSession, review: renderReview, lab: renderLab, ref: renderRef, stats: renderStats })[current.name]();
  if (current.name !== 'session') window.scrollTo(0, current.scroll || 0);
}

// ---------- home ----------
function statsRow(){
  const t = S.days[today()] || 0;
  return `<div class="stats-row">
    <div class="stat"><b>🔥 ${streak()}</b><span>day streak</span></div>
    <div class="stat"><b>${S.xp}</b><span>total XP</span></div>
    <div class="stat"><b>${Math.min(t, S.goal)}/${S.goal}</b><span>today's goal</span></div>
  </div>`;
}
function renderHome(){
  const due = dueItems();
  const nxt = nextNew(1)[0];
  const isIOS = /iPhone|iPad|iPod/.test(navigator.userAgent);
  const standalone = window.navigator.standalone || matchMedia('(display-mode: standalone)').matches;
  let html = `<div class="wrap">
    <h1>Become fluent at problem solving</h1>
    <p class="muted">17 units · learn a pattern, analyze real JS, then code it.</p>
    ${statsRow()}`;
  if (isIOS && !standalone && window.top === window.self) html += `<div class="card small"><b>Install on iPhone:</b> tap the Share button in Safari, then <b>Add to Home Screen</b>. It then works offline like an app.</div>`;
  html += `<div class="card hero tap" id="continue">
      <div class="small muted">${nxt ? 'Up next · ' + esc(nxt.unit.title) : 'All new material complete 🎉'}</div>
      <div style="font-size:20px;font-weight:700;margin:4px 0 12px">${nxt ? esc(titleOf(nxt)) : 'Keep your skills sharp with review'}</div>
      <button class="btn block">${due.length ? `Continue · ${Math.min(due.length, 3)} review + new` : 'Continue learning'}</button>
    </div>`;
  if (due.length) html += `<div class="card tap row" id="goreview"><div><b>↻ ${due.length} item${due.length > 1 ? 's' : ''} due for review</b><div class="small muted">Reviewing at the right time is what makes it stick.</div></div><div class="spacer"></div><span>›</span></div>`;
  html += `<h2>Curriculum</h2>`;
  UNITS.forEach((u, i) => {
    const p = unitProgress(u);
    html += `<div class="card tap unit" data-unit="${u.id}"><div class="ring" style="--p:${p.pct}"><span>${p.pct}%</span></div>
      <div style="min-width:0"><div class="num">Unit ${i + 1}</div><div class="t">${esc(u.title)}</div><div class="small muted">${esc(u.blurb)}</div></div></div>`;
  });
  html += `</div>`;
  view.innerHTML = html;
  $('#continue').onclick = () => startContinue();
  if (due.length) $('#goreview').onclick = () => setTab('review');
  view.querySelectorAll('[data-unit]').forEach(el => el.onclick = () => { current.scroll = window.scrollY; go('unit', { unit: el.dataset.unit }); });
}
function titleOf(e){ const it = e.item; return it.title || KIND_LABEL[it.kind] || 'Practice'; }
function startContinue(){
  const due = dueItems().slice(0, 3).map(e => ({ id: e.id, review: true }));
  const fresh = nextNew(8).map(e => ({ id: e.id }));
  const q = due.concat(fresh);
  if (!q.length) return toast('Nothing new. Try the Lab or redo a unit!');
  startSession(q, 'home');
}

// ---------- unit ----------
function renderUnit(){
  const u = UNITS.find(x => x.id === current.unit); const ui = UNITS.indexOf(u); const p = unitProgress(u);
  let html = `<div class="wrap"><button class="btn ghost sm" id="back">‹ All units</button>
    <div class="num small muted" style="margin-top:10px">UNIT ${ui + 1} · ${p.done}/${p.total} done</div><h1>${esc(u.title)}</h1><p class="muted">${esc(u.blurb)}</p>
    <div class="row" style="margin:14px 0"><button class="btn primary" id="start" style="flex:1">${p.done ? (p.done === p.total ? 'Practice again' : 'Continue unit') : 'Start unit'}</button></div>`;
  const groups = [['Learn', e => e.item.type === 'lesson'], ['Analyze & recall', e => e.item.type === 'mcq' || e.item.type === 'parsons'], ['Code it', e => e.item.type === 'code']];
  for (const [label, f] of groups){
    const es = ALL.filter(e => e.unit === u && f(e)); if (!es.length) continue;
    html += `<h2>${label}</h2><div class="card" style="padding:4px 12px">`;
    for (const e of es){
      const r = S.items[e.id]; const st = r ? r.status : '';
      const sub = e.item.type === 'code' ? `<span class="tag ${e.item.difficulty}">${e.item.difficulty}</span>` : e.item.type === 'mcq' ? `<span class="small muted">${esc(KIND_LABEL[e.item.kind] || '')}</span>` : e.item.type === 'parsons' ? '<span class="small muted">Order the lines</span>' : '';
      const title = e.item.type === 'mcq' ? stripTags(e.item.prompt) : e.item.title;
      html += `<div class="item-row ${st}" data-id="${e.id}"><div class="ic">${st === 'done' ? '✓' : st === 'missed' ? '!' : TYPE_ICON[e.item.type]}</div><div style="min-width:0;flex:1"><div style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(title)}</div>${sub}</div><span class="muted">›</span></div>`;
    }
    html += `</div>`;
  }
  html += `</div>`;
  view.innerHTML = html;
  $('#back').onclick = back;
  $('#start').onclick = () => {
    let q = ALL.filter(e => e.unit === u && (!S.items[e.id] || S.items[e.id].status !== 'done'));
    if (!q.length) q = ALL.filter(e => e.unit === u && e.item.type !== 'lesson');
    startSession(q.map(e => ({ id: e.id })), 'home');
  };
  view.querySelectorAll('[data-id]').forEach(el => el.onclick = () => startSession([{ id: el.dataset.id }], 'home'));
}
const stripTags = s => s.replace(/<[^>]+>/g, '').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');

// ---------- review ----------
function renderReview(){
  const due = dueItems();
  const learned = ALL.filter(e => S.items[e.id] && e.item.type !== 'lesson');
  const upcoming = learned.filter(e => S.items[e.id].due > Date.now()).sort((a, b) => S.items[a.id].due - S.items[b.id].due).slice(0, 5);
  let html = `<div class="wrap"><h1>Review</h1><p class="muted">Spaced repetition: items come back after 1, 3, 7, 16, 35… days. A miss resets the clock.</p>`;
  if (due.length){
    html += `<div class="card hero"><div style="font-size:20px;font-weight:700">${due.length} due now</div><p class="muted">About ${Math.max(1, Math.round(Math.min(due.length, 15) * 0.7))} minutes.</p><button class="btn block" id="rev">Start review (${Math.min(due.length, 15)})</button></div>`;
  } else html += `<div class="card"><b>All caught up ✓</b><p class="muted small">${learned.length ? 'Nothing is due. New items appear here as you learn.' : 'Finish a few practice items and they will start appearing here.'}</p></div>`;
  const missed = ALL.filter(e => (S.items[e.id] || {}).status === 'missed');
  if (missed.length) html += `<div class="card tap row" id="missed"><div><b>Redo missed items (${missed.length})</b><div class="small muted">Everything you have not yet gotten right.</div></div><div class="spacer"></div>›</div>`;
  html += `<div class="card tap row" id="mixed"><div><b>Mixed pattern drill</b><div class="small muted">10 random "analyze this function" questions from units you have started.</div></div><div class="spacer"></div>›</div>`;
  if (upcoming.length){ html += `<h2>Coming up</h2><div class="card" style="padding:4px 12px">` + upcoming.map(e => `<div class="item-row"><div class="ic">${TYPE_ICON[e.item.type]}</div><div style="flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(e.item.title || stripTags(e.item.prompt))}</div><span class="small muted">${relDays(S.items[e.id].due)}</span></div>`).join('') + `</div>`; }
  html += `</div>`;
  view.innerHTML = html;
  if (due.length) $('#rev').onclick = () => startSession(due.slice(0, 15).map(e => ({ id: e.id, review: true })), 'review');
  if (missed.length) $('#missed').onclick = () => startSession(missed.slice(0, 15).map(e => ({ id: e.id, review: true })), 'review');
  $('#mixed').onclick = () => {
    const started = new Set(ALL.filter(e => S.items[e.id]).map(e => e.unit.id));
    let pool = ALL.filter(e => e.item.type === 'mcq' && (started.has(e.unit.id)));
    if (pool.length < 10) pool = ALL.filter(e => e.item.type === 'mcq' && ['complexity', 'pattern', 'bug'].includes(e.item.kind) && e.ui < 4);
    startSession(shuffle(pool).slice(0, 10).map(e => ({ id: e.id, review: true })), 'review');
  };
}
const relDays = t => { const d = Math.round((t - Date.now()) / DAY); return d <= 0 ? 'today' : d === 1 ? 'tomorrow' : `in ${d} days`; };

// ---------- session ----------
let SS = null;
function startSession(queue, from){
  SS = { queue: queue.slice(), pos: 0, total: queue.length, from, correct: 0, xp: 0, requeued: new Set(), results: [] };
  history = [];
  go('session', { from }, false);
}
function renderSession(){
  if (!SS) return setTab('home');
  if (SS.pos >= SS.queue.length) return renderSummary();
  const q = SS.queue[SS.pos]; const e = BY_ID[q.id]; const it = e.item;
  const pct = Math.round(100 * SS.pos / SS.queue.length);
  view.innerHTML = `<div class="wrap ${it.type === 'code' ? 'wide' : ''}"><div class="sess-top"><button class="x" id="close" aria-label="Close">×</button><div class="bar"><i style="width:${pct}%"></i></div><span class="small muted">${SS.pos + 1}/${SS.queue.length}</span></div><div id="item"></div></div>`;
  $('#close').onclick = () => { SS = null; setTab(current.from || 'home'); };
  const host = $('#item');
  const done = (correct, opts = {}) => {
    if (q.answered) return; q.answered = true;
    const gained = record(q.id, correct, { review: q.review || q.retry });
    if (correct && !q.retry) SS.correct++;
    SS.xp += gained;
    if (!correct && it.type !== 'lesson' && !SS.requeued.has(q.id) && it.type !== 'code'){ SS.requeued.add(q.id); SS.queue.push({ id: q.id, retry: true }); }
    if (opts.toast !== false) toast(`+${gained} XP`);
  };
  const next = () => { SS.pos++; window.scrollTo(0, 0); renderSession(); };
  window.scrollTo(0, 0);
  ({ lesson: renderLesson, mcq: renderMCQ, parsons: renderParsons, code: renderCode })[it.type](host, e, q, done, next);
}
function renderSummary(){
  const n = SS.total;
  view.innerHTML = `<div class="wrap"><div class="confetti">🎉</div><h1 style="text-align:center">Session complete</h1>
    <div class="stats-row"><div class="stat"><b>+${SS.xp}</b><span>XP</span></div><div class="stat"><b>${SS.correct}/${n}</b><span>first-try</span></div><div class="stat"><b>🔥 ${streak()}</b><span>streak</span></div></div>
    <p class="muted" style="text-align:center">Missed items are scheduled for review, so they will come back until they stick.</p>
    <div class="footer-actions"><button class="btn" id="home">Done</button><button class="btn primary" id="more">Keep going</button></div></div>`;
  $('#home').onclick = () => { const f = SS.from; SS = null; setTab(f || 'home'); };
  $('#more').onclick = () => { SS = null; startContinue(); };
}

function renderBody(body){
  return body.map(b => typeof b === 'string' ? `<div>${b}</div>` : b.code ? codeBlock(b.code) : b.tip ? `<div class="callout">💡 ${b.tip}</div>` : '').join('');
}
function renderLesson(host, e, q, done, next){
  const it = e.item;
  host.innerHTML = `<div class="kind">Lesson · ${esc(e.unit.title)}</div><h1>${esc(it.title)}</h1><div class="lesson">${renderBody(it.body)}</div>
    <div class="footer-actions"><button class="btn primary" id="ok">Got it</button></div>`;
  $('#ok').onclick = () => { done(true); next(); };
}

function renderMCQ(host, e, q, done, next){
  const it = e.item;
  if (!q.order) q.order = shuffle(it.options.map((_, i) => i));
  const isOutput = it.kind === 'output';
  host.innerHTML = `<div class="kind">${esc(KIND_LABEL[it.kind] || 'Question')}${q.review || q.retry ? ' · review' : ''}</div>
    <div class="prompt">${it.prompt}</div>${it.code ? codeBlock(it.code) : ''}
    <div class="opts">${q.order.map(i => `<button class="opt" data-i="${i}">${isOutput || /^O\(/.test(it.options[i]) ? `<code>${esc(it.options[i]).replace(/\n/g, '<br>')}</code>` : it.options[i]}</button>`).join('')}</div>
    <div id="fb"></div><div class="footer-actions" id="fa" hidden><button class="btn primary" id="next">Continue</button></div>`;
  host.querySelectorAll('.opt').forEach(b => b.onclick = () => {
    if (q.answered) return;
    const i = +b.dataset.i, ok = i === it.answer;
    host.querySelectorAll('.opt').forEach(x => { const xi = +x.dataset.i; if (xi === it.answer) x.classList.add('right'); else if (x === b) x.classList.add('wrong'); x.disabled = true; });
    $('#fb').innerHTML = `<div class="feedback ${ok ? '' : 'bad'}"><b>${ok ? 'Correct!' : 'Not quite.'}</b>${it.explain || ''}</div>`;
    done(ok);
    $('#fa').hidden = false; $('#next').onclick = next;
    setTimeout(() => $('#fb').scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 50);
  });
}

function renderParsons(host, e, q, done, next){
  const it = e.item;
  if (!q.pool){ q.pool = shuffle(it.lines.concat(it.distractors || []).map((t, k) => ({ t, k }))); q.ans = []; q.tries = 0; }
  const draw = (checked) => {
    host.innerHTML = `<div class="kind">Order the lines${q.review || q.retry ? ' · review' : ''}</div><h1>${esc(it.title)}</h1><p>${it.prompt} <span class="muted small">Tap a line to add it; tap an added line to remove it.${it.distractors && it.distractors.length ? ' Some lines are decoys.' : ''}</span></p>
      <div class="parsons"><div class="zone-label">Your solution</div><div class="zone" id="ans">${q.ans.map((x, i) => `<button class="pl ${checked ? (x.t === it.lines[i] ? 'right' : 'wrong') : ''}" data-a="${i}">${hl(x.t)}</button>`).join('') || '<span class="muted small" style="padding:8px">Tap lines below…</span>'}</div>
      <div id="fb"></div>
      <div class="zone-label">Available lines</div><div class="zone" id="pool">${q.pool.map((x, i) => `<button class="pl" data-p="${i}">${hl(x.t)}</button>`).join('') || '<span class="muted small" style="padding:8px">All lines placed.</span>'}</div></div>
      <div class="footer-actions" id="fa"></div>`;
    host.querySelectorAll('[data-p]').forEach(b => b.onclick = () => { if (q.solved) return; q.ans.push(q.pool.splice(+b.dataset.p, 1)[0]); draw(); });
    host.querySelectorAll('[data-a]').forEach(b => b.onclick = () => { if (q.solved) return; q.pool.push(q.ans.splice(+b.dataset.a, 1)[0]); draw(); });
    const fa = $('#fa');
    if (q.solved){ fa.innerHTML = `<button class="btn primary" id="next">Continue</button>`; $('#next').onclick = next; }
    else {
      fa.innerHTML = `<button class="btn" id="reveal">Show answer</button><button class="btn primary" id="check" ${q.ans.length ? '' : 'disabled'}>Check</button>`;
      $('#check').onclick = () => {
        const ok = q.ans.length === it.lines.length && q.ans.every((x, i) => x.t === it.lines[i]);
        q.tries++;
        if (ok){ q.solved = true; done(q.tries === 1); draw(true); $('#fb').innerHTML = `<div class="feedback"><b>${q.tries === 1 ? 'Perfect!' : 'Got it.'}</b>${it.explain || ''}</div>`; }
        else {
          if (q.tries === 1) done(false, { toast: false });
          draw(true);
          const firstBad = q.ans.findIndex((x, i) => x.t !== it.lines[i]);
          $('#fb').innerHTML = `<div class="feedback bad"><b>Not yet.</b>${firstBad >= 0 ? `Line ${firstBad + 1} is the first one out of place.` : `You need ${it.lines.length} lines; you have ${q.ans.length}.`} Tap red lines to send them back, then try again.</div>`;
        }
      };
      $('#reveal').onclick = () => {
        if (!q.answered) done(false, { toast: false });
        q.solved = true; q.ans = it.lines.map(t => ({ t })); q.pool = (it.distractors || []).map(t => ({ t }));
        draw(true); $('#fb').innerHTML = `<div class="feedback bad"><b>Here is the solution.</b>${it.explain || ''} It will come back in review.</div>`;
      };
    }
  };
  draw();
}

// ---------- code problems ----------
function renderCode(host, e, q, done, next){
  const it = e.item;
  const draftKey = e.id;
  const fresh = q.review || q.retry;
  if (q.code === undefined) q.code = (!fresh && S.drafts[draftKey]) || it.starter;
  q.hints = q.hints || 0;
  const examples = it.tests.filter(t => !t.hidden && !t.big).slice(0, 2);
  const exHtml = examples.map(t => `<div class="small"><b>Input:</b> <code>${esc(t.args.map(a => JSON.stringify(a)).join(', '))}</code><br><b>Output:</b> <code>${esc(JSON.stringify(t.expected))}</code></div>`).join('<div style="height:8px"></div>');
  const extras = [];
  if (it.argTypes && it.argTypes.includes('list')) extras.push('Lists are shown as arrays but passed to you as a <code>ListNode</code> head.');
  if (it.argTypes && it.argTypes.includes('tree')) extras.push('Trees are shown in level order but passed to you as a <code>TreeNode</code> root.');
  if (it.compare === 'unordered' || it.compare === 'unorderedDeep') extras.push('Any order is accepted.');
  host.innerHTML = `<div class="coder split">
    <div class="pane-left">
      <div class="kind">Code it${fresh ? ' · review (from scratch)' : ''}</div>
      <h1>${esc(it.title)} <span class="tag ${it.difficulty}">${it.difficulty}</span></h1>
      <div>${it.prompt}</div>${extras.length ? `<p class="small muted">${extras.join(' ')}</p>` : ''}
      <div class="card" style="padding:12px 14px">${exHtml}</div>
      <div id="hintbox"></div>
      <div class="row" style="flex-wrap:wrap"><button class="btn sm" id="hint">💡 Hint${it.hints ? ` (${q.hints}/${it.hints.length})` : ''}</button><button class="btn sm" id="sol">Show solution</button></div>
      <div id="solbox"></div>
    </div>
    <div class="pane-right">
      <div class="keybar" id="kb"></div>
      <textarea class="editor" id="ed" spellcheck="false" autocapitalize="off" autocomplete="off" autocorrect="off" wrap="off" aria-label="Code editor"></textarea>
      <div class="row" style="margin-top:10px"><button class="btn sm" id="reset">Reset</button><div class="spacer"></div><button class="btn primary" id="run">▶ Run tests</button></div>
      <div id="out" class="results" style="margin-top:12px"></div>
      <div class="footer-actions" id="fa" hidden></div>
    </div></div>`;
  const ed = $('#ed'); ed.value = q.code;
  setupEditor(ed, $('#kb'), v => { q.code = v; if (!fresh){ S.drafts[draftKey] = v; save(); } });
  const showHints = () => { $('#hintbox').innerHTML = (it.hints || []).slice(0, q.hints).map((h, i) => `<div class="callout">💡 <b>Hint ${i + 1}.</b> ${h}</div>`).join(''); $('#hint').textContent = `💡 Hint (${q.hints}/${(it.hints || []).length})`; };
  showHints();
  $('#hint').onclick = () => { if (q.hints < (it.hints || []).length){ q.hints++; showHints(); } else toast('No more hints'); };
  const showSol = () => { $('#solbox').innerHTML = `<details open><summary>Reference solution · ${esc(it.complexity || '')}</summary>${codeBlock(it.solution)}</details>`; };
  if (q.sawSolution || q.passed) showSol();
  $('#sol').onclick = () => {
    if (q.sawSolution || q.passed) return showSol();
    const b = $('#sol');
    if (b.dataset.confirm){ q.sawSolution = true; showSol(); if (!q.answered) done(false, { toast: false }); finishBar(); }
    else { b.dataset.confirm = 1; b.textContent = 'Tap again to reveal (counts as a miss)'; }
  };
  $('#reset').onclick = () => { const b = $('#reset'); if (b.dataset.confirm){ ed.value = it.starter; q.code = it.starter; if (!fresh){ delete S.drafts[draftKey]; save(); } b.textContent = 'Reset'; delete b.dataset.confirm; } else { b.dataset.confirm = 1; b.textContent = 'Tap to confirm'; setTimeout(() => { b.textContent = 'Reset'; delete b.dataset.confirm; }, 2500); } };
  const finishBar = () => { const fa = $('#fa'); fa.hidden = false; fa.innerHTML = `<button class="btn primary" id="next">Continue</button>`; $('#next').onclick = next; };
  if (q.answered) finishBar();
  $('#run').onclick = async () => {
    const out = $('#out'); const run = $('#run'); run.disabled = true; run.textContent = 'Running…';
    out.innerHTML = `<div class="muted small">Running ${it.tests.length} tests…</div>`;
    hideKeybar(); ed.blur();
    const res = await window.Runner.test(ed.value, it);
    run.disabled = false; run.textContent = '▶ Run tests';
    if (res.error){ out.innerHTML = `<div class="res fail"><span class="lbl">Error</span>\n${esc(res.error)}</div>`; return; }
    if (res.timeout){ const t = window.Runner.expand(it.tests)[res.at]; out.innerHTML = `<div class="res fail"><span class="lbl">Time limit exceeded on test ${res.at + 1}${t && t.isBig ? ` (big hidden test, n = ${t.n.toLocaleString()})` : ''}</span>\nInfinite loop, or too slow. Check your loop conditions, and look for hidden O(n) calls inside loops.</div>`; return; }
    const passed = res.results.filter(r => r.pass).length, all = passed === res.results.length;
    let h = `<div class="feedback ${all ? '' : 'bad'}"><b>${all ? 'All tests passed! ✅' : `${passed}/${res.results.length} tests passed`}</b>${all ? `Reference complexity: ${esc(it.complexity || '')}. Compare your approach with the reference solution.` : 'Read the first failure below.'}</div>`;
    res.results.forEach((r, i) => {
      if (r.pass && r.hidden) { h += `<div class="res"><span class="lbl">✓ Test ${i + 1} (${r.big ? esc(r.input) + `, ${Math.round(r.ms)} ms` : 'hidden'})</span></div>`; return; }
      h += `<div class="res ${r.pass ? '' : 'fail'}"><span class="lbl">${r.pass ? '✓' : '✗'} Test ${i + 1}</span>\n<b>in:</b>  ${esc(r.input)}\n<b>exp:</b> ${esc(r.expected)}\n<b>got:</b> ${r.err ? '<span class="warnline">' + esc(r.err) + '</span>' : esc(r.got)}${r.logs.length ? '\n<b>console:</b>\n' + esc(r.logs.join('\n')) : ''}</div>`;
    });
    out.innerHTML = h;
    if (all && !q.passed){
      q.passed = true;
      if (!q.answered) done(!q.sawSolution);
      showSol(); finishBar();
    }
    out.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
}

// ---------- editor with mobile key bar ----------
const KEYS = [['⇥', '  '], ['{ }', '{}', 1], ['( )', '()', 1], ['[ ]', '[]', 1], [';', ';'], ['=', ' = '], ['===', ' === '], ['!==', ' !== '], ['=>', ' => '], ['<', ' < '], ['>', ' > '], ['+', ' + '], ['-', ' - '], ['++', '++'], ['&&', ' && '], ['||', ' || '], ['!', '!'], ["' '", "''", 1], ['.', '.'], [',', ', '], [':', ': '], ['?', ' ? '], ['%', ' % '], ['*', ' * '], ['/', ' / '], ['return', 'return '], ['const', 'const '], ['let', 'let '], ['for', 'for (let i = 0; i < n; i++) {\n}', 0], ['if', 'if () {\n}', 0], ['.length', '.length'], ['↶', 'undo'], ['⌄', 'hide']];
let kbActive = null;
function insertAt(ed, text, back = 0){
  ed.focus();
  let ok = false;
  try { ok = document.execCommand('insertText', false, text); } catch (e){}
  if (!ok){ const s = ed.selectionStart, en = ed.selectionEnd; ed.setRangeText(text, s, en, 'end'); }
  if (back){ const p = ed.selectionStart - back; ed.setSelectionRange(p, p); }
  ed.dispatchEvent(new Event('input'));
}
function setupEditor(ed, kb, onChange){
  kb.innerHTML = KEYS.map((k, i) => `<button type="button" data-k="${i}">${esc(k[0])}</button>`).join('');
  kb.querySelectorAll('button').forEach(b => {
    b.addEventListener('pointerdown', ev => ev.preventDefault());
    b.addEventListener('mousedown', ev => ev.preventDefault());
    b.addEventListener('click', () => {
      const [, val, back] = KEYS[+b.dataset.k];
      if (val === 'undo'){ ed.focus(); try { document.execCommand('undo'); } catch (e){} ed.dispatchEvent(new Event('input')); return; }
      if (val === 'hide'){ ed.blur(); return; }
      if (val.includes('\n')){
        const indent = currentIndent(ed);
        const lines = val.split('\n');
        const text = lines[0] + '\n' + indent + '  \n' + indent + lines[1];
        insertAt(ed, text, indent.length + lines[1].length + 1);
        return;
      }
      insertAt(ed, val, back ? 1 : 0);
    });
  });
  ed.addEventListener('input', () => onChange(ed.value));
  ed.addEventListener('keydown', ev => {
    if (ev.key === 'Tab'){ ev.preventDefault(); insertAt(ed, '  '); }
    else if (ev.key === 'Enter' && !ev.isComposing){
      ev.preventDefault();
      const indent = currentIndent(ed); const s = ed.selectionStart; const before = ed.value[s - 1], after = ed.value[s];
      if ('{(['.includes(before) && '})]'.includes(after)) insertAt(ed, '\n' + indent + '  \n' + indent, indent.length + 1);
      else insertAt(ed, '\n' + indent + ('{(['.includes(before) ? '  ' : ''));
    }
    else if ((ev.key === 'Enter' && (ev.metaKey || ev.ctrlKey))){ const r = document.getElementById('run'); r && r.click(); }
  });
  // Floating accessory bar above the iOS keyboard
  const vv = window.visualViewport;
  const place = () => {
    if (!kbActive) return;
    const coarse = matchMedia('(pointer: coarse)').matches;
    if (!coarse || !vv){ return; }
    kb.classList.add('floating');
    kb.style.top = (vv.offsetTop + vv.height - kb.offsetHeight) + 'px';
  };
  ed.addEventListener('focus', () => { kbActive = { kb, place }; place(); setTimeout(place, 300); });
  ed.addEventListener('blur', () => setTimeout(() => { if (document.activeElement !== ed) hideKeybar(); }, 100));
  if (vv && !window.__vvBound){ window.__vvBound = true; vv.addEventListener('resize', () => kbActive && kbActive.place()); vv.addEventListener('scroll', () => kbActive && kbActive.place()); }
}
function hideKeybar(){ if (kbActive){ kbActive.kb.classList.remove('floating'); kbActive.kb.style.top = ''; kbActive = null; } }
function currentIndent(ed){ const s = ed.selectionStart; const ls = ed.value.lastIndexOf('\n', s - 1) + 1; return (ed.value.slice(ls, s).match(/^\s*/) || [''])[0]; }

// ---------- Lab ----------
const LAB_EXAMPLES = [
  ['Dedupe with indexOf', `function dedupe(items) {
  return items.filter((x, i) => items.indexOf(x) === i);
}`, 'array'],
  ['Has pair with sum (nested loops)', `function hasPair(nums, target) {
  for (let i = 0; i < nums.length; i++) {
    for (let j = i + 1; j < nums.length; j++) {
      if (nums[i] + nums[j] === target) return true;
    }
  }
  return false;
}`, 'arrayTarget'],
  ['Has pair with sum (Set)', `function hasPair(nums, target) {
  const seen = new Set();
  for (const x of nums) {
    if (seen.has(target - x)) return true;
    seen.add(x);
  }
  return false;
}`, 'arrayTarget'],
  ['Binary search', `function search(nums, target) {
  let lo = 0, hi = nums.length - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (nums[mid] === target) return mid;
    if (nums[mid] < target) lo = mid + 1;
    else hi = mid - 1;
  }
  return -1;
}`, 'sorted'],
  ['Index by id with spread reduce', `function indexById(list) {
  return list.reduce((acc, item) => ({ ...acc, [item.id]: item }), {});
}`, 'objects'],
  ['Naive Fibonacci', `function fib(n) {
  if (n < 2) return n;
  return fib(n - 1) + fib(n - 2);
}`, 'smallnum'],
];
const GENS = {
  array: ['Array of n random ints', 'n => [Array.from({ length: n }, () => Math.floor(Math.random() * n))]'],
  arrayTarget: ['Array of n ints + impossible target', 'n => [Array.from({ length: n }, (_, i) => i), -1]'],
  sorted: ['Sorted array of n + target', 'n => [Array.from({ length: n }, (_, i) => i * 2), 1]'],
  string: ['String of n random letters', "n => [Array.from({ length: n }, () => String.fromCharCode(97 + Math.floor(Math.random() * 26))).join('')]"],
  objects: ['Array of n {id} objects', 'n => [Array.from({ length: n }, (_, i) => ({ id: i, v: i }))]'],
  number: ['The number n', 'n => [n]'],
  smallnum: ['Small number: 10, 12, 14… (for recursion)', 'n => [Math.log2(n) * 2 + 2]'],
  custom: ['Custom generator…', 'n => [Array.from({ length: n }, (_, i) => i)]'],
};
function renderLab(){
  const L = S.lab || (S.lab = { code: LAB_EXAMPLES[0][1], gen: 'array' });
  let html = `<div class="wrap"><h1>Function Lab</h1><p class="muted">Paste any JavaScript function. The Lab flags loops and hidden costs line by line, then actually times it at growing input sizes to confirm the growth rate.</p>
    <label class="f">Try an example</label><select id="ex"><option value="">Choose…</option>${LAB_EXAMPLES.map((x, i) => `<option value="${i}">${esc(x[0])}</option>`).join('')}</select>
    <label class="f">Function</label><div class="keybar" id="kb"></div><textarea class="editor" id="ed" style="min-height:30vh" spellcheck="false" autocapitalize="off" autocomplete="off" autocorrect="off" wrap="off"></textarea>
    <div class="row" style="margin-top:10px"><button class="btn primary" id="an" style="flex:1">Analyze</button></div>
    <div id="anOut"></div>
    <h2>Measure growth</h2><p class="small muted">Runs the function with input sizes 16, 32, 64… and fits the curve. Doubling n and seeing time ×2 means O(n); ×4 means O(n²).</p>
    <label class="f">Function name</label><input type="text" id="fn" autocapitalize="off" autocorrect="off">
    <label class="f">Input generator</label><select id="gen">${Object.entries(GENS).map(([k, v]) => `<option value="${k}">${esc(v[0])}</option>`).join('')}</select>
    <textarea class="plain" id="genCode" spellcheck="false" autocapitalize="off" style="margin-top:8px;min-height:60px"></textarea>
    <div class="row" style="margin-top:10px"><button class="btn" id="measure" style="flex:1">⏱ Measure</button></div>
    <div id="mOut"></div>
    <h2>The checklist</h2><div class="card">${window.REFERENCE.checklist.map(([a, b], i) => `<p><b>${i + 1}. ${esc(a)}.</b> <span class="muted">${esc(b)}</span></p>`).join('')}</div>
  </div>`;
  view.innerHTML = html;
  const ed = $('#ed'); ed.value = L.code;
  setupEditor(ed, $('#kb'), v => { L.code = v; save(); syncFn(); });
  const gen = $('#gen'), genCode = $('#genCode'), fn = $('#fn');
  gen.value = L.gen; genCode.value = L.genCode || GENS[L.gen][1];
  function syncFn(){ fn.value = window.JSA.firstFunctionName(ed.value); }
  syncFn();
  gen.onchange = () => { L.gen = gen.value; genCode.value = GENS[gen.value][1]; L.genCode = genCode.value; save(); };
  genCode.oninput = () => { L.genCode = genCode.value; save(); };
  $('#ex').onchange = ev => { const x = LAB_EXAMPLES[ev.target.value]; if (!x) return; ed.value = L.code = x[1]; gen.value = L.gen = x[2]; genCode.value = L.genCode = GENS[x[2]][1]; save(); syncFn(); $('#anOut').innerHTML = ''; $('#mOut').innerHTML = ''; };
  $('#an').onclick = () => {
    const r = window.JSA.analyze(ed.value);
    const lines = r.findings.filter(f => f.sev === 'warn').map(f => f.line);
    $('#anOut').innerHTML = `<div class="card"><div class="small muted">Static estimate (heuristic)</div><div style="font-size:24px;font-weight:800;margin:2px 0 8px">${esc(r.estimate)}</div>
      ${codeBlock(ed.value, lines)}
      ${r.findings.length ? r.findings.map(f => `<p class="small">${f.sev === 'warn' ? '⚠️' : 'ℹ️'} <b>Line ${f.line}:</b> ${esc(f.msg)}</p>`).join('') : '<p class="small muted">No loops, recursion, or hidden-cost calls found.</p>'}
      <p class="small muted">The scanner assumes every loop and built-in call is over the input size n. Confirm with "Measure growth", and still walk the checklist yourself, since that is the skill.</p></div>`;
  };
  $('#measure').onclick = async () => {
    const out = $('#mOut'); const name = fn.value.trim();
    if (!name) return out.innerHTML = `<div class="res fail">Enter the function name.</div>`;
    $('#measure').disabled = true; out.innerHTML = '<p class="muted small">Measuring… (up to ~10 s)</p>';
    const res = await window.Runner.measure(ed.value, name, genCode.value, m => { if (m.pts) drawPts(out, m.pts, true); });
    $('#measure').disabled = false;
    if (res.error){ out.innerHTML = `<div class="res fail">${esc(res.error)}</div>`; return; }
    const pts = res.pts || res.partial || [];
    drawPts(out, pts, false, res.timeout);
  };
}
const smallX = n => Math.log2(n) * 2 + 2;
function fitGrowth(pts, linear){
  const use = pts.filter(p => p.ms >= 0.002);
  if (use.length < 3) return { label: 'too fast to measure: likely O(1) or O(log n)', k: null };
  const tail = use.slice(-5);
  const xs = tail.map(p => linear ? smallX(p.n) : Math.log2(p.n)), ys = tail.map(p => Math.log2(p.ms));
  const mx = xs.reduce((a, b) => a + b) / xs.length, my = ys.reduce((a, b) => a + b) / ys.length;
  let num = 0, den = 0; xs.forEach((x, i) => { num += (x - mx) * (ys[i] - my); den += (x - mx) ** 2; });
  const k = num / den;
  if (linear){ const b = Math.pow(2, k); return { label: b > 1.2 ? `exponential, about O(${b.toFixed(2)}ⁿ)` : 'not exponential: try an array generator to see polynomial growth', k, desc: `time grows ×${b.toFixed(2)} per +1 of n` }; }
  const label = k < 0.35 ? 'about O(1) or O(log n)' : k < 0.75 ? 'sublinear, between O(log n) and O(n)' : k < 1.5 ? 'about O(n) or O(n log n)' : k < 2.5 ? 'about O(n²)' : k < 3.5 ? 'about O(n³)' : 'worse than O(n³)';
  return { label, k, desc: `time ∝ n^${k.toFixed(2)}` };
}
function drawPts(out, pts, live, timedOut){
  const linear = (S.lab && S.lab.gen) === 'smallnum';
  if (!pts.length){ out.innerHTML = '<div class="res fail">Timed out before the first measurement. Your function may be exponential or loop forever at small n.</div>'; return; }
  const max = Math.max(...pts.map(p => p.ms)) || 1;
  const fit = fitGrowth(pts, linear);
  const ratios = pts.map((p, i) => i && pts[i - 1].ms >= 0.002 ? (p.ms / pts[i - 1].ms).toFixed(1) + '×' : '');
  out.innerHTML = `<div class="card">${live ? '<div class="small muted">measuring…</div>' : `<div class="small muted">Measured growth${fit.desc ? ' (' + fit.desc + ')' : ''}</div><div style="font-size:22px;font-weight:800">${esc(fit.label)}</div>`}
    ${timedOut ? '<p class="small warnline">Stopped early: time exploded as n grew.</p>' : ''}
    <div class="chart">${pts.map(p => `<i style="height:${Math.max(2, 100 * p.ms / max)}%" title="n=${p.n}"></i>`).join('')}</div>
    <div class="tablewrap"><table><tr><th>n</th><th>time</th><th>vs previous</th></tr>${pts.map((p, i) => `<tr><td>${linear ? smallX(p.n) : p.n.toLocaleString()}</td><td>${p.ms < 0.01 ? '&lt; 0.01' : p.ms < 1 ? p.ms.toFixed(3) : p.ms.toFixed(1)} ms</td><td>${ratios[i]}</td></tr>`).join('')}</table></div>
    <p class="small muted">Timing is noisy (garbage collection, CPU caches, phone throttling). Trust the trend in the last few rows, and remember O(n) and O(n log n) look almost the same when measured.</p></div>`;
}

// ---------- Guide ----------
function renderRef(){
  const R = window.REFERENCE;
  view.innerHTML = `<div class="wrap"><h1>Guide</h1><p class="muted">Quick reference for recognizing patterns and analyzing JavaScript.</p>
    <h2>If you see… think…</h2><div class="card tablewrap"><table><tr><th>Signal</th><th>Pattern</th></tr>${R.signals.map(([s, p, u]) => `<tr data-unit="${u}" style="cursor:pointer"><td>${esc(s)}</td><td><a>${esc(p)}</a></td></tr>`).join('')}</table></div>
    <h2>Constraints → target complexity</h2><div class="card tablewrap"><table><tr><th>n</th><th>Target</th><th>Typical</th></tr>${R.constraints.map(r => `<tr>${r.map(c => `<td>${esc(c)}</td>`).join('')}</tr>`).join('')}</table></div>
    <h2>JavaScript built-in costs</h2><div class="card tablewrap"><table><tr><th>Operation</th><th>Cost</th><th>Note</th></tr>${R.builtins.map(([a, b, c]) => `<tr><td><code>${esc(a)}</code></td><td><b>${esc(b)}</b></td><td class="small muted">${esc(c)}</td></tr>`).join('')}</table></div>
    <h2>Analysis checklist</h2><div class="card">${R.checklist.map(([a, b], i) => `<p><b>${i + 1}. ${esc(a)}.</b> <span class="muted">${esc(b)}</span></p>`).join('')}</div>
    <h2>Pattern templates</h2>${R.templates.map(([t, c]) => `<details><summary>${esc(t)}</summary>${codeBlock(c)}</details>`).join('')}
    <h2>Helpers in coding problems</h2><div class="card small"><p><code>ListNode(val, next)</code>, <code>TreeNode(val, left, right)</code>, and <code>MinHeap(cmp)</code> with <code>push</code>, <code>pop</code>, <code>peek</code>, <code>size</code>. Use <code>console.log</code> freely: output appears under each test.</p></div>
  </div>`;
  view.querySelectorAll('[data-unit]').forEach(el => el.onclick = () => { history = [{ name: 'home' }]; current = { name: 'home' }; go('unit', { unit: el.dataset.unit }); });
}

// ---------- Progress ----------
function renderStats(){
  const done = ALL.filter(e => (S.items[e.id] || {}).status === 'done').length;
  const recs = Object.values(S.items).filter(r => r.attempts);
  const att = recs.reduce((a, r) => a + r.attempts, 0), cor = recs.reduce((a, r) => a + r.correct, 0);
  const days = []; for (let i = 13; i >= 0; i--){ const d = new Date(Date.now() - i * DAY); const k = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); days.push(S.days[k] || 0); }
  const mx = Math.max(...days, 1);
  const byKind = {}; ALL.filter(e => e.item.type === 'mcq').forEach(e => { const r = S.items[e.id]; if (!r) return; const k = e.item.kind; byKind[k] = byKind[k] || [0, 0]; byKind[k][0] += r.correct; byKind[k][1] += r.attempts; });
  view.innerHTML = `<div class="wrap"><h1>Progress</h1>${statsRow()}
    <div class="card"><div class="row"><b>Overall</b><div class="spacer"></div><span class="muted">${done}/${ALL.length} items · ${att ? Math.round(100 * cor / att) : 0}% accuracy</span></div>
      <div class="bar" style="margin-top:10px"><i style="width:${100 * done / ALL.length}%"></i></div></div>
    <div class="card"><b>Last 14 days (XP)</b><div class="chart">${days.map(d => `<i style="height:${100 * d / mx}%"></i>`).join('')}</div></div>
    ${Object.keys(byKind).length ? `<div class="card"><b>Analysis skills</b>${Object.entries(byKind).map(([k, [c, a]]) => `<div class="row small" style="margin-top:8px"><span style="width:150px">${esc(KIND_LABEL[k])}</span><div class="bar"><i style="width:${100 * c / a}%"></i></div><span style="width:40px;text-align:right">${Math.round(100 * c / a)}%</span></div>`).join('')}</div>` : ''}
    <h2>Units</h2><div class="card" style="padding:4px 12px">${UNITS.map((u, i) => { const p = unitProgress(u); return `<div class="item-row" data-unit="${u.id}"><div class="ring" style="--p:${p.pct};width:34px;height:34px"><span style="width:26px;height:26px;font-size:9px">${p.pct}</span></div><div style="flex:1">${i + 1}. ${esc(u.title)}</div><span class="small muted">${p.done}/${p.total}</span></div>`; }).join('')}</div>
    <h2>Settings & backup</h2>
    <div class="card"><label class="f">Daily XP goal</label><select id="goal">${[20, 40, 60, 100].map(g => `<option ${g === S.goal ? 'selected' : ''}>${g}</option>`).join('')}</select>
      <p class="small muted" style="margin-top:12px">Progress is stored on this device only. Copy a backup to move it to another device (for example from iPhone to desktop).</p>
      <div class="row" style="flex-wrap:wrap"><button class="btn sm" id="exp">Copy backup</button><button class="btn sm" id="imp">Restore backup</button><button class="btn sm" id="reset" style="color:var(--bad)">Reset all progress</button></div>
      <div id="impBox"></div></div>
  </div>`;
  view.querySelectorAll('[data-unit]').forEach(el => el.onclick = () => { history = [{ name: 'home' }]; current = { name: 'home' }; go('unit', { unit: el.dataset.unit }); });
  $('#goal').onchange = ev => { S.goal = +ev.target.value; save(); render(); };
  $('#exp').onclick = async () => { const data = JSON.stringify(S); try { await navigator.clipboard.writeText(data); toast('Backup copied'); } catch (e){ $('#impBox').innerHTML = `<label class="f">Copy this text:</label><textarea class="plain" readonly>${esc(data)}</textarea>`; } };
  $('#imp').onclick = () => { $('#impBox').innerHTML = `<label class="f">Paste backup text</label><textarea class="plain" id="impText"></textarea><button class="btn sm primary" id="impGo" style="margin-top:8px">Restore</button>`; $('#impGo').onclick = () => { try { const d = JSON.parse($('#impText').value); if (!d.items) throw 0; S = d; save(); load(); toast('Restored'); render(); } catch (e){ toast('That backup is not valid'); } }; };
  $('#reset').onclick = ev => { const b = ev.target; if (b.dataset.c){ localStorage.removeItem(KEY); load(); toast('Progress reset'); render(); } else { b.dataset.c = 1; b.textContent = 'Tap again to erase everything'; } };
}

// ---------- boot ----------
render();
if ('serviceWorker' in navigator && location.protocol === 'https:' && window.top === window.self){
  navigator.serviceWorker.register('sw.js').catch(() => {});
}
window.__app = { S, ALL, go, startSession };
})();
