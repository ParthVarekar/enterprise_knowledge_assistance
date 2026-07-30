import { describe, it, expect, beforeAll } from 'vitest';
import { EnterpriseKnowledgeEngine } from '../src/index';
import { ConfluenceConnector } from '../src/connectors/confluence';
import { GoogleDriveConnector } from '../src/connectors/googleDrive';
import { ZendeskConnector } from '../src/connectors/zendesk';
import { UserEntitlements } from '../src/types';

describe('End-to-End Engine Evaluation', () => {
  let engine: EnterpriseKnowledgeEngine;
  const engineer: UserEntitlements = {
    user_guid: 'eng-01', slack_user_id: 'U_ENG', tenant_id: 'test-corp',
    email: 'eng@test.com', group_guids: ['engineering', 'all-employees'], roles: ['developer'],
  };
  const outsider: UserEntitlements = {
    user_guid: 'outsider-01', slack_user_id: 'U_OUT', tenant_id: 'test-corp',
    email: 'outsider@test.com', group_guids: [], roles: [],
  };

  beforeAll(async () => {
    engine = new EnterpriseKnowledgeEngine({ tenantId: 'test-corp', confidenceThreshold: 0.3 });
    engine.registerConnector(new ConfluenceConnector({ name: 'confluence', tenantId: 'test-corp' }));
    engine.registerConnector(new GoogleDriveConnector({ name: 'gdrive', tenantId: 'test-corp' }));
    engine.registerConnector(new ZendeskConnector({ name: 'zendesk', tenantId: 'test-corp' }));
    await engine.ingestAll();
  });

  it('should answer queries about API gateway', async () => {
    const answer = await engine.query('How does the API gateway handle rate limiting?', engineer);
    expect(answer.is_abstained).toBe(false);
    expect(answer.confidence_score).toBeGreaterThan(0);
    expect(answer.citations.length).toBeGreaterThan(0);
  });

  it('should provide citations from correct sources', async () => {
    const answer = await engine.query('deployment process', engineer);
    expect(answer.citations.length).toBeGreaterThan(0);
    for (const cite of answer.citations) {
      expect(cite.source_url).toBeTruthy();
      expect(cite.document_title).toBeTruthy();
    }
  });

  it('should deny outsiders access to restricted documents', async () => {
    const answer = await engine.query('customer data processing agreement', outsider);
    if (!answer.is_abstained) {
      const hasRestricted = answer.citations.some(c =>
        c.document_title.toLowerCase().includes('data processing')
      );
      expect(hasRestricted).toBe(false);
    }
  });

  it('should generate audit trail for queries', async () => {
    const initialCount = engine.getAuditLedger().getRecordCount();
    await engine.query('test audit query', engineer);
    expect(engine.getAuditLedger().getRecordCount()).toBeGreaterThan(initialCount);
  });
});
