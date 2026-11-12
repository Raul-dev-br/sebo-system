/* ============================================================
   SEBO DAS ANDORINHAS — VITRINE
   JavaScript puro, sem frameworks e sem requisições externas.
   Todos os livros ficam mockados no array "livros" abaixo.
   ============================================================ */

/* ------------------------------------------------------------
   1. DADOS MOCKADOS
   Observação: alguns arquivos de capa foram extraídos do Figma
   com nomes trocados. Por isso usamos a imagem pelo conteúdo
   visual (ex.: capa-5.png é a capa de Dom Casmurro e
   capa-dom-casmurro.png é a capa de Moby Dick).
   ------------------------------------------------------------ */
const livros = [
  {
    id: 1,
    titulo: "Dom Casmurro",
    autor: "Machado de Assis",
    paginas: 250,
    preco: "35,00",
    categorias: ["Literatura", "Ficção"],
    capa: "../../assets/capa-5.png"
  },
  {
    id: 2,
    titulo: "A hora da estrela",
    autor: "Clarice Lispector",
    paginas: 250,
    preco: "24,00",
    categorias: ["Literatura", "Ficção"],
    capa: "../../assets/capa-hora-estrela.png"
  },
  {
    id: 3,
    titulo: "Moby Dick",
    autor: "Herman Melville",
    paginas: 160,
    preco: "35,00",
    categorias: ["Literatura", "Ficção"],
    capa: "../../assets/capa-dom-casmurro.png"
  },
  {
    id: 4,
    titulo: "O Alquimista",
    autor: "Paulo Coelho",
    paginas: 208,
    preco: "18,00",
    categorias: ["Literatura", "Ficção"],
    capa: "../../assets/capa-1.png"
  },
  {
    id: 5,
    titulo: "Harry Potter e a Pedra Filosofal",
    autor: "J.K. Rowling",
    paginas: 264,
    preco: "32,00",
    categorias: ["Infantil", "Ficção"],
    capa: "../../assets/capa-4.png"
  }
];

/* ------------------------------------------------------------
   2. ELEMENTOS DA PÁGINA
   Guardamos as referências do DOM uma única vez.
   ------------------------------------------------------------ */
const listaEl = document.getElementById("lista");
const vazioEl = document.getElementById("vazio");
const vazioTituloEl = document.getElementById("vazio-titulo");
const vazioTextoEl = document.getElementById("vazio-texto");
const resultadoEl = document.getElementById("resultado-busca");
const buscaEl = document.getElementById("busca");
const formularioBusca = document.querySelector(".search");
const chipsEls = Array.from(document.querySelectorAll(".chip"));
const navEls = Array.from(document.querySelectorAll(".bottom-nav__item"));
const botaoLimpar = document.getElementById("limpar-filtros");
const botaoHero = document.querySelector(".hero__button");
const toastEl = document.getElementById("toast");

/* ------------------------------------------------------------
   3. ESTADO DA TELA
   "favoritos" começa com Dom Casmurro salvo, como na referência.
   ------------------------------------------------------------ */
const favoritos = new Set([1]);
const estado = {
  busca: "",
  categoria: "Todos",
  somenteFavoritos: false
};

/* Controla a animação de entrada apenas na primeira renderização.
   Assim os cards não "piscam" a cada letra digitada na busca. */
let primeiraRenderizacao = true;

/* ------------------------------------------------------------
   4. ÍCONES SVG INLINE
   Ficam em strings para serem reaproveitados em cada card.
   ------------------------------------------------------------ */
const ICONE_PAGINAS = `
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d="M4.5 5.5A2.5 2.5 0 0 1 7 3h12.5v17H7a2.5 2.5 0 0 0-2.5 2.5v-17Z"></path>
    <path d="M4.5 19.5A2.5 2.5 0 0 1 7 17h12.5"></path>
  </svg>
`;

const ICONE_MARCADOR = `
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M6.5 4.5h11v15l-5.5-3.7-5.5 3.7v-15Z"></path>
  </svg>
`;

/* Liga cada categoria à classe CSS que pinta o badge */
const CLASSE_BADGE = {
  "Literatura": "badge--literatura",
  "Ficção": "badge--ficcao",
  "Infantil": "badge--infantil"
};

/* ------------------------------------------------------------
   5. FUNÇÕES AUXILIARES
   ------------------------------------------------------------ */

/**
 * Remove acentos, espaços nas pontas e converte para minúsculas.
 * Isso faz "ficcao" encontrar "Ficção" e "casmurro" encontrar
 * "Casmurro" sem depender de maiúsculas/acentos.
 */
