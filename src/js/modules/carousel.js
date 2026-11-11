/* Carrossel de creators.
   Snap via CSS. Loop infinito via clones.
   - Setas: normalizam o scrollLeft com INSTANTÂNEO e depois animam
   - Drag/touch: scroll livre + snap nativo
   - scroll-behavior: smooth NÃO está no CSS — o JS decide quando
     cada movimento é smooth ou instantâneo. */

export function initCarousel() {
  const linha = document.getElementById("crew-row");
  if (!linha) return;

  linha.querySelectorAll('[data-clone="1"]').forEach(function (el) {
    el.remove();
  });

  const reais = Array.from(linha.children).filter(function (el) {
    return !el.dataset.clone;
  });
  const N = reais.length;
  if (N < 2) return;

  function clonar() {
    const frag = document.createDocumentFragment();
    reais.forEach(function (el) {
      const c = el.cloneNode(true);
      c.dataset.clone = "1";
      c.setAttribute("aria-hidden", "true");
      frag.appendChild(c);
    });
    return frag;
  }
  linha.insertBefore(clonar(), linha.firstChild);
  linha.appendChild(clonar());

  /* ---------- helpers ---------- */
  const itens = function () {
    return linha.querySelectorAll(".crew-item");
  };
  const passoItem = function () {
    const a = itens();
    if (a.length < 2) return 0;
    return a[1].offsetLeft - a[0].offsetLeft;
  };
  const larguraGrupo = function () {
    return passoItem() * N;
  };

  /* ---------- movimento ----------
     setInstantaneo: ignora qualquer scroll-behavior do CSS
     setSmooth: anima até o alvo */

  function setInstantaneo(pos) {
    linha.scrollTo({ left: pos, behavior: "instant" });
  }

  function setSmooth(pos) {
    linha.scrollTo({ left: pos, behavior: "smooth" });
  }

  /* ---------- inicial ---------- */
  let alinhado = false;
  function alinhar() {
    const w = larguraGrupo();
    if (w > 0) {
      setInstantaneo(w);
      alinhado = true;
    }
  }

  /* ---------- loop infinito ----------
     Depois de um scroll PARADO (drag, touch ou smooth terminando),
     se o scrollLeft está fora da zona segura, faz um jump instantâneo
     pra trazer de volta. Isso mantém o loop infinito funcionando em
     qualquer interação. */

  let programado = false;   /* true entre o clique e o fim do smooth */
  let tSmooth;

  function marcarProgramado() {
    programado = true;
    clearTimeout(tSmooth);
    tSmooth = setTimeout(function () {
      programado = false;
    }, 500);
  }

  let tScroll;
  linha.addEventListener(
    "scroll",
    function () {
      if (!alinhado) return;
      if (programado) return; /* durante animação de clique, ignora */

      clearTimeout(tScroll);
      tScroll = setTimeout(function () {
        const w = larguraGrupo();
        if (w <= 0) return;
        const s = linha.scrollLeft;
        if (s < w * 0.5) setInstantaneo(s + w);
        else if (s > w * 1.5) setInstantaneo(s - w);
      }, 120);
    },
    { passive: true }
  );

  /* ---------- setas ---------- */
  const INTERVALO = 200;
  let ultimoClique = 0;

  function passo(dir) {
    const p = passoItem();
    const w = larguraGrupo();
    if (p <= 0 || w <= 0) return;

    marcarProgramado();

    /* 1) LÊ o scrollLeft atual */
    let s = linha.scrollLeft;

    /* 2) NORMALIZA INSTANTANEAMENTE se estiver fora da zona segura.
       Isso é o coração do fix: garantimos que o smooth a seguir
       nunca comece de uma posição "extrema". */
    let ajustou = false;
    if (s < w * 0.5) {
      s += w;
      ajustou = true;
    } else if (s > w * 1.5) {
      s -= w;
      ajustou = true;
    }
    if (ajustou) {
      setInstantaneo(s);
    }

    /* 3) AGORA aplica o passo com smooth. */
    const alvo = s + dir * p;
    setSmooth(alvo);
  }

  document.querySelectorAll(".crew-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      const agora = performance.now();
      if (agora - ultimoClique < INTERVALO) return;
      ultimoClique = agora;
      const dir = Number(btn.dataset.dir) || 0;
      if (!dir) return;
      passo(dir);
    });
  });

  /* ---------- drag com mouse ---------- */
  let arrastando = false;
  let inicioX = 0;
  let inicioScroll = 0;

  linha.addEventListener("pointerdown", function (e) {
    if (e.pointerType !== "mouse") return;
    if (e.button !== 0) return;
    if (e.target.closest("a, button")) return;

    arrastando = true;
    inicioX = e.clientX;
    inicioScroll = linha.scrollLeft;
    linha.style.cursor = "grabbing";
  });

  window.addEventListener("pointermove", function (e) {
    if (!arrastando) return;
    const delta = e.clientX - inicioX;
    linha.scrollLeft = inicioScroll - delta;
  });

  function soltar() {
    if (!arrastando) return;
    arrastando = false;
    linha.style.cursor = "";
    /* o snap do CSS alinha no item mais próximo;
       o listener de scroll normaliza depois */
  }
  window.addEventListener("pointerup", soltar);
  window.addEventListener("pointercancel", soltar);

  /* ---------- resize ---------- */
  let tResize;
  window.addEventListener("resize", function () {
    clearTimeout(tResize);
    tResize = setTimeout(alinhar, 160);
  });

  /* ---------- inicial ---------- */
  requestAnimationFrame(function () {
    requestAnimationFrame(alinhar);
  });
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(function () {
      setTimeout(alinhar, 60);
    });
  }
}