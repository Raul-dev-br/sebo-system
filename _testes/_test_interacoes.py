import asyncio, os, subprocess, urllib.request
from playwright.async_api import async_playwright

BASE = r"C:/Users/luand/Downloads/sebo-andorinhas"
CHROME = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
PORT = 9333

def alive():
    try:
        urllib.request.urlopen(f"http://127.0.0.1:{PORT}/json/version", timeout=2).read(); return True
    except Exception: return False

async def main():
    if not alive():
        subprocess.Popen([CHROME, f"--remote-debugging-port={PORT}", "--headless=new", "--disable-gpu",
            "--allow-file-access-from-files", "--user-data-dir=C:/Users/luand/AppData/Local/Temp/chrome-sebo",
            "about:blank"], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        for _ in range(40):
            await asyncio.sleep(0.5)
            if alive(): break

    async with async_playwright() as p:
        b = await p.chromium.connect_over_cdp(f"http://127.0.0.1:{PORT}")
        ctx = b.contexts[0] if b.contexts else await b.new_context()
        pg = await ctx.new_page()
        await pg.set_viewport_size({"width": 390, "height": 844})
        F = lambda t: f"file:///{BASE}/telas/{t}/index.html"

        # --- VITRINE: busca e filtro ---
        await pg.goto(F("vitrine")); await pg.wait_for_timeout(1800)
        total = await pg.evaluate("document.querySelectorAll('[data-livro], .livro-card, .card-livro, article').length")
        inp = await pg.query_selector('input[type="search"], input[placeholder*="título" i], input[placeholder*="autor" i]')
        print(f"VITRINE cards iniciais: {total}  input busca encontrado: {bool(inp)}")
        if inp:
            await inp.fill("cervantes")
            await pg.wait_for_timeout(700)
            vis = await pg.evaluate("""[...document.querySelectorAll('article,.livro-card,.card-livro,[data-livro]')].filter(e=>e.offsetParent!==null).length""")
            print(f"  apos buscar 'cervantes': {vis} card visivel(s)")
            await inp.fill("")
            await pg.wait_for_timeout(500)
        chips = await pg.query_selector_all('.chip, [data-categoria], button')
        for c in chips:
            t = (await c.inner_text()).strip()
            if t.lower() in ("ficção", "ficcao"):
                await c.click(); await pg.wait_for_timeout(600)
                vis = await pg.evaluate("""[...document.querySelectorAll('article,.livro-card,.card-livro,[data-livro]')].filter(e=>e.offsetParent!==null).length""")
                print(f"  filtro '{t}': {vis} card visivel(s)")
                break

        # --- LOGIN: toggle de senha + validacao ---
        await pg.goto(F("login")); await pg.wait_for_timeout(1500)
        pw = await pg.query_selector('input[type="password"]')
        if pw:
            print(f"LOGIN input senha type={await pw.get_attribute('type')} value={await pw.input_value()}")
        # procura botao/toggle
        toggles = await pg.query_selector_all('[class*="toggle"], [class*="eye"], [aria-label*="senha" i], .password button')
        print(f"LOGIN toggles de senha encontrados: {len(toggles)}")
        if toggles:
            await toggles[0].click(); await pg.wait_for_timeout(400)
            pw2 = await pg.query_selector('input[type="password"]')
            print(f"  apos clicar no olho, type agora = {await pw2.get_attribute('type') if pw2 else 'N/A'}")

        # --- RECUPERAR SENHA: validacao + sucesso ---
        await pg.goto(F("recuperar-senha")); await pg.wait_for_timeout(1500)
        em = await pg.query_selector('input[type="email"], input')
        if em:
            await em.fill("email-invalido")
            btn = await pg.query_selector('button[type="submit"], .btn--primary, button')
            if btn:
                await btn.click(); await pg.wait_for_timeout(600)
                body = await pg.inner_text("body")
                print(f"RECUPERAR com email invalido -> msg de erro presente: {('erro' in body.lower() or 'inválid' in body.lower() or 'inval' in body.lower())}")
                await em.fill("fulanodetal@gmail.com")
                await btn.click(); await pg.wait_for_timeout(700)
                body = await pg.inner_text("body")
                print(f"  com email valido -> sucesso presente: {('enviamos' in body.lower() or 'sucesso' in body.lower() or 'reenviar' in body.lower())}")

        # --- ADMIN: busca ---
        await pg.set_viewport_size({"width": 1440, "height": 1030})
        await pg.goto(F("admin")); await pg.wait_for_timeout(2000)
        ai = await pg.query_selector('input[placeholder*="Procurar" i], input[placeholder*="livro" i]')
        print(f"ADMIN input busca: {bool(ai)}")
        if ai:
            before = await pg.evaluate("document.querySelectorAll('img').length")
            await ai.fill("quixote"); await pg.wait_for_timeout(700)
            vis = await pg.evaluate("""[...document.querySelectorAll('li, article, .book-item, .livro-item')].filter(e=>e.offsetParent!==null).length""")
            print(f"  apos buscar 'quixote': {vis} item(ns) visivel(is)")
        # menu mobile
        await pg.set_viewport_size({"width": 390, "height": 844})
        await pg.wait_for_timeout(700)
        sb = await pg.evaluate("getComputedStyle(document.querySelector('.sidebar, aside, nav')).display")
        print(f"ADMIN sidebar em 390px: display={sb}")

        await b.close()

asyncio.run(main())
