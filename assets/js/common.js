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
const tierLabel = (t) => money(t.amount, t.plus);

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
    const v = { email: B.org.email, name: B.org.name, mission: B.org.mission, goal: money(B.goals.amount), season: B.goals.season, tax: B.org.taxStatus.label, positioning: B.org.positioning }[k];
    if (v != null) el.textContent = v;
  });
  root.querySelectorAll('[data-href]').forEach((el) => {
    const k = el.dataset.href;
    if (k === 'give') el.href = giveUrl(+el.dataset.amt || 0);
    else if (k === 'email') el.href = 'mailto:' + B.org.email + (el.dataset.subject ? '?subject=' + encodeURIComponent(el.dataset.subject) : '');
    else if (k === 'prospectus') el.href = B.links.prospectusPdf;
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
const evidenceLabel = { established: 'Established activity', measured: 'Measured', intended: 'Intended outcome' };

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
  <div class="toclegend" aria-hidden="true"><span><i class="lg-est"></i>Established activity</span><span><i class="lg-mea"></i>Measured</span><span><i class="lg-int"></i>Intended outcome</span></div>
  <div class="tocpanel" id="toc-panel" role="tabpanel" aria-live="polite"></div>
  <div class="tocctl"><button class="btn" type="button" id="tocPlay">Follow one investment</button><span class="tochint">Select a station, or use the arrow keys.</span></div>`;
  const panel = el.querySelector('.tocpanel'), tabs = [...el.querySelectorAll('[role=tab]')];
  const ev = (e) => {
    if (e.type === 'measured') {
      const m = metric(e.metricId);
      if (!m) return '';
      return `<li class="ev ev-measured">${chip('measured', evidenceLabel.measured)}<span><b>${esc(m.display)}</b> ${esc(m.label)} <em>${esc(m.period)}</em></span></li>`;
    }
    return `<li class="ev ev-${e.type}">${chip(e.type, evidenceLabel[e.type])}<span>${esc(String(e.text).replace('{programs}', B.programs.length))}</span></li>`;
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
      ? ms.map((m) => `<li><b>${esc(m.display)}</b><div><span>${esc(m.label)}</span><small>${esc(m.period)}${m.note ? ' · ' + esc(m.note) : ''}</small></div></li>`).join('')
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
  const docs = (B.documents || []).filter((d) => d.file);
  el.innerHTML = `
  <div class="orgcol">
    <h3>Mission</h3><p>${esc(o.mission)}</p>
    ${o.foundingStory ? `<h3>How BRIDGE started</h3><p>${esc(o.foundingStory)}</p>` : ''}
    <h3>${esc(o.fellowship.name)}</h3><p>${esc(o.fellowship.summary)}</p>
  </div>
  <div class="orgcol">
    <dl class="orgfacts">
      <div><dt>Legal status</dt><dd>${esc(o.taxStatus.label)}${o.taxStatus.ein ? ' · EIN ' + esc(o.taxStatus.ein) : ''}<small>${esc(o.taxStatus.detail)}</small></dd></div>
      <div><dt>Based in</dt><dd>${esc(o.city)}${o.founded ? ' · Founded ' + esc(o.founded) : ''}</dd></div>
      <div><dt>Leadership</dt><dd>${o.leadership.map((l) => `${esc(l.name)}<small>${esc(l.role)}</small>`).join('')}</dd></div>
      ${o.recognition.length ? `<div><dt>Recognition</dt><dd>${o.recognition.map((r) => `${esc(r.year)} ${esc(r.name)}<small>${esc(r.from)}</small>`).join('')}</dd></div>` : ''}
      <div><dt>Contact</dt><dd><a href="mailto:${esc(o.email)}">${esc(o.email)}</a></dd></div>
      <div><dt>Documents</dt><dd>${docs.length ? docs.map((d) => `<a href="${esc(d.file)}" target="_blank" rel="noopener">${esc(d.label)}</a>`).join('<br>') : `Our W-9 and IRS determination letter are available on request at <a href="mailto:${esc(o.email)}?subject=${encodeURIComponent('Request for BRIDGE nonprofit documents')}">${esc(o.email)}</a>.`}</dd></div>
    </dl>
  </div>`;
};

R.costAreas = (el) => {
  el.innerHTML = B.costAreas.map((c, i) => `<li class="fcard"><span class="fno">${String(i + 1).padStart(2, '0')}</span><h3>${esc(c.name)}</h3><p>${esc(c.text)}</p>${c.equivalency ? `<p class="eqv">${esc(c.equivalency)}</p>` : ''}<small>${c.programs.map(esc).join(' · ')}</small></li>`).join('');
};

R.tiers = (el) => {
  const station = B.tiers.filter((t) => t.online), inst = B.tiers.filter((t) => !t.online);
  const card = (t) => `<div class="fare${t.tag ? ' hot' : ''}${t.id === 'founding' ? ' gold' : ''}">${t.tag ? `<span class="tag">${esc(t.tag)}</span>` : ''}<div class="fcard-k">${esc(t.card)}</div><div class="price">${tierLabel(t)}</div><h3>${esc(t.name)}</h3><p>${esc(t.blurb)}</p><ul>${t.benefits.map((b) => `<li>${esc(b)}</li>`).join('')}</ul><div class="farebtns"><a class="btn solid give-amt" href="${esc(giveUrl(t.amount))}" target="_blank" rel="noopener">Give ${tierLabel(t)} online</a><a class="flink" href="mailto:${esc(B.org.email)}?subject=${encodeURIComponent('BRIDGE ' + t.name + ' ' + tierLabel(t))}">or email us first</a></div></div>`;
  const instc = (t) => `<div class="itier"><div class="it-a"><div class="fcard-k">${esc(t.card)}</div><div class="price">${tierLabel(t)}</div><h3>${esc(t.name)}</h3><p>${esc(t.blurb)}</p></div><ul>${t.benefits.map((b) => `<li>${esc(b)}</li>`).join('')}</ul><div class="it-c"><a class="btn solid" data-href="talk" href="#">Schedule a conversation</a><a class="btn" href="#build" data-tier="${t.id}">Build a proposal</a></div></div>`;
  el.innerHTML = `<div class="fares f4">${station.map(card).join('')}</div>
    <div class="inst"><div class="inst-h"><span class="sta"><i></i>Institutional partnerships</span><h3>For institutions ready to invest in the whole system.</h3><p>Larger partnerships start with a conversation, so what we build together fits your goals and what BRIDGE can deliver well.</p></div>${inst.map(instc).join('')}</div>
    <p class="tiernote">${esc(B.tierNote)}</p>`;
  binds(el);
};

R.fareChart = (el) => {
  const ts = B.tiers;
  const rows = [];
  ts.forEach((t, i) => t.benefits.filter((b) => !/^Everything in/.test(b)).forEach((b) => rows.push([b, i])));
  el.innerHTML = `<div class="fc-h" role="row"><span role="columnheader">Benefit</span>${ts.map((t) => `<span role="columnheader">${tierLabel(t)}</span>`).join('')}</div>` + rows.map(([b, i]) => `<div role="row"><span role="cell">${esc(b)}</span>${ts.map((t, j) => `<i role="cell" class="${j >= i ? 'y' : ''}" aria-label="${j >= i ? 'Included' : 'Not included'}"></i>`).join('')}</div>`).join('');
  el.style.setProperty('--cols', ts.length);
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
    panel.innerHTML = `<div><h4>Ways ${esc(a.name.toLowerCase())} take part</h4><ul>${a.ways.map((w) => `<li>${esc(w)}</li>`).join('')}</ul></div><div><h4>Where to start</h4><ul>${tiers.map((t) => `<li><b>${tierLabel(t)}</b> ${esc(t.name)}</li>`).join('')}${sup.map((s) => `<li>${esc(s.name)}</li>`).join('')}</ul><a class="btn solid" href="#build" data-aud="${a.id}">Build your partnership</a></div>`;
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
  el.innerHTML = B.faq.map((f, i) => `<details${i === 0 ? ' open' : ''}><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join('');
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
  if (d.items && d.items.length) L.push(['Selections', d.items.join('; ')]);
  if (d.total) L.push(['Selected total', money(d.total)]);
  if (d.tier) L.push(['Partnership level', d.tier]);
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
PF.saveForProposal = (d) => {
  const { email, phone, ...safe } = d; // contact details are not stored
  return store.set('bridge-proposal', { ...safe, savedAt: Date.now() });
};

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

window.BX = { B, $, esc, money, slug, giveUrl, tierById, tierLabel, metric, visibleMetrics, binds, chip, progStatus, PF, store, run, R };
/* scripts load at the end of <body>, so the DOM is ready */
if (document.body) run(); else document.addEventListener('DOMContentLoaded', run);
})();
