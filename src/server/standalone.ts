import http from 'http';
import { EnterpriseKnowledgeEngine } from '../index';
import { ConfluenceConnector } from '../connectors/confluence';
import { GoogleDriveConnector } from '../connectors/googleDrive';
import { ZendeskConnector } from '../connectors/zendesk';
import { createEKRSRouter } from './router';

async function main() {
  const PORT = process.env.PORT || 8080;
  const tenantId = process.env.TENANT_ID || 'acme-corp';

  console.log('╔═══════════════════════════════════════════════════════════════╗');
  console.log('║        EKRS Standalone Backend API Server -- v2.4             ║');
  console.log('╚═══════════════════════════════════════════════════════════════╝\n');

  console.log('[Backend] Initializing Enterprise Knowledge Engine...');
  const engine = new EnterpriseKnowledgeEngine({ tenantId, confidenceThreshold: 0.35 });

  engine.registerConnector(new ConfluenceConnector({ name: 'confluence', tenantId }));
  engine.registerConnector(new GoogleDriveConnector({ name: 'gdrive', tenantId }));
  engine.registerConnector(new ZendeskConnector({ name: 'zendesk', tenantId }));

  const ingest = await engine.ingestAll();
  console.log(`[Backend] Ingested ${ingest.totalChunks} chunks from: ${ingest.sources.join(', ')}`);

  const router = createEKRSRouter(engine);

  const server = http.createServer(async (req, res) => {
    // CORS Headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
      res.writeHead(204);
      res.end();
      return;
    }

    const url = new URL(req.url || '/', `http://${req.headers.host}`);
    let body = {};

    if (req.method === 'POST') {
      try {
        const buffers: Buffer[] = [];
        for await (const chunk of req) {
          buffers.push(chunk);
        }
        const bodyText = Buffer.concat(buffers).toString();
        if (bodyText) {
          body = JSON.parse(bodyText);
        }
      } catch (e) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid JSON payload' }));
        return;
      }
    }

    const result = await router.handleRequest(url.pathname, req.method || 'GET', body);
    res.writeHead(result.status, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(result.payload));
  });

  server.listen(PORT, () => {
    console.log(`\n🟢 EKRS Backend API Server LISTENING on http://127.0.0.1:${PORT}`);
    console.log(`   Endpoints:`);
    console.log(`   • POST http://127.0.0.1:${PORT}/api/ekrs/query`);
    console.log(`   • GET  http://127.0.0.1:${PORT}/api/ekrs/chunks`);
    console.log(`   • GET  http://127.0.0.1:${PORT}/api/ekrs/audit`);
    console.log(`   • GET  http://127.0.0.1:${PORT}/api/ekrs/health\n`);
  });
}

main().catch(console.error);
