import { BaseConnector, CanonicalDocument, ConnectorConfig } from './base';
import { DocumentChunk, SecurityClassification } from '../types';

export interface MarkdownDoc { id: string; title: string; content: string; classification?: SecurityClassification; }

export class MarkdownConnector extends BaseConnector {
  private documents: MarkdownDoc[];

  constructor(config: ConnectorConfig, documents: MarkdownDoc[] = []) {
    super(config);
    this.documents = documents;
  }

  public getSourceSystem(): string { return 'slack'; }

  public addDocument(doc: MarkdownDoc): void { this.documents.push(doc); }

  public async fetchDocuments(cursor?: string): Promise<{ documents: CanonicalDocument[]; nextCursor?: string }> {
    const docs: CanonicalDocument[] = this.documents.map(doc => ({
      id: doc.id,
      sourceId: doc.id,
      title: doc.title,
      content: doc.content,
      contentType: 'text/markdown',
      url: `internal://markdown/${doc.id}`,
      acl: { allowedUsers: [], allowedGroups: [], visibility: 'tenant_internal' },
      metadata: {},
      updatedAt: new Date().toISOString(),
      securityClassification: doc.classification || 'internal',
    }));

    return { documents: docs };
  }

  public async fetchLegacyChunks(): Promise<DocumentChunk[]> {
    return this.toDocumentChunks();
  }
}
