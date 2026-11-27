/* Partner Express: the 90-second executive view. Reads the same content.js as the full ride. */
(function () {
'use strict';
const X = window.BX; if (!X) return;
const { B, $, esc, money, tierLabel, PF, giveUrl } = X;

/* small bound facts */
document.querySelectorAll('[data-metric]').forEach((el) => { const m = X.metric(el.dataset.metric); if (m) el.textContent = m.display + ' ' + m.label + ' (' + m.period + ')'; });
$('progCount').textContent = B.programs.length;
document.querySelectorAll('[data-bind-note=programs]').forEach((el) => el.textContent = B.programStatusNote);

/* the gap, compact */
$('xgap').innerHTML = B.gapStats.map((g) => g.bars
  ? `<li><b>${g.bars.map(([, v]) => v + '%').join(' vs ')}</b><span>${esc(g.title)}: ${g.bars.map(([l, v]) => esc(l) + ' ' + v + '%').join(', ')}. <a href="${esc(g.url)}" target="_blank" rel="noopener">Source</a></span></li>`
  : `<li><b>${esc(g.value)}</b><span>${esc(g.text)} <a href="${esc(g.url)}" target="_blank" rel="noopener">Source</a></span></li>`).join('');

/* model route */
$('xroute').innerHTML = B.model.map((s) => `<li class="k-${s.kind}${s.line ? ' l-' + s.line : ''}"><i aria-hidden="true"></i><b>${esc(s.short)}</b><span>${esc(s.text)}</span></li>`).join('');

/* past programs + relationships */
$('xpast').innerHTML = B.pastPrograms.map((p) => `<li><b>${esc(p.n)}</b>, ${esc(p.where)}</li>`).join('');
const relPick = ['recognition', 'collaborator', 'venue', 'school', 'university'];
$('xrel').innerHTML = B.relationships.filter((r) => relPick.includes(r.type) && r.items.length).map((r) => `<li><b>${esc(r.label)}:</b> ${r.items.map(esc).join(', ')}</li>`).join('');

/* priorities */
$('xcost').innerHTML = B.costAreas.map((c) => `<li><b>${esc(c.name)}</b><span>${esc(c.text)}</span>${c.equivalency ? `<em>${esc(c.equivalency)}</em>` : ''}</li>`).join('');

/* tiers table */
$('xtiers').innerHTML = `<div class="xtr xth" role="row"><span role="columnheader">Level</span><span role="columnheader">Contribution</span><span role="columnheader">Highlights</span><span role="columnheader"><span class="vh">Action</span></span></div>` + B.tiers.map((t) => {
  const hi = t.benefits.filter((b) => !/^Everything in/.test(b)).slice(0, 2).join('; ');
  const act = t.online ? `<a class="btn solid" href="${esc(giveUrl(t.amount))}" target="_blank" rel="noopener">Give ${tierLabel(t)}</a>` : `<a class="btn" data-href="talk" href="#">Start a conversation</a>`;
  return `<div class="xtr" role="row"><span role="cell"><b>${esc(t.name)}</b></span><span role="cell" class="xamt">${tierLabel(t)}</span><span role="cell">${esc(hi)}</span><span role="cell">${act}</span></div>`;
}).join('');
X.binds($('xtiers'));
$('xtiernote').textContent = B.tierNote;
$('xways').innerHTML = B.supportTypes.map((s) => `<li>${esc(s.name)}</li>`).join('');

/* express line progress */
const stops = [...document.querySelectorAll('#xline a')], secs = stops.map((a) => document.querySelector(a.getAttribute('href')));
const upd = () => {
  let k = 0; secs.forEach((s, i) => { if (s.getBoundingClientRect().top < innerHeight * 0.45) k = i; });
  stops.forEach((a, i) => { a.parentElement.classList.toggle('on', i <= k); if (i === k) a.setAttribute('aria-current', 'location'); else a.removeAttribute('aria-current'); });
};
addEventListener('scroll', upd, { passive: true }); upd();

/* interest form */
const f = $('xform');
$('xInterest').insertAdjacentHTML('beforeend', ['Becoming a partner', 'Supporting a specific program', 'Unrestricted support', 'Mentoring or volunteering', 'In-kind support', 'Making an introduction', 'Something else'].map((x) => `<option>${esc(x)}</option>`).join(''));
$('xRange').insertAdjacentHTML('beforeend', PF.ranges.map((x) => `<option>${esc(x)}</option>`).join(''));
let data = null;
f.addEventListener('submit', (e) => {
  e.preventDefault();
  const g = (n) => f.elements[n].value.trim(), miss = [];
  [['org', 'organization'], ['name', 'your name'], ['email', 'email']].forEach(([n, l]) => { const bad = !g(n) || (n === 'email' && !PF.validEmail(g(n))); f.elements[n].setAttribute('aria-invalid', bad); if (bad) miss.push(n === 'email' && g(n) ? 'a valid email address' : l); });
  if (miss.length) { $('xerr').hidden = false; $('xerr').textContent = 'Please add ' + miss.join(', ') + '.'; f.querySelector('[aria-invalid=true]').focus(); return; }
  $('xerr').hidden = true;
  data = { source: 'Partner Express', org: g('org'), name: g('name'), title: g('title'), email: g('email'), range: g('range'), interests: g('interest') ? [g('interest')] : [], comments: g('comments') };
  $('xsum').innerHTML = PF.html(data);
  $('xsend').textContent = B.form.endpoint ? 'Send to BRIDGE' : 'Send by email';
  $('xnote').textContent = B.form.endpoint ? 'Sends this directly to the BRIDGE team.' : 'Opens a ready-to-send email to ' + B.org.email + '. Nothing is sent until you press send in your email.';
  $('xstate').textContent = '';
  f.querySelector('.xf-fields').hidden = true; $('xreview').hidden = false; $('xreview').focus();
});
$('xedit').addEventListener('click', () => { $('xreview').hidden = true; f.querySelector('.xf-fields').hidden = false; f.elements.org.focus(); });
$('xsend').addEventListener('click', async () => {
  if (!data) return;
  if (!B.form.endpoint) { PF.mailModal(PF.subject(data), PF.text(data)); return; }
  const b = $('xsend'); b.disabled = true; $('xstate').textContent = 'Sending…';
  const r = await PF.submit(data);
  if (r.ok) { $('xstate').textContent = 'Received. Your message reached the BRIDGE team, and we will reply by email.'; b.textContent = 'Sent'; }
  else { b.disabled = false; $('xstate').textContent = 'That did not go through. Nothing was sent.'; PF.mailModal(PF.subject(data), PF.text(data), 'The form could not reach BRIDGE, so nothing was sent. Send it by email instead:'); }
});
})();
