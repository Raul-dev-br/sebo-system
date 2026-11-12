Você vai recriar telas de um app mobile/desktop em HTML + CSS + JavaScript PURO.

## CONTEXTO
Projeto: "Sebo das Andorinhas" — sebo de livros usados.
As telas de referência estão em PNG dentro de `referencia/` (renders 2x do Figma).
As imagens/recursos prontos estão em `assets/`.
O guia completo de design (cores, fontes, medidas, textos EXATOS) está em `guia-de-design.md`.

## REGRAS INEGOCIÁVEIS
1. HTML + CSS + JS puro. SEM framework, SEM build, SEM node_modules, SEM TypeScript, SEM React.
2. Mobile-first: projete primeiro para 390px, depois expanda com `@media (min-width: ...)`.
3. Deve ficar bom em 360px, 390px, 768px, 1024px e 1440px.
4. USE AS IMAGENS DE `assets/` (caminho relativo `../assets/arquivo.png`). NÃO recrie a ilustração com SVG.
5. Textos: use EXATAMENTE o que está no `guia-de-design.md`. Não invente nem tradza.
6. Paleta: use as variáveis CSS do guia. Defina as custom properties no `:root`.
7. COMENTÁRIOS no código — o usuário está aprendendo. Comente cada bloco de CSS e cada função JS.
8. Ícones: SVG inline ou Unicode. NÃO use CDN de ícones (FontAwesome etc).
9. JS: dados mockados em arrays no próprio arquivo. Sem fetch, sem API externa.
10. Acessibilidade: `<label>` real pros inputs, `alt` nas imagens, foco visível.

## ESTRUTURA DE CADA TELA
Pasta própria em `telas/<nome>/` contendo:
- `index.html`
- `style.css`
- `script.js`

## O QUE FAZER AGORA
Crie EXATAMENTE a(s) tela(s) indicada(s) no final deste prompt.
Não crie telas extras. Não refatore outras telas. Foque só no que foi pedido.

Ao final, escreva um arquivo `RELATORIO.md` na raiz do projeto com:
- Quais arquivos você criou
- Como testou (larguras)
- Qualquer decisão de layout que você tomou e por quê
- O que ficou devendo

## IMPORTANTE
Não me explique o código no chat. Apenas crie os arquivos de verdade no disco.
Ao final, responda APENAS com um resumo curto (3-5 linhas) do que foi criado.
