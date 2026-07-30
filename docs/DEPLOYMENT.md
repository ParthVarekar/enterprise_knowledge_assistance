# Enterprise Knowledge Assistant Deployment Guide

This guide details local execution, local LLM inference server configuration, Vite React frontend development, Docker containerization, and production hardening architecture for the Enterprise Knowledge Assistant.

---

## 1. Local Setup & Execution

### Prerequisites
- **Node.js**: v20.0.0 or higher
- **npm**: v9.0.0 or higher
- **C++ Build Tools / GPU Drivers**: CUDA 12.0+ (if offloading Llama.cpp inference to NVIDIA GPUs)

### Initial Repository Installation

```bash
# Clone the repository and navigate into project root
cd c:\Users\Parth\Desktop\airlearn

# Install Node backend dependencies
npm install

# Install Vite React Frontend dependencies
npm --prefix frontend install

# Build TypeScript backend code
npm run build

# Execute demo script
npm run demo
```

---

## 2. Local LLM Server Setup (`llama-server`)

The project supports fast, offline, privacy-preserving local LLM inference via `llama-server.exe` running GGUF-quantized models.

### `package.json` Script Command

```bash
npm run llama:server
```

This script executes the exact binary path and parameters configured in [`package.json`](file:///c:/Users/Parth/Desktop/airlearn/package.json):

```powershell
D:\llama4\llama-server.exe -m D:\llama4\qwen2.5-coder-7b.gguf -c 4096 --port 8080
```

### Parameter Breakdown

| Flag | Parameter / Value | Purpose |
| :--- | :--- | :--- |
| `-m` | `D:\llama4\qwen2.5-coder-7b.gguf` | Absolute file path to the Qwen 2.5 Coder 7B GGUF model file |
| `-c` | `4096` | Context window size limit set to 4,096 tokens |
| `--port` | `8080` | Local HTTP API server port (`http://127.0.0.1:8080`) |
| `-ngl` | `33` *(optional)* | Offloads 33 layers to GPU VRAM for maximum inference speed |

### LLM Integration Architecture

The backend [`LlamaCppClient`](file:///c:/Users/Parth/Desktop/airlearn/src/llm/llamaClient.ts) communicates directly with `llama-server.exe`:

```mermaid
sequenceDiagram
    participant Engine as EnterpriseKnowledgeEngine
    participant Client as LlamaCppClient
    participant Llama as llama-server.exe (Port 8080)

    Engine->>Client: isServerAlive()
    Client->>Llama: GET http://127.0.0.1:8080/health
    Llama-->>Client: 200 OK { "status": "ok" }
    
    Engine->>Client: generateChatCompletion(messages, maxTokens)
    Client->>Llama: POST http://127.0.0.1:8080/v1/chat/completions
    Llama-->>Client: 200 OK { choices: [{ message: { content: "..." } }] }
    Client-->>Engine: Returns generated answer text
```

---

## 3. Running the Vite React Web App

The platform includes a Vite React Web App interface located in `frontend/`.

### Development Mode (`npm run frontend:dev`)

To start the Vite development server with Hot Module Replacement (HMR):

```bash
# Starts Vite frontend server (typically at http://localhost:5173)
npm run frontend:dev
```

### Production Build (`npm run frontend:build`)

To compile the TypeScript / React web app into optimized static production assets:

```bash
# Builds frontend assets into frontend/dist/
npm run frontend:build
```

### Integrated Fullstack Execution Workflow

For full local development, launch processes in separate terminal windows:

1. **Terminal 1 (Local LLM Server)**: `npm run llama:server`
2. **Terminal 2 (Slack / Backend API Server)**: `npm run server`
3. **Terminal 3 (Vite React Web App)**: `npm run frontend:dev`

---

## 4. Docker Containerization Setup

### Dockerfile

Create a production `Dockerfile` in the project root:

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
ENV PORT=3000

COPY package*.json ./
RUN npm ci --only=production

# Copy compiled backend and frontend bundles
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/frontend/dist ./frontend/dist

EXPOSE 3000
CMD ["node", "dist/slack/server.js"]
```

### Docker Compose Configuration (`docker-compose.yml`)

```yaml
version: '3.8'

services:
  knowledge-assistant:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - SLACK_BOT_TOKEN=${SLACK_BOT_TOKEN}
      - SLACK_SIGNING_SECRET=${SLACK_SIGNING_SECRET}
      - TENANT_ID=${TENANT_ID:-acme-corp}
      - LLAMA_SERVER_URL=http://llama-server:8080
      - REDIS_URL=redis://cache:6379
    depends_on:
      - cache

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

# View container logs
docker-compose logs -f knowledge-assistant
```

---

## 5. Production Hardening Checklist

Transitioning from local evaluation to enterprise production scale requires upgrading key infrastructure layers:

```mermaid
graph LR
    Sub[Ingested Data] --> Conn[Connectors]
    Conn --> Red[Redis Entitlement & Result Cache]
    Red --> Qdrant[Qdrant Distributed Vector Cluster]
    Qdrant --> LlamaCluster[Llama.cpp GPU Cluster / vLLM]
    LlamaCluster --> Post[PostgreSQL Audit Ledger]
```

### A. Vector Database Upgrade
- **Current (Demo)**: In-memory array mock vector store.
- **Production Target**: **Qdrant / Pinecone / Weaviate**.
- **Hardening Steps**:
  - Deploy Qdrant distributed cluster with HNSW index (`m=16`, `ef_construct=100`).
  - Enforce payload filtering by `tenant_id` at the index level.
  - Implement dynamic vector re-indexing for updated `acl_hash` records.

### B. Llama.cpp GPU Cluster & LLM Scaling
- **Current (Local)**: Single `llama-server.exe` process listening on port 8080.
- **Production Target**: **Multi-GPU vLLM or load-balanced Llama.cpp cluster**.
- **Hardening Steps**:
  - Deploy an NGINX load balancer distributing requests across multiple `llama-server` instances.
  - Enable Tensor Parallelism (`--tensor-split`) across NVIDIA A10G / H100 GPUs.
  - Configure continuous batching (`--cont-batching`) to maximize query throughput.

### C. Redis Cache Layer
- **Current (Demo)**: In-memory Javascript Map objects.
- **Production Target**: **Redis Sentinel / Redis Cluster**.
- **Hardening Steps**:
  - Cache user entitlement GUIDs and LDAP/Slack group memberships with a 5-minute TTL.
  - Store evaluated `acl_hash` decisions in Redis to achieve sub-millisecond Live Permission Gate lookups.
  - Use Redis for rate-limiting Slack user query quotas.

### D. Audit Ledger Storage
- **Current (Demo)**: In-memory `AuditLedger` array ([`src/observability/auditLedger.ts`](file:///c:/Users/Parth/Desktop/airlearn/src/observability/auditLedger.ts)).
- **Production Target**: **PostgreSQL + TimescaleDB**.
- **Hardening Steps**:
  - Store structured audit logs in an append-only PostgreSQL table.
  - Include cryptographic SHA-256 signatures for tamper-evident compliance tracking.

---

## 6. Slack App Integration Setup

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
```

5. **Start Production Backend Server**:

```bash
npm run server
```
