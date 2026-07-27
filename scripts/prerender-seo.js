import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { chromium } from 'playwright';
import { californiaPaycheckSchema } from '../src/californiaSchema.js';
import { floridaPaycheckSchema } from '../src/floridaSchema.js';
import { hawaiiPaycheckSchema } from '../src/hawaiiSchema.js';
import { homePageSchema } from '../src/homeSchema.js';
import { illinoisPaycheckSchema } from '../src/illinoisSchema.js';
import { indianaPaycheckSchema } from '../src/indianaSchema.js';
import { nebraskaPaycheckSchema } from '../src/nebraskaSchema.js';
import { overtimeCalculatorSchema } from '../src/overtimeSchema.js';
import { paycheckCalculatorSchema } from '../src/paycheckSchema.js';
import { texasPaycheckSchema } from '../src/texasSchema.js';
import { virginiaPaycheckSchema } from '../src/virginiaSchema.js';
import { washingtonPaycheckSchema } from '../src/washingtonSchema.js';
import { breadcrumbLabelsByPath, pageSeoByPath, SITE_URL } from '../src/seoConfig.js';

const distDir = path.resolve('dist');
const baseIndexPath = path.join(distDir, 'index.html');
const sitemapLastmod = '2026-07-22';
const SITE_NAME = 'OBBA Calculators';
const SHARE_CARD_URL = `${SITE_URL}/share-card.jpg`;
const SHARE_CARD_ALT = 'OBBA Calculators paycheck and tax calculator share card';

if (!fs.existsSync(baseIndexPath)) {
  throw new Error('dist/index.html not found. Run vite build before prerendering SEO pages.');
}

const baseHtml = fs.readFileSync(baseIndexPath, 'utf8');
const publicRouteSeoExclusions = new Set([
  '/admin/mail/:type',
  '/unsubscribe',
]);

function validatePublicRoutesHaveSeo(routesByPath) {
  const appPath = path.resolve('src', 'App.jsx');
  const appSource = fs.readFileSync(appPath, 'utf8');
  const appRoutes = [...appSource.matchAll(/<Route\s+path=["']([^"']+)["']/g)]
    .map((match) => normalizePath(match[1]))
    .filter((routePath) => !routePath.includes('*'))
    .filter((routePath) => !routePath.includes(':'))
    .filter((routePath) => !publicRouteSeoExclusions.has(routePath));

  const missingSeoRoutes = appRoutes.filter((routePath) => !routesByPath.has(routePath));
  if (missingSeoRoutes.length) {
    throw new Error(
      `Missing SEO/prerender config for public route(s): ${missingSeoRoutes.join(', ')}. ` +
      'Add every public page to src/seoConfig.js so Ctrl+U and Googlebot receive full HTML.',
    );
  }
}

function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function jsonLd(data) {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}

function normalizePath(routePath) {
  if (routePath === '/') return '/';
  return `/${routePath.replace(/^\/+|\/+$/g, '')}`;
}

