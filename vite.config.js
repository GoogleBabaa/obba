import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { pathToFileURL } from 'node:url';
import path from 'node:path';

function createMockResponse(res) {
  return {
    setHeader(name, value) {
      res.setHeader(name, value);
    },
    status(code) {
      res.statusCode = code;
      return this;
    },
    json(payload) {
      if (!res.getHeader('Content-Type')) {
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
      }
      res.end(JSON.stringify(payload));
      return this;
    },
    send(payload) {
      res.end(payload);
      return this;
    },
  };
}

async function readRequestBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const text = Buffer.concat(chunks).toString('utf8');
  if (!text) return {};
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

function localApiPlugin() {
  const apiRoutes = {
    '/api/subscribe': './api/subscribe.js',
    '/api/unsubscribe': './api/unsubscribe.js',
    '/api/send-due-welcome-emails': './api/send-due-welcome-emails.js',
    '/api/admin-auth': './api/admin-auth.js',
    '/api/admin-config': './api/admin-config.js',
    '/api/admin-mail': './api/admin-mail.js',
    '/api/admin-subscribers': './api/admin-subscribers.js',
    '/api/send-scheduled-mails': './api/send-scheduled-mails.js',
  };

  return {
    name: 'local-api-routes',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = new URL(req.url || '/', 'http://127.0.0.1');
        const modulePath = apiRoutes[url.pathname];
        if (!modulePath) {
          next();
          return;
        }

        try {
          const moduleUrl = pathToFileURL(path.resolve(process.cwd(), modulePath)).href;
          const mod = await import(`${moduleUrl}?t=${Date.now()}`);
          const mockReq = {
            method: req.method,
            headers: req.headers,
            query: Object.fromEntries(url.searchParams.entries()),
            body: req.method === 'GET' ? {} : await readRequestBody(req),
          };
          await mod.default(mockReq, createMockResponse(res));
        } catch (error) {
          console.error(error);
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json; charset=utf-8');
          res.end(JSON.stringify({ ok: false, error: 'local_api_error' }));
        }
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), localApiPlugin()],
});
