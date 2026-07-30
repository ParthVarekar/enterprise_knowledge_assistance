import React, { useState } from 'react';
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
  Database, 
  ArrowUpRight, 
  ShieldAlert, 
  Users, 
  ExternalLink,
  Check
} from 'lucide-react';

interface ConnectorSource {
  id: string;
  name: string;
  system: string;
  status: 'Connected' | 'Syncing' | 'Paused';
  chunks: number;
  documents: number;
  icon: string;
  badgeBg: string;
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
    system: 'confluence_cloud',
    status: 'Connected',
    chunks: 14250,
    documents: 342,
    icon: '📘',
    badgeBg: 'from-blue-600 to-indigo-600',
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
    badgeBg: 'from-emerald-600 to-teal-600',
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
    system: 'zendesk_kb',
    status: 'Connected',
    chunks: 8400,
    documents: 185,
    icon: '🎧',
    badgeBg: 'from-amber-600 to-orange-600',
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
    system: 'slack_workspace',
    status: 'Connected',
    chunks: 5120,
    documents: 94,
    icon: '💬',
    badgeBg: 'from-purple-600 to-pink-600',
    classification: 'Internal',
    classificationType: 'internal',
    lastSync: 'Just now',
    syncFrequency: 'Real-time Socket',
    description: 'Ingests pinned canvas documents from channels #eng-architecture, #security-alerts, and #prod-releases.',
    aclGroups: ['slack-all-employees', 'private-channel-members'],
  },
];

