# Architecture Deep Dive

This document provides a comprehensive technical walkthrough of the Enterprise Knowledge Assistant architecture.

## System Overview

The system follows a **pipeline architecture** where each stage transforms data and passes it to the next. The pipeline is:

```
Ingestion → Indexing → Retrieval → Grounding → Synthesis → Delivery
```

## Core Engine: `EnterpriseKnowledgeEngine`

The orchestrator class in `src/index.ts` is the single entry point for all operations.

### Responsibilities
- Connector registration and lifecycle management
- Document ingestion orchestration
- Query pipeline execution
- Audit logging coordination

### Key Properties
| Property | Type | Purpose |
|----------|------|--------|
| `sparseEngine` | `SparseSearchEngine` | BM25 keyword search |
| `vectorStore` | `VectorStore` | Dense semantic search |
| `retriever` | `HybridRetriever` | Fused retrieval |
| `generator` | `AnswerGenerator` | Answer synthesis |
| `permissionGate` | `LivePermissionGate` | Live ACL verification |
| `auditLedger` | `AuditLedger` | Event logging |
| `connectors` | `BaseConnector[]` | Data source adapters |

## Data Flow

### Ingestion Flow
1. Each registered connector's `fetchDocuments()` is called
2. Returned `DocumentChunk[]` arrays are concatenated
3. All chunks are indexed in both sparse (BM25) and dense (vector) stores
4. Ingestion stats are returned

### Query Flow
1. **Query creation**: Raw text → `RetrievalQuery` with user entitlements
2. **Sparse search**: BM25 scores top 50 candidates
3. **Dense search**: Vector similarity scores top 50 candidates (pre-filtered by ACL)
4. **RRF fusion**: Rankings merged with `1/(k + rank)` formula
5. **Authority weighting**: Canonical (1.25x) and source (1.1x for Confluence) boosts
6. **Temporal decay**: `e^(-0.005 * age_days)` applied
7. **Live ACL gate**: Top candidates verified against source APIs
8. **Grounding**: Answer claims verified against evidence chunks
9. **Abstention check**: Below confidence threshold → refuse to answer
10. **Citation building**: Top candidates formatted as source references

## Module Dependency Graph

```
types/index.ts  ←─── (everything depends on types)
    │
    ├── security/acl.ts
    │       │
    │       ├── security/livePermissionGate.ts
    │       │
    │       └── retrieval/vectorStore.ts
    │               │
    ├── retrieval/sparseSearch.ts
    │       │
    │       └── retrieval/hybridRetriever.ts
    │                   │
    ├── grounding/verifier.ts
    │       │
    │       └── synthesis/generator.ts
    │                   │
    ├── connectors/base.ts
    │       ├── connectors/confluence.ts
    │       ├── connectors/googleDrive.ts
    │       ├── connectors/zendesk.ts
    │       └── connectors/markdown.ts
    │
    ├── observability/auditLedger.ts
    │
    └── index.ts (orchestrates all)
```

## Type System

The type system in `src/types/index.ts` defines the data contracts:

- **`DocumentChunk`**: The atomic unit of knowledge — one piece of a document with full metadata and ACL
- **`UnifiedACL`**: Source-agnostic access control structure
- **`UserEntitlements`**: Everything known about a requesting user
- **`RetrievalQuery`**: Structured query with entitlements attached
- **`ScoredCandidate`**: A chunk with all scoring dimensions
- **`GroundedAnswer`**: Final answer with claims, citations, and confidence

## Design Decisions

### Why BM25 + Vector (not just embeddings)?
Pure vector search misses exact keyword matches that are critical in enterprise (error codes, product names, acronyms). BM25 catches these while vectors handle semantic similarity.

### Why RRF over learned fusion?
RRF requires no training data and works well out of the box. As the system matures, RRF can be replaced with a learned ranker without changing the interface.

### Why claim-level grounding?
Sentence-level verification catches partial hallucinations that document-level checks miss. If an answer has 5 claims and 1 is ungrounded, the system can flag it specifically.

### Why abstention?
In enterprise contexts, a wrong answer is worse than no answer. Abstention preserves user trust and provides clear signals for knowledge gap identification.
