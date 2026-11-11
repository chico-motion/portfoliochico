export function initHeroRuler() {
  const titulo = document.querySelector(".hero-titulo");
  if (!titulo) return;

  const chico = titulo.querySelector(".linha-1");
  const martins = titulo.querySelector(".linha-2");
  const regua = titulo.querySelector(".linha-regua");
  if (!chico || !martins || !regua) return;

  /* Mede o "espaço morto" entre a caixa da fonte e a base real das
     letras maiúsculas. Usado pra colar a régua no pé visual das letras. */
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

  /* Mede a largura que o texto TERÁ no estado final. */
  function medirLarguraFinal(texto, el) {
    const cs = getComputedStyle(el);
    const fontSize = parseFloat(cs.fontSize);
    const fontFamily = cs.fontFamily;
    const fontWeight = cs.fontWeight;

    const lsRaw = getComputedStyle(titulo).letterSpacing;
    const ls = parseFloat(lsRaw);
    const letterSpacing = isNaN(ls) ? 0 : ls;

    const ctx = document.createElement("canvas").getContext("2d");
    ctx.font = fontWeight + " " + fontSize + "px " + fontFamily;
    const base = ctx.measureText(texto).width;

    return base + letterSpacing * (texto.length - 1);
  }

  const MOBILE = window.matchMedia("(max-width: 860px)").matches;

  /* offsets em PX — pequenos, só pra dar 1-2px de respiro visual
     entre a base das letras e a régua. O resto é calculado. */
  const REGUA_DESCE = MOBILE ? 2 : 3;
  const MARTINS_DESCE = MOBILE ? 6 : 0;

  const CHICO_LEFT = MOBILE ? -5 : -16;
  const MARTINS_LEFT = MOBILE ? 3 : 3;

  function ajustar() {
    const tRect = titulo.getBoundingClientRect();
    const centro = tRect.left + tRect.width / 2;

    const larguraChico = medirLarguraFinal("CHICO", chico);
    const larguraMartins = medirLarguraFinal("MARTINS", martins);

    const chicoLeft =
      centro + (CHICO_LEFT / 100) * tRect.width - larguraChico / 2;

    const martinsLeft =
      centro + (MARTINS_LEFT / 100) * tRect.width - larguraMartins / 2;
    const martinsRight = martinsLeft + larguraMartins;

    const reguaWidth = martinsRight - chicoLeft;
    const reguaShift = chicoLeft - centro + reguaWidth / 2;

    const excesso = medirExcesso(chico);

    /* a régua sobe o valor do excesso + o offset pequeno */
    regua.style.setProperty("--regua-w", reguaWidth + "px");
    regua.style.transform = "translateX(" + reguaShift + "px)";
    regua.style.marginTop = -excesso + REGUA_DESCE + "px";
    regua.style.marginBottom = "0px";
    martins.style.marginTop = MARTINS_DESCE + "px";
  }

  /* mede já (com fonte fallback) */
  ajustar();

  /* quando as fontes carregarem, re-mede com as métricas corretas */
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

  /* libera a intro */
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