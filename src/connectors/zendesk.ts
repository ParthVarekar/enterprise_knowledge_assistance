import { BaseConnector, CanonicalDocument } from './base';
import { DocumentChunk, SecurityClassification } from '../types';

export class ZendeskConnector extends BaseConnector {
  public getSourceSystem(): string { return 'zendesk'; }

  public async fetchDocuments(cursor?: string): Promise<{ documents: CanonicalDocument[]; nextCursor?: string }> {
    const sampleArticles = [
      { id: 'ZD-001', title: 'How to Reset Your Password', content: 'To reset your password, click the "Forgot Password" link on the login page. You will receive an email with a reset link valid for 24 hours. Passwords must be at least 12 characters with uppercase, lowercase, numbers, and special characters. MFA is required for all accounts.', classification: 'public' as SecurityClassification },
      { id: 'ZD-002', title: 'Billing FAQ', content: 'Billing cycles run on the first of each month. Pro plan includes up to 100 users, 500GB storage, and priority support. Enterprise plan includes unlimited users, 5TB storage, custom integrations, and dedicated account management. Annual billing provides a 20% discount.', classification: 'public' as SecurityClassification },
    ];

    const documents: CanonicalDocument[] = sampleArticles.map((article, idx) => ({
      id: article.id,
      sourceId: article.id,
      title: article.title,
      content: article.content,
      contentType: 'text/html',
      url: `https://help.example.com/articles/${article.id}`,
      acl: { allowedUsers: [], allowedGroups: [], visibility: 'public' },
      metadata: {},
      updatedAt: new Date(Date.now() - idx * 259200000).toISOString(),
      securityClassification: article.classification,
    }));

    return { documents };
  }

  public async fetchLegacyChunks(): Promise<DocumentChunk[]> {
    return this.toDocumentChunks();
  }
}
