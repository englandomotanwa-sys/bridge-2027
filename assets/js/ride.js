/* BRIDGE the District: the immersive "Ride the BRIDGE Line" layer.
   Everything here is enhancement. If this file fails, content rendered by common.js stays readable. */
(function () {
'use strict';
const X = window.BX;
if (!X) return;
window.__ride = true;
const { B, $, esc, PF, money, giveUrl, tierLabel } = X;
const root = document.documentElement;
const gatedNow = () => root.classList.contains('gate-on');
const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
const stops = B.programs;

/* ================= the line: stations and detail ================= */
const track = $('track'), detail = $('detail'), ann = $('ann');
track.insertAdjacentHTML('beforeend', stops.map((s, i) => `<button type="button" class="stop" data-i="${i}" aria-pressed="false" aria-controls="detail"><span class="ring">${i + 1}</span><span class="txt"><small>${esc(s.d)}</small><span>${esc(s.n)}</span></span></button>`).join(''));
const btns = [...track.querySelectorAll('.stop')];
const lines = ['Doors opening.', 'Doors open on the left.', 'Doors open on the right.', 'Please stand clear of the doors.'];
function show(i, quiet) {
  const s = stops[i], nx = stops[i + 1], T = B.programTypes[s.type];
  btns.forEach((b, j) => b.setAttribute('aria-pressed', j === i));
  ann.textContent = `Now arriving: ${s.n}. ${lines[i % lines.length]} ${nx ? 'Next stop: ' + nx.n + '.' : 'This is the last stop on the BRIDGE Line. Thank you for riding.'}`;
  detail.classList.remove('swap'); void detail.offsetWidth; detail.classList.add('swap');
  detail.innerHTML = `<div class="d-main"><div class="when">Stop ${i + 1} of ${stops.length} · ${esc(s.d)}, 2027 ${X.progStatus(s)}</div><h3>${esc(s.n)}</h3><p class="d-type" style="--c:${T.color}"><i aria-hidden="true"></i>${esc(T.label)}${s.returning ? ' · Returning program' : ''}</p><p class="d-why">${esc(s.why)}</p><p>${esc(s.t)}</p>
    <dl class="d-facts"><div><dt>Who it serves</dt><dd>${esc(s.audience)}</dd></div><div><dt>Planned outputs</dt><dd>${esc(s.outputs)}</dd></div><div><dt>Intended outcome</dt><dd>${esc(s.intended)}</dd></div><div><dt>Partnership makes possible</dt><dd>${esc(s.makesPossible)}</dd></div></dl>
    <a class="btn solid" href="#build" data-stop="${i}">Support this program</a></div>
    <figure><img src="${esc(s.img)}" alt="${esc(s.cap)}"><figcaption class="cap">${esc(s.cap)}</figcaption></figure>
    <div class="d-ways"><h4>Ways to take part</h4><ul class="asks">${s.a.map((x) => `<li>${x}</li>`).join('')}<li>Unrestricted support for the whole line</li></ul><p class="d-note">${esc(B.programStatusNote)}</p></div>`;
  if (!quiet) chime(true);
}
btns.forEach((b) => b.addEventListener('click', () => { show(+b.dataset.i); say('Now arriving: ' + stops[+b.dataset.i].n.replace('&', 'and') + '.', 300); }));
show(Math.max(0, stops.findIndex((s) => s.returning)), true);
document.addEventListener('click', (e) => {
  const b = e.target.closest('.overview [data-stop]');
  if (!b) return;
  show(+b.dataset.stop); detail.scrollIntoView({ behavior: still ? 'auto' : 'smooth', block: 'center' });
});

/* arrival board: real days until each program, from today's date */
{
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const up = stops.map((s, i) => ({ ...s, i, days: Math.round((new Date(s.iso + 'T00:00:00') - today) / 864e5) })).filter((s) => s.days >= 0).slice(0, 4);
  $('pids').innerHTML = (up.length ? up : [{ n: 'Season complete', i: stops.length - 1, days: -1 }]).map((s) => `<div class="row" role="row"><span role="cell">BR</span><span role="cell">${s.i + 1}</span><span role="cell" class="dest">${esc(s.n)}</span><span role="cell" class="${s.days === 0 ? 'blink' : ''}">${s.days < 0 ? '-' : s.days === 0 ? 'BRD' : s.days}</span></div>`).join('');
}

/* ================= sound: opt-in only ================= */
let soundOn = false, ac = null, voice = null;
const audio = () => { try { ac = ac || new (window.AudioContext || window.webkitAudioContext)(); if (ac.state !== 'running') ac.resume(); } catch (_) {} };
function chime(soft) {
  if (!soundOn || !ac || (soft && ac.state !== 'running')) return;
  [[784, 0], [622, 0.32]].forEach(([f, t]) => { const o = ac.createOscillator(), g = ac.createGain(); o.type = 'sine'; o.frequency.value = f; g.gain.setValueAtTime(0, ac.currentTime + t); g.gain.linearRampToValueAtTime(0.18, ac.currentTime + t + 0.02); g.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + t + 0.7); o.connect(g).connect(ac.destination); o.start(ac.currentTime + t); o.stop(ac.currentTime + t + 0.75); });
}
$('chime').addEventListener('click', () => { if (!soundOn) setSound(true); chime(false); });
const pickVoice = () => { const vs = speechSynthesis.getVoices(); voice = vs.find((v) => /en-US/.test(v.lang) && /Google US|Samantha|Aria|Jenny|Guy/.test(v.name)) || vs.find((v) => /en-US/.test(v.lang)) || vs[0] || null; };
if ('speechSynthesis' in window) { pickVoice(); speechSynthesis.onvoiceschanged = pickVoice; }
function say(t, delay = 0) {
  if (!soundOn || !('speechSynthesis' in window)) return;
  setTimeout(() => { if (!soundOn) return; speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(t); if (voice) u.voice = voice; u.rate = 0.95; u.pitch = 0.9; u.volume = 0.9; speechSynthesis.speak(u); }, delay);
}
function setSound(v) {
  soundOn = v;
  if (v) { audio(); startHum(); }
  try { sessionStorage.setItem('bridge-sound', v ? '1' : '0'); } catch (_) {}
  const s = $('sound'); s.setAttribute('aria-pressed', v); s.textContent = v ? 'Sound on' : 'Sound off';
  const m = $('muteBtn'); if (m) { m.setAttribute('aria-pressed', !v); m.setAttribute('aria-label', v ? 'Turn sound off' : 'Turn sound on'); m.title = v ? 'Sound off (M)' : 'Sound on (M)'; }
  if (!v && 'speechSynthesis' in window) speechSynthesis.cancel();
}
$('sound').addEventListener('click', () => setSound(!soundOn));
$('muteBtn').addEventListener('click', () => setSound(!soundOn));
const running = () => soundOn && ac && ac.state === 'running';
function beep(f = 1180, d = 0.07, n = 1) { if (!running()) return; for (let k = 0; k < n; k++) { const t = ac.currentTime + k * (d + 0.05), o = ac.createOscillator(), g = ac.createGain(); o.type = 'square'; o.frequency.value = f; g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.05, t + 0.005); g.gain.setValueAtTime(0.05, t + d); g.gain.linearRampToValueAtTime(0, t + d + 0.02); o.connect(g).connect(ac.destination); o.start(t); o.stop(t + d + 0.03); } }
function click() { if (!running()) return; const b = ac.createBuffer(1, ac.sampleRate * 0.05, ac.sampleRate), d = b.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / d.length) ** 3; const s = ac.createBufferSource(), g = ac.createGain(); g.gain.value = 0.25; s.buffer = b; s.connect(g).connect(ac.destination); s.start(); }
function hiss(dur = 0.9) { if (!running()) return; const b = ac.createBuffer(1, ac.sampleRate * dur, ac.sampleRate), d = b.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1; const s = ac.createBufferSource(), f = ac.createBiquadFilter(), g = ac.createGain(); s.buffer = b; f.type = 'highpass'; f.frequency.value = 3000; g.gain.setValueAtTime(0, ac.currentTime); g.gain.linearRampToValueAtTime(0.07, ac.currentTime + 0.08); g.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + dur); s.connect(f).connect(g).connect(ac.destination); s.start(); }
function rumble(dur = 1.4, vol = 0.25) { if (!running()) return; const n = ac.createBuffer(1, ac.sampleRate * dur, ac.sampleRate), d = n.getChannelData(0); let l = 0; for (let i = 0; i < d.length; i++) { l = (l + 0.02 * (Math.random() * 2 - 1)) / 1.02; d[i] = l * 3.5; } const src = ac.createBufferSource(), f = ac.createBiquadFilter(), g = ac.createGain(); src.buffer = n; f.type = 'lowpass'; f.frequency.value = 160; g.gain.setValueAtTime(0, ac.currentTime); g.gain.linearRampToValueAtTime(vol, ac.currentTime + dur * 0.35); g.gain.linearRampToValueAtTime(0, ac.currentTime + dur); src.connect(f).connect(g).connect(ac.destination); src.start(); }
function whoosh() { if (!running()) return; const d = 0.5, b = ac.createBuffer(1, ac.sampleRate * d, ac.sampleRate), x = b.getChannelData(0); for (let i = 0; i < x.length; i++) x[i] = Math.random() * 2 - 1; const s = ac.createBufferSource(), f = ac.createBiquadFilter(), g = ac.createGain(); s.buffer = b; f.type = 'bandpass'; f.Q.value = 0.8; f.frequency.setValueAtTime(300, ac.currentTime); f.frequency.exponentialRampToValueAtTime(2400, ac.currentTime + d); g.gain.setValueAtTime(0, ac.currentTime); g.gain.linearRampToValueAtTime(0.05, ac.currentTime + 0.15); g.gain.linearRampToValueAtTime(0, ac.currentTime + d); s.connect(f).connect(g).connect(ac.destination); s.start(); }
/* tunnel hum that follows scroll speed */
let hum = null, lastY = scrollY, lastT = performance.now(), vel = 0;
function startHum() {
  if (hum || !ac) return;
  const len = ac.sampleRate * 2, b = ac.createBuffer(1, len, ac.sampleRate), d = b.getChannelData(0); let l = 0; for (let i = 0; i < len; i++) { l = (l + 0.02 * (Math.random() * 2 - 1)) / 1.02; d[i] = l * 3.5; }
  const s = ac.createBufferSource(), f = ac.createBiquadFilter(), g = ac.createGain(); s.buffer = b; s.loop = true; f.type = 'lowpass'; f.frequency.value = 90; g.gain.value = 0; s.connect(f).connect(g).connect(ac.destination); s.start(); hum = { f, g };
  const tick = () => { vel *= 0.9; const target = soundOn ? Math.min(0.16, vel * 0.00012) : 0; hum.g.gain.setTargetAtTime(target, ac.currentTime, 0.12); hum.f.frequency.setTargetAtTime(70 + Math.min(400, vel * 0.08), ac.currentTime, 0.15); requestAnimationFrame(tick); }; tick();
}
addEventListener('scroll', () => { const t = performance.now(), dt = Math.max(16, t - lastT); vel = Math.max(vel, Math.abs(scrollY - lastY) / dt * 1000); lastY = scrollY; lastT = t; }, { passive: true });

