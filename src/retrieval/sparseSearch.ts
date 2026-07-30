import { DocumentChunk } from '../types';

export interface BM25SearchResult {
  chunk: DocumentChunk;
  score: number;
}

export class SparseSearchEngine {
  private chunks: DocumentChunk[] = [];
  private k1: number = 1.2;
  private b: number = 0.75;
  private avgDocLength: number = 0;
  private docLengths: Map<string, number> = new Map();
  private docTermFreqs: Map<string, Map<string, number>> = new Map();
  private docFreqs: Map<string, number> = new Map();

  public indexDocuments(chunks: DocumentChunk[]): void {
    this.chunks = chunks;
    this.docLengths.clear();
    this.docTermFreqs.clear();
    this.docFreqs.clear();
    let totalLength = 0;
    for (const chunk of chunks) {
      const tokens = this.tokenize(chunk.content + ' ' + chunk.document_title);
      const docLen = tokens.length;
      this.docLengths.set(chunk.chunk_id, docLen);
      totalLength += docLen;
      const termFreqs = new Map<string, number>();
      for (const token of tokens) {
        termFreqs.set(token, (termFreqs.get(token) || 0) + 1);
      }
      this.docTermFreqs.set(chunk.chunk_id, termFreqs);
      for (const token of termFreqs.keys()) {
        this.docFreqs.set(token, (this.docFreqs.get(token) || 0) + 1);
      }
    }
    this.avgDocLength = chunks.length > 0 ? totalLength / chunks.length : 1;
  }

  public search(query: string, topK: number = 20): BM25SearchResult[] {
    const queryTokens = this.tokenize(query);
    const N = this.chunks.length;
    const scores = new Map<string, number>();
    for (const chunk of this.chunks) {
      let score = 0;
      const docLen = this.docLengths.get(chunk.chunk_id) || 1;
      const termFreqs = this.docTermFreqs.get(chunk.chunk_id) || new Map();
      for (const token of queryTokens) {
        if (!termFreqs.has(token)) continue;
        const tf = termFreqs.get(token)!;
        const df = this.docFreqs.get(token) || 0;
        const idf = Math.log((N - df + 0.5) / (df + 0.5) + 1);
        const numerator = tf * (this.k1 + 1);
        const denominator = tf + this.k1 * (1 - this.b + (this.b * docLen) / this.avgDocLength);
        score += idf * (numerator / denominator);
      }
      if (score > 0) scores.set(chunk.chunk_id, score);
    }
    const sorted = Array.from(scores.entries()).sort((a, b) => b[1] - a[1]).slice(0, topK);
    const chunkMap = new Map(this.chunks.map(c => [c.chunk_id, c]));
    return sorted.map(([chunkId, score]) => ({ chunk: chunkMap.get(chunkId)!, score }));
  }

  private tokenize(text: string): string[] {
    return text.toLowerCase().replace(/[^\w\s-]/g, ' ').split(/\s+/).filter(t => t.length > 1);
  }
}
