<![CDATA[<div align="center">

# 🏢 Enterprise Knowledge Assistant

**Production-Grade Slack-Native RAG Engine with Zero-Trust ACL, Hybrid Retrieval, NLI Grounding & Autonomous QA Platform**

[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20+-green?logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Tests](https://img.shields.io/badge/Tests-17%20passing-brightgreen)](tests/)
[![Aegis-QA](https://img.shields.io/badge/Aegis--QA-Active-purple)](docs/AEGIS_QA.md)

<br/>

*An enterprise-grade knowledge retrieval engine that connects to your company's data sources (Confluence, Google Drive, Zendesk, and more), enforces Zero-Trust access controls at every layer, and delivers grounded, citation-backed answers directly inside Slack.*

</div>

---

## 📖 Table of Contents

- [Why This Exists](#-why-this-exists)
- [Architecture Overview](#-architecture-overview)
- [Key Features](#-key-features)
- [Quick Start](#-quick-start)
- [Project Structure](#-project-structure)
- [How It Works](#-how-it-works)
- [Configuration](#-configuration)
- [Connectors](#-connectors)
- [Security Model](#-security-model)
- [Retrieval Pipeline](#-retrieval-pipeline)
- [Grounding & Synthesis](#-grounding--synthesis)
- [Aegis-QA Platform](#-aegis-qa-platform)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [API Reference](#-api-reference)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 Why This Exists

Enterprise teams drown in scattered knowledge across Confluence, Google Drive, Zendesk, Slack, and dozens of internal tools. Existing search is broken:

- **Access controls leak**: Generic RAG systems don't enforce source-system permissions
- **Hallucinations are dangerous**: Ungrounded AI answers in enterprise contexts cause real damage
- **No auditability**: Compliance teams can't trace who accessed what
- **Stale answers**: Static indexes serve outdated information with no decay awareness

This engine solves all four problems with a production-hardened architecture designed for enterprise deployment.

---

## 🏗 Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                      SLACK INTERFACE                             │
│                    @assistant ask ...                             │
└──────────────┬──────────────────────────────────────────────────┘
               │
               ▼
┌──────────────────────────────────────────────────────────────────┐
│                 ENTERPRISE KNOWLEDGE ENGINE                       │
│  ┌─────────────┐  ┌──────────────┐  ┌───────────────────────┐   │
│  │  Connectors  │  │  ACL Layer   │  │  Observability        │   │
│  │  ─────────── │  │  ──────────  │  │  ─────────────────    │   │
│  │  Confluence  │  │  ACLEvaluator│  │  AuditLedger          │   │
│  │  GoogleDrive │  │  LivePermGate│  │  BenchmarkRunner      │   │
│  │  Zendesk     │  │              │  │                       │   │
│  │  Markdown    │  │              │  │                       │   │
│  └──────┬──────┘  └──────┬───────┘  └───────────────────────┘   │
│         │                │                                       │
│         ▼                ▼                                       │
│  ┌──────────────────────────────────────────────┐               │
│  │           HYBRID RETRIEVER (RRF)              │               │
│  │  ┌────────────────┐  ┌─────────────────────┐ │               │
│  │  │ Sparse BM25    │  │ Dense Vector Search │ │               │
│  │  │ (SparseSearch)  │  │  (VectorStore)      │ │               │
│  │  └────────────────┘  └─────────────────────┘ │               │
│  │         Reciprocal Rank Fusion + Decay        │               │
│  └──────────────────────┬────────────────────────┘               │
│                         │                                        │
│                         ▼                                        │
│  ┌─────────────────────────────────────────────┐                │
│  │        GROUNDING VERIFIER (NLI)              │                │
│  │  Claim Extraction → Entailment Scoring       │                │
│  └──────────────────────┬──────────────────────┘                │
│                         │                                        │
│                         ▼                                        │
│  ┌─────────────────────────────────────────────┐                │
│  │        ANSWER GENERATOR                      │                │
│  │  Synthesis → Confidence → Citations/Abstain  │                │
│  └──────────────────────────────────────────────┘                │
└──────────────────────────────────────────────────────────────────┘
               │
               ▼
┌──────────────────────────────────────────────────────────────────┐
│                     AEGIS-QA PLATFORM                             │
│  Property Invariants │ Mutation Testing │ Payload Fuzzing         │
│  Benchmark Runner    │ Regression Suite │ Quality Governance       │
└──────────────────────────────────────────────────────────────────┘
```

---

## ✨ Key Features

### 🔒 Zero-Trust Security
- **Dual-Layer ACL Enforcement**: Pre-filter + live source-API verification
- **Four Visibility Modes**: `public`, `tenant_internal`, `restricted_groups`, `explicit_users`
- **Deny-List Precedence**: Deny rules always override allow rules
- **Permission Caching**: TTL-based cache with bypass option

### 🔍 Hybrid Retrieval
- **Reciprocal Rank Fusion (RRF)**: Merges sparse (BM25) and dense (vector) search
- **Temporal Decay**: Exponential recency weighting for fresher documents
- **Authority Weighting**: Canonical documents boosted 25%
- **Source Authority**: Confluence pages boosted 10%

### ✅ Grounded Answers
- **Claim-Level Verification**: Every sentence checked against source evidence
- **Entailment Scoring**: Token-overlap NLI for claim verification
- **Intelligent Abstention**: Refuses to answer when evidence is insufficient
- **Full Citations**: Every answer includes traceable source references

### 🔌 Multi-Source Connectors
- Confluence, Google Drive, Zendesk (built-in)
- Extensible `BaseConnector` for custom sources
- Unified `DocumentChunk` schema across all sources

### 📊 Observability
- **Audit Ledger**: Every query, retrieval, and answer event logged
- **Benchmark Runner**: Automated evaluation scenarios
- **Full Trace IDs**: End-to-end query tracing

### 🛡 Aegis-QA Platform
- **Property-Based Testing**: Randomized security invariant verification
- **Mutation Testing**: Logical gate inversion to verify test strength
- **Payload Fuzzing**: Edge-case and adversarial input testing
- **Regression Prevention**: Every bug caught once, never escapes again

---

## 🚀 Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) 20+
- [npm](https://www.npmjs.com/) 9+

### Installation

```bash
# Clone the repository
git clone https://github.com/ParthVarekar/enterprise_knowledge_assistance.git
cd enterprise_knowledge_assistance

# Install dependencies
npm install

# Build the TypeScript project
npm run build
```

### Run the Demo

```bash
npm run demo
```

This will:
1. Initialize the engine with sample connectors (Confluence, Google Drive, Zendesk, Markdown)
2. Ingest documents from all sources
3. Run 4 demo queries with full ACL enforcement
4. Display answers with confidence scores, citations, and audit trail

### Run Tests

```bash
# Run all tests (unit + integration + QA)
npm test

# Run evaluation & QA tests only
npm run test:eval
```

---

## 📁 Project Structure

```
enterprise-knowledge-assistant/
├── src/
│   ├── index.ts                    # Engine orchestrator & public API
│   ├── demo.ts                     # Interactive demo script
│   ├── types/
│   │   └── index.ts                # Core type definitions (DocumentChunk, ACL, etc.)
│   ├── security/
│   │   ├── acl.ts                  # ACL evaluation engine
│   │   └── livePermissionGate.ts   # Live source-API permission verification
│   ├── retrieval/
│   │   ├── sparseSearch.ts         # BM25 sparse text search
│   │   ├── vectorStore.ts          # Dense vector similarity search
│   │   └── hybridRetriever.ts      # RRF fusion + temporal decay
│   ├── grounding/
│   │   └── verifier.ts             # NLI claim-level grounding verifier
│   ├── synthesis/
│   │   └── generator.ts            # Answer generator with abstention logic
│   ├── connectors/
│   │   ├── base.ts                 # Abstract connector base class
│   │   ├── confluence.ts           # Confluence connector
│   │   ├── googleDrive.ts          # Google Drive connector
│   │   ├── zendesk.ts              # Zendesk connector
│   │   └── markdown.ts             # Markdown/raw text connector
│   ├── observability/
│   │   └── auditLedger.ts          # Audit trail & event logging
│   ├── qa/
│   │   ├── propertyInvariants.ts   # Property-based security invariants
│   │   ├── mutationRunner.ts       # Mutation testing framework
│   │   ├── payloadFuzzer.ts        # Adversarial payload fuzzer
│   │   └── benchmarkRunner.ts      # Automated evaluation benchmark
│   └── slack/
│       └── server.ts               # Slack Bolt integration entry point
├── tests/
│   ├── unit.test.ts                # Unit tests (ACL, Search, Grounding, Audit)
│   ├── eval.test.ts                # End-to-end engine evaluation tests
│   └── aegisQA.test.ts             # Aegis-QA platform tests
├── docs/
│   ├── ARCHITECTURE.md             # Detailed architecture documentation
│   ├── SECURITY.md                 # Security model deep dive
│   ├── AEGIS_QA.md                 # QA platform documentation
│   ├── CONNECTORS.md               # Connector development guide
│   └── DEPLOYMENT.md               # Deployment & operations guide
├── package.json
├── tsconfig.json
├── vitest.config.ts
├── .gitignore
├── LICENSE
└── README.md
```

---

## ⚙ How It Works

### 1. Document Ingestion
Connectors pull documents from source systems and normalize them into `DocumentChunk` objects with unified ACLs, security classifications, and metadata.

### 2. Dual-Index Storage
Each chunk is indexed in both the **BM25 sparse index** (for keyword matching) and the **vector store** (for semantic similarity).

### 3. Query Processing
When a user asks a question:
1. **ACL Pre-Filter**: Candidates are filtered against the user's entitlements
2. **Hybrid Retrieval**: BM25 and vector results are fused via RRF
3. **Temporal Decay**: Recent documents are boosted exponentially
4. **Live ACL Gate**: Top candidates are verified against source-system APIs
5. **Grounding**: The synthesized answer is checked claim-by-claim against evidence
6. **Abstention/Answer**: If grounding is below threshold, the engine abstains

### 4. Audit
Every step is logged in the immutable audit ledger with trace IDs for compliance.

---

## 🔧 Configuration

```typescript
const engine = new EnterpriseKnowledgeEngine({
  tenantId: 'your-tenant-id',     // Multi-tenant isolation key
  confidenceThreshold: 0.4,       // Min grounding score to answer (0-1)
  maxCitations: 5,                // Max citations per answer
  entailmentThreshold: 0.65,      // Min token-overlap for claim verification
});
```

### Environment Variables (for Slack integration)

| Variable | Description | Required |
|----------|-------------|----------|
| `SLACK_BOT_TOKEN` | Slack Bot OAuth token | Yes (production) |
| `SLACK_SIGNING_SECRET` | Slack app signing secret | Yes (production) |
| `TENANT_ID` | Organization tenant identifier | Yes |

---

## 🔌 Connectors

### Built-in Connectors

| Connector | Source | Security Classification |
|-----------|--------|------------------------|
| `ConfluenceConnector` | Confluence Wiki | internal/confidential |
| `GoogleDriveConnector` | Google Drive | internal/restricted |
| `ZendeskConnector` | Zendesk Help Center | public |
| `MarkdownConnector` | Raw markdown/text | configurable |

### Creating Custom Connectors

```typescript
import { BaseConnector, ConnectorConfig } from './connectors/base';
import { DocumentChunk } from './types';

class NotionConnector extends BaseConnector {
  getSourceSystem() { return 'notion'; }

  async fetchDocuments(): Promise<DocumentChunk[]> {
    // 1. Call Notion API
    // 2. Convert to DocumentChunk format
    // 3. Map Notion permissions to UnifiedACL
    return chunks;
  }
}

// Register with the engine
engine.registerConnector(new NotionConnector({ name: 'notion', tenantId: 'acme' }));
```

See [docs/CONNECTORS.md](docs/CONNECTORS.md) for the complete connector development guide.

---

## 🔒 Security Model

The security model implements **defense-in-depth** with two independent layers:

### Layer 1: Static ACL Evaluation (`ACLEvaluator`)
Pre-filters all candidates against the user's groups and explicit permissions. Deny lists always take precedence over allow lists.

### Layer 2: Live Permission Gate (`LivePermissionGate`)
Verifies each top candidate against the source system's live API to catch permission changes since the last sync.

### Visibility Modes

| Mode | Behavior |
|------|----------|
| `public` | Anyone can access |
| `tenant_internal` | Any user in the same tenant |
| `restricted_groups` | Only members of specified groups |
| `explicit_users` | Only explicitly listed users |

See [docs/SECURITY.md](docs/SECURITY.md) for the complete security deep dive.

---

## 🔍 Retrieval Pipeline

### Reciprocal Rank Fusion (RRF)

The hybrid retriever combines sparse BM25 and dense vector rankings:

```
RRF(d) = 1/(k + rank_sparse(d)) + 1/(k + rank_dense(d))
```

Where `k=60` (default) controls rank sensitivity.

### Temporal Decay

```
decay(d) = e^(-λ · age_in_days)
```

Where `λ=0.005` (default) provides gradual recency preference.

### Final Score

```
final_score = normalized_rrf × authority_weight × temporal_decay
```

---

## ✅ Grounding & Synthesis

### Claim-Level Verification
The grounding verifier:
1. **Extracts claims** from the synthesized answer (sentence splitting)
2. **Scores each claim** against candidate chunks using token overlap
3. **Marks claims** as verified/unverified based on entailment threshold

### Intelligent Abstention
When the overall grounding score falls below the confidence threshold, the engine refuses to answer rather than risk providing ungrounded information.

---

## 🛡 Aegis-QA Platform

The autonomous quality engineering platform ensures long-term reliability:

### Property-Based Invariants
- **Security Symmetry**: Group members get access, non-members don't (200 random iterations)
- **Deny Precedence**: Deny list always overrides allow list
- **Public Visibility**: Public documents always accessible

### Mutation Testing
Three mutants that invert critical logical gates — the test suite must kill all three:
1. Invert deny check
2. Remove group membership check
3. Public visibility denies all

### Payload Fuzzing
- Empty ACL lists
- 1000-group membership explosion
- Unicode, emoji, SQL injection in user IDs
- Empty/nullish field handling

See [docs/AEGIS_QA.md](docs/AEGIS_QA.md) for the full QA platform documentation.

---

## 🧪 Testing

```bash
# Run all 17 tests
npm test

# Run with verbose output
npx vitest run --reporter=verbose

# Run specific test file
npx vitest run tests/unit.test.ts

# Run QA-only tests
npm run test:eval
```

### Test Coverage

| Suite | Tests | Coverage |
|-------|-------|----------|
| Unit (ACL, Search, Grounding, Audit) | 11 | Core logic |
| End-to-End Evaluation | 4 | Full pipeline |
| Aegis-QA (Invariants, Mutations, Fuzzing) | 5 | Security assurance |
| **Total** | **17+** | **All critical paths** |

---

## 🚢 Deployment

### Local Development
```bash
npm run demo    # Run interactive demo
npm run server  # Start Slack server (configure env vars first)
```

### Production Checklist
- [ ] Set `SLACK_BOT_TOKEN` and `SLACK_SIGNING_SECRET`
- [ ] Configure real connector API credentials
- [ ] Replace mock vector store with Qdrant/Pinecone/Weaviate
- [ ] Replace token-overlap NLI with transformer-based entailment model
- [ ] Set up monitoring dashboards for audit ledger
- [ ] Configure log rotation for audit records

See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for the complete deployment guide.

---

## 📚 API Reference

### `EnterpriseKnowledgeEngine`

```typescript
// Initialize
const engine = new EnterpriseKnowledgeEngine(config);

// Register data sources
engine.registerConnector(connector);

// Ingest all documents
const result = await engine.ingestAll();
// → { totalChunks: number, sources: string[] }

// Query with ACL enforcement
const answer = await engine.query(queryText, userEntitlements, domainFilters?);
// → GroundedAnswer { answer_text, claims, citations, confidence_score, is_abstained }

// Access audit trail
engine.getAuditLedger().query({ action: 'query', limit: 100 });
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please ensure all tests pass before submitting PRs:
```bash
npm test
```

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**Built with ❤️ by [Parth Varekar](https://github.com/ParthVarekar)**

*Enterprise Knowledge. Zero Trust. Grounded Truth.*

</div>
]]>
