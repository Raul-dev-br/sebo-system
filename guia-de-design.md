# 🎨 Guia de Design — Sebo das Andorinhas

Baseado no Figma "Sebo das Andorinhas" (file_key `g7yiCkbVgEwvHh3ErTsetO`).
Extraído em 2026-11-10 via Composio/Figma API.

---

## 1. Paleta de cores

| Token | Hex | Uso |
|---|---|---|
| `--cream-bg` | `#FAF7F2` | Fundo das telas de entrada/login (creme quente) |
| `--cream-bg-alt` | `#F9F6F0` | Fundo variante (esqueceu senha) |
| `--white` | `#FFFFFF` | Fundo das telas internas (vitrine, detalhes) |
| `--wine` | `#AE525B` | **Cor principal** — botões primários, ícones ativos, logo |
| `--wine-light` | `#DD797E` | Hover / bordas / acentos suaves |
| `--rose-soft` | `#EEC4C3` | Ilustração / detalhe decorativo |
| `--rose-pale` | `#FFE0E5` | Background de badges rose (categoria, status) |
| `--green-soft` | `#D8FEE4` | Background de badge "Disponível" |
| `--green-text` | `#7C9A73` | Texto do badge disponível |
| `--dark` | `#1A0001` | Texto principal (quase preto com tom vinho) |
| `--gray-text` | `#4D4D4D` | Texto secundário |
| `--border` | `#D8D8D8` | Bordas de cards / inputs |
| `--surface` | `#F4F4F4` | Fundo de seções / placeholders |
| `--amber-soft` | `#FFF4E0` | Badge "Achados" / destaque |

## 2. Tipografia

| Uso | Família | Tamanho | Peso |
|---|---|---|---|
| Títulos principais (h1) | **Figtree** | 28px | 700 |
| Títulos de seção | **Figtree** | 24px | 600 |
| Título de card | **Figtree** | 20px | 700 |
| Subtítulo / descrição | **DM Sans** | 16px | 500 |
| Texto de card | **DM Sans** | 14px | 400–600 |
| Label de input | **DM Sans** | 12px | 500 |
| Badge / chip | **Poppins** | 10–14px | 400–600 |
| Preço | **Poppins** | 10px | 600 |

> Fontes via Google Fonts: `Figtree:wght@600;700`, `DM+Sans:wght@400;500;600;700`, `Poppins:wght@400;500;600;700`

## 3. Medidas

- Mobile: **390 × 844 px** (iPhone 14-ish)
- Desktop/Admin: **1440 × 1030 px**
- Border radius: cards ~12px, botões ~10px, badges ~8px, chips ~20px (pill)
- Espaçamento: base de 8px (8/12/16/20/24/32)
- Sidebar admin: largura ~264px

## 4. Telas do Figma — o que é REAL e o que é REFERÊNCIA

### ✅ Telas REAIS (fonte: seção `Mobile Cliente` / `221:340` + aba `DESKTOP` / `1:2`)

| # | Frame | ID | Arquivo alvo |
|---|---|---|---|
| 1 | Mobile / Entrada | `115:719` | `telas/entrada/` |
| 2 | Mobile / Entrada / Login | `114:714` | `telas/login/` |
| 3 | Mobile / Entrada / Esqueceu Senha | `128:832` | `telas/recuperar-senha/` |
| 4 | Mobile / Inicio (vitrine) | `142:2` | `telas/vitrine/` |
| 5 | Mobile / Inicio / Detalhes do Livro | `204:138` | `telas/detalhes-livro/` |
| 6 | Desktop Admin / Frame 5 | `238:700` | `telas/admin/` |

### ⚠️ Frames de REFERÊNCIA (não replicar literalmente)

| Frame | ID | Por quê |
|---|---|---|
| Mobile / Entrada | `214:267` | Duplicata antiga, **fora** da seção Mobile Cliente. Só tem a ilustração de fundo, sem o conteúdo completo |
| Mobile / Entrada / Login | `214:278` | Duplicata antiga, fora da seção |
| Mobile / Entrada / Esqueceu Senha | `214:312` | Duplicata antiga, fora da seção |