function routeToFile(routePath) {
  if (routePath === '/') return baseIndexPath;
  return path.join(distDir, routePath.replace(/^\//, ''), 'index.html');
}

function contentTypeFor(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (ext === '.html') return 'text/html; charset=utf-8';
  if (ext === '.js') return 'application/javascript; charset=utf-8';
  if (ext === '.css') return 'text/css; charset=utf-8';
  if (ext === '.json') return 'application/json; charset=utf-8';
  if (ext === '.xml') return 'application/xml; charset=utf-8';
  if (ext === '.svg') return 'image/svg+xml';
  if (ext === '.png') return 'image/png';
  if (ext === '.jpg' || ext === '.jpeg') return 'image/jpeg';
  if (ext === '.ico') return 'image/x-icon';
  if (ext === '.webp') return 'image/webp';
  return 'application/octet-stream';
}

function startStaticServer(rootDir) {
  const server = http.createServer((req, res) => {
    try {
      const requestUrl = new URL(req.url || '/', 'http://127.0.0.1');
      let requestPath = decodeURIComponent(requestUrl.pathname);
      if (requestPath.endsWith('/')) requestPath += 'index.html';
      let filePath = path.join(rootDir, requestPath.replace(/^\/+/, ''));

      if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
        filePath = path.join(rootDir, requestPath.replace(/^\/+/, ''), 'index.html');
      }

      if (!fs.existsSync(filePath)) {
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('Not found');
        return;
      }

      res.writeHead(200, { 'Content-Type': contentTypeFor(filePath) });
      fs.createReadStream(filePath).pipe(res);
    } catch (error) {
      res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end(String(error?.message || error));
    }
  });

  return new Promise((resolve) => {
    server.listen(0, '127.0.0.1', () => {
      const address = server.address();
      resolve({ server, origin: `http://127.0.0.1:${address.port}` });
    });
  });
}

async function prerenderRenderedBodies(routesToRender) {
  const { server, origin } = await startStaticServer(distDir);
  const browser = await chromium.launch({ headless: true });

  try {
    const page = await browser.newPage({ viewport: { width: 1365, height: 900 } });
    for (const [rawPath, seo] of routesToRender) {
      const routePath = normalizePath(rawPath);
      const filePath = routeToFile(routePath);
      const errors = [];
      page.removeAllListeners();
      page.on('pageerror', (error) => errors.push(error.message));

      await page.goto(`${origin}${routePath}`, { waitUntil: 'networkidle', timeout: 60000 });
      await page.waitForSelector('#root', { timeout: 30000 });
      await page.evaluate(() => {
        document.querySelectorAll('[data-obba-newsletter-message]').forEach((node) => node.remove());
      });

      const renderedHtml = await page.evaluate(() => `<!doctype html>\n${document.documentElement.outerHTML}`);
      fs.writeFileSync(filePath, renderedHtml, 'utf8');

      const counts = await page.evaluate(() => ({
        headings: document.querySelectorAll('h1,h2,h3').length,
        paragraphs: document.querySelectorAll('p').length,
        tables: document.querySelectorAll('table').length,
      }));
      console.log(`Prerendered body for ${seo.canonicalPath}: ${counts.headings} headings, ${counts.paragraphs} paragraphs, ${counts.tables} tables${errors.length ? ` (${errors.length} page errors)` : ''}.`);
    }
  } finally {
    await browser.close();
    await new Promise((resolve) => server.close(resolve));
  }
}

function stripExistingSeo(head) {
  return head
    .replace(/\s*<title>[\s\S]*?<\/title>/i, '')
    .replace(/\s*<meta\s+name=["']description["'][^>]*>/gi, '')
    .replace(/\s*<meta\s+name=["']keywords["'][^>]*>/gi, '')
    .replace(/\s*<meta\s+name=["']robots["'][^>]*>/gi, '')
    .replace(/\s*<meta\s+property=["']og:[^"']+["'][^>]*>/gi, '')
    .replace(/\s*<meta\s+name=["']twitter:[^"']+["'][^>]*>/gi, '')
    .replace(/\s*<link\s+rel=["']canonical["'][^>]*>/gi, '')
    .replace(/\s*<script\s+type=["']application\/ld\+json["']\s+id=["']page-webpage-schema["'][\s\S]*?<\/script>/gi, '')
    .replace(/\s*<script\s+type=["']application\/ld\+json["']\s+id=["']california-paycheck-calculator-schema["'][\s\S]*?<\/script>/gi, '')
    .replace(/\s*<script\s+type=["']application\/ld\+json["']\s+id=["']florida-paycheck-calculator-schema["'][\s\S]*?<\/script>/gi, '')
    .replace(/\s*<script\s+type=["']application\/ld\+json["']\s+id=["']hawaii-paycheck-calculator-schema["'][\s\S]*?<\/script>/gi, '')
    .replace(/\s*<script\s+type=["']application\/ld\+json["']\s+id=["']illinois-paycheck-calculator-schema["'][\s\S]*?<\/script>/gi, '')
    .replace(/\s*<script\s+type=["']application\/ld\+json["']\s+id=["']indiana-paycheck-calculator-schema["'][\s\S]*?<\/script>/gi, '')
    .replace(/\s*<script\s+type=["']application\/ld\+json["']\s+id=["']nebraska-paycheck-calculator-schema["'][\s\S]*?<\/script>/gi, '')
    .replace(/\s*<script\s+type=["']application\/ld\+json["']\s+id=["']overtime-calculator-schema["'][\s\S]*?<\/script>/gi, '')
    .replace(/\s*<script\s+type=["']application\/ld\+json["']\s+id=["']paycheck-calculator-schema["'][\s\S]*?<\/script>/gi, '')
    .replace(/\s*<script\s+type=["']application\/ld\+json["']\s+id=["']texas-paycheck-calculator-schema["'][\s\S]*?<\/script>/gi, '')
    .replace(/\s*<script\s+type=["']application\/ld\+json["']\s+id=["']virginia-paycheck-calculator-schema["'][\s\S]*?<\/script>/gi, '')
    .replace(/\s*<script\s+type=["']application\/ld\+json["']\s+id=["']washington-paycheck-calculator-schema["'][\s\S]*?<\/script>/gi, '')
    .replace(/\s*<script\s+type=["']application\/ld\+json["']\s+id=["']home-page-schema["'][\s\S]*?<\/script>/gi, '');
}

function buildBreadcrumbSchema(seo) {
  const pathLabel = breadcrumbLabelsByPath[seo.canonicalPath] || seo.title.replace(/\s*\|\s*OBBA Calculators$/, '');
  const items = [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Website',
      item: `${SITE_URL}/`,
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'Home',
      item: `${SITE_URL}/`,
    },
  ];

  if (seo.canonicalPath !== '/') {
    items.push({
      '@type': 'ListItem',
      position: 3,
      name: pathLabel,
      item: `${SITE_URL}${seo.canonicalPath}`,
    });
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items,
  };
}

function buildSeoTags(seo) {
  const canonicalUrl = `${SITE_URL}${seo.canonicalPath}`;
  const robots = seo.robots || 'index,follow,max-snippet:-1,max-image-preview:large,max-video-preview:-1';
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: seo.title,
    description: seo.description,
    url: canonicalUrl,
    inLanguage: 'en-US',
    isPartOf: {
      '@type': 'WebSite',
      name: SITE_NAME,
      url: SITE_URL,
    },
  };

  const keywords = seo.keywords ? `\n    <meta name="keywords" content="${escapeHtml(seo.keywords)}" />` : '';
  const homeSchema = seo.canonicalPath === '/'
    ? `\n    <script type="application/ld+json" id="home-page-schema">${jsonLd(homePageSchema)}</script>`
    : '';
  const floridaSchema = seo.canonicalPath === '/florida-paycheck-calculator'
    ? `\n    <script type="application/ld+json" id="florida-paycheck-calculator-schema">${jsonLd(floridaPaycheckSchema)}</script>`
    : '';
  const californiaSchema = seo.canonicalPath === '/california-paycheck-calculator'
    ? `\n    <script type="application/ld+json" id="california-paycheck-calculator-schema">${jsonLd(californiaPaycheckSchema)}</script>`
    : '';
  const hawaiiSchema = seo.canonicalPath === '/hawaii-paycheck-calculator'
    ? `\n    <script type="application/ld+json" id="hawaii-paycheck-calculator-schema">${jsonLd(hawaiiPaycheckSchema)}</script>`
    : '';
  const texasSchema = seo.canonicalPath === '/texas-paycheck-calculator'
    ? `\n    <script type="application/ld+json" id="texas-paycheck-calculator-schema">${jsonLd(texasPaycheckSchema)}</script>`
    : '';
  const overtimeSchema = seo.canonicalPath === '/overtime'
    ? `\n    <script type="application/ld+json" id="overtime-calculator-schema">${jsonLd(overtimeCalculatorSchema)}</script>`
    : '';
  const paycheckSchema = seo.canonicalPath === '/paycheck-calculator'
    ? `\n    <script type="application/ld+json" id="paycheck-calculator-schema">${jsonLd(paycheckCalculatorSchema)}</script>`
    : '';
  const washingtonSchema = seo.canonicalPath === '/washington-paycheck-calculator'
    ? `\n    <script type="application/ld+json" id="washington-paycheck-calculator-schema">${jsonLd(washingtonPaycheckSchema)}</script>`
    : '';
  const illinoisSchema = seo.canonicalPath === '/illinois-paycheck-calculator'
    ? `\n    <script type="application/ld+json" id="illinois-paycheck-calculator-schema">${jsonLd(illinoisPaycheckSchema)}</script>`
    : '';
  const indianaSchema = seo.canonicalPath === '/indiana-paycheck-calculator'
    ? `\n    <script type="application/ld+json" id="indiana-paycheck-calculator-schema">${jsonLd(indianaPaycheckSchema)}</script>`
    : '';
  const nebraskaSchema = seo.canonicalPath === '/nebraska-paycheck-calculator'
    ? `\n    <script type="application/ld+json" id="nebraska-paycheck-calculator-schema">${jsonLd(nebraskaPaycheckSchema)}</script>`
    : '';
  const virginiaSchema = seo.canonicalPath === '/virginia-paycheck-calculator'
    ? `\n    <script type="application/ld+json" id="virginia-paycheck-calculator-schema">${jsonLd(virginiaPaycheckSchema)}</script>`
    : '';

  return `
    <title>${escapeHtml(seo.title)}</title>
    <meta name="description" content="${escapeHtml(seo.description)}" />${keywords}
    <meta name="robots" content="${escapeHtml(robots)}" />
    <link rel="canonical" href="${escapeHtml(canonicalUrl)}" />
    <meta property="og:title" content="${escapeHtml(seo.title)}" />
    <meta property="og:description" content="${escapeHtml(seo.description)}" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${escapeHtml(canonicalUrl)}" />
    <meta property="og:site_name" content="${escapeHtml(SITE_NAME)}" />
    <meta property="og:image" content="${escapeHtml(SHARE_CARD_URL)}" />
    <meta property="og:image:alt" content="${escapeHtml(SHARE_CARD_ALT)}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(seo.title)}" />
    <meta name="twitter:description" content="${escapeHtml(seo.description)}" />
    <meta name="twitter:image" content="${escapeHtml(SHARE_CARD_URL)}" />
    <meta name="twitter:image:alt" content="${escapeHtml(SHARE_CARD_ALT)}" />
    <script type="application/ld+json" id="page-webpage-schema">${jsonLd(schema)}</script>
    <script type="application/ld+json" id="breadcrumb-schema">${jsonLd(buildBreadcrumbSchema(seo))}</script>${homeSchema}${floridaSchema}${californiaSchema}${hawaiiSchema}${texasSchema}${overtimeSchema}${paycheckSchema}${washingtonSchema}${illinoisSchema}${indianaSchema}${nebraskaSchema}${virginiaSchema}`;
}

function renderHtml(seo) {
  return baseHtml.replace(/<head>([\s\S]*?)<\/head>/i, (_match, headContent) => {
    const cleanedHead = stripExistingSeo(headContent);
    return `<head>${buildSeoTags(seo)}${cleanedHead}\n  </head>`;
  });
}

const routes = new Map(Object.entries(pageSeoByPath));
validatePublicRoutesHaveSeo(routes);
const sitemapPathOrder = [
  '/',
  '/paycheck-calculator',
  '/salary-calculator',
  '/overtime',
  '/states',
  '/texas-paycheck-calculator',
  '/florida-paycheck-calculator',
  '/california-paycheck-calculator',
  '/illinois-paycheck-calculator',
  '/washington-paycheck-calculator',
  '/indiana-paycheck-calculator',
  '/virginia-paycheck-calculator',
  '/hawaii-paycheck-calculator',
  '/nebraska-paycheck-calculator',
  '/faq',
  '/about-us',
  '/contact-us',
  '/privacy-policy',
  '/terms-conditions',
];

for (const [rawPath, seo] of routes) {
  const routePath = normalizePath(rawPath);
  const filePath = routeToFile(routePath);
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, renderHtml(seo), 'utf8');
}

const sitemapEntries = [...routes.values()]
  .filter((seo, index, list) => list.findIndex((item) => item.canonicalPath === seo.canonicalPath) === index)
  .filter((seo) => !String(seo.robots || '').toLowerCase().includes('noindex'))
  .sort((a, b) => {
    const aIndex = sitemapPathOrder.indexOf(a.canonicalPath);
    const bIndex = sitemapPathOrder.indexOf(b.canonicalPath);
    return (aIndex === -1 ? 999 : aIndex) - (bIndex === -1 ? 999 : bIndex);
  })
  .map((seo) => {
    const sitemapMetaByPath = {
      '/': { changefreq: 'daily', priority: '1.0' },
      '/paycheck-calculator': { changefreq: 'weekly', priority: '0.9' },
      '/salary-calculator': { changefreq: 'weekly', priority: '0.9' },
      '/overtime': { changefreq: 'weekly', priority: '0.9' },
      '/states': { changefreq: 'weekly', priority: '0.9' },
      '/texas-paycheck-calculator': { changefreq: 'weekly', priority: '0.8' },
      '/florida-paycheck-calculator': { changefreq: 'weekly', priority: '0.8' },
      '/california-paycheck-calculator': { changefreq: 'weekly', priority: '0.8' },
      '/illinois-paycheck-calculator': { changefreq: 'weekly', priority: '0.8' },
      '/washington-paycheck-calculator': { changefreq: 'weekly', priority: '0.8' },
      '/indiana-paycheck-calculator': { changefreq: 'weekly', priority: '0.8' },
      '/virginia-paycheck-calculator': { changefreq: 'weekly', priority: '0.8' },
      '/hawaii-paycheck-calculator': { changefreq: 'weekly', priority: '0.8' },
      '/nebraska-paycheck-calculator': { changefreq: 'weekly', priority: '0.8' },
      '/faq': { changefreq: 'monthly', priority: '0.6' },
      '/about-us': { changefreq: 'monthly', priority: '0.5' },
      '/contact-us': { changefreq: 'yearly', priority: '0.4' },
      '/privacy-policy': { changefreq: 'yearly', priority: '0.3' },
      '/terms-conditions': { changefreq: 'yearly', priority: '0.3' },
    };
    const meta = sitemapMetaByPath[seo.canonicalPath] || { changefreq: 'weekly', priority: '0.8' };
    return `  <url>\n    <loc>${SITE_URL}${seo.canonicalPath}</loc>\n    <lastmod>${sitemapLastmod}</lastmod>\n    <changefreq>${meta.changefreq}</changefreq>\n    <priority>${meta.priority}</priority>\n  </url>`;
  })
  .join('\n');

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapEntries}\n</urlset>\n`;
fs.writeFileSync(path.join(distDir, 'sitemap.xml'), sitemap, 'utf8');
fs.writeFileSync(path.join('public', 'sitemap.xml'), sitemap, 'utf8');

console.log(`Prerendered SEO head for ${routes.size} routes.`);
await prerenderRenderedBodies(routes);
console.log(`Prerendered full HTML for ${routes.size} routes.`);
