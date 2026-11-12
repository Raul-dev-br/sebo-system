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

        # ---- ADMIN: busca real ----
        await pg.set_viewport_size({"width": 1440, "height": 1030})
        await pg.goto(f"file:///{BASE}/telas/admin/index.html"); await pg.wait_for_timeout(2000)
        ai = await pg.query_selector("#buscaLivro")
        print("ADMIN #buscaLivro:", bool(ai))
        antes = await pg.evaluate("document.querySelectorAll('#quickBooks > *').length")
        await ai.fill("quixote"); await pg.wait_for_timeout(800)
        dep = await pg.evaluate("document.querySelectorAll('#quickBooks > *').length")
        tit = await pg.evaluate("[...document.querySelectorAll('#quickBooks > *')].map(e=>e.innerText.split('\\n')[0])")
        print(f"  cards antes={antes} depois(busca 'quixote')={dep} -> {tit}")
        pag = await pg.evaluate("document.querySelector('#paginationInfo')?.textContent")
        print("  paginacao:", pag)
        await ai.fill(""); await pg.wait_for_timeout(600)
        n2 = await pg.evaluate("document.querySelectorAll('#quickBooks > *').length")
        print("  apos limpar ->", n2, "cards")

        # ---- LOGIN: toggle senha com seletor certo ----
        await pg.set_viewport_size({"width": 390, "height": 844})
        await pg.goto(f"file:///{BASE}/telas/login/index.html"); await pg.wait_for_timeout(1500)
        print("LOGIN #senha type antes:", await pg.get_attribute("#senha", "type"))
        await pg.click("#toggle-senha"); await pg.wait_for_timeout(500)
        print("LOGIN #senha type depois do clique:", await pg.get_attribute("#senha", "type"))
        await pg.click("#toggle-senha"); await pg.wait_for_timeout(400)
        print("LOGIN #senha type apos 2o clique:", await pg.get_attribute("#senha", "type"))

        # ---- LOGIN: submit vazio mostra feedback? ----
        await pg.evaluate("document.querySelector('#email').value=''; document.querySelector('#senha').value='';")
        await pg.click("#form-login button[type='submit']"); await pg.wait_for_timeout(700)
        msg = await pg.evaluate("""(() => {
          const e = document.getElementById('email-erro');
          const s2 = document.getElementById('senha-erro');
          return {email: e ? {hidden: e.hidden, texto: e.innerText} : null,
                  senha: s2 ? {hidden: s2.hidden, texto: s2.innerText} : null};
        })()""")
        print("LOGIN feedback submit vazio:", msg)
        print("LOGIN aria-invalid count:", await pg.evaluate("document.querySelectorAll('[aria-invalid=\"true\"]').length"))

        await b.close()

asyncio.run(main())
