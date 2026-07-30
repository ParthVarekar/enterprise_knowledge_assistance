import { BaseConnector, ConnectorConfig } from './base';
import { DocumentChunk, SourceSystem, SecurityClassification } from '../types';

export interface MarkdownDoc { id: string; title: string; content: string; classification?: SecurityClassification; }

export class MarkdownConnector extends BaseConnector {
  private documents: MarkdownDoc[];

  constructor(config: ConnectorConfig, documents: MarkdownDoc[] = []) {
    super(config);
    this.documents = documents;
  }

  public getSourceSystem(): string { return 'slack'; }

  public addDocument(doc: MarkdownDoc): void { this.documents.push(doc); }

  public async fetchDocuments(): Promise<DocumentChunk[]> {
    return this.documents.map((doc, idx) => ({
      chunk_id: this.generateChunkId(doc.id, 0), document_id: doc.id,
      tenant_id: this.config.tenantId, source_system: 'slack' as SourceSystem,
      source_url: `internal://markdown/${doc.id}`,
      document_title: doc.title,
      last_updated_at: new Date().toISOString(),
      security_classification: doc.classification || 'internal',
      acl: this.createDefaultACL('tenant_internal'),
      content: doc.content,
    }));
  }
}
