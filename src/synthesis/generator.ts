import { ScoredCandidate, GroundedAnswer, ClaimEntailment } from '../types';
import { GroundingVerifier } from '../grounding/verifier';

export interface GeneratorConfig {
  confidenceThreshold?: number;
  maxCitations?: number;
  entailmentThreshold?: number;
}

export class AnswerGenerator {
  private verifier: GroundingVerifier;
  private confidenceThreshold: number;
  private maxCitations: number;

  constructor(config: GeneratorConfig = {}) {
    this.verifier = new GroundingVerifier({
      entailmentThreshold: config.entailmentThreshold ?? 0.65,
    });
    this.confidenceThreshold = config.confidenceThreshold ?? 0.4;
    this.maxCitations = config.maxCitations ?? 5;
  }

  public async generateAnswer(queryId: string, queryText: string, candidates: ScoredCandidate[]): Promise<GroundedAnswer> {
    if (candidates.length === 0) {
      return this.createAbstainedAnswer(queryId, 'No relevant documents found for this query after ACL filtering.');
    }

    const answerText = this.synthesize(queryText, candidates);
    const groundingResult = this.verifier.verifyClaims(answerText, candidates);

    if (groundingResult.overallGroundingScore < this.confidenceThreshold) {
      return this.createAbstainedAnswer(
        queryId,
        `The available evidence does not sufficiently support a confident answer. ` +
        `Grounding score: ${(groundingResult.overallGroundingScore * 100).toFixed(1)}% ` +
        `(threshold: ${(this.confidenceThreshold * 100).toFixed(1)}%)`
      );
    }

    const citations = this.buildCitations(candidates);
    return {
      query_id: queryId, answer_text: answerText, claims: groundingResult.claims,
      citations, confidence_score: groundingResult.overallGroundingScore,
      is_abstained: false,
    };
  }

  private synthesize(queryText: string, candidates: ScoredCandidate[]): string {
    const topCandidates = candidates.slice(0, 5);
    const context = topCandidates.map(c => c.chunk.content).join('\n\n');
    return `Based on the available documentation:\n\n${context}`;
  }

  private buildCitations(candidates: ScoredCandidate[]) {
    return candidates.slice(0, this.maxCitations).map((candidate, index) => ({
      citation_index: index + 1, chunk_id: candidate.chunk.chunk_id,
      document_title: candidate.chunk.document_title, source_system: candidate.chunk.source_system,
      source_url: candidate.chunk.source_url, last_updated_at: candidate.chunk.last_updated_at,
      excerpt: candidate.chunk.content.substring(0, 200),
    }));
  }

  private createAbstainedAnswer(queryId: string, reason: string): GroundedAnswer {
    return {
      query_id: queryId, answer_text: "I don't have enough verified information to answer this question confidently.",
      claims: [], citations: [], confidence_score: 0, is_abstained: true, abstention_reason: reason,
    };
  }
}
