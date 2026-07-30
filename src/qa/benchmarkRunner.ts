import { EnterpriseKnowledgeEngine } from '../index';
import { UserEntitlements } from '../types';

export interface BenchmarkScenario {
  name: string;
  queryText: string;
  user: UserEntitlements;
  expectedBehavior: 'answer' | 'abstain';
  expectedMinConfidence?: number;
  mustCiteSources?: string[];
}

export interface BenchmarkResult {
  scenario: string;
  passed: boolean;
  details: string;
  latencyMs: number;
  confidence: number;
}

export class BenchmarkRunner {
  private engine: EnterpriseKnowledgeEngine;

  constructor(engine: EnterpriseKnowledgeEngine) {
    this.engine = engine;
  }

  public async runScenarios(scenarios: BenchmarkScenario[]): Promise<BenchmarkResult[]> {
    const results: BenchmarkResult[] = [];
    for (const scenario of scenarios) {
      const start = performance.now();
      try {
        const answer = await this.engine.query(scenario.queryText, scenario.user);
        const latencyMs = performance.now() - start;

        let passed = true;
        const details: string[] = [];

        if (scenario.expectedBehavior === 'abstain' && !answer.is_abstained) {
          passed = false;
          details.push('Expected abstention but got an answer');
        }
        if (scenario.expectedBehavior === 'answer' && answer.is_abstained) {
          passed = false;
          details.push('Expected an answer but got abstention');
        }
        if (scenario.expectedMinConfidence !== undefined && answer.confidence_score < scenario.expectedMinConfidence) {
          passed = false;
          details.push(`Confidence ${answer.confidence_score.toFixed(3)} below threshold ${scenario.expectedMinConfidence}`);
        }

        results.push({
          scenario: scenario.name, passed, details: details.join('; ') || 'All checks passed',
          latencyMs, confidence: answer.confidence_score,
        });
      } catch (e: any) {
        results.push({
          scenario: scenario.name, passed: false, details: `Exception: ${e.message}`,
          latencyMs: performance.now() - start, confidence: 0,
        });
      }
    }
    return results;
  }
}