function normalizar(texto) {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

/**
 * Monta o texto que o leitor de tela anuncia quando a lista muda.
 */
function textoResultado(total) {
  if (total === 0) return "Nenhum livro encontrado.";
  if (total === 1) return "1 livro encontrado.";
  return `${total} livros encontrados.`;
}

/**
 * Mostra uma mensagem rápida na parte de baixo da tela.
 */
let timerToast = null;

function mostrarToast(mensagem) {
  clearTimeout(timerToast);
  toastEl.textContent = mensagem;
  toastEl.classList.add("is-visible");

  timerToast = setTimeout(() => {
    toastEl.classList.remove("is-visible");
  }, 2600);
}

/**
 * Rola suavemente até a lista de livros.
 * Respeita a preferência do usuário por menos movimento.
 */
function rolarParaLista() {
  const semMovimento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  document.getElementById("lista-livros").scrollIntoView({
    behavior: semMovimento ? "auto" : "smooth",
    block: "start"
  });
}

/* ------------------------------------------------------------
   6. CRIAÇÃO DO HTML DE UM CARD
   Recebe um objeto do array e devolve uma string de HTML.
   ------------------------------------------------------------ */
function criarCard(livro, indice) {
  const estaFavorito = favoritos.has(livro.id);

  // Monta um badge para cada categoria do livro
  const badges = livro.categorias
    .map((categoria) => {
      const classe = CLASSE_BADGE[categoria] || "";
      return `<span class="badge ${classe}">${categoria}</span>`;
    })
    .join("");

  // Texto do botão de favorito muda conforme o estado atual
  const rotuloFavorito = estaFavorito
    ? `Remover ${livro.titulo} dos favoritos`
    : `Adicionar ${livro.titulo} aos favoritos`;

  return `
    <article class="card${primeiraRenderizacao ? " is-entrando" : ""}" style="--i: ${indice}">

      <!-- Link invisível que ocupa o card todo e leva aos detalhes -->
      <a
        class="card__hit"
        href="../detalhes-livro/index.html"
        aria-label="Ver detalhes de ${livro.titulo}"
      ></a>

      <div class="card__cover">
        <img
          src="${livro.capa}"
          alt="Capa do livro ${livro.titulo}, de ${livro.autor}"
          width="333"
          height="500"
          loading="lazy"
        >
      </div>

      <div class="card__body">
        <h3 class="card__title">${livro.titulo}</h3>
        <p class="card__author">${livro.autor}</p>

        <div class="card__meta">
          <span class="card__meta-item">
            ${ICONE_PAGINAS}
            ${livro.paginas}p
          </span>
          <span class="card__meta-item">
            <span class="card__price-tag" aria-hidden="true">R$</span>
            <span class="sr-only">Preço: R$</span>
            ${livro.preco}
          </span>
        </div>

        <div class="card__badges">${badges}</div>
      </div>

      <button
        class="card__fav${estaFavorito ? " is-favorito" : ""}"
        type="button"
        data-favoritar="${livro.id}"
        aria-pressed="${estaFavorito}"
        aria-label="${rotuloFavorito}"
      >
        ${ICONE_MARCADOR}
      </button>
    </article>
  `;
}

/* ------------------------------------------------------------
   7. FILTRO E RENDERIZAÇÃO
   Combina busca por texto + categoria + modo favoritos.
   ------------------------------------------------------------ */
function obterLivrosFiltrados() {
  const termo = normalizar(estado.busca);

  return livros.filter((livro) => {
    const combinaBusca =
      termo === "" ||
      normalizar(livro.titulo).includes(termo) ||
      normalizar(livro.autor).includes(termo);

    const combinaCategoria =
      estado.categoria === "Todos" ||
      livro.categorias.includes(estado.categoria);

    const combinaFavorito =
      !estado.somenteFavoritos || favoritos.has(livro.id);

    return combinaBusca && combinaCategoria && combinaFavorito;
  });
}

function renderizar() {
  const filtrados = obterLivrosFiltrados();

  // Recria os cards com os dados filtrados
  listaEl.innerHTML = filtrados.map(criarCard).join("");

  const temResultados = filtrados.length > 0;

  listaEl.hidden = !temResultados;
  vazioEl.hidden = temResultados;

  // Ajusta a mensagem do estado vazio conforme o motivo
  if (!temResultados) {
    if (estado.somenteFavoritos) {
      vazioTituloEl.textContent = "Você ainda não favoritou nenhum livro.";
      vazioTextoEl.textContent = "Toque no marcador de um livro para guardá-lo aqui.";
    } else {
      vazioTituloEl.textContent = "Nenhum livro encontrado.";
      vazioTextoEl.textContent = "Tente outro título, autor ou categoria.";
    }
  }

  // Anúncio para leitores de tela
  resultadoEl.textContent = textoResultado(filtrados.length);

  // Depois da primeira renderização, os cards seguintes não animam
  primeiraRenderizacao = false;
}

/* ------------------------------------------------------------
   8. ATUALIZAÇÃO DE CHIPS E NAVEGAÇÃO
   ------------------------------------------------------------ */

/** Marca apenas o chip da categoria escolhida como ativo. */
function atualizarChips() {
  chipsEls.forEach((chip) => {
    const ativo = chip.dataset.categoria === estado.categoria;
    chip.classList.toggle("is-active", ativo);
    chip.setAttribute("aria-pressed", String(ativo));
  });
}

/** Marca apenas o item de navegação correspondente como ativo. */
function atualizarNav(nome) {
  navEls.forEach((item) => {
    const ativo = item.dataset.nav === nome;
    item.classList.toggle("is-active", ativo);

    if (ativo) {
      item.setAttribute("aria-current", "page");
    } else {
      item.removeAttribute("aria-current");
    }
  });
}

/** Volta busca, categoria e favoritos ao estado inicial. */
function limparFiltros() {
  estado.busca = "";
  estado.categoria = "Todos";
  estado.somenteFavoritos = false;
  buscaEl.value = "";

  atualizarChips();
  atualizarNav("inicio");
  renderizar();
  buscaEl.focus();
}

/* ------------------------------------------------------------
   9. EVENTOS
   ------------------------------------------------------------ */

// Busca em tempo real: cada alteração no input refaz a lista
buscaEl.addEventListener("input", () => {
  estado.busca = buscaEl.value;
  renderizar();
});

// Enter dentro do campo não recarrega a página
formularioBusca.addEventListener("submit", (evento) => {
  evento.preventDefault();
});

// Esc limpa a busca quando o campo está focado
buscaEl.addEventListener("keydown", (evento) => {
  if (evento.key === "Escape" && buscaEl.value !== "") {
    buscaEl.value = "";
    estado.busca = "";
    renderizar();
  }
});

// Clique nos chips de categoria
chipsEls.forEach((chip) => {
  chip.addEventListener("click", () => {
    estado.categoria = chip.dataset.categoria;
    atualizarChips();
    renderizar();
  });
});

// Botão "Explorar Achados": rola até a lista
botaoHero.addEventListener("click", (evento) => {
  evento.preventDefault();
  rolarParaLista();
});

// Botão do estado vazio
botaoLimpar.addEventListener("click", limparFiltros);

// Delegação de evento: um único listener cuida de todos os marcadores
listaEl.addEventListener("click", (evento) => {
  const botao = evento.target.closest("[data-favoritar]");

  // Se o clique não foi no marcador, deixa o link do card funcionar
  if (!botao) return;

  evento.preventDefault();
  evento.stopPropagation();

  const id = Number(botao.dataset.favoritar);
  const livro = livros.find((item) => item.id === id);
  if (!livro) return;

  const jaEraFavorito = favoritos.has(id);

  if (jaEraFavorito) {
    favoritos.delete(id);
  } else {
    favoritos.add(id);
  }

  const agoraFavorito = !jaEraFavorito;

  // Atualiza o botão imediatamente (sem esperar nova renderização)
  botao.classList.toggle("is-favorito", agoraFavorito);
  botao.setAttribute("aria-pressed", String(agoraFavorito));
  botao.setAttribute(
    "aria-label",
    agoraFavorito
      ? `Remover ${livro.titulo} dos favoritos`
      : `Adicionar ${livro.titulo} aos favoritos`
  );

  mostrarToast(
    agoraFavorito
      ? `“${livro.titulo}” foi adicionado aos favoritos.`
      : `“${livro.titulo}” foi removido dos favoritos.`
  );

  // Na visão de favoritos, o card removido precisa sumir
  if (estado.somenteFavoritos) {
    renderizar();
  }
});

// Navegação inferior
navEls.forEach((item) => {
  item.addEventListener("click", () => {
    const destino = item.dataset.nav;

    if (destino === "inicio") {
      estado.somenteFavoritos = false;
      atualizarNav("inicio");
      renderizar();
      window.scrollTo({
        top: 0,
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth"
      });
      return;
    }

    if (destino === "livros") {
      estado.somenteFavoritos = false;
      atualizarNav("livros");
      renderizar();
      rolarParaLista();
      return;
    }

    if (destino === "favoritos") {
      // Alterna entre "todos" e "somente favoritos"
      estado.somenteFavoritos = !estado.somenteFavoritos;
      atualizarNav(estado.somenteFavoritos ? "favoritos" : "inicio");
      renderizar();
      rolarParaLista();

      mostrarToast(
        estado.somenteFavoritos
          ? "Mostrando somente os seus favoritos."
          : "Mostrando todos os livros."
      );
      return;
    }

    // Perfil ainda não tem tela neste protótipo
    mostrarToast("A área de perfil estará disponível em breve.");
  });
});

/* ------------------------------------------------------------
   10. INICIALIZAÇÃO
   A primeira renderização acontece assim que o script carrega
   (ele está no fim do body, então o DOM já existe).
   ------------------------------------------------------------ */
atualizarChips();
renderizar();
