<div align="center">

# 🏢 Enterprise Knowledge Assistant

**Production-Grade Zero-Trust RAG Platform with Hybrid Retrieval, NLI Grounding, Aegis-QA & Local Llama.cpp CUDA Acceleration**

[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20+-green?logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18.3-cyan?logo=react&logoColor=white)](https://react.dev/)
[![llama.cpp](https://img.shields.io/badge/llama.cpp-CUDA--Accelerated-orange)](docs/LLAMA_CPP_INTEGRATION.md)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Tests](https://img.shields.io/badge/Tests-20%20passing-brightgreen)](tests/)

<br/>

*An autonomous, security-first enterprise knowledge retrieval engine that integrates with your data connectors (Confluence, Google Drive, Zendesk, Slack), enforces Zero-Trust access control lists (ACL) at every layer, synthesizes grounded answers locally using llama.cpp (`qwen2.5-coder-7b.gguf`), and provides a modern dark-mode web interface.*

</div>

---

## 📖 Table of Contents

- [Architectural Philosophy](#-architectural-philosophy)
- [System Architecture](#-system-architecture)
- [🦙 Llama.cpp Local Model Setup (`D:\llama4`)](#-llamacpp-local-model-setup-dllama4)
- [✨ Web Application Frontend](#-web-application-frontend)
- [🚀 Quick Start Guide](#-quick-start-guide)
- [🔒 Zero-Trust Security Model](#-zero-trust-security-model)
- [🔍 Hybrid RAG Mathematics](#-hybrid-rag-mathematics)
- [✅ NLI Grounding & Intelligent Abstention](#-nli-grounding--intelligent-abstention)
- [🛡 Aegis-QA Platform](#-aegis-qa-platform)
- [📁 Project Directory Structure](#-project-directory-structure)
- [📚 API Reference](#-api-reference)
- [📄 License & Author](#-license--author)

---

## 🎯 Architectural Philosophy

Enterprise knowledge retrieval fails when security, precision, and verifiability are neglected:

1. **Zero-Trust Permission Enforcement**: Generic RAG pipelines leak confidential data. Our engine enforces static ACL evaluation plus live source-API re-verification. **Deny lists always override allow lists**.
2. **Hybrid Rank Fusion (BM25 + Dense Vector)**: Pure vector search misses exact error codes and acronyms. BM25 catches keywords while vectors handle semantic intent.
3. **Local LLM Privacy via llama.cpp**: Powered by `llama-server.exe` running `qwen2.5-coder-7b.gguf` locally with GPU acceleration. No data leaves your infrastructure.
4. **Autonomous Aegis-QA Engine**: Property-based invariants, mutation testing (logical gate inversion), and payload fuzzing ensure zero regressions over time.

---

## 🏗 System Architecture

```
                                  SLACK / WEB UI
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                      ENTERPRISE KNOWLEDGE ENGINE                            │
│                                                                             │
│  ┌──────────────────────┐  ┌─────────────────────┐  ┌────────────────────┐ │
│  │   CONNECTORS HUB     │  │  ZERO-TRUST ACL     │  │   AUDIT LEDGER     │ │
│  │  ──────────────────  │  │  ─────────────────  │  │  ────────────────  │ │
│  │  Confluence Wiki     │  │  ACLEvaluator       │  │  Query Tracing     │ │
│  │  Google Drive        │  │  LivePermissionGate │  │  ACL Denial Logs   │ │
│  │  Zendesk Help        │  │  Deny Precedence    │  │  Abstention Trail  │ │
│  │  Slack Markdown      │  │                     │  │                    │ │
│  └──────────┬───────────┘  └──────────┬──────────┘  └────────────────────┘ │
│             │                         │                                     │
│             ▼                         ▼                                     │
│  ┌────────────────────────────────────────────────────────┐                 │
│  │               HYBRID RETRIEVER (RRF)                   │                 │
│  │  ┌─────────────────────────┐ ┌───────────────────────┐ │                 │
│  │  │ Sparse BM25 Search      │ │ Dense Vector Search   │ │                 │
│  │  │ (TF-IDF, k1=1.2, b=0.75) │ │ (128-Dim Cosine Sim)  │ │                 │
│  │  └─────────────────────────┘ └───────────────────────┘ │                 │
│  │         Reciprocal Rank Fusion + Temporal Decay        │                 │
│  └───────────────────────────┬────────────────────────────┘                 │
│                              │                                              │
│                              ▼                                              │
│  ┌────────────────────────────────────────────────────────┐                 │
│  │              NLI GROUNDING VERIFIER                    │                 │
│  │      Claim Extraction → Token Entailment Scoring       │                 │
│  └───────────────────────────┬────────────────────────────┘                 │
│                              │                                              │
│                              ▼                                              │
│  ┌────────────────────────────────────────────────────────┐                 │
│  │       LOCAL LLM SYNTHESIS ENGINE (llama.cpp)           │                 │
│  │  http://127.0.0.1:8080 (D:\llama4\qwen2.5-coder-7b)   │                 │
│  └────────────────────────────────────────────────────────┘                 │
└─────────────────────────────────────────────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           AEGIS-QA PLATFORM                                 │
│  Property-Based Security Invariants │ Mutation Gate Inversion               │
│  Payload Fuzzing (1000 Groups, SQLi)│ Automated Benchmarks                  │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 🦙 Llama.cpp Local Model Setup (`D:\llama4`)

The engine integrates directly with `llama.cpp` running on your local machine.

### Local Model Specifications
- **Location**: `D:\llama4`
- **Server Executable**: `D:\llama4\llama-server.exe`
- **Model**: `D:\llama4\qwen2.5-coder-7b.gguf` (4.68 GB GGUF)
- **Acceleration**: CUDA GPU (`ggml-cuda.dll`)

### Starting the Local LLM Server

Run the pre-configured npm script:
```bash
npm run llama:server
```

Or execute directly in PowerShell:
```powershell
D:\llama4\llama-server.exe -m D:\llama4\qwen2.5-coder-7b.gguf -c 4096 --port 8080
```

The `LlamaCppClient` (`src/llm/llamaClient.ts`) connects to `http://127.0.0.1:8080/v1/chat/completions`. If the server is offline, the engine seamlessly falls back to local NLI heuristic synthesis!

---

## ✨ Web Application Frontend

A modern dark-mode, glassmorphic web app built with **React**, **Vite**, **TypeScript**, and **Tailwind CSS**.

### Key Interface Features
1. **Persona Switcher**: Switch between *Alex Vance (DevOps)*, *Elena Rostova (General Counsel)*, *Marcus Chen (PM)*, and *Jordan Miller (External Vendor)* to test Zero-Trust ACL filtering in real time.
2. **Interactive RAG Inspector**: View BM25 vs Dense Vector scores, RRF math, and temporal recency decay curves.
3. **ACL Security Lab**: Test UnifiedACL rules and verify Deny List Precedence.
4. **Aegis-QA Dashboard**: Live test runner executing property invariants, mutation tests, and fuzzing payloads.
5. **Compliance Audit Explorer**: Filterable audit trail with full query trace IDs.

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js 20+
- `llama.cpp` setup in `D:\llama4` (optional for local LLM mode)

### Installation & Build

```bash
# Clone the repository
git clone https://github.com/ParthVarekar/enterprise_knowledge_assistance.git
cd enterprise_knowledge_assistance

# Install backend dependencies
npm install

# Build TypeScript code
npm run build

# Install & build frontend dependencies
cd frontend && npm install && npm run build && cd ..
```

### Running the System

```bash
# 1. Run the Command-Line Demo
npm run demo

# 2. Start the Local Llama.cpp LLM Server
npm run llama:server

# 3. Launch the Web Application Frontend
npm run frontend:dev
# Access UI at http://localhost:3000

# 4. Run full test suite (Unit + Aegis-QA)
npm test
```

---

## 🔒 Zero-Trust Security Model

### Dual-Layer Defense-in-Depth

#### Layer 1: Static ACL Evaluator (`ACLEvaluator`)
Fast in-memory evaluation before candidates reach the vector store or retriever:

```
1. IF user_guid IN denied_users → DENY
2. IF user_groups INTERSECT denied_groups → DENY
3. CASE visibility OF:
     public            → ALLOW
     tenant_internal   → ALLOW
     explicit_users    → ALLOW IF user_guid IN allowed_users
     restricted_groups → ALLOW IF (user_guid IN allowed_users) OR (user_groups INTERSECT allowed_groups)
4. DEFAULT → DENY
```

#### Layer 2: Live Permission Gate (`LivePermissionGate`)
Re-evaluates candidates against live source-system APIs with a 300s TTL cache.

---

## 🔍 Hybrid RAG Mathematics

### 1. BM25 Sparse Search
```
Score_BM25(q, d) = ∑ [ IDF(t) · (f(t, d) · (k1 + 1)) / (f(t, d) + k1 · (1 - b + b · (|d| / avgdl))) ]
```

### 2. Dense Vector Cosine Similarity
```
Sim_Cosine(A, B) = (A · B) / (||A|| · ||B||)
```

### 3. Reciprocal Rank Fusion (RRF)
```
RRF(d) = (1 / (k + rank_sparse(d))) + (1 / (k + rank_dense(d)))   [k = 60]
```

### 4. Temporal Recency Decay
```
Decay(d) = e^(-λ · age_in_days)   [λ = 0.005]
```

### 5. Final Score Calculation
```
FinalScore(d) = RRF(d) · AuthorityWeight · Decay(d)
```

---

## 🛡 Aegis-QA Quality Platform

| Component | Function | Status |
|-----------|----------|--------|
| **Security Symmetry Invariant** | 200 randomized group/user trials verifying access control symmetry | ✅ 100% Passing |
| **Deny Precedence Invariant** | Verifies that deny list overrides allow rules across 100 trials | ✅ 100% Passing |
| **Mutation Testing** | Logical gate inversion (Invert Deny Check, Remove Group Check, Public Denies All) | ✅ 100% Killed (3/3) |
| **Payload Fuzzing** | 1000-group explosion, SQLi/Script injections, unicode user IDs | ✅ 100% Passing |

---

## 📁 Project Directory Structure

```
enterprise-knowledge-assistant/
├── frontend/                     # React + Vite Web Application
│   ├── src/
│   │   ├── components/           # Header, Sidebar, CitationModal, GroundingBadge
│   │   ├── views/                # ChatView, RAGPipelineView, SecurityLabView, AegisQAView, etc.
│   │   └── mockEngine/           # Interactive Engine Adapter
│   ├── index.html
│   └── vite.config.ts
├── src/
│   ├── connectors/               # Confluence, GoogleDrive, Zendesk, Markdown connectors
│   ├── grounding/                # NLI claim-level grounding verifier
│   ├── llm/                      # LlamaCppClient (D:\llama4 integration)
│   ├── observability/            # AuditLedger event logger
│   ├── qa/                       # Aegis-QA invariants, mutations, fuzzer, benchmarks
│   ├── retrieval/                # SparseSearch (BM25), VectorStore, HybridRetriever
│   ├── security/                 # ACLEvaluator, LivePermissionGate
│   ├── synthesis/                # AnswerGenerator with Llama.cpp + fallback
│   ├── types/                    # DocumentChunk, UnifiedACL, UserEntitlements
│   ├── demo.ts                   # CLI Interactive Demo
│   └── index.ts                  # Engine orchestrator
├── tests/                        # Vitest unit, eval, and Aegis-QA test suites
├── docs/                         # Exhaustive technical documentation
│   ├── ARCHITECTURE.md
│   ├── SECURITY.md
│   ├── LLAMA_CPP_INTEGRATION.md
│   ├── AEGIS_QA.md
│   ├── CONNECTORS.md
│   └── DEPLOYMENT.md
├── package.json
└── README.md
```

---

## 📄 License & Author

Built by **[Parth Varekar](https://github.com/ParthVarekar)** under the **MIT License**.
