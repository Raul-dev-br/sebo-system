import asyncio, os, subprocess, urllib.request
from playwright.async_api import async_playwright

BASE = r"C:/Users/luand/Downloads/sebo-andorinhas"
CHROME = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
PORT = 9333
WIDTHS = [360, 390, 768, 1024, 1440]

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

        # ---- 1. NAVEGACAO ENTRE TELAS ----
        print("=== NAVEGACAO ===")
        nav = [
            ("entrada", 'a:has-text("Entre com sua conta"), button:has-text("Entre com sua conta")', "login"),
            ("entrada", 'a:has-text("Continuar como Visitante"), button:has-text("Continuar como Visitante")', "vitrine"),
            ("login", 'a:has-text("Esqueceu senha?")', "recuperar-senha"),
            ("login", 'a:has-text("Ainda não tem conta?"), a:has-text("Criar Conta")', "entrada"),
            ("vitrine", '[class*="card-livro"], article', "detalhes-livro"),
            ("detalhes-livro", 'a[href*="vitrine"], button[aria-label*="voltar" i], .btn-back, [class*="voltar"]', "vitrine"),
        ]
        for origem, sel, esperado in nav:
            await pg.set_viewport_size({"width": 390, "height": 844})
            await pg.goto(f"file:///{BASE}/telas/{origem}/index.html"); await pg.wait_for_timeout(1400)
            el = await pg.query_selector(sel)
            if not el:
                print(f"  {origem:16} -> seletor nao achou: {sel}")
                continue
            await el.click(); await pg.wait_for_timeout(1000)
            destino = "/".join(pg.url.split("/")[-2:])
            ok = "OK " if esperado in destino else "FALHOU"
            print(f"  {ok} {origem:16} -> {destino}  (esperado: {esperado})")

        # ---- 2. RESPONSIVIDADE ----
        print("\n=== RESPONSIVIDADE (overflow horizontal) ===")
        for tela in ["entrada", "login", "recuperar-senha", "vitrine", "detalhes-livro", "admin"]:
            linha = []
            for w in WIDTHS:
                await pg.set_viewport_size({"width": w, "height": 900})
                await pg.goto(f"file:///{BASE}/telas/{tela}/index.html")
                await pg.wait_for_timeout(900)
                sw = await pg.evaluate("document.documentElement.scrollWidth")
                linha.append(f"{w}:{'X' if sw > w + 1 else 'ok'}")
            print(f"  {tela:16} " + "  ".join(linha))

        # ---- 3. HUB ----
        print("\n=== HUB ===")
        await pg.set_viewport_size({"width": 390, "height": 900})
        await pg.goto(f"file:///{BASE}/index.html"); await pg.wait_for_timeout(1200)
        links = await pg.evaluate("[...document.querySelectorAll('.card')].map(a=>a.getAttribute('href'))")
        print(f"  cards no hub: {len(links)} -> {links}")
        broken = []
        for l in links:
            t = os.path.normpath(os.path.join(BASE, l))
            if not os.path.exists(t): broken.append(l)
        print(f"  links quebrados: {broken if broken else 'nenhum'}")

        await b.close()

asyncio.run(main())
