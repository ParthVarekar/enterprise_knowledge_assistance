# Connector Development Guide

This guide explains how to build custom connectors to integrate new data sources with the Enterprise Knowledge Assistant.

## Architecture

All connectors extend the `BaseConnector` abstract class, which provides:
- Standard configuration via `ConnectorConfig`
- Chunk ID generation
- Default ACL creation
- ACL hashing

## Creating a New Connector

### Step 1: Extend BaseConnector

```typescript
import { BaseConnector, ConnectorConfig } from './base';
import { DocumentChunk, SourceSystem } from '../types';

export interface MyConnectorConfig extends ConnectorConfig {
  customSetting?: string;
}

export class MyConnector extends BaseConnector {
  constructor(config: MyConnectorConfig) {
    super(config);
  }

  getSourceSystem(): string {
    return 'my_source';
  }

  async fetchDocuments(): Promise<DocumentChunk[]> {
    // 1. Call your source API
    // 2. Convert responses to DocumentChunk[]
    // 3. Map source permissions to UnifiedACL
    return chunks;
  }
}
```

### Step 2: Map Permissions

The most critical part of connector development is correctly mapping source system permissions to the `UnifiedACL` schema:

```typescript
// Example: Notion permissions → UnifiedACL
function mapNotionPermissions(page: NotionPage): UnifiedACL {
  if (page.sharing === 'workspace') {
    return this.createDefaultACL('tenant_internal');
  }

  return {
    allowed_users: page.permissions
      .filter(p => p.type === 'user')
      .map(p => p.user_id),
    allowed_groups: page.permissions
      .filter(p => p.type === 'group')
      .map(p => p.group_id),
    denied_users: [],
    denied_groups: [],
    visibility: 'restricted_groups',
    acl_hash: this.hashACL('restricted_groups', allowedUsers, allowedGroups),
  };
}
```

### Step 3: Register with Engine

```typescript
const engine = new EnterpriseKnowledgeEngine({ tenantId: 'my-tenant' });
engine.registerConnector(new MyConnector({
  name: 'my-source',
  tenantId: 'my-tenant',
  apiKey: process.env.MY_API_KEY,
}));
await engine.ingestAll();
```

## Built-in Connectors

### ConfluenceConnector
- Maps Confluence spaces and pages
- Supports space-key filtering
- Marks architectural docs as `canonical_tag: true`

### GoogleDriveConnector
- Maps Google Drive files and folders
- Handles restricted documents with `explicit_users` visibility
- Maps file-level sharing to `UnifiedACL`

### ZendeskConnector
- Maps Zendesk Help Center articles
- All articles default to `public` visibility
- Supports category-based filtering

### MarkdownConnector
- Ingests raw markdown/text documents
- Useful for internal docs, README files, runbooks
- Supports dynamic document addition via `addDocument()`

## Best Practices

1. **Always map permissions accurately** — an ACL mismatch is a security vulnerability
2. **Set security classification correctly** — this affects Live Permission Gate behavior
3. **Chunk large documents** — split documents >2000 tokens into overlapping chunks
4. **Preserve source URLs** — users need to click through to the original
5. **Set `last_updated_at` accurately** — this affects temporal decay scoring
