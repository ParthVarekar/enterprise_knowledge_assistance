import { DocumentChunk, UserEntitlements } from '../types';
import { ACLEvaluator } from './acl';
import { ConnectorRegistry } from '../connectors/registry';
import { AuditLedger } from '../observability/auditLedger';

export interface LiveVerificationOptions {
  bypassCache?: boolean;
  ttlSeconds?: number;
  auditLedger?: AuditLedger;
}

export class LivePermissionGate {
  private permissionCache: Map<string, { allowed: boolean; timestamp: number }> = new Map();
  private auditLedger?: AuditLedger;

  constructor(auditLedger?: AuditLedger) {
    this.auditLedger = auditLedger;
  }

  public async verifyCandidates(
    candidates: DocumentChunk[],
    user: UserEntitlements,
    options: LiveVerificationOptions = {}
  ): Promise<DocumentChunk[]> {
    const ttl = (options.ttlSeconds ?? 300) * 1000;
    const activeLedger = options.auditLedger || this.auditLedger;

    // Execute async parallel permission verification for top-K candidates
    const verificationPromises = candidates.map(async (chunk) => {
      const cacheKey = `${user.user_guid}:${chunk.document_id}:${chunk.acl.acl_hash}`;

      if (!options.bypassCache && this.permissionCache.has(cacheKey)) {
        const cached = this.permissionCache.get(cacheKey)!;
        if (Date.now() - cached.timestamp < ttl) {
          return { chunk, allowed: cached.allowed };
        }
      }

      // Static pre-filter check
      const staticPassed = ACLEvaluator.evaluate(user, chunk.acl);
      if (!staticPassed) {
        this.permissionCache.set(cacheKey, { allowed: false, timestamp: Date.now() });
        activeLedger?.log({
          timestamp: new Date().toISOString(),
          action: 'acl_deny',
          actor: user.email || user.user_guid,
          tenant_id: user.tenant_id,
          details: { document_id: chunk.document_id, reason: 'Static ACL Evaluation Failed' }
        });
        return { chunk, allowed: false };
      }

      // Live connector API check
      const liveAllowed = await this.performSourceAPICheck(chunk, user);
      this.permissionCache.set(cacheKey, { allowed: liveAllowed, timestamp: Date.now() });

      if (!liveAllowed) {
        activeLedger?.log({
          timestamp: new Date().toISOString(),
          action: 'acl_deny',
          actor: user.email || user.user_guid,
          tenant_id: user.tenant_id,
          details: { document_id: chunk.document_id, reason: 'Live Connector Permission Denied' }
        });
      }

      return { chunk, allowed: liveAllowed };
    });

    const results = await Promise.all(verificationPromises);
    return results.filter(r => r.allowed).map(r => r.chunk);
  }

  private async performSourceAPICheck(chunk: DocumentChunk, user: UserEntitlements): Promise<boolean> {
    const connector = ConnectorRegistry.getInstance().get(chunk.source_system);
    if (connector) {
      try {
        return await connector.getLivePermission(chunk.document_id, user.user_guid);
      } catch (e) {
        // Fallback to static ACL on API error
        return ACLEvaluator.evaluate(user, chunk.acl);
      }
    }

    if (chunk.security_classification === 'restricted') {
      return ACLEvaluator.evaluate(user, chunk.acl);
    }
    return true;
  }
}
