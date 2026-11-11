/* Módulo da overlay de projeto.
   - Intercepta cliques nos cards .pw-card em /works.html
   - Faz fetch do HTML do projeto, extrai <main class="proj">
   - Injeta na overlay sem sair da works (scroll e filtro preservados)
   - pushState + popstate pra URL e back do browser funcionarem
   - X, ESC e "Voltar para works" fecham TUDO de uma vez (pulam todos os projetos)
   - Botão voltar do navegador volta 1 passo por vez
   - Preload no hover dos cards pra parecer instantâneo
   - Troca entre projetos (próximo/anterior) com animação de fade + slide
   - Durações de troca lidas DENTRO da função — HMR aplica sem reload */

import { initProjetoNav } from "./projeto-nav.js";

const cache = new Map();

export function initProjectOverlay() {
  if (!document.body.classList.contains("pagina-works")) return;

  const ov = document.getElementById("ov");
  const conteudo = document.getElementById("ov-conteudo");
  const painel = document.getElementById("ov-painel");
  const btnFechar = ov ? ov.querySelector(".ov__fechar") : null;
  if (!ov || !conteudo || !painel) return;

  const reduzMov = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function lerDuracao(nomeVar, fallbackMs) {
    const cs = getComputedStyle(ov);
    const valor = (cs.getPropertyValue(nomeVar) || "").trim();
    if (!valor) return fallbackMs;
    if (valor.endsWith("ms")) return parseFloat(valor);
    if (valor.endsWith("s")) return parseFloat(valor) * 1000;
    return fallbackMs;
  }

  /* abertura / fechamento — lidas uma vez (CSS controla as transitions do painel) */
  const DUR_PAINEL = reduzMov ? 20 : lerDuracao("--ov-dur-painel", 550);
  const DUR_SAIDA  = DUR_PAINEL + 40;

  let idAtual = null;
  let animando = false;
  let cardOrigem = null;
  let scrollOrigem = 0;

  /* ---------- profundidade no histórico ---------- */
  function idxAtual() {
    return (history.state && history.state.idx) || 0;
  }

  function pushProjeto(id, url) {
    const proximoIdx = idxAtual() + 1;
    history.pushState({ overlay: id, idx: proximoIdx }, "", url);
  }

  function fecharTudo() {
    const idx = idxAtual();
    if (idx > 0) {
      history.go(-idx);
    } else {
      fechar();
    }
  }

  /* ---------- fetch + cache ---------- */
  async function fetchProjeto(url) {
    if (cache.has(url)) return cache.get(url);
    const r = await fetch(url);
    if (!r.ok) throw new Error("fetch " + r.status);
    const texto = await r.text();
    const doc = new DOMParser().parseFromString(texto, "text/html");
    const main = doc.querySelector("main.proj");
    if (!main) throw new Error("main.proj não encontrado");
    const titulo = (doc.querySelector("title") || {}).textContent || "Projeto";
    const payload = { html: main.outerHTML, titulo };
    cache.set(url, payload);
    return payload;
  }

  function preload(url) {
    if (cache.has(url)) return;
    fetchProjeto(url).catch(function () {});
  }

  /* ---------- scroll ---------- */
  function travarScroll() {
    scrollOrigem = window.scrollY || window.pageYOffset || 0;
    document.body.style.position = "fixed";
    document.body.style.top = -scrollOrigem + "px";
    document.body.style.width = "100%";
    document.body.classList.add("ov-aberta");
  }

  function destravarScroll() {
    const pos = scrollOrigem;
    document.body.style.position = "";
    document.body.style.top = "";
    document.body.style.width = "";
    document.body.classList.remove("ov-aberta");

    const html = document.documentElement;
    const anterior = html.style.scrollBehavior;
    html.style.scrollBehavior = "auto";
    window.scrollTo(0, pos);
    html.style.scrollBehavior = anterior;
  }

  /* ---------- animação da troca entre projetos ----------
     Lê as durações DENTRO da função pra sempre pegar o valor atual
     do CSS. Assim, mexer em --ov-dur-troca-* aplica sem reload. */
  async function trocarConteudo(payload) {
    const DUR_TROCA_SAIDA   = reduzMov ? 20 : lerDuracao("--ov-dur-troca-saida", 240);
    const DUR_TROCA_ENTRADA = reduzMov ? 20 : lerDuracao("--ov-dur-troca-entrada", 400);

    /* SAÍDA */
    conteudo.getAnimations().forEach(function (a) { a.cancel(); });
    await conteudo.animate(
      [
        { opacity: 1, transform: "translateY(0)" },
        { opacity: 0, transform: "translateY(-16px)" }
      ],
      { duration: DUR_TROCA_SAIDA, easing: "ease-in", fill: "forwards" }
    ).finished;

    /* TROCA */
    conteudo.innerHTML = payload.html;
    document.title = payload.titulo;
    painel.scrollTop = 0;
    initProjetoNav(conteudo);

    /* força reflow */
    void conteudo.offsetHeight;

    /* ENTRADA */
    conteudo.getAnimations().forEach(function (a) { a.cancel(); });
    await conteudo.animate(
      [
        { opacity: 0, transform: "translateY(24px)" },
        { opacity: 1, transform: "translateY(0)" }
      ],
      { duration: DUR_TROCA_ENTRADA, easing: "cubic-bezier(0.2, 0.8, 0.2, 1)", fill: "forwards" }
    ).finished;
    conteudo.getAnimations().forEach(function (a) { a.cancel(); });
  }

  /* ---------- abrir ---------- */
  async function abrir(url, id, card) {
    if (animando || idAtual === id) return;
    animando = true;
    if (card) cardOrigem = card;

    /* TROCA com overlay já aberta — anima saída/entrada */
    if (idAtual) {
      let payload;
      try {
        payload = await fetchProjeto(url);
      } catch (e) {
        window.location.href = url;
        return;
      }
      await trocarConteudo(payload);
      idAtual = id;
      animando = false;
      return;
    }

    /* PRIMEIRA abertura */
    let payload;
    try {
      payload = await fetchProjeto(url);
    } catch (e) {
      window.location.href = url;
      return;
    }

    conteudo.innerHTML = payload.html;
    document.title = payload.titulo;
    initProjetoNav(conteudo);
    idAtual = id;

    travarScroll();
    ov.setAttribute("aria-hidden", "false");
    void ov.offsetHeight;
    ov.classList.add("is-open");

    if (btnFechar) {
      setTimeout(function () {
        try { btnFechar.focus({ preventScroll: true }); } catch (e) {}
      }, 100);
    }

    setTimeout(function () { animando = false; }, DUR_PAINEL + 50);
  }

  /* ---------- fechar ---------- */
  async function fechar() {
    if (animando || !idAtual) return;
    animando = true;

    ov.classList.remove("is-open");
    ov.setAttribute("aria-hidden", "true");

    await new Promise(function (r) { setTimeout(r, DUR_SAIDA); });

    conteudo.innerHTML = "";
    idAtual = null;

    document.title = "Chico Martins · Works";
    destravarScroll();

    if (cardOrigem && typeof cardOrigem.focus === "function") {
      try { cardOrigem.focus({ preventScroll: true }); } catch (e) {}
    }
    cardOrigem = null;

    animando = false;
  }

  /* ---------- cliques nos cards ---------- */
  document.addEventListener("click", function (e) {
    const card = e.target.closest(".pw-card");
    if (!card) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;

    e.preventDefault();
    const url = card.getAttribute("href");
    const id = card.dataset.id;
    if (!url || !id) return;

    pushProjeto(id, url);
    abrir(url, id, card);
  });

  /* ---------- preload no hover ---------- */
  document.addEventListener("mouseover", function (e) {
    const card = e.target.closest(".pw-card");
    if (!card) return;
    const related = e.relatedTarget && e.relatedTarget.closest
      ? e.relatedTarget.closest(".pw-card")
      : null;
    if (related === card) return;
    const url = card.getAttribute("href");
    if (url) preload(url);
  });

  /* ---------- X / backdrop ---------- */
  ov.addEventListener("click", function (e) {
    if (e.target.closest("[data-ov-fechar]")) {
      e.preventDefault();
      fecharTudo();
    }
  });

  /* ---------- links internos da overlay ---------- */
  conteudo.addEventListener("click", function (e) {
    const link = e.target.closest("a");
    if (!link) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;

    const href = link.getAttribute("href");
    if (!href) return;

    /* "voltar para works" — fecha tudo */
    if (href === "/works.html" || href === "works.html") {
      e.preventDefault();
      fecharTudo();
      return;
    }

    /* "próximo projeto" E "projeto anterior" — empilha e anima */
    if (href.indexOf("/works/") === 0 && href.slice(-5) === ".html") {
      e.preventDefault();
      const id = href.split("/").pop().replace(".html", "");
      pushProjeto(id, href);
      abrir(href, id, null);
      return;
    }
  });

  /* ---------- ESC ---------- */
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && idAtual) {
      fecharTudo();
    }
  });

  /* ---------- back/forward ---------- */
  window.addEventListener("popstate", function (e) {
    if (e.state && e.state.overlay) {
      const id = e.state.overlay;
      const url = "/works/" + id + ".html";
      abrir(url, id, null);
    } else {
      fechar();
    }
  });

  /* ---------- estado inicial ---------- */
  if (!history.state) {
    history.replaceState({ works: true, idx: 0 }, "", location.href);
  }
}