import { BaseConnector, ConnectorConfig } from './base';
import { DocumentChunk, SourceSystem, SecurityClassification } from '../types';

export interface ConfluenceConfig extends ConnectorConfig {
  spaceKeys?: string[];
  maxPages?: number;
}

export class ConfluenceConnector extends BaseConnector {
  private spaceKeys: string[];
  private maxPages: number;

  constructor(config: ConfluenceConfig) {
    super(config);
    this.spaceKeys = config.spaceKeys || ['ENG', 'PRODUCT', 'OPS'];
    this.maxPages = config.maxPages || 100;
  }

  public getSourceSystem(): string { return 'confluence'; }

  public async fetchDocuments(): Promise<DocumentChunk[]> {
    const samplePages = [
      { id: 'CONF-001', title: 'API Gateway Architecture', space: 'ENG', content: 'Our API gateway uses a microservice mesh pattern with service discovery via Consul. Rate limiting is enforced at the edge using token bucket algorithms with configurable burst rates per tenant. Authentication flows through OAuth 2.0 with PKCE for public clients.', classification: 'internal' as SecurityClassification, author: 'eng-lead-01' },
      { id: 'CONF-002', title: 'Deployment Runbook', space: 'OPS', content: 'Production deployments follow blue-green strategy with automatic rollback triggers at 5% error rate threshold. Canary deployments are promoted after 15 minutes of stable metrics including p99 latency under 200ms and zero critical alerts.', classification: 'confidential' as SecurityClassification, author: 'devops-01' },
      { id: 'CONF-003', title: 'Q3 Product Roadmap', space: 'PRODUCT', content: 'Key initiatives for Q3 include: 1) Multi-tenant isolation improvements, 2) Real-time analytics dashboard with sub-second query response, 3) Enterprise SSO integration supporting SAML 2.0 and OIDC providers. Expected completion by end of September.', classification: 'confidential' as SecurityClassification, author: 'pm-01' },
    ];

    return samplePages.map((page, idx) => ({
      chunk_id: this.generateChunkId(page.id, 0), document_id: page.id,
      tenant_id: this.config.tenantId, source_system: 'confluence' as SourceSystem,
      source_url: `https://wiki.example.com/spaces/${page.space}/pages/${page.id}`,
      document_title: page.title, author_id: page.author,
      last_updated_at: new Date(Date.now() - idx * 86400000).toISOString(),
      security_classification: page.classification, acl: this.createDefaultACL('tenant_internal'),
      content: page.content, canonical_tag: idx === 0,
    }));
  }
}
