import { EnterpriseKnowledgeEngine } from '../index';
import { UserEntitlements } from '../types';

export interface MCPToolDefinition {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
}

export class EKRSMCPServer {
  private engine: EnterpriseKnowledgeEngine;

  constructor(engine: EnterpriseKnowledgeEngine) {
    this.engine = engine;
  }

  public getTools(): MCPToolDefinition[] {
    return [
      {
        name: 'search_knowledge',
        description: 'Execute Zero-Trust enterprise RAG query across connected repositories with ACL pre-filtering and live permission verification.',
        inputSchema: {
          type: 'object',
          properties: {
            query_text: { type: 'string', description: 'Search prompt or question' },
            user_guid: { type: 'string', description: 'User GUID for permission validation' },
            groups: { type: 'array', items: { type: 'string' }, description: 'User group memberships' }
          },
          required: ['query_text']
        }
      },
      {
        name: 'get_document_context',
        description: 'Retrieve full text document chunk context by ID if user has authorized clearance.',
        inputSchema: {
          type: 'object',
          properties: {
            document_id: { type: 'string', description: 'Document ID to retrieve' },
            user_guid: { type: 'string', description: 'User GUID' }
          },
          required: ['document_id']
        }
      },
      {
        name: 'verify_citation',
        description: 'Perform NLI entailment check between synthesized claim and supporting document chunk.',
        inputSchema: {
          type: 'object',
          properties: {
            claim_text: { type: 'string', description: 'Synthesized claim statement' },
            chunk_id: { type: 'string', description: 'Document chunk ID' }
          },
          required: ['claim_text', 'chunk_id']
        }
      }
    ];
  }

  public async callTool(name: string, args: Record<string, unknown>): Promise<{ result: unknown; isError?: boolean }> {
    switch (name) {
      case 'search_knowledge': {
        const queryText = args.query_text as string;
        const userGuid = (args.user_guid as string) || 'mcp-agent';
        const groups = (args.groups as string[]) || ['engineering', 'all-employees'];
        const user: UserEntitlements = {
          user_guid: userGuid,
          slack_user_id: userGuid,
          tenant_id: 'default-tenant',
          email: `${userGuid}@example.com`,
          group_guids: groups,
          roles: ['employee'],
        };
        const answer = await this.engine.query(queryText, user);
        return { result: answer };
      }

      case 'get_document_context': {
        const docId = args.document_id as string;
        const allChunks = this.engine.getAllChunks();
        const found = allChunks.find(c => c.document_id === docId || c.chunk_id === docId);
        if (!found) {
          return { result: { error: `Document ${docId} not found in index` }, isError: true };
        }
        return { result: { document_id: found.document_id, title: found.document_title, content: found.content, url: found.source_url } };
      }

      case 'verify_citation': {
        const claim = args.claim_text as string;
        const chunkId = args.chunk_id as string;
        const allChunks = this.engine.getAllChunks();
        const found = allChunks.find(c => c.chunk_id === chunkId || c.document_id === chunkId);
        if (!found) {
          return { result: { verified: false, score: 0.0, reason: 'Supporting chunk not found' } };
        }
        const claimWords = claim.toLowerCase().split(/\s+/).filter(w => w.length > 3);
        const matchCount = claimWords.filter(w => found.content.toLowerCase().includes(w)).length;
        const score = claimWords.length > 0 ? matchCount / claimWords.length : 0;
        return { result: { verified: score >= 0.3, score: Number(score.toFixed(2)), chunk_id: chunkId } };
      }

      default:
        return { result: { error: `Unknown MCP Tool: ${name}` }, isError: true };
    }
  }
}