> Os frames `214:*` estão soltos no canvas raiz (fora de `221:340`). Os `115:*`/`114:*`/`128:*` estão **dentro** da seção `Mobile Cliente` e **substituem** as duplicatas. Use sempre os reais.

### Frame 6 do Desktop (`257:99`) — variação do admin
Mesma tela que Frame 5, com estado levemente diferente (usada pra estudo de estados). Use o `238:700` como base.

---

## 5. Assets extraídos (pasta `assets/`)

| Arquivo | Origem | Uso |
|---|---|---|
| `bg-entrada.png` | `115:719` | Ilustração de fundo da tela de entrada |
| `bg-login.png` | `114:714` | Ilustração de fundo da tela de login |
| `bg-esqueceu.png` | `128:832` | Ilustração de fundo da tela de recuperação |
| `header-inicio.png` | `142:2` | Banner "Achados do Sebo" da vitrine |
| `capa-dom-casmurro.png` | `142:2` | Capa do livro Dom Casmurro |
| `capa-hora-estrela.png` | `142:2` | Capa de A hora da estrela |
| `capa-dom-quixote.png` | `142:2` / `204:138` | Capa de Dom Quixote |
| `capa-1.png` … `capa-5.png` | `142:2` | Capas da lista da vitrine |
| `icone-pesquisar.png` | `142:2` | Ícone de lupa |
| `icone-google.png` | `114:714` | Ícone do Google (login social) |

### Renders de referência (pasta `referencia/`)
Usar como **guia visual** — são PNGs das telas reais do Figma, renderizados em 2x.

---

## 6. Conteúdo textual EXATO (extraído da API do Figma — não invente)

### 6.1 Entrada (`115:719`)
- H1 (28px Figtree 700): `Bem Vindo ao` / `Sebo das Andorinhas!`
- Botão primário (14px DM Sans 600): `Entre com sua conta`
- Botão secundário (14px DM Sans 600): `Continuar como Visitante`
- Layout: ilustração de fundo ocupa y=29→614 (585px de altura); H1 em y=614; botões em y=706 (frame 108px) e y=781

### 6.2 Login (`114:714`)
- H1 (28px Figtree 700): `Faça login na sua conta`
- Subtítulo (16px DM Sans 500): `Guarde os seus favoritos e encontra a próxima leitura!`
- Label `Email` (12px DM Sans 500) → valor `fulanodetal@gmail.com`
- Label `Senha` (12px DM Sans 500) → valor `senha123`
- Link (10px Poppins 500, à direita): `Esqueceu senha?`
- Botão primário: `Entre com sua conta`
- Botão secundário: `Continuar como Visitante`
- Link rodapé (14px Poppins 500): `Ainda não tem conta? Criar Conta`
- Layout: ilustração y=29→486 (457px); seta voltar (frame 32px) em y=58; card branco (Rectangle 21) y=439 h=151

### 6.3 Recuperar senha (`128:832`)
- H1: `Esqueceu a sua senha?`
- Subtítulo: `Recupere a sua conta através do seu melhor email!`
- Label `Email` → `fulanodetal@gmail.com`
- Botão primário: `Enviar`
- Layout: ilustração y=29→604 (575px); card branco y=503 h=189; botão frame 48px em y=611

### 6.4 Vitrine / Início (`142:2`)
- Seção hero: `Achados do Sebo` (18px Figtree 700) / `Grandes achados por até R$ 20,00` (10px DM Sans 500) / botão `Explorar Achados` (10px DM Sans 700)
- H1: `Qual será a sua próxima leitura?` (24px Figtree 600)
- Subtítulo: `Encontre um título ou descubra um novo achado!` (14px DM Sans 500)
- Input de busca (12px DM Sans 500): placeholder `Encontre pelo título ou autor`
- Chips de categoria (14px Poppins 500): `Todos` · `Literatura` · `Ficção` · `Infantil`
- Cards de livro (20px Figtree 700 título / 12px DM Sans 400 autor / 10px Poppins 600 `Np` páginas / 10px Poppins 600 preço / 10.67px Poppins 500 badges):
  - `Dom Casmurro` — `Machado de Assis` — `250p` — `35,00` — badges `Literatura`, `Ficção`
  - `A hora da estrela` — `Clarice Lispector` — `250p` — `24,00` — badges `Literatura`, `Ficção`
  - `Moby Dick` — `Herman Melville` — `160p` — `35,00` — badges `Literatura`, `Ficção`
