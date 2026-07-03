import { isAdminRequest, readAdminConfig, writeAdminConfig } from './_adminMailSystem.js';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const config = await readAdminConfig();
    if (req.query?.public === '1' || isAdminRequest(req)) {
      return res.status(200).json({ ok: true, ...config });
    }
    return res.status(401).json({ ok: false, error: 'unauthorized' });
  }

  if (req.method === 'POST') {
    if (!isAdminRequest(req)) {
      return res.status(401).json({ ok: false, error: 'unauthorized' });
    }
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
    const config = await writeAdminConfig(body);
    return res.status(200).json({ ok: true, ...config });
  }

  res.setHeader('Allow', 'GET, POST');
  return res.status(405).json({ ok: false, error: 'method_not_allowed' });
}
