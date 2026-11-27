/* BRIDGE shared engine: reads window.BRIDGE (content.js) and renders shared sections.
   Used by index.html, express.html, present.html and prospectus.html. No dependencies. */
(function () {
'use strict';
const B = window.BRIDGE;
if (!B) { console.warn('content.js did not load'); return; }

/* ---------- helpers ---------- */
const $ = (id) => document.getElementById(id);
const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const money = (n, plus) => '$' + Number(n).toLocaleString('en-US') + (plus ? '+' : '');
const slug = (s) => String(s).toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const store = {
  get(k) { try { return JSON.parse(localStorage.getItem(k)); } catch (_) { return null; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch (_) { return false; } }
};
const giveUrl = (n) => (B.links.givePrefill && n ? B.links.give + (B.links.give.includes('?') ? '&' : '?') + 'amount=' + n : B.links.give);
const tierById = (id) => B.tiers.find((t) => t.id === id);
const tierLabel = (t) => t.amount == null ? 'Set together' : money(t.amount, t.plus);
/* each package's benefit text comes from the central benefit list, never from "everything in the level below" */
B.tiers.forEach((t) => { t.benefits = (t.benefitIds || []).map((id) => (B.benefits[id] || {}).label).filter(Boolean); t.online = false; });

/* ======================= partnership rules engine =======================
   Pure functions. No DOM. Used by the builder, the proposal, Partner Express, the deck and tools/test-rules.js.
   Money, designation, title, benefits, approvals and checkout are calculated separately. */
const rules = {};
rules.MAX = 1000000;
rules.VERSION = 'rules-2027-1';
/* "1,250.50" -> 1251 (rounded, noted); "-5" -> 0 (negative); "abc" -> 0 (invalid) */
rules.parseAmount = (raw) => {
  const str = String(raw == null ? '' : raw).trim().replace(/[$,\s]/g, '');
  if (!str) return { value: 0, note: '' };
  if (!/^-?(\d+\.?\d*|\.\d+)$/.test(str)) return { value: 0, note: 'invalid' };
  const n = Number(str);
  if (!isFinite(n)) return { value: 0, note: 'invalid' };
  if (n < 0) return { value: 0, note: 'negative' };
  if (n > rules.MAX) return { value: rules.MAX, note: 'capped' };
  const r = Math.round(n);
  return { value: r, note: r !== n ? 'rounded' : '' };
};
/* the package a program amount maps to: exact published amounts only. Any other amount is a program gift. */
rules.programPackage = (amount) => (amount === 250 ? tierById('supporter') : amount === 500 ? tierById('partner') : null);
const RECOG = ['moment', 'progPresent', 'seasonAck', 'founding', 'seasonPresent'];
/* sel = { programs: [{ i, amount }], presentProgram: i|null, season: tierId|null, institutional: bool,
           institutionalAmount: n, gift: n, inkind: text, recognition: 'name'|'anonymous'|'none' } */
rules.evaluate = (sel) => {
  sel = sel || {};
  const P = B.programs, out = { lines: [], titles: [], benefits: [], approvals: [], notes: [], restricted: 0, unrestricted: 0, season: 0, institutional: 0 };
  const recog = sel.recognition || 'name';
  const addBen = (id, where) => {
    const b = B.benefits[id]; if (!b) return;
    if (recog !== 'name' && RECOG.includes(id)) return;
    if (b.stack === 'once' || b.stack === 'per-gift') { if (out.benefits.some((x) => x.id === id)) return; where = b.scope === 'per-gift' ? 'Once, for your whole commitment' : (b.scope === 'season' ? 'Spring 2027 season' : 'This partnership'); }
    out.benefits.push({ id, label: b.label, where, scope: b.scope, limited: !!b.limited, approval: !!b.approval, duration: b.duration });
  };
  /* Track A: one entry per program (a Map upstream guarantees no duplicates; guard anyway) */
  const seen = new Set();
  (sel.programs || []).forEach(({ i, amount }) => {
    if (seen.has(i) || !P[i]) return; seen.add(i);
    const a = rules.parseAmount(amount).value; if (!a) return;
    const pkg = rules.programPackage(a), p = P[i];
    out.restricted += a;
    out.lines.push({ kind: 'program', i, program: p.n, date: p.d, amount: a, designation: 'Restricted to ' + p.n, title: pkg ? pkg.name : 'Program gift' });
    out.titles.push({ name: pkg ? pkg.name : 'Program gift', where: p.n, track: 'program', proposed: true });
    (pkg ? pkg.benefitIds : ['ack']).forEach((id) => addBen(id, p.n));
  });
  if (sel.presentProgram != null && P[sel.presentProgram]) {
    const t = tierById('progpresenting'), p = P[sel.presentProgram];
    out.lines.push({ kind: 'progpresenting', i: sel.presentProgram, program: p.n, date: p.d, amount: 0, designation: 'Restricted to ' + p.n + ', amount set together', title: t.name });
    out.titles.push({ name: t.name, where: p.n, track: 'program', proposed: true, approval: true });
    t.benefitIds.forEach((id) => addBen(id, p.n));
    out.approvals.push('Presenting ' + p.n + ': amount, availability and scope are set in conversation. One presenting partner per program.');
  }
  /* Track B: one season package at most, only when chosen */
  if (sel.season) {
    const t = tierById(sel.season);
    if (t && t.track === 'season') {
      out.season = t.amount;
      out.lines.push({ kind: 'season', amount: t.amount, designation: 'Spring 2027 season as a whole, used across programs by BRIDGE', title: t.name });
      out.titles.push({ name: t.name, where: 'Spring 2027 season', track: 'season', proposed: true, approval: !!t.approval });
      t.benefitIds.forEach((id) => addBen(id));
      if (t.approval) out.approvals.push(t.name + ' requires BRIDGE approval' + (t.id === 'seasonpresenting' ? ', and only one can exist.' : '.'));
    }
  }
  /* Track C: interest in an institutional partnership is a conversation, never a checkout */
  if (sel.institutional) {
    const t = tierById('institutional'), a = rules.parseAmount(sel.institutionalAmount).value;
    out.institutional = a;
    out.lines.push({ kind: 'institutional', amount: a, designation: 'Set in a written agreement', title: t.name });
    out.titles.push({ name: t.name, where: 'Organization-wide', track: 'institutional', proposed: true, approval: true });
    t.benefitIds.forEach((id) => addBen(id));
    out.approvals.push('An institutional partnership is set in a written agreement after a conversation.');
    if (a && a < t.amount) out.notes.push('Institutional partnerships usually start at ' + money(t.amount) + '. We are glad to talk about ' + money(a) + '; the scope will be set together.');
  }
  /* unrestricted gift: no title */
  const g = rules.parseAmount(sel.gift).value;
  if (g) { out.unrestricted = g; out.lines.push({ kind: 'gift', amount: g, designation: 'Unrestricted', title: 'Unrestricted gift' }); addBen('ack'); }
  out.inkind = String(sel.inkind || '').trim();
  if (out.inkind) { out.lines.push({ kind: 'inkind', amount: 0, designation: 'In-kind, no dollar value assigned', title: 'In-kind contribution', text: out.inkind }); addBen('ack'); out.approvals.push('In-kind offers are confirmed with the program team before they are accepted.'); }
  if (out.benefits.some((b) => b.limited)) out.approvals.push('Named moments and presenting acknowledgment are limited and are confirmed in writing before they are promised.');
  if (recog !== 'name') out.notes.push(recog === 'anonymous' ? 'You asked to give anonymously, so name recognition benefits are removed. Your gift is still acknowledged privately.' : 'You asked for no public recognition, so recognition benefits are removed.');

  out.total = out.restricted + out.season + out.institutional + out.unrestricted;
  const progCount = out.lines.filter((l) => l.kind === 'program').length;
  /* the no-arbitrage notes: totals never become titles */
  const crossed = B.tiers.filter((t) => t.track !== 'program' && t.amount && out.total >= t.amount && !out.titles.some((x) => x.name === t.name));
  if (crossed.length && (progCount || out.unrestricted)) {
    const top = crossed[crossed.length - 1];
    out.notes.push('Your total of ' + money(out.total) + ' does not make this a ' + top.name + ' partnership. Titles come only from the package you choose' + (progCount > 1 ? ', so ' + progCount + ' program sponsorships stay ' + progCount + ' program sponsorships' : '') + '.');
  }
  if (sel.season && progCount) out.notes.push('Your season package and your program support are separate. The season package does not add program benefits, and program support does not change your season title.');
  if (progCount && !sel.season && progCount === P.length) out.notes.push('You selected every program individually. That is ' + progCount + ' program sponsorships, not a season package.');
  /* checkout: only an unrestricted-only gift can be paid online, because the payment page cannot carry designations */
  const onlyGift = out.unrestricted > 0 && out.lines.every((l) => l.kind === 'gift');
  out.checkout = !out.lines.length ? { mode: 'none', amount: 0 }
    : onlyGift ? { mode: 'online', amount: out.unrestricted }
    : { mode: 'confirm', amount: out.total, giftPart: out.unrestricted, reason: 'Program, season, institutional and in-kind support is confirmed with BRIDGE first, so your designation is recorded before any payment.' };
  out.goalPct = Math.round(out.total / B.goals.amount * 1000) / 10;   // accurate, may exceed 100
  out.goalBar = Math.min(100, out.goalPct);                           // the bar alone caps at 100
  out.empty = !out.lines.length;
  out.status = 'Proposed. Not an agreement, not a reservation and not a payment.';
  return out;
};
/* plain-text summary lines for email, review and proposal */
rules.describe = (r) => r.lines.map((l) => l.kind === 'inkind' ? 'In-kind: ' + l.text
  : l.kind === 'progpresenting' ? l.title + ', ' + l.program + ' (' + l.date + '): amount set together'
  : l.kind === 'institutional' ? l.title + (l.amount ? ', ' + money(l.amount) : ', amount set together')
  : l.kind === 'program' ? l.title + ', ' + l.program + ' (' + l.date + '): ' + money(l.amount)
  : l.title + ': ' + money(l.amount));

/* derived metrics stay consistent with the lists they count */
B.metrics.forEach((m) => {
  if (m.derive && m.value == null) {
    const n = (B[m.derive] || []).length;
    if (n) { m.value = n; m.display = String(n); }
  }
  if (m.value != null && !m.display) m.display = Number(m.value).toLocaleString('en-US');
});
const metric = (id) => B.metrics.find((m) => m.id === id && m.value != null);
const visibleMetrics = (cat) => B.metrics.filter((m) => m.value != null && (!cat || m.category === cat));

/* ---------- binds: data-bind="email" | data-href="give" ---------- */
function binds(root = document) {
  root.querySelectorAll('[data-bind]').forEach((el) => {
    const k = el.dataset.bind;
    const v = { differentiator: B.org.differentiator, ein: B.org.taxStatus.ein, founded: B.org.founded, email: B.org.email, name: B.org.name, mission: B.org.mission, goal: money(B.goals.amount), season: B.goals.season, tax: B.org.taxStatus.label, positioning: B.org.positioning }[k];
    if (v != null) el.textContent = v;
  });
  root.querySelectorAll('[data-href]').forEach((el) => {
    const k = el.dataset.href;
    if (k === 'give') el.href = giveUrl(+el.dataset.amt || 0);
    else if (k === 'email') el.href = 'mailto:' + B.org.email + (el.dataset.subject ? '?subject=' + encodeURIComponent(el.dataset.subject) : '');
    else if (k === 'prospectus') el.href = B.links.prospectusPdf;
    else if (k === 'overview') el.href = B.links.overviewPdf;
    else if (k === 'tracker') el.href = B.links.tracker;
    else if (k === 'talk') {
      if (B.links.booking) { el.href = B.links.booking; el.target = '_blank'; el.rel = 'noopener'; }
      else el.href = 'mailto:' + B.org.email + '?subject=' + encodeURIComponent('Scheduling a conversation about partnering with BRIDGE') + '&body=' + encodeURIComponent('Hi BRIDGE team,\n\nWe would like to schedule a conversation about partnering with BRIDGE the District.\n\nOrganization:\nName and title:\nA few times that work:\n');
    }
  });
}

/* ---------- status chips ---------- */
const chip = (kind, text) => `<span class="chip chip-${kind}">${esc(text)}</span>`;
const progStatus = (p) => chip(p.status, B.programStatus[p.status] || p.status);
const evidenceLabel = { established: 'Activity', activity: 'Activity', output: 'Output', measured: 'Measured', intended: 'Intended outcome' };
const evClass = { activity: 'established', output: 'established' };

/* ---------- renderers (data-render="name") ---------- */
const R = {};

R.highlights = (el) => {
  const ms = B.metrics.filter((m) => m.highlight && m.value != null).slice(0, 4);
  el.innerHTML = ms.map((m, i) => `<div class="stat${i === 0 ? ' big' : ''}"><b>${esc(m.display)}</b><span>${esc(m.label)}</span><small>${esc(m.period)}</small></div>`).join('');
  el.hidden = !ms.length;
};

R.gap = (el) => {
  el.innerHTML = B.gapStats.map((g) => g.bars
    ? `<div class="gapcard"><p class="gtitle">${esc(g.title)}</p><div class="bars">${g.bars.map(([l, v]) => `<div><span>${esc(l)}</span><span class="t"><i style="--w:${v}%"></i></span><span>${v}%</span></div>`).join('')}</div><p>${esc(g.text)}</p><cite><a href="${esc(g.url)}" target="_blank" rel="noopener">${esc(g.source)}</a></cite></div>`
    : `<div class="gapcard"><b>${esc(g.value)}</b><p>${esc(g.text)}</p><cite><a href="${esc(g.url)}" target="_blank" rel="noopener">${esc(g.source)}</a></cite></div>`).join('');
};

R.focus = (el) => {
  el.innerHTML = B.focusAreas.map((f) => `<li style="--c:${f.color}"><i aria-hidden="true"></i><div><b>${esc(f.name)}</b><span>${esc(f.text)}</span></div></li>`).join('');
};

/* theory of change: stations, map, detail panel, "follow one investment" */
R.model = (el) => {
  const M = B.model;
  const pos = { resources: 'c1', programs: 'c2', scholars: 'c3', college: 'c4a', younger: 'c4b', outcomes: 'c5' };
  el.innerHTML = `
  <div class="tocmap">
    <svg class="toclines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
      <path class="tl trunk" d="M10 50 H50" pathLength="1"/>
      <path class="tl red" d="M50 48 C56 48 56 25 62 25 H70 C79 25 79 48 90 48" pathLength="1"/>
      <path class="tl blue" d="M50 52 C56 52 56 75 62 75 H70 C79 75 79 52 90 52" pathLength="1"/>
      <circle class="tdot" r="1.4" cx="10" cy="50"/>
    </svg>
    <ol class="tocstations" role="tablist" aria-label="How BRIDGE creates impact">
      ${M.map((s, i) => `<li class="${pos[s.id]} k-${s.kind}${s.line ? ' l-' + s.line : ''}"><button role="tab" id="toc-t-${s.id}" aria-controls="toc-panel" aria-selected="${i === 2}" tabindex="${i === 2 ? 0 : -1}" data-i="${i}"><span class="ring" aria-hidden="true"></span><span class="nm">${esc(s.short)}</span></button></li>`).join('')}
    </ol>
  </div>
  <div class="toclegend" aria-hidden="true"><span><i class="lg-est"></i>Activity and output</span><span><i class="lg-mea"></i>Measured</span><span><i class="lg-int"></i>Intended outcome</span></div>
  <div class="tocpanel" id="toc-panel" role="tabpanel" aria-live="polite"></div>
  <div class="tocctl"><button class="btn" type="button" id="tocPlay">Follow one investment</button><span class="tochint">Select a station, or use the arrow keys.</span></div>`;
  const panel = el.querySelector('.tocpanel'), tabs = [...el.querySelectorAll('[role=tab]')];
  const ev = (e) => {
    if (e.type === 'measured') {
      const m = metric(e.metricId);
      if (!m) return '';
      return `<li class="ev ev-measured">${chip('measured', evidenceLabel.measured)}<span><b>${esc(m.display)}</b> ${esc(m.label)} <em>${esc(m.period)}</em></span></li>`;
    }
    return `<li class="ev ev-${e.type}">${chip(evClass[e.type] || e.type, evidenceLabel[e.type])}<span>${esc(String(e.text).replace('{programs}', B.programs.length))}</span></li>`;
  };
  const show = (i) => {
    const s = M[i];
    tabs.forEach((t, j) => { t.setAttribute('aria-selected', j === i); t.tabIndex = j === i ? 0 : -1; t.parentElement.classList.toggle('cur', j === i); });
    panel.setAttribute('aria-labelledby', 'toc-t-' + s.id);
    panel.innerHTML = `<div class="tp-k">Station ${i + 1} of ${M.length}${s.kind === 'transfer' ? ' · Transfer station' : ''}</div><h3>${esc(s.name)}</h3><p>${esc(s.text)}</p><ul class="evs">${s.evidence.map(ev).join('')}</ul>`;
    panel.classList.remove('swap'); void panel.offsetWidth; panel.classList.add('swap');
  };
  tabs.forEach((t) => t.addEventListener('click', () => { stop(); show(+t.dataset.i); }));
  el.querySelector('.tocstations').addEventListener('keydown', (e) => {
    const i = tabs.findIndex((t) => t.getAttribute('aria-selected') === 'true');
    let j = null;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') j = Math.min(M.length - 1, i + 1);
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') j = Math.max(0, i - 1);
    if (e.key === 'Home') j = 0; if (e.key === 'End') j = M.length - 1;
    if (j != null) { e.preventDefault(); e.stopPropagation(); stop(); show(j); tabs[j].focus(); }
  });
  show(2);
  /* follow one investment */
  let timer = null;
  const order = [0, 1, 2, 3, 4, 5];
  const play = el.querySelector('#tocPlay');
  function stop() { if (timer) { clearInterval(timer); timer = null; el.classList.remove('playing'); play.textContent = 'Follow one investment'; } }
  play.addEventListener('click', () => {
    if (timer) { stop(); return; }
    el.classList.add('playing'); play.textContent = 'Pause';
    let k = 0; show(order[k]);
    el.style.setProperty('--tp', 0);
    timer = setInterval(() => { k++; if (k >= order.length) { stop(); return; } show(order[k]); el.style.setProperty('--tp', k / (order.length - 1)); }, 2600);
  });
  /* lines draw when seen */
  if ('IntersectionObserver' in window) new IntersectionObserver((es, o) => es.forEach((e) => { if (e.isIntersecting) { el.classList.add('drawn'); o.disconnect(); } }), { threshold: 0.3 }).observe(el);
  else el.classList.add('drawn');
};

R.impact = (el) => {
  const cats = [
    ['reach', 'Reach', 'Who BRIDGE reaches'],
    ['demand', 'Demand', 'How many want in'],
    ['delivery', 'Delivery', 'What BRIDGE has done'],
    ['outcomes', 'Outcomes', 'What changes for students']
  ];
  el.innerHTML = cats.map(([c, name, sub], i) => {
    const ms = visibleMetrics(c);
    const body = ms.length
      ? ms.map((m) => `<li><b>${esc(m.display)}</b><div><span>${esc(m.label)}</span><small>${esc(m.period)}${m.note ? ' · ' + esc(m.note) : ''}</small><em class="mst mst-${esc(m.status)}">${esc((B.statusLabels || {})[m.status] || m.status)}</em></div></li>`).join('')
      : `<li class="none"><div><span>${esc(B.impactNotes[c] || 'Figures will appear once documented.')}</span></div></li>`;
    return `<section class="ic ic-${c}" aria-labelledby="ic-${c}"><header><span class="icn">${i + 1}</span><div><h3 id="ic-${c}">${name}</h3><small>${sub}</small></div></header><ul>${body}</ul></section>`;
  }).join('');
};

R.impactCompact = (el) => {
  const ms = visibleMetrics().filter((m) => m.category !== 'outcomes').slice(0, 6);
  el.innerHTML = ms.map((m) => `<li><b>${esc(m.display)}</b><span>${esc(m.label)}</span><small>${esc(m.period)}</small></li>`).join('');
};

R.programsOverview = (el) => {
  const months = {};
  B.programs.forEach((p, i) => { const m = new Date(p.iso + 'T12:00:00').toLocaleString('en-US', { month: 'long' }); (months[m] = months[m] || []).push([p, i]); });
  const T = B.programTypes;
  el.innerHTML = `<div class="sem">${Object.entries(months).map(([m, ps]) => `<div class="mo"><h4>${m}</h4><ol>${ps.map(([p, i]) => `<li style="--c:${T[p.type].color}"><button type="button" data-stop="${i}"><i aria-hidden="true"></i><span><small>${esc(p.d)}</small>${esc(p.n)}</span></button></li>`).join('')}</ol></div>`).join('')}</div>
  <ul class="semkey">${Object.entries(T).map(([k, t]) => { const st = B.model.find((s) => s.id === t.model); return `<li style="--c:${t.color}"><i aria-hidden="true"></i><b>${esc(t.label)}</b><span>feeds ${esc(st ? st.short : '')}</span></li>`; }).join('')}</ul>
  <p class="semnote">${esc(B.programStatusNote)}</p>`;
};

R.programsList = (el) => {
  const T = B.programTypes;
  el.innerHTML = B.programs.map((p) => `<li style="--c:${T[p.type].color}"><span class="pd">${esc(p.d)}</span><span class="pn"><b>${esc(p.n)}</b><small>${esc(T[p.type].label)}${p.returning ? ' · Returning program' : ''}</small></span>${progStatus(p)}</li>`).join('');
};

R.narrative = (el) => {
  const ts = (B.testimonials || []).filter((t) => t.approved && t.quote);
  const ss = (B.stories || []).filter((t) => t.approved);
  if (!ts.length && !ss.length) { el.hidden = true; return; }
  el.hidden = false;
  el.innerHTML = ts.map((t) => `<figure class="quote"><blockquote>${esc(t.quote)}</blockquote><figcaption><b>${esc(t.name)}</b>${t.role ? ', ' + esc(t.role) : ''}</figcaption></figure>`).join('')
    + ss.map((s) => `<article class="story">${s.photo ? `<img src="${esc(s.photo)}" alt="${esc(s.alt || '')}" loading="lazy">` : ''}<h3>${esc(s.title)}</h3><p>${esc(s.text)}</p></article>`).join('');
};

R.speakers = (el) => {
  el.innerHTML = B.speakers.map((s) => `<div class="psign"><i>${esc(s.program)}</i><b>${esc(s.name)}</b><span>${esc(s.role)}</span></div>`).join('') + '<div class="psign you"><i>Spring 2027</i><b>You?</b><span>Join any program on the line</span></div>';
};

R.orgsMarquee = (el) => {
  const names = [...new Set(B.relationships.filter((r) => r.type !== 'recognition').flatMap((r) => r.items.map((x) => x.replace(/\s*\(.*\)$/, ''))))];
  const run = names.map((n) => `<span>${esc(n)}</span>`).join('');
  el.innerHTML = `<div class="orgs-run">${run}${run.replace(/<span>/g, '<span aria-hidden="true">')}</div>`;
};

R.relationships = (el) => {
  el.innerHTML = B.relationships.filter((r) => r.items.length).map((r) => `<div class="rel rel-${r.type}"><h4>${esc(r.label)}</h4>${r.note ? `<p>${esc(r.note)}</p>` : ''}<ul>${r.items.map((x) => `<li>${esc(x)}</li>`).join('')}</ul></div>`).join('');
};

R.org = (el) => {
  const o = B.org;
  const docs = B.documents || [];
  const ds = B.documentStatus || {};
  el.innerHTML = `
  <div class="orgcol">
    <h3>Mission</h3><p>${esc(o.mission)}</p>
    ${o.foundingStory ? `<h3>How BRIDGE started</h3><p>${esc(o.foundingStory)}</p>` : ''}
    <h3>${esc(o.fellowship.name)}</h3><p>${esc(o.fellowship.summary)}</p>
    ${o.governance ? `<h3>Governance</h3><p>${esc(o.governance.summary)}</p>` : ''}
  </div>
  <div class="orgcol">
    <dl class="orgfacts">
      <div><dt>Legal status</dt><dd>${esc(o.taxStatus.label)}${o.taxStatus.ein ? ' · EIN ' + esc(o.taxStatus.ein) : ''}<small>${esc(o.taxStatus.detail)}</small>${o.legal ? `<small>${esc(o.legal)}</small>` : ''}</dd></div>
      <div><dt>Based in</dt><dd>${esc(o.city)}${o.founded ? ' · Founded ' + esc(o.founded) : ''}</dd></div>
      ${(o.founders || []).length ? `<div><dt>Founders</dt><dd>${o.founders.map((l) => `${esc(l.name)}<small>${esc(l.role)}</small>`).join('')}</dd></div>` : ''}
      ${(o.team || []).length ? `<div><dt>Student leadership team</dt><dd class="team">${o.team.map((t) => `<span><b>${esc(t.role)}</b> ${esc(t.text)}</span>`).join('')}</dd></div>` : ''}
      ${o.recognition.length ? `<div><dt>Recognition</dt><dd>${o.recognition.map((r) => `${esc(r.year)} ${esc(r.name)}<small>${esc(r.from)}</small>`).join('')}</dd></div>` : ''}
      <div><dt>Contact</dt><dd><a href="mailto:${esc(o.email)}">${esc(o.email)}</a></dd></div>
      <div><dt>Documents</dt><dd class="docs">${docs.map((d) => `<span>${d.file ? `<a href="${esc(d.file)}" target="_blank" rel="noopener">${esc(d.label)}</a>` : esc(d.label)}${d.value ? ' ' + esc(d.value) : ''}<em class="dst dst-${esc(d.availability)}">${esc(ds[d.availability] || d.availability)}</em></span>`).join('')}<small>Request documents at <a href="mailto:${esc(o.email)}?subject=${encodeURIComponent('Documentation request')}">${esc(o.email)}</a>.</small></dd></div>
    </dl>
  </div>`;
};

R.costAreas = (el) => {
  el.innerHTML = B.costAreas.map((c, i) => `<li class="fcard"><span class="fno">${String(i + 1).padStart(2, '0')}</span><h3>${esc(c.name)}</h3><p>${esc(c.text)}</p>${c.equivalency ? `<p class="eqv">${esc(c.equivalency)}</p>` : ''}<small>${c.programs.map(esc).join(' · ')}</small></li>`).join('');
};

R.tiers = (el) => {
  const TR = B.tracks;
  const card = (t) => `<div class="fare${t.tag ? ' hot' : ''}${t.id === 'founding' ? ' gold' : ''}">${t.tag ? `<span class="tag">${esc(t.tag)}</span>` : ''}<div class="fcard-k">${esc(t.card)}</div><div class="price${t.amount == null ? ' custom' : ''}">${tierLabel(t)}</div><h3>${esc(t.name)}</h3><p>${esc(t.blurb)}</p><ul>${t.benefits.map((b) => `<li>${esc(b)}</li>`).join('')}</ul>${t.approval ? '<p class="appr">Requires BRIDGE approval</p>' : ''}<div class="farebtns"><a class="btn solid" href="#build" data-tier="${t.id}">${t.track === 'institutional' ? 'Start a conversation' : 'Add to my proposal'}</a></div></div>`;
  el.innerHTML = Object.entries(TR).map(([k, tr]) => { const ts = B.tiers.filter((t) => t.track === k); return `<div class="trackgrp tg-${k}"><div class="tg-h"><span class="tlab">${esc(tr.label)}</span><h3>${esc(tr.name)}</h3><p>${esc(tr.text)}</p></div><div class="fares f${ts.length}">${ts.map(card).join('')}</div></div>`; }).join('')
    + `<div class="trackgrp tg-gift"><div class="tg-h"><span class="tlab">No title</span><h3>${esc(B.unrestricted.name)}</h3><p>${esc(B.unrestricted.text)}</p></div><div class="giftrow"><a class="btn solid" href="${esc(giveUrl(0))}" target="_blank" rel="noopener">Give an unrestricted gift online</a><a class="btn" href="#build">Or add it to a proposal</a></div></div>`
    + `<p class="tiernote">${esc(B.tierNote)}</p>`;
  binds(el);
};

R.fareChart = (el) => {
  const ts = B.tiers, ids = [...new Set(ts.flatMap((t) => t.benefitIds))];
  const scope = { 'per-program': 'Per program supported', season: 'Once, for the season', partnership: 'Once, for the partnership', 'per-gift': 'Once per commitment' };
  el.innerHTML = `<div class="fc-h" role="row"><span role="columnheader">Benefit and how it stacks</span>${ts.map((t) => `<span role="columnheader">${esc(t.name)}<small>${tierLabel(t)}</small></span>`).join('')}</div>` + ids.map((id) => { const b = B.benefits[id]; return `<div role="row"><span role="cell">${esc(b.label)}<small>${esc(scope[b.scope])}${b.limited ? ' · limited, confirmed in writing' : ''}${b.approval && !b.limited ? ' · subject to review' : ''}</small></span>${ts.map((t) => { const y = t.benefitIds.includes(id); return `<i role="cell" class="${y ? 'y' : ''}" aria-label="${y ? 'Included' : 'Not included'}"></i>`; }).join('')}</div>`; }).join('');
  el.style.setProperty('--cols', ts.length);
};

R.partnerRules = (el) => {
  el.innerHTML = `<div class="prules"><div><h4>How packages combine</h4><ul><li>Titles come only from the package you choose. A total never becomes a title.</li><li>Program benefits are delivered per program. Season and partnership benefits are delivered once, however many packages you hold.</li><li>A season package does not include each program's individual benefits, and program sponsorships never add up to a season package.</li><li>Named moments and presenting acknowledgment are limited, so they are confirmed in writing before they are promised.</li></ul></div><div><h4>About Founding Rider</h4><ul>${B.foundingRules.map((x) => `<li>${esc(x)}</li>`).join('')}</ul></div><div><h4>If a program changes</h4><p>${esc(B.changePolicy)}</p><h4>From interest to partnership</h4><ol class="lcyc">${B.lifecycle.map((x) => `<li>${esc(x)}</li>`).join('')}</ol></div></div>`;
};

R.supportTypes = (el) => {
  el.innerHTML = B.supportTypes.map((s) => {
    let text = s.text;
    if (s.id === 'recurring' && !B.links.recurringAvailable) text += ' Email us to set one up.';
    return `<li id="st-${s.id}"><h3>${esc(s.name)}</h3><p>${esc(text)}</p></li>`;
  }).join('');
};

R.audiences = (el) => {
  const A = B.audiences;
  el.innerHTML = `<div class="aud-tabs" role="tablist" aria-label="Choose your organization type">${A.map((a, i) => `<button role="tab" id="aud-${a.id}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}" data-i="${i}">${esc(a.name)}</button>`).join('')}</div><div class="aud-panel" role="tabpanel" aria-live="polite"></div>`;
  const tabs = [...el.querySelectorAll('[role=tab]')], panel = el.querySelector('.aud-panel');
  const show = (i) => {
    const a = A[i];
    tabs.forEach((t, j) => { t.setAttribute('aria-selected', j === i); t.tabIndex = j === i ? 0 : -1; });
    panel.setAttribute('aria-labelledby', 'aud-' + a.id);
    const tiers = a.tiers.map(tierById).filter(Boolean);
    const sup = a.support.map((id) => B.supportTypes.find((s) => s.id === id)).filter(Boolean);
    panel.innerHTML = `<div><h4>How ${esc(a.name.toLowerCase())} take part</h4><ul>${a.ways.map((w) => `<li>${esc(w)}</li>`).join('')}</ul>${a.steps ? `<h4>How it usually moves</h4><ol class="jsteps">${a.steps.map((w) => `<li>${esc(w)}</li>`).join('')}</ol>` : ''}</div><div><h4>Where to start</h4><ul>${tiers.map((t) => `<li><b>${tierLabel(t)}</b> ${esc(t.name)}</li>`).join('')}${sup.map((s) => `<li>${esc(s.name)}</li>`).join('')}</ul>${a.docs ? `<h4>What you may need from us</h4><ul class="jdocs">${a.docs.map((w) => `<li>${esc(w)}</li>`).join('')}</ul>` : ''}${a.time ? `<p class="jtime"><b>Typical lead time:</b> ${esc(a.time)}</p>` : ''}<a class="btn solid" href="#build" data-aud="${a.id}">Build your partnership</a></div>`;
  };
  tabs.forEach((t) => t.addEventListener('click', () => show(+t.dataset.i)));
  el.querySelector('.aud-tabs').addEventListener('keydown', (e) => {
    const i = tabs.findIndex((t) => t.getAttribute('aria-selected') === 'true');
    let j = null;
    if (e.key === 'ArrowRight') j = (i + 1) % A.length; if (e.key === 'ArrowLeft') j = (i - 1 + A.length) % A.length;
    if (j != null) { e.preventDefault(); e.stopPropagation(); show(j); tabs[j].focus(); }
  });
  show(0);
};

R.pathways = (el) => {
  const P = B.pathways;
  el.innerHTML = `<div class="pw-pylon" role="tablist" aria-label="Industry pathways" aria-orientation="vertical">${P.map((p, i) => `<button role="tab" id="pw-${p.id}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}" data-i="${i}" style="--c:${p.color}"><span class="bul" aria-hidden="true">${esc(p.code)}</span><span class="pwn">${esc(p.name)}</span><small>${p.status === 'existing' ? 'Running now' : 'Proposed'}</small></button>`).join('')}</div><div class="pw-panel" role="tabpanel" aria-live="polite"></div>`;
  const tabs = [...el.querySelectorAll('[role=tab]')], panel = el.querySelector('.pw-panel');
  const show = (i) => {
    const p = P[i];
    tabs.forEach((t, j) => { t.setAttribute('aria-selected', j === i); t.tabIndex = j === i ? 0 : -1; });
    panel.style.setProperty('--c', p.color);
    panel.setAttribute('aria-labelledby', 'pw-' + p.id);
    const progs = p.programs.map((n) => B.programs.find((x) => x.n === n)).filter(Boolean);
    panel.innerHTML = `<div class="pw-head"><span class="bul big" aria-hidden="true">${esc(p.code)}</span><div><h3>${esc(p.name)}</h3><p class="pw-focus">${esc(p.focus)}</p></div></div>
      <div class="pw-status">${p.status === 'existing'
        ? `${chip('existing', 'Programming running now')}<span>On the spring line: ${progs.map((x) => `${esc(x.n)} (${esc(x.d)})`).join(', ')}</span>`
        : `${chip('proposed', 'Proposed opportunity')}<span>No BRIDGE programming in this field yet. This is a pathway we would build with a partner.</span>`}</div>
      <ol class="pw-route">
        <li><small>Why it matters</small><p>${esc(p.why)}</p></li>
        <li><small>What participation could look like</small><ul>${p.looks.map((x) => `<li>${esc(x)}</li>`).join('')}</ul></li>
        <li><small>For students</small><p>${esc(p.students)}</p></li>
        <li><small>For your institution</small><p>${esc(p.institution)}</p></li>
      </ol>
      <div class="pw-cta"><a class="btn solid" href="#build" data-industry="${esc(p.name)}">${p.status === 'existing' ? 'Join this pathway' : 'Help build this pathway'}</a><a class="btn" data-href="talk" href="#">Schedule a conversation</a></div>`;
    binds(panel);
    panel.classList.remove('swap'); void panel.offsetWidth; panel.classList.add('swap');
  };
  tabs.forEach((t) => t.addEventListener('click', () => show(+t.dataset.i)));
  el.querySelector('.pw-pylon').addEventListener('keydown', (e) => {
    const i = tabs.findIndex((t) => t.getAttribute('aria-selected') === 'true');
    let j = null;
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') j = (i + 1) % P.length;
    if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') j = (i - 1 + P.length) % P.length;
    if (j != null) { e.preventDefault(); e.stopPropagation(); show(j); tabs[j].focus(); }
  });
  show(0);
};

R.faq = (el) => {
  const G = B.faqGroups || {};
  const groups = [...new Set(B.faq.map((f) => f.group || ''))];
  el.innerHTML = groups.map((g) => `<div class="faqg">${G[g] ? `<h3>${esc(G[g])}</h3>` : ''}${B.faq.filter((f) => (f.group || '') === g).map((f) => `<details><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join('')}</div>`).join('');
};

/* ---------- institutional readiness renderers ---------- */
R.research = (el) => {
  el.innerHTML = B.research.map((r) => `<article class="rcard"><h3>${esc(r.claim)}</h3><p>${esc(r.text)}</p><p class="rb"><b>At BRIDGE</b> ${esc(r.bridge)}</p><cite><a href="${esc(r.url)}" target="_blank" rel="noopener">${esc(r.source)}</a>${r.url2 ? ` · <a href="${esc(r.url2)}" target="_blank" rel="noopener">second study</a>` : ''}</cite></article>`).join('') + `<p class="rnote">${esc(B.researchNote)}</p>`;
};

R.timeline = (el) => {
  el.innerHTML = `<ol class="tline">${B.timeline.map((t) => `<li class="tk-${esc(t.kind)}"><span class="tdate">${esc(t.date)}</span><i aria-hidden="true"></i><div><h3>${esc(t.title)}</h3><p>${esc(t.text)}</p>${t.kind === 'plan' ? chip('planned', 'Planned') : ''}</div></li>`).join('')}</ol><p class="tnote">${esc(B.timelineNote)}</p>`;
};

R.continuity = (el) => {
  const lab = { 'in-place': 'Operating now', 'in-progress': 'Being built' };
  el.innerHTML = `<ul class="cont">${B.continuity.map((c) => `<li class="cs-${esc(c.status)}"><div class="ch">${chip(c.status === 'in-place' ? 'confirmed' : 'planned', lab[c.status])}<h3>${esc(c.name)}</h3></div><p>${esc(c.text)}</p></li>`).join('')}</ul>`;
};

R.portfolios = (el) => {
  el.innerHTML = B.portfolios.map((p) => `<article class="pfo" style="--c:${p.color}"><header><span class="bul" aria-hidden="true">${esc(p.code)}</span><div><h3>${esc(p.name)}</h3><small>${p.seats} planned spring seats</small></div></header><p class="pfp">${esc(p.purpose)}</p><h4>What it runs</h4><ul>${p.activities.map((a) => `<li>${esc(a)}</li>`).join('')}</ul><h4>Who it serves</h4><p>${esc(p.serves)}</p><h4>What we track</h4><p>${esc(p.measures)}</p></article>`).join('') + `<p class="pfnote">${esc(B.portfolioNote)}</p>`;
};

R.growth = (el) => {
  const max = Math.max(...B.growth.map((g) => g.value));
  el.innerHTML = B.growth.map((g) => `<div class="gr gr-${esc(g.kind)}"><span class="grl">${esc(g.label)}</span><span class="grt"><i style="--w:${(g.value / max * 100).toFixed(1)}%"></i></span><b>${g.value}</b>${g.note ? `<small>${esc(g.note)}</small>` : ''}</div>`).join('');
};

R.rooms = (el) => {
  const ok = (f) => f && !(B.photos[f] && B.photos[f].minors);
  el.innerHTML = B.rooms.map((r) => `<article class="room">${ok(r.img) ? `<img src="${esc(r.img)}" alt="${esc(r.alt)}" loading="lazy">` : `<div class="room-ph" aria-hidden="true"><span>${esc(r.room)}</span></div>`}<div class="room-b"><small>${esc(r.date)} · ${esc(r.place)}</small><h3>${esc(r.room)}</h3><p>${esc(r.text)}</p><p class="led">${esc(r.led)}</p></div></article>`).join('') + `<p class="roomsnote">${esc(B.roomsNote)}</p>`;
};

R.methodology = (el) => {
  el.innerHTML = `<dl class="meth">${B.methodology.map((m) => `<div><dt>${esc(m.term)}</dt><dd>${esc(m.text)}</dd></div>`).join('')}</dl>`;
};

R.measurement = (el) => {
  const M = B.measurement;
  el.innerHTML = `<div class="mcol"><h3>${chip('confirmed', 'In place now')} What we track today</h3><ul>${M.current.map((x) => `<li>${esc(x)}</li>`).join('')}</ul></div><div class="mcol"><h3>${chip('planned', 'Starting spring 2027')} What we add next</h3><ul>${M.planned.map((x) => `<li>${esc(x)}</li>`).join('')}</ul><p class="mnote">${esc(M.plannedNote)}</p></div>`;
};

R.caseSupport = (el) => {
  const C = B.caseForSupport;
  el.innerHTML = `<ol class="caselist">${C.points.map((p, i) => `<li><span class="cn">${String(i + 1).padStart(2, '0')}</span><h3>${esc(p.k)}</h3><p>${esc(p.text)}</p></li>`).join('')}</ol><p class="casenote">${esc(C.goalNote)}</p>`;
};

R.fundingTypes = (el) => {
  el.innerHTML = `<dl class="ftypes">${B.fundingTypes.map((f) => `<div><dt>${esc(f.name)}</dt><dd>${esc(f.text)}</dd></div>`).join('')}</dl><p class="fnote">${esc(B.fundingNote)}</p>`;
};

R.principles = (el) => {
  el.innerHTML = B.principles.map((p) => `<li>${esc(p)}</li>`).join('');
};

R.champion = (el) => {
  const C = B.champion;
  el.innerHTML = `
  <div class="chk"><h3>1 · A description you can paste</h3><p class="copytext" id="champShort">${esc(C.short)}</p><button class="btn" type="button" data-copy="champShort">Copy description</button></div>
  <div class="chk"><h3>2 · A sample internal recommendation</h3><p class="copytext" id="champRec">${esc(C.recommendation)}</p><button class="btn" type="button" data-copy="champRec">Copy recommendation</button><small>Replace the bracketed parts before you send it.</small></div>
  <div class="chk"><h3>3 · The funding picture</h3><p>${esc(C.funding)}</p></div>
  <div class="chk"><h3>4 · Getting our documents</h3><ol>${C.process.map((x) => `<li>${esc(x)}</li>`).join('')}</ol><a class="btn solid" href="mailto:${esc(B.org.email)}?subject=${encodeURIComponent('Documentation request')}">Request documents</a></div>
  <div class="chk"><h3>5 · A one-page overview</h3><p>A printable single page with the essentials, for a colleague or a review committee.</p><a class="btn solid" data-href="overview" href="${esc(B.links.overviewPdf)}" download>Download the one-page overview (PDF)</a><a class="btn" href="overview.html">Open it in the browser</a></div>`;
  el.querySelectorAll('[data-copy]').forEach((b) => b.addEventListener('click', async () => {
    const t = document.getElementById(b.dataset.copy).textContent;
    let ok = false;
    try { await navigator.clipboard.writeText(t); ok = true; } catch (_) {}
    b.textContent = ok ? 'Copied' : 'Select the text above to copy';
    setTimeout(() => { b.textContent = b.dataset.copy === 'champShort' ? 'Copy description' : 'Copy recommendation'; }, 2500);
  }));
};

R.goal = (el) => {
  const g = B.goals;
  el.innerHTML = `<b>${money(g.amount)}</b><span>${esc(g.season)} goal</span>` + (g.raised != null ? `<div class="gprog"><i style="width:${Math.min(100, g.raised / g.amount * 100)}%"></i></div><small>${money(g.raised)} raised${g.raisedAsOf ? ' as of ' + esc(g.raisedAsOf) : ''}</small>` : '');
};

/* ---------- partnership form engine ---------- */
const PF = {};
PF.ranges = ['Under $250', '$250 to $999', '$1,000 to $2,499', '$2,500 to $4,999', '$5,000 to $9,999', '$10,000 or more', 'Not sure yet'];
PF.rangeFor = (n) => !n ? '' : n < 250 ? PF.ranges[0] : n < 1000 ? PF.ranges[1] : n < 2500 ? PF.ranges[2] : n < 5000 ? PF.ranges[3] : n < 10000 ? PF.ranges[4] : PF.ranges[5];
PF.engagement = ['Speak at a program', 'Mentor students', 'Host a site visit', 'Team volunteer day', 'Provide in-kind support', 'Make an introduction'];
PF.kinds = ['Financial', 'In-kind', 'Both', 'Expertise and time'];
PF.validEmail = (s) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(s);

/* turns collected data into a readable summary (used for email, review screen and endpoint) */
PF.lines = (d) => {
  const L = [];
  L.push(['Organization', d.org]); L.push(['Contact', [d.name, d.title].filter(Boolean).join(', ')]); L.push(['Email', d.email]);
  if (d.phone) L.push(['Phone', d.phone]);
  if (d.ptype) L.push(['Organization type', d.ptype]);
  if (d.industry) L.push(['Industry', d.industry]);
  if (d.kind) L.push(['Type of support', d.kind]);
  if (d.range) L.push(['Contribution range', d.range]);
  if (d.proposalId) L.push(['Proposal ID', d.proposalId]);
  if (d.items && d.items.length) L.push(['Proposed selections', d.items.join('; ')]);
  if (d.total) L.push(['Proposed total', money(d.total)]);
  if (d.breakdown) L.push(['Designation', d.breakdown]);
  if (d.titles && d.titles.length) L.push(['Proposed partnership titles', d.titles.join('; ')]);
  if (d.tier) L.push(['Package asked about', d.tier]);
  if (d.recognition) L.push(['Recognition', d.recognition]);
  if (d.approvals && d.approvals.length) L.push(['Needs confirmation', d.approvals.join(' ')]);
  if (d.status) L.push(['Status', d.status]);
  if (d.interests && d.interests.length) L.push(['Areas of interest', d.interests.join(', ')]);
  if (d.programs && d.programs.length) L.push(['Programs of interest', d.programs.join(', ')]);
  if (d.engagement && d.engagement.length) L.push(['Employee engagement', d.engagement.join(', ')]);
  if (d.inkind) L.push(['In-kind offer', d.inkind]);
  if (d.comments) L.push(['Comments', d.comments]);
  return L.filter(([, v]) => v);
};
PF.text = (d) => 'Hi BRIDGE team,\n\nHere is our partnership interest:\n\n' + PF.lines(d).map(([k, v]) => k + ': ' + v).join('\n') + '\n\nSent from the BRIDGE the District partnership page.';
PF.subject = (d) => 'Partnership interest: ' + (d.org || 'new partner') + (d.total ? ' (' + money(d.total) + ')' : d.range ? ' (' + d.range + ')' : '');
PF.html = (d) => `<dl class="sum">${PF.lines(d).map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>`;
/* the printable proposal reads one saved copy. Contact details are never stored.
   It expires after 7 days, is discarded if the rules change, and is cleared whenever selections change. */
PF.TTL = 7 * 24 * 3600 * 1000;
PF.saveForProposal = (d) => {
  const { email, phone, name, title, ...safe } = d;
  return store.set('bridge-proposal', { ...safe, version: rules.VERSION, savedAt: Date.now() });
};
PF.loadProposal = () => {
  const p = store.get('bridge-proposal');
  if (!p) return null;
  if (p.version !== rules.VERSION || !p.savedAt || Date.now() - p.savedAt > PF.TTL) { PF.clearProposal(); return null; }
  return p;
};
PF.clearProposal = () => { try { localStorage.removeItem('bridge-proposal'); } catch (_) {} };

/* real submission if an endpoint is configured; never reports success without a 2xx response */
PF.submit = async (d) => {
  if (!B.form.endpoint) return { ok: false, mode: 'email' };
  try {
    const res = await fetch(B.form.endpoint, {
      method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ ...d, _subject: PF.subject(d), summary: PF.text(d) })
    });
    return { ok: res.ok, mode: 'endpoint', status: res.status };
  } catch (e) { return { ok: false, mode: 'endpoint', error: String(e) }; }
};

/* email modal: Gmail, Outlook, email app, copy */
PF.mailModal = (subject, body, intro) => {
  let m = $('mailModal');
  if (!m) {
    m = document.createElement('div');
    m.className = 'modal'; m.id = 'mailModal'; m.hidden = true;
    m.setAttribute('role', 'dialog'); m.setAttribute('aria-modal', 'true'); m.setAttribute('aria-labelledby', 'mmTitle');
    m.innerHTML = `<div class="mbox"><button class="mx" type="button" aria-label="Close">&times;</button><div class="mk">Send to BRIDGE · ${esc(B.org.email)}</div><h3 id="mmTitle">Send your summary</h3><p class="mintro"></p><div class="mbtns"><a class="btn solid" data-m="gmail" target="_blank" rel="noopener">Open in Gmail</a><a class="btn" data-m="outlook" target="_blank" rel="noopener">Open in Outlook</a><a class="btn" data-m="app">Use my email app</a><button class="btn" type="button" data-m="copy">Copy summary</button></div><p class="mstate" aria-live="polite"></p></div>`;
    document.body.appendChild(m);
    const close = () => { m.hidden = true; document.body.classList.remove('modal-open'); if (m._ret) m._ret.focus(); };
    m.querySelector('.mx').onclick = close;
    m.addEventListener('click', (e) => { if (e.target === m) close(); });
    m.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') close();
      if (e.key === 'Tab') { const f = [...m.querySelectorAll('a,button')]; const a = f[0], z = f[f.length - 1]; if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus(); } else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); } }
    });
  }
  const q = encodeURIComponent, to = B.org.email;
  m.querySelector('[data-m=gmail]').href = `https://mail.google.com/mail/?view=cm&fs=1&to=${to}&su=${q(subject)}&body=${q(body)}`;
  m.querySelector('[data-m=outlook]').href = `https://outlook.office.com/mail/deeplink/compose?to=${to}&subject=${q(subject)}&body=${q(body)}`;
  m.querySelector('[data-m=app]').href = `mailto:${to}?subject=${q(subject)}&body=${q(body)}`;
  m.querySelector('.mintro').textContent = intro || 'Nothing has been sent yet. Choose how you want to send it. Each option opens a message to BRIDGE with your summary already written. Press send there to reach us.';
  const st = m.querySelector('.mstate'); st.textContent = '';
  m.querySelectorAll('[data-m=gmail],[data-m=outlook],[data-m=app]').forEach((a) => a.onclick = () => { st.textContent = 'Your message is ready in the window that opened. It reaches BRIDGE once you press send there.'; });
  m.querySelector('[data-m=copy]').onclick = async (e) => {
    try { await navigator.clipboard.writeText(`To: ${to}\nSubject: ${subject}\n\n${body}`); st.textContent = 'Copied. Paste it into an email to ' + to + '.'; }
    catch (_) { st.textContent = 'Copy is blocked in this browser. Email us at ' + to + '.'; }
  };
  m._ret = document.activeElement;
  m.hidden = false; document.body.classList.add('modal-open');
  m.querySelector('[data-m=gmail]').focus();
};

/* generic mailto links open the modal (keeps email usable when no mail app is set up) */
function wireMailLinks() {
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="mailto:"]');
    if (!a || a.closest('#mailModal') || a.dataset.plain != null) return;
    e.preventDefault();
    const u = new URL(a.href);
    PF.mailModal(u.searchParams.get('subject') || 'Partnering with BRIDGE the District', u.searchParams.get('body') || 'Hi BRIDGE team,\n\n', 'Choose how you want to write to us. Each option opens a message to ' + B.org.email + '.');
  });
}

/* ---------- mobile menu ---------- */
function wireMenu() {
  const b = $('menuBtn'), p = $('menuPanel');
  if (!b || !p) return;
  const set = (on) => { b.setAttribute('aria-expanded', on); p.hidden = !on; document.body.classList.toggle('menu-open', on); };
  b.addEventListener('click', () => set(b.getAttribute('aria-expanded') !== 'true'));
  p.addEventListener('click', (e) => { if (e.target.closest('a')) set(false); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && b.getAttribute('aria-expanded') === 'true') { set(false); b.focus(); } });
}

/* ---------- run ---------- */
function run() {
  document.querySelectorAll('[data-render]').forEach((el) => {
    const f = R[el.dataset.render];
    if (!f) return;
    try { f(el); } catch (e) { console.error('render ' + el.dataset.render, e); }
  });
  binds();
  wireMenu();
  if (!document.body.dataset.noMailModal) wireMailLinks();
}

window.BX = { B, $, esc, money, slug, giveUrl, tierById, tierLabel, rules, metric, visibleMetrics, binds, chip, progStatus, PF, store, run, R };
/* scripts load at the end of <body>, so the DOM is ready */
if (document.body) run(); else document.addEventListener('DOMContentLoaded', run);
})();