/* ticker pause (moving content must be pausable) */
{
  const tk = document.querySelector('.ticker'), pb = $('tickPause');
  pb.addEventListener('click', () => { const on = pb.getAttribute('aria-pressed') !== 'true'; pb.setAttribute('aria-pressed', on); pb.setAttribute('aria-label', on ? 'Play announcements' : 'Pause announcements'); pb.firstElementChild.textContent = on ? '▶' : 'II'; tk.classList.toggle('paused', on); });
}

/* ================= scroll: line fill, rail, next-stop sign ================= */
const secs = [...document.querySelectorAll('main>section')];
const ns = $('nextsign'), nsNow = $('nsNow'), nsNext = $('nsNext');
let lastIdx = -1;
const cur = () => { let best = 0, d = 1e9; secs.forEach((s, i) => { const t = Math.abs(s.getBoundingClientRect().top - 100); if (t < d) { d = t; best = i; } }); return best; };
function prog() {
  const r = track.getBoundingClientRect(), vh = innerHeight;
  const p = Math.max(0, Math.min(1, (vh * 0.85 - r.top) / (r.height + vh * 0.4)));
  track.style.setProperty('--p', p.toFixed(3));
  const lit = Math.round(p * stops.length);
  btns.forEach((b, j) => b.classList.toggle('on', j < lit));
  root.style.setProperty('--sp', (scrollY / Math.max(1, root.scrollHeight - vh)).toFixed(4));
  const i = cur();
  ns.classList.toggle('show', scrollY > vh * 0.5);
  if (i !== lastIdx) {
    lastIdx = i;
    nsNow.textContent = 'Now: ' + secs[i].dataset.name;
    nsNext.textContent = secs[i + 1] ? secs[i + 1].dataset.name : 'End of the line. Thank you for riding.';
    ns.classList.remove('flip'); void ns.offsetWidth; ns.classList.add('flip');
  }
  const pc = $('pcount'); if (pc) pc.textContent = (i + 1) + ' / ' + secs.length;
  const u = $('up'), d = $('down'); if (u) u.disabled = i === 0;
  if (d) { d.disabled = i === secs.length - 1; d.setAttribute('aria-label', secs[i + 1] ? 'Next station: ' + secs[i + 1].dataset.name : 'End of the line'); }
}
addEventListener('scroll', prog, { passive: true }); addEventListener('resize', prog); prog();

