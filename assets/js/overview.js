/* One-page overview: a single US Letter page for internal champions and review committees. Built from content.js. */
(function () {
'use strict';
const X = window.BX; if (!X) return;
const { B, $, esc, money, tierLabel } = X;
const m = (id) => X.metric(id);
const stat = (id) => { const x = m(id); return x ? `<div><b>${esc(x.display)}</b><span>${esc(x.label)}</span><small>${esc(x.period)}</small></div>` : ''; };
const docs = B.documents.map((d) => `${esc(d.label)}${d.value ? ' ' + esc(d.value) : ''} <em>(${esc(B.documentStatus[d.availability].toLowerCase())})</em>`).join('; ');
const lo = B.tiers[0], hi = B.tiers[B.tiers.length - 1];
$('doc').innerHTML = `<section class="page one">
 <header class="oh"><div><p class="k">One-page overview · ${esc(B.goals.season)}</p><h1><img class="omono" src="assets/brand/monogram.svg" alt="">${esc(B.org.name)}</h1><p class="opos">${esc(B.org.positioning)}</p></div>
 <dl class="oid"><div><dt>Status</dt><dd>${esc(B.org.taxStatus.label)}</dd></div><div><dt>EIN</dt><dd>${esc(B.org.taxStatus.ein)}</dd></div><div><dt>Founded</dt><dd>${esc(B.org.founded)}, Washington, DC</dd></div><div><dt>Contact</dt><dd>${esc(B.org.email)}</dd></div></dl></header>
 <p class="lede">${esc(B.org.differentiator)} BRIDGE trains college students as Impact Scholars, who plan and lead career, civic and community programs and bring younger students from DC schools onto campuses and into professional rooms.</p>
 <div class="ogrid">
  <div><h3>Three tracks</h3><ul class="ol">${B.portfolios.map((p) => `<li><b style="--c:${p.color}">${esc(p.name)}</b> ${esc(p.purpose)}</li>`).join('')}</ul></div>
  <div><h3>Documented so far</h3><div class="ostats">${['apps', 'fellows', 'supporters', 'policy'].map(stat).join('')}</div></div>
 </div>
 <div class="ogrid">
  <div><h3>Spring 2027</h3><p class="ot">${B.programs.length} planned programs, January to April, plus Friday school visits. ${esc(B.programs.filter((p) => p.type === 'career').map((p) => p.n).join(', '))}, community nights, Black History Week and a college tour day.</p>
   <h3>The ask</h3><p class="ot">A ${money(B.goals.amount)} season goal, built as ${esc(B.goals.builtAs)}. Partnerships from ${tierLabel(lo)} to ${tierLabel(hi)}, unrestricted or for one program, plus mentors, volunteers and in-kind support. Gifts of $5,000 and up start with a conversation.</p></div>
  <div><h3>Governance and documents</h3><p class="ot">${esc(B.org.legal)} ${esc(B.org.governance.summary)}</p><p class="ot sm"><b>Documents:</b> ${docs}.</p></div>
 </div>
 <div class="oprinc"><h3>How partnership works</h3><p class="ot sm">${B.principles.map(esc).join(' ')}</p></div>
 <footer class="ofoot"><span>${esc(B.org.email)}</span><span>Explore: ${esc((B.site.officialDomain || B.site.url).replace(/^https?:\/\//, ''))}</span><span>Figures reviewed ${esc(B.site.contentReviewed)}. Each carries its own reporting period.</span></footer>
</section>`;
X.binds();
$('pprint').onclick = () => window.print();
document.documentElement.classList.add('ready');
})();
