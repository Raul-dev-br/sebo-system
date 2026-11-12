/* ==========================================================================
   SEBO DAS ANDORINHAS — TELA DE ENTRADA
   Comportamento: navegação com uma pequena transição de saída.
   Sem bibliotecas, sem requisições externas.
   ========================================================================== */

/* --------------------------------------------------------------------------
   1. Atalhos para os elementos da página
   -------------------------------------------------------------------------- */
// Todos os botões que possuem um destino guardado em data-destino
const botoes = document.querySelectorAll(".botao[data-destino]");

// Evita que um clique duplo dispare a navegação duas vezes
let navegando = false;

/* --------------------------------------------------------------------------
   2. Funções
   -------------------------------------------------------------------------- */

/**
 * Devolve true quando o usuário quer abrir o link em outra aba/janela
 * (Ctrl/Cmd/Shift + clique ou clique com o botão do meio).
 * Nesses casos não interceptamos o clique.
 */
function querAbrirEmOutraAba(evento) {
  return (
    evento.metaKey ||
    evento.ctrlKey ||
    evento.shiftKey ||
    evento.altKey ||
    evento.button !== 0
  );
}

/**
 * Aplica a classe "saindo" no body e só depois troca de página.
 * A animação dura 200ms no CSS; usamos 220ms como margem de segurança.
 * Se o usuário prefere menos movimento, navega na hora.
 */
function navegarComTransicao(evento) {
  const link = evento.currentTarget;
  const destino = link.dataset.destino;

  // Se o navegador já vai abrir em outra aba, deixa o comportamento padrão agir
  if (!destino || querAbrirEmOutraAba(evento)) {
    return;
  }

  // Impede a navegação imediata para conseguirmos mostrar a transição
  evento.preventDefault();

  // Ignora cliques repetidos enquanto a saída está acontecendo
  if (navegando) {
    return;
  }
  navegando = true;

  // Respeita a preferência de acessibilidade por menos movimento
  const semMovimento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (semMovimento) {
    window.location.href = destino;
    return;
  }

  // Inicia a animação de saída definida no CSS
  document.body.classList.add("saindo");

  // Aguarda o fim da transição e então troca de página
  window.setTimeout(function () {
    window.location.href = destino;
  }, 220);
}

/* --------------------------------------------------------------------------
   3. Ligação dos eventos
   -------------------------------------------------------------------------- */
botoes.forEach(function (botao) {
  botao.addEventListener("click", navegarComTransicao);
});

/* --------------------------------------------------------------------------
   4. Rede de segurança do botão "voltar"
   Ao voltar pelo histórico do navegador a página pode reaparecer com a classe
   "saindo" (que deixa tudo transparente). Aqui limpamos esse estado.
   -------------------------------------------------------------------------- */
window.addEventListener("pageshow", function (evento) {
  if (evento.persisted) {
    document.body.classList.remove("saindo");
    navegando = false;
  }
});