/* ================= gallery ================= */
const gal = $('gallery');
const slide = (d) => { const f = [...gal.querySelectorAll('figure')].find((x) => !x.hidden); if (f) gal.scrollBy({ left: d * (f.offsetWidth + 16), behavior: still ? 'auto' : 'smooth' }); };
$('gprev').onclick = () => { slide(-1); click(); }; $('gnext').onclick = () => { slide(1); click(); };
gal.setAttribute('tabindex', '0'); gal.setAttribute('role', 'region'); gal.setAttribute('aria-label', 'Photo gallery, use left and right arrow keys to scroll');
$('filters').addEventListener('click', (e) => {
  const b = e.target.closest('button'); if (!b) return;
  $('filters').querySelectorAll('button').forEach((x) => x.setAttribute('aria-pressed', x === b));
  gal.querySelectorAll('figure').forEach((f) => f.hidden = !(b.dataset.f === 'all' || f.dataset.c === b.dataset.f)); gal.scrollTo({ left: 0 });
});
$('copy').addEventListener('click', async (e) => { try { await navigator.clipboard.writeText(B.org.email); e.target.textContent = 'Copied'; } catch (_) { e.target.textContent = B.org.email; } });

/* ================= motion ================= */
function lights(el) { if (!el || el.dataset.l) return; el.dataset.l = 1; el.innerHTML = ''; const n = Math.max(8, Math.round(innerWidth / 90)); for (let k = 0; k < n; k++) { const i = document.createElement('i'); i.style.left = ((k + 0.5) / n * 100) + '%'; el.appendChild(i); } }
const flashT = new WeakMap();
function flash(el, ms = 2600) { if (!el) return; lights(el); clearTimeout(flashT.get(el)); el.classList.add('flash'); if (ms) flashT.set(el, setTimeout(() => el.classList.remove('flash'), ms)); }
const unflash = (el) => { if (el) { clearTimeout(flashT.get(el)); el.classList.remove('flash'); } };
if (!still && 'IntersectionObserver' in window) {
  try {
    root.classList.add('anim');
    const sel = 'main>section .sta,main>section h2,main>section .lede,.huge,.duo figure,.pids,.announce,.spot-grid figure,.chips,.filters,.fare,.facts,.contact,.who,.stat,.season-head p,.growth,.gapcard,.mind,.route,.perk,.faq details,.l3,.pids.versus,.bkr,.ic,.fcard,.pass-card,.itier,.xfer,.scenes li,.rel,.overview,.pull,.purpose-diff,.story-text';
    document.querySelectorAll(sel).forEach((el) => {
      if (el.closest('#top')) return;
      const sib = [...el.parentElement.children].filter((x) => x.matches(sel));
      el.style.setProperty('--d', (Math.min(sib.indexOf(el), 6) * 0.09) + 's'); el.classList.add('rv');
    });
    const ro = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); ro.unobserve(e.target); } }), { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    document.querySelectorAll('.rv').forEach((el) => ro.observe(el));
    const bo = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('arrived'); const pe = e.target.querySelector('.pedge'); if (pe && !gatedNow()) flash(pe, 2700); bo.unobserve(e.target); } }), { threshold: 0.3 });
    document.querySelectorAll('.band').forEach((el) => bo.observe(el));
  } catch (e) { root.classList.remove('anim'); console.error(e); }
}
/* metro furniture on every band */
document.querySelectorAll('main>section.band').forEach((sec, k) => {
  if (sec.id === 'top') return;
  const pe = document.createElement('div'); pe.className = 'pedge'; pe.setAttribute('aria-hidden', 'true'); sec.appendChild(pe); lights(pe);
  const w = document.createElement('div'); w.className = 'wall'; w.setAttribute('aria-hidden', 'true');
  w.innerHTML = `<span class="ln"><i></i>BR</span><b>${esc(sec.dataset.name)}</b><small>Platform ${k}</small>`; sec.appendChild(w);
});
document.querySelectorAll('main>section .sta b').forEach((b, i) => b.textContent = String(i + 1).padStart(2, '0'));

/* ================= supporters as riders (count comes from content.js) ================= */
{
  const sm = X.metric('supporters'); const N = sm ? sm.value : 0;
  const seats = $('seats');
  if (seats && N) {
  seats.innerHTML = '<i></i>'.repeat(N); const dots = [...seats.children]; let filled = false;
  const fill = () => { if (filled) return; filled = true; let k = 0; const order = dots.map((_, i) => i).sort(() => Math.random() - 0.5);
    const t = setInterval(() => { for (let j = 0; j < 3 && k < N; j++, k++) dots[order[k]].classList.add('on'); $('riderCnt').textContent = k + ' riders'; if (k % 12 === 0) beep(900 + k * 3, 0.03); if (k >= N) { clearInterval(t); $('riderCnt').textContent = N + ' riders · FULL'; chime(true); } }, 40); };
  if (still) { dots.forEach((d) => d.classList.add('on')); $('riderCnt').textContent = N + ' riders · FULL'; }
  else new IntersectionObserver((es, o) => es.forEach((e) => { if (e.isIntersecting) { fill(); o.disconnect(); } }), { threshold: 0.5 }).observe(seats);
  }
}

/* ================= demand: fall comparison only when its basis is confirmed ================= */
{
  const f = B.fall2026 || {}, spring = X.metric('apps');
  const build = (el, n) => { const cars = Math.ceil(n / 12); el.innerHTML = Array.from({ length: cars }, (_, c) => `<div class="tcar">${Array.from({ length: 12 }, (_, k) => `<i class="${c * 12 + k < n ? 'on' : ''}"></i>`).join('')}</div>`).join(''); };
  build($('carsSpring'), spring ? spring.value : 101);
  if (f.basis === 'applications' && f.value) {
    $('trowFall').hidden = false; $('x5').hidden = false; $('fallN').textContent = f.value; build($('carsFall'), f.value);
    const ratio = Math.round((spring.value / f.value) * 10) / 10;
    $('x5').innerHTML = `<span>~${Math.round(ratio)}x</span> in one season`;
    $('demandLede').innerHTML = `Last fall, ${f.value} students applied. This spring, more than 100 did. <strong>Demand is not the problem. Capacity is.</strong> Every partner adds room on the train: another workshop seat, another mentor table, another bus to a campus.`;
    $('trains').setAttribute('aria-label', `Applications grew from ${f.value} in fall 2026 to ${spring.display} in spring 2027`);
  }
  const run = () => { [...document.querySelectorAll('.tcar')].forEach((c, i) => setTimeout(() => { c.classList.add('in'); if (i % 3 === 0) click(); }, still ? 0 : i * 110)); };
  new IntersectionObserver((es, o) => es.forEach((e) => { if (e.isIntersecting) { run(); o.disconnect(); } }), { threshold: 0.4 }).observe($('trains'));
}

