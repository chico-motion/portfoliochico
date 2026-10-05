# Chico Martins — Portfólio

Portfólio pessoal de Chico Martins, editor e motion designer.

## Stack

- HTML + CSS + JavaScript puro (sem frameworks)
- Vite para build e dev server
- CSS Cascade Layers para organização
- Módulos ES no JS

## Rodar localmente

```bash
npm install
npm run dev
```

Abre em `http://localhost:5173`.

## Build de produção

```bash
npm run build
npm run preview
```

O resultado fica em `dist/`.

## Lint e formatação

```bash
npm run lint     # roda ESLint (JS) + Stylelint (CSS)
npm run format   # roda Prettier em src/ e HTMLs
```

## Estrutura

```
├── index.html, works.html, 404.html    páginas
├── public/                             assets estáticos
│   ├── fonts/                          woff2
│   ├── assets/                         logos, favicon, og-image
│   └── flags/                          bandeiras do flag-icons
├── src/
│   ├── css/                            folhas de estilo em camadas
│   │   ├── main.css                    orquestrador de imports
│   │   ├── tokens.css                  custom properties
│   │   ├── base.css                    reset, fontes, elementos globais
│   │   ├── layout.css                  containers e grids estruturais
│   │   ├── utilities.css               classes utilitárias
│   │   ├── reducao-movimento.css       prefers-reduced-motion
│   │   ├── components/                 um arquivo por componente
│   │   └── pages/                      estilos específicos de página
│   ├── js/
│   │   ├── main.js                     orquestrador
│   │   └── modules/                    um arquivo por feature
│   └── partials/                       header e footer
└── vite.config.js
```

## Adicionar uma página nova

1. Cria o HTML na raiz.
2. Adiciona ao `rollupOptions.input` em `vite.config.js`.
3. Reaproveita os partials com `<!-- include: src/partials/header.html -->`.

## Adicionar um serviço novo

Edita o array `SERVICOS` em `src/js/modules/services.js`.

## Adicionar um módulo JS novo

1. Cria o arquivo em `src/js/modules/meu-modulo.js` exportando uma função `initMeuModulo()`.
2. Importa e chama essa função em `src/js/main.js`.