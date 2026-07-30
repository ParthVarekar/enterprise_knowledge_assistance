import React, { useState } from 'react';
import { 
  Activity, 
  Search, 
  Filter, 
  ShieldAlert, 
  ShieldCheck, 
  Clock, 
  FileText, 
  ChevronDown, 
  ChevronRight, 
  Download, 
  RefreshCw, 
  Database, 
  CheckCircle2, 
  AlertTriangle,
  Zap,
  BarChart3
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
  const [events, setEvents] = useState<AuditEvent[]>(INITIAL_AUDIT_EVENTS);
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
        return 'badge-indigo font-bold';
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 light-card p-6 shadow-sm">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-600 shadow-2xs">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                <span>Compliance Audit Ledger</span>
                <span className="px-2.5 py-0.5 rounded-full badge-emerald text-xs font-mono font-bold">
                  Immutable Log
                </span>
              </h1>
              <p className="text-xs text-slate-500 mt-0.5 font-medium">
                Cryptographically trace query access events, live ACL enforcement decisions, and abstention logs.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => alert('Audit Ledger Exported as JSON')}
          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-mono font-bold rounded-lg border border-slate-300 flex items-center gap-2 shadow-2xs transition-all active:scale-95 self-start md:self-auto"
        >
          <Download className="w-4 h-4 text-indigo-600" />
          <span>Export Audit Ledger JSON</span>
        </button>
      </div>

      {/* Stream Analytics Ribbon Spec */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="light-card p-5 bg-white border border-slate-200 shadow-sm space-y-1">
          <div className="text-xs font-mono text-slate-500 uppercase tracking-wider font-semibold flex items-center justify-between">
            <span>Total Events Logged</span>
            <Activity className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 font-mono">
            {events.length}
          </div>
          <p className="text-[11px] text-slate-500 font-medium">Recorded in session memory</p>
        </div>

        <div className="light-card p-5 bg-white border border-slate-200 shadow-sm space-y-1">
          <div className="text-xs font-mono text-slate-500 uppercase tracking-wider font-semibold flex items-center justify-between">
            <span>Denial Rate (ACL)</span>
            <ShieldAlert className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-3xl font-extrabold text-rose-600 font-mono">
            16.6%
          </div>
          <p className="text-[11px] text-slate-500 font-medium">Enforced by Zero-Trust Level Gate</p>
        </div>

        <div className="light-card p-5 bg-white border border-slate-200 shadow-sm space-y-1">
          <div className="text-xs font-mono text-slate-500 uppercase tracking-wider font-semibold flex items-center justify-between">
            <span>Abstention Rate</span>
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-3xl font-extrabold text-amber-600 font-mono">
            16.6%
          </div>
          <p className="text-[11px] text-slate-500 font-medium">Triggered for low evidence confidence</p>
        </div>

        <div className="light-card p-5 bg-white border border-slate-200 shadow-sm space-y-1">
          <div className="text-xs font-mono text-slate-500 uppercase tracking-wider font-semibold flex items-center justify-between">
            <span>Mean Pipeline Latency</span>
            <Zap className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-extrabold text-emerald-600 font-mono">
            34ms
          </div>
          <p className="text-[11px] text-slate-500 font-medium">Average end-to-end evaluation time</p>
        </div>
      </div>

      {/* Filter and Search Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search by actor, trace ID, or query text..."
            className="w-full bg-white border border-slate-200 rounded-lg pl-10 pr-4 py-2 text-xs font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-2xs"
          />
        </div>

        {/* Action Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <span className="text-xs font-mono text-slate-500 font-semibold mr-1">Event Type:</span>
          {['ALL', 'QUERY', 'RETRIEVAL', 'ACL_DENY', 'ABSTAIN'].map(act => (
            <button
              key={act}
              onClick={() => setActiveFilter(act)}
              className={`px-3 py-1 text-xs font-mono rounded-lg transition-all whitespace-nowrap ${
                activeFilter === act
                  ? 'bg-indigo-600 text-white font-bold shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              {act}
            </button>
          ))}
        </div>
      </div>

      {/* Real-Time Event Table Spec (Monospace Light Table) */}
      <div className="overflow-x-auto bg-white rounded-xl border border-slate-200 shadow-sm">
        <table className="w-full text-left text-xs font-mono">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 uppercase text-[10px] font-bold">
              <th className="py-3 px-4">Timestamp</th>
              <th className="py-3 px-4">Event Type</th>
              <th className="py-3 px-4">Actor Persona</th>
              <th className="py-3 px-4">Trace ID</th>
              <th className="py-3 px-4 text-right">Latency</th>
              <th className="py-3 px-4 text-center">Trace Data</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredEvents.map(event => {
              const isExpanded = expandedRows[event.id];
              return (
                <React.Fragment key={event.id}>
                  <tr
                    onClick={() => toggleRow(event.id)}
                    className="hover:bg-slate-50/80 transition-colors cursor-pointer"
                  >
                    <td className="py-3 px-4 text-slate-600 font-bold">{event.timestamp}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2.5 py-0.5 rounded text-[10px] font-mono ${getActionBadge(event.action)}`}>
                        {event.action}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{event.actor}</div>
                      <div className="text-[10px] text-slate-500 font-sans">{event.actorRole}</div>
                    </td>
                    <td className="py-3 px-4 text-indigo-600 font-semibold">{event.traceId}</td>
                    <td className="py-3 px-4 text-right text-slate-700 font-bold">{event.latencyMs}ms</td>
                    <td className="py-3 px-4 text-center">
                      <button className="text-slate-400 hover:text-slate-700 transition-colors p-1">
                        {isExpanded ? <ChevronDown className="w-4 h-4 text-indigo-600" /> : <ChevronRight className="w-4 h-4" />}
                      </button>
                    </td>
                  </tr>

                  {/* Expandable Raw Event Trace Row */}
                  {isExpanded && (
                    <tr className="bg-slate-50">
                      <td colSpan={6} className="p-4 border-t border-slate-200">
                        <div className="p-3 rounded-lg bg-slate-900 text-slate-100 font-mono text-xs space-y-1 shadow-inner border border-slate-800">
                          <div className="text-[10px] text-[#cbb7fb] uppercase tracking-wider font-bold mb-1">
                            Raw Audit Log Record [{event.id}]
                          </div>
                          <pre className="text-slate-200 text-[11px] overflow-x-auto leading-relaxed">
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
