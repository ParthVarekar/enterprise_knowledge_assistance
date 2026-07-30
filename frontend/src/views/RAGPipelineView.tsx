import React from 'react';
import { Layers, Search, Zap, Clock, ArrowDown, Activity } from 'lucide-react';

export const RAGPipelineView: React.FC = () => {
  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* View Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          <Layers className="w-5 h-5 text-cyan-400" />
          <span>Hybrid RAG Retrieval Pipeline</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Sparse BM25 + Dense Vector Search fused via Reciprocal Rank Fusion (RRF) with exponential temporal recency decay.
        </p>
      </div>

      {/* Pipeline Flow Diagram */}
      <div className="glass-panel p-6 rounded-2xl space-y-6 border border-slate-700/80">
        <div className="text-xs font-mono text-cyan-400 uppercase tracking-wider">
          Retrieval Architecture Flowchart
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Stage 1 */}
          <div className="glass-panel p-4 rounded-xl border-l-4 border-l-cyan-500 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-cyan-400 font-bold">STAGE 1</span>
              <Search className="w-4 h-4 text-slate-400" />
            </div>
            <h4 className="font-semibold text-sm text-slate-100">Sparse BM25 Search</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Tokenizes query and computes term frequency (TF-IDF) scores with k1=1.2, b=0.75. Ideal for exact acronyms, error codes, and titles.
            </p>
            <div className="text-[11px] font-mono text-cyan-300/80 bg-slate-950/60 p-2 rounded">
              Formula: IDF * (tf * (k1 + 1)) / (tf + k1*(1-b + b*len/avg))
            </div>
          </div>

          {/* Stage 2 */}
          <div className="glass-panel p-4 rounded-xl border-l-4 border-l-purple-500 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-purple-400 font-bold">STAGE 2</span>
              <Zap className="w-4 h-4 text-slate-400" />
            </div>
            <h4 className="font-semibold text-sm text-slate-100">Dense Vector Search</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              128-dimensional cosine similarity matching. Captures conceptual intent and semantic synonymy across documents.
            </p>
            <div className="text-[11px] font-mono text-purple-300/80 bg-slate-950/60 p-2 rounded">
              Formula: CosineSim(A, B) = (A · B) / (||A|| ||B||)
            </div>
          </div>

          {/* Stage 3 */}
          <div className="glass-panel p-4 rounded-xl border-l-4 border-l-emerald-500 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-emerald-400 font-bold">STAGE 3</span>
              <Clock className="w-4 h-4 text-slate-400" />
            </div>
            <h4 className="font-semibold text-sm text-slate-100">RRF + Recency Decay</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Merges sparse & dense rank positions with parameter k=60 and applies exponential recency decay over document age in days.
            </p>
            <div className="text-[11px] font-mono text-emerald-300/80 bg-slate-950/60 p-2 rounded">
              Score = RRF(d) * CanonicalBoost * e^(-0.005 * Age)
            </div>
          </div>
        </div>
      </div>

      {/* Live Parameter Tuning Simulation */}
      <div className="glass-panel p-6 rounded-2xl space-y-4 border border-slate-700/80">
        <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
          <Activity className="w-4 h-4 text-cyan-400" />
          <span>Active Retrieval Tuning Metrics</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
            <div className="text-[11px] font-mono text-slate-400">RRF k Parameter</div>
            <div className="text-xl font-bold text-cyan-400 font-mono mt-1">60.0</div>
            <div className="text-[10px] text-slate-500 mt-1">Standard Rank Fusion Constant</div>
          </div>
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
            <div className="text-[11px] font-mono text-slate-400">Decay Lambda (λ)</div>
            <div className="text-xl font-bold text-purple-400 font-mono mt-1">0.005</div>
            <div className="text-[10px] text-slate-500 mt-1">Half-life ~138 Days</div>
          </div>
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
            <div className="text-[11px] font-mono text-slate-400">Canonical Tag Boost</div>
            <div className="text-xl font-bold text-emerald-400 font-mono mt-1">1.25x</div>
            <div className="text-[10px] text-slate-500 mt-1">+25% Rank Preference</div>
          </div>
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
            <div className="text-[11px] font-mono text-slate-400">Entailment Threshold</div>
            <div className="text-xl font-bold text-amber-400 font-mono mt-1">0.65</div>
            <div className="text-[10px] text-slate-500 mt-1">NLI Grounding Cutoff</div>
          </div>
        </div>
      </div>
    </div>
  );
};
