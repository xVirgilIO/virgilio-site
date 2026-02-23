# VirgilIO — Sitio de Identidad

Sitio estático de identidad para **VirgilIO**, una arquitectura cognitiva autónoma especializada en ingeniería de software. Construido con HTML/CSS/JS puro — sin frameworks, sin build step, sin dependencias. Optimizado para SEO, rendimiento y seguridad desde el primer deploy.

**Stack:** HTML5 · CSS3 (custom properties, grid, flexbox) · Vanilla JS (ES2020+)
**Hosting objetivo:** Vercel (static) · Compatible con cualquier CDN/hosting estático
**Dominio:** `virgilio.dev`

---

## Arquitectura

El proyecto sigue una estructura modular por responsabilidad. Cada archivo tiene un propósito único y aislado.

```
virgilio-site/
├── index.html                 # Documento principal (SPA single-page)
├── styles/
│   ├── base.css               # Reset, custom properties, tipografía, colores
│   ├── layout.css             # Grid system, contenedores, breakpoints responsive
│   └── components.css         # Componentes UI: cards, buttons, nav, hero, CTA
├── scripts/
│   └── main.js                # Interacciones: nav scroll, mobile menu, fade-in observer
├── assets/
│   └── og-cover.svg           # Imagen para social preview (1200×630)
├── sitemap.xml                # Sitemap para crawlers
├── robots.txt                 # Directivas de indexación
├── site.webmanifest           # Manifest PWA (nombre, iconos, theme)
├── vercel.json                # Deploy config: security headers + cache policy
└── README.md
```

### CSS modular

| Archivo | Responsabilidad |
|---|---|
| `base.css` | Variables CSS (`--color-*`, `--font-*`, `--space-*`), reset, tipografía base |
| `layout.css` | `.container`, `.grid`, `.split`, media queries, responsive breakpoints |
| `components.css` | `.nav`, `.hero`, `.card`, `.btn`, `.tag`, `.cta-box`, `.footer`, animaciones |

### JavaScript

Un único archivo IIFE (`main.js`) que gestiona:

- Efecto de scroll en nav (`.nav--scrolled`)
- Menú móvil con overlay y cierre por Escape
- `IntersectionObserver` para animaciones fade-in al scroll
- Highlight automático del link activo en nav según sección visible

---

## Quickstart local

No requiere `npm install`, build, ni dependencias. Solo un servidor HTTP local.

### Opción A — Python (preinstalado en macOS/Linux)

```bash
git clone <repo-url> virgilio-site
cd virgilio-site
python3 -m http.server 8080
```

Abrir `http://localhost:8080`

### Opción B — Node.js (npx, sin instalar globalmente)

```bash
cd virgilio-site
npx serve .
```

### Opción C — VS Code

Instalar la extensión [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer), abrir `index.html` y hacer clic en "Go Live".

### Verificación local rápida

| Check | Cómo verificar |
|---|---|
| Página carga sin errores | DevTools > Console (sin errores rojos) |
| CSS aplicado correctamente | Fondo oscuro, tipografía Inter/JetBrains Mono |
| Nav responsive | Reducir viewport a <768px, verificar hamburger menu |
| Fade-in funciona | Scroll lento, los elementos aparecen con transición |
| Links internos | Click en nav links, scroll suave a cada sección |

---

## SEO / Open Graph — Checklist

Todo el SEO está implementado en `index.html`. Esta tabla sirve como referencia de auditoría.

### Meta tags

| Tag | Estado | Valor |
|---|---|---|
| `<title>` | Implementado | VirgilIO — Arquitectura Cognitiva Autónoma |
| `meta description` | Implementado | Descripción de 160 chars |
| `meta robots` | Implementado | `index, follow` |
| `link canonical` | Implementado | `https://virgilio.dev/` |
| `meta theme-color` | Implementado | `#6366f1` |
| `meta author` | Implementado | VirgilIO |

### Open Graph

| Property | Estado | Notas |
|---|---|---|
| `og:type` | Implementado | `website` |
| `og:title` | Implementado | Coincide con `<title>` |
| `og:description` | Implementado | Versión corta para previews |
| `og:url` | Implementado | URL canónica |
| `og:image` | Implementado | `/assets/og-cover.svg` (1200×630) |
| `og:locale` | Implementado | `es_ES` |
| `og:site_name` | Implementado | VirgilIO |

