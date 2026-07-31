import React, { useState } from 'react';
import { renderCuteConnectorIcon } from '../components/ui/CuteIcons';
import { 
  Plug, 
  CheckCircle2, 
  RefreshCw, 
  Layers, 
  ShieldCheck, 
  Lock, 
  Globe, 
  Search, 
  RotateCw, 
  FileText, 
  ShieldAlert, 
  Users,
  Activity
} from 'lucide-react';

interface ConnectorSource {
  id: string;
  name: string;
  system: string;
  status: 'Connected' | 'Syncing' | 'Paused';
  chunks: number;
  documents: number;
  icon: string;
  classification: 'Confidential & Internal' | 'Restricted & Internal' | 'Public' | 'Internal';
  classificationType: 'confidential' | 'restricted' | 'public' | 'internal';
  lastSync: string;
  syncFrequency: string;
  description: string;
  aclGroups: string[];
}

const CONNECTOR_SOURCES: ConnectorSource[] = [
  {
    id: 'conn-confluence',
    name: 'Confluence Wiki',
    system: 'confluence',
    status: 'Connected',
    chunks: 14250,
    documents: 342,
    icon: '📘',
    classification: 'Confidential & Internal',
    classificationType: 'confidential',
    lastSync: '2 mins ago',
    syncFrequency: 'Every 15 mins',
    description: 'Ingests spaces ENG, ARCH, SEC, and product specifications with Atlassian OAuth2 entitlement mapping.',
    aclGroups: ['confluence-users', 'eng-leads', 'security-auditors'],
  },
  {
    id: 'conn-gdrive',
    name: 'Google Drive Workspace',
    system: 'google_drive',
    status: 'Connected',
    chunks: 28900,
    documents: 610,
    icon: '📁',
    classification: 'Restricted & Internal',
    classificationType: 'restricted',
    lastSync: 'Real-time Webhook',
    syncFrequency: 'Instant Push',
    description: 'Monitors Product Ops, HR Policies, and Financial Audits with Workspace domain ACL resolution.',
    aclGroups: ['drive-finance-readers', 'hr-confidential', 'exec-board'],
  },
  {
    id: 'conn-zendesk',
    name: 'Zendesk Help Center',
    system: 'zendesk',
    status: 'Connected',
    chunks: 8400,
    documents: 185,
    icon: '🎧',
    classification: 'Public',
    classificationType: 'public',
    lastSync: '12 mins ago',
    syncFrequency: 'Hourly Sync',
    description: 'Parses public troubleshooting articles, API endpoints reference, and customer release notes.',
    aclGroups: ['everyone (public)'],
  },
  {
    id: 'conn-slack',
    name: 'Slack Canvas & Markdown Docs',
    system: 'slack',
    status: 'Connected',
    chunks: 5120,
    documents: 94,
    icon: '💬',
    classification: 'Internal',
    classificationType: 'internal',
    lastSync: 'Just now',
    syncFrequency: 'Real-time Socket',
    description: 'Ingests pinned canvas documents from channels #eng-architecture, #security-alerts, and #prod-releases.',
    aclGroups: ['slack-all-employees', 'private-channel-members'],
  },
];

interface WebhookLog {
  id: string;
  connector: string;
  event: string;
  timestamp: string;
  status: '200 OK' | '202 ACK';
}

const INITIAL_WEBHOOK_LOGS: WebhookLog[] = [
  { id: 'evt_901', connector: 'google_drive', event: 'file.updated (GDRIVE-001)', timestamp: '11:38:12', status: '200 OK' },
  { id: 'evt_902', connector: 'slack', event: 'canvas.shared (#eng-architecture)', timestamp: '11:35:40', status: '200 OK' },
  { id: 'evt_903', connector: 'confluence', event: 'page.published (CONF-001)', timestamp: '11:32:05', status: '200 OK' },
  { id: 'evt_904', connector: 'zendesk', event: 'article.created (ZD-002)', timestamp: '11:28:19', status: '200 OK' },
];

