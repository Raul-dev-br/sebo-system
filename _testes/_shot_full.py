import asyncio, sys, os
from playwright.async_api import async_playwright

BASE = r"C:/Users/luand/Downloads/sebo-andorinhas"
OUT = os.path.join(BASE, "_shots/full")
os.makedirs(OUT, exist_ok=True)

TELAS = [
    ("entrada", 390, 844),
    ("login", 390, 844),
    ("recuperar-senha", 390, 844),
    ("vitrine", 390, 844),
    ("detalhes-livro", 390, 844),
    ("admin", 1440, 1030),
]

async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(args=["--allow-file-access-from-files"])
        for nome, w, h in TELAS:
            pg = await b.new_page(viewport={"width": w, "height": h})
            erros = []
            pg.on("console", lambda m: erros.append(m.text) if m.type == "error" else None)
            pg.on("pageerror", lambda e: erros.append(str(e)))
            await pg.goto(f"file:///{BASE}/telas/{nome}/index.html")
            await pg.wait_for_timeout(2500)
            # altura total do documento
            sh = await pg.evaluate("document.documentElement.scrollHeight")
            # checa overflow horizontal
            ov = await pg.evaluate("document.documentElement.scrollWidth")
            await pg.screenshot(path=os.path.join(OUT, f"{nome}.png"), full_page=True)
            print(f"{nome:16} viewport={w}x{h}  scrollH={sh}  scrollW={ov}  overflowX={'SIM' if ov > w+1 else 'nao'}  errosJS={len(erros)}")
            for e in erros[:3]:
                print("      !", e[:120])
            await pg.close()
        await b.close()

asyncio.run(main())
