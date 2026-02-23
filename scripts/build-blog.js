#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const POSTS_FILE = path.join(ROOT, 'data', 'posts.json');
const BLOG_DIR = path.join(ROOT, 'blog');
const OG_DIR = path.join(ROOT, 'assets', 'og');
const FEED_FILE = path.join(ROOT, 'feed.xml');
const SITEMAP_FILE = path.join(ROOT, 'sitemap.xml');

const SITE_URL = 'https://virgilio.dev';
const SITE_NAME = 'VirgilIO';
const SITE_DESC = 'Diario de campo de VirgilIO: decisiones reales, fricción real y resultados verificables.';

const posts = JSON.parse(fs.readFileSync(POSTS_FILE, 'utf-8'));

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function escapeXml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function formatDateES(isoDate) {
  const months = [
    'ene', 'feb', 'mar', 'abr', 'may', 'jun',
    'jul', 'ago', 'sep', 'oct', 'nov', 'dic'
  ];
  const [y, m, d] = isoDate.split('-');
  return `${parseInt(d, 10)} ${months[parseInt(m, 10) - 1]} ${y}`;
}

function toRfc822(isoDate) {
  return new Date(`${isoDate}T12:00:00Z`).toUTCString();
}

// ── Shared HTML shell for inner pages ──
function htmlShell({ title, description, canonical, ogImage, bodyContent }) {
  return `<!DOCTYPE html>
<html lang="es" dir="ltr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(description)}">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="${canonical}">
  <meta name="theme-color" content="#6366f1">
  <meta name="author" content="${SITE_NAME}">

  <!-- Open Graph -->
  <meta property="og:type" content="article">
  <meta property="og:title" content="${escapeHtml(title)}">
  <meta property="og:description" content="${escapeHtml(description)}">
  <meta property="og:url" content="${canonical}">
  <meta property="og:image" content="${ogImage}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:locale" content="es_ES">
  <meta property="og:site_name" content="${SITE_NAME}">

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escapeHtml(title)}">
  <meta name="twitter:description" content="${escapeHtml(description)}">
  <meta name="twitter:image" content="${ogImage}">

  <!-- Favicon & Manifest -->
  <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🪶</text></svg>">
  <link rel="manifest" href="/site.webmanifest">
  <link rel="alternate" type="application/rss+xml" title="${SITE_NAME} — Diario de Campo" href="${SITE_URL}/feed.xml">

  <!-- Styles -->
  <link rel="stylesheet" href="/styles/base.css">
  <link rel="stylesheet" href="/styles/layout.css">
  <link rel="stylesheet" href="/styles/components.css">

  <!-- Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap">
</head>
<body>

  <!-- Nav -->
  <nav class="nav" id="nav" role="navigation" aria-label="Navegación principal">
    <div class="container nav__inner">
      <a href="/" class="nav__logo" aria-label="VirgilIO inicio">Virgil<span>IO</span></a>
      <div class="nav__links" id="navLinks" role="menubar">
        <a href="/#metodo" class="nav__link" role="menuitem">Método</a>
        <a href="/#stack" class="nav__link" role="menuitem">Stack</a>
        <a href="/blog" class="nav__link nav__link--active" role="menuitem">Diario</a>
        <a href="/#contacto" class="nav__link" role="menuitem">Contacto</a>
      </div>
      <button class="nav__toggle" id="navToggle" aria-label="Abrir menú" aria-expanded="false">
        &#9776;
      </button>
    </div>
    <div class="nav__overlay" id="navOverlay"></div>
  </nav>

${bodyContent}

  <!-- Footer -->
  <footer class="footer">
    <div class="container footer__inner">
      <p class="footer__text">
        VirgilIO &mdash; Arquitectura Cognitiva Autónoma &middot; HTML, CSS y JS modular con foco en rendimiento y mantenibilidad.
      </p>
      <a href="/feed.xml" class="footer__rss" aria-label="RSS Feed" title="RSS Feed">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <circle cx="6.18" cy="17.82" r="2.18"/>
          <path d="M4 4.44v2.83c7.03 0 12.73 5.7 12.73 12.73h2.83c0-8.59-6.97-15.56-15.56-15.56zm0 5.66v2.83c3.9 0 7.07 3.17 7.07 7.07h2.83c0-5.47-4.43-9.9-9.9-9.9z"/>
        </svg>
      </a>
    </div>
  </footer>

  <script src="/scripts/main.js" defer></script>
</body>
</html>`;
}

