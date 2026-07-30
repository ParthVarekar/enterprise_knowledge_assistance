import { BaseConnector, ConnectorConfig } from './base';
import { DocumentChunk, SourceSystem, SecurityClassification } from '../types';

export class ZendeskConnector extends BaseConnector {
  public getSourceSystem(): string { return 'zendesk'; }

  public async fetchDocuments(): Promise<DocumentChunk[]> {
    const sampleArticles = [
      { id: 'ZD-001', title: 'How to Reset Your Password', content: 'To reset your password, click the "Forgot Password" link on the login page. You will receive an email with a reset link valid for 24 hours. Passwords must be at least 12 characters with uppercase, lowercase, numbers, and special characters. MFA is required for all accounts.', classification: 'public' as SecurityClassification },
      { id: 'ZD-002', title: 'Billing FAQ', content: 'Billing cycles run on the first of each month. Pro plan includes up to 100 users, 500GB storage, and priority support. Enterprise plan includes unlimited users, 5TB storage, custom integrations, and dedicated account management. Annual billing provides a 20% discount.', classification: 'public' as SecurityClassification },
    ];

    return sampleArticles.map((article, idx) => ({
      chunk_id: this.generateChunkId(article.id, 0), document_id: article.id,
      tenant_id: this.config.tenantId, source_system: 'zendesk' as SourceSystem,
      source_url: `https://help.example.com/articles/${article.id}`,
      document_title: article.title,
      last_updated_at: new Date(Date.now() - idx * 259200000).toISOString(),
      security_classification: article.classification, acl: this.createDefaultACL('public'),
      content: article.content,
    }));
  }
}
