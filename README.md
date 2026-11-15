# 📖 Sebo das Andorinhas — Relatório Final do Projeto

Projeto recriado a partir do Figma **"Sebo das Andorinhas"** (file_key `g7yiCkbVgEwvHh3ErTsetO`),
acessado via **Composio → Figma API**.

Data: 2026-11-10
Stack: **HTML + CSS + JavaScript puro** (sem framework, sem build, sem node_modules)

> Nota: cada tela também tem um `RELATORIO.md` próprio dentro da sua pasta, com as decisões
> de layout específicas dela (hero, badges, acordeões etc.).

---

## 📁 Estrutura

```
sebo-andorinhas/
├── index.html              ← Hub de navegação entre as 6 telas
├── guia-de-design.md       ← Paleta, tipografia, medidas e textos exatos extraídos do Figma
├── BRIEFING.md             ← Instruções passadas ao OpenCode
├── RELATORIO-PROJETO.md    ← Este arquivo
├── assets/                 ← Imagens extraídas do Figma (14 arquivos)
├── referencia/             ← Renders PNG do Figma usados como guia visual
├── telas/
│   ├── entrada/            ← index.html + style.css + script.js
│   ├── login/
│   ├── recuperar-senha/
│   ├── vitrine/
│   ├── detalhes-livro/
│   └── admin/
└── _testes/                ← Scripts de automação (Playwright) usados na validação
```

---

## 🖼️ As 6 telas

| # | Tela | Tipo | Origem no Figma | Frame |
|---|---|---|---|---|
| 1 | Entrada / Welcome | Mobile | Seção `Mobile Cliente` | `115:719` |
| 2 | Login | Mobile | Seção `Mobile Cliente` | `114:714` |
| 3 | Recuperar senha | Mobile | Seção `Mobile Cliente` | `128:832` |
| 4 | Vitrine (Início) | Mobile | Seção `Mobile Cliente` | `142:2` |
| 5 | Detalhes do livro | Mobile | Seção `Mobile Cliente` | `204:138` |
| 6 | Admin Dashboard | Desktop | Aba `DESKTOP` | `238:700` |

### 🔍 Diferenciação entre tela real e referência

O Figma tem **7 cabeçalhos** na raiz do canvas, mas só **6 são telas reais**:

- **REAIS** — dentro da seção `Mobile Cliente` (`221:340`):
  `115:719`, `114:714`, `128:832`, `142:2`, `211:261`, `204:138`
- **REFERÊNCIAS** — soltos na raiz, fora da seção:
  `214:267`, `214:278`, `214:312`

Os `214:*` são **duplicatas antigas** das telas de entrada/login/recuperar, com conteúdo incompleto.
Confirmado comparando renderização + árvore de nós: os `214:*` têm menos filhos e o layout
diverge do que está dentro da seção `Mobile Cliente`. Os reais prevaleceram.

A tela de **admin** não está em `Mobile Cliente` — fica na aba **`DESKTOP`** (`1:2`),
nos frames `238:700` (usado) e `257:99` (variação de estado, ignorada).

---

## ✅ Validação executada

### Sintaxe
```
node --check telas/*/script.js  →  6/6 OK
```

### Renderização + JavaScript (Playwright + Chrome via CDP)
```
entrada          scrollH=844   scrollW=390  overflowX=nao  errosJS=0
login            scrollH=844   scrollW=390  overflowX=nao  errosJS=0
recuperar-senha  scrollH=844   scrollW=390  overflowX=nao  errosJS=0
vitrine          scrollH=1596  scrollW=390  overflowX=nao  errosJS=0
detalhes-livro   scrollH=1353  scrollW=390  overflowX=nao  errosJS=0
admin            scrollH=1253  scrollW=1440 overflowX=nao  errosJS=0
```

### Responsividade — 6 telas × 5 larguras, zero overflow horizontal
| Tela | 360 | 390 | 768 | 1024 | 1440 |
|---|---|---|---|---|---|
| entrada | ok | ok | ok | ok | ok |
| login | ok | ok | ok | ok | ok |
| recuperar-senha | ok | ok | ok | ok | ok |
| vitrine | ok | ok | ok | ok | ok |
| detalhes-livro | ok | ok | ok | ok | ok |
| admin | ok | ok | ok | ok | ok |

### Navegação entre telas
```
OK  entrada        -> login/index.html
OK  entrada        -> vitrine/index.html
OK  login          -> recuperar-senha/index.html
OK  login          -> entrada/index.html
OK  vitrine        -> detalhes-livro/index.html
OK  detalhes-livro -> vitrine/index.html
```

### Funcionalidades testadas
- **Vitrine** — busca por título/autor: "machado" → 1 card visível de 5 ✅
- **Vitrine** — chips de categoria: Todos 5 · Literatura 4 · Ficção 5 · Infantil 1 ✅
- **Vitrine** — clique no card navega pra detalhes ✅
- **Login** — toggle de senha: `password` → `text` → `password` ✅
- **Login** — validação: submit vazio → "Informe o seu email." / "Informe a sua senha." + `aria-invalid` ✅
- **Recuperar senha** — email inválido → feedback `state=error` "Digite um email válido…" ✅
- **Recuperar senha** — email válido → mensagem de sucesso + botão vira "Reenviar" ✅
- **Admin** — busca: 10 cards → "quixote" → 1 card ("Dom Quixote"), paginação "Amostra 1 de 234" ✅
- **Admin** — gráfico de pizza presente, sidebar vira `position:fixed` em 390px ✅
- **Hub** — 6 cards, zero links quebrados ✅

