import { isAdminRequest, readMailSendLog } from './_adminMailSystem.js';
import { getActiveSubscribers } from './_subscriberStore.js';
import { loadDotEnv } from './_emailConfig.js';

export default async function handler(req, res) {
  await loadDotEnv();
  if (!isAdminRequest(req)) {
    return res.status(401).json({ ok: false, error: 'unauthorized' });
  }

  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ ok: false, error: 'method_not_allowed' });
  }

  const rows = await getActiveSubscribers();
  const sendLog = await readMailSendLog();
  const lastMailByEmail = new Map();
  for (const row of sendLog) {
    const email = String(row.email || '').toLowerCase();
    if (!email) continue;
    const previous = lastMailByEmail.get(email);
    if (!previous || String(row.sentAt || '') > String(previous.sentAt || '')) {
      lastMailByEmail.set(email, row);
    }
  }
  const subscribers = rows.map((row) => ({
    email: row.email || '',
    subscribedAt: row.subscribedAt || row.storedAt || '',
    stateCode: row.stateCode || row.browserStateCode || '',
    stateName: row.stateName || row.browserStateName || '',
    city: row.city || '',
    country: row.country || '',
    timezone: row.timezone || '',
    segmentKey: row.segmentKey || '',
    segmentName: row.segmentName || '',
    page: row.page || '',
    calculatorPath: row.calculatorPath || '',
    lastMailAt: lastMailByEmail.get(row.email)?.sentAt || '',
    lastMailCampaign: lastMailByEmail.get(row.email)?.campaignKey || '',
  }));

  return res.status(200).json({ ok: true, count: subscribers.length, subscribers });
}
