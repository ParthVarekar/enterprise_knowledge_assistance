import { DocumentChunk, UserEntitlements } from '../types';
import { ACLEvaluator } from './acl';

export interface LiveVerificationOptions {
  bypassCache?: boolean;
  ttlSeconds?: number;
}

export class LivePermissionGate {
  private permissionCache: Map<string, { allowed: boolean; timestamp: number }> = new Map();
  private defaultTTLMs: number = 300 * 1000;

  public async verifyCandidates(
    candidates: DocumentChunk[],
    user: UserEntitlements,
    options: LiveVerificationOptions = {}
  ): Promise<DocumentChunk[]> {
    const verified: DocumentChunk[] = [];
    const ttl = (options.ttlSeconds ?? 300) * 1000;
    for (const chunk of candidates) {
      const cacheKey = `${user.user_guid}:${chunk.document_id}:${chunk.acl.acl_hash}`;
      if (!options.bypassCache && this.permissionCache.has(cacheKey)) {
        const cached = this.permissionCache.get(cacheKey)!;
        if (Date.now() - cached.timestamp < ttl) {
          if (cached.allowed) verified.push(chunk);
          continue;
        }
      }
      const staticPassed = ACLEvaluator.evaluate(user, chunk.acl);
      if (!staticPassed) {
        this.permissionCache.set(cacheKey, { allowed: false, timestamp: Date.now() });
        continue;
      }
      const liveAllowed = await this.performSourceAPICheck(chunk, user);
      this.permissionCache.set(cacheKey, { allowed: liveAllowed, timestamp: Date.now() });
      if (liveAllowed) verified.push(chunk);
    }
    return verified;
  }

  private async performSourceAPICheck(chunk: DocumentChunk, user: UserEntitlements): Promise<boolean> {
    if (chunk.security_classification === 'restricted') {
      return ACLEvaluator.evaluate(user, chunk.acl);
    }
    return true;
  }
}
