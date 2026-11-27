#!/usr/bin/env python3
"""Rebuild the downloadable PDFs from their pages:
    prospectus.html -> downloads/BRIDGE-the-District-Partnership-Prospectus-2027.pdf
    overview.html   -> downloads/BRIDGE-the-District-One-Page-Overview-2027.pdf
    present.html    -> downloads/BRIDGE-the-District-Pitch-Deck-2027.pdf (offline pitch deck)

Run after editing content.js:
    pip install playwright && python -m playwright install chromium
    python tools/build-prospectus.py

It serves the site locally, renders prospectus.html in headless Chromium,
and saves a US Letter PDF with the same fonts and colors as the website.
"""
import asyncio, functools, http.server, os, pathlib, socketserver, threading

ROOT = pathlib.Path(__file__).resolve().parent.parent
JOBS = [('prospectus.html', ROOT / 'downloads' / 'BRIDGE-the-District-Partnership-Prospectus-2027.pdf'),
        ('overview.html', ROOT / 'downloads' / 'BRIDGE-the-District-One-Page-Overview-2027.pdf'),
        ('present.html?print=1', ROOT / 'downloads' / 'BRIDGE-the-District-Pitch-Deck-2027.pdf')]
CHROME = os.environ.get('CHROME_PATH')  # optional: path to an installed Chrome


def serve():
    class Quiet(http.server.SimpleHTTPRequestHandler):
        def log_message(self, *a):
            pass
    handler = functools.partial(Quiet, directory=str(ROOT))
    httpd = socketserver.TCPServer(('127.0.0.1', 0), handler)
    threading.Thread(target=httpd.serve_forever, daemon=True).start()
    return httpd


async def main():
    from playwright.async_api import async_playwright
    httpd = serve()
    port = httpd.server_address[1]
    async with async_playwright() as p:
        kw = {'executable_path': CHROME} if CHROME else {}
        browser = await p.chromium.launch(args=['--no-sandbox'], **kw)
        for src, OUT in JOBS:
            page = await browser.new_page()
            await page.goto(f'http://127.0.0.1:{port}/{src}', wait_until='networkidle')
            await page.wait_for_function("document.documentElement.classList.contains('ready')")
            await page.evaluate('document.fonts.ready')
            overflow = await page.evaluate("[...document.querySelectorAll('.page,.slide')].map((p,i)=>p.scrollHeight>p.clientHeight+1?i+1:0).filter(Boolean)")
            if overflow:
                print('WARNING:', src, 'overflows on page(s)', overflow, '- shorten copy in content.js')
            OUT.parent.mkdir(exist_ok=True)
            await page.pdf(path=str(OUT), prefer_css_page_size=True, print_background=True)
            print('Saved', OUT.relative_to(ROOT))
            await page.close()
        await browser.close()
    httpd.shutdown()


if __name__ == '__main__':
    asyncio.run(main())
