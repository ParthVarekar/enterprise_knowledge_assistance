import { BaseConnector, CanonicalDocument } from './base';
import { DocumentChunk, SecurityClassification } from '../types';

export class GoogleDriveConnector extends BaseConnector {
  public getSourceSystem(): string { return 'google_drive'; }

  public async fetchDocuments(cursor?: string): Promise<{ documents: CanonicalDocument[]; nextCursor?: string }> {
    const sampleDocs = [
      { id: 'GDRIVE-001', title: 'Engineering Onboarding Guide', content: 'Welcome to the engineering team! This guide covers our development environment setup, code review process, CI/CD pipeline overview, and team communication channels. All new engineers should complete the security training module within their first week.', classification: 'internal' as SecurityClassification, author: 'hr-eng-01' },
      { id: 'GDRIVE-002', title: 'Customer Data Processing Agreement', content: 'This Data Processing Agreement governs the processing of personal data by the processor on behalf of the controller. Data retention periods are set to 90 days for logs and 365 days for transaction records. All data must be encrypted at rest using AES-256.', classification: 'restricted' as SecurityClassification, author: 'legal-01' },
    ];

    const documents: CanonicalDocument[] = sampleDocs.map((doc, idx) => ({
      id: doc.id,
      sourceId: doc.id,
      title: doc.title,
      content: doc.content,
      contentType: 'application/vnd.google-apps.document',
      url: `https://drive.google.com/file/d/${doc.id}/view`,
      acl: doc.classification === 'restricted'
        ? { allowedUsers: ['legal-01', 'cto-01'], allowedGroups: ['legal-team', 'executives'], visibility: 'explicit_users' }
        : { allowedUsers: [], allowedGroups: ['all-employees'], visibility: 'tenant_internal' },
      metadata: { author: doc.author },
      updatedAt: new Date(Date.now() - idx * 172800000).toISOString(),
      authorId: doc.author,
      securityClassification: doc.classification,
    }));

    return { documents };
  }

  public async fetchLegacyChunks(): Promise<DocumentChunk[]> {
    return this.toDocumentChunks();
  }
}