/* ================= odometers ================= */
function odoBuild(el) {
  const to = +el.dataset.to, suf = el.dataset.s || '', str = to.toLocaleString() + suf; el.textContent = ''; el.setAttribute('aria-label', str);
  [...str].forEach((ch) => { if (/\d/.test(ch)) { const d = document.createElement('span'); d.className = 'dg'; d.setAttribute('aria-hidden', 'true'); const col = document.createElement('span'); col.innerHTML = [...'0123456789'.repeat(el.classList.contains('slow') ? 12 : 2)].map((n) => `<i>${n}</i>`).join(''); d.appendChild(col); d.dataset.v = ch; el.appendChild(d); } else { const sp = document.createElement('span'); sp.className = 'sep'; sp.setAttribute('aria-hidden', 'true'); sp.textContent = ch; el.appendChild(sp); } });
}
function odoRun(el) {
  const slow = el.classList.contains('slow'), dur = slow ? 5200 : 2200, spins = slow ? 4 : 1, dgs = [...el.querySelectorAll('.dg')];
  dgs.forEach((d, k) => { const col = d.firstChild; const extra = (dgs.length - k) * (slow ? 1 : 0); col.style.transitionDuration = (dur / 1000 + k * 0.15) + 's'; setTimeout(() => { col.style.transform = `translateY(-${(spins + extra) * 10 + +d.dataset.v}em)`; }, k * 90); });
  if (slow) { const t0 = performance.now(); let last = 0; const tick = (t) => { const e = t - t0, k = Math.min(1, e / (dur + dgs.length * 150)), gap = 40 + 260 * k * k; if (e - last > gap) { click(); last = e; } if (k < 1) requestAnimationFrame(tick); else beep(1320, 0.06, 2); }; requestAnimationFrame(tick); }
}
if (!still) document.querySelectorAll('.odo').forEach((el) => {
  odoBuild(el);
  new IntersectionObserver((es, o) => es.forEach((e) => { if (e.isIntersecting) { setTimeout(() => { odoRun(el); if (!el.classList.contains('slow')) beep(1180, 0.04, 4); }, 250); o.disconnect(); } }), { threshold: 0.6 }).observe(el);
});

/* ================= system map scrollytelling ================= */
{
  const segs = [...document.querySelectorAll('#map .seg')], stns = [...document.querySelectorAll('#map .stn')], ms = [...document.querySelectorAll('#map .mstep')]; let curK = -1;
  const setK = (k) => { if (k === curK) return; curK = k; segs.forEach((s) => s.classList.toggle('on', +s.dataset.k <= k)); stns.forEach((s) => { s.classList.toggle('on', +s.dataset.k <= k); s.classList.toggle('cur', +s.dataset.k === k); }); ms.forEach((m) => m.classList.toggle('cur', +m.dataset.k === k)); beep(980 + k * 90, 0.05); };
  const mo = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) setK(+e.target.dataset.k); }), { rootMargin: '-45% 0px -45% 0px' });
  ms.forEach((m) => mo.observe(m)); if (still) setK(ms.length - 1);
}

/* ================= split-flap board ================= */
const asc = (t) => String(t).replace(/[–—]/g, '-').replace(/[·•]/g, '-').replace(/[’‘]/g, "'").replace(/[“”]/g, '"').replace(/&/g, 'and').replace(/[^\x20-\x7e]/g, '');
{
  const flap = $('flap'), AL = ' ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789&-.', W = 18;
  flap.innerHTML = '<span aria-hidden="true"></span>'.repeat(W); const cells = [...flap.children]; let cur = ' '.repeat(W), timer = null;
  const norm = (t) => { t = asc(t).toUpperCase().replace(/[^A-Z0-9&\-. ]/g, ''); return t.length > W ? t.slice(0, W) : t.padStart(Math.floor((W + t.length) / 2)).padEnd(W); };
  function showF(text) {
    const tgt = norm(text); clearInterval(timer); let ticks = 0; flap.setAttribute('aria-label', 'Departure board: ' + text);
    const state = [...cur];
    timer = setInterval(() => { let moving = false; ticks++;
      cells.forEach((c, i) => { if (state[i] === tgt[i] || ticks < i * 0.6) return; moving = true; const ix = AL.indexOf(state[i]); state[i] = ix < 0 ? ' ' : AL[(ix + 1) % AL.length]; if (ticks > i * 0.6 + 14) state[i] = tgt[i]; c.textContent = state[i]; c.classList.remove('f'); void c.offsetWidth; c.classList.add('f'); });
      if (ticks % 3 === 0 && moving) click(); if (!moving) { clearInterval(timer); cur = tgt; } }, 55);
  }
  const cycle = ['YOUR STATION', 'MEDICINE', 'POLICY & LAW', 'MEDIA', 'NEXT UP TOUR', 'CLOSING DINNER']; let ci = 0;
  const startCycle = () => setInterval(() => { if ($('flapName').value.trim()) return; showF(cycle[ci++ % cycle.length]); }, 3600);
  if (still) { cur = norm('YOUR STATION'); cells.forEach((c, i) => c.textContent = cur[i]); }
  else new IntersectionObserver((es, o) => es.forEach((e) => { if (e.isIntersecting) { showF(cycle[ci++]); startCycle(); o.disconnect(); } }), { threshold: 0.4 }).observe(flap);
  let deb; $('flapName').addEventListener('input', (e) => { clearTimeout(deb); deb = setTimeout(() => { const v = e.target.value.trim(); showF(v ? v + ' STN' : cycle[0]); if (v) { $('orgName').value = v; render(); } }, 350); });
}

/* ================= partnership builder =================
   The builder only collects selections. All money, titles, benefits and checkout rules come from X.rules (common.js). */
const form = $('pform');
const R2 = X.rules;
const pick = new Map(), others = new Set();
let season = null, present = null, inst = false, instAmt = '', giftRaw = '', recog = 'name', chosenTier = '', pendingSeason = null, reviewed = false;
const rows = $('rows');
rows.innerHTML = stops.map((s, i) => `<div class="brow" data-i="${i}"><span class="n" aria-hidden="true">${i + 1}</span><span><b>${esc(s.n)}</b><small>${esc(s.d)} · ${esc(B.programStatus[s.status])}</small></span><span class="seg" role="group" aria-label="Support for ${esc(s.n)}"><button type="button" aria-pressed="true" data-v="0">Skip</button><button type="button" aria-pressed="false" data-v="250">$250</button><button type="button" aria-pressed="false" data-v="500">$500</button><button type="button" aria-pressed="false" data-v="other">Other</button></span><label class="amt" hidden><span>$</span><input type="text" inputmode="decimal" placeholder="Amount" aria-label="Program gift amount for ${esc(s.n)}"></label><span class="rmsg" aria-live="polite"></span></div>`).join('');
$('mini').innerHTML = stops.map((_, i) => `${i ? '<i></i>' : ''}<b></b>`).join('');
$('presentSel').insertAdjacentHTML('beforeend', stops.map((s, i) => `<option value="${i}">${esc(s.n)} (${esc(s.d)})</option>`).join(''));
const seasonTiers = B.tiers.filter((t) => t.track === 'season');
$('seasonPk').innerHTML = `<label class="sznpk"><input type="radio" name="seasonpk" value="" checked><span><b>No season package</b></span></label>` + seasonTiers.map((t) => `<label class="sznpk"><input type="radio" name="seasonpk" value="${t.id}"><span><b>${esc(t.name)} · ${tierLabel(t)}</b><small>${esc(t.blurb)}${t.approval ? ' Requires approval.' : ''}</small></span></label>`).join('');

