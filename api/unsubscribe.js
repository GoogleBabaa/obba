import { addUnsubscribe, isValidEmail, normalizeEmail, verifyUnsubscribeToken } from './_subscriberStore.js';
import { loadDotEnv } from './_emailConfig.js';

function htmlPage(title, message) {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${title}</title>
  <style>
    body{margin:0;font-family:Inter,Arial,sans-serif;background:#0d1829;color:#f8fafc;display:grid;min-height:100vh;place-items:center;padding:24px}
    main{max-width:560px;background:#162035;border:1px solid #26324a;border-radius:16px;padding:28px;box-shadow:0 24px 70px rgba(0,0,0,.28)}
    h1{margin:0 0 12px;font-size:26px}
    p{margin:0;color:#cbd5e1;line-height:1.65}
    a{color:#60a5fa;font-weight:700}
  </style>
</head>
<body>
  <main>
    <h1>${title}</h1>
    <p>${message}</p>
    <p style="margin-top:18px"><a href="/">Back to OBBA Calculators</a></p>
  </main>
</body>
</html>`;
}

export default async function handler(req, res) {
  await loadDotEnv();
  const email = normalizeEmail(req.query?.email || req.body?.email || '');
  const token = String(req.query?.token || req.body?.token || '');

  if (!isValidEmail(email) || !verifyUnsubscribeToken(email, token)) {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.status(400).send(htmlPage('Invalid unsubscribe link', 'This unsubscribe link is missing information or has expired.'));
  }

  await addUnsubscribe(email);
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  return res.status(200).send(htmlPage('You are unsubscribed', 'You will no longer receive OBBA Calculators email updates at this address.'));
}
