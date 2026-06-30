const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function decodeHeader(value) {
  if (!value) return '';
  try {
    return decodeURIComponent(String(value));
  } catch {
    return String(value);
  }
}

function getClientIp(req) {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string' && forwarded.trim()) {
    return forwarded.split(',')[0].trim();
  }
  return req.headers['x-real-ip'] || '';
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'method_not_allowed' });
  }

  const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
  const email = String(body.email || '').trim().toLowerCase();
  if (!emailPattern.test(email)) {
    return res.status(400).json({ ok: false, error: 'invalid_email' });
  }

  const record = {
    email,
    subscribedAt: body.subscribedAt || new Date().toISOString(),
    page: body.page || '',
    pageTitle: body.pageTitle || '',
    referrer: body.referrer || '',
    timezone: body.timezone || '',
    language: body.language || '',
    country: decodeHeader(req.headers['x-vercel-ip-country']),
    region: decodeHeader(req.headers['x-vercel-ip-country-region']),
    city: decodeHeader(req.headers['x-vercel-ip-city']),
    latitude: decodeHeader(req.headers['x-vercel-ip-latitude']),
    longitude: decodeHeader(req.headers['x-vercel-ip-longitude']),
    ip: getClientIp(req),
    userAgent: req.headers['user-agent'] || '',
  };

  const webhookUrl = process.env.SUBSCRIBERS_WEBHOOK_URL;
  if (!webhookUrl) {
    return res.status(200).json({ ok: true, stored: false, reason: 'SUBSCRIBERS_WEBHOOK_URL_not_configured', record });
  }

  const response = await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(record),
  });

  if (!response.ok) {
    return res.status(502).json({ ok: false, error: 'webhook_failed' });
  }

  return res.status(200).json({ ok: true, stored: true });
}