export const ConnectorsView: React.FC = () => {
  const [connectors, setConnectors] = useState<ConnectorSource[]>(CONNECTOR_SOURCES);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClassification, setSelectedClassification] = useState<string>('all');
  const [syncingId, setSyncingId] = useState<string | null>(null);
  const [isSyncingAll, setIsSyncingAll] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Filter Connectors
  const filteredConnectors = connectors.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          c.system.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          c.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClassification = selectedClassification === 'all' || c.classificationType === selectedClassification;
    return matchesSearch && matchesClassification;
  });

  // Calculate totals
  const totalChunks = connectors.reduce((acc, curr) => acc + curr.chunks, 0);
  const totalDocs = connectors.reduce((acc, curr) => acc + curr.documents, 0);

  // Individual Sync Handler
  const handleSyncConnector = (id: string, name: string) => {
    setSyncingId(id);
    setTimeout(() => {
      setSyncingId(null);
      setConnectors(prev => prev.map(c => c.id === id ? { ...c, lastSync: 'Just now', status: 'Connected' } : c));
      showToast(`Successfully re-ingested ${name} chunks & refreshed ACL mappings.`);
    }, 1000);
  };

  // Sync All Handler
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
        return 'bg-rose-500/10 text-rose-300 border-rose-500/30';
      case 'confidential':
        return 'bg-purple-500/10 text-purple-300 border-purple-500/30';
      case 'internal':
        return 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30';
      case 'public':
        return 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30';
    }
  };

  const getClassificationIcon = (type: ConnectorSource['classificationType']) => {
    switch (type) {
      case 'restricted':
        return <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />;
      case 'confidential':
        return <Lock className="w-3.5 h-3.5 text-purple-400" />;
      case 'internal':
        return <Users className="w-3.5 h-3.5 text-cyan-400" />;
      case 'public':
        return <Globe className="w-3.5 h-3.5 text-emerald-400" />;
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Plug className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-100 tracking-tight flex items-center gap-2">
                <span>Enterprise Knowledge Sources & Connectors</span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                  4 Active Integrations
                </span>
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                Manage registered data sources, monitor ingested vector chunk counts, and inspect security clearance classification badges.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSyncAll}
            disabled={isSyncingAll}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono font-semibold rounded-xl border border-slate-700 flex items-center gap-2 shadow-lg transition-all disabled:opacity-50"
          >
            {isSyncingAll ? (
              <RotateCw className="w-4 h-4 text-cyan-400 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4 text-cyan-400" />
            )}
            <span>{isSyncingAll ? 'Re-Ingesting All Sources...' : 'Re-Ingest All Connectors'}</span>
          </button>
        </div>
      </div>

      {/* Notification Toast */}
      {toastMessage && (
        <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 text-xs font-mono flex items-center justify-between shadow-xl animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
          <span className="text-[10px] text-emerald-400 font-bold">ACKNOWLEDGED</span>
        </div>
      )}

      {/* Aggregate Metrics Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-1">
          <div className="text-xs font-mono text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>Total Ingested Chunks</span>
            <Layers className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-3xl font-bold text-slate-100 font-mono">
            {totalChunks.toLocaleString()}
          </div>
          <p className="text-[11px] text-slate-400">Indexed in vector embedding database</p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-1">
          <div className="text-xs font-mono text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>Total Index Documents</span>
            <FileText className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-3xl font-bold text-purple-300 font-mono">
            {totalDocs.toLocaleString()}
          </div>
          <p className="text-[11px] text-slate-400">Unique source documents processed</p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-1">
          <div className="text-xs font-mono text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>Connector Health</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-bold text-emerald-400 font-mono">
            100%
          </div>
          <p className="text-[11px] text-emerald-400 font-mono">All 4 pipelines operational</p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-1">
          <div className="text-xs font-mono text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>ACL Invariant Status</span>
            <Lock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-bold text-amber-300 font-mono">
            ENFORCED
          </div>
          <p className="text-[11px] text-slate-400">UnifiedACL sync active on all sources</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search connectors by name, ID, or description..."
            className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-4 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500 transition-colors"
          />
        </div>

        {/* Security Classification Pill Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <span className="text-xs font-mono text-slate-400 font-semibold mr-1">Classification:</span>
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
              className={`px-3 py-1 text-xs font-mono rounded-lg transition-colors whitespace-nowrap ${
                selectedClassification === tab.value
                  ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
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
              className="glass-panel p-6 rounded-2xl border border-slate-700/80 space-y-4 shadow-xl hover:border-slate-600 transition-all group"
            >
              {/* Card Top Row: Header & Status */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center space-x-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-700 flex items-center justify-center text-2xl shadow-inner group-hover:scale-105 transition-transform">
                    {c.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-slate-100 tracking-tight">{c.name}</h3>
                    <div className="text-xs font-mono text-cyan-400 flex items-center gap-1.5">
                      <span>{c.system}</span>
                      <span className="text-slate-600">•</span>
                      <span className="text-slate-400 text-[11px]">{c.documents} documents</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1.5">
                  <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-semibold flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {c.status}
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">{c.syncFrequency}</span>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-slate-300 leading-relaxed">
                {c.description}
              </p>

              {/* Key Metrics: Ingested Chunks & Security Classification Badge */}
              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Ingested Chunks:</span>
                  </span>
                  <span className="text-slate-100 font-bold text-sm">
                    {c.chunks.toLocaleString()} chunks
                  </span>
                </div>

                {/* Security Classification Badge */}
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-mono flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
                    <span>Security Classification:</span>
                  </span>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-mono font-bold border flex items-center gap-1.5 ${getBadgeStyle(c.classificationType)}`}>
                    {getClassificationIcon(c.classificationType)}
                    <span>{c.classification}</span>
                  </span>
                </div>
              </div>

              {/* ACL Group Entitlements Pill Mapping */}
              <div className="space-y-1.5 text-xs">
                <div className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                  <Lock className="w-3 h-3 text-amber-400" />
                  <span>Mapped ACL Entitlement Groups:</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {c.aclGroups.map((grp, i) => (
                    <span key={i} className="px-2 py-0.5 rounded text-[11px] font-mono bg-slate-900 text-slate-300 border border-slate-800">
                      {grp}
                    </span>
                  ))}
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-[11px] font-mono text-slate-500 flex items-center gap-1">
                  <span>Last synced:</span>
                  <strong className="text-slate-300 font-normal">{c.lastSync}</strong>
                </span>

                <button
                  onClick={() => handleSyncConnector(c.id, c.name)}
                  disabled={isCurrentlySyncing}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono text-xs rounded-lg border border-slate-700 flex items-center gap-1.5 transition-colors disabled:opacity-50"
                >
                  {isCurrentlySyncing ? (
                    <RotateCw className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
                  ) : (
                    <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
                  )}
                  <span>{isCurrentlySyncing ? 'Syncing...' : 'Re-Ingest'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
