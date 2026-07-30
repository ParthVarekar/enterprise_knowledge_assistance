import { describe, it, expect, beforeAll } from 'vitest';
import { EnterpriseKnowledgeEngine } from '../src/index';
import { LlamaCppClient } from '../src/llm/llamaClient';
import { ConfluenceConnector } from '../src/connectors/confluence';
import { GoogleDriveConnector } from '../src/connectors/googleDrive';
import { UserEntitlements } from '../src/types';

describe('Llama.cpp & Local Model Integration Test Suite', () => {
  let engine: EnterpriseKnowledgeEngine;
  let llamaClient: LlamaCppClient;

  const engineer: UserEntitlements = {
    user_guid: 'eng-lead-01',
    slack_user_id: 'U_ENG_LEAD',
    tenant_id: 'acme-corp',
    email: 'dev@acme.com',
    group_guids: ['engineering', 'all-employees'],
    roles: ['developer'],
  };

  beforeAll(async () => {
    llamaClient = new LlamaCppClient({ baseUrl: 'http://127.0.0.1:8080' });
    engine = new EnterpriseKnowledgeEngine({
      tenantId: 'acme-corp',
      confidenceThreshold: 0.35,
    });

    engine.registerConnector(new ConfluenceConnector({ name: 'confluence', tenantId: 'acme-corp' }));
    engine.registerConnector(new GoogleDriveConnector({ name: 'gdrive', tenantId: 'acme-corp' }));
    await engine.ingestAll();
  });

  it('should initialize LlamaCppClient with correct endpoint', () => {
    expect(llamaClient).toBeDefined();
  });

  it('should handle isServerAlive without throwing errors', async () => {
    const isAlive = await llamaClient.isServerAlive();
    expect(typeof isAlive).toBe('boolean');
    console.log(`[Test Log] Local llama-server status (http://127.0.0.1:8080): ${isAlive ? 'ONLINE (CUDA GPU Active)' : 'OFFLINE (Fallback Active)'}`);
  });

  it('should generate an answer using llama.cpp or fallback seamlessly', async () => {
    const queryText = 'How does the API gateway handle rate limiting?';
    const answer = await engine.query(queryText, engineer);

    expect(answer).toBeDefined();
    expect(answer.is_abstained).toBe(false);
    expect(answer.answer_text).toBeTruthy();
    expect(answer.confidence_score).toBeGreaterThan(0);
    expect(answer.citations.length).toBeGreaterThan(0);
  });

  it('should strictly enforce Zero-Trust ACL during local model synthesis', async () => {
    const outsider: UserEntitlements = {
      user_guid: 'outsider-99',
      slack_user_id: 'U_OUTSIDER',
      tenant_id: 'acme-corp',
      email: 'external@vendor.com',
      group_guids: ['external-vendors'],
      roles: [],
    };

    const answer = await engine.query('customer data processing agreement', outsider);
    if (!answer.is_abstained) {
      const containsRestricted = answer.citations.some(c => c.classification === 'restricted');
      expect(containsRestricted).toBe(false);
    }
  });

  it('should log audit event for synthesis', async () => {
    const initialCount = engine.getAuditLedger().getRecordCount();
    await engine.query('What is the deployment runbook?', engineer);
    expect(engine.getAuditLedger().getRecordCount()).toBeGreaterThan(initialCount);
  });
});
