/* Módulo da página de Works.
   - Renderiza os projetos a partir do array PROJETOS
   - Filtra por categoria (todos / games / brands)
   - Aplica stagger de entrada conforme cada card aparece no viewport
   - Esconde o aviso "role para ver mais" após o primeiro scroll */

const PROJETOS = [
  { id: "hero-base",      nome: "Hero Base",      cat: "games",  disc: "Motion Design · Social" },
  { id: "samsung",        nome: "Samsung",        cat: "brands", disc: "Motion Design · Social" },
  { id: "flakes-power",   nome: "Flakes Power",   cat: "brands", disc: "Motion Design · Social" },
  { id: "santander",      nome: "Santander",      cat: "brands", disc: "Motion Design · Social" },
  { id: "fortnite",       nome: "Fortnite",       cat: "games",  disc: "Motion Design · Social" },
  { id: "rage",           nome: "Rage",           cat: "games",  disc: "Motion Design · Social" },
  { id: "nu",             nome: "Nu",             cat: "brands", disc: "Motion Design · Social" },
  { id: "ca",             nome: "C&A",            cat: "brands", disc: "Motion Design · Social" },
  { id: "playstation",    nome: "Playstation",    cat: "games",  disc: "Motion Design · Social" },
  { id: "redbull",        nome: "Redbull",        cat: "brands", disc: "Motion Design · Social" },
  { id: "nike",           nome: "Nike",           cat: "brands", disc: "Motion Design · Social" },
  { id: "the-last-of-us", nome: "The Last of Us", cat: "games",  disc: "Motion Design · Social" },
  { id: "krona",          nome: "Krona",          cat: "brands", disc: "Motion Design · Social" },
  { id: "ambev",          nome: "Ambev",          cat: "brands", disc: "Motion Design · Social" },
  { id: "solid",          nome: "Solid",          cat: "brands", disc: "Motion Design · Social" }
];