- Navegação inferior fixa (barra branca)

### 6.5 Detalhes do livro (`204:138`)
- Título: `Dom Quixote` (24px Figtree 600)
- Autor: `Miguel de Cervantes` (14px Poppins 400)
- Badge: `Romance` (14px DM Sans 500, pill rose) + `Disponível` (14px DM Sans 500, pill verde)
- Descrição: `Uma sátira genial sobre idealismo e loucura, onde um fidalgo confunde moinhos de`
- Preço: `R$ 24,00` (24px DM Sans 600)
- Botão: `Pesquisar` (14px Poppins 500)
- Specs (label 10px Poppins 400 / valor 20px DM Sans 600): `Páginas`→`320`, `Ano de Publicação`→`1605`, `Idioma`→`PT-BR`
- Aviso: `Compra somente na loja física` (14px DM Sans 400)
- Seção: `Sobre este exemplar` (16px Figtree 600) + condição `Usando · Como novo` (14px DM Sans 500)
- Texto: `Páginas amareladas pelo tempo. Sem grifos, com leves marcas na capa`
- Seção: `Onde encontrar no Sebo?` (14px DM Sans 400)
- Seção: `Detalhes da Edição` (14px DM Sans 400)

### 6.6 Admin Dashboard (`238:700` — desktop 1440×1030)
- **Sidebar**: logo "Sebo das Andorinhas" (livro estilizado + folhas), menu: `Dashboard` (ativo, ícone grade), `Livros` (ícone livro), `Categorias` (ícone etiqueta)
- **Header**: `Bom dia, Antônio! 👋` (16px Figtree 600) + avatar circular 48px + nome `Antônio Sales` + cargo `Admin`
- **Cards de métricas** (3): `Total de Clientes` → `1.348` (ícone pessoas) · `Total de Livros` → `6304` (ícone livro) · `Total Disponível` → `5579` (ícone livro com check)
- **Seção**: `Últimos Livros Cadastrados` (324x29) + grade de 4 livros (1984 / Moby Dick / A menina que roubava livros / O Alquimista) + botões `Novo Livro` (+) e `Ver Clientes` (pessoas)
- **Seção**: `Pesquisa Rápida` (192x29) + input `Procurar Livro...` (com lupa) + grade de 10 livros + navegação de páginas (`10 de 234`)
- **Gráfico**: `Porcentagem por Categoria` (gráfico de pizza, canto superior direito)
- Paleta do admin: mesma base (`--wine` #AE525B acentos, rosa), com verde/azul/amarelo nos detalhes

---

## 7. Regras de implementação

1. **HTML + CSS + JS puro.** Sem framework, sem build, sem node_modules, sem TypeScript.
2. **Mobile-first.** Comece pelo layout mobile (390px) e use `@media (min-width: ...)` pra expandir pro desktop.
3. **Responsivo de verdade.** Teste em 360px, 390px, 768px, 1024px, 1440px.
4. **Admin é desktop**, mas deve funcionar em tablet (sidebar colapsa em ícone).
5. **Comentários no código** explicando cada parte — o usuário está aprendendo HTML/CSS/JS.
6. **JS separado** em arquivo `.js` próprio por tela, ou um `main.js` compartilhado com módulos por tela.
7. **Sem APIs externas** no JS. Dados mockados em arrays dentro do JS.
8. **Ícones:** use SVG inline ou Unicode — não dependa de CDN de ícones.
9. **Imagens** referenciadas via caminho relativo `../assets/...`.
10. **Acessibilidade:** labels reais nos inputs, `alt` nas imagens, foco visível, contraste ok.
11. Cada tela em sua **própria pasta** em `telas/`, com `index.html`, `style.css` e `script.js`.
12. Crie também um `index.html` na raiz que serve de **hub de navegação** entre as 6 telas.
