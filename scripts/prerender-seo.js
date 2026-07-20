import fs from 'node:fs';
import path from 'node:path';
import { homePageSchema } from '../src/homeSchema.js';
import { breadcrumbLabelsByPath, pageSeoByPath, SITE_URL } from '../src/seoConfig.js';

const distDir = path.resolve('dist');
const baseIndexPath = path.join(distDir, 'index.html');
const today = new Date().toISOString().slice(0, 10);
const SITE_NAME = 'OBBA Calculators';
const SHARE_CARD_URL = `${SITE_URL}/share-card.jpg`;
const SHARE_CARD_ALT = 'OBBA Calculators paycheck and tax calculator share card';

if (!fs.existsSync(baseIndexPath)) {
  throw new Error('dist/index.html not found. Run vite build before prerendering SEO pages.');
}

const baseHtml = fs.readFileSync(baseIndexPath, 'utf8');

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
    <script type="application/ld+json" id="breadcrumb-schema">${jsonLd(buildBreadcrumbSchema(seo))}</script>${homeSchema}`;
}

function renderHtml(seo) {
  return baseHtml.replace(/<head>([\s\S]*?)<\/head>/i, (_match, headContent) => {
    const cleanedHead = stripExistingSeo(headContent);
    return `<head>${buildSeoTags(seo)}${cleanedHead}\n  </head>`;
  });
}

const routes = new Map(Object.entries(pageSeoByPath));

for (const [rawPath, seo] of routes) {
  const routePath = normalizePath(rawPath);
  const filePath = routeToFile(routePath);
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, renderHtml(seo), 'utf8');
}

const sitemapEntries = [...routes.values()]
  .filter((seo, index, list) => list.findIndex((item) => item.canonicalPath === seo.canonicalPath) === index)
  .filter((seo) => !String(seo.robots || '').toLowerCase().includes('noindex'))
  .map((seo) => {
    const priority = seo.canonicalPath === '/' ? '1.0' : '0.9';
    const changefreq = 'weekly';
    return `  <url>\n    <loc>${SITE_URL}${seo.canonicalPath}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`;
  })
  .join('\n');

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapEntries}\n</urlset>\n`;
fs.writeFileSync(path.join(distDir, 'sitemap.xml'), sitemap, 'utf8');
fs.writeFileSync(path.join('public', 'sitemap.xml'), sitemap, 'utf8');

console.log(`Prerendered SEO HTML for ${routes.size} routes.`);
