import { reduzMovimento } from "./utils.js";

/* Configuração de envio do formulário.
   modo: "mailto" → abre o app de e-mail do usuário
   modo: "direto" → faz POST pro endpoint configurado */
const CONFIG_ENVIO = {
  modo: "mailto",
  destino: "francisco.maemd@gmail.com",
  endpoint: ""
};

export function initForm() {

  const form = document.getElementById("form-contato");
  if (!form) return;

  const status = document.getElementById("form-status");
  const botao = document.getElementById("btn-enviar");
  const rotuloOriginal = botao ? botao.innerHTML : "";
  const REGRA_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  const CAMPOS = [
    { id: "nome", msg: "informe seu nome." },
    {
      id: "email",
      msg: "informe um e-mail válido.",
      teste: function (v) {
        return REGRA_EMAIL.test(v);
      }
    },
    { id: "assunto", msg: "diga qual é o assunto." },
    { id: "mensagem", msg: "escreva sua mensagem." }
  ];

  function setStatus(tipo, texto) {
    status.hidden = false;
    status.className = "form-status " + tipo;
    status.textContent = texto;
  }

  function erroDe(campo, msg) {
    const el = document.getElementById(campo.id);
    const err = document.getElementById("erro-" + campo.id);
    if (msg) {
      el.setAttribute("aria-invalid", "true");
      err.textContent = msg;
      err.classList.add("show");
    } else {
      el.removeAttribute("aria-invalid");
      err.textContent = "";
      err.classList.remove("show");
    }
  }

  function validar() {
    let primeiroInvalido = null;
    CAMPOS.forEach(function (c) {
      const el = document.getElementById(c.id);
      const v = el.value.trim();
      let msg = "";
      if (!v) msg = c.msg;
      else if (c.teste && !c.teste(v)) msg = c.msg;
      erroDe(c, msg);
      if (msg && !primeiroInvalido) primeiroInvalido = el;
    });
    if (primeiroInvalido) primeiroInvalido.focus();
    return !primeiroInvalido;
  }

  CAMPOS.forEach(function (c) {
    document.getElementById(c.id).addEventListener("input", function () {
      erroDe(c, "");
    });
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    status.hidden = true;
    if (!validar()) return;

    const dados = {
      nome: document.getElementById("nome").value.trim(),
      email: document.getElementById("email").value.trim(),
      assunto: document.getElementById("assunto").value.trim(),
      mensagem: document.getElementById("mensagem").value.trim()
    };

    botao.disabled = true;
    botao.innerHTML = "enviando…";
    setStatus("info", "enviando…");

    function liberar() {
      botao.disabled = false;
      botao.innerHTML = rotuloOriginal;
    }

    if (CONFIG_ENVIO.modo === "direto" && CONFIG_ENVIO.endpoint) {
      fetch(CONFIG_ENVIO.endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dados)
      })
        .then(function (r) {
          if (!r.ok) throw new Error("http " + r.status);
        })
        .then(function () {
          setStatus("ok", "mensagem enviada! retorno em até 48h úteis.");
          form.reset();
        })
        .catch(function () {
          setStatus("erro", "não consegui enviar agora. tente de novo ou me chame no WhatsApp.");
        })
        .finally(liberar);
    } else {
      setTimeout(
        function () {
          const corpo =
            "nome: " + dados.nome + "\n" + "e-mail: " + dados.email + "\n\n" + dados.mensagem;
          window.location.href =
            "mailto:" +
            CONFIG_ENVIO.destino +
            "?subject=" +
            encodeURIComponent(dados.assunto + " — via site") +
            "&body=" +
            encodeURIComponent(corpo);
          setStatus(
            "ok",
            "pronto! abrimos seu app de e-mail com tudo preenchido. se não abriu, escreva para " +
              CONFIG_ENVIO.destino +
              "."
          );
          liberar();
        },
        reduzMovimento ? 0 : 450
      );
    }
  });
}
