import React, { useState } from 'react';
import { 
  Activity, 
  Search, 
  ShieldAlert, 
  ChevronDown, 
  ChevronRight, 
  Download, 
  AlertTriangle,
  Zap
} from 'lucide-react';

interface AuditEvent {
  id: string;
  timestamp: string;
  action: 'QUERY' | 'RETRIEVAL' | 'ACL_DENY' | 'ABSTAIN';
  actor: string;
  actorRole: string;
  tenantId: string;
  traceId: string;
  latencyMs: number;
  details: {
    queryText?: string;
    candidatesFound?: number;
    confidenceScore?: number;
    reason?: string;
    matchedDocId?: string;
  };
}

const INITIAL_AUDIT_EVENTS: AuditEvent[] = [
  {
    id: 'aud_101',
    timestamp: '11:28:02.145',
    action: 'QUERY',
    actor: 'Alex Vance',
    actorRole: 'Staff Infrastructure Engineer (L4)',
    tenantId: 'acme-corp',
    traceId: 'tr_8f912a',
    latencyMs: 34.2,
    details: { queryText: 'What is the API gateway token bucket rate limit?' },
  },
  {
    id: 'aud_102',
    timestamp: '11:28:02.180',
    action: 'RETRIEVAL',
    actor: 'Alex Vance',
    actorRole: 'Staff Infrastructure Engineer (L4)',
    tenantId: 'acme-corp',
    traceId: 'tr_8f912a',
    latencyMs: 18.5,
    details: { candidatesFound: 3, matchedDocId: 'CONF-001' },
  },
  {
    id: 'aud_103',
    timestamp: '11:25:44.912',
    action: 'ACL_DENY',
    actor: 'Jordan Miller',
    actorRole: 'External Vendor (L1)',
    tenantId: 'acme-corp',
    traceId: 'tr_3a109c',
    latencyMs: 12.1,
    details: { 
      queryText: 'Fetch customer Data Processing Agreement (DPA)',
      reason: 'Zero-Trust Level Restriction: User operates at L1 Public, document requires L4+ Clearance.'
    },
  },
  {
    id: 'aud_104',
    timestamp: '11:22:10.050',
    action: 'ABSTAIN',
    actor: 'Marcus Chen',
    actorRole: 'Lead Product Manager (L3)',
    tenantId: 'acme-corp',
    traceId: 'tr_77b4e1',
    latencyMs: 42.8,
    details: { 
      queryText: 'What is the internal production database encryption key?',
      reason: 'Insufficient evidence & confidential classification boundaries.'
    },
  },
  {
    id: 'aud_105',
    timestamp: '11:18:30.820',
    action: 'QUERY',
    actor: 'Elena Rostova',
    actorRole: 'General Counsel (L5)',
    tenantId: 'acme-corp',
    traceId: 'tr_99a11f',
    latencyMs: 31.0,
    details: { queryText: 'Review customer Data Processing Agreement retention rules.' },
  },
  {
    id: 'aud_106',
    timestamp: '11:18:30.855',
    action: 'RETRIEVAL',
    actor: 'Elena Rostova',
    actorRole: 'General Counsel (L5)',
    tenantId: 'acme-corp',
    traceId: 'tr_99a11f',
    latencyMs: 22.4,
    details: { candidatesFound: 1, matchedDocId: 'GDRIVE-002' },
  },
];

