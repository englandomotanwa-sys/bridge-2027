#!/usr/bin/env python3
"""Presentation rehearsal test: transitions, sound timing, input during transitions, fit.
Run with the site served at http://localhost:8765 (python -m http.server 8765)."""
import asyncio, json, os, sys
from playwright.async_api import async_playwright
U = os.environ.get('BASE', 'http://localhost:8765/')
CH = os.environ.get('CHROME_PATH')
R = []
def ok(n, c, x=''): R.append(('PASS' if c else 'FAIL', n, x))
COUNT = """window.__bq=0;const d=Object.getOwnPropertyDescriptor(BiquadFilterNode.prototype,'type');Object.defineProperty(BiquadFilterNode.prototype,'type',{set(v){if(v==='bandpass')window.__bq++;d.set.call(this,v)},get(){return d.get.call(this)}});"""
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(args=['--no-sandbox', '--autoplay-policy=no-user-gesture-required'], **({'executable_path': CH} if CH else {}))
        pg = await b.new_page(viewport={'width': 1366, 'height': 768})
        await pg.add_init_script(COUNT)
        await pg.goto(U + 'present.html', wait_until='networkidle')
        n = await pg.evaluate('window.__deck.count')
        ok('deck has 12 stations', n == 12, n)
        ok('sound off by default', await pg.get_attribute('#dsound', 'aria-pressed') == 'false')
        await pg.click('#dsound')
        await pg.wait_for_timeout(6000)
        ok('slide stays put with no input for 6s', await pg.evaluate('window.__deck.cur') == 0)
        ok('no whoosh while idle', await pg.evaluate('window.__deckWhoosh||0') == 0)
        await pg.keyboard.press('ArrowRight')
        await pg.wait_for_timeout(200)
        ok('whoosh starts with the train', await pg.evaluate('window.__deckWhoosh||0') == 1)
        ok('old slide still showing before the train covers it', await pg.evaluate('window.__deck.cur') == 0)
        cover = await pg.evaluate("""(()=>{const t=document.getElementById('dtrain').getBoundingClientRect(),s=document.getElementById('stage').getBoundingClientRect();return t.left<=s.left+1&&t.right>=s.right-1})()""")
        await pg.wait_for_timeout(380)
        cover = await pg.evaluate("""(()=>{const t=document.getElementById('dtrain').getBoundingClientRect(),s=document.getElementById('stage').getBoundingClientRect();return t.left<=s.left+1&&t.right>=s.right-1})()""")
        ok('train covers the whole stage at the swap', cover)
        await pg.wait_for_timeout(800)
        ok('advanced exactly one slide', await pg.evaluate('window.__deck.cur') == 1)
        ok('exactly one whoosh per move', await pg.evaluate('window.__deckWhoosh') == 1)
        ok('train gone after transition', await pg.evaluate("getComputedStyle(document.getElementById('dtrain')).display") == 'none')
        # rapid input during transition
        for _ in range(4): await pg.keyboard.press('ArrowRight')
        await pg.wait_for_timeout(1500)
        ok('rapid presses during a transition move one slide', await pg.evaluate('window.__deck.cur') == 2, await pg.evaluate('window.__deck.cur'))
        ok('one whoosh for the rapid presses', await pg.evaluate('window.__deckWhoosh') == 2)
        await pg.keyboard.press('ArrowLeft'); await pg.wait_for_timeout(1500)
        ok('back navigation works', await pg.evaluate('window.__deck.cur') == 1)
        await pg.keyboard.press('m'); await pg.keyboard.press('ArrowRight'); await pg.wait_for_timeout(1500)
        ok('muted: no whoosh on move', await pg.evaluate('window.__deckWhoosh') == 3)
        await pg.click('#dlist'); await pg.click('#stations button[data-i="9"]'); await pg.wait_for_timeout(1500)
        ok('station list jumps directly', await pg.evaluate('window.__deck.cur') == 9)
        await pg.keyboard.press('Home'); await pg.wait_for_timeout(1500)
        ok('Home restarts', await pg.evaluate('window.__deck.cur') == 0)
        await pg.keyboard.press('End'); await pg.wait_for_timeout(1500)
        ok('End goes to last', await pg.evaluate('window.__deck.cur') == 11)
        await pg.reload(wait_until='networkidle')
        ok('refresh keeps the slide', await pg.evaluate('window.__deck.cur') == 11)
        await pg.goto(U + 'present.html?for=Acme%20Law#1', wait_until='networkidle')
        ok('personalized opening', 'Acme Law' in await pg.text_content('#s1'))
        ok('notes hidden from audience by default', await pg.is_hidden('#notes'))
        # fit at sizes
        for w, h in [(1280, 720), (1366, 768), (1440, 900), (1920, 1080), (1024, 640)]:
            q = await b.new_page(viewport={'width': w, 'height': h}); await q.goto(U + 'present.html', wait_until='networkidle')
            bad = []
            for i in range(12):
                await q.evaluate(f"window.__deck.go({i},'instant')")
                r = await q.evaluate("""(()=>{const s=document.querySelector('.slide:not([hidden])'),sr=s.getBoundingClientRect(),k=sr.height/900;let mb=0;s.querySelectorAll('*').forEach(e=>{if(e.classList.contains('bgimg'))return;const r=e.getBoundingClientRect();if(r.width&&r.height)mb=Math.max(mb,(r.bottom-sr.top)/k)});return mb<=880&&sr.bottom<=document.getElementById('dbar').getBoundingClientRect().top+1&&s.scrollHeight<=s.clientHeight+1})()""")
                if not r: bad.append(i + 1)
            ok(f'every slide fits at {w}x{h}', not bad, bad); await q.close()
        await b.close()
    for r in R: print(*r)
    f = sum(1 for r in R if r[0] == 'FAIL'); print(len(R) - f, '/', len(R)); sys.exit(1 if f else 0)
asyncio.run(main())
