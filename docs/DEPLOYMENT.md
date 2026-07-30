# Enterprise Knowledge Assistant Deployment Guide

This guide details single-command launching, model management, local LLM inference server configuration for Gemma 4 E4B IT on NVIDIA RTX 5050 hardware, Vite React frontend development, Docker containerization, and production hardening architecture for the Enterprise Knowledge Assistant.

---

## 1. Local Setup & Execution

### System Requirements & Hardware Target
- **Node.js**: v20.0.0 or higher
- **npm**: v9.0.0 or higher
- **Python**: v3.8+ (required for `scripts/ensure_model.py` model verification and automated retrieval)
- **GPU Hardware**: NVIDIA GeForce RTX 5050 Laptop GPU (8.0 GB VRAM) with CUDA 12.0+ drivers

### Single-Command One-Click Launcher (`start.bat`)

The platform includes a single command launcher script [`start.bat`](file:///c:/Users/Parth/Desktop/airlearn/start.bat) that automates full-stack startup:
1. Verifies Node.js runtime and environment prerequisites.
2. Executes [`scripts/ensure_model.py`](file:///c:/Users/Parth/Desktop/airlearn/scripts/ensure_model.py) to check or auto-download the **Gemma 4 E4B IT** GGUF model.
3. Builds TypeScript backend and installs frontend dependencies.
4. Launches the **Llama CUDA Server** (Port 8085) with 100% GPU layer offloading (`-ngl 99`).
5. Launches the **Node.js Backend API Server** (Port 8080).
6. Launches the **Vite React Frontend UI** (Port 3000) and automatically opens `http://localhost:3000` in your web browser.

To start all services with a single command:

```cmd
cd c:\Users\Parth\Desktop\airlearn
start.bat
```

### Manual Step-by-Step Installation

If you prefer to set up and run services manually:

```bash
# Clone the repository and navigate into project root
cd c:\Users\Parth\Desktop\airlearn

# 1. Run the Python model manager to verify/download Gemma 4 E4B IT (4.77 GB)
python scripts/ensure_model.py

# 2. Install Node backend dependencies
npm install

# 3. Install Vite React Frontend dependencies
npm --prefix frontend install

# 4. Build TypeScript backend code
npm run build

# 5. Execute local demo verification script
npm run demo
```

---

## 2. Local LLM Server Setup (`llama-server`) & Model Manager

The platform leverages fast, offline, privacy-preserving local LLM inference via `llama-server.exe` running GGUF-quantized models offloaded to GPU VRAM.

### Model Specification & Python Model Manager (`scripts/ensure_model.py`)

- **Model**: **Gemma 4 E4B IT** (`gemma-4-E4B-it.gguf` -- 4.77 GB)
- **Storage Location**: `models/gemma-4-E4B-it.gguf`
- **Model Manager**: [`scripts/ensure_model.py`](file:///c:/Users/Parth/Desktop/airlearn/scripts/ensure_model.py)

Before launching inference, `scripts/ensure_model.py` verifies the model file integrity. If missing, it checks for a local HuggingFace cache copy or automatically downloads `gemma-4-E4B-it.gguf` (4.77 GB) directly from HuggingFace.

```bash
python scripts/ensure_model.py
```

### `package.json` Llama CUDA Server Command

```bash
npm run llama:server
```

This script executes `llama-server.exe` targeted at the NVIDIA GeForce RTX 5050 Laptop GPU (8.0 GB VRAM) on port **8085**:

```powershell
C:\Users\Parth\Desktop\whisper\third_party\llama-cpp-bin\llama-server.exe -m models\gemma-4-E4B-it.gguf -c 4096 --port 8085 -ngl 99
```

### Parameter Breakdown

| Flag | Parameter / Value | Purpose |
| :--- | :--- | :--- |
| `-m` | `models\gemma-4-E4B-it.gguf` | Path to Gemma 4 E4B IT GGUF model file (4.77 GB) |
| `-c` | `4096` | Context window size limit set to 4,096 tokens |
| `--port` | `8085` | Llama CUDA HTTP API server port (`http://127.0.0.1:8085`) |
| `-ngl` | `99` | Offloads all 99 model layers to NVIDIA GeForce RTX 5050 Laptop GPU (8.0 GB VRAM) |

### LLM Integration Architecture

The backend [`LlamaCppClient`](file:///c:/Users/Parth/Desktop/airlearn/src/llm/llamaClient.ts) communicates directly with the Llama CUDA server on Port **8085**:

```mermaid
sequenceDiagram
    participant Engine as EnterpriseKnowledgeEngine
    participant Client as LlamaCppClient
    participant Llama as llama-server.exe (Port 8085 - RTX 5050 GPU)

    Engine->>Client: isServerAlive()
    Client->>Llama: GET http://127.0.0.1:8085/health
    Llama-->>Client: 200 OK { "status": "ok" }
    
    Engine->>Client: generateChatCompletion(messages, maxTokens)
    Client->>Llama: POST http://127.0.0.1:8085/v1/chat/completions
    Llama-->>Client: 200 OK { choices: [{ message: { content: "..." } }] }
    Client-->>Engine: Returns generated answer text
```

---

## 3. Service Ports & Integrated Fullstack Workflow

### System Architecture Port Allocation

| Service | Port | Endpoint / URL | Description |
| :--- | :--- | :--- | :--- |
| **Llama CUDA Server** | **8085** | `http://localhost:8085` | Llama.cpp CUDA server hosting `gemma-4-E4B-it.gguf` on RTX 5050 GPU |
| **Node.js Backend API** | **8080** | `http://localhost:8080` | Enterprise Knowledge Assistant standalone REST API backend |
| **Vite React UI** | **3000** | `http://localhost:3000` | Frontend web interface and user workspace |

### Running the Vite React Web App

The platform web interface is located in `frontend/`.

- **Development Mode (`npm run frontend:dev`)**: Starts Vite dev server with HMR on **Port 3000** (`http://localhost:3000`).
- **Production Build (`npm run frontend:build`)**: Compiles TypeScript / React code into static assets in `frontend/dist/`.

### Manual Fullstack Execution Workflow

When running without `start.bat`, launch services across 3 separate terminal windows:

1. **Terminal 1 (Llama CUDA Server - Port 8085)**:
   ```bash
   python scripts/ensure_model.py
   npm run llama:server
   ```
2. **Terminal 2 (Node.js Backend API Server - Port 8080)**:
   ```bash
   npm run server:backend
   ```
3. **Terminal 3 (Vite React Web App - Port 3000)**:
   ```bash
   npm run frontend:dev
   ```

---

## 4. Docker Containerization Setup

### Dockerfile

Below is the production multi-stage `Dockerfile` configured for the platform:

```dockerfile
# Multi-stage production Dockerfile
FROM node:20-alpine AS builder
WORKDIR /app

# Copy root dependencies and package specs
COPY package*.json ./
RUN npm ci

# Copy source code and build backend
COPY . .
RUN npm run build

# Build React frontend
RUN npm --prefix frontend install
RUN npm run frontend:build

# Production stage
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=8080
ENV VITE_PORT=3000
ENV LLAMA_SERVER_URL=http://llama-server:8085

COPY package*.json ./
RUN npm ci --only=production

# Copy compiled backend and frontend bundles
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/frontend/dist ./frontend/dist

EXPOSE 8080 3000
CMD ["node", "dist/server/standalone.js"]
```

### Docker Compose Configuration (`docker-compose.yml`)

```yaml
version: '3.8'

services:
  frontend-ui:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - VITE_BACKEND_URL=http://backend:8080
    depends_on:
      - backend

  backend:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "8080:8080"
    environment:
      - PORT=8080
      - SLACK_BOT_TOKEN=${SLACK_BOT_TOKEN}
      - SLACK_SIGNING_SECRET=${SLACK_SIGNING_SECRET}
      - TENANT_ID=${TENANT_ID:-acme-corp}
      - LLAMA_SERVER_URL=http://llama-server:8085
      - REDIS_URL=redis://cache:6379
    depends_on:
      - llama-server
      - cache

  llama-server:
    image: ghcr.io/ggerganov/llama.cpp:full-cuda
    ports:
      - "8085:8085"
    volumes:
      - ./models:/models
    command: "-m /models/gemma-4-E4B-it.gguf -c 4096 --port 8085 -ngl 99"
    deploy:
      resources:
        reservations:
          devices:
            - driver: nvidia
              count: 1
              capabilities: [gpu]

  cache:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  vector-db:
    image: qdrant/qdrant:latest
    ports:
      - "6333:6333"
    volumes:
      - qdrant_data:/qdrant/storage

volumes:
  qdrant_data:
```

### Launching with Docker

```bash
# Build and launch all services in background
docker-compose up -d --build

# View container logs for backend
docker-compose logs -f backend
```

---

## 5. Production Hardening Checklist

Transitioning from local evaluation to enterprise production scale requires upgrading key infrastructure layers:

```mermaid
graph LR
    Sub[Ingested Data] --> Conn[Connectors]
    Conn --> Red[Redis Entitlement & Result Cache]
    Red --> Qdrant[Qdrant Distributed Vector Cluster]
    Qdrant --> LlamaCluster[Llama CUDA Cluster / Port 8085]
    LlamaCluster --> Post[PostgreSQL Audit Ledger]
```

### A. Vector Database Upgrade
- **Current (Demo)**: In-memory array vector store (`VectorStore`).
- **Production Target**: **Qdrant / Pinecone / Weaviate**.
- **Hardening Steps**:
  - Deploy Qdrant distributed cluster with HNSW index (`m=16`, `ef_construct=100`).
  - Enforce payload filtering by `tenant_id` at the index level.
  - Implement dynamic vector re-indexing for updated `acl_hash` records.

### B. Llama CUDA GPU Server & LLM Scaling
- **Current (Local)**: `llama-server.exe` running **Gemma 4 E4B IT** (`gemma-4-E4B-it.gguf` -- 4.77 GB) on Port **8085**, offloading 100% of layers (`-ngl 99`) to NVIDIA GeForce RTX 5050 Laptop GPU (8.0 GB VRAM).
- **Production Target**: **Multi-GPU vLLM or load-balanced Llama.cpp cluster**.
- **Hardening Steps**:
  - Deploy an NGINX load balancer distributing requests across multiple `llama-server` instances on port 8085.
  - Enable Tensor Parallelism (`--tensor-split`) across NVIDIA A10G / H100 GPUs.
  - Configure continuous batching (`--cont-batching`) to maximize query throughput.

### C. Redis Cache Layer
- **Current (Demo)**: In-memory Javascript Map objects.
- **Production Target**: **Redis Sentinel / Redis Cluster**.
- **Hardening Steps**:
  - Cache user entitlement GUIDs and LDAP/Slack group memberships with a 5-minute TTL.
  - Store evaluated `acl_hash` decisions in Redis to achieve sub-millisecond Live Permission Gate lookups.
  - Use Redis for rate-limiting user query quotas.

### D. Audit Ledger Storage
- **Current (Demo)**: In-memory `AuditLedger` array ([`src/observability/auditLedger.ts`](file:///c:/Users/Parth/Desktop/airlearn/src/observability/auditLedger.ts)).
- **Production Target**: **PostgreSQL + TimescaleDB**.
- **Hardening Steps**:
  - Store structured audit logs in an append-only PostgreSQL table.
  - Include cryptographic SHA-256 signatures for tamper-evident compliance tracking.

---

## 6. Slack App & Backend Integration Setup

1. **Create Slack App**: Navigate to [Slack API Applications](https://api.slack.com/apps) and click **Create New App**.
2. **Configure Bot Scopes**: Under **OAuth & Permissions**, add the following Bot Token Scopes:
   - `app_mentions:read`
   - `chat:write`
   - `channels:history`
3. **Enable Event Subscriptions**:
   - Turn on **Event Subscriptions**.
   - Set **Request URL** to `https://your-domain.com/slack/events`.
   - Subscribe to bot event `app_mention`.
4. **Install to Workspace & Export Environment Variables**:

```bash
export SLACK_BOT_TOKEN=xoxb-your-bot-token
export SLACK_SIGNING_SECRET=your-signing-secret
export TENANT_ID=your-organization-id
export LLAMA_SERVER_URL=http://127.0.0.1:8085
export PORT=8080
```

5. **Start Production Backend Server**:

```bash
npm run server:backend
```
