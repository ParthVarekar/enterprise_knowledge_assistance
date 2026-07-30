import { ScoredCandidate, ClaimEntailment } from '../types';

export interface GroundingResult {
  claims: ClaimEntailment[];
  overallGroundingScore: number;
  unverifiedClaims: string[];
}

export class GroundingVerifier {
  private entailmentThreshold: number;

  constructor(options: { entailmentThreshold?: number } = {}) {
    this.entailmentThreshold = options.entailmentThreshold ?? 0.65;
  }

  public verifyClaims(answerText: string, candidates: ScoredCandidate[]): GroundingResult {
    const claims = this.extractClaims(answerText);
    const verifiedClaims: ClaimEntailment[] = [];
    const unverifiedClaims: string[] = [];

    for (const claim of claims) {
      const matchResult = this.findBestEvidence(claim, candidates);
      if (matchResult.score >= this.entailmentThreshold) {
        verifiedClaims.push({
          claim_sentence: claim, supporting_chunk_ids: matchResult.chunkIds,
          entailment_score: matchResult.score, is_verified: true,
        });
      } else {
        unverifiedClaims.push(claim);
        verifiedClaims.push({
          claim_sentence: claim, supporting_chunk_ids: [],
          entailment_score: matchResult.score, is_verified: false,
        });
      }
    }

    const totalScore = verifiedClaims.reduce((sum, c) => sum + c.entailment_score, 0);
    const overallGroundingScore = verifiedClaims.length > 0 ? totalScore / verifiedClaims.length : 0;

    return { claims: verifiedClaims, overallGroundingScore, unverifiedClaims };
  }

  private extractClaims(text: string): string[] {
    const preamblePatterns = [
      'based on', 'here is', 'here are', 'according to', 'in summary',
      'the following', 'to answer your', 'regarding the', 'for your query'
    ];
    return text
      .split(/[.!?\n]+/)
      .map(s => s.trim())
      .filter(s => {
        if (s.length <= 15) return false;
        const lower = s.toLowerCase();
        return !preamblePatterns.some(pat => lower.startsWith(pat));
      });
  }

  private findBestEvidence(claim: string, candidates: ScoredCandidate[]): { score: number; chunkIds: string[] } {
    const claimTokens = new Set(claim.toLowerCase().replace(/[^\w\s]/g, ' ').split(/\s+/).filter(t => t.length > 2));
    let bestScore = 0;
    const supportingChunks: string[] = [];

    for (const candidate of candidates) {
      const chunkTokens = new Set(
        candidate.chunk.content.toLowerCase().replace(/[^\w\s]/g, ' ').split(/\s+/).filter(t => t.length > 2)
      );
      let overlap = 0;
      for (const token of claimTokens) {
        if (chunkTokens.has(token)) overlap++;
      }
      const score = claimTokens.size > 0 ? overlap / claimTokens.size : 0;
      if (score > bestScore) bestScore = score;
      if (score >= Math.min(0.25, this.entailmentThreshold)) {
        supportingChunks.push(candidate.chunk.chunk_id);
      }
    }

    return { score: bestScore, chunkIds: supportingChunks };
  }
}
