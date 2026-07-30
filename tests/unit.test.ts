import { describe, it, expect } from 'vitest';
import { ACLEvaluator } from '../src/security/acl';
import { SparseSearchEngine } from '../src/retrieval/sparseSearch';
import { VectorStore } from '../src/retrieval/vectorStore';
import { GroundingVerifier } from '../src/grounding/verifier';
import { AuditLedger } from '../src/observability/auditLedger';
import { UnifiedACL, UserEntitlements, DocumentChunk, ScoredCandidate, SourceSystem } from '../src/types';

function createMockUser(overrides: Partial<UserEntitlements> = {}): UserEntitlements {
  return {
    user_guid: 'test-user', slack_user_id: 'U_TEST', tenant_id: 'test-tenant',
    email: 'test@test.com', group_guids: ['engineering'], roles: ['developer'], ...overrides,
  };
}

function createMockACL(overrides: Partial<UnifiedACL> = {}): UnifiedACL {
  return {
    allowed_users: [], allowed_groups: ['engineering'], denied_users: [], denied_groups: [],
    visibility: 'restricted_groups', acl_hash: 'test-hash', ...overrides,
  };
}

function createMockChunk(overrides: Partial<DocumentChunk> = {}): DocumentChunk {
  return {
    chunk_id: 'chunk-1', document_id: 'doc-1', tenant_id: 'test-tenant',
    source_system: 'confluence' as SourceSystem, source_url: 'https://example.com/doc-1',
    document_title: 'Test Document', last_updated_at: new Date().toISOString(),
    security_classification: 'internal', acl: createMockACL(),
    content: 'This is test content about API rate limiting and deployment processes.', ...overrides,
  };
}

describe('ACLEvaluator', () => {
  it('should grant access to group members', () => {
    const user = createMockUser({ group_guids: ['engineering'] });
    const acl = createMockACL({ allowed_groups: ['engineering'], visibility: 'restricted_groups' });
    expect(ACLEvaluator.evaluate(user, acl)).toBe(true);
  });

  it('should deny access to non-members', () => {
    const user = createMockUser({ group_guids: ['marketing'] });
    const acl = createMockACL({ allowed_groups: ['engineering'], visibility: 'restricted_groups' });
    expect(ACLEvaluator.evaluate(user, acl)).toBe(false);
  });

  it('should deny access to users on deny list even if in allowed', () => {
    const user = createMockUser({ user_guid: 'denied-user', group_guids: ['engineering'] });
    const acl = createMockACL({ allowed_users: ['denied-user'], denied_users: ['denied-user'] });
    expect(ACLEvaluator.evaluate(user, acl)).toBe(false);
  });

  it('should grant access to public documents for any user', () => {
    const user = createMockUser({ group_guids: [] });
    const acl = createMockACL({ visibility: 'public', allowed_groups: [] });
    expect(ACLEvaluator.evaluate(user, acl)).toBe(true);
  });

  it('should grant access to explicit users', () => {
    const user = createMockUser({ user_guid: 'special-user' });
    const acl = createMockACL({ visibility: 'explicit_users', allowed_users: ['special-user'] });
    expect(ACLEvaluator.evaluate(user, acl)).toBe(true);
  });

  it('should filter candidates by ACL', () => {
    const user = createMockUser({ group_guids: ['engineering'] });
    const chunks = [
      createMockChunk({ chunk_id: 'c1', acl: createMockACL({ allowed_groups: ['engineering'] }) }),
      createMockChunk({ chunk_id: 'c2', acl: createMockACL({ allowed_groups: ['legal'], visibility: 'restricted_groups' }) }),
      createMockChunk({ chunk_id: 'c3', acl: createMockACL({ visibility: 'public' }) }),
    ];
    const filtered = ACLEvaluator.filterCandidates(chunks, user);
    expect(filtered.length).toBe(2);
    expect(filtered.map(f => f.chunk_id)).toContain('c1');
    expect(filtered.map(f => f.chunk_id)).toContain('c3');
  });
});

describe('SparseSearchEngine', () => {
  it('should index and search documents', () => {
    const engine = new SparseSearchEngine();
    const chunks = [
      createMockChunk({ chunk_id: 'c1', content: 'API gateway rate limiting with token buckets' }),
      createMockChunk({ chunk_id: 'c2', content: 'Database migration guide for PostgreSQL' }),
    ];
    engine.indexDocuments(chunks);
    const results = engine.search('API rate limiting');
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].chunk.chunk_id).toBe('c1');
  });

  it('should return empty results for unrelated queries', () => {
    const engine = new SparseSearchEngine();
    engine.indexDocuments([createMockChunk({ content: 'API gateway documentation' })]);
    const results = engine.search('quantum physics thermodynamics');
    expect(results.length).toBe(0);
  });
});

describe('VectorStore', () => {
  it('should upsert and search chunks', () => {
    const store = new VectorStore();
    const chunks = [
      createMockChunk({ chunk_id: 'c1', content: 'rate limiting API gateway' }),
      createMockChunk({ chunk_id: 'c2', content: 'employee onboarding process' }),
    ];
    store.upsertChunks(chunks);
    const user = createMockUser();
    const results = store.search('API rate limit', undefined, user);
    expect(results.length).toBeGreaterThan(0);
  });
});

describe('GroundingVerifier', () => {
  it('should verify claims against evidence', () => {
    const verifier = new GroundingVerifier({ entailmentThreshold: 0.5 });
    const candidates: ScoredCandidate[] = [{
      chunk: createMockChunk({ content: 'API rate limiting uses token bucket algorithm with 1000 requests per minute' }),
      sparse_score: 1, dense_score: 1, rrf_score: 1, rerank_score: 1, final_score: 1, live_acl_verified: true,
    }];
    const result = verifier.verifyClaims(
      'The API uses token bucket algorithm for rate limiting with 1000 requests per minute.',
      candidates
    );
    expect(result.claims.length).toBeGreaterThan(0);
  });
});

describe('AuditLedger', () => {
  it('should log and query audit records', () => {
    const ledger = new AuditLedger();
    ledger.log({ timestamp: new Date().toISOString(), action: 'query', actor: 'user-1', tenant_id: 'test', details: { q: 'test' } });
    ledger.log({ timestamp: new Date().toISOString(), action: 'retrieval', actor: 'user-1', tenant_id: 'test', details: {} });
    const results = ledger.query({ action: 'query' });
    expect(results.length).toBe(1);
    expect(ledger.getRecordCount()).toBe(2);
  });
});
