export function initHeroRuler() {
  const titulo = document.querySelector(".hero-titulo");
  if (!titulo) return;

  const chico = titulo.querySelector(".linha-1");
  const martins = titulo.querySelector(".linha-2");
  const regua = titulo.querySelector(".linha-regua");
  if (!chico || !martins || !regua) return;

  /* Mede o quanto o "espaço morto" abaixo da baseline "come" da caixa do texto.
     Usado pra colar a régua na base visual das letras maiúsculas. */
  function medirExcesso(el) {
    const cs = getComputedStyle(el);
    const fontSize = parseFloat(cs.fontSize);
    const fontFamily = cs.fontFamily;
    const fontWeight = cs.fontWeight;
    try {
      const ctx = document.createElement("canvas").getContext("2d");
      ctx.font = fontWeight + " " + fontSize + "px " + fontFamily;
      const m = ctx.measureText("CHICO");
      const fb = m.fontBoundingBoxDescent;
      const ab = m.actualBoundingBoxDescent;
      if (typeof fb === "number" && typeof ab === "number") {
        return Math.max(0, fb - ab);
      }
    } catch {}
    return fontSize * 0.15;
  }

  /* Mede a largura que o texto TERÁ no estado final (letter-spacing
     normal, sem o tracking grande da intro). Feito via canvas, sem
     tocar no DOM — assim a intro pode rodar sem interferência. */
  function medirLarguraFinal(texto, el) {
    const cs = getComputedStyle(el);
    const fontSize = parseFloat(cs.fontSize);
    const fontFamily = cs.fontFamily;
    const fontWeight = cs.fontWeight;

    /* o letter-spacing final do título não muda com no-intro
       (o tracking grande só é aplicado nas linhas) */
    const lsRaw = getComputedStyle(titulo).letterSpacing;
    const ls = parseFloat(lsRaw);
    const letterSpacing = isNaN(ls) ? 0 : ls;

    const ctx = document.createElement("canvas").getContext("2d");
    ctx.font = fontWeight + " " + fontSize + "px " + fontFamily;
    const base = ctx.measureText(texto).width;

    /* letter-spacing é aplicado entre cada par de letras */
    return base + letterSpacing * (texto.length - 1);
  }

  const MOBILE = window.matchMedia("(max-width: 860px)").matches;
  const REGUA_DESCE = MOBILE ? 10 : 12;
  const MARTINS_DESCE = MOBILE ? 10 : 0;

  /* offsets definidos no CSS (hero.css) */
  const CHICO_LEFT = MOBILE ? -5 : -16;   /* em % do hero-titulo */
  const MARTINS_LEFT = MOBILE ? 3 : 3;

  function ajustar() {
    const tRect = titulo.getBoundingClientRect();
    const centro = tRect.left + tRect.width / 2;

    const larguraChico = medirLarguraFinal("CHICO", chico);
    const larguraMartins = medirLarguraFinal("MARTINS", martins);

    /* posição do lado esquerdo do CHICO no estado final:
       centro - metade da largura + offset de "left: X%" */
    const chicoLeft =
      centro + (CHICO_LEFT / 100) * tRect.width - larguraChico / 2;

    /* posição do lado direito do MARTINS no estado final */
    const martinsLeft =
      centro + (MARTINS_LEFT / 100) * tRect.width - larguraMartins / 2;
    const martinsRight = martinsLeft + larguraMartins;

    /* régua vai de chicoLeft até martinsRight, centralizada */
    const reguaWidth = martinsRight - chicoLeft;
    const reguaShift = chicoLeft - centro + reguaWidth / 2;

    const excesso = medirExcesso(chico);

    regua.style.setProperty("--regua-w", reguaWidth + "px");
    regua.style.transform = "translateX(" + reguaShift + "px)";
    regua.style.marginTop = -excesso + REGUA_DESCE + "px";
    regua.style.marginBottom = "0px";
    martins.style.marginTop = MARTINS_DESCE + "px";
  }

  /* mede já (com fonte fallback). Serve pra ter um valor válido antes
     das Chronicle chegarem. */
  ajustar();

  /* quando as fontes específicas carregarem, re-mede com as métricas
     corretas. `document.fonts.load()` é pontual — resolve em ~100ms,
     diferente do `document.fonts.ready` global que pode demorar 16s. */
  if (document.fonts && document.fonts.load) {
    Promise.all([
      document.fonts.load("700 10rem 'Chronicle Display'"),
      document.fonts.load("200 10rem 'Chronicle Display'")
    ])
      .then(ajustar)
      .catch(function () {});
  }

  /* resize */
  let tReg;
  window.addEventListener("resize", function () {
    clearTimeout(tReg);
    tReg = setTimeout(ajustar, 120);
  });

  /* Libera a intro. Espera as fontes (ou timeout), depois remove
     `no-intro` num RAF pra garantir que o layout tá pronto. */
  const liberar = function () {
    document.documentElement.classList.remove("no-intro");
  };

  if (document.fonts && document.fonts.load) {
    Promise.race([
      Promise.all([
        document.fonts.load("700 10rem 'Chronicle Display'"),
        document.fonts.load("200 10rem 'Chronicle Display'")
      ]),
      new Promise(function (resolve) {
        setTimeout(resolve, 1200);
      })
    ]).then(function () {
      requestAnimationFrame(liberar);
    });
  } else {
    setTimeout(liberar, 500);
  }
}