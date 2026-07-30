import { EnterpriseKnowledgeEngine } from './index';
import { ConfluenceConnector } from './connectors/confluence';
import { GoogleDriveConnector } from './connectors/googleDrive';
import { ZendeskConnector } from './connectors/zendesk';
import { MarkdownConnector } from './connectors/markdown';
import { UserEntitlements } from './types';

async function main() {
  console.log('\n╔═══════════════════════════════════════════════════════════════╗');
  console.log('║   Enterprise Knowledge Assistant — Production Demo           ║');
  console.log('╚═══════════════════════════════════════════════════════════════╝\n');

  const engine = new EnterpriseKnowledgeEngine({ tenantId: 'acme-corp', confidenceThreshold: 0.35 });

  engine.registerConnector(new ConfluenceConnector({ name: 'confluence', tenantId: 'acme-corp' }));
  engine.registerConnector(new GoogleDriveConnector({ name: 'gdrive', tenantId: 'acme-corp' }));
  engine.registerConnector(new ZendeskConnector({ name: 'zendesk', tenantId: 'acme-corp' }));
  engine.registerConnector(new MarkdownConnector({ name: 'markdown', tenantId: 'acme-corp' }, [
    { id: 'MD-001', title: 'Internal API Rate Limits', content: 'Rate limits are set at 1000 requests per minute for standard tier and 10000 for enterprise tier. Burst allowance is 2x the base rate for up to 10 seconds.' },
  ]));

  const ingestResult = await engine.ingestAll();
  console.log(`✅ Ingested ${ingestResult.totalChunks} chunks from: ${ingestResult.sources.join(', ')}\n`);

  const queries = [
    { text: 'How does our API gateway handle rate limiting?', userType: 'engineer' },
    { text: 'What is the password reset process?', userType: 'engineer' },
    { text: 'What are the billing plan details?', userType: 'engineer' },
    { text: 'Tell me about the customer data processing agreement', userType: 'engineer' },
  ];

  const engineer: UserEntitlements = {
    user_guid: 'eng-dev-01', slack_user_id: 'U_ENG_01', tenant_id: 'acme-corp',
    email: 'developer@acme.com', group_guids: ['engineering', 'all-employees'], roles: ['developer'],
  };

  for (const q of queries) {
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(`❓ Query: "${q.text}"\n`);
    const answer = await engine.query(q.text, engineer);
    if (answer.is_abstained) {
      console.log(`⚠️  ABSTAINED: ${answer.abstention_reason}`);
    } else {
      console.log(`📝 Answer (confidence: ${(answer.confidence_score * 100).toFixed(1)}%):`);
      console.log(`   ${answer.answer_text.substring(0, 200)}...\n`);
      console.log(`📚 Citations:`);
      for (const cite of answer.citations) {
        console.log(`   [${cite.citation_index}] ${cite.document_title} (${cite.source_system})`);
      }
    }
    console.log();
  }

  const auditRecords = engine.getAuditLedger().query({ limit: 5 });
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`📊 Audit Trail (last ${auditRecords.length} records):`);
  for (const record of auditRecords) {
    console.log(`   [${record.action}] by ${record.actor} at ${record.timestamp.substring(11, 19)}`);
  }
  console.log(`\n✅ Demo completed successfully!`);
}

main().catch(console.error);
