export function initServices() {
  const SERVICOS = [
    {
      numero: "01",
      titulo: "Vídeo para<br>Redes Sociais",
      desc: "Conteúdo dinâmico e direto para prender atenção e gerar engajamento.",
      tags: ["Reels", "Shorts", "YouTube", "TikTok"],
      keywords: ["Captura", "Edição", "Ritmo", "Resultado"],
      legenda: "reel · thumb"
    },
    {
      numero: "02",
      titulo: "Motion Design",
      desc: "Animação, composição e movimento para dar forma às ideias.",
      tags: ["2D", "3D", "Tipografia", "VFX"],
      keywords: ["Ideia", "Animação", "Movimento", "Impacto"],
      legenda: "motion · thumb"
    },
    {
      numero: "03",
      titulo: "Branding em<br>Movimento",
      desc: "Identidades, logos e elementos visuais transformados em movimento.",
      tags: ["Logos", "Identidade", "Animação"],
      keywords: ["Criação", "Conceito", "Animação", "Marca"],
      legenda: "branding · thumb"
    },
    {
      numero: "04",
      titulo: "Vídeo<br>Institucional",
      desc: "Vídeos profissionais para apresentar marcas, produtos e projetos.",
      tags: ["Corporativo", "Institucional", "Cases"],
      keywords: ["Color", "Trilha ", "Edição", "Entrega"],
      legenda: "institucional · thumb"
    }
  ];

  const listaServicos = document.getElementById("lista-servicos");
  if (!listaServicos) return;

  const svgThumb =
    '<svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">' +
    '<rect x="3" y="4" width="18" height="16" rx="2"/>' +
    '<path d="M7 4v16M17 4v16M3 9h4M3 15h4M17 9h4M17 15h4"/>' +
    "</svg>";

  listaServicos.innerHTML = SERVICOS.map(function (s) {
    const tags = s.tags
      .map(function (t) {
        return "<li>" + t + "</li>";
      })
      .join("");
    const kws = s.keywords
      .map(function (k) {
        return "<li>" + k + "</li>";
      })
      .join("");
    return (
      "" +
      '<li class="svc">' +
      '<div class="svc-info">' +
      '<div class="svc-numero-linha">' +
      '<span class="svc-numero">' +
      s.numero +
      "</span>" +
      '<span class="svc-traco" aria-hidden="true"></span>' +
      "</div>" +
      '<h3 class="svc-titulo">' +
      s.titulo +
      "</h3>" +
      '<p class="svc-desc">' +
      s.desc +
      "</p>" +
      '<ul class="svc-tags">' +
      tags +
      "</ul>" +
      "</div>" +
      '<figure class="ph svc-midia">' +
      '<span class="tag-ph" aria-hidden="true">ph</span>' +
      svgThumb +
      '<figcaption class="mono">' +
      s.legenda +
      "</figcaption>" +
      "</figure>" +
      '<ul class="svc-keywords">' +
      kws +
      "</ul>" +
      "</li>"
    );
  }).join("");
}
