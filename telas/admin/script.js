/* ============================================================
   SEBO DAS ANDORINHAS — TELA ADMIN
   JavaScript puro, sem bibliotecas e sem requisições externas.
   Todo o conteúdo vem dos arrays mockados abaixo.
   ============================================================ */

"use strict";

/* ------------------------------------------------------------
   1. DADOS MOCKADOS
   Cada livro guarda o caminho de uma capa real da pasta assets.
   Para os dois títulos que não têm arquivo de capa (1984 e
   “A menina que roubava livros”), usamos uma capa tipográfica
   feita só com CSS, identificada por "capaClasse".
   ------------------------------------------------------------ */
const livros = [
  {
    id: 1,
    titulo: "1984",
    autor: "George Orwell",
    capa: null,
    capaClasse: "cover-art--1984",
    categoria: "Ficção"
  },
  {
    id: 2,
    titulo: "Moby Dick",
    autor: "Herman Melville",
    capa: "../../assets/capa-dom-casmurro.png",
    capaClasse: null,
    categoria: "Romance"
  },
  {
    id: 3,
    titulo: "A menina que roubava livros",
    autor: "Markus Zusak",
    capa: null,
    capaClasse: "cover-art--menina",
    categoria: "Ficção"
  },
  {
    id: 4,
    titulo: "O Alquimista",
    autor: "Paulo Coelho",
    capa: "../../assets/capa-1.png",
    capaClasse: null,
    categoria: "Romance"
  },
  {
    id: 5,
    titulo: "Memórias Póstumas de Brás Cubas",
    autor: "Machado de Assis",
    capa: "../../assets/capa-2.png",
    capaClasse: null,
    categoria: "Literatura"
  },
  {
    id: 6,
    titulo: "Como Fazer Amigos e Influenciar Pessoas",
    autor: "Dale Carnegie",
    capa: "../../assets/capa-3.png",
    capaClasse: null,
    categoria: "Não-ficção"
  },
  {
    id: 7,
    titulo: "Harry Potter e a Pedra Filosofal",
    autor: "J. K. Rowling",
    capa: "../../assets/capa-4.png",
    capaClasse: null,
    categoria: "Infantil"
  },
  {
    id: 8,
    titulo: "Dom Casmurro",
    autor: "Machado de Assis",
    capa: "../../assets/capa-5.png",
    capaClasse: null,
    categoria: "Literatura"
  },
  {
    id: 9,
    titulo: "A Hora da Estrela",
    autor: "Clarice Lispector",
    capa: "../../assets/capa-hora-estrela.png",
    capaClasse: null,
    categoria: "Literatura"
  },
  {
    id: 10,
    titulo: "Dom Quixote",
    autor: "Miguel de Cervantes",
    capa: "../../assets/capa-dom-quixote.png",
    capaClasse: null,
    categoria: "Romance"
  }
];

/* Categorias do gráfico de rosca.
   Os percentuais somam 100% e as cores seguem o print do Figma. */
const categorias = [
  { nome: "Romance", valor: 38.4, cor: "#F26422" },
  { nome: "Filosofia", valor: 30.4, cor: "#F2C015" },
  { nome: "Ficção", valor: 12.5, cor: "#6CC0C8" },
  { nome: "Terror", valor: 10.2, cor: "#58B77B" },
  { nome: "História", valor: 8.5, cor: "#F08C8C" }
];

/* Constantes da paginação (o catálogo fictício tem 234 livros) */
const TOTAL_CATALOGO = 234;
const POR_PAGINA = 10;
const TOTAL_PAGINAS = Math.ceil(TOTAL_CATALOGO / POR_PAGINA);
const PERCENTUAL_PADRAO = "88,4%";

/* ------------------------------------------------------------
   2. REFERÊNCIAS DO DOM
   Guardamos os elementos em constantes para não consultar o
   documento várias vezes.
   ------------------------------------------------------------ */
const latestBooks = document.getElementById("latestBooks");
const quickBooks = document.getElementById("quickBooks");
const emptyState = document.getElementById("emptyState");
const buscaInput = document.getElementById("buscaLivro");
const sortButton = document.getElementById("sortButton");
const paginationInfo = document.getElementById("paginationInfo");
const pagePrev = document.getElementById("pagePrev");
const pageNext = document.getElementById("pageNext");

const donutSvg = document.getElementById("donutSvg");
const donut = document.getElementById("donut");
const donutValue = document.getElementById("donutValue");
const donutLabel = document.getElementById("donutLabel");
const legend = document.getElementById("legend");

