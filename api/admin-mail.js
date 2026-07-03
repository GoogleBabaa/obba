import { buildCampaignContent, CAMPAIGN_KEYS, isAdminRequest, parseCampaign, readCampaignFile, writeCampaignFile } from './_adminMailSystem.js';
import { delayForCampaign, scheduleCampaignWorker } from './_qstashScheduler.js';

function campaignKey(req) {
  return String(req.query?.type || req.query?.key || '').trim();
}

export default async function handler(req, res) {
  if (!isAdminRequest(req)) {
    return res.status(401).json({ ok: false, error: 'unauthorized' });
  }

  const key = campaignKey(req);
  if (!CAMPAIGN_KEYS.includes(key)) {
    return res.status(400).json({ ok: false, error: 'invalid_campaign' });
  }

  if (req.method === 'GET') {
    const content = await readCampaignFile(key);
    return res.status(200).json({ ok: true, key, content, parsed: parseCampaign(content, key) });
  }

  if (req.method === 'POST') {
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
    const campaign = body.campaign
      ? {
        ...body.campaign,
        campaignId: `${key}-${Date.now()}`,
        notBefore: '',
      }
      : null;
    const content = await writeCampaignFile(key, campaign ? buildCampaignContent(campaign) : (body.content || ''));
    const parsed = parseCampaign(content, key);
    const schedule = campaign
      ? await scheduleCampaignWorker({
        key,
        campaignId: parsed.campaignId,
        delay: delayForCampaign(key),
        reason: 'campaign_saved',
        limit: Number(process.env.MAIL_BATCH_LIMIT || 10),
      })
      : null;
    return res.status(200).json({ ok: true, key, content, parsed, schedule });
  }

  res.setHeader('Allow', 'GET, POST');
  return res.status(405).json({ ok: false, error: 'method_not_allowed' });
}