export const AuditLedgerView: React.FC = () => {
  const [events] = useState<AuditEvent[]>(INITIAL_AUDIT_EVENTS);
  const [activeFilter, setActiveFilter] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});

  const toggleRow = (id: string) => {
    setExpandedRows(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredEvents = events.filter(e => {
    const matchesFilter = activeFilter === 'ALL' || e.action === activeFilter;
    const matchesSearch = e.actor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          e.traceId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (e.details.queryText && e.details.queryText.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const getActionBadge = (action: AuditEvent['action']) => {
    switch (action) {
      case 'QUERY':
        return 'badge-blue font-bold';
      case 'RETRIEVAL':
        return 'badge-emerald font-bold';
      case 'ACL_DENY':
        return 'badge-rose font-bold';
      case 'ABSTAIN':
        return 'badge-amber font-bold';
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 notion-card p-6">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#EAF2FF] border border-[#BCE0FD] text-[#2383E2] shadow-2xs">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#000000] tracking-tight flex items-center gap-2">
                <span>Compliance Audit Ledger</span>
                <span className="px-2.5 py-0.5 rounded-full badge-emerald text-xs font-mono font-bold">
                  Immutable Log
                </span>
              </h1>
              <p className="text-xs text-[#787774] mt-0.5 font-medium">
                Cryptographically trace query access events, live ACL enforcement decisions, and abstention logs.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => alert('Audit Ledger Exported as JSON')}
          className="px-4 py-2 bg-[#F1F0EC] hover:bg-[#E3E2E0] text-[#37352F] text-xs font-mono font-bold rounded-lg border border-[#D9D8D5] flex items-center gap-2 shadow-2xs transition-all active:scale-95 self-start md:self-auto"
        >
          <Download className="w-4 h-4 text-[#2383E2]" />
          <span>Export Audit Ledger JSON</span>
        </button>
      </div>

      {/* Stream Analytics Ribbon */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="notion-card p-5 space-y-1">
          <div className="text-xs font-mono text-[#787774] uppercase tracking-wider font-semibold flex items-center justify-between">
            <span>Total Events Logged</span>
            <Activity className="w-4 h-4 text-[#2383E2]" />
          </div>
          <div className="text-3xl font-extrabold text-[#000000] font-mono">
            1,482
          </div>
          <p className="text-[11px] text-[#787774] font-medium">Recorded in session memory</p>
        </div>

        <div className="notion-card p-5 space-y-1">
          <div className="text-xs font-mono text-[#787774] uppercase tracking-wider font-semibold flex items-center justify-between">
            <span>Denial Rate (ACL)</span>
            <ShieldAlert className="w-4 h-4 text-[#E11D48]" />
          </div>
          <div className="text-3xl font-extrabold text-[#E11D48] font-mono">
            4.2%
          </div>
          <p className="text-[11px] text-[#787774] font-medium">Enforced by Zero-Trust Level Gate</p>
        </div>

        <div className="notion-card p-5 space-y-1">
          <div className="text-xs font-mono text-[#787774] uppercase tracking-wider font-semibold flex items-center justify-between">
            <span>Abstention Rate</span>
            <AlertTriangle className="w-4 h-4 text-[#D97706]" />
          </div>
          <div className="text-3xl font-extrabold text-[#D97706] font-mono">
            1.1%
          </div>
          <p className="text-[11px] text-[#787774] font-medium">Triggered for low evidence confidence</p>
        </div>

        <div className="notion-card p-5 space-y-1">
          <div className="text-xs font-mono text-[#787774] uppercase tracking-wider font-semibold flex items-center justify-between">
            <span>Mean Pipeline Latency</span>
            <Zap className="w-4 h-4 text-[#00A884]" />
          </div>
          <div className="text-3xl font-extrabold text-[#00A884] font-mono">
            34ms
          </div>
          <p className="text-[11px] text-[#787774] font-medium">Average end-to-end evaluation time</p>
        </div>
      </div>

      {/* Filter and Search Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E9E8E4] pb-4">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#787774] absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search by actor, trace ID, or query text..."
            className="w-full bg-[#FFFFFF] border border-[#E9E8E4] rounded-xl pl-10 pr-4 py-2 text-xs font-mono text-[#37352F] focus:outline-none focus:ring-2 focus:ring-[#2383E2] shadow-2xs"
          />
        </div>

        {/* Action Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <span className="text-xs font-mono text-[#787774] font-semibold mr-1">Event Type:</span>
          {['ALL', 'QUERY', 'RETRIEVAL', 'ACL_DENY', 'ABSTAIN'].map(act => (
            <button
              key={act}
              onClick={() => setActiveFilter(act)}
              className={`px-3 py-1 text-xs font-mono rounded-lg transition-all whitespace-nowrap ${
                activeFilter === act
                  ? 'bg-[#2383E2] text-white font-bold shadow-2xs'
                  : 'bg-[#F1F0EC] text-[#37352F] hover:bg-[#E3E2E0] border border-[#D9D8D5]'
              }`}
            >
              {act}
            </button>
          ))}
        </div>
      </div>

      {/* Real-Time Event Table */}
      <div className="overflow-x-auto notion-card overflow-hidden">
        <table className="w-full text-left text-xs font-mono">
          <thead>
            <tr className="border-b border-[#E9E8E4] bg-[#F7F6F3] text-[#787774] uppercase text-[10px] font-bold">
              <th className="py-3 px-4">Timestamp</th>
              <th className="py-3 px-4">Event Type</th>
              <th className="py-3 px-4">Actor Persona</th>
              <th className="py-3 px-4">Trace ID</th>
              <th className="py-3 px-4 text-right">Latency</th>
              <th className="py-3 px-4 text-center">Trace Data</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E9E8E4]">
            {filteredEvents.map(event => {
              const isExpanded = expandedRows[event.id];
              return (
                <React.Fragment key={event.id}>
                  <tr
                    onClick={() => toggleRow(event.id)}
                    className="hover:bg-[#F7F6F3]/80 transition-colors cursor-pointer"
                  >
                    <td className="py-3 px-4 text-[#37352F] font-bold">{event.timestamp}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-mono ${getActionBadge(event.action)}`}>
                        {event.action}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-[#000000]">{event.actor}</div>
                      <div className="text-[10px] text-[#787774] font-sans">{event.actorRole}</div>
                    </td>
                    <td className="py-3 px-4 text-[#2383E2] font-semibold">{event.traceId}</td>
                    <td className="py-3 px-4 text-right text-[#37352F] font-bold">{event.latencyMs}ms</td>
                    <td className="py-3 px-4 text-center">
                      <button className="text-[#787774] hover:text-[#37352F] transition-colors p-1">
                        {isExpanded ? <ChevronDown className="w-4 h-4 text-[#2383E2]" /> : <ChevronRight className="w-4 h-4" />}
                      </button>
                    </td>
                  </tr>

                  {/* Expandable Raw Event Trace Row */}
                  {isExpanded && (
                    <tr className="bg-[#F7F6F3]">
                      <td colSpan={6} className="p-4 border-t border-[#E9E8E4]">
                        <div className="p-4 rounded-xl bg-[#FFFFFF] border border-[#E9E8E4] text-[#37352F] font-mono text-xs space-y-1 shadow-2xs">
                          <div className="text-[10px] text-[#2383E2] uppercase tracking-wider font-bold mb-1">
                            Raw Audit Log Record [{event.id}]
                          </div>
                          <pre className="text-[#37352F] text-[11px] overflow-x-auto leading-relaxed">
                            {JSON.stringify(event, null, 2)}
                          </pre>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