const sidebar = document.getElementById("sidebar");
const sidebarOverlay = document.getElementById("sidebarOverlay");
const sidebarClose = document.getElementById("sidebarClose");
const menuToggle = document.getElementById("menuToggle");
const latestMore = document.getElementById("latestMore");

/* ------------------------------------------------------------
   3. ESTADO DA TELA
   ------------------------------------------------------------ */
let termoBusca = "";        // texto digitado no campo
let ordenarAZ = false;      // ordenação alfabética ligada/desligada
let paginaAtual = 1;        // página da pesquisa rápida
let categoriaAtiva = null;  // índice da fatia destacada no gráfico

/* ------------------------------------------------------------
   4. FUNÇÕES AUXILIARES
   ------------------------------------------------------------ */

/* Remove acentos e deixa tudo minúsculo para a busca funcionar
   mesmo quando a pessoa digita “memorias” sem acento. */
function normalizar(texto) {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

/* Formata 38.4 como "38,4%" (padrão brasileiro) */
function formatarPorcentagem(valor) {
  return `${valor.toFixed(1).replace(".", ",")}%`;
}

/* ------------------------------------------------------------
   5. CRIAÇÃO DOS CARDS DE LIVRO
   Esta função devolve o HTML de um livro. É usada tanto na
   seção “Últimos Livros” quanto na “Pesquisa Rápida”.
   ------------------------------------------------------------ */
function criarCardLivro(livro) {
  /* A capa pode ser uma imagem real ou uma capa só de tipografia */
  let capaHTML;

  if (livro.capa) {
    capaHTML = `
      <img
        src="${livro.capa}"
        alt="Capa do livro ${livro.titulo}, de ${livro.autor}"
        loading="lazy"
      />
    `;
  } else {
    /* Elemento com role="img" para o leitor de tela anunciar a capa */
    const marca = livro.capaClasse === "cover-art--menina"
      ? '<span class="cover-art__mark" aria-hidden="true"></span>'
      : "";

    capaHTML = `
      <div
        class="cover-art ${livro.capaClasse}"
        role="img"
        aria-label="Capa do livro ${livro.titulo}, de ${livro.autor}"
      >
        <span class="cover-art__author">${livro.autor}</span>
        <span class="cover-art__title">${livro.titulo}</span>
        ${marca}
      </div>
    `;
  }

  return `
    <article class="book">
      <div class="book__cover">
        ${capaHTML}
      </div>
      <h3 class="book__title" title="${livro.titulo}">${livro.titulo}</h3>
      <p class="book__author">${livro.autor}</p>
    </article>
  `;
}

/* ------------------------------------------------------------
   6. ÚLTIMOS LIVROS CADASTRADOS
   Mostra os 4 primeiros livros do array, uma única vez.
   ------------------------------------------------------------ */
function renderizarUltimosLivros() {
  const ultimos = livros.slice(0, 4);
  latestBooks.innerHTML = ultimos.map(criarCardLivro).join("");
}

/* ------------------------------------------------------------
   7. PESQUISA RÁPIDA + FILTRO + ORDENAÇÃO + PAGINAÇÃO
   ------------------------------------------------------------ */

/* Aplica busca e ordenação, devolvendo uma nova lista. */
function obterLivrosFiltrados() {
  const termo = normalizar(termoBusca);

  let lista = livros.filter((livro) => {
    if (!termo) return true;
    return (
      normalizar(livro.titulo).includes(termo) ||
      normalizar(livro.autor).includes(termo)
    );
  });

  if (ordenarAZ) {
    lista = [...lista].sort((a, b) =>
      a.titulo.localeCompare(b.titulo, "pt-BR", { sensitivity: "base" })
    );
  }

  return lista;
}

/* Desenha a grade e atualiza a paginação.
   Observação: como o mock tem só 10 livros, as setas de página
   giram a mesma amostra para simular a navegação do catálogo. */
function renderizarPesquisa() {
  const filtrados = obterLivrosFiltrados();
  const semResultados = filtrados.length === 0;
  const buscando = termoBusca.trim().length > 0;

  emptyState.hidden = !semResultados;
  quickBooks.hidden = semResultados;

  if (semResultados) {
    quickBooks.innerHTML = "";
    paginationInfo.textContent = `Amostra 0 de ${TOTAL_CATALOGO}`;
    pagePrev.disabled = true;
    pageNext.disabled = true;
    return;
  }

  /* Monta a lista exibida. Sem busca, giramos a amostra conforme
     a página; com busca, mostramos todos os resultados. */
  let visiveis;

  if (buscando) {
    visiveis = filtrados;
  } else {
    const deslocamento = (paginaAtual - 1) % filtrados.length;
    visiveis = filtrados.slice(deslocamento).concat(filtrados.slice(0, deslocamento));
  }

  quickBooks.innerHTML = visiveis.map(criarCardLivro).join("");

  /* Texto “Amostra X de 234” */
  if (buscando) {
    paginationInfo.textContent = `Amostra ${filtrados.length} de ${TOTAL_CATALOGO}`;
  } else {
    const exibidos = Math.min(paginaAtual * POR_PAGINA, TOTAL_CATALOGO);
    paginationInfo.textContent = `Amostra ${exibidos} de ${TOTAL_CATALOGO}`;
  }

  /* As setas ficam desativadas quando não há outra página possível */
  pagePrev.disabled = buscando || paginaAtual === 1;
  pageNext.disabled = buscando || paginaAtual >= TOTAL_PAGINAS;
}

/* Volta para a primeira página — usado ao filtrar ou ordenar */
function reiniciarPaginacao() {
  paginaAtual = 1;
}

/* ------------------------------------------------------------
   8. GRÁFICO DE ROSCA (DONUT)
   Cada categoria vira um <circle> SVG. O comprimento do traço
   é calculado com pathLength="100", o que simplifica a conta:
   dasharray em “porcentagem” e dashoffset acumulado.
   ------------------------------------------------------------ */
const SVG_NS = "http://www.w3.org/2000/svg";

function criarGrafico() {
  /* Espaço entre fatias, em unidades do pathLength (0 a 100) */
  const lacuna = 1.1;
  let acumulado = 0;

  categorias.forEach((categoria, indice) => {
    const comprimento = Math.max(categoria.valor - lacuna, 0.4);

    const segmento = document.createElementNS(SVG_NS, "circle");
    segmento.setAttribute("cx", "100");
    segmento.setAttribute("cy", "100");
    segmento.setAttribute("r", "70");
    segmento.setAttribute("pathLength", "100");
    segmento.setAttribute("stroke", categoria.cor);
    /* dasharray: traço visível + espaço restante */
    segmento.setAttribute("stroke-dasharray", `${comprimento} ${100 - comprimento}`);
    /* dashoffset negativo começa a fatia depois das anteriores */
    segmento.setAttribute("stroke-dashoffset", `${-acumulado}`);

    segmento.setAttribute("class", "donut__segment");
    segmento.setAttribute("role", "button");
    segmento.setAttribute("tabindex", "0");
    segmento.setAttribute("aria-label", `${categoria.nome}: ${formatarPorcentagem(categoria.valor)}`);
    segmento.setAttribute("aria-pressed", "false");

    /* Clique e teclado (Enter/Espaço) selecionam a categoria */
    segmento.addEventListener("click", () => selecionarCategoria(indice));
    segmento.addEventListener("keydown", (evento) => {
      if (evento.key === "Enter" || evento.key === " ") {
        evento.preventDefault();
        selecionarCategoria(indice);
      }
    });

    donutSvg.appendChild(segmento);
    acumulado += categoria.valor;
  });

  /* Legenda com botões (melhor acessibilidade que divs) */
  legend.innerHTML = categorias
    .map((categoria, indice) => `
      <li>
        <button
          class="legend__button"
          type="button"
          data-indice="${indice}"
          aria-pressed="false"
        >
          <span class="legend__dot" style="--dot-color: ${categoria.cor}" aria-hidden="true"></span>
          <span class="legend__name">${categoria.nome}</span>
          <span class="legend__value">${formatarPorcentagem(categoria.valor)}</span>
        </button>
      </li>
    `)
    .join("");

  /* Um único listener resolve os 5 botões da legenda */
  legend.addEventListener("click", (evento) => {
    const botao = evento.target.closest(".legend__button");
    if (!botao) return;
    selecionarCategoria(Number(botao.dataset.indice));
  });
}

/* Destaca uma fatia e mostra o valor no centro do donut.
   Clicar de novo na mesma categoria limpa a seleção. */
function selecionarCategoria(indice) {
  categoriaAtiva = categoriaAtiva === indice ? null : indice;

  const segmentos = donutSvg.querySelectorAll(".donut__segment");
  const botoes = legend.querySelectorAll(".legend__button");

  segmentos.forEach((segmento, i) => {
    const ativo = i === categoriaAtiva;
    segmento.classList.toggle("is-active", ativo);
    segmento.setAttribute("aria-pressed", String(ativo));
  });

  botoes.forEach((botao, i) => {
    botao.setAttribute("aria-pressed", String(i === categoriaAtiva));
  });

  donut.classList.toggle("is-highlighting", categoriaAtiva !== null);
  donut.classList.toggle("has-active", categoriaAtiva !== null);

  if (categoriaAtiva === null) {
    donutValue.textContent = PERCENTUAL_PADRAO;
    donutLabel.textContent = "";
    return;
  }

  donutValue.textContent = formatarPorcentagem(categorias[categoriaAtiva].valor);
  donutLabel.textContent = categorias[categoriaAtiva].nome;
}

/* ------------------------------------------------------------
   9. MENU MOBILE
   Abre/fecha a sidebar deslizante e mantém a página sem rolagem
   enquanto o menu está aberto.
   ------------------------------------------------------------ */
const telaDeTablet = window.matchMedia("(min-width: 768px)");

function abrirMenu() {
  sidebar.classList.add("is-open");
  sidebarOverlay.classList.add("is-visible");
  menuToggle.setAttribute("aria-expanded", "true");
  menuToggle.setAttribute("aria-label", "Fechar menu");
  document.body.classList.add("no-scroll");
}

function fecharMenu(devolverFoco = false) {
  sidebar.classList.remove("is-open");
  sidebarOverlay.classList.remove("is-visible");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Abrir menu");
  document.body.classList.remove("no-scroll");

  if (devolverFoco) {
    menuToggle.focus();
  }
}

function configurarMenu() {
  menuToggle.addEventListener("click", () => {
    const estaAberto = sidebar.classList.contains("is-open");
    if (estaAberto) {
      fecharMenu(true);
    } else {
      abrirMenu();
    }
  });

  sidebarClose.addEventListener("click", () => fecharMenu(true));
  sidebarOverlay.addEventListener("click", () => fecharMenu(true));

  /* Fecha com Esc e devolve o foco para o botão que abriu */
  document.addEventListener("keydown", (evento) => {
    if (evento.key === "Escape" && sidebar.classList.contains("is-open")) {
      fecharMenu(true);
    }
  });

  /* Ao clicar em um link do menu, fecha a gaveta no mobile */
  sidebar.querySelectorAll(".nav__item").forEach((link) => {
    link.addEventListener("click", () => {
      if (!telaDeTablet.matches) fecharMenu(false);
    });
  });

  /* Se a janela virar desktop enquanto o menu está aberto, limpa o estado */
  telaDeTablet.addEventListener("change", (evento) => {
    if (evento.matches) fecharMenu(false);
  });
}

/* ------------------------------------------------------------
   10. EVENTOS DE BUSCA, ORDENAÇÃO E PAGINAÇÃO
   ------------------------------------------------------------ */
function configurarPesquisa() {
  /* Filtro em tempo real a cada tecla */
  buscaInput.addEventListener("input", (evento) => {
    termoBusca = evento.target.value;
    reiniciarPaginacao();
    renderizarPesquisa();
  });

  /* Botão de ordenação A–Z */
  sortButton.addEventListener("click", () => {
    ordenarAZ = !ordenarAZ;
    sortButton.setAttribute("aria-pressed", String(ordenarAZ));

    const rotulo = ordenarAZ ? "Ordenar de Z a A (ordem alfabética ativa)" : "Ordenar livros de A a Z";
    sortButton.setAttribute("aria-label", rotulo);
    sortButton.setAttribute("title", rotulo);

    reiniciarPaginacao();
    renderizarPesquisa();
  });

  /* Navegação entre páginas */
  pagePrev.addEventListener("click", () => {
    if (paginaAtual > 1) {
      paginaAtual -= 1;
      renderizarPesquisa();
    }
  });

  pageNext.addEventListener("click", () => {
    if (paginaAtual < TOTAL_PAGINAS) {
      paginaAtual += 1;
      renderizarPesquisa();
    }
  });

  /* A seta da seção “Últimos Livros” leva o foco à pesquisa */
  latestMore.addEventListener("click", () => {
    document.getElementById("quickTitle").scrollIntoView({ behavior: "smooth", block: "start" });
    buscaInput.focus({ preventScroll: true });
  });
}

/* ------------------------------------------------------------
   11. INICIALIZAÇÃO
   Como o script é carregado no fim do <body>, o DOM já existe.
   Renderizamos tudo na ordem: livros, pesquisa, gráfico e menu.
   ------------------------------------------------------------ */
renderizarUltimosLivros();
renderizarPesquisa();
criarGrafico();
configurarMenu();
configurarPesquisa();
