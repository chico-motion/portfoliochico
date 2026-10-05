export function initProgress() {
  const wrapper = document.querySelector(".progresso-scroll");
  const barra = wrapper && wrapper.querySelector(".progresso-scroll-barra");
  if (!wrapper || !barra) return;

  let agendado = false;

  function atualizar() {
    agendado = false;
    const doc = document.documentElement;
    const alturaVisivel = doc.clientHeight;
    const alturaTotal = doc.scrollHeight;
    const rolavel = alturaTotal - alturaVisivel;

    if (rolavel <= 0) {
      wrapper.hidden = true;
      return;
    }
    wrapper.hidden = false;

    const pct = Math.min(1, Math.max(0, window.scrollY / rolavel));
    barra.style.transform = "scaleX(" + pct.toFixed(4) + ")";
  }

  function agendar() {
    if (agendado) return;
    agendado = true;
    requestAnimationFrame(atualizar);
  }

  window.addEventListener("scroll", agendar, { passive: true });
  window.addEventListener("resize", agendar);
  atualizar();
}
