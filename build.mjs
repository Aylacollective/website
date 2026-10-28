// Zero-dependency static build. `node build.mjs` writes:
//   dist/web/       pretty URLs (/services/), ready for any static host
//   dist/artifact/  flat files (services.html) for the claude.ai preview
import fs from 'node:fs';
import path from 'node:path';
import { T, absUrl } from './src/layout.mjs';
import { industries, insights, site, cases } from './src/content.mjs';
import home from './src/pages/home.mjs';
import * as P from './src/pages/inner.mjs';

const ROOT = path.dirname(new URL(import.meta.url).pathname);
const SRC = path.join(ROOT, 'src/assets');
const NM = path.join(ROOT, 'node_modules');

// Fonts and vendor libs are copied from node_modules into src/assets once.
const copies = [
  ['@fontsource-variable/funnel-display/files/funnel-display-latin-wght-normal.woff2', 'fonts/funnel-display.woff2'],
  ['@fontsource-variable/instrument-sans/files/instrument-sans-latin-standard-normal.woff2', 'fonts/instrument-sans.woff2'],
  ['@fontsource/instrument-serif/files/instrument-serif-latin-400-italic.woff2', 'fonts/instrument-serif-italic.woff2'],
  ['@fontsource-variable/geist-mono/files/geist-mono-latin-wght-normal.woff2', 'fonts/geist-mono.woff2'],
  ['three/build/three.module.min.js', 'vendor/three.module.min.js'],
  ['lenis/dist/lenis.min.js', 'vendor/lenis.min.js'],
];
for (const [from, to] of copies) {
  const dst = path.join(SRC, to);
  fs.mkdirSync(path.dirname(dst), { recursive: true });
  if (!fs.existsSync(dst)) fs.copyFileSync(path.join(NM, from), dst);
}

const pages = () => [
  ['home', home()],
  ['services', P.services()],
  ['industries', P.industriesIndex()],
  ...industries.map((i) => ['industries/' + i.id, P.industry(i)]),
  ['work', P.work()],
  ...cases.map((c) => ['work/' + c.slug, P.caseStudy(c)]),
  ['approach', P.approach()],
  ['about', P.about()],
  ['insights', P.insightsIndex()],
  ...insights.map((a) => ['insights/' + a.slug, P.article(a)]),
  ['growth-audit', P.growthAudit()],
  ['contact', P.contact()],
  ['privacy', P.privacy()],
  ['terms', P.terms()],
  ['404', P.notFound()],
];

function copyDir(from, to, skip = () => false) {
  fs.mkdirSync(to, { recursive: true });
  for (const f of fs.readdirSync(from)) {
    const s = path.join(from, f), d = path.join(to, f);
    if (skip(s)) continue;
    if (fs.statSync(s).isDirectory()) copyDir(s, d, skip);
    else fs.copyFileSync(s, d);
  }
}

function build(target) {
  T.target = target;
  const out = path.join(ROOT, 'dist', target);
  fs.mkdirSync(out, { recursive: true });
  for (const f of fs.readdirSync(out)) if (!f.startsWith('_poster')) fs.rmSync(path.join(out, f), { recursive: true, force: true });
  const list = pages();
  for (const [id, html] of list) {
    const file = id === 'home' ? 'index.html' : id.replace(/\//g, '-') + '.html';
    const dst = path.join(out, file);
    fs.mkdirSync(path.dirname(dst), { recursive: true });
    fs.writeFileSync(dst, html);
  }
  copyDir(SRC, path.join(out, 'assets'), (s) => target === 'artifact' && s.includes('/fonts'));
  if (target === 'artifact') {
    // Inline fonts as data URIs so the preview never depends on font loading rules.
    const cssPath = path.join(out, 'assets/css/site.css');
    let css = fs.readFileSync(cssPath, 'utf8');
    css = css.replace(/url\(['"]?\.\.\/fonts\/([\w-]+\.woff2)['"]?\)/g, (_, f) =>
      `url(data:font/woff2;base64,${fs.readFileSync(path.join(SRC, 'fonts', f)).toString('base64')})`);
    fs.writeFileSync(cssPath, css);
  } else {
    const urls = list.filter(([id]) => id !== '404').map(([id]) => `<url><loc>${absUrl(id)}</loc></url>`);
    fs.writeFileSync(path.join(out, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.join('')}</urlset>\n`);
    fs.writeFileSync(path.join(out, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${site.url}/sitemap.xml\n`);
    // Long cache for fingerprint-free but stable assets on Netlify-style hosts
    fs.writeFileSync(path.join(out, 'vercel.json'), JSON.stringify({ cleanUrls: true, trailingSlash: false, headers: [{ source: '/assets/(.*)', headers: [{ key: 'Cache-Control', value: 'public, max-age=604800' }] }] }, null, 2) + '\n');
  }
  console.log(`${target}: ${list.length} pages → ${path.relative(ROOT, out)}`);
}

build('web');
build('artifact');
