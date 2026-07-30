import { DocumentChunk, UserEntitlements } from '../types';
import { ACLEvaluator } from '../security/acl';

export interface VectorSearchResult {
  chunk: DocumentChunk;
  similarityScore: number;
}

export class VectorStore {
  private chunks: DocumentChunk[] = [];

  public upsertChunks(chunks: DocumentChunk[]): void {
    const map = new Map(this.chunks.map(c => [c.chunk_id, c]));
    for (const chunk of chunks) {
      if (!chunk.vector) chunk.vector = this.generateMockVector(chunk.content);
      map.set(chunk.chunk_id, chunk);
    }
    this.chunks = Array.from(map.values());
  }

  public search(queryText: string, queryVector: number[] | undefined, user: UserEntitlements, topK: number = 20): VectorSearchResult[] {
    const qVec = queryVector || this.generateMockVector(queryText);
    const results: VectorSearchResult[] = [];
    for (const chunk of this.chunks) {
      if (!ACLEvaluator.evaluate(user, chunk.acl)) continue;
      const cVec = chunk.vector || this.generateMockVector(chunk.content);
      const similarity = this.cosineSimilarity(qVec, cVec);
      results.push({ chunk, similarityScore: similarity });
    }
    return results.sort((a, b) => b.similarityScore - a.similarityScore).slice(0, topK);
  }

  private cosineSimilarity(a: number[], b: number[]): number {
    let dot = 0, normA = 0, normB = 0;
    const len = Math.min(a.length, b.length);
    for (let i = 0; i < len; i++) {
      dot += a[i] * b[i];
      normA += a[i] * a[i];
      normB += b[i] * b[i];
    }
    if (normA === 0 || normB === 0) return 0;
    return dot / (Math.sqrt(normA) * Math.sqrt(normB));
  }

  public generateMockVector(text: string, dims: number = 128): number[] {
    const vec: number[] = new Array(dims).fill(0);
    const words = text.toLowerCase().split(/\s+/);
    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      for (let j = 0; j < word.length; j++) {
        const charCode = word.charCodeAt(j);
        const idx = (i * 7 + j * 13 + charCode) % dims;
        vec[idx] += charCode / 255;
      }
    }
    const mag = Math.sqrt(vec.reduce((sum, v) => sum + v * v, 0)) || 1;
    return vec.map(v => v / mag);
  }
}
