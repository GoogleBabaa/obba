import { sendScheduledCampaigns } from '../api/_adminMailSystem.js';

const dryRun = process.argv.includes('--dry-run');
const typeIndex = process.argv.indexOf('--type');
const limitIndex = process.argv.indexOf('--limit');
const keys = typeIndex === -1 ? undefined : [process.argv[typeIndex + 1]];
const limit = limitIndex === -1 ? 10 : Number(process.argv[limitIndex + 1] || 10);
const result = await sendScheduledCampaigns({ dryRun, keys, limit });
console.log(JSON.stringify(result, null, 2));
