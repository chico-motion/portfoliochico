export function initMenu() {
  const toggle = document.getElementById("nav-toggle");
  const painel = document.getElementById("menu-mobile");
  if (!toggle || !painel) return;

  function fecharMenu() {
    if (painel.hidden) return;
    painel.hidden = true;
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "abrir menu");
  }

  toggle.addEventListener("click", function () {
    const aberto = painel.hidden;
    painel.hidden = !aberto;
    toggle.setAttribute("aria-expanded", String(aberto));
    toggle.setAttribute("aria-label", aberto ? "fechar menu" : "abrir menu");
    if (aberto) {
      const primeiro = painel.querySelector("a");
      if (primeiro) primeiro.focus();
    }
  });

  painel.addEventListener("click", function (e) {
    if (e.target.closest("a")) fecharMenu();
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !painel.hidden) {
      fecharMenu();
      toggle.focus();
    }
  });

  document.addEventListener("click", function (e) {
    if (!painel.hidden && !e.target.closest(".topo")) fecharMenu();
  });
}
