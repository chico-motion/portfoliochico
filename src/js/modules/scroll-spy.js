export function initScrollSpy() {
  const pagina = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  if (pagina !== "index.html") return;

  const links = document.querySelectorAll(".nav-link[data-nav]");
  if (!links.length || !("IntersectionObserver" in window)) return;

  const obs = new IntersectionObserver(
    function (entradas) {
      entradas.forEach(function (en) {
        if (!en.isIntersecting) return;
        links.forEach(function (l) {
          if (l.getAttribute("aria-current") === "page") return;
          if (l.dataset.nav === en.target.id) l.setAttribute("aria-current", "true");
          else l.removeAttribute("aria-current");
        });
      });
    },
    { rootMargin: "-45% 0px -50% 0px" }
  );

  ["home", "works", "contato", "sobre"].forEach(function (id) {
    const s = document.getElementById(id);
    if (s) obs.observe(s);
  });
}
