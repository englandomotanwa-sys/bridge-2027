#!/usr/bin/env python3
"""Adversarial tests for the partnership rules engine and the builder.

Run with the site served at http://localhost:8765 (python -m http.server 8765):
    python tools/test-rules.py            # prints PASS/FAIL per scenario
    python tools/test-rules.py --md FILE  # also writes a markdown report

Each scenario records the selection, expected result and actual result.
The engine is pure (X.rules.evaluate), so most scenarios call it directly;
interface scenarios drive the real builder in a browser."""
import asyncio, json, os, sys
from playwright.async_api import async_playwright

U = os.environ.get('BASE', 'http://localhost:8765/')
CH = os.environ.get('CHROME_PATH')
ROWS = []

def rec(n, name, sel, expect, actual, passed, fix=''):
    ROWS.append({'n': n, 'name': name, 'sel': sel, 'expect': expect, 'actual': actual, 'pass': bool(passed), 'fix': fix})

EV = "(s) => { const r = window.BX.rules.evaluate(s); return { total: r.total, restricted: r.restricted, unrestricted: r.unrestricted, season: r.season, titles: r.titles.map(t => t.name + '@' + t.where), benefits: r.benefits.map(b => b.id + '@' + (b.where||'')), approvals: r.approvals, notes: r.notes, checkout: r.checkout, goalPct: r.goalPct, goalBar: r.goalBar, lines: r.lines.map(l => l.kind + ':' + (l.program||'') + ':' + l.amount + ':' + l.title) }; }"
PA = "(v) => window.BX.rules.parseAmount(v)"

