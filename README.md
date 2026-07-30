<div align="center">

# 🏢 Enterprise Knowledge Assistant

**Production-Grade Slack-Native RAG Engine with Zero-Trust ACL, Hybrid Retrieval, NLI Grounding, Local Llama.cpp CUDA & Aegis-QA Platform**

[![TypeScript 5.5](https://img.shields.io/badge/TypeScript-5.5-blue?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js 20+](https://img.shields.io/badge/Node.js-20%2B-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Vitest](https://img.shields.io/badge/Vitest-1.6.0-646CFF?style=for-the-badge&logo=vitest&logoColor=white)](https://vitest.dev/)
[![Zero-Trust ACL](https://img.shields.io/badge/Zero--Trust-Enforced-red?style=for-the-badge&logo=shield)](docs/SECURITY.md)
[![Aegis-QA](https://img.shields.io/badge/Aegis--QA-Active-8A2BE2?style=for-the-badge&logo=shield)](docs/AEGIS_QA.md)
[![Llama.cpp CUDA](https://img.shields.io/badge/Llama.cpp-Gemma--4--E4B--CUDA-FF6F00?style=for-the-badge&logo=nvidia&logoColor=white)](https://github.com/ggerganov/llama.cpp)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

<br/>

*An enterprise-grade knowledge retrieval and intelligence engine connecting multi-tenant enterprise data sources (Confluence, Google Drive, Zendesk, Markdown), enforcing defense-in-depth Zero-Trust access controls, performing mathematical hybrid RAG retrieval, leveraging local CUDA-accelerated Llama.cpp inference hosting Gemma 4 E4B IT (`gemma-4-E4B-it.gguf`), and guaranteeing claim-level NLI grounding directly inside Slack.*

</div>

---

## 📖 Table of Contents

- [Executive Summary & Core Value Proposition](#-executive-summary--core-value-proposition)
- [System Architecture](#-system-architecture)
- [Local LLM Engine: Llama.cpp & CUDA Setup](#-local-llm-engine-llamacpp--cuda-setup)
- [Model Management & Automated Setup](#-model-management--automated-setup)
- [Quick Start Guide & System Launcher](#-quick-start-guide--system-launcher)
- [Interactive Web App Overview](#-interactive-web-app-overview)
- [Security Model & Zero-Trust ACL](#-security-model--zero-trust-acl)
- [Hybrid Retrieval Mathematics](#-hybrid-retrieval-mathematics)
- [NLI Grounding & Intelligent Abstention](#-nli-grounding--intelligent-abstention)
- [Aegis-QA Autonomous Quality Platform](#-aegis-qa-autonomous-quality-platform)
- [Complete Directory Structure](#-complete-directory-structure)
- [API Reference](#-api-reference)
- [Testing & Verification](#-testing--verification)
- [License & Author](#-license--author)

---

## 🎯 Executive Summary & Core Value Proposition

Modern enterprises face a critical dilemma when deploying AI assistants over internal knowledge bases (Confluence, Google Drive, Zendesk, internal documentation):

1. **Permission Leaks & Security Vulnerabilities**: Generic RAG pipelines perform naive vector searches across indexed documents without respecting source-system permissions, leaking restricted HR, financial, or executive data to unauthorized employees.
2. **Hallucinations & Ungrounded Claims**: Off-the-shelf LLMs frequently invent facts, synthesize outdated policies, or combine conflicting sources into authoritative-sounding but fabricated answers.
3. **Lack of Compliance & Auditability**: Security and compliance teams cannot verify which documents were retrieved, which user entitlements were evaluated, or why a specific answer was returned.
4. **Data Obsolescence**: Static vector stores lack temporal decay, serving years-old policy documents over recently updated canonical guides.

### Enterprise Knowledge Assistant Solution

The **Enterprise Knowledge Assistant** solves these critical challenges with a production-hardened, local-first architecture:

- 🛡 **Zero-Trust Security Framework**: Dual-layer authorization comprising pre-retrieval static ACL evaluation (`ACLEvaluator`) and post-retrieval real-time source API verification (`LivePermissionGate`), with explicit deny precedence.
- 🧮 **Mathematical Hybrid Retrieval**: Merges Sparse BM25 keyword matching with Dense Vector Cosine Similarity using Reciprocal Rank Fusion (RRF), weighted by document authority and exponential temporal recency decay ($e^{-\lambda t}$).
- 🔬 **NLI Grounding & Intelligent Abstention**: Performs sentence-level Natural Language Inference (NLI) claim extraction and entailment verification. Refuses to answer ("abstains") if evidence is insufficient or permissions fail.
- ⚡ **Local CUDA LLM Inference**: Direct integration with `llama.cpp` hosting `gemma-4-E4B-it.gguf` (4.77 GB) on NVIDIA GeForce RTX 5050 Laptop GPU with 100% CUDA offload (`-ngl 99`) on port 8085, ensuring 100% data privacy and zero cloud LLM latency/costs.
- 📊 **Aegis-QA Quality Platform**: Continuous autonomous quality testing featuring randomized Property Invariants, AST Mutation Testing (gate inversions), Payload Fuzzing, and automated Benchmark Scenarios.

---

## 🏗 System Architecture

The end-to-end data flow operates through an audited, multi-stage pipeline:

```
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                          SLACK INTERFACE                                         │
│                                       @assistant ask <query>                                     │
└────────────────────────────────────────────────┬─────────────────────────────────────────────────┘
                                                 │
                                                 ▼
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                    ENTERPRISE KNOWLEDGE ENGINE                                   │
│                                                                                                  │
│   ┌──────────────────────────────────────────────────────────────────────────────────────────┐   │
│   │                                   ZERO-TRUST ACL FILTER                                  │   │
│   │  - User Entitlements (User ID, Groups, Tenant ID)                                         │   │
│   │  - ACLEvaluator: Visibility Check (Public, Tenant Internal, Restricted, Explicit)        │   │
│   │  - Deny-List Precedence: Explicit Deny Overrides All Allows                              │   │
│   └────────────────────────────────────────────┬─────────────────────────────────────────────┘   │
│                                                │ Filtered Candidates                             │
│                                                ▼                                                 │
│   ┌──────────────────────────────────────────────────────────────────────────────────────────┐   │
│   │                                   HYBRID RAG RETRIEVER                                   │   │
│   │   ┌───────────────────────────────────┐        ┌─────────────────────────────────────┐   │   │
│   │   │        Sparse BM25 Engine         │        │         Dense Vector Store          │   │   │
│   │   │      Keyword / Lexical Match      │        │      Semantic Cosine Similarity     │   │   │
│   │   └─────────────────┬─────────────────┘        └──────────────────┬──────────────────┘   │   │
│   │                     └────────────────────┬────────────────────────┘                      │   │
│   │                                          ▼                                               │   │
│   │                         Reciprocal Rank Fusion (RRF k=60)                                │   │
│   │                                          +                                               │   │
│   │                        Temporal Recency Decay (e^-λt)                                    │   │
│   │                                          +                                               │   │
│   │                         LivePermissionGate Source Re-Check                               │   │
│   └────────────────────────────────────────────┬─────────────────────────────────────────────┘   │
│                                                │ Top-K Verified Context Chunks                   │
│                                                ▼                                                 │
│   ┌──────────────────────────────────────────────────────────────────────────────────────────┐   │
│   │                               LOCAL LLM INFERENCE (LLAMA.CPP)                            │   │
│   │  - Model: gemma-4-E4B-it.gguf (Port 8085) via CUDA GPU Offload (-ngl 99)                 │   │
│   │  - Synthesis of Grounded Context Chunks -> Candidate Answer                              │   │
│   └────────────────────────────────────────────┬─────────────────────────────────────────────┘   │
│                                                │ Synthesized Text & Claims                       │
│                                                ▼                                                 │
│   ┌──────────────────────────────────────────────────────────────────────────────────────────┐   │
│   │                                NLI GROUNDING & ABSTENTION                                │   │
│   │  - Claim Extraction (Sentence Segmentation)                                              │   │
│   │  - Entailment Scoring against Source Context                                             │   │
│   │  - Confidence Threshold Check (Score < 0.40 -> ABSTAIN)                                 │   │
│   └────────────────────────────────────────────┬─────────────────────────────────────────────┘   │
│                                                │ Audited Grounded Response                       │
│                                                ▼                                                 │
│   ┌──────────────────────────────────────────────────────────────────────────────────────────┐   │
│   │                                 AUDIT LEDGER & OBSERVABILITY                             │   │
│   │  - Cryptographic Trace ID Logging (Query, Candidate Count, Retained Sources, Verdict)    │   │
│   └──────────────────────────────────────────────────────────────────────────────────────────┘   │
└────────────────────────────────────────────────┬─────────────────────────────────────────────────┘
                                                 │
                                                 ▼
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                       AEGIS-QA QUALITY PLATFORM                                  │
│   - Property Invariants (200+ Iterations)   - Gate Mutation Testing (3 Mutants)                  │
│   - Adversarial Payload Fuzzer               - Automated E2E Benchmark Suite                     │
└──────────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## ⚡ Local LLM Engine: Llama.cpp & CUDA Setup

The engine integrates directly with `llama.cpp` for ultra-low latency, zero-cloud dependency, local hardware-accelerated LLM generation.

### Local Hardware & Server Configuration
- **Hardware Acceleration**: NVIDIA GeForce RTX 5050 Laptop GPU (8.0 GB VRAM)
- **Binary Executable**: `llama-server.exe`
- **GGUF LLM Model**: Gemma 4 E4B IT (`gemma-4-E4B-it.gguf` -- 4.77 GB)
- **VRAM Offloading**: 100% CUDA GPU offload (`-ngl 99`)
- **Context Window**: `4096` tokens
- **Local Server Port**: `8085` (`http://127.0.0.1:8085`)
- **Model Manager**: `scripts/ensure_model.py` (handles automatic one-time download & verification)

### Starting the Llama Server

The system provides an NPM script to launch the local CUDA-accelerated Llama server on port 8085:

```bash
npm run llama:server
```

*Executed command:*
```powershell
llama-server.exe -m models\gemma-4-E4B-it.gguf -c 4096 --port 8085 -ngl 99
```

### TypeScript HTTP Client Integration (`LlamaCppClient`)

The backend engine communicates with the OpenAI-compatible `/v1/chat/completions` REST endpoint exposed by `llama-server.exe` on port 8085. If the server is offline or unreachable, `LlamaCppClient` automatically falls back to deterministic context synthesis, ensuring zero system downtime.

```typescript
import { LlamaCppClient } from './src/llm/llamaClient';

const client = new LlamaCppClient({
  baseUrl: 'http://127.0.0.1:8085',
  timeoutMs: 15000,
});

// Health check endpoint verification
const isHealthy = await client.isServerAlive();

// High-speed CUDA inference request (Gemma 4 E4B IT)
const response = await client.generateChatCompletion([
  { role: 'system', content: 'You are an enterprise knowledge assistant.' },
  { role: 'user', content: 'What is the production deployment procedure?' }
]);
```

---

## 📦 Model Management & Automated Setup

To ensure seamless installation and execution without requiring manual model downloads, the repository includes an automated Python model manager (`scripts/ensure_model.py`).

### Automatic Model Verification (`scripts/ensure_model.py`)
Before starting the servers, `scripts/ensure_model.py` automatically checks for the presence and integrity of `models/gemma-4-E4B-it.gguf` (4.77 GB):
1. **Local Model Verification**: Checks if `models/gemma-4-E4B-it.gguf` exists and validates its size.
2. **Local HF Cache Check**: Automatically inspects local HuggingFace cache directories to copy pre-downloaded weights if present.
3. **Automated HuggingFace Download**: If missing, streams the official `gemma-4-E4B-it.gguf` binary directly from HuggingFace with progress reporting.

Run model manager manually:
```bash
python scripts/ensure_model.py
```

---

## 🚀 Quick Start Guide & System Launcher

### Prerequisites

- **Node.js**: `v18.0.0` or higher (Recommended `v20+`)
- **Python**: `v3.8+` (for `scripts/ensure_model.py`)
- **TypeScript**: `v5.5`
- **Local Hardware**: NVIDIA GeForce RTX 5050 Laptop GPU (8.0 GB VRAM) with CUDA drivers installed for 100% GPU offloaded `llama.cpp` execution (`-ngl 99`).

---

### Option A: One-Click Full Platform Launcher (`start.bat`) [Recommended]

Run the automated one-click launcher script in root directory:

```cmd
start.bat
```

`start.bat` automatically orchestrates the entire stack:
1. **Verifies Environment & Model**: Executes `python scripts/ensure_model.py` to ensure `gemma-4-E4B-it.gguf` (4.77 GB) is ready.
2. **Builds Backend**: Compiles TypeScript files into `dist/`.
3. **Launches Service 1**: Spins up `llama-server.exe` hosting **Gemma 4 E4B IT** on **Port 8085** with 100% CUDA GPU offload (`-ngl 99`).
4. **Launches Service 2**: Starts the EKRS Node.js Backend API server on **Port 8080**.
5. **Launches Service 3**: Starts the Vite React UI on **Port 3000** and opens `http://localhost:3000` in your web browser.

---

### Option B: Manual Step-by-Step Setup

#### Step 1: Clone Repository & Install Dependencies

```bash
git clone https://github.com/ParthVarekar/enterprise_knowledge_assistance.git
cd enterprise_knowledge_assistance
npm install
npm --prefix frontend install
```

#### Step 2: Model Management & Build

Ensure model file presence and compile TypeScript backend:

```bash
python scripts/ensure_model.py
npm run build
```

#### Step 3: Start Llama.cpp CUDA Server (Port 8085)

In Terminal 1, launch the Llama server hosting Gemma 4 E4B IT:

```bash
npm run llama:server
```

#### Step 4: Start Node.js Backend API Server (Port 8080)

In Terminal 2, launch the backend API:

```bash
npm run server:backend
```

#### Step 5: Start Vite React Frontend UI (Port 3000)

In Terminal 3, launch the web dashboard:

```bash
npm run frontend:dev
```

Open `http://localhost:3000` in your web browser.

#### Step 6: (Optional) Interactive Terminal Demo

To test retrieval, Zero-Trust ACL filtering, and LLM synthesis in CLI mode:

```bash
npm run demo
```

---

### Platform Ports Summary

| Service | Port | Description |
| :--- | :--- | :--- |
| **Llama.cpp CUDA Server** | `8085` | Gemma 4 E4B IT (`gemma-4-E4B-it.gguf` -- 4.77 GB) with 100% CUDA GPU offload (`-ngl 99`) |
| **Node.js Backend API** | `8080` | Zero-Trust ACL Engine, Hybrid RAG Retriever, Audit Ledger & Grounding Verifier |
| **Vite React UI** | `3000` | User Workspace UI, Persona Switcher, RAG Inspector, Aegis-QA Dashboard |

---

## 💻 Interactive Web App Overview

The project features a sleek, full-featured React + Vite + Tailwind CSS web dashboard (`frontend/`) running on **Port 3000** that connects to the backend on **Port 8080** and Llama.cpp CUDA engine on **Port 8085**:

```
frontend/
├── src/
│   ├── components/
│   │   ├── Header.tsx              # Navigation & System Status Indicators (Port 8085 / 8080)
│   │   ├── Sidebar.tsx             # Module Navigation Sidebar
│   │   ├── GroundingBadge.tsx      # Claim Verification Status Badge
│   │   └── CitationModal.tsx       # Document Source Inspector Modal
│   ├── views/
│   │   ├── ChatView.tsx            # Slack-like Interactive Chat Interface
│   │   ├── RAGPipelineView.tsx     # Visual RAG Inspector & Ranking Flow
│   │   ├── SecurityLabView.tsx     # Interactive ACL Simulator & Matrix
│   │   ├── AegisQAView.tsx         # Autonomous Quality Platform Dashboard
│   │   ├── ConnectorsView.tsx      # Multi-Source Data Ingestion Manager
│   │   └── AuditLedgerView.tsx     # Compliance Audit Ledger Log Viewer
```

### Key Application Views

1. 👤 **Persona Switcher**: Seamlessly switch between active user profiles (e.g., `Executive Alice`, `Engineer Bob`, `Support Charlie`, `Restricted User Dave`) to witness real-time permission filtering in chat responses.
2. 🔍 **RAG Inspector**: Visual breakdown showing exact Sparse BM25 scores, Vector Cosine similarities, RRF fusion ranks, temporal recency decay penalties, and final calculated document weights.
3. 🛡 **Security Lab**: Test arbitrary user entitlements against document ACL schemas. Simulate group inheritance, explicit user allows/denies, and visibility modes (`public`, `tenant_internal`, `restricted_groups`, `explicit_users`).
4. ⚡ **Aegis-QA Dashboard**: Real-time monitor executing property invariant checks, triggering AST mutation testing to verify logical gate strength, and running payload fuzzer scenarios.

---

## 🔒 Security Model & Zero-Trust ACL

The security framework operates on a **Defense-in-Depth** model with two distinct, non-bypassable layers:

```
                                    Incoming Query Request
                                              │
                                              ▼
                             ┌──────────────────────────────────┐
                             │  Layer 1: Static ACLEvaluator    │
                             │  - Evaluates Visibility Mode     │
                             │  - Enforces Deny-List Precedence │
                             │  - Checks Group/User Membership  │
                             └────────────────┬─────────────────┘
                                              │ Candidate Chunks Passed
                                              ▼
                             ┌──────────────────────────────────┐
                             │  Layer 2: LivePermissionGate     │
                             │  - Real-Time RPC to Source APIs  │
                             │  - Validates Current ACL Token   │
                             │  - Handles Instant Revocations   │
                             └────────────────┬─────────────────┘
                                              │ Verified Chunks Passed
                                              ▼
                                   To Synthesis Pipeline
```

### Layer 1: Static ACL Evaluation (`ACLEvaluator`)

Evaluates the `UnifiedACL` attached to every chunk against the caller's `UserEntitlements`:

```typescript
export interface UnifiedACL {
  visibility: 'public' | 'tenant_internal' | 'restricted_groups' | 'explicit_users';
  allowed_users: string[];
  allowed_groups: string[];
  denied_users: string[];
  denied_groups: string[];
  security_classification: 'public' | 'internal' | 'confidential' | 'restricted';
  tenant_id: string;
}
```

#### Enforced Security Rules:
1. **Tenant Isolation**: `user.tenant_id` MUST equal `chunk.tenant_id`. Cross-tenant access is strictly blocked.
2. **Deny Precedence Rule**: If `user.user_guid` is in `denied_users` OR any of `user.groups` is in `denied_groups`, access is **IMMEDIATELY DENIED**, overriding any allow rule.
3. **Visibility Modes**:
   - `public`: Accessible to any authenticated user within the tenant.
   - `tenant_internal`: Accessible to all internal employees of the tenant.
   - `restricted_groups`: Accessible ONLY if `user.groups` intersects with `allowed_groups`.
   - `explicit_users`: Accessible ONLY if `user.user_guid` is in `allowed_users`.

### Layer 2: Live Permission Gate (`LivePermissionGate`)

Pre-retrieval static filtering is insufficient if source system permissions changed after chunk indexing. `LivePermissionGate` executes real-time RPC permission checks against upstream API connectors (Confluence, Drive, Zendesk) for top candidates before passing context to the LLM synthesis engine.

---

## 🧮 Hybrid Retrieval Mathematics

The hybrid retrieval engine combines lexical, semantic, authority, and temporal signals into a unified scoring function.

### 1. Sparse Lexical Search (BM25 Formula)

For a query $q$ containing terms $q_1, q_2, \dots, q_n$ and a document chunk $d$:

$$\text{BM25}(q, d) = \sum_{i=1}^{n} \text{IDF}(q_i) \cdot \frac{f(q_i, d) \cdot (k_1 + 1)}{f(q_i, d) + k_1 \cdot \left(1 - b + b \cdot \frac{|d|}{\text{avgdl}}\right)}$$

Where:
- $\text{IDF}(q_i) = \ln \left( \frac{N - n(q_i) + 0.5}{n(q_i) + 0.5} + 1 \right)$
- $f(q_i, d)$ is term frequency in chunk $d$.
- $|d|$ is chunk token length, and $\text{avgdl}$ is average chunk length across index.
- Parameters: $k_1 = 1.2$, $b = 0.75$.

### 2. Dense Semantic Vector Search (Cosine Similarity)

Calculates the angular similarity between dense vector embeddings $\vec{u}$ (query) and $\vec{v}$ (document chunk):

$$\text{CosineSimilarity}(\vec{u}, \vec{v}) = \frac{\vec{u} \cdot \vec{v}}{\|\vec{u}\| \|\vec{v}\|} = \frac{\sum_{i=1}^{m} u_i v_i}{\sqrt{\sum_{i=1}^{m} u_i^2} \sqrt{\sum_{i=1}^{m} v_i^2}}$$

### 3. Reciprocal Rank Fusion (RRF)

Fuses independent ranked lists from Sparse Search ($R_{\text{sparse}}$) and Dense Vector Search ($R_{\text{dense}}$) without requiring score normalization calibration:

$$\text{RRF}(d \in D) = \sum_{m \in \{\text{sparse}, \text{dense}\}} \frac{1}{k + r_m(d)}$$

Where:
- $k = 60$ (smoothing constant balancing top-rank dominance).
- $r_m(d)$ is the 1-based ordinal rank of document $d$ in system $m$.

### 4. Temporal Recency Decay

Applies exponential decay based on document creation/modification age $t$ (in days):

$$\text{Decay}(t) = e^{-\lambda t}$$

Where:
- $\lambda = 0.005$ (decay half-life $\approx 138$ days).
- $t = \max\left(0, \frac{\text{now} - \text{created\_at}}{86400}\right)$.

### 5. Final Combined Document Score

$$S_{\text{final}}(d) = \text{RRF}_{\text{norm}}(d) \times W_{\text{authority}}(d) \times W_{\text{source}}(d) \times e^{-\lambda t}$$

Where $W_{\text{authority}} = 1.25$ for canonical pages, and $W_{\text{source}} = 1.10$ for Confluence documentation.

---

## 🔬 NLI Grounding & Intelligent Abstention

To guarantee that the assistant never produces ungrounded hallucinations, every generated response passes through `GroundingVerifier`.

```
                    Synthesized Text Response
                                │
                                ▼
                   Claim Extraction Engine
                Sentence-Level Segmentation
                                │
               Claims: [ c1, c2, ..., cn ]
                                │
                                ▼
               Entailment Verification (NLI)
             Compare Claim against Context Chunks
                                │
                                ▼
             Compute Overall Grounding Score (C)
                                │
            ┌──────────────────┴──────────────────┐
            │                                     │
      C >= 0.40                             C < 0.40
            │                                     │
            ▼                                     ▼
   Serve Answer with               INTELLIGENT ABSTENTION
   Claim Citations                 "I do not have sufficient
                                    cleared evidence to answer."
```

### Claim Extraction & Verification Algorithm

1. **Sentence Segmentation**: Synthesized text is decomposed into discrete atomic claims $C = \{c_1, c_2, \dots, c_n\}$.
2. **Entailment Scoring**: Each claim $c_i$ is evaluated against retrieved evidence chunks $E = \{e_1, e_2, \dots, e_m\}$ using token overlap NLI entailment scoring:

$$E(c_i, e_j) = \frac{|T(c_i) \cap T(e_j)|}{|T(c_i)|}$$

3. **Verification Verdict**: A claim $c_i$ is verified if $\max_{j} E(c_i, e_j) \ge \tau_{\text{entailment}}$ (default $\tau_{\text{entailment}} = 0.65$).
4. **Overall Confidence Score**:

$$C_{\text{overall}} = \frac{1}{n} \sum_{i=1}^{n} \max_{j} E(c_i, e_j)$$

5. **Abstention Policy**: If $C_{\text{overall}} < \tau_{\text{confidence}}$ (default $0.40$) or zero candidate chunks survived ACL verification, the engine **refuses to answer**:

> *"I am unable to answer this question because there is insufficient access-cleared documentation available to verify the claims."*

---

## 🛡 Aegis-QA Autonomous Quality Platform

`Aegis-QA` is an embedded quality engineering framework ensuring continuous security, stability, and accuracy guarantees across the codebase.

```
Enterprise Knowledge Assistant / Aegis-QA Framework
├── Property-Based Invariants   (Randomized Generative Security Invariant Suite)
├── AST Mutation Testing        (Logical Gate Inversion & Test Rigor Verification)
├── Payload Fuzzer              (Adversarial Security & Edge-Case Boundary Fuzzing)
└── E2E Benchmark Runner        (Retrieval Precision, Grounding & Latency Benchmarking)
```

### Core Components

1. 🎲 **Property-Based Invariants (`PropertyInvariantRunner`)**:
   - Executes 200+ randomized iterations generating synthetic users, groups, and ACL configurations.
   - Verifies mathematical invariants: Security Symmetry, Deny Precedence, and Public Access Non-Leakage.

2. 🧬 **Mutation Testing Framework (`MutationRunner`)**:
   - Injects programmatically controlled logical mutants into security code paths (e.g., inverting deny check logic, bypassing group membership, disabling public visibility).
   - Validates that the test suite detects and kills 100% of injected mutants.

3. 💣 **Adversarial Payload Fuzzer (`PayloadFuzzer`)**:
   - Stress-tests ACL and query interfaces with malicious payloads: Unicode injection, SQLi sequences, group array explosions (1000+ groups), and empty/nullish edge cases.

4. 📈 **Benchmark Suite (`BenchmarkRunner`)**:
   - Automated evaluation suite measuring top-K retrieval accuracy, grounding precision, abstention recall, and execution latency.

---

## 📁 Complete Directory Structure

```
enterprise-knowledge-assistant/
├── frontend/                        # Interactive React + Vite + Tailwind Web Application (Port 3000)
│   ├── src/
│   │   ├── components/              # UI Components (GroundingBadge, CitationModal, etc.)
│   │   ├── mockEngine/              # Adapter layer bridging React UI with Core Engine & Port 8085
│   │   ├── views/                   # Application Views (Chat, RAG, Security Lab, Aegis-QA)
│   │   ├── App.tsx                  # Main React Layout
│   │   └── main.tsx                 # Frontend Entrypoint
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.ts
├── models/                          # Local GGUF LLM Model Storage
│   └── gemma-4-E4B-it.gguf          # Gemma 4 E4B IT Model Binary (4.77 GB)
├── scripts/                         # Operational & Maintenance Scripts
│   └── ensure_model.py              # Automatic Model Download & Verification Manager
├── src/                             # Core TypeScript Engine Source Code
│   ├── index.ts                     # Engine Orchestrator & Main Export Entrypoint
│   ├── demo.ts                      # CLI Interactive Demo Script
│   ├── connectors/                  # Data Ingestion Connectors
│   │   ├── base.ts                  # Abstract BaseConnector Interface
│   │   ├── confluence.ts            # Confluence Wiki Connector
│   │   ├── googleDrive.ts           # Google Drive Document Connector
│   │   ├── zendesk.ts               # Zendesk Help Center Connector
│   │   └── markdown.ts              # Local Markdown & Raw Text Connector
│   ├── grounding/
│   │   └── verifier.ts              # NLI Grounding & Claim Entailment Verifier
│   ├── llm/
│   │   └── llamaClient.ts           # Local Llama.cpp CUDA REST HTTP Client (Port 8085)
│   ├── observability/
│   │   └── auditLedger.ts           # Audit Trail Logger & Compliance Ledger
│   ├── qa/                          # Aegis-QA Autonomous Quality Framework
│   │   ├── benchmarkRunner.ts       # E2E Benchmark Scenario Suite
│   │   ├── mutationRunner.ts        # Logical Gate Mutation Testing Suite
│   │   ├── payloadFuzzer.ts         # Security Payload Fuzzer
│   │   └── propertyInvariants.ts    # Randomized Property Invariants Suite
│   ├── retrieval/                   # Hybrid Retrieval Pipeline
│   │   ├── hybridRetriever.ts       # RRF Fusion & Temporal Decay Engine
│   │   ├── sparseSearch.ts          # BM25 Lexical Search Implementation
│   │   └── vectorStore.ts           # Dense Vector Cosine Similarity Store
│   ├── security/                    # Zero-Trust Security Framework
│   │   ├── acl.ts                   # Static Unified ACL Evaluator
│   │   └── livePermissionGate.ts    # Real-Time Source API Authorization Gate
│   ├── server/                      # Standalone Backend API Server (Port 8080)
│   │   └── standalone.ts            # REST API Server Entrypoint
│   ├── slack/
│   │   └── server.ts                # Bolt for Slack Application Entrypoint
│   ├── synthesis/
│   │   └── generator.ts             # Context Synthesis & Answer Generator
│   └── types/
│       └── index.ts                 # Type Definitions & Schemas
├── tests/                           # Vitest Automated Test Suite
│   ├── aegisQA.test.ts              # Aegis-QA Invariants, Mutations & Fuzzing Tests
│   ├── eval.test.ts                 # E2E Evaluation Pipeline Benchmark Tests
│   └── unit.test.ts                 # Unit Tests (ACL, Search, Grounding, Audit)
├── docs/                            # Deep-Dive Technical Documentation
│   ├── AEGIS_QA.md                  # Aegis-QA Architecture Documentation
│   ├── ARCHITECTURE.md              # System Architecture Specification
│   ├── CONNECTORS.md                # Connector SDK & Guide
│   ├── DEPLOYMENT.md                # Operations & Production Deployment Guide
│   └── SECURITY.md                  # Security Model & Threat Specification
├── package.json                     # NPM Dependencies & Build Scripts
├── start.bat                        # One-Click Full Platform Launcher (Ports 8085, 8080, 3000)
├── tsconfig.json                    # TypeScript 5.5 Compiler Configuration
├── vitest.config.ts                 # Vitest Framework Configuration
├── .gitignore
├── LICENSE                          # MIT Open Source License
└── README.md                        # Enterprise Product Specification (This file)
```

---

## 📚 API Reference

### `EnterpriseKnowledgeEngine`

The central orchestrator for data ingestion, search indexing, ACL evaluation, and answer synthesis.

```typescript
import { EnterpriseKnowledgeEngine } from './src/index';

const engine = new EnterpriseKnowledgeEngine({
  tenantId: 'acme-corp',
  confidenceThreshold: 0.40,
  maxCitations: 5,
  entailmentThreshold: 0.65,
});

// Register Data Connectors
engine.registerConnector(new ConfluenceConnector({ tenantId: 'acme-corp' }));
engine.registerConnector(new GoogleDriveConnector({ tenantId: 'acme-corp' }));

// Ingest & Index Documents
const summary = await engine.ingestAll();
console.log(`Ingested ${summary.totalChunks} chunks from ${summary.sources.join(', ')}`);

// Execute Grounded Query under User Entitlements
const response = await engine.query(
  'What is our production deployment rollback protocol?',
  {
    user_guid: 'usr_alice_123',
    tenant_id: 'acme-corp',
    groups: ['engineering-leads', 'devops'],
  }
);

if (response.is_abstained) {
  console.log('Engine Abstained:', response.answer_text);
} else {
  console.log('Answer:', response.answer_text);
  console.log('Confidence Score:', response.confidence_score);
  console.log('Citations:', response.citations);
}
```

### `ACLEvaluator`

Evaluates static user access against chunk permissions.

```typescript
import { ACLEvaluator } from './src/security/acl';

const isAllowed = ACLEvaluator.canAccess(
  chunk.acl,
  {
    user_guid: 'usr_bob_456',
    tenant_id: 'acme-corp',
    groups: ['support-tier-1'],
  }
);
```

### `HybridRetriever`

Executes Sparse BM25 + Dense Vector search fusion with temporal decay.

```typescript
import { HybridRetriever } from './src/retrieval/hybridRetriever';

const candidateChunks = await retriever.retrieve({
  query_id: 'q_9876',
  raw_text: 'SOC2 Compliance Guidelines',
  user_entitlements: userPermissions,
  top_k: 10,
});
```

---

## 🧪 Testing & Verification

The suite includes 100% test coverage across core ACL rules, retrieval mechanics, NLI grounding, and Aegis-QA invariants.

### Running Test Commands

```bash
# Execute full Vitest test suite
npm test

# Run End-to-End Evaluation & Aegis-QA tests only
npm run test:eval

# Run tests in verbose mode
npx vitest run --reporter=verbose
```

### Test Suite Breakdown

| Test Suite File | Focus Area | Verification Coverage |
|:---|:---|:---|
| `tests/unit.test.ts` | Core Mechanics | ACLEvaluator, BM25 Search, Vector Store, Grounding, AuditLedger |
| `tests/eval.test.ts` | E2E Engine | Full pipeline ingestion, multi-user personas, abstention logic |
| `tests/aegisQA.test.ts` | Aegis-QA Platform | Property Invariants (200 iterations), Gate Mutation Inversion, Security Fuzzing |

---

## 📄 License & Author

### License
This project is open-source software licensed under the **[MIT License](LICENSE)**.

### Author
Designed, engineered, and maintained by **[Parth Varekar](https://github.com/ParthVarekar)**.

---

<div align="center">

**Enterprise Knowledge. Zero Trust. Grounded Truth.**

</div>
