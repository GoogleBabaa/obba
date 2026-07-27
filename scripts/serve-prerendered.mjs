import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';

const root = path.resolve('dist');
const port = Number(process.env.PORT || 4180);
const host = process.env.HOST || '127.0.0.1';
const vercelConfig = JSON.parse(fs.readFileSync('vercel.json', 'utf8'));
const rewrites = vercelConfig.rewrites || [];

function contentTypeFor(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (ext === '.html') return 'text/html; charset=utf-8';
  if (ext === '.js') return 'application/javascript; charset=utf-8';
  if (ext === '.css') return 'text/css; charset=utf-8';
  if (ext === '.json') return 'application/json; charset=utf-8';
  if (ext === '.xml') return 'application/xml; charset=utf-8';
  if (ext === '.txt') return 'text/plain; charset=utf-8';
  if (ext === '.svg') return 'image/svg+xml';
  if (ext === '.png') return 'image/png';
  if (ext === '.jpg' || ext === '.jpeg') return 'image/jpeg';
  if (ext === '.ico') return 'image/x-icon';
  if (ext === '.webp') return 'image/webp';
  return 'application/octet-stream';
}

function rewritePath(pathname) {
  const rewrite = rewrites.find((entry) => {
    if (!entry.source.includes(':')) return entry.source === pathname;
    const pattern = new RegExp(`^${entry.source.replace(/:[^/]+/g, '[^/]+')}$`);
    return pattern.test(pathname);
  });
  return rewrite ? rewrite.destination : pathname;
}

function resolveFile(pathname) {
  const rewritten = rewritePath(pathname);
  let filePath = rewritten === '/'
    ? path.join(root, 'index.html')
    : path.join(root, rewritten.replace(/^\/+/, ''));

  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    filePath = path.join(filePath, 'index.html');
  }

  if (!fs.existsSync(filePath) && !path.extname(filePath)) {
    filePath = path.join(root, rewritten.replace(/^\/+/, ''), 'index.html');
  }

  return filePath;
}

const server = http.createServer((req, res) => {
  try {
    const url = new URL(req.url || '/', `http://${host}:${port}`);
    const filePath = resolveFile(decodeURIComponent(url.pathname));

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

server.listen(port, host, () => {
  console.log(`Prerendered preview server running at http://${host}:${port}/`);
});
