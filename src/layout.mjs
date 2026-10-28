// Shared layout: URL helpers, head, nav, footer, page shell.
import { site, nav, cta } from './content.mjs';

export const T = { target: 'web' }; // set by build.mjs: 'web' | 'artifact'

// ── URL helpers ──────────────────────────────────────────────
// Flat files with relative paths: works on any host and when index.html is double-clicked.
export const fileOf = (id = 'home') => (id === 'home' ? 'index.html' : id.replace(/\//g, '-') + '.html');
export function href(id = 'home', hash = '') {
  return fileOf(id) + (hash ? '#' + hash : '');
}
export const asset = (p) => 'assets/' + p;
export const absUrl = (id) => site.url.replace(/\/$/, '') + '/' + (id === 'home' ? '' : fileOf(id).replace(/\.html$/, ''));

// ── Text helpers ─────────────────────────────────────────────
export const esc = (s = '') =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// *word* → accent, [PLACEHOLDER] → chip, [Thing] → slot
export function md(s = '') {
  return esc(s)
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
    .replace(/\[PLACEHOLDER\]\s?/g, '<span class="ph">Placeholder</span> ')
    .replace(/\[([^\]]+)\]/g, '<span class="ph-slot">$1</span>');
}
export const plain = (s = '') => String(s).replace(/\*/g, '').replace(/\[PLACEHOLDER\]\s?/g, '');
export const isPh = (s = '') => /\[/.test(s);

// ── Icons ────────────────────────────────────────────────────
export const arrow = (dir = 'ur') => {
  const d = dir === 'dr' ? 'M4 4l8 8M12 5v7H5' : dir === 'r' ? 'M2 8h11M9 4l4 4-4 4' : 'M4 12l8-8M5 4h7v7';
  const svg = `<svg viewBox="0 0 16 16" aria-hidden="true"><path d="${d}"/></svg>`;
  return `<span class="arr arr-${dir}" aria-hidden="true"><i>${svg}</i><i>${svg}</i></span>`;
};
export const mark = (cls = 'mark') => `<svg class="${cls}" viewBox="0 0 40 40" aria-hidden="true">
<ellipse cx="20" cy="20" rx="17" ry="17" fill="none" stroke="currentColor" stroke-width="1.6"/>
<ellipse cx="20" cy="20" rx="17" ry="8" fill="none" stroke="currentColor" stroke-width="1.6" transform="rotate(-28 20 20)" opacity=".85"/>
<ellipse cx="20" cy="20" rx="8" ry="17" fill="none" stroke="currentColor" stroke-width="1.6" transform="rotate(-28 20 20)" opacity=".7"/>
<circle cx="20" cy="20" r="3.2" fill="#FF3B2F"/></svg>`;
const favicon = `data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><rect width="40" height="40" rx="9" fill="#0A0909"/><path transform="translate(4.5 6.2) scale(.5)" fill="#F1EEEA" d="M10 52 L40 -10 L71 52 L62.5 52 L37.85 2.7 L14 52 Z"/></svg>'
)}`;

export const SHAPES = `<path d="M10 72 L40 10 L71 72 L62.5 72 L37.85 22.7 L14 72 Z"/><path d="M90 10 L94.6 10 L121 43 L117.5 45.5 Z"/><path d="M148 10 L139 10 L115 42 L123 46 Z"/><rect x="115" y="42" width="8" height="30"/><rect x="168" y="10" width="8" height="62"/><rect x="168" y="68.4" width="40" height="3.6"/><path d="M 222 72 L 252 10 L 283 72 L 274.5 72 L 249.85 22.7 L 226 72 Z"/>`;
export const logo = (cls = 'logo') => `<svg class="${cls}" viewBox="6 6 280 70" aria-hidden="true" fill="currentColor">${SHAPES}</svg>`;
export const lockup = (cls = 'lockup') => `<svg class="${cls}" viewBox="0 0 292 116" aria-hidden="true" fill="currentColor"><g>${SHAPES}</g><text x="146" y="104" text-anchor="middle" font-size="12.5" letter-spacing="9">COLLECTIVE</text></svg>`;

// ── Components ───────────────────────────────────────────────
export function btn(label, url, variant = 'primary', opts = {}) {
  const { dir = 'ur', cls = '', attrs = '', tag = 'a' } = opts;
  const a = tag === 'a' ? `href="${url}"` : `type="${opts.type || 'button'}"`;
  return `<${tag} class="btn btn-${variant} ${cls}" ${a} ${attrs} data-magnetic><span class="btn-label">${esc(label)}</span>${arrow(dir)}</${tag}>`;
}
export const ctaBtn = (cls = '', variant = 'primary') =>
  btn(cta.label, href(cta.id), variant, { cls, attrs: 'data-cta' });

export const kicker = (txt) => `<p class="kicker">${md(txt)}</p>`;

// Section heading with split-text reveal
export const h2 = (txt, cls = '') => `<h2 class="h2 ${cls}" data-split>${md(txt)}</h2>`;

// ── Head ─────────────────────────────────────────────────────
function head({ id, title, desc, jsonld = [] }) {
  const fullTitle = id === 'home' ? (T.target === 'artifact' ? site.name : `${site.name} | Attention into revenue`) : `${title} | ${site.name}`;
  const fonts = T.target === 'web'
    ? `<link rel="preload" href="${asset('fonts/funnel-display.woff2')}" as="font" type="font/woff2" crossorigin>`
    : '';
  const ld = [
    {
      '@context': 'https://schema.org', '@type': ['Organization', 'ProfessionalService'],
      name: site.name, url: site.url, email: site.email, description: site.description,
      areaServed: '[CONFIRM] service area', knowsAbout: ['Content production', 'Paid advertising', 'Websites', 'Lead follow-up automation'],
    },
    ...jsonld,
  ];
  return `<title>${esc(fullTitle)}</title>
<meta name="claude:viewport-fit-sides" content="cover">
<meta name="description" content="${esc(desc)}">
<meta name="theme-color" content="#0A0909">
<meta name="color-scheme" content="dark">
<!-- DEPLOY STEP: og:url and og:image need the live absolute URL -->
<meta property="og:type" content="website">
<meta property="og:site_name" content="${esc(site.name)}">
<meta property="og:title" content="${esc(fullTitle)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${absUrl(id)}">
<meta property="og:image" content="${site.url.replace(/\/$/, '')}/assets/img/og.jpg">
<meta name="twitter:card" content="summary_large_image">
${T.target === 'web' ? `<link rel="canonical" href="${absUrl(id)}">` : ''}
<link rel="icon" href="${favicon}">
${fonts}
<link rel="stylesheet" href="${asset('css/site.css')}">
<script>(function(d){var c=d.documentElement.classList;c.add('js');var pq=/[?&]palette=(\\w+)/.exec(location.search);d.documentElement.setAttribute('data-palette',pq?pq[1]:'${site.palette}');try{if('scrollRestoration' in history)history.scrollRestoration='manual';}catch(e){}try{if(matchMedia('(prefers-reduced-motion: reduce)').matches)c.add('rm');if(sessionStorage.getItem('ayla-pt')==='1'){c.add('pt-in');sessionStorage.removeItem('ayla-pt')}${id === 'home' ? `if(!sessionStorage.getItem('ayla-seen')&&!c.contains('rm')&&!c.contains('pt-in'))c.add('preload')` : ''}}catch(e){}})(document)</script>
${ld.map((o) => `<script type="application/ld+json">${JSON.stringify(o)}</script>`).join('\n')}`;
}

// ── Nav ──────────────────────────────────────────────────────
function navbar(id) {
  const top = id.split('/')[0];
  const links = nav
    .map((n) => `<li><a href="${href(n.id)}"${top === n.id ? ' aria-current="page"' : ''}>${n.label}</a></li>`)
    .join('');
  const menuLinks = [...nav, { id: 'contact', label: 'Contact' }]
    .map((n, i) => `<li><a href="${href(n.id)}"${top === n.id ? ' aria-current="page"' : ''}><span class="mono">0${i + 1}</span>${n.label}${arrow()}</a></li>`)
    .join('');
  return `<a class="skip" href="#main">Skip to content</a>
<header class="nav" data-nav>
  <div class="nav-pill glass">
    <a class="nav-logo" href="${href('home')}" aria-label="AYLA Collective, home">${logo('nav-mark')}<span class="nav-sub">Collective</span></a>
    <nav class="nav-main" aria-label="Main"><ul class="nav-links">${links}</ul></nav>
    ${btn(cta.label, href(cta.id), 'primary', { cls: 'btn-sm nav-cta', attrs: 'data-cta' })}
    <button class="nav-burger" type="button" aria-expanded="false" aria-controls="menu"><span>Menu</span><i aria-hidden="true"></i></button>
  </div>
</header>
<div class="menu" id="menu" hidden>
  <div class="menu-inner wrap">
    <p class="kicker">Menu</p>
    <ul class="menu-links">${menuLinks}</ul>
    <div class="menu-foot"><span class="mono">${site.email}</span>${ctaBtn('btn-lg')}</div>
  </div>
</div>`;
}

// ── Shared closing CTA band (inner pages) ────────────────────
export function nextStage() {
  return `<section class="next wrap" aria-labelledby="next-h">
  <div class="next-card glass" data-reveal>
    <p class="kicker">The next chapter</p>
    <h2 class="h2" id="next-h" data-split>Your next stage <em>starts here.</em></h2>
    <p class="lede">Tell us where you want to go. We’ll find what’s standing in the way.</p>
    <div class="row">${ctaBtn('btn-lg')}<span class="mono next-mail">${site.email}</span></div>
  </div>
</section>`;
}

// ── Footer ───────────────────────────────────────────────────
function footer() {
  const col = (title, items) =>
    `<div class="foot-col"><p class="kicker">${title}</p><ul>${items
      .map(([id, l]) => `<li><a href="${href(id)}">${l}</a></li>`)
      .join('')}</ul></div>`;
  return `<footer class="foot" data-foot>
  <div class="wrap foot-top">
    <div class="foot-brand">
      <p class="foot-line">Creative, advertising, websites, and follow-up. <em>Connected.</em></p>
      <button class="mail-copy" type="button" data-copy="${site.email}"><span class="mono">${site.email}</span><span class="mail-tip" aria-live="polite">Copy</span></button>
    </div>
    ${col('Explore', [['services', 'Services'], ['industries', 'Industries'], ['work', 'Work'], ['approach', 'Approach']])}
    ${col('Company', [['about', 'About'], ['insights', 'Insights'], ['growth-audit', 'Growth audit'], ['contact', 'Contact']])}
    ${col('Legal', [['privacy', 'Privacy'], ['terms', 'Website information']])}
  </div>
  <div class="foot-word" aria-hidden="true" data-sheen><span class="foot-mask"></span></div>
  <div class="wrap foot-base">
    <span class="mono">© 2026 ${site.name}. All rights reserved.</span>
    <span class="mono">Independent thinking. Connected growth.</span>
    <a class="mono to-top" href="#main">Back to top ↑</a>
  </div>
</footer>`;
}

// ── Page shell ───────────────────────────────────────────────
export function page({ id, title, desc, body, jsonld = [], scripts = [], next = true, hero3d = false }) {
  const stickyCta = `<div class="sticky-cta" data-sticky-cta>${ctaBtn('btn-block')}</div>`;
  const chrome = `<div class="env" aria-hidden="true"><i class="env-a"></i><i class="env-b"></i></div>
<div class="grain" aria-hidden="true"></div>
<div class="pt" aria-hidden="true"><div class="pt-panel">${logo('pt-mark')}</div></div>
${id === 'home' ? preloader() : ''}
<div class="cursor" aria-hidden="true"><i class="cursor-dot"></i><i class="cursor-ring"><b class="cursor-label"></b></i></div>`;
  const inner = `${chrome}
${navbar(id)}
<main id="main" tabindex="-1" data-page="${id}">
${body}
${next ? nextStage() : ''}
</main>
${footer()}
${stickyCta}
<script src="${asset('vendor/lenis.min.js')}" defer></script>
<script src="${asset('js/site.js')}" defer></script>
${scripts.map((s) => `<script src="${asset('js/' + s)}" defer></script>`).join('\n')}`;

  const h = head({ id, title, desc, jsonld });
  if (T.target === 'artifact' && id === 'home') return `${h}\n${inner}`; // artifact wraps index itself
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
${h}
</head>
<body>
${inner}
</body>
</html>`;
}

function preloader() {
  return `<div class="preloader" aria-hidden="true">
  <div class="pl-word">${lockup('pl-logo')}</div>
  <div class="pl-meta"><span class="mono">Connecting the system</span><span class="mono pl-count">00</span></div>
</div>`;
}

// Breadcrumb JSON-LD
export const crumbs = (items) => ({
  '@context': 'https://schema.org', '@type': 'BreadcrumbList',
  itemListElement: items.map(([id, name], i) => ({ '@type': 'ListItem', position: i + 1, name, item: absUrl(id) })),
});
