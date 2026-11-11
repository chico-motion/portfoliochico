/* Módulo da seção Serviços da home. */
import { SERVICOS } from "./data-servicos.js";

const SETA_SVG =
  '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
  'stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
  '<path d="M12 5v14M6 13l6 6 6-6"/></svg>';

const MOBILE_BP = 860;

function ehMobile() {
  return window.matchMedia("(max-width: " + MOBILE_BP + "px)").matches;
}

function montarItem(s) {
  const idCorpo = "svc-corpo-" + s.id;

  const tags = s.tags.map(function (t) { return "<li>" + t + "</li>"; }).join("");

  const conteudoMidia = s.img
    ? `<img src="${s.img}" alt="${s.titulo}" style="width: 100%; height: 100%; object-fit: cover; position: absolute; inset: 0; border-radius: inherit;" />`
    : `<span class="tag-ph">ph</span><svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 4v16M17 4v16M3 9h4M3 15h4M17 9h4M17 15h4"/></svg><figcaption class="mono">${s.legenda}</figcaption>`;

  return (
    '<li class="svc-item" data-svc="' + s.id + '">' +
      '<span class="svc-numero" aria-hidden="true">' + s.numero + '</span>' +
      
      '<div class="svc-conteudo">' +
        '<h3 class="svc-titulo">' + s.titulo + '</h3>' +
        '<div class="svc-corpo" id="' + idCorpo + '">' +
          '<p class="svc-desc">' + s.desc + '</p>' +
          '<ul class="svc-tags">' + tags + '</ul>' +
        '</div>' +
      '</div>' +
      
      '<button class="svc-seta" type="button" aria-expanded="false" aria-controls="' + idCorpo + '" aria-label="expandir ' + s.titulo + '">' +
        SETA_SVG +
      '</button>' +
      
      '<figure class="svc-midia" style="position: relative; border: none; background: #000; border-radius: 4px; overflow: hidden;">' +
        conteudoMidia +
      '</figure>' +
    '</li>'
  );
}

export function initServices() {
  const lista = document.getElementById("lista-servicos");
  if (!lista) return;

  lista.innerHTML = SERVICOS.map(montarItem).join("");

  const itens = Array.from(lista.querySelectorAll(".svc-item"));
  if (!itens.length) return;

  let itemAtual = null;

  function fecharTodos() {
    itens.forEach(function (item) {
      item.classList.remove("is-ativo");
      const seta = item.querySelector(".svc-seta");
      if (seta) seta.setAttribute("aria-expanded", "false");
    });
    itemAtual = null;
  }

  function abrir(item) {
    if (itemAtual === item) return;
    fecharTodos();
    item.classList.add("is-ativo");
    const seta = item.querySelector(".svc-seta");
    if (seta) seta.setAttribute("aria-expanded", "true");
    itemAtual = item;
  }

  function toggle(item) {
    if (item === itemAtual) fecharTodos();
    else abrir(item);
  }

  itens.forEach(function (item) {
    item.addEventListener("mouseenter", function () {
      if (ehMobile()) return;
      abrir(item);
    });

    item.addEventListener("click", function (e) {
      if (e.target.closest(".svc-seta")) {
        e.stopPropagation();
        toggle(item);
        return;
      }
      if (ehMobile()) toggle(item);
    });
  });

  lista.addEventListener("mouseleave", function () { fecharTodos(); });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && itemAtual) fecharTodos();
  });
}