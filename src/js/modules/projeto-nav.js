/* Injeta o footer de navegação (voltar / anterior / próximo) em qualquer
   elemento com [data-projeto-nav]. O id vem do <main class="proj" data-project>.

   Funciona em DOIS lugares:
   - Página standalone: initProjectNav() no load da página
   - Overlay: initProjectNav(conteudo) depois de injetar o HTML do fetch */

import { vizinhos } from "./data-projetos.js";

const SETA = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';

const SETA_VOLTAR = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 12H5M11 6l-6 6 6 6"/></svg>';

function esc(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function montarHTML(v) {
  return (
    '<div class="proj-rodape-grid">' +
      '<div class="proj-nav-esq">' +
        '<a class="proj-voltar" href="/works.html">' +
          SETA_VOLTAR +
          '<span>voltar para works</span>' +
        '</a>' +
        '<a class="proj-proximo proj-anterior" href="/works/' + v.anterior.id + '.html">' +
          '<span class="proj-proximo-rotulo">Projeto anterior</span>' +
          '<span class="proj-proximo-nome">' +
            SETA +
            esc(v.anterior.nome) +
          '</span>' +
          '<span class="proj-proximo-meta">Motion Design · Social</span>' +
        '</a>' +
      '</div>' +
      '<a class="proj-proximo" href="/works/' + v.proximo.id + '.html">' +
        '<span class="proj-proximo-rotulo">Próximo projeto</span>' +
        '<span class="proj-proximo-nome">' +
          esc(v.proximo.nome) +
          SETA +
        '</span>' +
        '<span class="proj-proximo-meta">Motion Design · Social</span>' +
      '</a>' +
    '</div>'
  );
}

/* root: opcional. Sem ele, usa o document inteiro.
   Com ele (conteudo da overlay), usa o sub-tree injetado. */
export function initProjetoNav(root) {
  const scope = root || document;
  const main = scope.querySelector("main.proj") || document.querySelector("main.proj");
  if (!main) return;

  const id = main.dataset.project;
  if (!id) return;

  const v = vizinhos(id);
  if (!v) return;

  const alvos = scope.querySelectorAll("[data-projeto-nav]");
  alvos.forEach(function (el) {
    el.innerHTML = montarHTML(v);
  });
}