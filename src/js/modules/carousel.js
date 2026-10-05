import { reduzMovimento } from "./utils.js";

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
  if (N < 1) return;

  function fazerClone(el) {
    const c = el.cloneNode(true);
    c.dataset.clone = "1";
    c.setAttribute("aria-hidden", "true");
    return c;
  }
  const fragA = document.createDocumentFragment();
  reais.forEach(function (el) {
    fragA.appendChild(fazerClone(el));
  });
  linha.insertBefore(fragA, linha.firstChild);
  const fragD = document.createDocumentFragment();
  reais.forEach(function (el) {
    fragD.appendChild(fazerClone(el));
  });
  linha.appendChild(fragD);

  function itens() {
    return linha.querySelectorAll(".crew-item");
  }
  function larguraGrupo() {
    const a = itens();
    if (a.length < 2 * N) return 0;
    return a[N].offsetLeft - a[0].offsetLeft;
  }
  function passoItem() {
    const a = itens();
    if (a.length < 2) return 0;
    return a[1].offsetLeft - a[0].offsetLeft;
  }

  function snap() {
    const w = larguraGrupo();
    const p = passoItem();
    if (w <= 0 || p <= 0) return;

    const s = linha.scrollLeft;
    const k = Math.round((s - w) / p);
    const alvo = w + k * p;
    if (Math.abs(alvo - s) < 1) return;

    travar(800);
    if (reduzMovimento) linha.scrollLeft = alvo;
    else linha.scrollTo({ left: alvo, behavior: "smooth" });
  }

  const INTERVALO_CLIQUE = 250;
  let ultimoClique = 0;
  let travaAte = 0;
  function travar(ms) {
    travaAte = Math.max(travaAte, performance.now() + ms);
  }

  function alinhar() {
    const w = larguraGrupo();
    if (w <= 0) return;
    linha.scrollTo({ left: w, behavior: "auto" });
    travar(200);
  }

  function loop() {
    const w = larguraGrupo();
    if (w > 0 && performance.now() > travaAte) {
      const s = linha.scrollLeft;
      if (s < w * 0.5) linha.scrollLeft = s + w;
      else if (s > w * 1.5) linha.scrollLeft = s - w;
    }
    requestAnimationFrame(loop);
  }

  document.querySelectorAll(".crew-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      const agora = performance.now();
      if (agora - ultimoClique < INTERVALO_CLIQUE) return;
      ultimoClique = agora;

      const p = passoItem();
      const w = larguraGrupo();
      if (p <= 0 || w <= 0) return;
      const dir = Number(btn.dataset.dir) || 0;
      if (!dir) return;

      travar(800);
      let alvo = linha.scrollLeft + dir * p;

      if (alvo < w * 0.5) {
        linha.scrollLeft += w;
        alvo += w;
      } else if (alvo > w * 1.5) {
        linha.scrollLeft -= w;
        alvo -= w;
      }

      if (reduzMovimento) linha.scrollLeft = alvo;
      else linha.scrollTo({ left: alvo, behavior: "smooth" });
    });
  });

  let arrastando = false,
    inicioX = 0,
    inicioScroll = 0;

  linha.addEventListener("pointerdown", function (e) {
    if (e.pointerType !== "mouse") return;
    if (e.button !== 0) return;
    if (e.target.closest("a, button")) return;
    arrastando = true;
    inicioX = e.clientX;
    inicioScroll = linha.scrollLeft;
    linha.style.cursor = "grabbing";
    travar(150);
  });

  linha.addEventListener(
    "touchend",
    function () {
      setTimeout(snap, 80);
    },
    { passive: true }
  );

  window.addEventListener("pointermove", function (e) {
    if (!arrastando) return;
    let novo = inicioScroll - (e.clientX - inicioX);

    const w = larguraGrupo();
    if (w > 0) {
      if (novo < w * 0.5) novo += w;
      else if (novo > w * 1.5) novo -= w;
    }
    linha.scrollLeft = novo;
    inicioScroll = novo;
    inicioX = e.clientX;
    travar(150);
  });

  function soltar() {
    if (!arrastando) return;
    arrastando = false;
    linha.style.cursor = "";
    travar(200);
    requestAnimationFrame(snap);
  }
  window.addEventListener("pointerup", soltar);
  window.addEventListener("pointercancel", soltar);

  let tR;
  window.addEventListener("resize", function () {
    clearTimeout(tR);
    tR = setTimeout(alinhar, 150);
  });

  requestAnimationFrame(function () {
    requestAnimationFrame(function () {
      alinhar();
      loop();
    });
  });
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(function () {
      setTimeout(alinhar, 50);
    });
  }
}
