import os
import asyncio
from playwright.async_api import async_playwright
U='http://localhost:8765/'
async def run(status):
    async with async_playwright() as p:
        b=await p.chromium.launch(args=['--no-sandbox'],**({'executable_path':os.environ['CHROME_PATH']} if os.environ.get('CHROME_PATH') else {}))
        pg=await b.new_page(viewport={'width':1440,'height':900})
        await pg.route('**/content.js',lambda r: r.continue_())
        await pg.route('https://formspree.io/**',lambda r: r.fulfill(status=status,body='{}',content_type='application/json'))
        await pg.add_init_script("Object.defineProperty(window,'BRIDGE',{configurable:true,set(v){v.form.endpoint='https://formspree.io/f/test';Object.defineProperty(window,'BRIDGE',{value:v,writable:true})}})")
        await pg.goto(U+'?skip#build',wait_until='networkidle')
        await pg.click('button[data-go="2"]');await pg.fill('#orgName','Acme');await pg.fill('input[name=name]','Jo');await pg.fill('input[name=email]','jo@acme.org')
        await pg.click('fieldset[data-step="2"] button[data-go="3"]');await pg.wait_for_timeout(500)
        lbl=await pg.text_content('#sendBtn');await pg.click('#sendBtn');await pg.wait_for_timeout(800)
        st=await pg.text_content('#sendState');modal=await pg.is_visible('#mailModal')
        print(status,'label:',lbl,'| state:',st,'| fallback modal:',modal)
        await b.close()
async def snd():
    async with async_playwright() as p:
        b=await p.chromium.launch(executable_path='/usr/bin/google-chrome',args=['--no-sandbox','--autoplay-policy=no-user-gesture-required'])
        pg=await b.new_page();await pg.goto(U,wait_until='networkidle');await pg.click('#boardSound');await pg.wait_for_timeout(4800)
        print('board with sound -> aria-pressed',await pg.get_attribute('#sound','aria-pressed'))
        await pg.keyboard.press('m');print('M toggles ->',await pg.get_attribute('#sound','aria-pressed'))
        await b.close()
asyncio.run(run(200));asyncio.run(run(500));asyncio.run(snd())
