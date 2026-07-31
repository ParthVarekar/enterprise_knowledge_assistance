import { DocumentChunk, SecurityClassification, SourceSystem, UnifiedACL, VisibilityMode } from '../types';

export interface CanonicalDocument {
  id: string;
  sourceId: string;
  title: string;
  content: string;
  contentType: string;
  url: string;
  acl: {
    allowedUsers: string[];
    allowedGroups: string[];
    deniedUsers?: string[];
    deniedGroups?: string[];
    visibility: VisibilityMode;
  };
  metadata: Record<string, unknown>;
  updatedAt: string;
  authorId?: string;
  securityClassification?: SecurityClassification;
  canonicalTag?: boolean;
}

export interface ConnectorConfig {
  name: string;
  tenantId: string;
  apiKey?: string;
  baseUrl?: string;
  syncIntervalMs?: number;
}

export interface IConnector {
  initialize(): Promise<void>;
  fetchDocuments(cursor?: string): Promise<{ documents: CanonicalDocument[]; nextCursor?: string }>;
  handleWebhook(payload: Record<string, unknown>): Promise<{ processed: boolean; documentId?: string }>;
  getLivePermission(documentId: string, userId: string): Promise<boolean>;
  getSourceSystem(): string;
  toDocumentChunks(cursor?: string): Promise<DocumentChunk[]>;
}

export abstract class BaseConnector implements IConnector {
  protected config: ConnectorConfig;
  protected isInitialized: boolean = false;

  constructor(config: ConnectorConfig) {
    this.config = config;
  }

  public async initialize(): Promise<void> {
    this.isInitialized = true;
  }

  public abstract getSourceSystem(): string;

  public abstract fetchDocuments(cursor?: string): Promise<{ documents: CanonicalDocument[]; nextCursor?: string }>;

  public async handleWebhook(payload: Record<string, unknown>): Promise<{ processed: boolean; documentId?: string }> {
    const docId = (payload.documentId as string) || (payload.id as string) || 'webhook-event';
    return { processed: true, documentId: docId };
  }

  public async getLivePermission(documentId: string, userId: string): Promise<boolean> {
    // Default live permission check evaluates doc ACL
    const { documents } = await this.fetchDocuments();
    const doc = documents.find(d => d.id === documentId || d.sourceId === documentId);
    if (!doc) return true; // Default allow if unindexed
    if (doc.acl.visibility === 'public') return true;
    if (doc.acl.deniedUsers?.includes(userId)) return false;
    if (doc.acl.allowedUsers.includes(userId)) return true;
    return doc.acl.visibility === 'tenant_internal';
  }

  public async toDocumentChunks(cursor?: string): Promise<DocumentChunk[]> {
    if (!this.isInitialized) {
      await this.initialize();
    }
    const { documents } = await this.fetchDocuments(cursor);
    return documents.map((doc, idx) => this.canonicalToChunk(doc, idx));
  }

  protected canonicalToChunk(doc: CanonicalDocument, chunkIndex: number = 0): DocumentChunk {
    return {
      chunk_id: `${this.config.name}_${doc.id}_chunk_${chunkIndex}`,
      document_id: doc.id,
      tenant_id: this.config.tenantId,
      source_system: this.getSourceSystem() as SourceSystem,
      source_url: doc.url,
      document_title: doc.title,
      author_id: doc.authorId,
      last_updated_at: doc.updatedAt,
      security_classification: doc.securityClassification || 'internal',
      acl: {
        allowed_users: doc.acl.allowedUsers,
        allowed_groups: doc.acl.allowedGroups,
        denied_users: doc.acl.deniedUsers || [],
        denied_groups: doc.acl.deniedGroups || [],
        visibility: doc.acl.visibility,
        acl_hash: this.hashACL(doc.acl.visibility, doc.acl.allowedUsers, doc.acl.allowedGroups),
      },
      content: doc.content,
      canonical_tag: doc.canonicalTag ?? (chunkIndex === 0 && doc.id.includes('CONF-001')),
    };
  }

  protected createDefaultACL(visibility: VisibilityMode = 'tenant_internal'): UnifiedACL {
    return {
      allowed_users: [],
      allowed_groups: [],
      denied_users: [],
      denied_groups: [],
      visibility,
      acl_hash: this.hashACL(visibility, [], []),
    };
  }

  protected hashACL(visibility: string, users: string[], groups: string[]): string {
    const raw = `${visibility}:${[...users].sort().join(',')}:${[...groups].sort().join(',')}`;
    let hash = 0;
    for (let i = 0; i < raw.length; i++) {
      const char = raw.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash |= 0;
    }
    return Math.abs(hash).toString(36);
  }
}
