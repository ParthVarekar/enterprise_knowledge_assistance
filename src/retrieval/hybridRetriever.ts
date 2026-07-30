import { DocumentChunk, RetrievalQuery, ScoredCandidate } from '../types';
import { SparseSearchEngine } from './sparseSearch';
import { VectorStore } from './vectorStore';
import { LivePermissionGate } from '../security/livePermissionGate';

export interface HybridRetrieverOptions {
  rrfK?: number;
  decayLambda?: number;
  topKCandidates?: number;
}

export class HybridRetriever {
  private sparseSearch: SparseSearchEngine;
  private vectorStore: VectorStore;
  private permissionGate: LivePermissionGate;

  constructor(sparseSearch: SparseSearchEngine, vectorStore: VectorStore, permissionGate: LivePermissionGate) {
    this.sparseSearch = sparseSearch;
    this.vectorStore = vectorStore;
    this.permissionGate = permissionGate;
  }

  public async retrieve(query: RetrievalQuery, options: HybridRetrieverOptions = {}): Promise<ScoredCandidate[]> {
    const rrfK = options.rrfK ?? 60;
    const decayLambda = options.decayLambda ?? 0.005;
    const candidateLimit = options.topKCandidates ?? 20;

    const sparseResults = this.sparseSearch.search(query.raw_text, 50);
    const vectorResults = this.vectorStore.search(query.raw_text, undefined, query.user_entitlements, 50);

    const candidateMap = new Map<string, { chunk: DocumentChunk; sparseRank?: number; denseRank?: number; sparseScore: number; denseScore: number; }>();

    sparseResults.forEach((res, index) => {
      candidateMap.set(res.chunk.chunk_id, { chunk: res.chunk, sparseRank: index + 1, sparseScore: res.score, denseScore: 0 });
    });

    vectorResults.forEach((res, index) => {
      const existing = candidateMap.get(res.chunk.chunk_id);
      if (existing) {
        existing.denseRank = index + 1;
        existing.denseScore = res.similarityScore;
      } else {
        candidateMap.set(res.chunk.chunk_id, { chunk: res.chunk, denseRank: index + 1, sparseScore: 0, denseScore: res.similarityScore });
      }
    });

    const scoredCandidates: ScoredCandidate[] = [];
    const nowMs = Date.now();
    const maxPossibleRRF = 2 / (rrfK + 1);

    for (const item of candidateMap.values()) {
      const rrfSparse = item.sparseRank ? 1 / (rrfK + item.sparseRank) : 0;
      const rrfDense = item.denseRank ? 1 / (rrfK + item.denseRank) : 0;
      const rawRRF = rrfSparse + rrfDense;
      const normalizedRRF = Math.min(1.0, rawRRF / maxPossibleRRF);

      let authorityWeight = 1.0;
      if (item.chunk.canonical_tag) authorityWeight = 1.25;
      else if (item.chunk.source_system === 'confluence') authorityWeight = 1.1;

      const updatedMs = new Date(item.chunk.last_updated_at).getTime();
      const ageInDays = Math.max(0, (nowMs - updatedMs) / (1000 * 60 * 60 * 24));
      const temporalDecay = Math.exp(-decayLambda * ageInDays);
      const finalScore = normalizedRRF * authorityWeight * temporalDecay;

      scoredCandidates.push({
        chunk: item.chunk, sparse_score: item.sparseScore, dense_score: item.denseScore,
        rrf_score: normalizedRRF, rerank_score: normalizedRRF * authorityWeight,
        final_score: finalScore, live_acl_verified: false,
      });
    }

    scoredCandidates.sort((a, b) => b.final_score - a.final_score);
    const topCandidates = scoredCandidates.slice(0, candidateLimit * 2);
    const chunksToVerify = topCandidates.map(c => c.chunk);
    const verifiedChunks = await this.permissionGate.verifyCandidates(chunksToVerify, query.user_entitlements);
    const verifiedChunkIds = new Set(verifiedChunks.map(c => c.chunk_id));

    return topCandidates
      .filter(c => verifiedChunkIds.has(c.chunk.chunk_id))
      .map(c => ({ ...c, live_acl_verified: true }))
      .slice(0, candidateLimit);
  }
}