/* step 2 fields from content.js */
{
  const opt = (v) => `<option>${esc(v)}</option>`;
  $('fPtype').insertAdjacentHTML('beforeend', B.audiences.map((a) => opt(a.name)).join('') + opt('Other'));
  $('fIndustry').insertAdjacentHTML('beforeend', B.pathways.map((p) => opt(p.name)).join('') + opt('Other'));
  $('fRange').insertAdjacentHTML('beforeend', PF.ranges.map(opt).join(''));
  const box = (name, v, type = 'checkbox') => `<label class="o"><input type="${type}" name="${name}" value="${esc(v)}"><span>${esc(v)}</span></label>`;
  $('fKind').innerHTML = PF.kinds.map((k) => box('kind', k, 'radio')).join('');
  $('fInterests').innerHTML = B.focusAreas.map((f) => box('interests', f.name)).join('');
  $('fEngage').innerHTML = PF.engagement.map((x) => box('engagement', x)).join('');
  $('fPrograms').innerHTML = [...new Set(stops.map((s) => s.n))].map((n) => box('programs', n)).join('') + box('programs', 'Unrestricted support for the whole season');
}

let shown = 0, rangeTouched = false;
const amtMsg = { invalid: 'Use numbers only.', negative: 'Amounts cannot be negative.', rounded: 'Rounded to the nearest dollar.', capped: 'For amounts this large, please talk with us. Capped at $1,000,000 here.' };
function selection() {
  return { programs: [...pick].map(([i, amount]) => ({ i, amount })), presentProgram: present, season, institutional: inst, institutionalAmount: instAmt, gift: giftRaw, inkind: $('kind').value, recognition: recog };
}
function evaluate() { return R2.evaluate(selection()); }
window.__bridgeBuilder = { evaluate, selection };   // read-only hook for automated tests
function render() {
  const r = evaluate(), tot = r.total, on = (i) => (R2.parseAmount(pick.get(i)).value > 0) || present === i;
  rows.querySelectorAll('.brow').forEach((row, i) => {
    row.classList.toggle('on', on(i)); const o = others.has(i), v = pick.get(i);
    row.querySelector('.amt').hidden = !o;
    row.querySelectorAll('button').forEach((b) => { const bv = b.dataset.v; b.setAttribute('aria-pressed', bv === 'other' ? String(o) : String(!o && (bv === '0' ? !v : +v === +bv))); });
    const pa = R2.parseAmount(v), pk = o && pa.value ? R2.programPackage(pa.value) : null;
    row.querySelector('.rmsg').textContent = o ? (amtMsg[pa.note] || (pa.value ? (pk ? pk.name : 'Program gift, no package') : '')) : '';
  });
  const dots = $('mini').querySelectorAll('b'), segs = $('mini').querySelectorAll('i');
  dots.forEach((d, i) => d.classList.toggle('on', on(i))); segs.forEach((g, i) => g.classList.toggle('on', on(i) && on(i + 1)));
  const from = shown, t0 = performance.now(); shown = tot;
  const stepA = (t) => { const k = still ? 1 : Math.min(1, (t - t0) / 500); $('total').textContent = '$' + Math.round(from + (tot - from) * (1 - (1 - k) ** 3)).toLocaleString('en-US'); if (k < 1) requestAnimationFrame(stepA); }; requestAnimationFrame(stepA);
  const progN = r.lines.filter((l) => l.kind === 'program').length;
  $('tdesc').textContent = r.empty ? (chosenTier ? 'You asked about ' + chosenTier + '. Choose it below, or tell us in your details.' : 'Choose a program, a season package or a gift to start.')
    : [progN ? progN + ' program' + (progN > 1 ? 's' : '') : '', r.season ? 'a season package' : '', present != null ? 'a presenting request' : '', inst ? 'an institutional conversation' : '', r.unrestricted ? 'an unrestricted gift' : '', r.inkind ? 'in-kind support' : ''].filter(Boolean).join(', ').replace(/^./, (c) => c.toUpperCase()) + '.';
  $('tlist').innerHTML = r.lines.map((l) => `<li><span>${esc(l.kind === 'inkind' ? 'In-kind: ' + l.text : l.kind === 'program' || l.kind === 'progpresenting' ? l.program : l.title)}<small>${esc(l.designation)}</small></span><b>${l.kind === 'inkind' ? 'No $ value' : l.amount ? money(l.amount) : 'Set together'}</b></li>`).join('') || '<li class="none">Nothing selected yet.</li>';
  $('tclassW').hidden = !r.titles.length;
  $('tclass').innerHTML = r.titles.map((t) => `<li><b>${esc(t.name)}</b> <small>${esc(t.where)}${t.approval ? ' · requires approval' : ''}</small></li>`).join('');
  $('tbenW').hidden = !r.benefits.length;
  $('tben').innerHTML = r.benefits.map((b) => `<li>${esc(b.label)}<small>${esc(b.where || '')}${b.limited ? ' · limited, subject to availability' : ''}${b.approval && !b.limited ? ' · subject to review' : ''}</small></li>`).join('');
  $('tconfW').hidden = !r.approvals.length;
  $('tconf').innerHTML = r.approvals.map((x) => `<li>${esc(x)}</li>`).join('');
  $('tnotes').innerHTML = r.notes.map((x) => `<p>${esc(x)}</p>`).join('');
  $('gbar').style.width = r.goalBar + '%';
  $('gtxt').textContent = tot ? `Your proposed support would equal ${r.goalPct}% of the ${money(B.goals.amount)} spring goal. This is a proposal, not money raised, and the goal is not a limit.` : `The goal is built as ${B.goals.builtAs}. Proposed support is never counted as raised.`;
  const online = r.checkout.mode === 'online';
  $('payNow').hidden = !online; $('confirmBtn').hidden = r.checkout.mode !== 'confirm';
  if (online) { $('payAmt').textContent = money(r.checkout.amount); $('payNow').href = giveUrl(r.checkout.amount); }
  $('payNote').textContent = online ? 'Opens our Givebutter page for an unrestricted gift. You can change the amount there; whatever you give is used where it is needed most.'
    : r.checkout.mode === 'confirm' ? r.checkout.reason + (r.checkout.giftPart ? ' Your unrestricted portion is included in the same confirmation.' : '')
    : 'Nothing here is reserved or charged. Unrestricted gifts can be given online. Everything else is confirmed with BRIDGE first.';
  $('ownMsg').textContent = amtMsg[R2.parseAmount(giftRaw).note] || '';
  /* keep step 2 in sync */
  if (!rangeTouched) $('fRange').value = PF.rangeFor(tot) || '';
  const chosenNames = r.lines.filter((l) => l.program).map((l) => l.program).concat(r.season ? ['Unrestricted support for the whole season'] : []);
  form.querySelectorAll('input[name=programs]').forEach((c) => { if (c.dataset.touched) return; c.checked = chosenNames.includes(c.value); });
  /* a saved printable proposal is cleared as soon as selections change after review */
  if (reviewed) { PF.clearProposal(); reviewed = false; }
}
rows.addEventListener('click', (e) => { const b = e.target.closest('.seg button'); if (!b) return; const row = b.closest('.brow'), i = +row.dataset.i, v = b.dataset.v;
  if (v === 'other') { others.add(i); pick.set(i, row.querySelector('input').value); render(); row.querySelector('input').focus(); beep(880); return; }
  others.delete(i); row.querySelector('input').value = ''; if (+v) { pick.set(i, +v); beep(1180, 0.07, 2); } else { pick.delete(i); beep(520, 0.06); } render(); });
