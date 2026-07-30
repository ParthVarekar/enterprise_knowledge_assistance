import React, { useState } from 'react';
import { Activity, ShieldAlert, Filter, Download } from 'lucide-react';

export const AuditLedgerView: React.FC = () => {
  const [filterAction, setFilterAction] = useState('all');

  const logs = [
    { id: 'aud-01', time: '11:28:02', action: 'query', actor: 'alex.vance@acme.com', details: 'Query: "API gateway rate limiting"', trace: 'q_172232_a1' },
    { id: 'aud-02', time: '11:28:02', action: 'retrieval', actor: 'alex.vance@acme.com', details: 'Retrieved 3 chunks (Confluence, Drive)', trace: 'q_172232_a1' },
    { id: 'aud-03', time: '11:28:02', action: 'answer_served', actor: 'alex.vance@acme.com', details: 'Served answer (Confidence: 89%)', trace: 'q_172232_a1' },
    { id: 'aud-04', time: '11:28:45', action: 'query', actor: 'jordan.vendor@external.com', details: 'Query: "Customer Data Processing Agreement"', trace: 'q_172232_b2' },
    { id: 'aud-05', time: '11:28:45', action: 'acl_deny', actor: 'jordan.vendor@external.com', details: 'Blocked chunk GDRIVE-002 (Restricted Classification)', trace: 'q_172232_b2' },
    { id: 'aud-06', time: '11:28:45', action: 'answer_abstained', actor: 'jordan.vendor@external.com', details: 'Abstained due to Zero-Trust ACL policy', trace: 'q_172232_b2' },
    { id: 'aud-07', time: '11:29:10', action: 'invariant_check', actor: 'system-aegis-qa', details: 'Passed Security Symmetry Invariant (200 random trials)', trace: 'qa_inv_99' },
  ];

  const filteredLogs = filterAction === 'all' ? logs : logs.filter(l => l.action === filterAction);

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Activity className="w-5 h-5 text-cyan-400" />
            <span>Immutable Compliance Audit Ledger</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Real-time audit trail recording every query, ACL denial, retrieval, and abstention event with trace IDs.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <select
            value={filterAction}
            onChange={e => setFilterAction(e.target.value)}
            className="bg-slate-900 border border-slate-700 text-xs font-mono rounded-lg px-3 py-1.5 text-slate-200 focus:outline-none"
          >
            <option value="all">All Event Types</option>
            <option value="query">Query Events</option>
            <option value="acl_deny">ACL Denials</option>
            <option value="answer_served">Served Answers</option>
            <option value="answer_abstained">Abstentions</option>
          </select>
        </div>
      </div>

      <div className="glass-panel p-6 rounded-2xl space-y-4 border border-slate-700/80">
        <div className="space-y-2 font-mono text-xs">
          {filteredLogs.map(l => (
            <div key={l.id} className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-slate-500 font-bold">{l.time}</span>
                <span className={`px-2 py-0.5 rounded font-bold uppercase text-[10px] ${
                  l.action === 'acl_deny' || l.action === 'answer_abstained'
                    ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                    : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                }`}>
                  {l.action}
                </span>
                <span className="text-slate-300 font-semibold">{l.actor}</span>
                <span className="text-slate-400 text-sans">→ {l.details}</span>
              </div>
              <span className="text-slate-600 text-[10px]">Trace: {l.trace}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
