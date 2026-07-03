import { createAdminSession, isAdminRequest, sendAdminOtp, verifyAdminOtp } from './_adminMailSystem.js';

function setJson(res) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
}

export default async function handler(req, res) {
  setJson(res);

  if (req.method === 'GET') {
    return res.status(200).json({ ok: true, authenticated: isAdminRequest(req) });
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'GET, POST');
    return res.status(405).json({ ok: false, error: 'method_not_allowed' });
  }

  const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
  if (body.action === 'requestOtp') {
    await sendAdminOtp();
    return res.status(200).json({ ok: true, sent: true });
  }

  if (body.action === 'verifyOtp') {
    const valid = await verifyAdminOtp(body.code);
    if (!valid) return res.status(401).json({ ok: false, error: 'invalid_code' });
    const session = createAdminSession();
    res.setHeader('Set-Cookie', `obba_admin_mail=${encodeURIComponent(session)}; HttpOnly; Path=/; SameSite=Lax; Max-Age=21600`);
    return res.status(200).json({ ok: true, authenticated: true });
  }

  if (body.action === 'logout') {
    res.setHeader('Set-Cookie', 'obba_admin_mail=; HttpOnly; Path=/; SameSite=Lax; Max-Age=0');
    return res.status(200).json({ ok: true, authenticated: false });
  }

  return res.status(400).json({ ok: false, error: 'unknown_action' });
}
