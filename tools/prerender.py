#!/usr/bin/env python3
"""Write the rendered content from content.js into the static HTML, so every essential
section is readable even if JavaScript fails or is turned off.

Run after editing content.js:
    python tools/prerender.py

The script serves the site locally, renders each page in headless Chromium, and copies
the HTML of every [data-render] container (plus a few page-specific containers) into the
source file between <!--pre--> and <!--/pre--> markers. On a normal visit the scripts
render the same content again, so nothing changes for visitors with JavaScript.
The immersive ride script is not run during prerendering, so no animation state is saved.
"""
import asyncio, functools, http.server, os, pathlib, re, socketserver, threading

ROOT = pathlib.Path(__file__).resolve().parent.parent
CHROME = os.environ.get('CHROME_PATH')
PAGES = {
    'index.html': [],
    'express.html': ['xgap', 'xroute', 'xpast', 'xrel', 'xcost', 'xtiers', 'xtiernote', 'xways', 'xgov', 'xdocs', 'xcont', 'xprinc'],
    'overview.html': ['doc'],
    'prospectus.html': ['doc'],
}
BLOCK = ['ride.js']


def serve():
    class Quiet(http.server.SimpleHTTPRequestHandler):
        def log_message(self, *a):
            pass
    httpd = socketserver.TCPServer(('127.0.0.1', 0), functools.partial(Quiet, directory=str(ROOT)))
    threading.Thread(target=httpd.serve_forever, daemon=True).start()
    return httpd


GRAB = """(ids) => {
  const out = [];
  document.querySelectorAll('[data-render]').forEach((el) => out.push(['data-render', el.dataset.render, el.innerHTML]));
  ids.forEach((id) => { const el = document.getElementById(id); if (el) out.push(['id', id, el.innerHTML]); });
  return out;
}"""


def inject(src, attr, name, html, used):
    pat = re.compile(r'(<(\w+)\b[^>]*\b' + attr + r'="' + re.escape(name) + r'"[^>]*>)(?:<!--pre-->.*?<!--/pre-->)?(</\2>)', re.S)
    ms = list(pat.finditer(src))
    k = used.get((attr, name), 0)
    if k >= len(ms):
        print('  not found in source:', attr, name)
        return src
    used[(attr, name)] = k + 1
    m = ms[k]
    html = html.replace('—', ',')
    return src[:m.start()] + m.group(1) + '<!--pre-->' + html + '<!--/pre-->' + m.group(3) + src[m.end():]


async def main():
    from playwright.async_api import async_playwright
    httpd = serve()
    port = httpd.server_address[1]
    async with async_playwright() as p:
        kw = {'executable_path': CHROME} if CHROME else {}
        browser = await p.chromium.launch(args=['--no-sandbox'], **kw)
        for file, ids in PAGES.items():
            path = ROOT / file
            src = path.read_text(encoding='utf-8')
            # render from a copy with the old prerendered blocks removed, so scripts start clean
            page = await browser.new_page()
            await page.route('**/*', lambda r: r.abort() if any(b in r.request.url for b in BLOCK) else r.continue_())
            await page.goto(f'http://127.0.0.1:{port}/{file}?nogate=1', wait_until='networkidle')
            await page.wait_for_timeout(400)
            parts = await page.evaluate(GRAB, ids)
            await page.close()
            used = {}
            for attr, name, html in parts:
                src = inject(src, attr, name, html, used)
            path.write_text(src, encoding='utf-8')
            print('Prerendered', file, '(', len(parts), 'blocks )')
        await browser.close()
    httpd.shutdown()


if __name__ == '__main__':
    asyncio.run(main())
