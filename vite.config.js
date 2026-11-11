import { defineConfig } from "vite";
import { resolve } from "path";
import { readFileSync } from "fs";

const raiz = import.meta.dirname;

function includes() {
  return {
    name: "html-includes",
    transformIndexHtml(html) {
      return html.replace(
        /<!--\s*include:\s*(.+?)\s*-->/g,
        (_, file) => readFileSync(resolve(raiz, file.trim()), "utf-8")
      );
    }
  };
}

export default defineConfig({
  appType: "mpa",
  root: ".",
  publicDir: "public",
  plugins: [includes()],
  build: {
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(raiz, "index.html"),
        works: resolve(raiz, "works.html"),
        e404: resolve(raiz, "404.html"),

        "projeto-flakes-power":        resolve(raiz, "works/flakes-power.html"),
        "projeto-hero-base":           resolve(raiz, "works/hero-base.html"),
        "projeto-krona":               resolve(raiz, "works/krona.html"),
        "projeto-almeida-junior":      resolve(raiz, "works/almeida-junior.html"),
        "projeto-javali-couros":       resolve(raiz, "works/javali-couros.html"),
        "projeto-ambev":               resolve(raiz, "works/ambev.html"),
        "projeto-stream-packs":        resolve(raiz, "works/stream-packs.html"),
        "projeto-solid-gear":          resolve(raiz, "works/solid-gear.html"),
        "projeto-pituchinhus":         resolve(raiz, "works/pituchinhus.html"),
        "projeto-cit":                 resolve(raiz, "works/cit.html"),
        "projeto-signia-studios":      resolve(raiz, "works/signia-studios.html"),
        "projeto-wizard":              resolve(raiz, "works/wizard.html"),
        "projeto-prefeitura-gaspar":   resolve(raiz, "works/prefeitura-gaspar.html"),
        "projeto-prefeitura-sfs":      resolve(raiz, "works/prefeitura-sfs.html"),
        "projeto-prefeitura-araquari": resolve(raiz, "works/prefeitura-araquari.html"),
        "projeto-toniket":             resolve(raiz, "works/toniket.html")
      }
    }
  },
  server: {
    port: 5173,
    open: true
  }
});