export const ConnectorsView: React.FC = () => {
  const [connectors, setConnectors] = useState<ConnectorSource[]>(CONNECTOR_SOURCES);
  const [webhookLogs] = useState<WebhookLog[]>(INITIAL_WEBHOOK_LOGS);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClassification, setSelectedClassification] = useState<string>('all');
  const [syncingId, setSyncingId] = useState<string | null>(null);
  const [isSyncingAll, setIsSyncingAll] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const filteredConnectors = connectors.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          c.system.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          c.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClassification = selectedClassification === 'all' || c.classificationType === selectedClassification;
    return matchesSearch && matchesClassification;
  });

  const totalChunks = 56670;
  const totalDocs = 1231;

  const handleSyncConnector = (id: string, name: string) => {
    setSyncingId(id);
    setTimeout(() => {
      setSyncingId(null);
      setConnectors(prev => prev.map(c => c.id === id ? { ...c, lastSync: 'Just now', status: 'Connected' } : c));
      showToast(`Successfully re-ingested ${name} chunks & refreshed ACL mappings.`);
    }, 1000);
  };

  const handleSyncAll = () => {
    setIsSyncingAll(true);
    setTimeout(() => {
      setIsSyncingAll(false);
      setConnectors(prev => prev.map(c => ({ ...c, lastSync: 'Just now', status: 'Connected' })));
      showToast('All data sources re-ingested & vector index updated successfully.');
    }, 1500);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const getBadgeStyle = (type: ConnectorSource['classificationType']) => {
    switch (type) {
      case 'restricted':
        return 'badge-rose font-bold';
      case 'confidential':
        return 'badge-amber font-bold';
      case 'internal':
        return 'badge-blue font-bold';
      case 'public':
        return 'badge-emerald font-bold';
    }
  };

  const getClassificationIcon = (type: ConnectorSource['classificationType']) => {
    switch (type) {
      case 'restricted':
        return <ShieldAlert className="w-3.5 h-3.5 text-[#E11D48]" />;
      case 'confidential':
        return <Lock className="w-3.5 h-3.5 text-[#D97706]" />;
      case 'internal':
        return <Users className="w-3.5 h-3.5 text-[#2383E2]" />;
      case 'public':
        return <Globe className="w-3.5 h-3.5 text-[#00A884]" />;
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Notion Emerald Hero Container */}
      <div className="notion-block-emerald p-6 md:p-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-[#FFFFFF] border border-[#C1F0E4] text-[#00A884] shadow-2xs">
                <Plug className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-[#000000] tracking-tight flex items-center gap-2">
                  <span>Knowledge Hub & Connectors</span>
                  <span className="px-2.5 py-0.5 rounded-full badge-emerald text-xs font-mono font-bold">
                    4 Operational Integrations
                  </span>
                </h1>
                <p className="text-xs text-[#787774] mt-0.5 font-medium">
                  Manage enterprise data sources, vector index volume, and security classification rules.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSyncAll}
              disabled={isSyncingAll}
              className="px-4 py-2 bg-[#2383E2] hover:bg-[#1D74CB] text-white text-xs font-mono font-bold rounded-lg flex items-center gap-2 shadow-xs transition-all disabled:opacity-50"
            >
              {isSyncingAll ? (
                <RotateCw className="w-4 h-4 text-white animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4 text-white" />
              )}
              <span>{isSyncingAll ? 'Re-Ingesting All Sources...' : 'Re-Ingest All Connectors'}</span>
            </button>
          </div>
        </div>

        {/* Header Stats Bento Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="notion-card p-5 space-y-1">
            <div className="text-xs font-mono text-[#787774] uppercase tracking-wider flex items-center justify-between font-semibold">
              <span>Total Ingested Chunks</span>
              <Layers className="w-4 h-4 text-[#2383E2]" />
            </div>
            <div className="text-3xl font-extrabold text-[#000000] font-mono">
              {totalChunks.toLocaleString()}
            </div>
            <p className="text-[11px] text-[#787774] font-medium">Indexed in vector embedding database</p>
          </div>

          <div className="notion-card p-5 space-y-1">
            <div className="text-xs font-mono text-[#787774] uppercase tracking-wider flex items-center justify-between font-semibold">
              <span>Total Index Documents</span>
              <FileText className="w-4 h-4 text-[#2383E2]" />
            </div>
            <div className="text-3xl font-extrabold text-[#2383E2] font-mono">
              {totalDocs.toLocaleString()}
            </div>
            <p className="text-[11px] text-[#787774] font-medium">Unique source documents processed</p>
          </div>

          <div className="notion-card p-5 space-y-1">
            <div className="text-xs font-mono text-[#787774] uppercase tracking-wider flex items-center justify-between font-semibold">
              <span>Connector Health</span>
              <ShieldCheck className="w-4 h-4 text-[#00A884]" />
            </div>
            <div className="text-3xl font-extrabold text-[#00A884] font-mono">
              100%
            </div>
            <p className="text-[11px] font-mono text-[#00A884] font-bold">100% Operational</p>
          </div>

          <div className="notion-card p-5 space-y-1">
            <div className="text-xs font-mono text-[#787774] uppercase tracking-wider flex items-center justify-between font-semibold">
              <span>ACL Invariant Status</span>
              <Lock className="w-4 h-4 text-[#D97706]" />
            </div>
            <div className="text-3xl font-extrabold text-[#D97706] font-mono">
              ENFORCED
            </div>
            <p className="text-[11px] text-[#787774] font-medium">UnifiedACL sync active on all sources</p>
          </div>
        </div>
      </div>

      {/* Notification Toast */}
      {toastMessage && (
        <div className="p-4 rounded-xl badge-emerald text-xs font-mono flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#00A884]" />
            <span className="font-bold">{toastMessage}</span>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider">ACKNOWLEDGED</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E9E8E4] pb-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#787774] absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search connectors by name, ID, or description..."
            className="w-full bg-[#FFFFFF] border border-[#E9E8E4] rounded-xl pl-10 pr-4 py-2 text-xs font-mono text-[#37352F] focus:outline-none focus:ring-2 focus:ring-[#2383E2] shadow-2xs"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <span className="text-xs font-mono text-[#787774] font-semibold mr-1">Classification:</span>
          {[
            { label: 'All', value: 'all' },
            { label: 'Confidential', value: 'confidential' },
            { label: 'Restricted', value: 'restricted' },
            { label: 'Public', value: 'public' },
            { label: 'Internal', value: 'internal' },
          ].map(tab => (
            <button
              key={tab.value}
              onClick={() => setSelectedClassification(tab.value)}
              className={`px-3 py-1 text-xs font-mono rounded-lg transition-all whitespace-nowrap ${
                selectedClassification === tab.value
                  ? 'bg-[#2383E2] text-white font-bold shadow-2xs'
                  : 'bg-[#F1F0EC] text-[#37352F] hover:bg-[#E3E2E0] border border-[#D9D8D5]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Data Source Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredConnectors.map(c => {
          const isCurrentlySyncing = syncingId === c.id || isSyncingAll;
          return (
            <div
              key={c.id}
              className="notion-card-interactive p-6 space-y-4 group"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center space-x-3.5">
                  <div className="w-12 h-12 rounded-xl bg-[#F7F6F3] border border-[#E9E8E4] flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform">
                    {renderCuteConnectorIcon(c.icon)}
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-[#000000] tracking-tight">{c.name}</h3>
                    <div className="text-xs font-mono text-[#2383E2] font-semibold flex items-center gap-1.5">
                      <span>{c.system}</span>
                      <span className="text-[#787774]">•</span>
                      <span className="text-[#787774] text-[11px]">{c.documents} documents</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1.5">
                  <span className="px-2.5 py-1 rounded-full badge-emerald text-xs font-mono font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#00A884]" />
                    {c.status}
                  </span>
                  <span className="text-[10px] font-mono text-[#787774]">{c.syncFrequency}</span>
                </div>
              </div>

              <p className="text-xs text-[#37352F] leading-relaxed font-medium">
                {c.description}
              </p>

              <div className="p-4 rounded-xl bg-[#F7F6F3] border border-[#E9E8E4] space-y-2.5">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-[#787774] flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-[#2383E2]" />
                    <span>Ingested Chunks:</span>
                  </span>
                  <span className="text-[#000000] font-bold text-sm">
                    {c.chunks.toLocaleString()} chunks
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#787774] font-mono flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#2383E2]" />
                    <span>Security Tag:</span>
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-md text-xs font-mono font-bold flex items-center gap-1.5 ${getBadgeStyle(c.classificationType)}`}>
                    {getClassificationIcon(c.classificationType)}
                    <span>{c.classification}</span>
                  </span>
                </div>
              </div>

              <div className="space-y-1.5 text-xs">
                <div className="text-[11px] font-mono text-[#787774] flex items-center gap-1">
                  <Lock className="w-3 h-3 text-[#D97706]" />
                  <span>Mapped ACL Entitlement Groups:</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {c.aclGroups.map((grp, i) => (
                    <span key={i} className="px-2 py-0.5 rounded-md text-[11px] font-mono bg-[#F1F0EC] text-[#37352F] border border-[#D9D8D5] font-medium">
                      {grp}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-[#E9E8E4] flex items-center justify-between text-xs">
                <span className="text-[11px] font-mono text-[#787774] flex items-center gap-1">
                  <span>Last synced:</span>
                  <strong className="text-[#37352F] font-semibold">{c.lastSync}</strong>
                </span>

                <button
                  onClick={() => handleSyncConnector(c.id, c.name)}
                  disabled={isCurrentlySyncing}
                  className="px-3 py-1 bg-[#F1F0EC] hover:bg-[#E3E2E0] text-[#37352F] font-mono text-xs rounded-lg border border-[#D9D8D5] flex items-center gap-1.5 transition-colors disabled:opacity-50 font-bold active:scale-95 shadow-2xs"
                >
                  {isCurrentlySyncing ? (
                    <RotateCw className="w-3.5 h-3.5 text-[#2383E2] animate-spin" />
                  ) : (
                    <RefreshCw className="w-3.5 h-3.5 text-[#2383E2]" />
                  )}
                  <span>{isCurrentlySyncing ? 'Syncing...' : 'Re-Ingest'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Real-time Webhook Stream Card */}
      <div className="notion-card p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-[#E9E8E4] pb-3">
          <div className="flex items-center space-x-2">
            <Activity className="w-5 h-5 text-[#2383E2]" />
            <h3 className="text-sm font-bold text-[#000000]">Live Webhook Ingestion Log Stream</h3>
          </div>
          <span className="text-[11px] font-mono text-[#00A884] font-bold flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#00A884] animate-pulse"></span>
            Listening on /api/v1/webhooks/:connectorId
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-[#E9E8E4] bg-[#F7F6F3] text-[#787774] uppercase text-[10px] font-bold">
                <th className="py-2.5 px-3">Event ID</th>
                <th className="py-2.5 px-3">Connector</th>
                <th className="py-2.5 px-3">Webhook Event</th>
                <th className="py-2.5 px-3">Time</th>
                <th className="py-2.5 px-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E9E8E4]">
              {webhookLogs.map(log => (
                <tr key={log.id} className="hover:bg-[#F7F6F3]/80 transition-colors">
                  <td className="py-2.5 px-3 font-bold text-[#2383E2]">{log.id}</td>
                  <td className="py-2.5 px-3 font-bold text-[#000000]">{log.connector}</td>
                  <td className="py-2.5 px-3 text-[#37352F]">{log.event}</td>
                  <td className="py-2.5 px-3 text-[#787774]">{log.timestamp}</td>
                  <td className="py-2.5 px-3 text-right">
                    <span className="px-2 py-0.5 rounded-md badge-emerald text-[10px] font-bold">
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
