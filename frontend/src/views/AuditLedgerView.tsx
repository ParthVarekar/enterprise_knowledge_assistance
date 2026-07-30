import React, { useState } from 'react';
import { 
  Activity, 
  ShieldAlert, 
  Filter, 
  Download, 
  Search, 
  Copy, 
  Check, 
  Eye, 
  Radio, 
  Terminal, 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  X, 
  Layers, 
  ChevronRight 
} from 'lucide-react';

type AuditAction = 'query' | 'acl_deny' | 'answer_served' | 'abstain' | 'invariant_check' | 'retrieval';

interface AuditLogEntry {
  id: string;
  time: string;
  action: AuditAction;
  actor: string;
  details: string;
  trace: string;
  latencyMs: number;
  ipOrigin: string;
  classification: string;
  rawPayload: Record<string, any>;
}

const INITIAL_LOGS: AuditLogEntry[] = [
  {
    id: 'aud-01',
    time: '11:28:02.145',
    action: 'query',
    actor: 'alex.vance@acme.com',
    details: 'User prompt: "API gateway rate limiting and architecture specifications"',
    trace: 'q_172232_a1',
    latencyMs: 14,
    ipOrigin: '192.168.1.104 (VPN)',
    classification: 'Confidential',
    rawPayload: {
      query_id: 'q_172232_a1',
      user_guid: 'user-101',
      tenant_id: 'tenant-acme-corp',
      user_groups: ['engineering', 'devops'],
      embedding_dim: 1536,
      top_k: 5,
    },
  },
  {
    id: 'aud-02',
    time: '11:28:02.320',
    action: 'retrieval',
    actor: 'alex.vance@acme.com',
    details: 'Vector engine retrieved 3 candidate chunks from Confluence & Drive (Similarity: 0.91)',
    trace: 'q_172232_a1',
    latencyMs: 38,
    ipOrigin: '192.168.1.104 (VPN)',
    classification: 'Confidential',
    rawPayload: {
      candidate_chunks: ['CONF-ARCH-001', 'CONF-ARCH-004', 'GDRIVE-OPS-102'],
      acl_filtered: 0,
      min_score: 0.84,
    },
  },
  {
    id: 'aud-03',
    time: '11:28:02.890',
    action: 'answer_served',
    actor: 'alex.vance@acme.com',
    details: 'Served synthesized answer with 3 grounded citations (Confidence score: 94%)',
    trace: 'q_172232_a1',
    latencyMs: 120,
    ipOrigin: '192.168.1.104 (VPN)',
    classification: 'Confidential',
    rawPayload: {
      prompt_tokens: 412,
      completion_tokens: 185,
      groundedness_score: 0.94,
      citation_count: 3,
    },
  },
  {
    id: 'aud-04',
    time: '11:28:45.012',
    action: 'query',
    actor: 'jordan.vendor@external.com',
    details: 'User prompt: "Customer Data Processing Agreement & Financial Audit Records"',
    trace: 'q_172232_b2',
    latencyMs: 12,
    ipOrigin: '203.0.113.45 (External IP)',
    classification: 'Restricted',
    rawPayload: {
      query_id: 'q_172232_b2',
      user_guid: 'jordan.vendor@external.com',
      tenant_id: 'tenant-external-inc',
      user_groups: ['contractor'],
      embedding_dim: 1536,
      top_k: 5,
    },
  },
  {
    id: 'aud-05',
    time: '11:28:45.045',
    action: 'acl_deny',
    actor: 'jordan.vendor@external.com',
    details: 'Blocked chunk GDRIVE-FINANCE-002 (Restricted Classification & Cross-Tenant Policy)',
    trace: 'q_172232_b2',
    latencyMs: 8,
    ipOrigin: '203.0.113.45 (External IP)',
    classification: 'Restricted',
    rawPayload: {
      blocked_chunk: 'GDRIVE-FINANCE-002',
      reason: 'Cross-Tenant Boundary & Restricted Security Clearance Requirement FAILED',
      enforced_rule: 'StrictTenantIsolation & ClearanceRankCheck',
    },
  },
  {
    id: 'aud-06',
    time: '11:28:45.080',
    action: 'abstain',
    actor: 'jordan.vendor@external.com',
    details: 'Abstained answer generation due to zero accessible chunks under UnifiedACL policy',
    trace: 'q_172232_b2',
    latencyMs: 15,
    ipOrigin: '203.0.113.45 (External IP)',
    classification: 'Restricted',
    rawPayload: {
      abstain_reason: 'No accessible vector chunks remaining after Zero-Trust ACL evaluation',
      action_taken: 'Returned standard non-disclosure policy abstention response',
    },
  },
  {
    id: 'aud-07',
    time: '11:29:10.550',
    action: 'invariant_check',
    actor: 'system-aegis-qa',
    details: 'Continuous verification: Passed Security Symmetry Invariant (200 random trials)',
    trace: 'qa_inv_99',
    latencyMs: 42,
    ipOrigin: '127.0.0.1 (Local Daemon)',
    classification: 'System Verification',
    rawPayload: {
      suite_name: 'AegisQA Property Test',
      invariant: 'SecuritySymmetryInvariant',
      iterations_passed: 200,
      mutants_killed: 3,
    },
  },
];