rows.addEventListener('input', (e) => { const row = e.target.closest('.brow'); if (!row) return; pick.set(+row.dataset.i, e.target.value); render(); });
$('ownAmt').addEventListener('input', (e) => { giftRaw = e.target.value; render(); });
$('quick').addEventListener('click', (e) => { const b = e.target.closest('button'); if (!b) return; giftRaw = b.dataset.q; $('ownAmt').value = giftRaw; beep(1180, 0.07, 2); render(); });
$('presentSel').addEventListener('change', (e) => { present = e.target.value === '' ? null : +e.target.value; render(); });
$('instChk').addEventListener('change', (e) => { inst = e.target.checked; $('instAmtL').hidden = !inst; render(); });
$('instAmt').addEventListener('input', (e) => { instAmt = e.target.value; render(); });
form.querySelectorAll('input[name=recog]').forEach((x) => x.addEventListener('change', () => { recog = x.value; render(); }));
$('kind').addEventListener('input', render); $('orgName').addEventListener('input', render);
$('fRange').addEventListener('change', () => { rangeTouched = true; });
form.addEventListener('change', (e) => { if (e.target.name === 'programs') e.target.dataset.touched = 1; });
/* choosing a season package while programs are selected asks what to do, and never silently changes the selection */
const setSeasonRadio = (v) => form.querySelectorAll('input[name=seasonpk]').forEach((x) => { x.checked = x.value === (v || ''); });
const hasPrograms = () => [...pick.values()].some((v) => R2.parseAmount(v).value > 0);
$('seasonPk').addEventListener('change', (e) => {
  const v = e.target.value || null;
  if (v && hasPrograms() && !season) {
    pendingSeason = v; const t = X.tierById(v), r0 = evaluate();
    $('swD').textContent = `You have ${r0.lines.filter((l) => l.kind === 'program').length} program selection(s) totaling ${money(r0.restricted)}. ${t.name} is a separate season partnership. You can keep both, replace your programs with it, or cancel.`;
    $('swDlg').hidden = false; $('swDlg').focus(); setSeasonRadio(season); return;
  }
  season = v; if (v) { beep(1180, 0.07, 3); say(X.tierById(v).name + ' selected.'); } render();
});
$('swDlg').addEventListener('click', (e) => { const b = e.target.closest('[data-sw]'); if (!b) return; const act = b.dataset.sw;
  if (act === 'replace') { pick.clear(); others.clear(); rows.querySelectorAll('.amt input').forEach((x) => { x.value = ''; }); season = pendingSeason; }
  if (act === 'keep') season = pendingSeason;
  pendingSeason = null; $('swDlg').hidden = true; setSeasonRadio(season); render();
  const sel = form.querySelector(`input[name=seasonpk][value="${season || ''}"]`); if (sel) sel.focus(); });
$('swDlg').addEventListener('keydown', (e) => { if (e.key === 'Escape') { e.stopPropagation(); pendingSeason = null; $('swDlg').hidden = true; setSeasonRadio(season); } });
$('clearSel').addEventListener('click', () => { pick.clear(); others.clear(); season = null; present = null; inst = false; instAmt = ''; giftRaw = ''; chosenTier = '';
  rows.querySelectorAll('.amt input').forEach((x) => { x.value = ''; }); $('ownAmt').value = ''; $('kind').value = ''; $('presentSel').value = ''; $('instChk').checked = false; $('instAmt').value = ''; $('instAmtL').hidden = true; setSeasonRadio(null); PF.clearProposal(); render(); });

/* steps */
const stepBtns = [...document.querySelectorAll('.stepper button')], stepSets = [...form.querySelectorAll('.bstep')];
let step = 1;
const newId = () => 'BR-' + new Date().toISOString().slice(2, 10).replace(/-/g, '') + '-' + Math.random().toString(36).slice(2, 6).toUpperCase();
function collect() {
  const fd = new FormData(form), g = (k) => (fd.get(k) || '').toString().trim(), all = (k) => fd.getAll(k).map(String);
  const r = evaluate();
  const parts = [r.restricted ? money(r.restricted) + ' restricted to programs' : '', r.season ? money(r.season) + ' for the season' : '', r.institutional ? money(r.institutional) + ' institutional, set by agreement' : '', r.unrestricted ? money(r.unrestricted) + ' unrestricted' : ''].filter(Boolean).join('; ');
  return { source: 'Partnership builder', proposalId: collect.id || (collect.id = newId()), org: g('org'), name: g('name'), title: g('title'), email: g('email'), phone: g('phone'), ptype: g('ptype'), industry: g('industry'), range: g('range'), kind: g('kind'),
    interests: all('interests'), engagement: all('engagement'), programs: all('programs'), items: R2.describe(r), total: r.total, breakdown: parts,
    titles: r.titles.map((t) => t.name + ' (' + t.where + ')'), benefits: r.benefits.map((b) => b.label + (b.where ? ' [' + b.where + ']' : '')), approvals: r.approvals, notes: r.notes,
    recognition: { name: 'Recognize us by name', anonymous: 'Anonymous', none: 'No public recognition' }[recog], tier: chosenTier, inkind: r.inkind, comments: g('comments'), status: r.status, rules: R2.VERSION };
}
function validate() {
  const req = [['org', 'organization name'], ['name', 'your name'], ['email', 'email']], miss = [];
  req.forEach(([n, l]) => { const el = form.elements[n]; const bad = !el.value.trim() || (n === 'email' && !PF.validEmail(el.value.trim())); el.setAttribute('aria-invalid', bad); if (bad) miss.push(n === 'email' && el.value.trim() ? 'a valid email address' : l); });
  const err = $('ferr');
  if (miss.length) { err.hidden = false; err.textContent = 'Please add ' + miss.join(', ') + '.'; form.elements[req.find(([n]) => form.elements[n].getAttribute('aria-invalid') === 'true')[0]].focus(); return false; }
  err.hidden = true; return true;
}
function goStep(n, focus = true) {
  if (n === 3 && !validate()) { if (step !== 2) goStep(2); return; }
  step = n;
  stepSets.forEach((s) => s.hidden = +s.dataset.step !== n);
  stepBtns.forEach((b) => { if (+b.dataset.step === n) b.setAttribute('aria-current', 'step'); else b.removeAttribute('aria-current'); });
  if (n === 3) {
    const d = collect();
    $('review').innerHTML = `<h3>Your proposed partnership</h3><p class="rv-note">${esc(d.status)} Proposal ID ${esc(d.proposalId)}. You can still edit it.</p>${PF.html(d)}${d.benefits.length ? `<h4>Proposed benefits</h4><ul class="rvben">${d.benefits.map((b) => `<li>${esc(b)}</li>`).join('')}</ul>` : ''}${d.notes.length ? `<div class="tnotes">${d.notes.map((x) => `<p>${esc(x)}</p>`).join('')}</div>` : ''}`;
    PF.saveForProposal(d); reviewed = true;
    const ep = !!B.form.endpoint;
    $('sendBtn').textContent = ep ? 'Send to BRIDGE' : 'Send by email';
    $('sendNote').textContent = (ep ? 'Sends this summary directly to the BRIDGE team.' : 'Opens a ready-to-send email to ' + B.org.email + ' with this summary written in. Nothing is sent until you press send in your email.') + ' Sending is an inquiry, not a commitment.';
    $('sendState').textContent = '';
  }
  if (focus) { const t = n === 3 ? $('review') : stepSets[n - 1].querySelector('input,select,textarea,button'); const top = document.querySelector('#build .stepper'); top.scrollIntoView({ behavior: still ? 'auto' : 'smooth', block: 'start' }); setTimeout(() => t && t.focus({ preventScroll: true }), still ? 0 : 400); }
}
stepBtns.forEach((b) => b.addEventListener('click', () => goStep(+b.dataset.step)));
form.addEventListener('click', (e) => { const b = e.target.closest('[data-go]'); if (b) goStep(+b.dataset.go); });
$('confirmBtn').addEventListener('click', () => goStep(2));
let sending = false;
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (sending) return;
  if (!validate()) { goStep(2); return; }
  const d = collect(), st = $('sendState'), btn = $('sendBtn');
  if (B.form.endpoint) {
    sending = true; btn.disabled = true; st.textContent = 'Sending…';
    const r = await PF.submit(d);
    sending = false; btn.disabled = false;
    if (r.ok) { st.textContent = 'Received. Your inquiry reached the BRIDGE team, and we will reply by email. Nothing is confirmed until we agree it in writing.'; btn.textContent = 'Sent'; btn.disabled = true; beep(1320, 0.06, 3); }
    else { st.textContent = 'That did not go through. Nothing was sent. Please try again, or send it by email instead.'; PF.mailModal(PF.subject(d), PF.text(d), 'The form could not reach BRIDGE, so nothing was sent. Send your summary by email instead:'); }
  } else {
    PF.mailModal(PF.subject(d), PF.text(d));
  }
});

