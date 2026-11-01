// Saves finished HTML for the service pages and enriches the home page's <noscript>.
// Runs after `vite build` and the SSR build. Adds no runtime dependencies.
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const dist = path.resolve('dist');
const mod = await import(pathToFileURL(path.resolve('.ssr/prerender.js')).href);
const { SERVICE_PAGES, SITE_URL, renderService, renderHomeSnapshot } = mod;

const template = fs.readFileSync(path.join(dist, 'index.html'), 'utf8');
const esc = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

function setHead(html, page) {
  const url = `${SITE_URL}/${page.slug}/`;
  const swap = (re, to) => {
    if (!re.test(html)) throw new Error(`prerender: pattern not found ${re}`);
    html = html.replace(re, to);
  };
  swap(/<title>[^<]*<\/title>/, `<title>${esc(page.seoTitle)}</title>`);
  swap(/<meta name="description" content="[^"]*">/, `<meta name="description" content="${esc(page.seoDescription)}">`);
  swap(/<link rel="canonical" href="[^"]*">/, `<link rel="canonical" href="${url}">`);
  swap(/<meta property="og:title" content="[^"]*">/, `<meta property="og:title" content="${esc(page.seoTitle)}">`);
  swap(/<meta property="og:description" content="[^"]*">/, `<meta property="og:description" content="${esc(page.seoDescription)}">`);
  swap(/<meta property="og:url" content="[^"]*">/, `<meta property="og:url" content="${url}">`);
  swap(/<meta name="twitter:title" content="[^"]*">/, `<meta name="twitter:title" content="${esc(page.seoTitle)}">`);
  swap(/<meta name="twitter:description" content="[^"]*">/, `<meta name="twitter:description" content="${esc(page.seoDescription)}">`);
  swap(/<meta name="twitter:url" content="[^"]*">/, `<meta name="twitter:url" content="${url}">`);
  const ld = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: page.h1.replace(' in Cape Town', ''),
    description: page.seoDescription,
    url,
    areaServed: ['Cape Town', 'Stellenbosch', 'Paarl'],
    provider: { '@type': 'HomeAndConstructionBusiness', name: 'The Elegant Company', url: SITE_URL },
  };
  return html.replace('</head>', `  <script type="application/ld+json">${JSON.stringify(ld)}</script>\n</head>`);
}

for (const page of SERVICE_PAGES) {
  let html = setHead(template, page);
  html = html.replace('<div id="root"></div>', `<div id="root">${renderService(page.slug)}</div>`);
  if (!html.includes(`<div id="root">`) || !html.includes('<h1')) throw new Error(`prerender failed for ${page.slug}`);
  // Service pages carry their own content, so drop the home page's fallback block.
  html = html.replace(/<noscript>[\s\S]*?<\/noscript>/g, (m) => (m.includes('<main') ? '' : m));
  const dir = path.join(dist, page.slug);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), html);
  console.log('prerendered', `/${page.slug}/`, `${html.length} bytes`);
}

// Home page: keep the app untouched; enrich the existing fallback block with services, links and FAQ.
const snapshot = renderHomeSnapshot();
if (!template.includes('</main>\n    </noscript>')) throw new Error('prerender: home noscript anchor not found');
fs.writeFileSync(path.join(dist, 'index.html'), template.replace('</main>\n    </noscript>', `${snapshot}\n      </main>\n    </noscript>`));
console.log('home noscript enriched with services, links and FAQ');