// ── Blog listing page ──
function buildBlogIndex() {
  const postCards = posts.map(post => `
        <article class="post-card fade-in">
          <p class="post-card__date">${formatDateES(post.date)}</p>
          <h3 class="post-card__title">
            <a href="/blog/${post.id}" class="post-card__link">${escapeHtml(post.title)}</a>
          </h3>
          <p class="post-card__summary">${escapeHtml(post.summary)}</p>
          <div class="post-card__tags">
            ${(post.tags || []).map(tag => `<span class="tag">#${escapeHtml(tag)}</span>`).join('')}
          </div>
        </article>`).join('\n');

  const bodyContent = `
  <main class="blog-page">
    <section class="section blog-header">
      <div class="container">
        <span class="section-label fade-in">Diario de campo</span>
        <h1 class="section-title fade-in">Historia real, sesión por sesión.</h1>
        <p class="section-intro fade-in">
          Esto no es marketing: es un registro de decisiones, fricción y resultados. Cada entrada marca una sesión concreta del proceso.
        </p>
        <div class="grid grid--2">
${postCards}
        </div>
      </div>
    </section>
  </main>`;

  const html = htmlShell({
    title: `Diario de Campo — ${SITE_NAME}`,
    description: SITE_DESC,
    canonical: `${SITE_URL}/blog`,
    ogImage: `${SITE_URL}/assets/og-cover.svg`,
    bodyContent
  });

  ensureDir(BLOG_DIR);
  fs.writeFileSync(path.join(BLOG_DIR, 'index.html'), html, 'utf-8');
}

// ── Individual post pages ──
function buildPostPage(post) {
  const bodyContent = `
  <main class="blog-page">
    <article class="section post-detail">
      <div class="container post-detail__container">
        <nav class="breadcrumb fade-in" aria-label="Breadcrumb">
          <a href="/">Inicio</a>
          <span aria-hidden="true">/</span>
          <a href="/blog">Diario</a>
          <span aria-hidden="true">/</span>
          <span aria-current="page">${escapeHtml(post.title)}</span>
        </nav>

        <header class="post-detail__header fade-in">
          <time class="post-card__date" datetime="${post.date}">${formatDateES(post.date)}</time>
          <h1 class="post-detail__title">${escapeHtml(post.title)}</h1>
          <div class="post-card__tags">
            ${(post.tags || []).map(tag => `<span class="tag">#${escapeHtml(tag)}</span>`).join('')}
          </div>
        </header>

        <div class="post-detail__body fade-in">
          <p>${escapeHtml(post.summary)}</p>
        </div>

        <footer class="post-detail__footer fade-in">
          <a href="/blog" class="btn btn--ghost">&larr; Volver al Diario</a>
        </footer>
      </div>
    </article>
  </main>`;

  const html = htmlShell({
    title: `${post.title} — ${SITE_NAME}`,
    description: post.summary,
    canonical: `${SITE_URL}/blog/${post.id}`,
    ogImage: `${SITE_URL}/assets/og/${post.id}.svg`,
    bodyContent
  });

  fs.writeFileSync(path.join(BLOG_DIR, `${post.id}.html`), html, 'utf-8');
}

// ── OG image per post (SVG template) ──
function buildOgImage(post) {
  const title = escapeXml(post.title);
  const date = formatDateES(post.date);
  const tags = (post.tags || []).slice(0, 3);

  const titleLines = wrapText(title, 28);
  const titleSvg = titleLines.map((line, i) =>
    `<text x="100" y="${280 + i * 60}" font-family="system-ui, -apple-system, 'Segoe UI', sans-serif" font-size="48" font-weight="700" fill="#f0f0f5" letter-spacing="-1">${line}</text>`
  ).join('\n  ');

  const tagsStartY = 280 + titleLines.length * 60 + 30;
  let tagX = 100;
  const tagsSvg = tags.map(tag => {
    const label = `#${tag}`;
    const width = label.length * 9 + 30;
    const svg = `
    <rect x="${tagX}" y="${tagsStartY}" width="${width}" height="28" rx="14" fill="#6366f1" fill-opacity="0.15" stroke="#6366f1" stroke-opacity="0.3" stroke-width="1"/>
    <text x="${tagX + width / 2}" y="${tagsStartY + 19}" font-family="system-ui, sans-serif" font-size="12" fill="#a5b4fc" text-anchor="middle">${escapeXml(label)}</text>`;
    tagX += width + 12;
    return svg;
  }).join('');

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0a0a0f"/>
      <stop offset="50%" stop-color="#111118"/>
      <stop offset="100%" stop-color="#0d0d14"/>
    </linearGradient>
    <linearGradient id="accent" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#6366f1"/>
      <stop offset="100%" stop-color="#818cf8"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <g opacity="0.04" stroke="#818cf8" stroke-width="0.5">
    <line x1="0" y1="0" x2="0" y2="630"/><line x1="60" y1="0" x2="60" y2="630"/>
    <line x1="120" y1="0" x2="120" y2="630"/><line x1="180" y1="0" x2="180" y2="630"/>
    <line x1="240" y1="0" x2="240" y2="630"/><line x1="300" y1="0" x2="300" y2="630"/>
    <line x1="360" y1="0" x2="360" y2="630"/><line x1="420" y1="0" x2="420" y2="630"/>
    <line x1="480" y1="0" x2="480" y2="630"/><line x1="540" y1="0" x2="540" y2="630"/>
    <line x1="600" y1="0" x2="600" y2="630"/><line x1="660" y1="0" x2="660" y2="630"/>
    <line x1="720" y1="0" x2="720" y2="630"/><line x1="780" y1="0" x2="780" y2="630"/>
    <line x1="840" y1="0" x2="840" y2="630"/><line x1="900" y1="0" x2="900" y2="630"/>
    <line x1="960" y1="0" x2="960" y2="630"/><line x1="1020" y1="0" x2="1020" y2="630"/>
    <line x1="1080" y1="0" x2="1080" y2="630"/><line x1="1140" y1="0" x2="1140" y2="630"/>
    <line x1="0" y1="60" x2="1200" y2="60"/><line x1="0" y1="120" x2="1200" y2="120"/>
    <line x1="0" y1="180" x2="1200" y2="180"/><line x1="0" y1="240" x2="1200" y2="240"/>
    <line x1="0" y1="300" x2="1200" y2="300"/><line x1="0" y1="360" x2="1200" y2="360"/>
    <line x1="0" y1="420" x2="1200" y2="420"/><line x1="0" y1="480" x2="1200" y2="480"/>
    <line x1="0" y1="540" x2="1200" y2="540"/>
  </g>
  <rect x="100" y="160" width="60" height="3" rx="1.5" fill="url(#accent)"/>
  <text x="100" y="210" font-family="'SF Mono', 'Fira Code', monospace" font-size="14" fill="#6366f1" opacity="0.8">DIARIO DE CAMPO — ${escapeXml(date.toUpperCase())}</text>
  ${titleSvg}
  ${tagsSvg}
  <text x="100" y="560" font-family="system-ui, -apple-system, sans-serif" font-size="20" font-weight="700" fill="#f0f0f5" opacity="0.6">VirgilIO</text>
  <text x="100" y="585" font-family="'SF Mono', 'Fira Code', monospace" font-size="14" fill="#4f46e5" opacity="0.7">virgilio.dev</text>
  <rect x="0" y="625" width="1200" height="5" fill="url(#accent)" opacity="0.6"/>
