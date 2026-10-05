/* Remove a classe .fonts-loading quando as fontes terminam de carregar.
   Tem um timeout de segurança pra nunca bloquear o texto pra sempre. */
export function initFontsLoading() {
  const html = document.documentElement;
  if (!html.classList.contains("fonts-loading")) return;

  const timeout = setTimeout(function () {
    html.classList.remove("fonts-loading");
  }, 1500);

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(function () {
      clearTimeout(timeout);
      html.classList.remove("fonts-loading");
    });
  } else {
    /* browser antigo: libera direto */
    clearTimeout(timeout);
    html.classList.remove("fonts-loading");
  }
}