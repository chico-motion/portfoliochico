/* Fonte única de verdade dos projetos.

   A ORDEM deste array define o ciclo de navegação (próximo / anterior).
   Adicionar, remover ou reordenar aqui reflete automaticamente em:
   - Grid da works (works.js)
   - Footer de navegação de cada projeto (projeto-nav.js)
   - Botão "próximo / anterior" dentro da overlay */

export const PROJETOS = [
  { id: "flakes-power",          nome: "Flakes Power",           cat: "games",  disc: "Motion Design · Social",img: "/assets/thumbs/flakes-power.webp" },
  { id: "hero-base",             nome: "Hero Base",              cat: "games",  disc: "Motion Design · Social",img: "/assets/thumbs/hero-base.webp" },
  { id: "krona",                 nome: "Krona",                  cat: "brands", disc: "Motion Design · Social",img: "/assets/thumbs/krona.webp" },
  { id: "almeida-junior",        nome: "Almeida Júnior",         cat: "games",  disc: "Motion Design · Social",img: "/assets/thumbs/almeida-junior.webp" },
  { id: "javali-couros",         nome: "Javali Couros",          cat: "brands", disc: "Motion Design · Social",img: "/assets/thumbs/javali-couros.webp" },
  { id: "ambev",                 nome: "Ambev",                  cat: "brands", disc: "Motion Design · Social",img: "/assets/thumbs/ambev.webp" },
  { id: "stream-packs",          nome: "Stream Packs",           cat: "games",  disc: "Motion Design · Social",img: "/assets/thumbs/stream-packs.webp" },
  { id: "solid-gear",            nome: "Solid Gear",             cat: "games",  disc: "Motion Design · Social",img: "/assets/thumbs/solid-gear.webp" },
  { id: "pituchinhus",           nome: "Pituchinhus",            cat: "brands", disc: "Motion Design · Social",img: "/assets/thumbs/pituchinhus.webp" },
  { id: "cit",                   nome: "CI&T",                   cat: "brands", disc: "Motion Design · Social",img: "/assets/thumbs/cit.webp" },
  { id: "signia-studios",        nome: "Signia Studios",         cat: "brands", disc: "Motion Design · Social",img: "/assets/thumbs/signia-studios.webp" },
  { id: "wizard",                nome: "Wizard",                 cat: "brands", disc: "Motion Design · Social",img: "/assets/thumbs/wizard.webp" },
  { id: "prefeitura-gaspar",     nome: "Prefeitura de Gaspar",   cat: "brands", disc: "Motion Design · Social",img: "/assets/thumbs/prefeitura-gaspar.webp" },
  { id: "prefeitura-sfs",        nome: "Prefeitura de SFS",      cat: "brands", disc: "Motion Design · Social",img: "/assets/thumbs/prefeitura-sfs.webp" },
  { id: "prefeitura-araquari",   nome: "Prefeitura de Araquari", cat: "brands", disc: "Motion Design · Social",img: "/assets/thumbs/prefeitura-araquari.webp" },
  { id: "toniket",               nome: "Toniket",                cat: "games",  disc: "Motion Design · Social",img: "/assets/thumbs/toniket.webp" }
];

/* Retorna { anterior, proximo } a partir do id. Ciclo fechado
   (o primeiro aponta pro último, o último pro primeiro). */
export function vizinhos(id) {
  const n = PROJETOS.length;
  if (!n) return null;
  const i = PROJETOS.findIndex(function (p) { return p.id === id; });
  if (i === -1) return null;
  return {
    anterior: PROJETOS[(i - 1 + n) % n],
    proximo:  PROJETOS[(i + 1) % n]
  };
}

export function projetoPorId(id) {
  return PROJETOS.find(function (p) { return p.id === id; }) || null;
}