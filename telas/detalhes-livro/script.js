/* ==========================================================================
   SEBO DAS ANDORINHAS — DETALHES DO LIVRO
   --------------------------------------------------------------------------
   Este arquivo cuida de quatro coisas:
   1. Dados mockados do livro (arrays/objetos no próprio arquivo)
   2. Preenchimento da ficha técnica, da edição e do endereço
   3. Botão de favorito com memória no localStorage
   4. Acordeões e botão fixo do mobile

   Não há fetch nem API externa: tudo roda no navegador.
   ========================================================================== */

"use strict";

/* ==========================================================================
   1. DADOS MOCKADOS
   Centralizar os dados em um objeto facilita trocar o livro no futuro.
   ========================================================================== */

const LIVRO = {
  id: "dom-quixote",
  titulo: "Dom Quixote",
  autor: "Miguel de Cervantes",

  // Ficha técnica exibida em três colunas (label pequena + valor grande)
  especificacoes: [
    { rotulo: "Páginas", valor: "320" },
    { rotulo: "Ano de Publicação", valor: "1605" },
    { rotulo: "Idioma", valor: "PT-BR" },
  ],

  // Detalhes extras mostrados no acordeão "Detalhes da Edição"
  edicao: [
    { rotulo: "Editora", valor: "Companhia das Letras" },
    { rotulo: "ISBN", valor: "978-85-359-1234-5" },
    { rotulo: "Encadernação", valor: "Brochura" },
    { rotulo: "Dimensões", valor: "14 × 21 cm" },
  ],

  // Localização física do exemplar
  local: {
    endereco: "Rua das Andorinhas, 42 · Centro, São Paulo/SP",
    horario: "Seg a sáb · 9h às 19h",
  },
};

// Chave usada para guardar os favoritos no navegador
const CHAVE_FAVORITOS = "sebo-andorinhas:favoritos";

/* ==========================================================================
   2. ATALHOS PARA O DOM
   Guardamos os elementos em constantes para não buscar várias vezes.
   ========================================================================== */

const listaSpecs = document.querySelector("#specs");
const listaEdicao = document.querySelector("#edition-list");
const enderecoSebo = document.querySelector("#endereco-sebo");
const horarioSebo = document.querySelector("#horario-sebo");
const botaoFavorito = document.querySelector("#btn-favorito");
const statusFavorito = document.querySelector("#status-favorito");
const linkVoltar = document.querySelector("[data-back]");
const ctaFixo = document.querySelector("[data-sticky-cta]");
const linhaPreco = document.querySelector("#buy-row");

/* ==========================================================================
   3. RENDERIZAÇÃO DA FICHA TÉCNICA
   Criamos os elementos com createElement e textContent (mais seguro que
   innerHTML, porque o texto nunca é interpretado como código).
   ========================================================================== */

function renderizarEspecificacoes() {
  // Fragment é uma "caixa invisível": montamos tudo e inserimos de uma vez só
  const fragmento = document.createDocumentFragment();

  LIVRO.especificacoes.forEach((item) => {
    const coluna = document.createElement("div");
    coluna.className = "spec";

    const rotulo = document.createElement("dt");
    rotulo.className = "spec__label";
    rotulo.textContent = item.rotulo;

    const valor = document.createElement("dd");
    valor.className = "spec__value";
    valor.textContent = item.valor;

    coluna.append(rotulo, valor);
    fragmento.append(coluna);
  });

  listaSpecs.append(fragmento);
}

/* ==========================================================================
   4. RENDERIZAÇÃO DOS DETALHES DA EDIÇÃO
   ========================================================================== */

function renderizarEdicao() {
  const fragmento = document.createDocumentFragment();

  LIVRO.edicao.forEach((item) => {
    // <div> dentro de <dl> é permitido no HTML5 e ajuda no layout em linhas
    const linha = document.createElement("div");
    linha.className = "edition__row";

    const rotulo = document.createElement("dt");
    rotulo.className = "edition__label";
    rotulo.textContent = item.rotulo;

    const valor = document.createElement("dd");
    valor.className = "edition__value";
    valor.textContent = item.valor;

    linha.append(rotulo, valor);
    fragmento.append(linha);
  });

  listaEdicao.append(fragmento);
}

/* ==========================================================================
   5. ENDEREÇO DO SEBO
   ========================================================================== */

function renderizarLocal() {
  enderecoSebo.textContent = LIVRO.local.endereco;
  horarioSebo.textContent = LIVRO.local.horario;
}

/* ==========================================================================
   6. FAVORITO
   O estado fica salvo no localStorage para sobreviver a um recarregamento.
   ========================================================================== */

// Lê a lista de favoritos com segurança (o localStorage pode estar bloqueado)
function lerFavoritos() {
  try {
    const dados = JSON.parse(localStorage.getItem(CHAVE_FAVORITOS) || "[]");
    return Array.isArray(dados) ? dados : [];
  } catch (erro) {
    console.warn("Não foi possível ler os favoritos:", erro);
    return [];
  }
}

// Salva a lista de favoritos
function salvarFavoritos(favoritos) {
  try {
    localStorage.setItem(CHAVE_FAVORITOS, JSON.stringify(favoritos));
  } catch (erro) {
    console.warn("Não foi possível salvar os favoritos:", erro);
  }
}

