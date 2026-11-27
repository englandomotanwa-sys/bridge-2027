/* Prospectus: a standalone, print-ready document built from content.js.
   prospectus.html            -> the standard prospectus (also rendered to downloads/*.pdf by tools/build-prospectus.py)
   prospectus.html?proposal=1 -> adds a custom proposal page from the partnership builder (stored in this browser only) */
(function () {
'use strict';
const X = window.BX; if (!X) return;
const { B, $, esc, money, tierLabel } = X;
const T = B.programTypes;
const proposal = /[?&]proposal=1/.test(location.search) ? X.PF.loadProposal() : null;
const safeImg = (f) => !(B.photos[f] && B.photos[f].minors);   // keep photos of younger students out of a forwardable document
const date = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
const foot = (n) => `<footer class="pf"><span><img class="fmono" src="assets/brand/monogram.svg" alt="">BRIDGE the District · Partnership Prospectus 2027</span><span>${esc(B.org.email)}</span><span>${n}</span></footer>`;
const ms = (ids) => ids.map((id) => X.metric(id)).filter(Boolean);
let pg = 0;
const page = (cls, body) => { pg++; return `<section class="page ${cls}">${body}${cls.includes('cover') ? '' : foot(pg)}</section>`; };

const pages = [];
/* 1. cover */
pages.push(page('cover', `<img class="cimg" src="${safeImg('group.jpg') ? 'group.jpg' : 'cohort.jpg'}" alt="">
  <div class="cbody"><div class="clock"><img src="assets/brand/monogram-reversed.svg" alt=""><span><b>BRIDGE</b> the District</span></div><p class="ck">${proposal ? 'Partnership proposal' : 'Partnership prospectus'} · ${esc(B.brand.campaign)} · ${esc(B.brand.campaignSeason)}</p>
  <h1>Come into the room.<br><em>Build it with us.</em></h1>
  <p class="csub">${esc(B.org.name)} · ${esc(B.org.positioning)}</p>
  ${proposal && proposal.org ? `<p class="cfor">Prepared for <b>${esc(proposal.org)}</b></p>` : ''}
  <p class="cmeta">${esc(date)} · ${esc(B.org.email)}</p></div>
  <div class="cline" aria-hidden="true"></div>`));

/* custom proposal page */
if (proposal) {
  pages.push(page('', `<p class="k">Proposed partnership · ID ${esc(proposal.proposalId || '')}</p><h2>A partnership proposal for ${esc(proposal.org || 'your organization')}.</h2>
  <p class="lede"><b>Status: proposal only.</b> This is a starting point for a conversation. It is not an agreement, nothing is reserved, and no payment has been made. Titles and benefits below are proposed and become final only when BRIDGE confirms them in writing.</p>
  ${X.PF.html(proposal)}
  ${proposal.benefits && proposal.benefits.length ? `<h3>Proposed benefits</h3><ul class="facts">${proposal.benefits.map((b) => `<li>${esc(b)}</li>`).join('')}</ul>` : ''}
  ${proposal.notes && proposal.notes.length ? `<p class="small">${proposal.notes.map(esc).join(' ')}</p>` : ''}
  <h3>What happens next</h3><ol class="steps"><li>Send this proposal to ${esc(B.org.email)} and quote the proposal ID.</li><li>We confirm availability, recognition and timing with you, and send a written confirmation.</li><li>Payment follows confirmation, so your designation is recorded first.</li></ol>
  <p class="small">Generated ${esc(new Date(proposal.savedAt).toLocaleString('en-US'))}. If you changed your selections after this time, generate the proposal again from the builder.</p>`));
}

/* 2. executive summary + the problem */
pages.push(page('', `<p class="k">1 · Executive summary</p><h2>Opportunity should not depend on who you already know.</h2>
 <p class="lede">BRIDGE the District connects students to the people, institutions, resources and experiences that make opportunity tangible. Through college-student leadership, community partnerships and intentional professional exposure, we are building a more connected educational ecosystem across Washington, DC.</p>
 <div class="two"><div><h3>At a glance</h3><ul class="facts">
  <li><b>Who we are</b>A student-powered ${esc(B.org.taxStatus.label)} in ${esc(B.org.city)}, founded in ${esc(B.org.founded)}. EIN ${esc(B.org.taxStatus.ein)}.</li>
  <li><b>Mission</b>${esc(B.org.mission)}</li>
  <li><b>Model</b>College students train as Impact Scholars, then design and lead programs and bring younger students along.</li>
  <li><b>2027 season</b>${B.programs.length} planned programs, January to April. Season goal: ${money(B.goals.amount)}.</li>
 </ul></div>
 <div><h3>2 · The problem</h3><p>DC is full of open doors. Not every student gets to walk through them.</p><ul class="gaps">${B.gapStats.map((g) => g.bars ? `<li><b>${g.bars.map(([, v]) => v + '%').join(' vs ')}</b><span>${esc(g.title)}: ${g.bars.map(([l, v]) => esc(l) + ' ' + v + '%').join(', ')}.<small>${esc(g.source)}</small></span></li>` : `<li><b>${esc(g.value)}</b><span>${esc(g.text)}<small>${esc(g.source)}</small></span></li>`).join('')}</ul></div></div>
 <p class="pull">We are not simply bringing students into rooms. We are changing who gets access to those rooms in the first place.</p>`));

/* 3. model + accomplishments */
pages.push(page('', `<p class="k">3 · Our distinctive model</p><h2>One investment. Two lines of opportunity.</h2>
 <ol class="route">${B.model.map((s) => `<li class="k-${s.kind}${s.line ? ' l-' + s.line : ''}"><i></i><b>${esc(s.short)}</b><span>${esc(s.text)}</span></li>`).join('')}</ol>
 <p class="small">Solid stations describe established activity. The dashed terminal is an intended long-term outcome, not a claimed result.</p>
 <div class="fbw"><div><b>For students.</b> Every program is designed so a student leaves with a contact, a skill and a next step.</div><div><b>By students.</b> Impact Scholars plan the programs, recruit speakers, write materials and host the room.</div><div><b>With students.</b> Students moderate, sit on panels and work beside professionals.</div></div>
 <p class="k" style="margin-top:22px">4 · Documented accomplishments</p>
 <div class="mgrid">${ms(['apps', 'fellows', 'supporters', 'goalpct', 'policy', 'speakers']).map((m) => `<div><b>${esc(m.display)}</b><span>${esc(m.label)}</span><small>${esc(m.period)}</small></div>`).join('')}</div>
 <p class="small">Fall 2026 programs: ${B.pastPrograms.map((p) => esc(p.n) + ' (' + esc(p.where) + ')').join('; ')}. ${esc(B.impactNotes.outcomes)}</p>
 <div class="strip"><img src="rtr_all.jpg" alt=""><img src="policy_room.jpg" alt=""><img src="cohort.jpg" alt=""></div>`));

/* institutional readiness */
pages.push(page('', `<p class="k">5 · Built to last</p><h2>Student-powered. Institutionally grounded.</h2>
 <div class="two"><div><h3>Standing and governance</h3><p class="small">${esc(B.org.legal)} Recognized as a ${esc(B.org.taxStatus.label)}: ${esc(B.org.taxStatus.detail)} EIN ${esc(B.org.taxStatus.ein)}.</p><p class="small">${esc(B.org.governance.summary)}</p>
 <h3>Three tracks</h3><ul class="facts">${B.portfolios.map((p) => `<li><b>${esc(p.name)}</b>${esc(p.purpose)} ${p.seats} planned spring seats.</li>`).join('')}</ul></div>
 <div><h3>Built for continuity</h3><ul class="cont">${B.continuity.map((c) => `<li><b>${esc(c.name)}${c.status === 'in-place' ? '' : ' <em>(being built)</em>'}</b>${esc(c.text.split('. ')[0].replace(/\.$/, ''))}.</li>`).join('')}</ul></div></div>
 <h3>How we measure</h3><div class="two"><div><p class="small"><b>In place now:</b> ${B.measurement.current.map(esc).join('; ')}.</p></div><div><p class="small"><b>Starting spring 2027:</b> ${B.measurement.planned.map(esc).join('; ')}. ${esc(B.measurement.plannedNote)}</p></div></div>`));

/* 4. spring programming */
pages.push(page('', `<p class="k">6 · Spring 2027 programming</p><h2>The BRIDGE Line: ${B.programs.length} programs, January to April.</h2>
 <table class="ptab"><thead><tr><th>Date</th><th>Program</th><th>Who it serves</th><th>Partnership makes possible</th></tr></thead><tbody>
 ${B.programs.map((p) => `<tr><td class="d">${esc(p.d)}</td><td><b>${esc(p.n)}</b><small style="--c:${T[p.type].color}"><i></i>${esc(T[p.type].label)} · ${esc(B.programStatus[p.status])}</small></td><td>${esc(p.audience)}</td><td>${esc(p.makesPossible)}</td></tr>`).join('')}
 </tbody></table><p class="small">${esc(B.programStatusNote)}</p>`));

/* 5. partnership opportunities */
pages.push(page('', `<p class="k">7 · Partnership opportunities</p><h2>Invest in the system, not just the event.</h2>
 <p class="lede">Three tracks: fund one program, the spring season, or the institution. Each package is chosen on purpose. Unrestricted gifts are welcome at any amount.</p>
 <p class="k" style="margin-top:18px">Proposed partnership packages</p>
 <table class="ttab"><tbody>${B.tiers.map((t) => `<tr><td class="amt">${tierLabel(t)}</td><td><b>${esc(t.name)}</b><span>${esc(B.tracks[t.track].label)}: ${esc(t.blurb)}</span></td><td>${t.benefitIds.filter((id) => id !== 'ack').map((id) => esc(B.benefits[id].short)).join('<br>')}</td></tr>`).join('')}<tr><td class="amt">Any</td><td><b>${esc(B.unrestricted.name)}</b><span>No title</span></td><td>${esc(B.unrestricted.text)}</td></tr></tbody></table>
 <p class="small">${esc(B.tierNote)}</p>
 <p class="small"><b>Other ways to partner:</b> ${B.supportTypes.map((s) => esc(s.name)).join(' · ')}.</p>
 `));

/* partnership rules: benefits, limits and what happens if a program changes */
pages.push(page('', `<p class="k">8 · How partnership works</p><h2>Clear terms, before anything is promised.</h2>
 <div class="two"><div><h3>How packages combine</h3><ul class="facts"><li><b>Titles</b>A title comes only from the package you choose. Totals never become titles: five $500 program sponsorships are five program sponsorships.</li><li><b>Stacking</b>Program benefits are delivered per program. Season and partnership benefits are delivered once.</li><li><b>Limited benefits</b>Named moments and presenting acknowledgment are limited and confirmed in writing.</li><li><b>Payment</b>Unrestricted gifts can be given online. Designated support is confirmed first so the designation is recorded.</li></ul>
 <h3>Founding Rider</h3><ul class="facts">${B.foundingRules.map((x) => `<li>${esc(x)}</li>`).join('')}</ul></div>
 <div><h3>Program independence</h3><ul class="facts">${B.principles.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>
 <h3>If a program changes</h3><p class="small">${esc(B.changePolicy)}</p>
 <h3>From interest to partnership</h3><p class="small">${B.lifecycle.map(esc).join(' → ')}</p></div></div>`));

/* 6. pathways + contact */
pages.push(page('', `<p class="k">9 · Industry-specific engagement</p><h2>Find the line your industry already runs on.</h2>
 <div class="pws">${B.pathways.map((p) => `<div style="--c:${p.color}"><h3><span class="bul">${esc(p.code)}</span>${esc(p.name)}<em>${p.status === 'existing' ? 'Running now' : 'Proposed'}</em></h3><p>${esc(p.focus)}</p><small>${esc(p.looks.join(' · '))}</small></div>`).join('')}</div>
 <div class="contactbox"><div><p class="k">10 · Contact and next steps</p><h3>Let's build it together.</h3><ol><li>Choose a program, a level, or unrestricted support.</li><li>Set a planning conversation with our team.</li><li>Introduce us to a colleague who should be in the room.</li></ol></div>
 <div class="cinfo"><b>${esc(B.org.email)}</b><span>${esc(B.org.leadership[0].name)}, ${esc(B.org.leadership[0].role)}</span><span>Give online: ${esc(B.links.give.replace(/^https?:\/\//, ''))}</span><span>Explore: ${esc((B.site.officialDomain || B.site.url).replace(/^https?:\/\//, ''))}</span><span>${esc(B.org.name)} is a ${esc(B.org.taxStatus.label)}. ${esc(B.org.taxStatus.detail)}</span></div></div>`));

$('doc').innerHTML = pages.join('');
X.binds();
if (proposal) { $('pmode').textContent = 'Custom proposal' + (proposal.org ? ' for ' + proposal.org : ''); $('pdl').hidden = true; document.title = 'BRIDGE partnership proposal' + (proposal.org ? ' · ' + proposal.org : ''); }
else if (/[?&]proposal=1/.test(location.search)) { $('pmode').textContent = 'No current proposal found in this browser (proposals clear when selections change and expire after 7 days). Showing the standard prospectus.'; }
$('pprint').onclick = () => window.print();
document.documentElement.classList.add('ready');
})();
