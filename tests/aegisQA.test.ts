import { describe, it, expect } from 'vitest';
import { PropertyInvariants } from '../src/qa/propertyInvariants';
import { MutationRunner } from '../src/qa/mutationRunner';
import { PayloadFuzzer } from '../src/qa/payloadFuzzer';

describe('Aegis-QA: Property Invariants', () => {
  it('should pass security symmetry invariant', () => {
    const result = PropertyInvariants.securitySymmetryInvariant(200);
    expect(result.passed).toBe(true);
    expect(result.failures).toHaveLength(0);
  });

  it('should pass deny list precedence invariant', () => {
    const result = PropertyInvariants.denyListPrecedenceInvariant(100);
    expect(result.passed).toBe(true);
  });

  it('should pass public visibility invariant', () => {
    const result = PropertyInvariants.publicVisibilityInvariant(100);
    expect(result.passed).toBe(true);
  });
});

describe('Aegis-QA: Mutation Testing', () => {
  it('should kill all mutants', () => {
    const results = MutationRunner.runAllMutations();
    for (const result of results) {
      expect(result.killed).toBe(true);
    }
  });
});

describe('Aegis-QA: Payload Fuzzing', () => {
  it('should pass all fuzz tests', () => {
    const results = PayloadFuzzer.runAll();
    for (const result of results) {
      expect(result.passed).toBe(true);
    }
  });
});
