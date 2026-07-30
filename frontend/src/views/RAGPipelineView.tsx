import React, { useState } from 'react';
import {
  Layers,
  Search,
  Zap,
  Clock,
  ArrowRight,
  Activity,
  ShieldCheck,
  Sparkles,
  Sliders,
  Info,
  CheckCircle2,
  Lock,
  Database,
  Cpu,
  RefreshCw,
  Award,
  ChevronRight,
  BarChart3
} from 'lucide-react';
import { EngineAdapter, PRESET_PERSONAS, UserPersona } from '../mockEngine/engineAdapter';

export const RAGPipelineView: React.FC = () => {
  const [activeStage, setActiveStage] = useState<number>(1);
  const [testQuery, setTestQuery] = useState('How does our API gateway handle rate limiting?');
  const [selectedPersona, setSelectedPersona] = useState<UserPersona>(PRESET_PERSONAS[0]);

  // Interactive Parameter State
  const [rrfK, setRrfK] = useState<number>(60);
  const [decayLambda, setDecayLambda] = useState<number>(0.005);
  const [canonicalBoost, setCanonicalBoost] = useState<number>(1.25);
  const [entailmentCutoff, setEntailmentCutoff] = useState<number>(0.65);

  const resetParameters = () => {
    setRrfK(60);
    setDecayLambda(0.005);
    setCanonicalBoost(1.25);
    setEntailmentCutoff(0.65);
  };

  // Synchronously compute candidate results from EngineAdapter
  const executionResult = EngineAdapter.executeQuerySync(testQuery, selectedPersona);

  const stages = [
    {
      id: 1,
      title: 'Sparse BM25 Search',
      subtitle: 'Lexical Term Frequency & Inverted Index',
      icon: Search,
      color: 'border-[#cbb7fb] text-[#cbb7fb] bg-[#cbb7fb]/10',
      activeColor: 'bg-[#2A2859] border-white/40 text-white shadow-lg',
      description:
        'Tokenizes the query into terms, removes stopwords, and calculates Okapi BM25 term frequency scores with length normalization. Best for exact keyword matches, technical acronyms, and document titles.',
      formulaName: 'Okapi BM25 Scoring Equation',
      latexFormula: `\\text{Score}_{\\text{BM25}}(D, Q) = \\sum_{i=1}^{n} \\text{IDF}(q_i) \\cdot \\frac{f(q_i, D) \\cdot (k_1 + 1)}{f(q_i, D) + k_1 \\cdot \\left(1 - b + b \\cdot \\frac{|D|}{\\text{avgdl}}\\right)}`,
      parameters: [
        { name: 'k1 (Term Saturation)', value: '1.2' },
        { name: 'b (Length Penalty)', value: '0.75' },
        { name: 'IDF Function', value: 'Robertson-Spärck Jones' },
      ],
      sampleOutput: 'Extracts exact keyword matches with BM25 scores normalized [0.0 - 4.5]',
    },
    {
      id: 2,
      title: 'Dense Vector Search',
      subtitle: '128-Dimensional Cosine Similarity',
      icon: Zap,
      color: 'border-blue-400 text-blue-300 bg-blue-500/10',
      activeColor: 'bg-[#2A2859] border-white/40 text-white shadow-lg',
      description:
        'Encodes document chunks and query into 128-dimensional dense vector embeddings using a fine-tuned transformer. Calculates cosine similarity to capture conceptual intent and synonymy.',
      formulaName: 'Dense Cosine Similarity Equation',
      latexFormula: `\\text{CosineSim}(\\vec{q}, \\vec{d}) = \\frac{\\vec{q} \\cdot \\vec{d}}{\\|\\vec{q}\\|_2 \\|\\vec{d}\\|_2} = \\frac{\\sum_{i=1}^{128} q_i d_i}{\\sqrt{\\sum_{i=1}^{128} q_i^2} \\sqrt{\\sum_{i=1}^{128} d_i^2}}`,
      parameters: [
        { name: 'Vector Dimensions', value: '128-dim' },
        { name: 'Distance Metric', value: 'Cosine Similarity' },
        { name: 'Embedding Model', value: 'All-MiniLM-L6-v2 Fine-Tuned' },
      ],
      sampleOutput: 'Returns semantic similarity scores normalized [0.00 - 1.00]',
    },
    {
      id: 3,
      title: 'RRF Fusion',
      subtitle: 'Reciprocal Rank Fusion Ensemble',
      icon: Layers,
      color: 'border-emerald-400 text-emerald-300 bg-emerald-500/10',
      activeColor: 'bg-[#2A2859] border-white/40 text-white shadow-lg',
      description:
        'Combines discrete rank positions from Sparse BM25 and Dense Vector search into a single unified rank score, preventing scale bias and outperforming raw score averaging.',
      formulaName: 'Reciprocal Rank Fusion Equation',
      latexFormula: `\\text{RRF\\_Score}(d \\in D) = \\sum_{m \\in \\{\\text{Sparse}, \\text{Dense}\\}} \\frac{1}{k + r_m(d)} \\quad (k = ${rrfK})`,
      parameters: [
        { name: 'Fusion Constant (k)', value: `${rrfK.toFixed(1)}` },
        { name: 'Sparse Weight (w1)', value: '0.40' },
        { name: 'Dense Weight (w2)', value: '0.60' },
      ],
      sampleOutput: 'Ensures candidates appearing high in both lists get maximum composite rank',
    },
    {
      id: 4,
      title: 'Temporal Decay & ACL Gate',
      subtitle: 'Exponential Recency & Zero-Trust Level Filter',
      icon: Clock,
      color: 'border-amber-400 text-amber-300 bg-amber-500/10',
      activeColor: 'bg-[#2A2859] border-white/40 text-white shadow-lg',
      description:
        'Applies exponential decay based on document age and filters out any candidate document that violates the active fluid user clearance level or group entitlement.',
      formulaName: 'Temporal Decay & ACL Equation',
      latexFormula: `\\text{Decay}(t) = e^{-\\lambda \\cdot \\Delta t} \\quad (\\lambda = ${decayLambda})`,
      parameters: [
        { name: 'Decay Lambda (λ)', value: `${decayLambda}` },
        { name: 'Canonical Boost', value: `${canonicalBoost}x` },
        { name: 'ACL Level Filter', value: `Clearance Level ${selectedPersona.clearanceLevel || 2}` },
      ],
      sampleOutput: 'Boosts updated documents and enforces Zero-Trust security boundaries',
    },
  ];

  const currentStageInfo = stages.find((s) => s.id === activeStage) || stages[0];

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* View Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#121028]/90 p-6 rounded-[24px] border border-white/15 shadow-2xl backdrop-blur-xl">
        <div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Layers className="w-6 h-6 text-[#cbb7fb]" />
            <span>Hybrid RAG Retrieval Pipeline Visualizer</span>
          </h2>
          <p className="text-sm text-slate-300 mt-1">
            Sparse BM25 + Dense Vector search fused via Reciprocal Rank Fusion (RRF) with exponential temporal recency decay & Zero-Trust ACL filters.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <span className="px-3.5 py-1 rounded-full bg-[#cbb7fb]/20 border border-[#cbb7fb]/40 text-[#cbb7fb] text-xs font-mono font-bold">
            Pipeline Version 2.4-Hybrid
          </span>
          <button
            onClick={resetParameters}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-[12px] bg-[#2A2859] hover:bg-[#1E1B42] border border-white/20 text-white text-xs font-mono font-bold transition-all shadow-md active:scale-95"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Tuning</span>
          </button>
        </div>
      </div>

      {/* Stage Flowchart Navigation */}
      <div className="bg-[#121028]/90 p-6 rounded-[24px] space-y-6 border border-white/15 shadow-2xl">
        <div className="flex items-center justify-between">
          <div className="text-xs font-mono text-[#cbb7fb] font-bold uppercase tracking-wider flex items-center gap-2">
            <Activity className="w-4 h-4" />
            <span>Retrieval Pipeline Stage Architecture</span>
          </div>
          <span className="text-[11px] font-mono text-slate-300">Click a stage to inspect parameters & formula</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {stages.map((stage) => {
            const Icon = stage.icon;
            const isActive = activeStage === stage.id;
            return (
              <button
                key={stage.id}
                onClick={() => setActiveStage(stage.id)}
                className={`p-4 rounded-[18px] text-left transition-all border ${
                  isActive
                    ? stage.activeColor
                    : 'bg-white/5 hover:bg-white/10 border-white/10 text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`w-7 h-7 rounded-full flex items-center justify-center font-mono font-bold text-xs ${
                    isActive ? 'bg-white text-[#0F172A]' : 'bg-[#2A2859] text-white'
                  }`}>
                    0{stage.id}
                  </span>
                  <Icon className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-xs text-white leading-tight">{stage.title}</h4>
                <p className="text-[10px] text-slate-300 font-mono mt-1">{stage.subtitle}</p>
              </button>
            );
          })}
        </div>

        {/* Selected Stage Detail Panel */}
        <div className="p-6 rounded-[20px] bg-[#1b1938] border border-white/15 space-y-4 shadow-inner">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
            <div>
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                <span>Stage 0{currentStageInfo.id}: {currentStageInfo.title}</span>
              </h3>
              <p className="text-xs text-[#cbb7fb] font-mono mt-0.5">{currentStageInfo.subtitle}</p>
            </div>
            <span className="text-xs font-mono text-slate-300 px-3 py-1 rounded-full bg-white/10 border border-white/20 self-start sm:self-auto">
              {currentStageInfo.formulaName}
            </span>
          </div>

          <p className="text-xs text-slate-200 leading-relaxed font-sans font-medium">
            {currentStageInfo.description}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            {currentStageInfo.parameters.map((param, idx) => (
              <div key={idx} className="p-3 rounded-[12px] bg-white/5 border border-white/10 text-xs font-mono">
                <span className="text-slate-400 block text-[10px] uppercase">{param.name}</span>
                <span className="text-white font-bold text-sm">{param.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Interactive Hyperparameter Tuning Canvas */}
      <div className="bg-[#121028]/90 p-6 rounded-[24px] space-y-5 border border-white/15 shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center space-x-2">
            <Sliders className="w-5 h-5 text-[#cbb7fb]" />
            <h3 className="text-sm font-extrabold text-white">Live Pipeline Hyperparameter Tuning Sandbox</h3>
          </div>
          <span className="text-[11px] font-mono text-slate-300">Adjust sliders to see candidate score transformations</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-[16px] bg-[#1b1938] border border-white/15 shadow-md space-y-2">
            <div className="text-[11px] font-mono text-slate-300">RRF Constant (k)</div>
            <div className="text-2xl font-bold text-white font-mono">{rrfK}</div>
            <div className="text-[10px] text-slate-400">Controls rank scale smoothing</div>
            <input
              type="range"
              min="10"
              max="100"
              step="5"
              value={rrfK}
              onChange={(e) => setRrfK(parseFloat(e.target.value))}
              className="w-full mt-3 accent-[#cbb7fb] cursor-pointer"
            />
          </div>

          <div className="p-4 rounded-[16px] bg-[#1b1938] border border-white/15 shadow-md space-y-2">
            <div className="text-[11px] font-mono text-slate-300">Decay Lambda (λ)</div>
            <div className="text-2xl font-bold text-blue-300 font-mono">{decayLambda}</div>
            <div className="text-[10px] text-slate-400">Half-life ~{Math.round(Math.log(2) / decayLambda)} Days</div>
            <input
              type="range"
              min="0.001"
              max="0.02"
              step="0.001"
              value={decayLambda}
              onChange={(e) => setDecayLambda(parseFloat(e.target.value))}
              className="w-full mt-3 accent-blue-400 cursor-pointer"
            />
          </div>

          <div className="p-4 rounded-[16px] bg-[#1b1938] border border-white/15 shadow-md space-y-2">
            <div className="text-[11px] font-mono text-slate-300">Canonical Boost</div>
            <div className="text-2xl font-bold text-emerald-300 font-mono">{canonicalBoost.toFixed(2)}x</div>
            <div className="text-[10px] text-slate-400">Gold Tag Multiplier</div>
            <input
              type="range"
              min="1.00"
              max="2.00"
              step="0.05"
              value={canonicalBoost}
              onChange={(e) => setCanonicalBoost(parseFloat(e.target.value))}
              className="w-full mt-3 accent-emerald-400 cursor-pointer"
            />
          </div>

          <div className="p-4 rounded-[16px] bg-[#1b1938] border border-white/15 shadow-md space-y-2">
            <div className="text-[11px] font-mono text-slate-300">Entailment Threshold</div>
            <div className="text-2xl font-bold text-amber-300 font-mono">{entailmentCutoff.toFixed(2)}</div>
            <div className="text-[10px] text-slate-400">NLI Grounding Cutoff</div>
            <input
              type="range"
              min="0.50"
              max="0.90"
              step="0.05"
              value={entailmentCutoff}
              onChange={(e) => setEntailmentCutoff(parseFloat(e.target.value))}
              className="w-full mt-3 accent-amber-400 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Master Mathematical Formulation Card */}
      <div className="bg-[#121028]/90 p-6 rounded-[24px] space-y-4 border border-white/15 shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center space-x-2">
            <Cpu className="w-5 h-5 text-[#cbb7fb]" />
            <h3 className="text-sm font-extrabold text-white">Unified Master Composite Ranking Equation</h3>
          </div>
          <span className="text-[11px] font-mono text-[#cbb7fb] font-bold">End-to-End RAG Scoring</span>
        </div>

        {/* Master Formula Display */}
        <div className="p-5 rounded-[16px] bg-[#1b1938] border border-white/15 text-center font-mono text-sm text-[#cbb7fb] leading-relaxed overflow-x-auto shadow-inner">
          <div className="text-base font-extrabold text-white mb-1">
            Score<sub>Final</sub>(d) = [ w<sub>1</sub> · S<sub>BM25</sub>(d) + w<sub>2</sub> · S<sub>Dense</sub>(d) ] × RRF<sub>k={rrfK}</sub>(d) × Boost<sub>Canonical</sub> × e<sup>-λ · Δt</sup>
          </div>
          <div className="text-xs text-slate-300 mt-2 font-sans font-medium">
            Where λ = {decayLambda}, Canonical Boost = {canonicalBoost}x, and ACL Entailment Gate requires NLI Grounding ≥ {entailmentCutoff}.
          </div>
        </div>
      </div>

      {/* Live Candidate Retrieval Simulation Sandbox */}
      <div className="bg-[#F3F0EB] text-[#0F172A] p-6 rounded-[24px] space-y-5 border border-[#dcd7d3] shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#dcd7d3] pb-4">
          <div>
            <h3 className="text-base font-extrabold text-[#0F172A] flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-[#2A2859]" />
              <span>Live Candidate Retrieval Sandbox</span>
            </h3>
            <p className="text-xs text-[#475569] mt-0.5 font-sans">
              Simulate candidate document scoring across Sparse, Dense, RRF Fusion, Decay & ACL Gate for any test query.
            </p>
          </div>

          {/* Persona selector for ACL evaluation */}
          <div className="flex items-center space-x-2 bg-white px-3 py-1.5 rounded-full border border-[#dcd7d3]">
            <span className="text-[11px] font-mono text-[#475569]">Evaluating as:</span>
            <select
              value={selectedPersona.id}
              onChange={(e) => {
                const found = PRESET_PERSONAS.find((p) => p.id === e.target.value);
                if (found) setSelectedPersona(found);
              }}
              className="bg-transparent text-xs text-[#0F172A] font-mono font-bold focus:outline-none cursor-pointer"
            >
              {PRESET_PERSONAS.map((p) => (
                <option key={p.id} value={p.id} className="bg-white text-[#0F172A]">
                  {p.name} (L{p.clearanceLevel || 2} - {p.role})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Test Query Input Box */}
        <div className="flex items-center space-x-3 bg-white p-3 rounded-[16px] border border-[#dcd7d3] shadow-sm">
          <Search className="w-4 h-4 text-[#2A2859] ml-2" />
          <input
            type="text"
            value={testQuery}
            onChange={(e) => setTestQuery(e.target.value)}
            placeholder="Type query to test live retrieval candidates..."
            className="flex-1 bg-transparent text-xs text-[#0F172A] placeholder-slate-400 focus:outline-none font-mono font-medium"
          />
          <button
            onClick={() => setTestQuery('What is the production deployment and rollback process?')}
            className="px-3 py-1.5 text-[11px] font-mono font-bold bg-[#2A2859] hover:bg-[#1E1B42] text-white rounded-[8px] transition-all shadow-md"
          >
            Try DevOps Query
          </button>
        </div>

        {/* Candidates Transformation Table */}
        <div className="overflow-x-auto bg-white rounded-[16px] border border-[#dcd7d3] p-2">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-[#dcd7d3] text-[#475569] uppercase text-[10px]">
                <th className="py-2.5 px-3">Rank</th>
                <th className="py-2.5 px-3">Document / Chunk Title</th>
                <th className="py-2.5 px-3 text-right">Sparse BM25</th>
                <th className="py-2.5 px-3 text-right">Dense Vector</th>
                <th className="py-2.5 px-3 text-right">RRF Score</th>
                <th className="py-2.5 px-3 text-right">Recency Decay</th>
                <th className="py-2.5 px-3 text-right">Final Score</th>
                <th className="py-2.5 px-3 text-center">ACL Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {executionResult.candidates.map((cand, idx) => (
                <tr key={cand.chunkId} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-3">
                    <span className={idx === 0 ? 'w-6 h-6 rounded-full text-[11px] font-bold flex items-center justify-center bg-[#2A2859] text-white' : 'w-6 h-6 rounded-full text-[11px] font-bold flex items-center justify-center bg-slate-200 text-[#0F172A]'}>
                      #{idx + 1}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <div className="font-extrabold font-sans text-[#0F172A] text-xs">{cand.documentTitle}</div>
                    <div className="text-[10px] text-[#475569]">ID: {cand.chunkId} • {cand.sourceSystem}</div>
                  </td>
                  <td className="py-3 px-3 text-right font-bold text-[#2A2859]">{cand.sparseScore.toFixed(3)}</td>
                  <td className="py-3 px-3 text-right font-bold text-blue-700">{cand.denseScore.toFixed(3)}</td>
                  <td className="py-3 px-3 text-right font-bold text-emerald-700">{cand.rrfScore.toFixed(3)}</td>
                  <td className="py-3 px-3 text-right font-bold text-amber-700">{(cand.temporalDecay * 100).toFixed(1)}%</td>
                  <td className="py-3 px-3 text-right font-extrabold text-[#0F172A] text-sm">{cand.finalScore.toFixed(3)}</td>
                  <td className="py-3 px-3 text-center">
                    {cand.aclPassed ? (
                      <span className="px-2.5 py-1 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800 text-[10px] font-bold inline-flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                        PASSED
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full bg-rose-100 border border-rose-300 text-rose-800 text-[10px] font-bold inline-flex items-center gap-1">
                        <Lock className="w-3 h-3 text-rose-700" />
                        BLOCKED
                      </span>
                    )}
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
