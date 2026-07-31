import { describe, it, expect, beforeEach } from 'vitest';
import { ConnectorRegistry } from '../src/connectors/registry';
import { ConfluenceConnector } from '../src/connectors/confluence';
import { GoogleDriveConnector } from '../src/connectors/googleDrive';
import { ZendeskConnector } from '../src/connectors/zendesk';
import { EnterpriseKnowledgeEngine } from '../src/index';
import { UserEntitlements } from '../src/types';
import { DLPFilter } from '../src/security/dlp';
import { EKRSMCPServer } from '../src/mcp/server';
import { createEKRSRouter } from '../src/server/router';

describe('Universal EKRS Integration & Security Engine', () => {
  let registry: ConnectorRegistry;
  let engine: EnterpriseKnowledgeEngine;

  beforeEach(async () => {
    registry = ConnectorRegistry.getInstance();
    registry.clear();

    const confConn = new ConfluenceConnector({ name: 'confluence', tenantId: 'test-tenant' });
    const driveConn = new GoogleDriveConnector({ name: 'google_drive', tenantId: 'test-tenant' });
    const zdConn = new ZendeskConnector({ name: 'zendesk', tenantId: 'test-tenant' });

    registry.register(confConn);
    registry.register(driveConn);
    registry.register(zdConn);

    await registry.initializeAll();
    engine = new EnterpriseKnowledgeEngine({ tenantId: 'test-tenant' });

    const chunks = await registry.syncAll();
    engine.indexChunks(chunks);
  });

  it('registers connectors and syncs canonical document chunks into index', () => {
    expect(registry.list().length).toBe(3);
    expect(engine.getAllChunks().length).toBeGreaterThanOrEqual(7);
  });

  it('enforces Zero-Trust ACL filtering for restricted documents', async () => {
    const engineerUser: UserEntitlements = {
      user_guid: 'eng-01',
      slack_user_id: 'U123',
      tenant_id: 'test-tenant',
      email: 'engineer@test.com',
      group_guids: ['engineering', 'all-employees'],
      roles: ['engineer'],
    };

    const dpaAnswer = await engine.query('Fetch Data Processing Agreement DPA', engineerUser);
    expect(dpaAnswer.is_abstained).toBe(true);
    expect(dpaAnswer.citations.length).toBe(0);
  });

  it('allows authorized legal user to access Restricted DPA document', async () => {
    const legalUser: UserEntitlements = {
      user_guid: 'legal-01',
      slack_user_id: 'U999',
      tenant_id: 'test-tenant',
      email: 'legal@test.com',
      group_guids: ['legal-team', 'executives', 'all-employees'],
      roles: ['counsel'],
    };

    const dpaAnswer = await engine.query('Fetch Data Processing Agreement DPA', legalUser);
    expect(dpaAnswer.is_abstained).toBe(false);
    expect(dpaAnswer.citations.length).toBeGreaterThan(0);
  });

  it('sanitizes PII/DLP sensitive credentials in queries and text', () => {
    const rawText = 'My SSN is 123-45-6789 and API key is sk-12345678901234567890123456789012';
    const { sanitizedText, redactedMatchesCount } = DLPFilter.sanitize(rawText);
    expect(redactedMatchesCount).toBe(2);
    expect(sanitizedText).toContain('[REDACTED_SSN]');
    expect(sanitizedText).toContain('[REDACTED_API_KEY]');
  });

  it('executes MCP server tools seamlessly', async () => {
    const mcp = new EKRSMCPServer(engine);
    const tools = mcp.getTools();
    expect(tools.map(t => t.name)).toContain('search_knowledge');

    const searchRes = await mcp.callTool('search_knowledge', {
      query_text: 'How does our API gateway handle rate limiting?',
      user_guid: 'eng-01',
    });
    expect(searchRes.isError).toBeFalsy();

    const verifyRes = await mcp.callTool('verify_citation', {
      claim_text: 'token bucket algorithm rate limiting',
      chunk_id: 'CONF-001',
    });
    expect(verifyRes.result).toHaveProperty('verified');
  });

  it('routes REST endpoints for /api/v1/query, /connectors, and /webhooks', async () => {
    const router = createEKRSRouter(engine);

    const connectorsRes = await router.handleRequest('/api/v1/connectors', 'GET', null);
    expect(connectorsRes.status).toBe(200);
    expect(connectorsRes.payload.count).toBeGreaterThan(0);

    const webhookRes = await router.handleRequest('/api/v1/webhooks/google_drive', 'POST', { documentId: 'GDRIVE-001' });
    expect(webhookRes.status).toBe(200);
    expect(webhookRes.payload.status).toBe('processed');

    const queryRes = await router.handleRequest('/api/v1/query', 'POST', {
      query_text: 'password reset MFA setup',
      user: { user_guid: 'user-1', tenant_id: 'test-tenant', group_guids: ['all-employees'], roles: ['user'], email: 'user@test.com', slack_user_id: 'U1' },
    });
    expect(queryRes.status).toBe(200);
    expect(queryRes.payload.answer_text).toContain('password');
  });
});