/* links that prefill the builder. A link can point at a package, but it never selects a season or institutional package by itself. */
function prefill(a) {
  if (a.dataset.tier) { const t = X.tierById(a.dataset.tier); if (t) { chosenTier = t.name + ' (' + tierLabel(t) + ')'; if (t.amount) { $('fRange').value = PF.rangeFor(t.amount); rangeTouched = true; }
    if (t.track === 'institutional') { inst = true; $('instChk').checked = true; $('instAmtL').hidden = false; }
    const box = t.track === 'season' ? $('seasonPk') : t.track === 'program' ? rows : null; if (box) box.classList.add('hint'); setTimeout(() => box && box.classList.remove('hint'), 2600); } }
  if (a.dataset.aud) { const au = B.audiences.find((x) => x.id === a.dataset.aud); if (au) $('fPtype').value = au.name; }
  if (a.dataset.industry) $('fIndustry').value = a.dataset.industry;
  if (a.dataset.stop != null) { const i = +a.dataset.stop; if (!(R2.parseAmount(pick.get(i)).value > 0)) { others.delete(i); pick.set(i, 250); } }
  render();
}

/* ================= confetti ================= */
function confetti(n = 90) {
  if (still) return; const c = document.createElement('div'); c.className = 'confetti'; c.setAttribute('aria-hidden', 'true'); const cols = ['#E31937', '#FFC300', '#ffffff', '#0073FF', '#0B1F3B'];
  for (let k = 0; k < n; k++) { const i = document.createElement('i'); i.style.left = Math.random() * 100 + 'vw'; i.style.background = cols[k % cols.length]; i.style.setProperty('--dx', (Math.random() * 30 - 15) + 'vw'); i.style.setProperty('--r', (Math.random() * 1080 - 540) + 'deg'); i.style.setProperty('--t', (1.8 + Math.random() * 1.6) + 's'); i.style.animationDelay = Math.random() * 0.4 + 's'; c.appendChild(i); }
  document.body.appendChild(c); setTimeout(() => c.remove(), 4200);
}
document.addEventListener('click', (e) => { if (e.target.closest('a.give,#payNow')) confetti(); });
render();

/* ================= headlines: words rise in; whoosh when they land ================= */
if (!still) document.querySelectorAll('main>section h2').forEach((h) => {
  if (h.closest('#top')) return; let k = 0;
  const walk = (n) => { [...n.childNodes].forEach((c) => { if (c.nodeType === 3) { const f = document.createDocumentFragment(); c.textContent.split(/(\s+)/).forEach((t) => { if (!t) return; if (/^\s+$/.test(t)) { f.appendChild(document.createTextNode(t)); return; } const w = document.createElement('span'); w.className = 'w'; w.style.setProperty('--wi', k++); w.textContent = t; f.appendChild(w); }); c.replaceWith(f); } else if (c.nodeType === 1 && c.tagName !== 'BR') walk(c); }); };
  walk(h);
});
/* whoosh plays only when a train actually passes (see depart), never because a headline scrolled into view */
/* shutter clicks and books */
{ const sp = $('policy'); if (sp) new IntersectionObserver((es, o) => es.forEach((e) => { if (e.isIntersecting) { [0, 1, 2, 3, 4].forEach((k) => setTimeout(click, 900 + k * 180)); o.disconnect(); } }), { threshold: 0.35 }).observe(sp); }
document.querySelectorAll('.shelf i').forEach((b, k) => b.style.setProperty('--k', k));
{ const bk = document.querySelector('.bkr'); if (bk) new IntersectionObserver((es, o) => es.forEach((e) => { if (e.isIntersecting) { bk.querySelectorAll('.shelf i').forEach((b, k) => setTimeout(click, 300 + k * 80)); o.disconnect(); } }), { threshold: 0.4 }).observe(bk); }

/* ================= phone or computer ================= */
const isPhone = matchMedia('(pointer:coarse) and (max-width:820px)').matches;
document.body.classList.toggle('phone', isPhone);
const toast = document.createElement('div'); toast.className = 'devtoast'; toast.setAttribute('role', 'status');
toast.textContent = isPhone ? 'SCROLL TO RIDE, OR TAP NEXT' : 'TAP NEXT OR USE THE ARROW KEYS · M FOR SOUND'; document.body.appendChild(toast);
const showToast = () => { toast.classList.add('show'); setTimeout(() => toast.classList.remove('show'), 4500); };