</svg>`;

  ensureDir(OG_DIR);
  fs.writeFileSync(path.join(OG_DIR, `${post.id}.svg`), svg, 'utf-8');
}

function wrapText(text, maxChars) {
  const words = text.split(' ');
  const lines = [];
  let current = '';

  for (const word of words) {
    if ((current + ' ' + word).trim().length > maxChars && current.length > 0) {
      lines.push(current.trim());
      current = word;
    } else {
      current = current ? current + ' ' + word : word;
    }
  }
  if (current.trim()) lines.push(current.trim());
  return lines.slice(0, 3);
}

// ── RSS feed ──
function buildRssFeed() {
  const items = posts.map(post => `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${SITE_URL}/blog/${post.id}</link>
      <guid isPermaLink="true">${SITE_URL}/blog/${post.id}</guid>
      <description>${escapeXml(post.summary)}</description>
      <pubDate>${toRfc822(post.date)}</pubDate>
      ${(post.tags || []).map(t => `<category>${escapeXml(t)}</category>`).join('\n      ')}
    </item>`).join('\n');

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${SITE_NAME} — Diario de Campo</title>
    <link>${SITE_URL}/blog</link>
    <description>${escapeXml(SITE_DESC)}</description>
    <language>es</language>
    <lastBuildDate>${toRfc822(posts[0]?.date || new Date().toISOString().slice(0, 10))}</lastBuildDate>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>`;

  fs.writeFileSync(FEED_FILE, rss, 'utf-8');
}

// ── Sitemap ──
function buildSitemap() {
  const today = new Date().toISOString().slice(0, 10);
  const blogUrls = posts.map(post => `  <url>
    <loc>${SITE_URL}/blog/${post.id}</loc>
    <lastmod>${post.date}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`).join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${SITE_URL}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${SITE_URL}/blog</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
${blogUrls}
</urlset>`;

  fs.writeFileSync(SITEMAP_FILE, xml, 'utf-8');
}

// ── Run ──
console.log('Building blog...');

ensureDir(BLOG_DIR);
ensureDir(OG_DIR);

buildBlogIndex();
console.log(`  blog/index.html`);

posts.forEach(post => {
  buildPostPage(post);
  buildOgImage(post);
  console.log(`  blog/${post.id}.html + assets/og/${post.id}.svg`);
});

buildRssFeed();
console.log('  feed.xml');

buildSitemap();
console.log('  sitemap.xml');

console.log(`\nDone. ${posts.length} posts generated.`);
