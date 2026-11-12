import asyncio, os, subprocess, urllib.request
from playwright.async_api import async_playwright

BASE = r"C:/Users/luand/Downloads/sebo-andorinhas"
OUT = os.path.join(BASE, "_shots/full")
os.makedirs(OUT, exist_ok=True)

CHROME = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
PORT = 9333

TELAS = [
    ("entrada", 390, 844),
    ("login", 390, 844),
    ("recuperar-senha", 390, 844),
    ("vitrine", 390, 844),
    ("detalhes-livro", 390, 844),
    ("admin", 1440, 1030),
]

def chrome_alive():
    try:
        urllib.request.urlopen(f"http://127.0.0.1:{PORT}/json/version", timeout=2).read()
        return True
    except Exception:
        return False

async def main():
    if not chrome_alive():
        subprocess.Popen([
            CHROME, f"--remote-debugging-port={PORT}", "--headless=new",
            "--disable-gpu", "--hide-scrollbars", "--allow-file-access-from-files",
            "--user-data-dir=C:/Users/luand/AppData/Local/Temp/chrome-sebo",
            "about:blank",
        ], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        for _ in range(40):
            await asyncio.sleep(0.5)
            if chrome_alive():
                break
        print("chrome CDP up")

    async with async_playwright() as p:
        b = await p.chromium.connect_over_cdp(f"http://127.0.0.1:{PORT}")
        ctx = b.contexts[0] if b.contexts else await b.new_context()
        for nome, w, h in TELAS:
            pg = await ctx.new_page()
            await pg.set_viewport_size({"width": w, "height": h})
            erros = []
            pg.on("pageerror", lambda e: erros.append(str(e)))
            pg.on("console", lambda m: erros.append(m.text) if m.type == "error" else None)
            await pg.goto(f"file:///{BASE}/telas/{nome}/index.html")
            await pg.wait_for_timeout(2200)
            sh = await pg.evaluate("document.documentElement.scrollHeight")
            sw = await pg.evaluate("document.documentElement.scrollWidth")
            await pg.screenshot(path=os.path.join(OUT, f"{nome}.png"), full_page=True)
            print(f"{nome:16} vp={w}x{h} scrollH={sh} scrollW={sw} overflowX={'SIM' if sw > w+1 else 'nao'} errosJS={len(erros)}")
            for e in erros[:3]:
                print("      !", e[:130])
            await pg.close()
        await b.close()

asyncio.run(main())