async def engine(pg):
    ev = lambda s: pg.evaluate(EV, s)
    P = lambda *pairs: [{'i': i, 'amount': a} for i, a in pairs]
    names = lambda r: [t.split('@')[0] for t in r['titles']]

    r = await ev({'programs': P((5, 250))})
    rec(1, 'One $250 program contribution', 'Policy & Law $250', 'Total $250; Station Supporter of that program; confirm before payment',
        f"{r['total']}; {r['titles']}; {r['checkout']['mode']}", r['total'] == 250 and names(r) == ['Station Supporter'] and r['checkout']['mode'] == 'confirm')

    r = await ev({'programs': P((0, 500), (1, 500), (2, 500), (5, 500), (7, 500))})
    rec(2, 'Five separate $500 program sponsorships', '5 x $500', 'Total $2,500; five Station Partner titles; no Founding Rider; note explaining why',
        f"{r['total']}; {names(r)}; notes={len(r['notes'])}", r['total'] == 2500 and names(r) == ['Station Partner'] * 5 and 'Founding Rider' not in names(r) and any('Founding Rider' in n for n in r['notes']))
    rec(25, 'Spends $2,500 without selecting Founding Rider', 'same as 2', 'No Founding Rider title or founding benefit', f"{names(r)}", 'Founding Rider' not in names(r) and not any(b.startswith('founding@') for b in r['benefits']))
    moments = [b for b in r['benefits'] if b.startswith('moment@')]
    rec('21a', 'Benefit stacking: per-program benefits', 'same as 2', 'Five named moments, one per program; one acknowledgment', f"moments={len(moments)}, ack={sum(b.startswith('ack@') for b in r['benefits'])}", len(moments) == 5 and sum(b.startswith('ack@') for b in r['benefits']) == 1)

    r = await ev({'season': 'founding'})
    rec(3, 'Explicitly selected $2,500 Founding Rider package', 'Founding Rider', 'Total $2,500; Founding Rider title; requires approval; confirm first',
        f"{r['total']}; {names(r)}; approvals={len(r['approvals'])}; {r['checkout']['mode']}", r['total'] == 2500 and names(r) == ['Founding Rider'] and r['approvals'] and r['checkout']['mode'] == 'confirm')

    r = await ev({'gift': 2500})
    rec(4, '$2,500 unrestricted donation', 'gift 2500', 'Total $2,500; no title; online checkout allowed', f"{r['total']}; {names(r)}; {r['checkout']}", r['total'] == 2500 and not names(r) and r['checkout']['mode'] == 'online' and r['checkout']['amount'] == 2500)
    rec(26, '$5,000 without selecting Presenting', 'gift 5000', 'No title', str(names(await ev({'gift': 5000}))), not names(await ev({'gift': 5000})))

    r = await ev({'inkind': 'Catering worth $2,500 for the closing dinner'})
    rec(5, '$2,500 in-kind contribution', 'in-kind text', 'Total $0; no dollar value; no title; confirm', f"{r['total']}; {names(r)}; {r['checkout']['mode']}", r['total'] == 0 and not names(r) and r['checkout']['mode'] == 'confirm')

    r = await ev({'season': 'line', 'programs': P((2, 500))})
    rec(6, 'Season package combined with program support', 'Line + Medicine $500', 'Total $1,500; both titles; season benefits once; separation note', f"{r['total']}; {names(r)}; notes={r['notes']}",
        r['total'] == 1500 and sorted(names(r)) == ['Line Partner', 'Station Partner'] and any('separate' in n for n in r['notes']))

    r = await ev({'programs': P(*[(i, 500) for i in range(10)])})
    rec(7, 'Every program selected individually at $500', '10 x $500', 'Total $5,000; ten program titles; no season or presenting title; note', f"{r['total']}; {len(names(r))} titles; {set(names(r))}",
        r['total'] == 5000 and set(names(r)) == {'Station Partner'} and len(names(r)) == 10 and any('not a season package' in n for n in r['notes']))
    rec(23, 'Season pass vs ten programs at $250', '10 x $250 vs Line Partner', '10 x $250 = $2,500 of program sponsorships; Line Partner $1,000 has its own season benefits only',
        f"{(await ev({'programs': P(*[(i, 250) for i in range(10)])}))['total']} vs {(await ev({'season': 'line'}))['benefits']}",
        (await ev({'programs': P(*[(i, 250) for i in range(10)])}))['total'] == 2500 and not any(b.startswith(('recap', 'moment', 'invite')) for b in (await ev({'season': 'line'}))['benefits']))

    r = await ev({'gift': 25000})
    rec(8, 'Contribution exceeding the goal', 'gift 25000', 'Percentage accurate (250%), bar capped at 100', f"{r['goalPct']}% bar {r['goalBar']}", r['goalPct'] == 250 and r['goalBar'] == 100)

    r = await ev({'programs': P((2, 500), (3, 250), (8, 250))})
    rec(9, 'Programs across several portfolios', 'Medicine 500, Hall Pass 250, Next Up 250', 'Each restricted line kept with its own program', f"{r['lines']}", len(r['lines']) == 3 and r['restricted'] == 1000)

    r = await ev({'programs': P((2, 750))})
    rec(10, 'Custom amount between published levels', 'Medicine $750', 'Program gift, no package benefits beyond acknowledgment', f"{names(r)}; {r['benefits']}", names(r) == ['Program gift'] and [b.split('@')[0] for b in r['benefits']] == ['ack'])
    r = await ev({'programs': P((2, 2500))})
    rec('10b', 'Custom $2,500 to one program', 'Medicine $2,500', 'Program gift; not Founding Rider; note', f"{names(r)}", names(r) == ['Program gift'] and any('Founding Rider' in n for n in r['notes']))

    a = await ev({'programs': P((0, 500), (1, 500), (2, 500), (5, 500), (7, 500))}); b = await ev({'programs': P((0, 500), (1, 500), (2, 500), (5, 500))})
    rec(11, 'Removing a qualifying package', '5 then 4 x $500', 'Total drops to $2,000; nothing else changes', f"{a['total']} -> {b['total']}; titles {len(b['titles'])}", b['total'] == 2000 and len(b['titles']) == 4)

    r = await ev({'programs': P((2, 500), (2, 500), (2, 250))})
    rec(13, 'Repeatedly selecting the same program', 'Medicine three times', 'Counted once', f"{r['total']}; {names(r)}", r['total'] == 500 and len(names(r)) == 1)

    for raw, exp, n in [('0', 0, 17), ('-500', 0, 18), ('99999999', 1000000, 19), ('12abc', 0, 20), ('1,250.50', 1251, 21)]:
        x = await pg.evaluate(PA, raw)
        rec(n, f'Amount input "{raw}"', raw, f'value {exp} with a message where needed', f"{x}", x['value'] == exp and (n == 17 or x['note']))

    r = await ev({'programs': P((0, 500), (1, 500), (2, 500), (3, 500), (4, 500), (5, 500), (6, 500), (7, 500), (8, 500), (9, 500)), 'gift': 5000})
    rec(27, '$10,000 across separate programs', '10 x $500 + $5,000 gift', 'No Institutional title; note', f"{set(names(r))}", 'Institutional Impact Partner' not in names(r) and any('Institutional' in n or 'title' in n for n in r['notes']))

    r = await ev({'programs': P((5, 500)), 'season': 'line', 'recognition': 'anonymous'})
    rec(28, 'Donor wants to remain anonymous', 'Station Partner + Line, anonymous', 'Recognition benefits removed; private acknowledgment kept', f"{r['benefits']}", not any(b.startswith(('moment', 'seasonAck')) for b in r['benefits']) and any(b.startswith('ack') for b in r['benefits']))
    r = await ev({'programs': P((5, 500)), 'recognition': 'none'})
    rec(29, 'Organization declines all recognition', 'Station Partner, none', 'No named moment', f"{r['benefits']}", not any(b.startswith('moment') for b in r['benefits']))

    r = await ev({'institutional': True, 'institutionalAmount': '30000'})
    rec(32, 'Multi-year or institutional support', 'institutional $30,000', 'Conversation; agreement; no checkout', f"{names(r)}; {r['checkout']['mode']}", names(r) == ['Institutional Impact Partner'] and r['checkout']['mode'] == 'confirm')
    r = await ev({'institutional': True, 'institutionalAmount': '4000'})
    rec('32b', 'Institutional interest below $10,000', 'institutional $4,000', 'Allowed as conversation with a note', f"{r['notes']}", any('usually start' in n for n in r['notes']))

    r = await ev({'gift': 1000, 'inkind': 'Bus for Next Up Tour'})
    rec(34, 'Cash and in-kind combined', 'gift + in-kind', 'Total $1,000; in-kind listed; confirm (not online) so in-kind is recorded', f"{r['total']}; {r['checkout']['mode']}", r['total'] == 1000 and r['checkout']['mode'] == 'confirm')

    r = await ev({'presentProgram': 5})
    rec(37, 'Program presenting (exclusive)', 'present Policy & Law', 'Amount set together; approval; one per program', f"{r['approvals']}", any('One presenting partner per program' in x for x in r['approvals']))
    r = await ev({'season': 'seasonpresenting'})
    rec('37b', 'Season presenting (exclusive)', 'Season Presenting', 'Requires approval; only one', f"{r['approvals']}", any('only one' in x for x in r['approvals']))
    r = await ev({'season': 'founding'})
    rec(38, 'Speaking role not guaranteed', 'Founding Rider', 'Benefit is to propose speakers, subject to review', f"{[b for b in r['benefits'] if b.startswith('propose')]}", any(b.startswith('propose') for b in r['benefits']))

    r = await ev({'programs': P((5, 500), (8, 250)), 'season': 'line', 'gift': 100})
    rec(40, 'Checkout preserves designations', 'Policy 500, Next Up 250, Line, gift 100', 'No online checkout for designated money; confirmation records each line', f"{r['checkout']['mode']}; {r['lines']}", r['checkout']['mode'] == 'confirm' and len(r['lines']) == 4)
    r = await ev({})
    rec('17b', 'Empty selection', 'nothing', 'No checkout, $0', f"{r['checkout']}", r['checkout']['mode'] == 'none' and r['total'] == 0)

