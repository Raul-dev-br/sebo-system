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

        # ---------- VITRINE ----------
        await pg.goto(F("vitrine")); await pg.wait_for_timeout(1800)
        cards = 'article, .livro-card, .card-livro, .livro, [class*="card-livro"]'
        base = await pg.evaluate(f"document.querySelectorAll('{cards}').length")
        print(f"VITRINE cards: {base}")
        inp = await pg.query_selector('input[type="search"], input[placeholder*="título" i], input[placeholder*="autor" i]')
        await inp.fill("machado"); await pg.wait_for_timeout(700)
        vis = await pg.evaluate(f"[...document.querySelectorAll('{cards}')].filter(e=>e.offsetParent!==null).length")
        print(f"  busca 'machado' -> {vis} visivel(is)")
        await inp.fill(""); await pg.wait_for_timeout(500)
        # chips: clica em cada e conta
        for alvo in ["Todos", "Literatura", "Ficção", "Infantil"]:
            ch = await pg.query_selector(f'button:has-text("{alvo}"), .chip:has-text("{alvo}"), [data-cat*="{alvo}" i]')
            if ch:
                await ch.click(); await pg.wait_for_timeout(500)
                v = await pg.evaluate(f"[...document.querySelectorAll('{cards}')].filter(e=>e.offsetParent!==null).length")
                print(f"  chip '{alvo}' -> {v} card(s)")
        # clique num card deve navegar
        await pg.goto(F("vitrine")); await pg.wait_for_timeout(1500)
        c = await pg.query_selector(f"{cards} a, {cards}")
        if c:
            await c.click(); await pg.wait_for_timeout(1200)
            print(f"  clique no card -> url: {pg.url.split('/')[-2:]}")

        # ---------- LOGIN ----------
        await pg.goto(F("login")); await pg.wait_for_timeout(1500)
        pw = await pg.query_selector("#senha, input[type='password']")
        print(f"LOGIN campo senha id={await pw.get_attribute('id')} type={await pw.get_attribute('type')}")
        eye = await pg.query_selector("#toggle-senha")
        print(f"  #toggle-senha existe: {bool(eye)}")
        if eye:
            await eye.click(); await pg.wait_for_timeout(400)
            pw2 = await pg.query_selector("#senha, input[type='password'], input:not([type='password'])")
            print(f"  apos clique no olho -> type={await pw2.get_attribute('type')}")
        # erro de senha vazia
        em = await pg.query_selector("#email, input[type='email']")
        sen = await pg.query_selector("#senha")
        if em and sen:
            await em.fill(""); await sen.fill("")
            btn = await pg.query_selector("#btn-entrar, button[type='submit']")
            if btn:
                await btn.click(); await pg.wait_for_timeout(600)
                txt = await pg.inner_text("body")
                print(f"  submit vazio -> tem 'erro'/'inválid' no texto: {('erro' in txt.lower() or 'inválid' in txt.lower() or 'preench' in txt.lower())}")
                ninv = await pg.evaluate("document.querySelectorAll('[aria-invalid=\"true\"]').length")
                print(f"  campos com aria-invalid=true: {ninv}")

        # ---------- RECUPERAR ----------
        await pg.goto(F("recuperar-senha")); await pg.wait_for_timeout(1500)
        e2 = await pg.query_selector("#email, input[type='email']")
        bt2 = await pg.query_selector("#btn-enviar, button[type='submit']")
        if e2 and bt2:
            await e2.fill("email-invalido")
            await bt2.click(); await pg.wait_for_timeout(700)
            fb = await pg.query_selector("[data-state], .feedback, .mensagem, [role='status'], [role='alert']")
            if fb:
                print(f"RECUPERAR feedback: state={await fb.get_attribute('data-state')} texto={ (await fb.inner_text())[:70]!r}")
            else:
                print("RECUPERAR: nenhum elemento de feedback encontrado")
            print(f"  input aria-invalid={await e2.get_attribute('aria-invalid')}")

        # ---------- ADMIN ----------
        await pg.set_viewport_size({"width": 1440, "height": 1030})
        await pg.goto(F("admin")); await pg.wait_for_timeout(2000)
        ai = await pg.query_selector('input[placeholder*="Procurar" i]')
        await ai.fill("quixote"); await pg.wait_for_timeout(800)
        visA = await pg.evaluate("""[...document.querySelectorAll('li, .book, .livro-item, [class*="book-item"]')].filter(e=>e.offsetParent!==null).length""")
        totA = await pg.evaluate("""[...document.querySelectorAll('li, .book, .livro-item, [class*="book-item"]')].length""")
        print(f"ADMIN busca 'quixote' -> {visA} visivel(is) de {totA}")
        # donut/pizza presente?
        donut = await pg.evaluate("""!!document.querySelector('svg circle, .donut, [class*="chart"], [class*="grafico"], [class*="pie"]')""")
        print(f"  grafico de pizza presente: {donut}")
        # sidebar em mobile
        await pg.set_viewport_size({"width": 390, "height": 844}); await pg.wait_for_timeout(800)
        sb = await pg.evaluate("""(() => { const s=document.querySelector('.sidebar, aside, nav, [class*="sidebar"]'); if(!s) return 'NAO ENCONTRADO'; const cs=getComputedStyle(s); return cs.display+' / pos='+cs.position; })()""")
        print(f"  sidebar em 390px: {sb}")
        ov = await pg.evaluate("document.documentElement.scrollWidth")
        print(f"  scrollW em 390px: {ov} (overflow {'SIM' if ov>391 else 'nao'})")

        await b.close()

asyncio.run(main())
