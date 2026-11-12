/* ============================================================
   Sebo das Andorinhas — Recuperação de senha
   JavaScript puro, sem bibliotecas e sem chamadas de API.

   Responsabilidades deste arquivo:
   1. Validar o email digitado.
   2. Mostrar mensagens de erro/sucesso dentro da própria tela.
   3. Trocar o texto do botão de "Enviar" para "Reenviar"
      depois do primeiro envio bem-sucedido.
   ============================================================ */

/* IIFE (Immediately Invoked Function Expression): isola as
   variáveis deste arquivo para não poluir o escopo global. */
(function () {
  "use strict";

  /* ----------------------------------------------------------
     1. REFERÊNCIAS AOS ELEMENTOS DO HTML
     Guardamos cada elemento uma única vez para não ficar
     buscando no DOM a cada clique.
     ---------------------------------------------------------- */
  const form = document.getElementById("recover-form");
  const emailInput = document.getElementById("email");
  const emailShell = document.getElementById("email-shell");
  const feedback = document.getElementById("email-feedback");
  const feedbackText = feedback.querySelector(".feedback__text");
  const submitButton = document.getElementById("submit-button");

  /* ----------------------------------------------------------
     2. TEXTOS E REGRAS
     ---------------------------------------------------------- */
  const SUCCESS_MESSAGE = "Enviamos um link de recuperação para o seu email";
  const EMPTY_ERROR = "Digite o seu email para continuar.";
  const INVALID_ERROR = "Digite um email válido, como fulanodetal@gmail.com";

  const BUTTON_DEFAULT_LABEL = "Enviar";
  const BUTTON_RESEND_LABEL = "Reenviar";

  /* Expressão regular simples de validação de email:
     - algo antes do @
     - algo depois do @
     - um ponto seguido de pelo menos 2 letras no final
     Não tenta cobrir 100% da especificação de emails: é só
     uma checagem amigável para o formulário. */
  const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;

  /* ----------------------------------------------------------
     3. FUNÇÕES AUXILIARES
     ---------------------------------------------------------- */

  /**
   * Verifica se o texto recebido tem o formato de um email.
   * @param {string} value - texto já sem espaços nas pontas
   * @returns {boolean}
   */
  function isValidEmail(value) {
    return EMAIL_PATTERN.test(value);
  }

  /**
   * Mostra a mensagem inline e ajusta o visual do campo.
   * @param {"success"|"error"} state - define as cores da mensagem
   * @param {string} message - texto que será exibido
   */
  function showFeedback(state, message) {
    feedback.hidden = false;
    feedback.dataset.state = state;       // CSS usa [data-state="error"]
    feedbackText.textContent = message;   // textContent evita injeção de HTML
    emailShell.classList.toggle("is-invalid", state === "error");

    /* aria-invalid avisa o leitor de tela que o valor está incorreto */
    if (state === "error") {
      emailInput.setAttribute("aria-invalid", "true");
    } else {
      emailInput.removeAttribute("aria-invalid");
    }
  }

  /**
   * Esconde a mensagem e limpa os estados visuais do campo.
   * Usada quando a pessoa começa a corrigir o email.
   */
  function clearFeedback() {
    feedback.hidden = true;
    feedback.removeAttribute("data-state");
    feedbackText.textContent = "";
    emailShell.classList.remove("is-invalid");
    emailInput.removeAttribute("aria-invalid");
  }

  /**
   * Troca o rótulo do botão principal.
   * @param {string} label - "Enviar" ou "Reenviar"
   */
  function setButtonLabel(label) {
    submitButton.textContent = label;
  }

  /* ----------------------------------------------------------
     4. EVENTO DE ENVIO DO FORMULÁRIO
     ---------------------------------------------------------- */

  /**
   * Trata o clique em "Enviar" (ou a tecla Enter dentro do input).
   * @param {SubmitEvent} event
   */
  function handleSubmit(event) {
    /* Impede o recarregamento da página: quem trata o envio é o JS */
    event.preventDefault();

    /* trim() remove espaços acidentais antes/depois do email */
    const email = emailInput.value.trim();
    emailInput.value = email;

    /* Caso 1: campo vazio */
    if (!email) {
      showFeedback("error", EMPTY_ERROR);
      emailInput.focus();
      return;
    }

    /* Caso 2: texto digitado não parece um email */
    if (!isValidEmail(email)) {
      showFeedback("error", INVALID_ERROR);
      emailInput.focus();
      return;
    }

    /* Caso 3: email válido.
       Como não há backend, simulamos o envio apenas mostrando
       a mensagem de sucesso e mudando o botão para "Reenviar". */
    showFeedback("success", SUCCESS_MESSAGE);
    setButtonLabel(BUTTON_RESEND_LABEL);
  }

  /**
   * Ao digitar novamente, a mensagem antiga deixa de fazer sentido.
   * Também voltamos o botão para "Enviar" porque o email mudou.
   */
  function handleEmailInput() {
    if (!feedback.hidden) {
      clearFeedback();
      setButtonLabel(BUTTON_DEFAULT_LABEL);
    }
  }

  /* ----------------------------------------------------------
     5. LIGAÇÃO DOS EVENTOS
     ---------------------------------------------------------- */
  form.addEventListener("submit", handleSubmit);
  emailInput.addEventListener("input", handleEmailInput);

  /* Garante que a tela sempre comece sem mensagem visível,
     mesmo se o navegador restaurar o formulário ao recarregar. */
  clearFeedback();
  setButtonLabel(BUTTON_DEFAULT_LABEL);
})();
