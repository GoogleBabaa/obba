import { sendDueWelcomeEmails } from '../api/_welcomeEmails.js';

const dryRun = process.argv.includes('--dry-run');
const limitArg = process.argv.find((arg) => arg.startsWith('--limit='));
const limit = limitArg ? Number(limitArg.split('=')[1]) : Number(process.env.MAIL_BATCH_LIMIT || 10);

const result = await sendDueWelcomeEmails({ dryRun, limit });
console.log(`Processed welcome queue. Due: ${result.due}. Sent: ${result.sent}. Remaining: ${result.remaining || 0}.`);
