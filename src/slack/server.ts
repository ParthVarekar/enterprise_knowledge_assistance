import { EnterpriseKnowledgeEngine } from '../index';
import { ConfluenceConnector } from '../connectors/confluence';
import { GoogleDriveConnector } from '../connectors/googleDrive';
import { ZendeskConnector } from '../connectors/zendesk';
import { UserEntitlements } from '../types';

async function startServer() {
  const tenantId = process.env.TENANT_ID || 'default-tenant';
  const engine = new EnterpriseKnowledgeEngine({ tenantId, confidenceThreshold: 0.4 });

  engine.registerConnector(new ConfluenceConnector({ name: 'confluence', tenantId }));
  engine.registerConnector(new GoogleDriveConnector({ name: 'gdrive', tenantId }));
  engine.registerConnector(new ZendeskConnector({ name: 'zendesk', tenantId }));

  const ingestResult = await engine.ingestAll();
  console.log(`[Server] Ingested ${ingestResult.totalChunks} chunks from: ${ingestResult.sources.join(', ')}`);

  console.log('[Server] Slack Bolt integration placeholder.');
  console.log('[Server] In production, configure SLACK_BOT_TOKEN, SLACK_SIGNING_SECRET.');
  console.log('[Server] Then use @slack/bolt App to listen for app_mention events.');

  // Placeholder: In production, this would use:
  // import { App } from '@slack/bolt';
  // const app = new App({ token: process.env.SLACK_BOT_TOKEN, signingSecret: process.env.SLACK_SIGNING_SECRET });
  // app.event('app_mention', async ({ event, say }) => { ... });
  // await app.start(process.env.PORT || 3000);

  const demoUser: UserEntitlements = {
    user_guid: 'demo-user', slack_user_id: 'U_DEMO', tenant_id: tenantId,
    email: 'demo@example.com', group_guids: ['engineering'], roles: ['developer'],
  };

  const answer = await engine.query('How does our API gateway work?', demoUser);
  console.log(`[Server] Demo answer confidence: ${(answer.confidence_score * 100).toFixed(1)}%`);
  console.log(`[Server] Server ready. Waiting for Slack events...`);
}

startServer().catch(console.error);