### Twitter Card

| Property | Estado |
|---|---|
| `twitter:card` | `summary_large_image` |
| `twitter:title` | Implementado |
| `twitter:description` | Implementado |
| `twitter:image` | Implementado |

### Structured Data (JSON-LD)

| Schema | Tipo |
|---|---|
| Person | Nombre, URL, descripción, skills, jobTitle |
| WebSite | Nombre, URL, idioma |

### Archivos complementarios

| Archivo | Estado |
|---|---|
| `sitemap.xml` | Single URL, `lastmod` actualizado |
| `robots.txt` | `Allow: /` + referencia a sitemap |
| `site.webmanifest` | Nombre, iconos (192/512), theme color |

### Validación SEO externa

- [Google Rich Results Test](https://search.google.com/test/rich-results) — validar JSON-LD
- [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/) — validar OG tags
- [Twitter Card Validator](https://cards-dev.twitter.com/validator) — validar preview
- [PageSpeed Insights](https://pagespeed.web.dev/) — métricas Core Web Vitals

> **Nota sobre og:image:** Algunas plataformas (WhatsApp, LinkedIn) no renderizan SVG como preview. Si se detecta este problema, generar una versión PNG/JPG de `og-cover.svg` y actualizar las meta tags.

---

## Deploy en Vercel

### Opción 1 — CLI (recomendada para primer deploy)

```bash
npm i -g vercel
cd virgilio-site
vercel --prod
```

Vercel detectará automáticamente que es un sitio estático (sin framework, sin build command).

### Opción 2 — GitHub Integration

1. Push del repositorio a GitHub
2. Ir a [vercel.com/new](https://vercel.com/new) e importar el repo
3. **Framework Preset:** `Other`
4. **Root Directory:** `.` (o `virgilio-site` si está dentro de un monorepo)
5. **Build Command:** dejar vacío
6. **Output Directory:** dejar vacío
7. Deploy

### Opción 3 — Otros hostings estáticos

El sitio no tiene build step. Servir el directorio raíz tal cual. Compatibles:

| Plataforma | Comando / Método |
|---|---|
| **Nginx** | `root /path/to/virgilio-site;` |
| **Caddy** | `file_server` en Caddyfile |
| **GitHub Pages** | Push a branch `gh-pages` |
| **Cloudflare Pages** | Conectar repo, sin build command |
| **Netlify** | Publish directory: `.` |

### Configuración de Vercel (`vercel.json`)

El archivo incluye:

- **Security headers** en todas las rutas: `X-Content-Type-Options`, `X-Frame-Options`, `CSP`, `HSTS`, `Permissions-Policy`
- **Cache immutable** para assets, styles y scripts (1 año)
- **Clean URLs** habilitado (sin `.html` en la URL)
- **Trailing slash** deshabilitado

---

## Dominio personalizado

El dominio `virgilio.dev` está hardcodeado en varios archivos. Para usar un dominio diferente, actualizar las siguientes referencias:

| Archivo | Qué cambiar |
|---|---|
| `index.html` | `<link rel="canonical">`, todas las `og:*` URLs, `twitter:image`, JSON-LD `url` fields |
| `sitemap.xml` | `<loc>` URL |
| `robots.txt` | `Sitemap:` URL |

### Búsqueda rápida de ocurrencias

```bash
rg "virgilio\.dev" --no-heading
```

### Configuración en Vercel

1. En el dashboard del proyecto: **Settings > Domains**
2. Agregar dominio personalizado
3. Configurar DNS según instrucciones de Vercel:
   - **Dominio apex** (`virgilio.dev`): registro `A` apuntando a `76.76.21.21`
   - **Subdominio www:** registro `CNAME` apuntando a `cname.vercel-dns.com`
4. Vercel provisiona SSL automáticamente via Let's Encrypt

---

## Validación post-deploy

Ejecutar esta checklist después de cada deploy a producción.

### Funcional

- [ ] `https://virgilio.dev` carga correctamente (HTTP 200)
- [ ] Redirección HTTP → HTTPS funciona
- [ ] Navegación interna (anchor links) funciona
- [ ] Menú móvil abre/cierra correctamente
- [ ] Animaciones fade-in se disparan al scroll
- [ ] Links externos (`mailto:`, GitHub) funcionan

### SEO y social

- [ ] `https://virgilio.dev/sitemap.xml` accesible (HTTP 200)
- [ ] `https://virgilio.dev/robots.txt` accesible (HTTP 200)
- [ ] OG image carga: `https://virgilio.dev/assets/og-cover.svg`
- [ ] Facebook Debugger muestra preview correcto
- [ ] JSON-LD válido en Rich Results Test

### Seguridad y performance

- [ ] Headers de seguridad presentes (verificar con `curl -I https://virgilio.dev`)
- [ ] HSTS activo con `max-age=63072000`
- [ ] CSP aplicado sin bloquear recursos legítimos
- [ ] Cache headers en assets: `max-age=31536000, immutable`
- [ ] PageSpeed score > 90 en mobile y desktop

### Comando de verificación rápida

```bash
curl -sI https://virgilio.dev | head -20
```

Debe mostrar: `HTTP/2 200`, `strict-transport-security`, `x-content-type-options: nosniff`, `x-frame-options: DENY`.

---

## Troubleshooting

### Fonts no cargan

**Síntoma:** Tipografía fallback (serif/sans-serif) en lugar de Inter/JetBrains Mono.

**Causa probable:** CSP bloquea el dominio de Google Fonts.

**Solución:** Verificar que `vercel.json` incluya `style-src 'self' https://fonts.googleapis.com` y `font-src 'self' https://fonts.gstatic.com` en el header CSP.

---

### OG image no aparece en previews sociales

**Síntoma:** WhatsApp, LinkedIn o Slack no muestran la imagen de preview.

**Causa probable:** La plataforma no soporta SVG como og:image.

**Solución:** Convertir `og-cover.svg` a PNG (1200×630), subirlo como `og-cover.png` en `/assets/` y actualizar las meta tags en `index.html`.

---

### Menú móvil no cierra

**Síntoma:** El overlay queda visible después de seleccionar un link.

**Causa probable:** El event listener de `closeMenu` no se registró correctamente.

**Solución:** Verificar que `main.js` se carga con `defer` y que no hay errores en consola. El script requiere que los elementos `#navToggle`, `#navLinks` y `#navOverlay` existan en el DOM.

---

### Console muestra error de manifest

**Síntoma:** `Manifest: Line: 1, column: 1, Syntax error` o iconos 404.

**Causa probable:** Los archivos `icon-192.png` e `icon-512.png` no existen en `/assets/`.

**Solución:** Generar los iconos PNG a partir del favicon SVG o de `og-cover.svg`. Herramientas recomendadas: [RealFaviconGenerator](https://realfavicongenerator.net/) o [PWA Asset Generator](https://github.com/nicedoc/pwa-asset-generator).

---

### Deploy en Vercel falla

**Síntoma:** Error durante el deploy o página en blanco.

**Causa probable:** Root directory incorrecto (especialmente en monorepos).

**Solución:**
1. Verificar que **Root Directory** apunta a la carpeta que contiene `index.html`
2. Verificar que **Framework Preset** es `Other`
3. No hay build command necesario — si Vercel lo exige, usar `echo 'static site'`

---

### Headers de seguridad no aparecen

**Síntoma:** `curl -I` no muestra los headers configurados.

**Causa probable:** `vercel.json` no está en el root directory del proyecto en Vercel.

**Solución:** Verificar que `vercel.json` está en el mismo nivel que `index.html`. Si el proyecto está en un subdirectorio, mover `vercel.json` al root del deploy.

---

## Roadmap

Mejoras planificadas para próximas iteraciones:

| Prioridad | Tarea | Estado |
|---|---|---|
| Alta | Generar iconos PWA (`icon-192.png`, `icon-512.png`) | Pendiente |
| Alta | Convertir `og-cover.svg` a PNG para compatibilidad social | Pendiente |
| Media | Agregar `favicon.ico` como fallback para navegadores legacy | Pendiente |
| Media | Implementar Service Worker para offline support | Pendiente |
| Media | Agregar página 404 personalizada | Pendiente |
| Baja | Dark/light mode toggle | Pendiente |
| Baja | Internacionalización (EN/ES) | Pendiente |
| Baja | Analytics (Plausible o similar, privacy-first) | Pendiente |

---

## Licencia

Uso interno.
