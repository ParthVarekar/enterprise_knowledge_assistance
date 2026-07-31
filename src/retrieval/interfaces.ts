import { DocumentChunk, UserEntitlements } from '../types';

export interface IVectorStore {
  upsert(chunks: DocumentChunk[]): Promise<void>;
  query(vector: number[], topK: number, filters?: Record<string, unknown>): Promise<{ chunk: DocumentChunk; similarityScore: number }[]>;
  search(queryText: string, vector?: number[], entitlements?: UserEntitlements, topK?: number): { chunk: DocumentChunk; similarityScore: number }[];
  deleteBySource(sourceSystem: string): Promise<number>;
  count(): number;
}

export interface ISparseSearch {
  indexDocument(chunk: DocumentChunk): void;
  search(queryText: string, topK?: number): { chunk: DocumentChunk; score: number }[];
  deleteBySource(sourceSystem: string): void;
  clear(): void;
}

export interface ILlmClient {
  generateCompletion(prompt: string, options?: Record<string, unknown>): Promise<string>;
  embedQuery(text: string): Promise<number[]>;
}