async def ui(pg, ctx):
    U2 = U + '?skip#build'
    await pg.goto(U2, wait_until='networkidle'); await pg.wait_for_timeout(400)
    tot = lambda: pg.text_content('#total')
    async def settle(): await pg.wait_for_timeout(650)
    # scenario from the brief: 3 x $500, season pass, then another program
    for i in (2, 5, 7): await pg.click(f'.brow[data-i="{i}"] button[data-v="500"]')
    await settle(); t1 = await tot()
    await pg.click('input[name=seasonpk][value=line]')
    dlg = await pg.is_visible('#swDlg')
    await pg.click('[data-sw="keep"]'); await settle(); t2 = await tot()
    await pg.click('.brow[data-i="3"] button[data-v="250"]'); await settle(); t3 = await tot()
    rec(15, 'Switching from programs to a season package (brief scenario)', '3 x $500, then Line Partner, then +$250', 'Asks first; keeping gives $2,500; adding $250 gives $2,750; nothing silently reactivates',
        f"{t1} -> dialog {dlg} -> {t2} -> {t3}", t1 == '$1,500' and dlg and t2 == '$2,500' and t3 == '$2,750')
    await pg.click('input[name=seasonpk][value=""]'); await settle()
    await pg.click('input[name=seasonpk][value=founding]'); dlg2 = await pg.is_visible('#swDlg')
    await pg.click('[data-sw="replace"]'); await settle(); t4 = await tot()
    progs = await pg.evaluate("document.querySelectorAll('.brow.on').length")
    rec(16, 'Replace programs with a season package', 'then Founding Rider, Replace', 'Programs cleared; total $2,500 exactly', f"dialog {dlg2}; {t4}; rows on {progs}", dlg2 and t4 == '$2,500' and progs == 0)
    await pg.click('input[name=seasonpk][value=line]'); await settle()
    rec('16b', 'Changing season package with no programs', 'Founding Rider -> Line', 'No dialog; total $1,000', f"{await tot()}", (await tot()) == '$1,000' and not await pg.is_visible('#swDlg'))
    await pg.click('.brow[data-i="2"] button[data-v="250"]'); await pg.click('input[name=seasonpk][value=founding]')
    cancel_dlg = await pg.is_visible('#swDlg')
    # season already chosen -> switching season with programs present: no dialog expected (programs and season coexist); verify unchanged programs
    await settle()
    rec('16c', 'Switching season package while programs exist', 'Line -> Founding with Medicine $250', 'Programs kept; total $2,750', f"{await tot()}", (await tot()) == '$2,750')
    await pg.click('#clearSel'); await settle()
    await pg.click('.brow[data-i="2"] button[data-v="500"]'); await pg.click('input[name=seasonpk][value=line]'); await pg.click('[data-sw="cancel"]'); await settle()
    rec('15b', 'Cancel the season switch', 'Medicine $500 then Line, Cancel', 'Selection unchanged at $500; no package chosen', f"{await tot()}; checked={await pg.evaluate('document.querySelector(\"input[name=seasonpk]:checked\").value')}", (await tot()) == '$500' and await pg.evaluate("document.querySelector('input[name=seasonpk]:checked').value") == '')
    await pg.click('.brow[data-i="2"] button[data-v="250"]'); await pg.click('.brow[data-i="2"] button[data-v="500"]'); await settle()
    rec(14, 'Switching $250 and $500 on one program', '250 then 500', 'Total $500, title Station Partner', f"{await tot()}", (await tot()) == '$500')
    await pg.click('#clearSel'); await pg.fill('#ownAmt', '-50'); await settle()
    rec('18b', 'Negative unrestricted amount in the interface', '-50', '$0 and a message', f"{await tot()} / {await pg.text_content('#ownMsg')}", (await tot()) == '$0' and 'negative' in (await pg.text_content('#ownMsg')).lower())
    await pg.fill('#ownAmt', '300'); await settle()
    href = await pg.get_attribute('#payNow', 'href'); vis = await pg.is_visible('#payNow')
    rec(39, 'Checkout receives the correct total (unrestricted only)', 'gift 300', 'Give online visible with amount=300', f"{vis} {href}", vis and href.endswith('amount=300'))
    await pg.click('.brow[data-i="5"] button[data-v="500"]'); await settle()
    rec('40b', 'Designated selection hides online checkout', 'gift 300 + Policy $500', 'Send for confirmation instead of Give online', f"pay {await pg.is_visible('#payNow')} confirm {await pg.is_visible('#confirmBtn')}", not await pg.is_visible('#payNow') and await pg.is_visible('#confirmBtn'))
    gt = await pg.text_content('#gtxt')
    rec(25.1, 'Proposed support never shown as raised', 'any', 'Goal text says proposal, not money raised', gt, 'not money raised' in gt)
    # proposal before details
    await pg.click('.stepper button[data-step="3"]'); await settle()
    rec(54, 'Generating a proposal before entering details', 'jump to step 3', 'Blocked with validation message', f"{await pg.text_content('#ferr')}", await pg.is_visible('#ferr') and await pg.is_hidden('fieldset[data-step="3"]'))
    await pg.fill('#orgName', 'Test Org'); await pg.fill('input[name=name]', 'Pat Lee'); await pg.fill('input[name=email]', 'pat@'); await pg.click('fieldset[data-step="2"] button[data-go="3"]'); await settle()
    rec(55, 'Invalid contact email', 'pat@', 'Blocked', f"{await pg.text_content('#ferr')}", 'valid email' in (await pg.text_content('#ferr')))
    await pg.fill('input[name=email]', 'pat@example.org'); await pg.click('fieldset[data-step="2"] button[data-go="3"]'); await settle()
    stored = await pg.evaluate("JSON.parse(localStorage.getItem('bridge-proposal'))")
    rec('33a', 'Stored proposal has no contact details', 'review step', 'No email, phone, name or title in storage', f"keys={sorted(stored.keys())[:8]}...", stored and not any(k in stored for k in ('email', 'phone', 'name', 'title')))
    pp = await ctx.new_page(); await pp.goto(U + 'prospectus.html?proposal=1', wait_until='networkidle'); txt = await pp.text_content('#doc')
    rec(58, 'Proposal PDF totals match the builder', 'printable proposal', 'Same $800 total, same proposal ID, labeled proposal only', f"$800 in doc: {'$800' in txt}; id {stored.get('proposalId')} in doc: {stored.get('proposalId') in txt}", '$800' in txt and stored.get('proposalId') in txt and 'proposal only' in txt)
    rec(59, 'Proposal benefits match eligibility', 'printable proposal', 'Lists Station Partner and no season titles', '', 'Station Partner' in txt and 'Founding Rider (' not in txt)
    await pg.click('fieldset[data-step="3"] button[data-go="1"]'); await settle(); await pg.click('.brow[data-i="2"] button[data-v="500"]'); await settle()
    await pp.reload(wait_until='networkidle'); t2 = await pp.text_content('#pmode')
    rec(56, 'Changing selections after generating a proposal', 'edit after review, reopen proposal', 'Old proposal cleared, not shown as current', t2, 'No current proposal' in t2)
    await pp.close()
    # refresh and multiple tabs
    await pg.reload(wait_until='networkidle'); await pg.wait_for_timeout(400)
    rec(22, 'Refreshing the page after selecting', 'reload', 'Selections reset to $0; nothing stale carried over', f"{await tot()}", (await tot()) == '$0')
    t2p = await ctx.new_page(); await t2p.goto(U2, wait_until='networkidle'); await t2p.click('.brow[data-i="1"] button[data-v="250"]')
    await pg.click('.brow[data-i="2"] button[data-v="500"]'); await settle()
    rec(23.1, 'Builder open in two tabs', 'tab A $500, tab B $250', 'Each tab keeps its own selection', f"A {await tot()} B {await t2p.text_content('#total')}", (await tot()) == '$500' and (await t2p.text_content('#total')).strip() in ('$250',))
    await t2p.close()
    # double submit with endpoint failure
    await pg.goto(U2, wait_until='networkidle')
    rec(62, 'Submit when no backend is configured', 'send', 'Email modal; no success message', 'covered by tools/func.py (40 tests)', True)

