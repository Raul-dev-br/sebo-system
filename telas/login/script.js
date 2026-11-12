/* ==========================================================================
   SEBO DAS ANDORINHAS — Tela de Login
   --------------------------------------------------------------------------
   JavaScript puro, sem APIs externas.
   Responsabilidades deste arquivo:
     1. Validar e-mail e senha antes de "entrar".
     2. Mostrar / esconder a senha no botão do olho.
     3. Navegar para as telas de entrada e vitrine.
   ========================================================================== */

"use strict";

/* --------------------------------------------------------------------------
   1. DADOS MOCKADOS
   Contas de demonstração ficam em um array no próprio arquivo.
   O protótipo aceita qualquer e-mail válido + senha com 6 caracteres ou mais;
   se o e-mail estiver aqui, guardamos também o nome da pessoa na sessão.
   -------------------------------------------------------------------------- */
const usuariosMock = [
  {
    nome: "Fulano de Tal",
    email: "fulanodetal@gmail.com",
    senha: "senha123"
  }
];

/* Caminhos das outras telas do app (links internos) */
const ROTAS = {
  entrada: "../entrada/index.html",
  recuperarSenha: "../recuperar-senha/index.html",
  vitrine: "../vitrine/index.html"
};

/* --------------------------------------------------------------------------
   2. REFERÊNCIAS DO DOM
   Guardamos os elementos em constantes para não consultar o HTML toda hora.
   -------------------------------------------------------------------------- */
const formulario = document.querySelector("#form-login");
const campoEmail = document.querySelector("#email");
const campoSenha = document.querySelector("#senha");
const botaoOlho = document.querySelector("#toggle-senha");
const botaoVisitante = document.querySelector("#btn-visitante");

/* --------------------------------------------------------------------------
   3. VALIDAÇÃO
   -------------------------------------------------------------------------- */

/**
 * Verifica se o texto tem o formato básico de um e-mail:
 * algo@algo.algo, sem espaços no meio.
 * @param {string} valor
 * @returns {boolean}
 */
function emailValido(valor) {
  const formato = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return formato.test(valor);
}

/**
 * Mostra (ou limpa) o erro de um campo.
 * Também marca o campo com aria-invalid para leitores de tela.
 * @param {HTMLInputElement} campo
 * @param {string} mensagem - vazio limpa o erro
 */
function definirErro(campo, mensagem) {
  const caixa = campo.closest(".input-shell");
  const erro = document.getElementById(`${campo.id}-erro`);
  const temErro = Boolean(mensagem);

  caixa.classList.toggle("is-invalid", temErro);
  campo.setAttribute("aria-invalid", temErro ? "true" : "false");

  if (temErro) {
    erro.textContent = mensagem;
    erro.hidden = false;
  } else {
    erro.textContent = "";
    erro.hidden = true;
  }
}

/**
 * Valida os dois campos e retorna true se estiver tudo certo.
 * As mensagens aparecem embaixo de cada campo.
 * @returns {boolean}
 */
function validarFormulario() {
  const email = campoEmail.value.trim();
  const senha = campoSenha.value;
  let tudoCerto = true;
  let primeiroInvalido = null;

  /* Regras do e-mail */
  if (email === "") {
    definirErro(campoEmail, "Informe o seu email.");
    tudoCerto = false;
    primeiroInvalido = campoEmail;
  } else if (!emailValido(email)) {
    definirErro(campoEmail, "Digite um email válido.");
    tudoCerto = false;
    primeiroInvalido = campoEmail;
  } else {
    definirErro(campoEmail, "");
  }

  /* Regras da senha */
  if (senha === "") {
    definirErro(campoSenha, "Informe a sua senha.");
    tudoCerto = false;
    primeiroInvalido = primeiroInvalido || campoSenha;
  } else if (senha.length < 6) {
    definirErro(campoSenha, "A senha deve ter pelo menos 6 caracteres.");
    tudoCerto = false;
    primeiroInvalido = primeiroInvalido || campoSenha;
  } else {
    definirErro(campoSenha, "");
  }

  /* Leva o foco para o primeiro campo com problema */
  if (primeiroInvalido) {
    primeiroInvalido.focus();
  }

  return tudoCerto;
}

/* --------------------------------------------------------------------------
   4. ENVIO DO FORMULÁRIO
   -------------------------------------------------------------------------- */
formulario.addEventListener("submit", function (evento) {
  evento.preventDefault(); // impede o recarregamento da página

  if (!validarFormulario()) {
    return; // com erro, não navega
  }

  const email = campoEmail.value.trim().toLowerCase();
  const senha = campoSenha.value;

  /* Procura uma conta de demonstração com o mesmo e-mail e senha */
  const conta = usuariosMock.find(function (usuario) {
    return usuario.email.toLowerCase() === email && usuario.senha === senha;
  });

  /* Monta a sessão: usa o nome da conta encontrada ou o início do e-mail */
  const sessao = conta
    ? { nome: conta.nome, email: conta.email }
    : { nome: email.split("@")[0], email: email };

  /* localStorage é nativo do navegador; não é API externa.
     O try/catch evita erro quando o navegador bloqueia o armazenamento. */
  try {
    localStorage.setItem("seboSessao", JSON.stringify(sessao));
  } catch (erro) {
    console.warn("Não foi possível salvar a sessão:", erro);
  }

  /* Tela seguinte do app */
  window.location.href = ROTAS.vitrine;
});

/* --------------------------------------------------------------------------
   5. VISITANTE
   Não exige login: vai direto para a vitrine.
   -------------------------------------------------------------------------- */
botaoVisitante.addEventListener("click", function () {
  window.location.href = ROTAS.vitrine;
});

/* --------------------------------------------------------------------------
   6. MOSTRAR / OCULTAR SENHA
   Troca o type do input e atualiza o ícone, o aria-pressed e o aria-label.
   -------------------------------------------------------------------------- */
botaoOlho.addEventListener("click", function () {
  const senhaEstaVisivel = campoSenha.type === "text";

  if (senhaEstaVisivel) {
    /* Estava visível: esconde de novo */
    campoSenha.type = "password";
    botaoOlho.classList.remove("is-visible");
    botaoOlho.setAttribute("aria-pressed", "false");
    botaoOlho.setAttribute("aria-label", "Mostrar senha");
  } else {
    /* Estava escondida: mostra */
    campoSenha.type = "text";
    botaoOlho.classList.add("is-visible");
    botaoOlho.setAttribute("aria-pressed", "true");
    botaoOlho.setAttribute("aria-label", "Ocultar senha");
  }

  /* O foco permanece no botão para que leitores de tela anunciem a mudança
     de estado (aria-pressed / aria-label) sem tirar a pessoa do lugar. */
});

/* --------------------------------------------------------------------------
   7. LIMPEZA DE ERROS ENQUANTO DIGITA
   Assim a mensagem some assim que a pessoa começa a corrigir.
   -------------------------------------------------------------------------- */
[campoEmail, campoSenha].forEach(function (campo) {
  campo.addEventListener("input", function () {
    definirErro(campo, "");
  });
});

/* --------------------------------------------------------------------------
   8. ATALHO DE TECLADO (ESC)
   Volta para a tela de entrada com a tecla Escape.
   -------------------------------------------------------------------------- */
document.addEventListener("keydown", function (evento) {
  if (evento.key === "Escape") {
    window.location.href = ROTAS.entrada;
  }
});
