/* Módulo da página de Works.
   - Renderiza 3 grids independentes (todos / games / brands)
   - Cada grid tem seus próprios cards e spans — controle individual
   - Filtro faz fade out → troca grid → fade in
   - Reveal de entrada por IntersectionObserver
   - Esconde o aviso "role para ver mais" após o primeiro scroll
   - A11y: aria-pressed nos filtros + região aria-live de anúncio
   - Navegação por setas entre os cards do grid ativo */

import { PROJETOS } from "./data-projetos.js";

/* Ritmo assimétrico do mobile — cada projeto recebe um par (width, align). */
const RITMO_MOBILE = [
  { w: "100%", a: "flex-start" },
  { w: "86%",  a: "flex-end"   },
  { w: "72%",  a: "flex-start" },
  { w: "100%", a: "flex-start" },
  { w: "80%",  a: "flex-end"   },
  { w: "94%",  a: "flex-start" },
  { w: "74%",  a: "flex-end"   }
];

const SETA_SVG =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" ' +
  'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
  '<path d="M5 12h14M13 6l6 6-6 6"/></svg>';

export function initWorks() {
  const wrapper = document.getElementById("works-grid");
  if (!wrapper) return;

  const contador = document.getElementById("works-contador");
  const aviso = document.getElementById("works-scroll-aviso");
  const anuncio = document.getElementById("works-anuncio");
  const botoes = document.querySelectorAll(".filtro");
  const reduzMov = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- helpers de render ---- */
  function cardHTML(p, i) {
    const ritmo = RITMO_MOBILE[i % RITMO_MOBILE.length];
    const conteudoThumb = p.img 
      ? '<img src="' + p.img + '" alt="Capa do projeto ' + p.nome + '" loading="lazy" />'
      : '<span class="pw-thumb-nome">' + p.nome + ' — thumb</span>';

    return (
      '<a class="pw-card pw-card--' + p.id + '" ' +
        'data-id="' + p.id + '" ' +
        'data-cat="' + p.cat + '" ' +
        'href="/works/' + p.id + '.html" ' +
        'aria-label="' + p.nome + ' — abrir projeto" ' +
        'style="--stagger:' + (i * 40) + 'ms; ' +
               '--m-width:' + ritmo.w + '; ' +
               '--m-align:' + ritmo.a + '">' +
        '<span class="pw-thumb">' +
          conteudoThumb +
        '</span>' +
        '<span class="pw-info">' +
          '<span></span>' + // Espaçador invisível que empurra tudo pra baixo
          '<span class="pw-cat">' +
            (p.cat === "games" ? "Games / Creators" : "Brands") +
          '</span>' +
          '<span class="pw-linha-titulo">' +
            '<span class="pw-nome">' + p.nome + '</span>' +
            '<span class="pw-seta">' + SETA_SVG + '</span>' +
          '</span>' +
        '</span>' +
      '</a>'
    );
  }

  function gridHTML(filtro) {
    const cards = PROJETOS.filter(function (p) {
      return filtro === "todos" || p.cat === filtro;
    });
    return (
      '<div class="pw-grid pw-grid--' + filtro + '" data-filtro="' + filtro + '">' +
        cards.map(cardHTML).join("") +
      '</div>'
    );
  }

  /* ---- render dos 3 grids ---- */
  wrapper.innerHTML = gridHTML("todos") + gridHTML("games") + gridHTML("brands");
  wrapper.querySelector('.pw-grid[data-filtro="todos"]').classList.add("is-active");

  /* ---- reveal de entrada ---- */
  if (reduzMov || !("IntersectionObserver" in window)) {
    wrapper.querySelectorAll(".pw-card").forEach(function (c) {
      c.classList.add("is-in");
    });
  } else {
    /* cards nos grids escondidos: já entram visíveis */
    wrapper.querySelectorAll('.pw-grid:not(.is-active) .pw-card').forEach(function (c) {
      c.classList.add("is-in");
    });

    /* cards no grid ativo: IO revela conforme entra na viewport */
    const cards = wrapper.querySelectorAll('.pw-grid.is-active .pw-card');
    const obs = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.classList.add("is-in");
        obs.unobserve(en.target);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    cards.forEach(function (c) { obs.observe(c); });
  }

  /* ---- filtro: fade out → troca grid → fade in ---- */
  let animando = false;
  let filtroAtual = "todos";

  function trocarGrids(novoFiltro) {
    wrapper.querySelectorAll(".pw-grid").forEach(function (g) {
      g.classList.toggle("is-active", g.dataset.filtro === novoFiltro);
    });

    /* garante que os cards do grid que está sendo mostrado já estejam com .is-in */
    wrapper.querySelectorAll(
      '.pw-grid[data-filtro="' + novoFiltro + '"] .pw-card'
    ).forEach(function (c) {
      c.classList.add("is-in");
    });

    const total = wrapper.querySelectorAll(
      '.pw-grid[data-filtro="' + novoFiltro + '"] .pw-card'
    ).length;

    if (contador) {
      contador.textContent = "01 — " + String(total).padStart(2, "0");
    }

    if (anuncio) {
      const rotulo = novoFiltro === "todos"
        ? "todos os projetos"
        : (novoFiltro === "games" ? "Games e Creators" : "Brands");
      anuncio.textContent = total + " projetos exibidos em " + rotulo + ".";
    }
  }

  async function aplicarFiltro(novoFiltro) {
    if (animando || novoFiltro === filtroAtual) return;
    animando = true;

    const DUR_FADE_OUT = 400;
    const DUR_FADE_IN  = 550;

    if (reduzMov) {
      trocarGrids(novoFiltro);
      filtroAtual = novoFiltro;
      animando = false;
      return;
    }

    /* 1. fade out do wrapper */
    await wrapper.animate(
      [{ opacity: 1 }, { opacity: 0 }],
      { duration: DUR_FADE_OUT, easing: "ease-in", fill: "forwards" }
    ).finished;

    /* 2. troca grid (invisível) */
    trocarGrids(novoFiltro);

    /* 3. fade in */
    wrapper.getAnimations().forEach(function (a) { a.cancel(); });
    await wrapper.animate(
      [{ opacity: 0 }, { opacity: 1 }],
      { duration: DUR_FADE_IN, easing: "ease-out", fill: "forwards" }
    ).finished;
    wrapper.getAnimations().forEach(function (a) { a.cancel(); });

    filtroAtual = novoFiltro;
    animando = false;
  }

  /* ---- handlers dos filtros ---- */
  botoes.forEach(function (btn) {
    btn.addEventListener("click", function () {
      if (animando) return;
      if (btn.classList.contains("is-active")) return;

      botoes.forEach(function (b) {
        b.classList.remove("is-active");
        b.setAttribute("aria-pressed", "false");
      });
      btn.classList.add("is-active");
      btn.setAttribute("aria-pressed", "true");

      aplicarFiltro(btn.dataset.filter);
    });
  });

  /* ---- navegação por setas entre os cards do grid ativo ----
     Ordem = DOM do grid. Como o grid é assimétrico, up/down seguem
     a ordem visual de leitura (esquerda→direita, topo→base). */
  wrapper.addEventListener("keydown", function (e) {
    const card = e.target.closest(".pw-card");
    if (!card) return;

    const grid = card.closest(".pw-grid.is-active");
    if (!grid) return;

    const cards = Array.from(grid.querySelectorAll(".pw-card"));
    const idx = cards.indexOf(card);
    if (idx === -1) return;

    let alvo = null;

    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      alvo = cards[idx + 1] || null;
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      alvo = cards[idx - 1] || null;
    } else {
      return;
    }

    if (alvo) {
      e.preventDefault();
      alvo.focus();
    }
  });

  /* ---- esconde o aviso no primeiro scroll ---- */
  if (aviso) {
    let escondido = false;
    window.addEventListener("scroll", function onScroll() {
      if (escondido) return;
      if (window.scrollY > 80) {
        escondido = true;
        aviso.classList.add("is-escondido");
        window.removeEventListener("scroll", onScroll);
      }
    }, { passive: true });
  }
}