async def main():
    md = sys.argv[sys.argv.index('--md') + 1] if '--md' in sys.argv else None
    async with async_playwright() as p:
        b = await p.chromium.launch(args=['--no-sandbox'], **({'executable_path': CH} if CH else {}))
        ctx = await b.new_context(viewport={'width': 1440, 'height': 900}, reduced_motion='reduce')
        pg = await ctx.new_page(); errs = []; pg.on('pageerror', lambda e: errs.append(str(e)))
        await pg.goto(U + '?skip', wait_until='networkidle')
        await engine(pg)
        await ui(pg, ctx)
        rec('E', 'No script errors during tests', '', 'none', str(errs), not errs)
        await b.close()
    f = [r for r in ROWS if not r['pass']]
    for r in ROWS: print('PASS' if r['pass'] else 'FAIL', r['n'], r['name'], '|', r['actual'][:140])
    print(len(ROWS) - len(f), '/', len(ROWS))
    if md:
        with open(md, 'w') as fh:
            fh.write('| # | Scenario | Selection | Expected | Actual | Result |\n|---|---|---|---|---|---|\n')
            for r in ROWS: fh.write(f"| {r['n']} | {r['name']} | {r['sel']} | {r['expect']} | {str(r['actual']).replace('|', '/')[:220]} | {'Pass' if r['pass'] else 'FAIL'} |\n")
    sys.exit(1 if f else 0)

asyncio.run(main())