/* Ritmo assimétrico do mobile — cada projeto recebe um par (width, align).
   Repete ciclos diferentes pra não parecer matemático. */
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
  const grid = document.getElementById("works-grid");
  if (!grid) return;

  const contador = document.getElementById("works-contador");
  const aviso = document.getElementById("works-scroll-aviso");
  const botoes = document.querySelectorAll(".filtro");

  /* ---- renderiza TODOS os cards uma vez ---- */
  grid.innerHTML = PROJETOS.map(function (p, i) {
    return (
      '<a class="pw-card pw-card--' + p.id + '" ' +
        'data-id="' + p.id + '" ' +
        'data-cat="' + p.cat + '" ' +
        'data-ativo="true" ' +
        'href="/works/' + p.id + '.html" ' +
        'aria-label="' + p.nome + ' — abrir projeto" ' +
        'style="--stagger:' + (i * 40) + 'ms; --m-width:' + ritmo.w + '; --m-align:' + ritmo.a + '">' +
        '<span class="pw-thumb">' +
          '<span class="pw-thumb-nome">' + p.nome + ' — thumb</span>' +
        '</span>' +
        '<span class="pw-info">' +
          '<span class="pw-cat">' +
            (p.cat === "games" ? "Games / Creators" : "Brands") +
          '</span>' +
          '<span></span>' +
          '<span>' +
            '<span class="pw-nome">' + p.nome + '</span>' +
            '<span class="pw-disc">' + p.disc + '</span>' +
          '</span>' +
          '<span class="pw-seta">' + SETA_SVG + '</span>' +
        '</span>' +
      '</a>'
    );
  }).join("");
  grid.dataset.filtro = "todos";

  /* ---- reveal de entrada (IntersectionObserver) ---- */
  const cards = grid.querySelectorAll(".pw-card");
  const reduzMov = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reduzMov || !("IntersectionObserver" in window)) {
    cards.forEach(function (c) { c.classList.add("is-in"); });
  } else {
    const obs = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.classList.add("is-in");
        obs.unobserve(en.target);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    cards.forEach(function (c) { obs.observe(c); });
  }

  /* ---- filtro com FLIP ---- */
  let animando = false;
  let filtroAtual = "todos";

  async function aplicarFiltro(novoFiltro) {
    if (animando || novoFiltro === filtroAtual) return;
    animando = true;
    grid.classList.add("pw-grid--animando");

    const todos = Array.from(grid.querySelectorAll(".pw-card"));
    const gridRect = grid.getBoundingClientRect();

    /* limpa estado de qualquer animação anterior */
    todos.forEach(function (card) {
      card.getAnimations().forEach(function (a) { a.cancel(); });
      card.classList.remove("pw-card--entrando", "pw-card--saindo");
      card.style.position = "";
      card.style.top = "";
      card.style.left = "";
      card.style.width = "";
      card.style.height = "";
      card.style.transform = "";
      card.style.opacity = "";
    });

    const proximoAtivo = new Map();
    todos.forEach(function (card) {
      proximoAtivo.set(card.dataset.id, novoFiltro === "todos" || card.dataset.cat === novoFiltro);
    });

    /* 1. FIRST — mede posições atuais dos visíveis */
    const primeiraMedida = new Map();
    todos.forEach(function (card) {
      if (card.dataset.ativo === "true") {
        primeiraMedida.set(card.dataset.id, card.getBoundingClientRect());
      }
    });

    /* 2. SAINDO — tira do fluxo com position absolute na posição atual */
    const saindo = [];
    todos.forEach(function (card) {
      const ativoAgora = card.dataset.ativo === "true";
      const ativoDepois = proximoAtivo.get(card.dataset.id);
      if (ativoAgora && !ativoDepois && !reduzMov) {
        const r = primeiraMedida.get(card.dataset.id);
        card.classList.add("pw-card--saindo");
        card.style.position = "absolute";
        card.style.top = (r.top - gridRect.top) + "px";
        card.style.left = (r.left - gridRect.left) + "px";
        card.style.width = r.width + "px";
        card.style.height = r.height + "px";
        saindo.push(card);
      }
    });

    /* 3. ENTRANDO — esconde via classe */
    if (!reduzMov) {
      todos.forEach(function (card) {
        const ativoAgora = card.dataset.ativo === "true";
        const ativoDepois = proximoAtivo.get(card.dataset.id);
        if (!ativoAgora && ativoDepois) {
          card.classList.add("pw-card--entrando");
        }
      });
    }
    grid.dataset.filtro = novoFiltro;
    /* 4. flip data-ativo — grid reflowa */
    todos.forEach(function (card) {
      const ativo = proximoAtivo.get(card.dataset.id);
      card.dataset.ativo = ativo ? "true" : "false";
    });

    /* 5. LAST — mede posições novas */
    const segundaMedida = new Map();
    todos.forEach(function (card) {
      if (card.dataset.ativo === "true") {
        segundaMedida.set(card.dataset.id, card.getBoundingClientRect());
      }
    });

    /* 6. INVERT — aplica transform invertido via style, SÍNCRONO.
       Sem isso, o browser pinta um frame com o layout final antes da WAAPI. */
    todos.forEach(function (card) {
      if (card.dataset.ativo !== "true") return;
      const id = card.dataset.id;
      const antes = primeiraMedida.get(id);
      const depois = segundaMedida.get(id);
      if (!antes || !depois) return;
      const dx = antes.left - depois.left;
      const dy = antes.top - depois.top;
      if (Math.abs(dx) > 0.5 || Math.abs(dy) > 0.5) {
        card.style.transform = "translate(" + dx + "px," + dy + "px)";
      }
    });

    /* força reflow — o browser não tem chance de pintar o estado "errado" */
    void grid.offsetHeight;

    /* 7. fade out dos saindo (agendado, paralelo com o resto) */
    saindo.forEach(function (card) {
      card.animate(
        [
          { opacity: 1, transform: "scale(1)" },
          { opacity: 0, transform: "scale(0.96)" }
        ],
        { duration: 380, easing: "cubic-bezier(0.4, 0, 0.2, 1)", fill: "forwards" }
      ).finished.then(function () {
        card.classList.remove("pw-card--saindo");
        card.style.position = "";
        card.style.top = "";
        card.style.left = "";
        card.style.width = "";
        card.style.height = "";
        card.getAnimations().forEach(function (a) { a.cancel(); });
      });
    });

    /* 8. PLAY — anima do invertido até 0 */
    const temSaidas = saindo.length > 0;
    const delayMovimento = temSaidas ? 200 : 0;
    const delayEntrada   = temSaidas ? 260 : 120;

    const animacoes = [];
    todos.forEach(function (card) {
      if (card.dataset.ativo !== "true") return;

      const id = card.dataset.id;
      const antes = primeiraMedida.get(id);
      const depois = segundaMedida.get(id);

      if (antes && depois) {
        const dx = antes.left - depois.left;
        const dy = antes.top - depois.top;
        if (Math.abs(dx) > 0.5 || Math.abs(dy) > 0.5) {
          const anim = card.animate(
            [
              { transform: "translate(" + dx + "px," + dy + "px)" },
              { transform: "translate(0,0)" }
            ],
            {
              duration: 850,
              delay: delayMovimento,
              easing: "cubic-bezier(0.2, 0.8, 0.2, 1)",
              fill: "forwards"
            }
          );
          anim.finished.then(function () {
            card.style.transform = "";
            card.getAnimations().forEach(function (a) { a.cancel(); });
          });
          animacoes.push(anim.finished);
        } else {
          /* não moveu — limpa o style (que pode ter ficado) */
          card.style.transform = "";
        }
      } else if (!antes && depois) {
        /* card entrou — fade in */
        if (reduzMov) {
          card.classList.remove("pw-card--entrando");
        } else {
          const anim = card.animate(
            [
              { opacity: 0, transform: "translateY(20px)" },
              { opacity: 1, transform: "translateY(0)" }
            ],
            {
              duration: 750,
              delay: delayEntrada,
              easing: "cubic-bezier(0.2, 0.8, 0.2, 1)",
              fill: "forwards"
            }
          );
          anim.finished.then(function () {
            card.classList.remove("pw-card--entrando");
            card.getAnimations().forEach(function (a) { a.cancel(); });
          });
          animacoes.push(anim.finished);
        }
      }
    });

    /* 9. contador */
    if (contador) {
      const total = String(
        Array.from(proximoAtivo.values()).filter(Boolean).length
      ).padStart(2, "0");
      contador.textContent = "01 — " + total;
    }

    /* 10. aguarda animações + margem (o timeout precisa ser maior que
       delayMovimento + duration = 520 + 850 = 1370ms) */
    const timeout = new Promise(function (r) { setTimeout(r, 1800); });
    await Promise.race([Promise.all(animacoes), timeout]);

    grid.classList.remove("pw-grid--animando");
    filtroAtual = novoFiltro;
    animando = false;
  }

  /* ---- handlers dos filtros (FORA do aplicarFiltro) ---- */
  botoes.forEach(function (btn) {
    btn.addEventListener("click", function () {
      if (animando) return;
      if (btn.classList.contains("is-active")) return;
      botoes.forEach(function (b) { b.classList.remove("is-active"); });
      btn.classList.add("is-active");
      aplicarFiltro(btn.dataset.filter);
    });
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