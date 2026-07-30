import { BaseConnector, ConnectorConfig } from './base';
import { DocumentChunk, SourceSystem, SecurityClassification } from '../types';

export class GoogleDriveConnector extends BaseConnector {
  public getSourceSystem(): string { return 'google_drive'; }

  public async fetchDocuments(): Promise<DocumentChunk[]> {
    const sampleDocs = [
      { id: 'GDRIVE-001', title: 'Engineering Onboarding Guide', content: 'Welcome to the engineering team! This guide covers our development environment setup, code review process, CI/CD pipeline overview, and team communication channels. All new engineers should complete the security training module within their first week.', classification: 'internal' as SecurityClassification, author: 'hr-eng-01' },
      { id: 'GDRIVE-002', title: 'Customer Data Processing Agreement', content: 'This Data Processing Agreement governs the processing of personal data by the processor on behalf of the controller. Data retention periods are set to 90 days for logs and 365 days for transaction records. All data must be encrypted at rest using AES-256.', classification: 'restricted' as SecurityClassification, author: 'legal-01' },
    ];

    return sampleDocs.map((doc, idx) => ({
      chunk_id: this.generateChunkId(doc.id, 0), document_id: doc.id,
      tenant_id: this.config.tenantId, source_system: 'google_drive' as SourceSystem,
      source_url: `https://drive.google.com/file/d/${doc.id}/view`,
      document_title: doc.title, author_id: doc.author,
      last_updated_at: new Date(Date.now() - idx * 172800000).toISOString(),
      security_classification: doc.classification,
      acl: doc.classification === 'restricted'
        ? { ...this.createDefaultACL('explicit_users'), allowed_users: ['legal-01', 'cto-01'], allowed_groups: ['legal-team'] }
        : this.createDefaultACL('tenant_internal'),
      content: doc.content,
    }));
  }
}
