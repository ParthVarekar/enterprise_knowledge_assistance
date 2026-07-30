import { EnterpriseKnowledgeEngine } from '../index';
import { UserEntitlements } from '../types';

export interface EKRSRouterConfig {
  engine: EnterpriseKnowledgeEngine;
}

/**
 * Framework-Agnostic Request Handler for EKRS Backend Integration.
 * Compatible with Express.js, Fastify, Next.js API Routes, or Node.js http server.
 */
export class EKRSRouter {
  private engine: EnterpriseKnowledgeEngine;

  constructor(config: EKRSRouterConfig) {
    this.engine = config.engine;
  }

  /**
   * Handle incoming API requests dynamically.
   */
  public async handleRequest(path: string, method: string, body: any): Promise<{ status: number; payload: any }> {
    const cleanPath = path.replace(/^\/api\/ekrs/, '');

    switch (cleanPath) {
      case '/query':
      case '/query/': {
        if (method !== 'POST') return { status: 405, payload: { error: 'Method Not Allowed' } };
        const { query_text, user } = body || {};
        if (!query_text || !user) {
          return { status: 400, payload: { error: 'Missing required parameters: query_text and user' } };
        }
        const answer = await this.engine.query(query_text, user as UserEntitlements);
        return { status: 200, payload: answer };
      }

      case '/chunks':
      case '/chunks/': {
        return { status: 200, payload: { totalChunks: this.engine.getAllChunks().length, chunks: this.engine.getAllChunks() } };
      }

      case '/audit':
      case '/audit/': {
        return { status: 200, payload: { count: this.engine.getAuditLedger().getRecordCount(), records: this.engine.getAuditLedger().getRecords() } };
      }

      case '/health':
      case '/health/': {
        return {
          status: 200,
          payload: {
            status: 'operational',
            system: 'EKRS Zero-Trust Retrieval Engine',
            version: '2.4.0',
            indexedChunks: this.engine.getAllChunks().length,
          }
        };
      }

      default:
        return { status: 404, payload: { error: `EKRS Endpoint Not Found: ${path}` } };
    }
  }
}

/**
 * Helper function to instantiate EKRS router.
 */
export function createEKRSRouter(engine: EnterpriseKnowledgeEngine): EKRSRouter {
  return new EKRSRouter({ engine });
}
