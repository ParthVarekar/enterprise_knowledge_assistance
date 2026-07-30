import { DocumentChunk, RetrievalQuery, GroundedAnswer, UserEntitlements, SourceSystem } from './types';
import { SparseSearchEngine } from './retrieval/sparseSearch';
import { VectorStore } from './retrieval/vectorStore';
import { HybridRetriever } from './retrieval/hybridRetriever';
import { AnswerGenerator } from './synthesis/generator';
import { LivePermissionGate } from './security/livePermissionGate';
import { AuditLedger } from './observability/auditLedger';
import { ConfluenceConnector } from './connectors/confluence';
import { GoogleDriveConnector } from './connectors/googleDrive';
import { ZendeskConnector } from './connectors/zendesk';
import { MarkdownConnector } from './connectors/markdown';
import { BaseConnector } from './connectors/base';

export interface EngineConfig {
  tenantId: string;
  confidenceThreshold?: number;
  maxCitations?: number;
  entailmentThreshold?: number;
}

export class EnterpriseKnowledgeEngine {
  private sparseEngine: SparseSearchEngine;
  private vectorStore: VectorStore;
  private retriever: HybridRetriever;
  private generator: AnswerGenerator;
  private permissionGate: LivePermissionGate;
  private auditLedger: AuditLedger;
  private connectors: BaseConnector[] = [];
  private config: EngineConfig;
  private allChunks: DocumentChunk[] = [];

  constructor(config: EngineConfig) {
    this.config = config;
    this.sparseEngine = new SparseSearchEngine();
    this.vectorStore = new VectorStore();
    this.permissionGate = new LivePermissionGate();
    this.retriever = new HybridRetriever(this.sparseEngine, this.vectorStore, this.permissionGate);
    this.generator = new AnswerGenerator({
      confidenceThreshold: config.confidenceThreshold ?? 0.4,
      maxCitations: config.maxCitations ?? 5,
      entailmentThreshold: config.entailmentThreshold ?? 0.65,
    });
    this.auditLedger = new AuditLedger();
  }

  public registerConnector(connector: BaseConnector): void {
    this.connectors.push(connector);
  }

  public async ingestAll(): Promise<{ totalChunks: number; sources: string[] }> {
    this.allChunks = [];
    const sources: string[] = [];
    for (const connector of this.connectors) {
      const chunks = await connector.fetchDocuments();
      this.allChunks.push(...chunks);
      sources.push(connector.getSourceSystem());
    }
    this.sparseEngine.indexDocuments(this.allChunks);
    this.vectorStore.upsertChunks(this.allChunks);
    return { totalChunks: this.allChunks.length, sources };
  }

  public async query(queryText: string, user: UserEntitlements, domainFilters?: SourceSystem[]): Promise<GroundedAnswer> {
    const queryId = `q_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    this.auditLedger.log({
      timestamp: new Date().toISOString(), action: 'query', actor: user.user_guid,
      tenant_id: user.tenant_id, details: { query_text: queryText, query_id: queryId }, trace_id: queryId,
    });
    const retrievalQuery: RetrievalQuery = {
      query_id: queryId, raw_text: queryText, expanded_text: queryText,
      user_entitlements: user, domain_filters: domainFilters, top_k: 20,
    };
    const candidates = await this.retriever.retrieve(retrievalQuery);
    this.auditLedger.log({
      timestamp: new Date().toISOString(), action: 'retrieval', actor: user.user_guid,
      tenant_id: user.tenant_id, details: { query_id: queryId, candidates_found: candidates.length }, trace_id: queryId,
    });
    const answer = await this.generator.generateAnswer(queryId, queryText, candidates);
    this.auditLedger.log({
      timestamp: new Date().toISOString(), action: answer.is_abstained ? 'answer_abstained' : 'answer_served',
      actor: user.user_guid, tenant_id: user.tenant_id,
      details: { query_id: queryId, confidence: answer.confidence_score, citations: answer.citations.length, abstained: answer.is_abstained },
      trace_id: queryId,
    });
    return answer;
  }

  public getAuditLedger(): AuditLedger { return this.auditLedger; }
  public getAllChunks(): DocumentChunk[] { return this.allChunks; }
}

export { SparseSearchEngine } from './retrieval/sparseSearch';
export { VectorStore } from './retrieval/vectorStore';
export { HybridRetriever } from './retrieval/hybridRetriever';
export { AnswerGenerator } from './synthesis/generator';
export { GroundingVerifier } from './grounding/verifier';
export { ACLEvaluator } from './security/acl';
export { LivePermissionGate } from './security/livePermissionGate';
export { AuditLedger } from './observability/auditLedger';
export { ConfluenceConnector } from './connectors/confluence';
export { GoogleDriveConnector } from './connectors/googleDrive';
export { ZendeskConnector } from './connectors/zendesk';
export { MarkdownConnector } from './connectors/markdown';
export { BaseConnector } from './connectors/base';
export { LlamaCppClient } from './llm/llamaClient';
export * from './types';
