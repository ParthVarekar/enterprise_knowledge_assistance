import React from 'react';
import { Plug, CheckCircle2, RefreshCw, Layers } from 'lucide-react';

export const ConnectorsView: React.FC = () => {
  const connectors = [
    { name: 'Confluence Wiki', system: 'confluence', status: 'Connected', docs: 3, icon: '📄', classification: 'Confidential & Internal' },
    { name: 'Google Drive', system: 'google_drive', status: 'Connected', docs: 2, icon: '📁', classification: 'Restricted & Internal' },
    { name: 'Zendesk Help Center', system: 'zendesk', status: 'Connected', docs: 2, icon: '🎧', classification: 'Public' },
    { name: 'Slack Markdown Docs', system: 'slack', status: 'Connected', docs: 1, icon: '💬', classification: 'Internal' },
  ];

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Plug className="w-5 h-5 text-cyan-400" />
            <span>Connected Knowledge Sources</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Registered enterprise data connectors and ingested document chunk count.
          </p>
        </div>
        <button className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono rounded-lg border border-slate-700 flex items-center gap-2 transition-colors">
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Re-Ingest All Connectors</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {connectors.map((c, i) => (
          <div key={i} className="glass-panel p-5 rounded-2xl border border-slate-700/80 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{c.icon}</span>
                <div>
                  <h3 className="font-bold text-sm text-slate-100">{c.name}</h3>
                  <div className="text-[11px] font-mono text-cyan-400">{c.system}</div>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {c.status}
              </span>
            </div>

            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400">Ingested Chunks: <strong className="text-slate-200">{c.docs}</strong></span>
              <span className="text-slate-400">Clearance: <strong className="text-cyan-400">{c.classification}</strong></span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
