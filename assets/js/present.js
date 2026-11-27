/* Presentation mode: a live partnership pitch, built from content.js.
   The presenter controls every move. Nothing advances on its own.
   A slide changes only through: arrow keys, Space, Page Up/Down (clickers), the on-screen buttons,
   the station list, Home/End, or a swipe. During a transition, extra input is ignored, so a double
   press can never skip a slide. The train is the transition: the next slide is swapped in while the
   train covers the screen, and the whoosh plays with the train, only on an intentional move. */
(function () {
'use strict';
const X = window.BX; if (!X) return;
const { B, $, esc, money, tierLabel } = X;
const m = (id) => X.metric(id);
const stat = (id) => { const x = m(id); return x ? `<div class="sst"><b>${esc(x.display)}</b><span>${esc(x.label)}</span><small>${esc(x.period)}</small></div>` : ''; };
const qs = new URLSearchParams(location.search);
const forOrg = (qs.get('for') || '').trim().slice(0, 60);
const presenter = qs.get('presenter') === '1';
const ok = (f) => f && !(B.photos[f] && B.photos[f].minors);
const roomImgs = B.rooms.filter((r) => ok(r.img));
const site = (B.site.officialDomain || B.site.url).replace(/^https?:\/\//, '').replace(/\/$/, '');

const slides = [
  { t: 'Welcome aboard', cls: 'title', notes: 'Thank them for the time. One sentence on BRIDGE, then the frame: this is an invitation to build, not a request to rescue.',
    html: `<img class="bgimg" src="group.jpg" alt=""><div class="tl"><p class="kick"><span class="dot"></span>${forOrg ? 'A partnership conversation with ' + esc(forOrg) : 'BRIDGE the District · Spring 2027'}</p><h1>Come into the room.<br><em>Build it with us.</em></h1><p class="sub">${esc(B.org.positioning)}</p></div>` },
  { t: 'The opportunity gap', cls: 'light', notes: 'Keep it about access and systems, never about students lacking ability. The Chetty finding is the bridge to our model: who you know shapes where you go.',
    html: `<p class="kick red">The opportunity gap</p><h2>Talent is everywhere. <em>Access is not.</em></h2><div class="sgrid3">${B.gapStats.filter((g) => !g.bars).map((g) => `<div class="sst"><b>${esc(g.value)}</b><span>${esc(g.text)}</span><small>${esc(g.source)}</small></div>`).join('')}<div class="sst"><b>#1</b><span>Cross-class friendships are among the strongest predictors of upward mobility found to date.</span><small>Chetty et al., Nature (2022)</small></div></div>` },
  { t: 'Meet BRIDGE', cls: 'dark', notes: 'Independent nonprofit, not a campus club. Founded 2025, a 501(c)(3). Students run it; the institution is what lets them.',
    html: `<p class="kick">Meet BRIDGE</p><h2 class="big">${esc(B.org.differentiator)}</h2><ul class="facts3"><li><b>Independent 501(c)(3)</b><span>Founded in ${esc(B.org.founded)}. EIN ${esc(B.org.taxStatus.ein)}.</span></li><li><b>College students</b><span>Trained as Impact Scholars.</span></li><li><b>Younger students</b><span>In DC schools, led by near-peers.</span></li></ul>` },
  { t: 'Our model', cls: 'dark', notes: 'Point at the transfer station. Every investment passes through Impact Scholars, then branches. The terminal is intended, not claimed.',
    html: `<p class="kick">Our model</p><h2>One investment. Two lines of opportunity.</h2><div class="branch"><div class="trunk">${B.model.slice(0, 3).map((s) => `<div class="bs k-${s.kind}"><i></i><b>${esc(s.short)}</b></div>`).join('')}</div><div class="arms"><div class="arm red"><i></i><b>College students</b><span>Leadership, professional exposure, mentors, networks</span></div><div class="arm blue"><i></i><b>Younger students</b><span>College exposure, near-peer mentors, resources</span></div></div><div class="bs k-intended end"><i></i><b>Outcomes</b><small>Intended, not yet measured</small></div></div>` },
  { t: "How far we've come", cls: 'light', notes: 'Every number has a period. If asked about outcomes: standard surveys start spring 2027; we will not claim outcomes before we measure them.',
    html: `<p class="kick red">How far we've come</p><h2>What we can document.</h2><div class="sgrid3">${['apps', 'fellows', 'supporters', 'goalpct', 'policy', 'speakers'].map(stat).join('')}</div>` },
  { t: 'The rooms we open', cls: 'dark', notes: B.rooms.map((r) => r.room + ': ' + r.text).join(' '),
    html: `<p class="kick">The rooms we open</p><h2>From the record.</h2><div class="rooms4">${B.rooms.map((r) => `<figure>${ok(r.img) ? `<img src="${esc(r.img)}" alt="">` : '<div class="rph"></div>'}<figcaption><b>${esc(r.room)}</b><span>${esc(r.date)} · ${esc(r.place)}</span></figcaption></figure>`).join('')}</div>` },
  { t: 'Built beyond a semester', cls: 'dark', notes: 'Be direct: bylaws in place, Board seats not yet filled. Then the systems that carry BRIDGE past any graduation. Cohort turnover is how the model renews itself.',
    html: `<p class="kick">Built beyond a semester</p><h2>Student-powered. <em>Built to outlast any one class.</em></h2><ul class="scont">${B.continuity.filter((c) => c.status === 'in-place').slice(0, 6).map((c) => `<li><b>${esc(c.name)}</b></li>`).join('')}</ul><p class="foot">Being built: ${B.continuity.filter((c) => c.status !== 'in-place').map((c) => esc(c.name)).join(', ')}.</p>` },
  { t: "Where we're going", cls: 'light', notes: 'Three tracks, one fellowship. 101 applied for 40 seats. Seats are the plan, not results. Friday school visits are the quiet, consistent part of the work.',
    html: `<p class="kick red">Where we're going</p><h2>Three tracks. ${B.programs.length} programs. One spring.</h2><div class="sgrid3">${B.portfolios.map((p) => `<div class="pathc" style="border-top:10px solid ${p.color}"><h3>${esc(p.name)}</h3><p>${esc(p.purpose)}</p><p class="sm"><b>${p.seats}</b> planned seats</p></div>`).join('')}</div>` },
  { t: 'What investment makes possible', cls: 'dark', notes: B.caseForSupport.goalNote + ' The $10,000 is the spring campaign goal, not a ceiling and not the whole budget.',
    html: `<p class="kick">What investment makes possible</p><h2>${money(B.goals.amount)} this spring. <em>Built as ${esc(B.goals.builtAs)}.</em></h2><div class="sgrid3 args"><div><b>Fund the experience</b><span>One program, one school visit, one room.</span></div><div><b>Fund the season</b><span>Every program, January to April.</span></div><div><b>Fund the institution</b><span>Training, evaluation, coordination, growth.</span></div></div><p class="tags">${B.costAreas.map((c) => `<span>${esc(c.name)}</span>`).join('')}</p>` },
  { t: 'Choose your partnership', cls: 'red', notes: 'Titles come from the package chosen, never from a total. Five $500 program sponsorships are five program sponsorships, not a Founding Rider. Founding Rider is 2027 only and needs approval. Speaking roles are proposed, subject to program review and safeguarding.',
    html: `<p class="kick">Choose your partnership</p><h2>Three tracks, chosen on purpose.</h2><div class="strk">${Object.entries(B.tracks).map(([k, tr]) => `<div><span>${esc(tr.label)}</span><h3>${esc(tr.name)}</h3><ul>${B.tiers.filter((t) => t.track === k).map((t) => `<li><b>${tierLabel(t)}</b> ${esc(t.name)}</li>`).join('')}</ul></div>`).join('')}</div><p class="lead sm rule">A title comes from the package you choose, never from adding up smaller ones.</p><p class="foot">All packages proposed and confirmed in writing. Unrestricted gifts welcome at any amount.</p>` },
  { t: 'Your role', cls: 'light', notes: 'Find their industry. Be explicit about which lines run now and which are proposed. Ask: who on your team should be in the room?',
    html: `<p class="kick red">${forOrg ? esc(forOrg) + "'s role" : "Your organization's role"}</p><h2>Find the line your industry already runs on.</h2><ul class="spw light">${B.pathways.map((p) => `<li style="--c:${p.color}"><span class="bul">${esc(p.code)}</span><b>${esc(p.name)}</b><small>${p.status === 'existing' ? 'Running now' : 'Proposed'}</small></li>`).join('')}</ul>` },
  { t: 'The next stop', cls: 'title end', notes: 'Close with one concrete next step and a date. Leave the one-page overview and the prospectus.',
    html: `<img class="bgimg" src="cohort.jpg" alt=""><div class="tl"><p class="kick"><span class="dot"></span>The next stop</p><h2 class="big">Let's build it together.</h2><ol class="next"><li>Choose a program, a season package or the institution</li><li>Set a planning conversation</li><li>Introduce one colleague who should be in the room</li></ol><p class="contact"><b>${esc(B.org.email)}</b><span>${esc(B.org.leadership[0].name)}, ${esc(B.org.leadership[0].role)}</span><span class="url">${esc(site)}</span></p></div>` }
];

/* ---------- presenter view: a separate private window with notes, synced over BroadcastChannel ---------- */
const bc = 'BroadcastChannel' in window ? new BroadcastChannel('bridge-deck') : null;
if (presenter) {
  document.body.classList.add('pview');
  document.body.innerHTML = `<main class="pv"><header><b>Presenter view</b><span id="pvTimer">0:00</span></header><div class="pvc"><section><small>Now</small><h1 id="pvNow"></h1><p id="pvNotes"></p></section><section class="nx"><small>Next</small><h2 id="pvNext"></h2></section></div><nav><button id="pvPrev" type="button">‹ Back</button><button id="pvNextB" type="button">Next ›</button></nav><p class="pvhint">Keep this window on your laptop screen. The audience sees only the slides window.</p></main>`;
  let i = 0; const t0 = Date.now();
  const show = (k) => { i = k; $('pvNow').textContent = (k + 1) + '. ' + slides[k].t; $('pvNotes').textContent = slides[k].notes; $('pvNext').textContent = slides[k + 1] ? (k + 2) + '. ' + slides[k + 1].t : 'End of presentation'; };
  if (bc) bc.onmessage = (e) => { if (e.data && e.data.type === 'at') show(e.data.i); };
  $('pvPrev').onclick = () => bc && bc.postMessage({ type: 'go', i: i - 1 });
  $('pvNextB').onclick = () => bc && bc.postMessage({ type: 'go', i: i + 1 });
  addEventListener('keydown', (e) => { if (['ArrowRight', 'PageDown', ' '].includes(e.key)) { e.preventDefault(); bc && bc.postMessage({ type: 'go', i: i + 1 }); } if (['ArrowLeft', 'PageUp'].includes(e.key)) { e.preventDefault(); bc && bc.postMessage({ type: 'go', i: i - 1 }); } });
  setInterval(() => { const s = Math.floor((Date.now() - t0) / 1000); $('pvTimer').textContent = Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0'); }, 1000);
  show(0); if (bc) bc.postMessage({ type: 'hello' });
  return;
}

/* ---------- audience deck ---------- */
const stage = $('stage');
stage.innerHTML = slides.map((s, i) => `<section class="slide ${s.cls}" id="s${i + 1}" aria-roledescription="slide" aria-label="${i + 1} of ${slides.length}: ${esc(s.t)}" ${i ? 'hidden' : ''}>${s.html}</section>`).join('')
  + `<div class="dtrain" id="dtrain" aria-hidden="true"><div class="car"><span class="nose"></span>${'<span class="win"></span>'.repeat(6)}<span class="door"></span>${'<span class="win"></span>'.repeat(6)}<b>BRIDGE LINE</b></div><div class="car">${'<span class="win"></span>'.repeat(6)}<span class="door"></span>${'<span class="win"></span>'.repeat(6)}<b id="dtrainDest"></b></div></div>`;
const els = [...stage.querySelectorAll('.slide')];
$('route').innerHTML = slides.map((s, i) => `<li><button type="button" data-i="${i}" title="${esc((i + 1) + '. ' + s.t)}"><span class="vh">${esc((i + 1) + '. ' + s.t)}</span></button></li>`).join('');
$('stations').innerHTML = slides.map((s, i) => `<li><button type="button" data-i="${i}"><span>${String(i + 1).padStart(2, '0')}</span>${esc(s.t)}</button></li>`).join('');
const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
const train = $('dtrain');
let cur = 0, busy = false, t0 = Date.now();

/* sound: off until the presenter turns it on (a click counts as the required gesture) */
let ac = null, soundOn = false;
try { soundOn = localStorage.getItem('bridge-deck-sound') === '1'; } catch (_) {}
function whoosh(dur) {
  if (!soundOn) return;
  try { ac = ac || new (window.AudioContext || window.webkitAudioContext)(); if (ac.state === 'suspended') ac.resume(); } catch (_) { return; }
  const d = dur / 1000, b = ac.createBuffer(1, Math.ceil(ac.sampleRate * d), ac.sampleRate), x = b.getChannelData(0);
  for (let i = 0; i < x.length; i++) x[i] = Math.random() * 2 - 1;
  const s = ac.createBufferSource(), f = ac.createBiquadFilter(), g = ac.createGain(), t = ac.currentTime;
  s.buffer = b; f.type = 'bandpass'; f.Q.value = 0.7; f.frequency.setValueAtTime(260, t); f.frequency.exponentialRampToValueAtTime(1800, t + d * 0.5); f.frequency.exponentialRampToValueAtTime(320, t + d);
  g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.09, t + d * 0.45); g.gain.linearRampToValueAtTime(0, t + d);
  s.connect(f).connect(g).connect(ac.destination); s.start(t); window.__deckWhoosh = (window.__deckWhoosh || 0) + 1;
}
const setSound = (on) => { soundOn = on; try { localStorage.setItem('bridge-deck-sound', on ? '1' : '0'); } catch (_) {} $('dsound').setAttribute('aria-pressed', on); $('dsound').textContent = on ? 'Sound on' : 'Sound off'; };

function ui() {
  $('dcount').textContent = (cur + 1) + ' / ' + slides.length;
  $('dfill').style.width = ((cur + 1) / slides.length * 100) + '%';
  $('dprev').disabled = cur === 0; $('dnext').disabled = cur === slides.length - 1;
  $('notesText').textContent = slides[cur].notes;
  $('route').querySelectorAll('li').forEach((li, i) => { li.className = i < cur ? 'past' : i === cur ? 'now' : ''; li.querySelector('button').setAttribute('aria-current', i === cur ? 'step' : 'false'); });
  history.replaceState(null, '', location.pathname + location.search + '#' + (cur + 1));
  if (bc) bc.postMessage({ type: 'at', i: cur });
}
const TRAIN_MS = 1100, SWAP_AT = 0.5;
function go(i, how) {
  i = Math.max(0, Math.min(slides.length - 1, i));
  if (busy || i === cur) return;               // input during a transition is ignored
  const from = cur, back = i < from;
  if (still || how === 'instant' || !train.animate) { els[from].hidden = true; cur = i; els[cur].hidden = false; ui(); return; }
  busy = true; document.body.classList.add('moving');
  $('dtrainDest').textContent = 'NEXT STOP: ' + slides[i].t.toUpperCase();
  train.style.display = 'flex';
  const frames = back ? [{ transform: 'translateX(-105%)' }, { transform: 'translateX(105%)' }] : [{ transform: 'translateX(105%)' }, { transform: 'translateX(-105%)' }];
  // the train is twice the stage width; it fully covers the stage at the midpoint
  const a = train.animate(frames, { duration: TRAIN_MS, easing: 'cubic-bezier(.45,.05,.55,.95)' });
  whoosh(TRAIN_MS);
  setTimeout(() => { els[from].hidden = true; cur = i; els[cur].hidden = false; ui(); }, TRAIN_MS * SWAP_AT);
  a.onfinish = a.oncancel = () => { train.style.display = 'none'; busy = false; document.body.classList.remove('moving'); };
}
window.__deck = { go, get cur() { return cur; }, get busy() { return busy; }, count: slides.length };

$('dprev').onclick = () => go(cur - 1); $('dnext').onclick = () => go(cur + 1);
$('route').addEventListener('click', (e) => { const b = e.target.closest('button'); if (b) go(+b.dataset.i); });
const menu = $('smenu');
const toggleMenu = (on) => { menu.hidden = !on; $('dlist').setAttribute('aria-expanded', on); if (on) menu.querySelector(`button[data-i="${cur}"]`).focus(); else $('dlist').focus(); };
$('dlist').onclick = () => toggleMenu(menu.hidden);
$('stations').addEventListener('click', (e) => { const b = e.target.closest('button'); if (!b) return; toggleMenu(false); go(+b.dataset.i); });
$('drestart').onclick = () => go(0);
$('dsound').onclick = () => setSound(!soundOn); setSound(soundOn);
const toggleNotes = () => { const n = $('notes'), on = n.hidden; n.hidden = !on; $('dnotes').setAttribute('aria-pressed', on); };
$('dnotes').onclick = toggleNotes;
$('dpv').onclick = () => { const w = window.open(location.pathname + '?presenter=1', 'bridge-presenter', 'width=760,height=560'); if (!w) $('dpv').textContent = 'Allow pop-ups for presenter view'; };
if (bc) bc.onmessage = (e) => { if (!e.data) return; if (e.data.type === 'go') go(e.data.i); if (e.data.type === 'hello') ui(); };
const fs = () => { const d = document.documentElement; if (!document.fullscreenElement) { if (d.requestFullscreen) d.requestFullscreen().catch(() => {}); } else document.exitFullscreen(); };
$('dfs').onclick = fs;
if (!document.documentElement.requestFullscreen) $('dfs').hidden = true;
document.addEventListener('fullscreenchange', () => { $('dfs').textContent = document.fullscreenElement ? 'Exit full screen' : 'Full screen'; fit(); });
addEventListener('keydown', (e) => {
  if (e.altKey || e.ctrlKey || e.metaKey) return;
  if (e.key === 'Escape') { if (!menu.hidden) { toggleMenu(false); return; } if (!$('notes').hidden) { toggleNotes(); return; } return; }   // the browser itself exits full screen on Escape
  if (!menu.hidden) return;
  const onBtn = e.target.closest('button,a');
  if (['ArrowRight', 'PageDown'].includes(e.key) || (e.key === ' ' && !onBtn)) { e.preventDefault(); go(cur + 1); }
  else if (['ArrowLeft', 'PageUp'].includes(e.key)) { e.preventDefault(); go(cur - 1); }
  else if (e.key === 'Home') go(0); else if (e.key === 'End') go(slides.length - 1);
  else if (e.key === 'f' || e.key === 'F') fs();
  else if (e.key === 'n' || e.key === 'N') toggleNotes();
  else if (e.key === 'm' || e.key === 'M') setSound(!soundOn);
  else if (e.key === 'g' || e.key === 'G') toggleMenu(true);
});
let tx = null; stage.addEventListener('touchstart', (e) => { tx = e.touches[0].clientX; }, { passive: true });
stage.addEventListener('touchend', (e) => { if (tx == null) return; const dx = e.changedTouches[0].clientX - tx; if (Math.abs(dx) > 60) go(cur + (dx < 0 ? 1 : -1)); tx = null; }, { passive: true });
setInterval(() => { const s = Math.floor((Date.now() - t0) / 1000); $('timer').textContent = Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0') + ' elapsed'; }, 1000);
/* fit the 16:9 stage inside the space above the control bar, at any screen size */
const fit = () => { const bar = $('dbar').offsetHeight || 64, k = Math.min(innerWidth / 1600, (innerHeight - bar) / 900); stage.style.transform = `translate(-50%,-50%) scale(${k})`; };
addEventListener('resize', fit); fit();
if (qs.get('print') === '1') { document.body.classList.add('printmode'); els.forEach((e) => { e.hidden = false; }); stage.style.transform = 'none'; document.documentElement.classList.add('ready'); return; }
const start = (parseInt(location.hash.slice(1), 10) || 1) - 1;
els[0].hidden = true; cur = Math.max(0, Math.min(slides.length - 1, start)); els[cur].hidden = false; ui();
document.documentElement.classList.add('ready');
})();