// Atualiza visual, aria-pressed e aria-label do botão
function atualizarBotaoFavorito(ativo) {
  botaoFavorito.classList.toggle("is-active", ativo);
  botaoFavorito.setAttribute("aria-pressed", String(ativo));

  botaoFavorito.setAttribute(
    "aria-label",
    ativo
      ? `Remover ${LIVRO.titulo} dos favoritos`
      : `Adicionar ${LIVRO.titulo} aos favoritos`
  );
}

// Configura o clique e restaura o estado salvo
function configurarFavorito() {
  let favoritos = lerFavoritos();

  // Estado inicial: verifica se este livro já está na lista
  atualizarBotaoFavorito(favoritos.includes(LIVRO.id));

  botaoFavorito.addEventListener("click", () => {
    const ficouAtivo = !botaoFavorito.classList.contains("is-active");

    if (ficouAtivo) {
      // Set evita duplicatas caso o id já exista por algum motivo
      favoritos = [...new Set([...favoritos, LIVRO.id])];
    } else {
      favoritos = favoritos.filter((id) => id !== LIVRO.id);
    }

    salvarFavoritos(favoritos);
    atualizarBotaoFavorito(ficouAtivo);

    // Mensagem anunciada por leitores de tela (a classe .sr-only a esconde)
    statusFavorito.textContent = ficouAtivo
      ? "Adicionado aos favoritos."
      : "Removido dos favoritos.";
  });
}

/* ==========================================================================
   7. ACORDEÕES
   Cada acordeão tem um botão (aria-expanded) e um painel (aria-controls).
   O atributo "inert" remove o painel fechado da navegação por teclado.
   ========================================================================== */

function configurarAcordeoes() {
  const acordeoes = document.querySelectorAll("[data-accordion]");

  acordeoes.forEach((acordeao) => {
    const botao = acordeao.querySelector("[data-accordion-trigger]");
    const painel = acordeao.querySelector("[data-accordion-panel]");

    botao.addEventListener("click", () => {
      const estaAberto = botao.getAttribute("aria-expanded") === "true";
      const vaiAbrir = !estaAberto;

      botao.setAttribute("aria-expanded", String(vaiAbrir));
      acordeao.classList.toggle("is-open", vaiAbrir);

      // Quando abre, o painel volta a ser acessível; quando fecha, fica inerte
      painel.toggleAttribute("inert", !vaiAbrir);
    });

    // Tecla Escape fecha o acordeão e devolve o foco ao botão
    acordeao.addEventListener("keydown", (evento) => {
      if (evento.key === "Escape" && botao.getAttribute("aria-expanded") === "true") {
        botao.click();
        botao.focus();
      }
    });
  });
}

/* ==========================================================================
   8. VOLTAR PARA A VITRINE
   O link já tem o href correto; o JS garante a navegação pedida na spec.
   ========================================================================== */

function configurarVoltar() {
  if (!linkVoltar) return;

  linkVoltar.addEventListener("click", (evento) => {
    // Deixa o navegador cuidar de cliques com modificadores (nova aba, etc.)
    if (evento.metaKey || evento.ctrlKey || evento.shiftKey || evento.altKey) return;

    evento.preventDefault();
    window.location.href = "../vitrine/index.html";
  });
}

/* ==========================================================================
   9. CTA FIXO DO MOBILE
   A barra aparece somente depois que a linha de preço sai pelo topo da tela.
   Usamos IntersectionObserver para não precisar escutar o scroll o tempo todo.
   ========================================================================== */

function configurarCtaFixo() {
  if (!ctaFixo || !linhaPreco) return;

  // Mesmo breakpoint do CSS: abaixo de 1024px existe CTA fixo
  const telaMobile = window.matchMedia("(max-width: 1023px)");
  let observador = null;

  // Mostra/esconde a barra e controla o atributo inert
  function alternarCta(mostrar) {
    const visivel = mostrar && telaMobile.matches;
    ctaFixo.classList.toggle("is-visible", visivel);
    ctaFixo.toggleAttribute("inert", !visivel);
  }

  // Cria (ou recria) o observador conforme o tamanho da tela
  function configurarObservador() {
    if (observador) {
      observador.disconnect();
      observador = null;
    }

    // No desktop a barra é escondida pelo CSS e não precisa ser observada
    if (!telaMobile.matches) {
      alternarCta(false);
      return;
    }

    observador = new IntersectionObserver(
      ([entrada]) => {
        // "Passou" = a linha de preço não está visível e ficou acima da tela
        const passouPeloTopo = !entrada.isIntersecting && entrada.boundingClientRect.top < 0;
        alternarCta(passouPeloTopo);
      },
      { threshold: 0, rootMargin: "0px 0px -10% 0px" }
    );

    observador.observe(linhaPreco);
  }

  configurarObservador();

  // Ao girar o celular ou redimensionar, o observador é reconfigurado
  if (typeof telaMobile.addEventListener === "function") {
    telaMobile.addEventListener("change", configurarObservador);
  } else {
    // Compatibilidade com navegadores antigos
    telaMobile.addListener(configurarObservador);
  }
}

/* ==========================================================================
   10. INICIALIZAÇÃO
   O script está no fim do <body>, então o HTML já está pronto.
   ========================================================================== */

renderizarEspecificacoes();
renderizarEdicao();
renderizarLocal();
configurarFavorito();
configurarAcordeoes();
configurarVoltar();
configurarCtaFixo();
