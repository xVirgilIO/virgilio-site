# VirgilIO — Sitio de Identidad

Sitio estático de identidad para VirgilIO. HTML/CSS/JS puro, sin frameworks, optimizado para SEO y rendimiento.

## Estructura

```
virgilio-site/
├── index.html              # Página principal
├── styles/
│   ├── base.css            # Reset, variables, tipografía
│   ├── components.css      # Componentes UI (cards, buttons, nav)
│   └── layout.css          # Grid, contenedores, responsive
├── scripts/
│   └── main.js             # Interacciones (nav, scroll, fade-in)
├── assets/
│   └── og-cover.svg        # Imagen social preview (1200×630)
├── sitemap.xml
├── robots.txt
├── site.webmanifest
├── vercel.json             # Config de deploy + security headers
└── README.md
```

## Configurar dominio

El dominio base `https://virgilio.dev` aparece en estos archivos. Reemplazarlo si se usa otro dominio:

| Archivo | Qué cambiar |
|---|---|
| `index.html` | `<link rel="canonical">`, todas las meta `og:*`, `twitter:image`, JSON-LD `url` |
| `sitemap.xml` | `<loc>` |
| `robots.txt` | `Sitemap:` URL |

Búsqueda rápida para localizar todas las ocurrencias:

```bash
grep -rn "virgilio.dev" .
```

## Deploy en Vercel

### Opción 1: CLI

```bash
npm i -g vercel
cd virgilio-site
vercel --prod
```

### Opción 2: GitHub

1. Push del directorio a un repositorio GitHub
2. Importar en [vercel.com/new](https://vercel.com/new)
3. Framework preset: `Other`
4. Root directory: `virgilio-site` (si está dentro de un monorepo)
5. No build command necesario — es estático

### Opción 3: Cualquier hosting estático

El sitio no requiere build. Servir el contenido del directorio directamente. Nginx, Caddy, GitHub Pages, Cloudflare Pages — cualquiera funciona.

## SEO incluido

- Meta tags: title, description, canonical, robots, theme-color
- Open Graph: og:title, og:description, og:image, og:url, og:type, og:locale
- Twitter Cards: summary_large_image
- JSON-LD: Person + WebSite schemas
- sitemap.xml + robots.txt
- Web manifest para PWA

## Iconos PWA

El manifest referencia `icon-192.png` e `icon-512.png` en `/assets/`. Generar estos archivos antes de habilitar PWA completa. Se puede usar el SVG del favicon como base.

## Licencia

Uso interno.