export const AuditLedgerView: React.FC = () => {
  const [logs] = useState<AuditLogEntry[]>(INITIAL_LOGS);
  const [activeFilterTab, setActiveFilterTab] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedLog, setSelectedLog] = useState<AuditLogEntry | null>(null);
  const [copiedTrace, setCopiedTrace] = useState<string | null>(null);

  // Filter logs based on tab and search keyword
  const filteredLogs = logs.filter(log => {
    // Action tab filter
    let matchesTab = true;
    if (activeFilterTab !== 'all') {
      if (activeFilterTab === 'abstain') {
        matchesTab = log.action === 'abstain';
      } else {
        matchesTab = log.action === activeFilterTab;
      }
    }

    // Text search filter
    const matchesSearch = 
      log.actor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.trace.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.id.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesTab && matchesSearch;
  });

  const handleCopyTrace = (trace: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(trace);
    setCopiedTrace(trace);
    setTimeout(() => setCopiedTrace(null), 2000);
  };

  const getActionBadgeStyle = (action: AuditAction) => {
    switch (action) {
      case 'acl_deny':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/40 font-bold';
      case 'abstain':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40 font-bold';
      case 'answer_served':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      case 'query':
        return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40';
      case 'retrieval':
        return 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40';
      case 'invariant_check':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/40';
    }
  };

  const counts = {
    all: logs.length,
    query: logs.filter(l => l.action === 'query').length,
    acl_deny: logs.filter(l => l.action === 'acl_deny').length,
    answer_served: logs.filter(l => l.action === 'answer_served').length,
    abstain: logs.filter(l => l.action === 'abstain').length,
    invariant_check: logs.filter(l => l.action === 'invariant_check').length,
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-100 tracking-tight flex items-center gap-2">
                <span>Immutable Compliance Audit Ledger</span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  LIVE STREAMING
                </span>
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                High-density real-time audit stream recording every query execution, ACL denial, grounded answer, and security check with trace IDs.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => alert('Exporting audit log snapshot as JSON...')}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono rounded-xl border border-slate-700 flex items-center gap-2 transition-colors"
          >
            <Download className="w-4 h-4 text-cyan-400" />
            <span>Export Audit Stream</span>
          </button>
        </div>
      </div>

      {/* Aggregate Stats Summary Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="glass-panel p-4 rounded-xl border border-slate-800">
          <div className="text-[11px] font-mono text-slate-400">Total Events Logged</div>
          <div className="text-2xl font-bold text-slate-100 font-mono mt-0.5">1,420</div>
          <div className="text-[10px] text-cyan-400 mt-0.5 font-mono">100% Cryptographically Signed</div>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-slate-800">
          <div className="text-[11px] font-mono text-slate-400">ACL Denial Rate</div>
          <div className="text-2xl font-bold text-rose-400 font-mono mt-0.5">4.2%</div>
          <div className="text-[10px] text-rose-300 mt-0.5 font-mono">Explicit Deny Precedence Enforced</div>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-slate-800">
          <div className="text-[11px] font-mono text-slate-400">Abstention Rate</div>
          <div className="text-2xl font-bold text-amber-300 font-mono mt-0.5">1.8%</div>
          <div className="text-[10px] text-amber-400 mt-0.5 font-mono">Zero Knowledge Leaks</div>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-slate-800">
          <div className="text-[11px] font-mono text-slate-400">Mean Pipeline Latency</div>
          <div className="text-2xl font-bold text-emerald-400 font-mono mt-0.5">34ms</div>
          <div className="text-[10px] text-emerald-400 mt-0.5 font-mono">Sub-50ms Zero-Trust Check</div>
        </div>
      </div>

      {/* Filter Tabs & Search Control Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {[
            { id: 'all', label: 'All Events', count: counts.all },
            { id: 'query', label: 'query', count: counts.query },
            { id: 'acl_deny', label: 'acl_deny', count: counts.acl_deny },
            { id: 'answer_served', label: 'answer_served', count: counts.answer_served },
            { id: 'abstain', label: 'abstain', count: counts.abstain },
            { id: 'invariant_check', label: 'invariant_check', count: counts.invariant_check },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveFilterTab(tab.id)}
              className={`px-3 py-1.5 text-xs font-mono rounded-xl transition-all border whitespace-nowrap flex items-center gap-1.5 ${
                activeFilterTab === tab.id
                  ? 'bg-cyan-500/20 text-cyan-300 font-bold border-cyan-500/40 shadow-sm'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border-slate-800'
              }`}
            >
              <span>{tab.label}</span>
              <span className={activeFilterTab === tab.id ? 'px-1.5 py-0.2 rounded-full text-[10px] bg-blue-600 text-white font-bold' : 'px-1.5 py-0.2 rounded-full text-[10px] bg-slate-800 text-white'}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Filter Search Input */}
        <div className="relative max-w-xs w-full">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search by actor, query, trace..."
            className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-1.5 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500 transition-colors"
          />
        </div>
      </div>

      {/* High-Density Log Stream Table Container */}
      <div className="glass-panel rounded-2xl border border-slate-700/80 overflow-hidden shadow-2xl">
        <div className="p-3.5 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span>Event Stream Log Queue</span>
          </div>
          <span>Showing {filteredLogs.length} matching events</span>
        </div>

        {/* Stream List */}
        <div className="divide-y divide-slate-800/80 font-mono text-xs max-h-[600px] overflow-y-auto">
          {filteredLogs.length === 0 ? (
            <div className="p-12 text-center text-slate-500 space-y-2">
              <ShieldAlert className="w-8 h-8 mx-auto text-slate-600" />
              <p>No audit events match the selected filter criteria.</p>
            </div>
          ) : (
            filteredLogs.map(log => (
              <div
                key={log.id}
                onClick={() => setSelectedLog(log)}
                className="p-3.5 bg-slate-900/40 hover:bg-slate-800/60 transition-colors cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
              >
                <div className="flex items-center space-x-3 min-w-0 flex-1">
                  {/* Timestamp */}
                  <span className="text-slate-400 text-[11px] font-semibold whitespace-nowrap">
                    {log.time}
                  </span>

                  {/* Action Badge */}
                  <span className={`px-2.5 py-0.5 rounded text-[10px] uppercase font-mono border whitespace-nowrap ${getActionBadgeStyle(log.action)}`}>
                    {log.action}
                  </span>

                  {/* Actor */}
                  <span className="text-slate-200 font-semibold truncate text-[11px] max-w-[160px]">
                    {log.actor}
                  </span>

                  {/* Log Details */}
                  <span className="text-slate-400 font-sans text-xs truncate flex-1 leading-tight group-hover:text-slate-200 transition-colors">
                    {log.details}
                  </span>
                </div>

                {/* Right Metadata: Trace ID & Latency */}
                <div className="flex items-center space-x-3 self-end sm:self-center">
                  <button
                    onClick={(e) => handleCopyTrace(log.trace, e)}
                    className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-950 text-slate-400 border border-slate-800 hover:border-slate-700 hover:text-cyan-300 transition-colors flex items-center gap-1"
                    title="Click to copy trace ID"
                  >
                    {copiedTrace === log.trace ? (
                      <Check className="w-3 h-3 text-emerald-400" />
                    ) : (
                      <Copy className="w-3 h-3 text-slate-500" />
                    )}
                    <span>{log.trace}</span>
                  </button>

                  <span className="text-[11px] text-slate-500">{log.latencyMs}ms</span>

                  <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all" />
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Selected Log Entry Detailed Drawer Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel bg-slate-950 border border-slate-700 rounded-2xl max-w-2xl w-full p-6 space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                  <Terminal className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-100 text-base">Audit Trace Record Detail</h3>
                  <div className="text-xs font-mono text-cyan-400 flex items-center gap-2 mt-0.5">
                    <span>ID: {selectedLog.id}</span>
                    <span>•</span>
                    <span>Trace: {selectedLog.trace}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedLog(null)}
                className="p-1.5 rounded-lg bg-slate-900 text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Details Grid */}
            <div className="grid grid-cols-2 gap-4 text-xs font-mono">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-slate-500 text-[10px]">TIMESTAMP</span>
                <div className="text-slate-200 font-semibold">{selectedLog.time}</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-slate-500 text-[10px]">EVENT ACTION</span>
                <div>
                  <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold border ${getActionBadgeStyle(selectedLog.action)}`}>
                    {selectedLog.action}
                  </span>
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-slate-500 text-[10px]">REQUESTING ACTOR</span>
                <div className="text-slate-200 font-semibold">{selectedLog.actor}</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-slate-500 text-[10px]">ORIGIN IP / CONTEXT</span>
                <div className="text-slate-200 font-semibold">{selectedLog.ipOrigin}</div>
              </div>
            </div>

            {/* Event Description Summary */}
            <div className="space-y-1.5">
              <span className="text-xs font-mono text-slate-400">EVENT DESCRIPTION</span>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 font-sans text-xs">
                {selectedLog.details}
              </div>
            </div>

            {/* Raw JSON Payload */}
            <div className="space-y-1.5">
              <span className="text-xs font-mono text-cyan-400">RAW AUDIT RECORD PAYLOAD (JSON)</span>
              <pre className="p-4 rounded-xl bg-slate-900 text-xs font-mono text-cyan-300 overflow-x-auto border border-slate-800 leading-relaxed">
                {JSON.stringify(selectedLog.rawPayload, null, 2)}
              </pre>
            </div>

            {/* Modal Actions */}
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedLog(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono rounded-xl border border-slate-700 transition-colors"
              >
                Close Audit View
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
