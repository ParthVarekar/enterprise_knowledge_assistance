# Aegis-QA Platform

Aegis-QA is the autonomous quality engineering platform embedded within the Enterprise Knowledge Assistant. Its purpose is to ensure that the product can evolve for years without quality degradation.

## Philosophy

> Every bug discovered once should almost never escape again.

The platform treats testing as a first-class subsystem — not an afterthought. It automatically expands and evolves as the codebase changes.

## Components

### 1. Property-Based Invariants (`propertyInvariants.ts`)

Property-based testing generates random inputs and verifies that critical properties always hold.

#### Security Symmetry Invariant
- **What**: If a user is a member of a group in `allowed_groups`, they MUST get access. If they're not a member, they MUST be denied.
- **How**: Generates 200 random group/user combinations and verifies access decisions.
- **Why**: Catches off-by-one errors, boundary conditions, and logical inversions.

#### Deny List Precedence Invariant
- **What**: If a user is in both `allowed_users` and `denied_users`, deny MUST win.
- **How**: Creates 50 scenarios with conflicting allow/deny rules.
- **Why**: Ensures the critical security property that deny always overrides allow.

#### Public Visibility Invariant
- **What**: Public documents must be accessible to ANY user, regardless of groups.
- **How**: Tests 50 random users with empty group memberships.
- **Why**: Prevents regressions where public documents become inaccessible.

### 2. Mutation Testing (`mutationRunner.ts`)

Mutation testing verifies that the test suite actually catches bugs. It simulates "mutants" — logical inversions of critical code paths — and checks that tests detect them.

#### Mutants

| Mutant | What It Simulates | Detection Method |
|--------|-------------------|------------------|
| Invert Deny Check | `!denied_users.includes(user)` instead of `includes` | Denied user should NOT get access |
| Remove Group Check | Group membership always returns `true` | Outsider should be denied |
| Public Denies All | `public` returns `false` instead of `true` | Public doc should be accessible |

**Target**: 100% mutation kill rate. All 3 mutants must be killed.

### 3. Payload Fuzzing (`payloadFuzzer.ts`)

Fuzzing tests the system's resilience to adversarial, edge-case, and malformed inputs.

#### Test Cases

| Test | Input | Expected Behavior |
|------|-------|-------------------|
| Empty ACL Lists | No allowed users/groups, restricted visibility | Deny access |
| Oversized Groups | 1000 groups in allowed_groups | Handle without crash, grant to member |
| Special Characters | `<script>`, SQL injection, Unicode, emoji in user IDs | Handle without crash |
| Nullish Fields | Empty strings for all user fields, public visibility | Grant access (public) |

### 4. Benchmark Runner (`benchmarkRunner.ts`)

The benchmark runner executes predefined query scenarios and validates:
- Whether the engine answers or abstains as expected
- Confidence scores meet minimum thresholds
- Correct sources are cited
- Response latency is within bounds

## Running Aegis-QA

```bash
# Run all QA tests
npm test

# Run QA-specific tests only
npm run test:eval

# Run with verbose output
npx vitest run tests/aegisQA.test.ts --reporter=verbose
```

## Adding New Invariants

To add a new property invariant:

1. Add a static method to `PropertyInvariants` class
2. Generate random inputs that exercise the property
3. Assert the property holds for all inputs
4. Add a test case in `tests/aegisQA.test.ts`

## Quality Metrics

| Metric | Current | Target |
|--------|---------|--------|
| Property Invariant Pass Rate | 100% | 100% |
| Mutation Kill Rate | 100% (3/3) | 100% |
| Fuzz Test Pass Rate | 100% (4/4) | 100% |
| Total Test Count | 17+ | Growing |
