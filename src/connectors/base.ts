import { DocumentChunk, SecurityClassification, UnifiedACL, VisibilityMode } from '../types';

export interface ConnectorConfig {
  name: string;
  tenantId: string;
  apiKey?: string;
  baseUrl?: string;
  syncIntervalMs?: number;
}

export abstract class BaseConnector {
  protected config: ConnectorConfig;

  constructor(config: ConnectorConfig) {
    this.config = config;
  }

  abstract fetchDocuments(): Promise<DocumentChunk[]>;
  abstract getSourceSystem(): string;

  protected generateChunkId(docId: string, index: number): string {
    return `${this.config.name}_${docId}_chunk_${index}`;
  }

  protected createDefaultACL(visibility: VisibilityMode = 'tenant_internal'): UnifiedACL {
    return {
      allowed_users: [], allowed_groups: [], denied_users: [], denied_groups: [],
      visibility, acl_hash: this.hashACL(visibility, [], []),
    };
  }

  protected hashACL(visibility: string, users: string[], groups: string[]): string {
    const raw = `${visibility}:${users.sort().join(',')}:${groups.sort().join(',')}`;
    let hash = 0;
    for (let i = 0; i < raw.length; i++) {
      const char = raw.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash |= 0;
    }
    return Math.abs(hash).toString(36);
  }
}
