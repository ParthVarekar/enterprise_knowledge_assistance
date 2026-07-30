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
    system: 'confluence_cloud',
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
    system: 'zendesk_kb',
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
    system: 'slack_workspace',
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

export const ConnectorsView: React.FC = () => {
  const [connectors, setConnectors] = useState<ConnectorSource[]>(CONNECTOR_SOURCES);
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

  const totalChunks = 56670; // High density Bento Spec metric
  const totalDocs = 1231;   // High density Bento Spec metric

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
        return 'badge-indigo font-bold';
      case 'public':
        return 'badge-emerald font-bold';
    }
  };

  const getClassificationIcon = (type: ConnectorSource['classificationType']) => {
    switch (type) {
      case 'restricted':
        return <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />;
      case 'confidential':
        return <Lock className="w-3.5 h-3.5 text-amber-600" />;
      case 'internal':
        return <Users className="w-3.5 h-3.5 text-indigo-600" />;
      case 'public':
        return <Globe className="w-3.5 h-3.5 text-emerald-600" />;
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 light-card p-6 shadow-sm">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-600 shadow-2xs">
              <Plug className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                <span>Knowledge Hub & Connectors</span>
                <span className="px-2.5 py-0.5 rounded-full badge-emerald text-xs font-mono font-bold">
                  4 Operational Integrations
                </span>
              </h1>
              <p className="text-xs text-slate-500 mt-0.5 font-medium">
                Manage enterprise data sources, vector index volume, and security classification rules.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSyncAll}
            disabled={isSyncingAll}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-mono font-bold rounded-lg flex items-center gap-2 shadow-sm transition-all disabled:opacity-50"
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

      {/* Notification Toast */}
      {toastMessage && (
        <div className="p-4 rounded-xl badge-emerald text-xs font-mono flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span className="font-bold">{toastMessage}</span>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider">ACKNOWLEDGED</span>
        </div>
      )}

      {/* Header Stats Bento Grid (High-Density 4-Column Layout Spec) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Stat 1: Total Ingested Chunks */}
        <div className="light-card p-5 space-y-1 bg-white border border-slate-200 shadow-sm">
          <div className="text-xs font-mono text-slate-500 uppercase tracking-wider flex items-center justify-between font-semibold">
            <span>Total Ingested Chunks</span>
            <Layers className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 font-mono">
            {totalChunks.toLocaleString()}
          </div>
          <p className="text-[11px] text-slate-500 font-medium">Indexed in vector embedding database</p>
        </div>

        {/* Stat 2: Total Index Documents */}
        <div className="light-card p-5 space-y-1 bg-white border border-slate-200 shadow-sm">
          <div className="text-xs font-mono text-slate-500 uppercase tracking-wider flex items-center justify-between font-semibold">
            <span>Total Index Documents</span>
            <FileText className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-3xl font-extrabold text-blue-600 font-mono">
            {totalDocs.toLocaleString()}
          </div>
          <p className="text-[11px] text-slate-500 font-medium">Unique source documents processed</p>
        </div>

        {/* Stat 3: Connector Health */}
        <div className="light-card p-5 space-y-1 bg-white border border-slate-200 shadow-sm">
          <div className="text-xs font-mono text-slate-500 uppercase tracking-wider flex items-center justify-between font-semibold">
            <span>Connector Health</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-extrabold text-emerald-600 font-mono">
            100%
          </div>
          <p className="text-[11px] font-mono text-emerald-700 font-bold">100% Operational</p>
        </div>

        {/* Stat 4: ACL Invariant Status */}
        <div className="light-card p-5 space-y-1 bg-white border border-slate-200 shadow-sm">
          <div className="text-xs font-mono text-slate-500 uppercase tracking-wider flex items-center justify-between font-semibold">
            <span>ACL Invariant Status</span>
            <Lock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-3xl font-extrabold text-amber-600 font-mono">
            ENFORCED
          </div>
          <p className="text-[11px] text-slate-500 font-medium">UnifiedACL sync active on all sources</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search connectors by name, ID, or description..."
            className="w-full bg-white border border-slate-200 rounded-lg pl-10 pr-4 py-2 text-xs font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-2xs"
          />
        </div>

        {/* Security Classification Pill Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <span className="text-xs font-mono text-slate-500 font-semibold mr-1">Classification:</span>
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
                  ? 'bg-indigo-600 text-white font-bold shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Data Source Cards Grid (White Cards with Hover Elevation) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredConnectors.map(c => {
          const isCurrentlySyncing = syncingId === c.id || isSyncingAll;
          return (
            <div
              key={c.id}
              className="bg-white p-6 rounded-xl border border-slate-200 space-y-4 shadow-sm hover:border-indigo-300 hover:shadow-md transition-all group"
            >
              {/* Card Top Row: Header & Status */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center space-x-3.5">
                  <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform">
                    {renderCuteConnectorIcon(c.icon)}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base text-slate-900 tracking-tight">{c.name}</h3>
                    <div className="text-xs font-mono text-indigo-600 font-semibold flex items-center gap-1.5">
                      <span>{c.system}</span>
                      <span className="text-slate-300">•</span>
                      <span className="text-slate-500 text-[11px]">{c.documents} documents</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1.5">
                  <span className="px-2.5 py-1 rounded-full badge-emerald text-xs font-mono font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    {c.status}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">{c.syncFrequency}</span>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                {c.description}
              </p>

              {/* Key Metrics */}
              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-2.5">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-500 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Ingested Chunks:</span>
                  </span>
                  <span className="text-slate-900 font-extrabold text-sm">
                    {c.chunks.toLocaleString()} chunks
                  </span>
                </div>

                {/* Security Classification Tag */}
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-mono flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Security Tag:</span>
                  </span>
                  <span className={`px-2.5 py-0.5 rounded text-xs font-mono font-bold flex items-center gap-1.5 ${getBadgeStyle(c.classificationType)}`}>
                    {getClassificationIcon(c.classificationType)}
                    <span>{c.classification}</span>
                  </span>
                </div>
              </div>

              {/* ACL Group Entitlements Pill Mapping */}
              <div className="space-y-1.5 text-xs">
                <div className="text-[11px] font-mono text-slate-500 flex items-center gap-1">
                  <Lock className="w-3 h-3 text-amber-600" />
                  <span>Mapped ACL Entitlement Groups:</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {c.aclGroups.map((grp, i) => (
                    <span key={i} className="px-2 py-0.5 rounded text-[11px] font-mono bg-slate-100 text-slate-700 border border-slate-200 font-medium">
                      {grp}
                    </span>
                  ))}
                </div>
              </div>

              {/* Card Footer Actions: Actionable Re-Ingest Micro Button */}
              <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-xs">
                <span className="text-[11px] font-mono text-slate-500 flex items-center gap-1">
                  <span>Last synced:</span>
                  <strong className="text-slate-800 font-semibold">{c.lastSync}</strong>
                </span>

                <button
                  onClick={() => handleSyncConnector(c.id, c.name)}
                  disabled={isCurrentlySyncing}
                  className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 font-mono text-xs rounded border border-slate-300 flex items-center gap-1.5 transition-colors disabled:opacity-50 font-bold active:scale-95 shadow-2xs"
                >
                  {isCurrentlySyncing ? (
                    <RotateCw className="w-3.5 h-3.5 text-indigo-600 animate-spin" />
                  ) : (
                    <RefreshCw className="w-3.5 h-3.5 text-indigo-600" />
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
