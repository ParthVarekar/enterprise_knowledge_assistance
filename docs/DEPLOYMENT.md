# Deployment Guide

## Local Development

```bash
# Install dependencies
npm install

# Build TypeScript
npm run build

# Run demo
npm run demo

# Run tests
npm test
```

## Production Deployment

### Prerequisites
- Node.js 20+
- Slack App configured with Bot Token and Signing Secret
- Source system API credentials

### Environment Variables

```bash
# Required
export SLACK_BOT_TOKEN=xoxb-your-bot-token
export SLACK_SIGNING_SECRET=your-signing-secret
export TENANT_ID=your-organization-id

# Optional: Connector credentials
export CONFLUENCE_API_KEY=your-confluence-key
export CONFLUENCE_BASE_URL=https://your-org.atlassian.net
export GOOGLE_DRIVE_CREDENTIALS=path/to/credentials.json
export ZENDESK_API_KEY=your-zendesk-key
export ZENDESK_SUBDOMAIN=your-subdomain
```

### Docker Deployment

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist/ ./dist/
EXPOSE 3000
CMD ["node", "dist/slack/server.js"]
```

```bash
# Build and run
docker build -t enterprise-ka .
docker run -p 3000:3000 \
  -e SLACK_BOT_TOKEN=xoxb-... \
  -e SLACK_SIGNING_SECRET=... \
  -e TENANT_ID=your-tenant \
  enterprise-ka
```

### Production Hardening

#### Replace Mock Components

| Component | Current (Demo) | Production Replacement |
|-----------|---------------|----------------------|
| Vector Store | In-memory mock vectors | Qdrant / Pinecone / Weaviate |
| Embeddings | Deterministic hash-based | `text-embedding-3-large` / Gecko |
| NLI Grounding | Token overlap | `cross-encoder/nli-deberta-v3-base` |
| Answer Synthesis | Context concatenation | Gemini Flash / GPT-4o / Llama 3.1 |
| Audit Storage | In-memory array | PostgreSQL + TimescaleDB |

#### Scaling

- **Horizontal**: Run multiple Node.js instances behind a load balancer
- **Vector DB**: Use managed Qdrant Cloud or Pinecone for auto-scaling
- **Caching**: Add Redis for permission cache and query result cache
- **Queue**: Use Bull/BullMQ for async document ingestion

#### Monitoring

- Export audit ledger metrics to Prometheus/Grafana
- Set alerts on:
  - Abstention rate > 30%
  - Average confidence < 0.5
  - ACL deny rate spikes
  - Query latency p99 > 5s

## Slack App Configuration

1. Create a Slack App at https://api.slack.com/apps
2. Enable Event Subscriptions → Subscribe to `app_mention`
3. Add Bot Token Scopes: `app_mentions:read`, `chat:write`
4. Install to workspace
5. Copy Bot Token and Signing Secret
6. Set environment variables
7. Run: `npm run server`
