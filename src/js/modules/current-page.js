/* Marca o link do header correspondente à página atual com aria-current="page".
   Roda em todas as páginas, exceto na home (onde o scroll-spy cuida disso). */
export function initCurrentPage() {
  const pagina = (location.pathname.split("/").pop() || "index.html").toLowerCase();

  /* na home, o scroll-spy assume o controle */
  if (pagina === "index.html" || pagina === "") return;

  /* mapeia nome do arquivo → valor do data-nav */
  const mapa = {
    "works.html": "works"
  };

  const nav = mapa[pagina];
  if (!nav) return;

  document.querySelectorAll('[data-nav="' + nav + '"]').forEach(function (a) {
    a.setAttribute("aria-current", "page");
  });
}