### Assets
14 imagens extraídas do Figma via `FIGMA_GET_IMAGE_FILLS`, baixadas do S3 do Figma.
Todos os 13 caminhos referenciados no código existem em `assets/`. Zero imagens quebradas.

---

## 🎨 Design system extraído

**Paleta** — `#FAF7F2` (creme) · `#AE525B` (wine, cor principal) · `#DD797E` · `#FFE0E5` ·
`#D8FEE4` · `#7C9A73` · `#1A0001` (texto) · `#4D4D4D` · `#D8D8D8` · `#F4F4F4` · `#FFF4E0`

**Tipografia** — `Figtree` (títulos, 600/700) · `DM Sans` (texto, 400–700) ·
`Poppins` (badges e chips, 400–600)

**Medidas** — mobile 390×844 · desktop 1440×1030 · sidebar admin 264px ·
radius 8–12px (cards 12, botões 10, badges 8, chips 20)

Detalhe completo em `guia-de-design.md`.

---

## 📝 Sobre os comentários

Todos os arquivos têm comentários explicativos (o usuário está aprendendo HTML/CSS/JS):

| Arquivo | Linhas comentadas |
|---|---|
| `telas/detalhes-livro/style.css` | 83 |
| `telas/admin/style.css` | 64 |
| `telas/entrada/style.css` | 61 |
| `telas/recuperar-senha/style.css` | 48 |
| `telas/vitrine/style.css` | 45 |
| `telas/login/style.css` | 40 |
| `telas/admin/script.js` | 43 |
| `telas/vitrine/script.js` | 40 |
| `telas/detalhes-livro/script.js` | 34 |
| `telas/login/script.js` | 25 |
| `telas/recuperar-senha/script.js` | 23 |
| `telas/admin/index.html` | 32 |
| `telas/detalhes-livro/index.html` | 27 |
| `telas/recuperar-senha/index.html` | 23 |
| `telas/vitrine/index.html` | 20 |
| `telas/login/index.html` | 21 |
| `telas/entrada/script.js` | 15 |
| `telas/entrada/index.html` | 11 |

---

## 🤖 Como foi feito

1. **Figma via Composio** — mapeei as páginas do arquivo (`MARCA`, `WIREFRAME`, `DESKTOP`,
   `Mobile Cliente`), renderizei cada frame em PNG e extraí a árvore de nós com cores,
   fontes, medidas e textos exatos.
2. **Referência vs. real** — comparei a posição dos frames no canvas e a completude das árvores
   pra separar as duplicatas `214:*` das telas de verdade.
3. **Briefing estruturado** — escrevi `guia-de-design.md` (design system) + um prompt por tela.
4. **OpenCode** (`opencode/deepseek-v4.1-flash-free`) — 6 processos em paralelo, cada um com
   o briefing + o PNG da tela anexado (`-f`), gerando `index.html` + `style.css` + `script.js`.
5. **Validação real** — renderizei cada tela via Chrome/Playwright, conferi overflow,
   erros de JS, e testei as interações clicando de verdade.

### ⚠️ Observação sobre o modelo
O `deepseek-v4.1-flash-free` do OpenCode **tem visão** e foi mais preciso que o
`nemotron-3.5-super-vl-120b-a12b` do NVIDIA (descreveu ícones e seta de voltar que o outro omitiu).
Ele também **tirou screenshots das próprias telas** para se auto-verificar.

Mas 4 dos 6 processos bateram no **"Free usage limit reached"** do OpenCode **no final**
(quando já tinha escrito os arquivos e estava só refinando). Nenhum arquivo ficou
truncado — confirmado pelo `node --check` e pelo render.

### 💡 Detalhes que valem saber (do processo de Detalhes do Livro)
- Hero verde com a capa desfocada ao fundo (`filter: blur`), aproximando o degradê da referência
- CTA fixo no mobile que some no desktop — sem duplicar preço
- Acordeões acessíveis (`aria-expanded`, `inert`, fecha com `Esc`)
- Badges com `color-mix` pra passar de ~2,9:1 pra ~4,9:1 de contraste
- Mapa é SVG inline decorativo, sem API externa

---

## 📌 O que falta (próximos passos naturais)

1. **Backend real** — hoje os dados são arrays mockados no JS. O próximo passo é a API.
2. **Backend de autenticação** — login/recuperar são só validação visual.
3. **234 páginas de catálogo** — o admin mocka a paginação ("Amostra 10 de 234").
4. **Estados vazios** — busca sem resultado no admin já tem `emptyState`; falta o mesmo na vitrine.
5. **Ícone de favicon** e meta tags de compartilhamento (PWA) — não pedidos, não criados.
6. **Testes no CI** — os scripts Playwright estão em `_testes/`, prontos pra rodar.
