import { reduzMovimento } from "./utils.js";

export function initMarquee() {
  if (reduzMovimento) return;

  document.querySelectorAll("[data-marquee]").forEach(function (wrap) {
    const track = wrap.querySelector(".marquee-track");
    if (!track || !track.children.length) return;

    const originais = Array.from(track.children).filter(function (el) {
      return el.dataset.clone !== "1";
    });
    if (!originais.length) return;

    function montar() {
      track.querySelectorAll('[data-clone="1"]').forEach(function (el) {
        el.remove();
      });

      const larguraUma = track.getBoundingClientRect().width;
      if (!larguraUma) return;

      const viewport = window.innerWidth;
      const copies = Math.max(2, Math.ceil(viewport / larguraUma) + 1);

      for (let i = 1; i < copies; i++) {
        originais.forEach(function (item) {
          const clone = item.cloneNode(true);
          clone.setAttribute("aria-hidden", "true");
          clone.dataset.clone = "1";
          track.appendChild(clone);
        });
      }

      const duracao = Math.max(18, larguraUma / 70);
      track.style.setProperty("--marquee-dur", duracao.toFixed(1) + "s");
      track.style.setProperty("--marquee-shift", "-" + (100 / copies).toFixed(4) + "%");
    }

    requestAnimationFrame(montar);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(montar);

    let t;
    window.addEventListener("resize", function () {
      clearTimeout(t);
      t = setTimeout(montar, 200);
    });
  });
}
