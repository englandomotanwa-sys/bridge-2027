/* Presentation mode: a 5 to 7 minute partner conversation, built from content.js. */
(function () {
'use strict';
const X = window.BX; if (!X) return;
const { B, $, esc, tierLabel } = X;
const m = (id) => X.metric(id);
const stat = (id) => { const x = m(id); return x ? `<div class="sst"><b>${esc(x.display)}</b><span>${esc(x.label)}</span><small>${esc(x.period)}</small></div>` : ''; };
const T = B.programTypes;

const slides = [
  { cls: 'title', notes: 'Introduce yourself and BRIDGE in one sentence. Set the frame: this is an invitation to build, not a request to rescue.',
    html: `<img class="bgimg" src="group.jpg" alt=""><div class="tl"><p class="kick"><span class="dot"></span>BRIDGE the District · Spring 2027</p><h1>Come into the room.<br><em>Build it with us.</em></h1><p class="sub">${esc(B.org.tagline)}</p></div>` },
  { cls: 'light', notes: 'Name the gap with outside data. Keep it about access and systems, never about students lacking ability.',
    html: `<p class="kick red">The problem</p><h2>DC is full of open doors. Not every student gets to walk through them.</h2><div class="sgrid3">${B.gapStats.map((g) => g.bars ? `<div class="sst"><b>${g.bars.map(([, v]) => v + '%').join(' / ')}</b><span>${esc(g.title)}: ${g.bars.map(([l]) => esc(l)).join(' / ')}</span><small>${esc(g.source)}</small></div>` : `<div class="sst"><b>${esc(g.value)}</b><span>${esc(g.text)}</span><small>${esc(g.source)}</small></div>`).join('')}</div>` },
  { cls: 'dark', notes: 'This is the positioning. Pause on the second sentence.',
    html: `<p class="kick">Why we exist</p><h2 class="big">Opportunity should not depend on <em>who you already know.</em></h2><p class="lead">We are not simply bringing students into rooms. We are changing who gets access to those rooms in the first place.</p>` },
  { cls: 'dark', notes: 'Walk the line left to right. Point at the transfer station: every investment passes through Impact Scholars.',
    html: `<p class="kick">The model</p><h2>One investment. Two lines of opportunity.</h2><ol class="sroute">${B.model.map((s) => `<li class="k-${s.kind}${s.line ? ' l-' + s.line : ''}"><i></i><b>${esc(s.short)}</b></li>`).join('')}</ol><p class="lead sm">College students develop as leaders. Younger students gain college exposure and mentors from near-peers. The terminal is an intended outcome, not a claimed result.</p>` },
  { cls: 'light', notes: 'Use one concrete example from fall 2026 here, such as the mock committee at Law and Policy.',
    html: `<p class="kick red">For students. By students. With students.</p><h2>Students run the room.</h2><div class="sgrid2"><div class="pathc red"><h3>College students</h3><p>${esc(B.model.find((s) => s.id === 'college').text)}</p></div><div class="pathc blue"><h3>Younger students</h3><p>${esc(B.model.find((s) => s.id === 'younger').text)}</p></div></div>` },
  { cls: 'light', notes: 'Every number has a period. Say clearly that outcome figures are not published yet.',
    html: `<p class="kick red">Evidence</p><h2>What we can document.</h2><div class="sgrid3">${['apps', 'tracker', 'supporters', 'books', 'speakers', 'unis'].map(stat).join('')}</div><p class="foot">${esc(B.impactNotes.outcomes)}</p>` },
  { cls: 'dark', notes: 'Show the season as a system, not a list of events. Ask which program fits their goals.',
    html: `<p class="kick">Spring 2027</p><h2>The BRIDGE Line: ${B.programs.length} programs, January to April.</h2><ol class="sline">${B.programs.map((p) => `<li style="--c:${T[p.type].color}"><i></i><small>${esc(p.d)}</small><b>${esc(p.n)}</b></li>`).join('')}</ol><p class="foot">${esc(B.programStatusNote)}</p>` },
  { cls: 'dark', notes: 'Find their industry. Be explicit about which lines run now and which are proposed.',
    html: `<p class="kick">Industry pathways</p><h2>Find the line your industry already runs on.</h2><ul class="spw">${B.pathways.map((p) => `<li style="--c:${p.color}"><span class="bul">${esc(p.code)}</span><b>${esc(p.name)}</b><small>${p.status === 'existing' ? 'Running now' : 'Proposed'}</small></li>`).join('')}</ul>` },
  { cls: 'light', notes: 'Explain unrestricted versus program gifts. Unrestricted support is what lets a young organization plan.',
    html: `<p class="kick red">Every fare opens a door</p><h2>Where partnership goes.</h2><div class="sgrid2"><div class="pathc navy"><h3>Unrestricted</h3><p>Goes where the season needs it most, including Impact Scholar training and coordination.</p></div><div class="pathc red"><h3>Program gift</h3><p>Directed to one program you choose. We use it for that program.</p></div></div><p class="tags">${B.costAreas.map((c) => `<span>${esc(c.name)}</span>`).join('')}</p>` },
  { cls: 'red', notes: 'Levels are proposed and flexible. For $5,000 and up, propose a planning conversation.',
    html: `<p class="kick">Partnership levels</p><h2>From one program to the whole system.</h2><div class="stiers">${B.tiers.map((t) => `<div class="${t.online ? '' : 'inst'}"><b>${tierLabel(t)}</b><span>${esc(t.name)}</span></div>`).join('')}</div><p class="foot">${esc(B.tierNote)}</p>` },
  { cls: 'title end', notes: 'Close with a concrete next step and a date. Offer the prospectus as the leave-behind.',
    html: `<img class="bgimg" src="cohort.jpg" alt=""><div class="tl"><p class="kick"><span class="dot"></span>Last stop</p><h2 class="big">Let's build it together.</h2><ol class="next"><li>Choose a program, a level, or unrestricted support</li><li>Set a planning conversation with our team</li><li>Introduce us to one colleague who should be in the room</li></ol><p class="contact"><b>${esc(B.org.email)}</b><span>${esc(B.org.leadership[0].name)}, ${esc(B.org.leadership[0].role)}</span></p></div>` }
];

const stage = $('stage');
stage.innerHTML = slides.map((s, i) => `<section class="slide ${s.cls}" id="s${i + 1}" aria-roledescription="slide" aria-label="${i + 1} of ${slides.length}" ${i ? 'hidden' : ''}>${s.html}</section>`).join('');
const els = [...stage.children];
let cur = 0, t0 = Date.now();
function go(i) {
  i = Math.max(0, Math.min(slides.length - 1, i));
  els[cur].hidden = true; cur = i; els[cur].hidden = false;
  $('dcount').textContent = (cur + 1) + ' / ' + slides.length;
  $('dfill').style.width = ((cur + 1) / slides.length * 100) + '%';
  $('dprev').disabled = cur === 0; $('dnext').disabled = cur === slides.length - 1;
  $('notesText').textContent = slides[cur].notes;
  history.replaceState(null, '', '#' + (cur + 1));
}
$('dprev').onclick = () => go(cur - 1); $('dnext').onclick = () => go(cur + 1);
const toggleNotes = () => { const n = $('notes'), on = n.hidden; n.hidden = !on; $('dnotes').setAttribute('aria-pressed', on); };
$('dnotes').onclick = toggleNotes;
const fs = () => { const d = document.documentElement; if (!document.fullscreenElement) { if (d.requestFullscreen) d.requestFullscreen().catch(() => {}); } else document.exitFullscreen(); };
$('dfs').onclick = fs;
if (!document.documentElement.requestFullscreen) $('dfs').hidden = true;
document.addEventListener('fullscreenchange', () => $('dfs').textContent = document.fullscreenElement ? 'Exit full screen' : 'Full screen');
addEventListener('keydown', (e) => {
  if (e.altKey || e.ctrlKey || e.metaKey) return;
  if (['ArrowRight', 'PageDown', ' '].includes(e.key) && !e.target.closest('button,a')) { e.preventDefault(); go(cur + 1); }
  else if (['ArrowRight', 'ArrowDown'].includes(e.key)) { e.preventDefault(); go(cur + 1); }
  else if (['ArrowLeft', 'PageUp', 'ArrowUp'].includes(e.key)) { e.preventDefault(); go(cur - 1); }
  else if (e.key === 'Home') go(0); else if (e.key === 'End') go(slides.length - 1);
  else if (e.key === 'f' || e.key === 'F') fs();
  else if (e.key === 'n' || e.key === 'N') toggleNotes();
});
stage.addEventListener('click', (e) => { if (e.target.closest('a,button')) return; go(cur + (e.clientX > innerWidth / 3 ? 1 : -1)); });
let tx = null; stage.addEventListener('touchstart', (e) => { tx = e.touches[0].clientX; }, { passive: true });
stage.addEventListener('touchend', (e) => { if (tx == null) return; const dx = e.changedTouches[0].clientX - tx; if (Math.abs(dx) > 50) go(cur + (dx < 0 ? 1 : -1)); tx = null; }, { passive: true });
setInterval(() => { const s = Math.floor((Date.now() - t0) / 1000); $('timer').textContent = Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0') + ' elapsed · aim for 5 to 7 minutes'; }, 1000);
/* fit a 16:9 stage to any screen */
const fit = () => { const k = Math.min(innerWidth / 1600, (innerHeight - 64) / 900); stage.style.transform = `translate(-50%,-50%) scale(${k})`; };
addEventListener('resize', fit); fit();
go((parseInt(location.hash.slice(1), 10) || 1) - 1);
})();
