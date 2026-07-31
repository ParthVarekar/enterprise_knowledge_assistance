import { DocumentChunk, RetrievalQuery, GroundedAnswer, UserEntitlements, SourceSystem } from './types';
import { SparseSearchEngine } from './retrieval/sparseSearch';
import { VectorStore } from './retrieval/vectorStore';
import { HybridRetriever } from './retrieval/hybridRetriever';
import { AnswerGenerator } from './synthesis/generator';
import { LivePermissionGate } from './security/livePermissionGate';
import { AuditLedger } from './observability/auditLedger';
import { BaseConnector } from './connectors/base';
import { ConnectorRegistry } from './connectors/registry';
import { DLPFilter } from './security/dlp';

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
    this.auditLedger = new AuditLedger();
    this.permissionGate = new LivePermissionGate(this.auditLedger);
    this.retriever = new HybridRetriever(this.sparseEngine, this.vectorStore, this.permissionGate);
    this.generator = new AnswerGenerator({
      confidenceThreshold: config.confidenceThreshold ?? 0.4,
      maxCitations: config.maxCitations ?? 5,
      entailmentThreshold: config.entailmentThreshold ?? 0.65,
    });
  }

  public registerConnector(connector: BaseConnector): void {
    this.connectors.push(connector);
    ConnectorRegistry.getInstance().register(connector);
  }

  public indexChunks(chunks: DocumentChunk[]): void {
    this.allChunks = chunks;
    this.sparseEngine.indexDocuments(chunks);
    this.vectorStore.upsertChunks(chunks);
  }

  public async ingestAll(): Promise<{ totalChunks: number; sources: string[] }> {
    this.allChunks = [];
    const sources: string[] = [];

    // Register active connectors with registry
    for (const connector of this.connectors) {
      ConnectorRegistry.getInstance().register(connector);
    }

    const registered = ConnectorRegistry.getInstance().list();
    const activeConnectors = registered.length > 0 ? registered : this.connectors;

    for (const connector of activeConnectors) {
      const chunks = await connector.toDocumentChunks();
      this.allChunks.push(...chunks);
      sources.push(connector.getSourceSystem());
    }
    this.sparseEngine.indexDocuments(this.allChunks);
    this.vectorStore.upsertChunks(this.allChunks);
    return { totalChunks: this.allChunks.length, sources };
  }

  public async query(queryText: string, user: UserEntitlements, domainFilters?: SourceSystem[]): Promise<GroundedAnswer> {
    const queryId = `q_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    
    // DLP Sanitization
    const { sanitizedText } = DLPFilter.sanitize(queryText);

    this.auditLedger.log({
      timestamp: new Date().toISOString(), action: 'query', actor: user.user_guid,
      tenant_id: user.tenant_id, details: { query_text: sanitizedText, query_id: queryId }, trace_id: queryId,
      query_id: queryId,
    });

    const retrievalQuery: RetrievalQuery = {
      query_id: queryId, raw_text: sanitizedText, expanded_text: sanitizedText,
      user_entitlements: user, domain_filters: domainFilters, top_k: 20,
    };
    const candidates = await this.retriever.retrieve(retrievalQuery);

    this.auditLedger.log({
      timestamp: new Date().toISOString(), action: 'retrieval', actor: user.user_guid,
      tenant_id: user.tenant_id, details: { query_id: queryId, candidates_found: candidates.length }, trace_id: queryId,
      query_id: queryId, matched_document_ids: candidates.map(c => c.chunk.document_id), live_gate_passed: true,
    });

    const answer = await this.generator.generateAnswer(queryId, sanitizedText, candidates);

    this.auditLedger.log({
      timestamp: new Date().toISOString(), action: answer.is_abstained ? 'answer_abstained' : 'answer_served',
      actor: user.user_guid, tenant_id: user.tenant_id,
      details: { query_id: queryId, confidence: answer.confidence_score, citations: answer.citations.length, abstained: answer.is_abstained },
      trace_id: queryId, query_id: queryId, matched_document_ids: candidates.map(c => c.chunk.document_id),
      live_gate_passed: !answer.is_abstained, llm_token_count: answer.answer_text.length / 4,
    });

    return answer;
  }

  public getAuditLedger(): AuditLedger { return this.auditLedger; }
  public getAllChunks(): DocumentChunk[] { return this.allChunks; }
}

export function createEKRSEngine(config: EngineConfig): EnterpriseKnowledgeEngine {
  return new EnterpriseKnowledgeEngine(config);
}

export { SparseSearchEngine } from './retrieval/sparseSearch';
export { VectorStore } from './retrieval/vectorStore';
export { HybridRetriever } from './retrieval/hybridRetriever';
export { AnswerGenerator } from './synthesis/generator';
export { GroundingVerifier } from './grounding/verifier';
export { ACLEvaluator } from './security/acl';
export { LivePermissionGate } from './security/livePermissionGate';
export { DLPFilter } from './security/dlp';
export { AuditLedger } from './observability/auditLedger';
export { ConfluenceConnector } from './connectors/confluence';
export { GoogleDriveConnector } from './connectors/googleDrive';
export { ZendeskConnector } from './connectors/zendesk';
export { MarkdownConnector } from './connectors/markdown';
export { BaseConnector } from './connectors/base';
export { ConnectorRegistry } from './connectors/registry';
export { EKRSMCPServer } from './mcp/server';
export { LlamaCppClient } from './llm/llamaClient';
export { EKRSRouter, createEKRSRouter } from './server/router';
export * from './retrieval/interfaces';
export * from './types';
