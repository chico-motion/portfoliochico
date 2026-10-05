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
        main:  resolve(raiz, "index.html"),
        works: resolve(raiz, "works.html"),
        e404:  resolve(raiz, "404.html")
      }
    }
  },
  server: {
    port: 5173,
    open: true
  }
});