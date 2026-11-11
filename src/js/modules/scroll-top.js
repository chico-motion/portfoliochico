/* Faz o botão "voltar ao topo" rolar suavemente.
   Respeita prefers-reduced-motion. */

export function initScrollTop() {
  const botoes = document.querySelectorAll("[data-scroll-top]");
  if (!botoes.length) return;

  const reduzMov = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  botoes.forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: reduzMov ? "auto" : "smooth"
      });
    });
  });
}