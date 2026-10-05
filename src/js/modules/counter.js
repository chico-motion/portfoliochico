import { reduzMovimento } from "./utils.js";

export function initCounter() {
  const nums = document.querySelectorAll(".num[data-numero]");
  if (!nums.length) return;

  function animar(el) {
    const alvo = parseInt(el.dataset.numero, 10);
    const sufixo = el.dataset.sufixo || "";
    if (isNaN(alvo)) return;

    if (reduzMovimento) {
      el.textContent = "+" + alvo + sufixo;
      return;
    }

    const duracao = 2100;
    const inicio = performance.now();

    function passo(agora) {
      const t = Math.min(1, (agora - inicio) / duracao);
      const eased = 1 - Math.pow(1 - t, 4);
      const valor = Math.round(alvo * eased);
      el.textContent = "+" + valor + sufixo;
      if (t < 1) requestAnimationFrame(passo);
    }
    requestAnimationFrame(passo);
  }

  if ("IntersectionObserver" in window) {
    const obs = new IntersectionObserver(
      function (entradas) {
        entradas.forEach(function (en) {
          if (en.isIntersecting) {
            animar(en.target);
            obs.unobserve(en.target);
          }
        });
      },
      { threshold: 0.2 }
    );
    nums.forEach(function (el) {
      obs.observe(el);
    });
  } else {
    nums.forEach(animar);
  }
}