/* ================= boarding gate ================= */
const gate = $('gate');
lights($('gEdge')); lights($('wEdge'));
let boarded = false;
function endGate(focusMain) {
  root.classList.remove('gate-on');
  try { sessionStorage.setItem('bridge-boarded', '1'); } catch (_) {}
  if (gate) gate.remove();
  prog();
  if (focusMain) $('top').focus({ preventScroll: true });
}
function board(withSound) {
  if (boarded) return; boarded = true;
  if (withSound) setSound(true);
  if (still) { endGate(true); return; }
  gate.classList.add('tapped'); setTimeout(() => beep(1180, 0.07, 2), 250);
  setTimeout(() => { gate.classList.add('going'); flash($('gEdge'), 0); rumble(2.2, 0.22); $('gHint').textContent = 'TRAIN APPROACHING · STAND BACK FROM THE PLATFORM EDGE'; }, 600);
  setTimeout(() => { unflash($('gEdge')); chime(false); say('Doors opening. Welcome aboard the BRIDGE Line. This is a train to Spring 2027.', 600); }, 2500);
  setTimeout(() => { gate.classList.add('open'); hiss(1.1); }, 2800);
  setTimeout(() => { root.classList.remove('gate-on'); prog(); showToast(); $('top').focus({ preventScroll: true }); }, 3050);
  setTimeout(() => endGate(false), 4300);
}
if (gate && gatedNow()) {
  $('board').addEventListener('click', () => board(false));
  $('boardSound').addEventListener('click', () => board(true));
  $('skipIntro').addEventListener('click', () => { boarded = true; endGate(true); });
  gate.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { boarded = true; endGate(true); return; }
    if (e.key !== 'Tab') return;
    const f = [...gate.querySelectorAll('button,a')], a = f[0], z = f[f.length - 1];
    if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus(); } else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); }
  });
  $('board').focus({ preventScroll: true });
} else if (gate) { gate.remove(); }
try { if (sessionStorage.getItem('bridge-sound') === '1') { /* audio needs a gesture: re-enable on first interaction */ addEventListener('pointerdown', () => setSound(true), { once: true }); } } catch (_) {}

/* ================= the departing train between stations ================= */
const wipeEl = $('wipe'), wt = wipeEl.querySelector('.wtrain'), wdest = $('wdest');
let busy = false;
function arrive(target) { target.querySelectorAll('.rv').forEach((x) => x.classList.add('in')); target.focus({ preventScroll: true }); }
function depart(target, name) {
  if (still || busy || !wt.animate) { target.scrollIntoView({ behavior: still ? 'auto' : 'smooth' }); setTimeout(() => arrive(target), still ? 0 : 500); return; }
  busy = true; if (running()) { chime(false); setTimeout(() => rumble(2, 0.22), 150); }
  say(target.id === 'join' ? 'This is the last stop. Thank you for riding the BRIDGE Line.' : 'Step back, doors closing. Next stop: ' + name.replace('&', 'and') + '.', 350);
  $('apDest').textContent = name.toUpperCase();
  document.querySelector('main').animate([{ transform: 'translateY(0)' }, { transform: 'translateY(2px)' }, { transform: 'translate(-2px,-1px)' }, { transform: 'translateY(0)' }], { duration: 260, iterations: 3, delay: 700 });
  wdest.textContent = 'BRIDGE LINE · NEXT STOP: ' + name.toUpperCase();
  wipeEl.classList.add('go'); flash($('wEdge'), 0); requestAnimationFrame(() => wipeEl.classList.add('near'));
  setTimeout(() => {
    wipeEl.classList.add('rolling'); whoosh();
    const a = wt.animate([{ transform: 'translateX(0)' }, { transform: 'translateX(-125vw)' }], { duration: 520, easing: 'cubic-bezier(.55,0,.9,.4)', fill: 'forwards' });
    a.onfinish = () => {
      root.style.scrollBehavior = 'auto'; target.scrollIntoView(); root.style.scrollBehavior = '';
      arrive(target);
      setTimeout(() => { const b = wt.animate([{ transform: 'translateX(-125vw)' }, { transform: 'translateX(-290vw)' }], { duration: 620, easing: 'cubic-bezier(.2,.6,.4,1)', fill: 'forwards' });
        b.onfinish = () => { unflash($('wEdge')); wipeEl.classList.remove('go', 'near', 'rolling'); a.cancel(); b.cancel(); busy = false; const pe = target.querySelector('.pedge'); if (pe) flash(pe, 1800); }; }, 140);
    };
  }, 900);
}
document.addEventListener('click', (e) => {
  const a = e.target.closest('a[href^="#"]');
  if (!a || a.getAttribute('href').length < 2) return;
  const t = document.querySelector(a.getAttribute('href'));
  if (!t) return;
  e.preventDefault();
  prefill(a);
  history.replaceState(null, '', a.getAttribute('href'));
  if (t.tagName === 'SECTION') depart(t, t.dataset.name || ''); else { t.scrollIntoView({ behavior: still ? 'auto' : 'smooth' }); t.focus && t.focus({ preventScroll: true }); }
});

/* ================= autoplay ride + back / next ================= */
const go = (k) => { const c = cur(), i = Math.max(0, Math.min(secs.length - 1, c + k)); if (i !== c) depart(secs[i], secs[i].dataset.name); };
$('up').onclick = () => { stopAuto(); go(-1); }; $('down').onclick = () => { stopAuto(); go(1); };
ns.addEventListener('click', () => { stopAuto(); go(1); }); ns.setAttribute('role', 'button'); ns.tabIndex = 0; ns.setAttribute('aria-label', 'Go to the next station');
ns.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(1); } });
let auto = null; const DWELL = 10000, expBar = $('expBar');
const setRide = (on) => document.body.classList.toggle('present', on);
function lap() { expBar.classList.remove('run'); void expBar.offsetWidth; expBar.style.setProperty('--dwell', DWELL + 'ms'); expBar.classList.add('run'); }
function startAuto() {
  setRide(true); if (auto) return;
  $('autoBtn').setAttribute('aria-pressed', 'true'); $('autoBtn').textContent = 'Pause';
  say('This is an express train to the end of the line. Sit back and enjoy the ride.', 200);
  if (cur() === 0) setTimeout(() => go(1), 3200);
  lap(); auto = setInterval(() => { if (cur() >= secs.length - 1) { stopAuto(); return; } go(1); lap(); }, DWELL);
}
function stopAuto() { if (!auto) return; clearInterval(auto); auto = null; setRide(false); expBar.classList.remove('run'); $('autoBtn').setAttribute('aria-pressed', 'false'); $('autoBtn').textContent = 'Autoplay'; }
$('autoBtn').addEventListener('click', () => auto ? stopAuto() : startAuto());
['wheel', 'touchstart'].forEach((ev) => addEventListener(ev, () => { if (auto && !busy) stopAuto(); }, { passive: true }));
addEventListener('keydown', (e) => {
  if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey || gatedNow()) return;
  if (e.target.closest('input,textarea,select,[role=tablist],#gallery,.modal,[contenteditable]')) return;
  if (auto && e.key !== 'Tab') stopAuto();
  if (e.key === 'm' || e.key === 'M') { setSound(!soundOn); return; }
  if (e.target.closest('button,a,summary') && (e.key === ' ' || e.key === 'Enter')) return;
  const p = document.body.classList.contains('present');
  if (e.key === 'ArrowRight' || (p && ['ArrowDown', 'PageDown', ' '].includes(e.key))) { e.preventDefault(); go(1); }
  else if (e.key === 'ArrowLeft' || (p && ['ArrowUp', 'PageUp'].includes(e.key))) { e.preventDefault(); go(-1); }
});
$('gallery').addEventListener('keydown', (e) => { if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { e.preventDefault(); slide(e.key === 'ArrowRight' ? 1 : -1); } });
})();
