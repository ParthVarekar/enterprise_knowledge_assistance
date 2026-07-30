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

  const stages = [
    {
      id: 1,
      title: 'Sparse BM25 Search',
      subtitle: 'Lexical Term Frequency & Inverted Index',
      icon: Search,
      color: 'border-cyan-500 text-cyan-400 bg-cyan-500/10',
      activeColor: 'bg-cyan-500/20 border-cyan-400 text-cyan-300 ring-2 ring-cyan-500/40',
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
      color: 'border-purple-500 text-purple-400 bg-purple-500/10',
      activeColor: 'bg-purple-500/20 border-purple-400 text-purple-300 ring-2 ring-purple-500/40',
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
      color: 'border-emerald-500 text-emerald-400 bg-emerald-500/10',
      activeColor: 'bg-emerald-500/20 border-emerald-400 text-emerald-300 ring-2 ring-emerald-500/40',
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
      title: 'Temporal Decay & Canonical',
      subtitle: 'Exponential Recency & Gold Tag Multiplier',
      icon: Clock,
      color: 'border-amber-500 text-amber-400 bg-amber-500/10',
      activeColor: 'bg-amber-500/20 border-amber-400 text-amber-300 ring-2 ring-amber-500/40',
      description:
        'Applies exponential decay based on document update age in days to penalize stale documentation. Multiplies canonical enterprise documents by a boost factor to ensure authoritative sources win.',
      formulaName: 'Temporal Decay & Boost Equation',
      latexFormula: `\\text{Score}_{\\text{Final}}(d) = S_{\\text{Fused}}(d) \\cdot \\text{Boost}_{\\text{Canonical}} \\cdot \\exp\\left(-\\lambda \\cdot \\Delta t\\right) \\quad (\\lambda = ${decayLambda})`,
      parameters: [
        { name: 'Decay Lambda (λ)', value: `${decayLambda}` },
        { name: 'Half-Life', value: `~${Math.round(Math.log(2) / decayLambda)} days` },
        { name: 'Canonical Boost', value: `${canonicalBoost}x` },
      ],
      sampleOutput: 'Fresh canonical docs stay at top; outdated chunks decay exponentially over time',
    },
  ];

  // Execute live simulation query
  const executionResult = EngineAdapter.executeQuery(testQuery, selectedPersona);

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* View Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-5 rounded-2xl border border-slate-700/80 shadow-lg">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Layers className="w-5 h-5 text-cyan-400" />
            <span>Hybrid RAG Retrieval Pipeline Visualizer</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Sparse BM25 + Dense Vector search fused via Reciprocal Rank Fusion (RRF) with exponential temporal recency decay & Zero-Trust ACL filters.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <span className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-semibold">
            Pipeline Version 2.4-Hybrid
          </span>
          <button
            onClick={resetParameters}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs font-mono transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Tuning</span>
          </button>
        </div>
      </div>

      {/* Stage Flowchart Navigation */}
      <div className="glass-panel p-6 rounded-2xl space-y-6 border border-slate-700/80 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="text-xs font-mono text-cyan-400 uppercase tracking-wider flex items-center gap-2">
            <Activity className="w-4 h-4" />
            <span>Retrieval Pipeline Stage Architecture</span>
          </div>
          <span className="text-[11px] font-mono text-slate-400">Click a stage to inspect parameters & formula</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {stages.map((stage) => {
            const Icon = stage.icon;
            const isActive = activeStage === stage.id;

            return (
              <button
                key={stage.id}
                onClick={() => setActiveStage(stage.id)}
                className={`p-4 rounded-xl border text-left transition-all duration-200 space-y-3 relative group ${
                  isActive ? stage.activeColor : 'glass-panel-interactive border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className={`font-bold px-2 py-0.5 rounded ${isActive ? 'bg-slate-900/80 text-white' : 'bg-slate-900/40 text-slate-400'}`}>
                    STAGE {stage.id}
                  </span>
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-100 group-hover:text-cyan-300 transition-colors">
                    {stage.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">{stage.subtitle}</p>
                </div>

                <div className="flex items-center text-[10px] font-mono text-cyan-400 gap-1 pt-1">
                  <span>Inspect Stage</span>
                  <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Stage Detail Inspector */}
        {(() => {
          const stage = stages.find((s) => s.id === activeStage)!;
          const Icon = stage.icon;

          return (
            <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-4 animate-in fade-in duration-200">
              <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-800 pb-3 gap-2">
                <div className="flex items-center space-x-3">
                  <div className={`p-2.5 rounded-xl border ${stage.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-slate-100 flex items-center gap-2">
                      <span>Stage {stage.id}: {stage.title}</span>
                    </h3>
                    <p className="text-xs text-slate-400">{stage.subtitle}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 font-mono text-xs">
                  {stage.parameters.map((p, pIdx) => (
                    <span key={pIdx} className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300">
                      <strong className="text-cyan-400">{p.name}:</strong> {p.value}
                    </span>
                  ))}
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed font-sans">{stage.description}</p>

              {/* Formatted Formula Display Box */}
              <div className="glass-panel p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="text-[11px] font-mono text-cyan-400 font-bold uppercase tracking-wider flex items-center justify-between">
                  <span>{stage.formulaName}</span>
                  <span className="text-slate-500 font-normal">Mathematical Specification</span>
                </div>

                {/* High Legibility Formatted Equation */}
                <div className="p-4 rounded-lg bg-slate-950 border border-slate-800/90 overflow-x-auto text-center font-mono text-sm text-cyan-200 leading-loose">
                  {stage.latexFormula.split('\\text{').map((part, i) => (
                    <span key={i}>
                      {i > 0 && <span className="text-cyan-400 font-sans">{part.split('}')[0]}</span>}
                      <span className="text-slate-200">{i > 0 ? part.split('}').slice(1).join('}') : part}</span>
                    </span>
                  ))}
                </div>

                <div className="text-[10px] font-mono text-slate-400 bg-slate-900/60 p-2 rounded">
                  <strong className="text-slate-300">Stage Behavior:</strong> {stage.sampleOutput}
                </div>
              </div>
            </div>
          );
        })()}
      </div>

      {/* Active Parameter Metrics Cards & Tuning Panel */}
      <div className="glass-panel p-6 rounded-2xl space-y-5 border border-slate-700/80 shadow-xl">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
            <Sliders className="w-4 h-4 text-cyan-400" />
            <span>Active Retrieval Tuning Metrics & Parameters</span>
          </h3>
          <span className="text-[11px] font-mono text-slate-400">Live Hyperparameter Dashboard</span>
        </div>

        {/* Metric Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 shadow-md">
            <div className="text-[11px] font-mono text-slate-400">RRF k Parameter</div>
            <div className="text-2xl font-bold text-cyan-400 font-mono mt-1">{rrfK.toFixed(1)}</div>
            <div className="text-[10px] text-slate-500 mt-1">Standard Rank Fusion Constant</div>
            <input
              type="range"
              min="10"
              max="100"
              step="5"
              value={rrfK}
              onChange={(e) => setRrfK(parseFloat(e.target.value))}
              className="w-full mt-3 accent-cyan-400 cursor-pointer"
            />
          </div>

          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 shadow-md">
            <div className="text-[11px] font-mono text-slate-400">Decay Lambda (λ)</div>
            <div className="text-2xl font-bold text-purple-400 font-mono mt-1">{decayLambda}</div>
            <div className="text-[10px] text-slate-500 mt-1">
              Half-life ~{Math.round(Math.log(2) / decayLambda)} Days
            </div>
            <input
              type="range"
              min="0.001"
              max="0.020"
              step="0.001"
              value={decayLambda}
              onChange={(e) => setDecayLambda(parseFloat(e.target.value))}
              className="w-full mt-3 accent-purple-400 cursor-pointer"
            />
          </div>

          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 shadow-md">
            <div className="text-[11px] font-mono text-slate-400">Canonical Tag Boost</div>
            <div className="text-2xl font-bold text-emerald-400 font-mono mt-1">{canonicalBoost.toFixed(2)}x</div>
            <div className="text-[10px] text-slate-500 mt-1">+{(Math.round((canonicalBoost - 1) * 100))}% Rank Preference</div>
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

          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 shadow-md">
            <div className="text-[11px] font-mono text-slate-400">Entailment Threshold</div>
            <div className="text-2xl font-bold text-amber-400 font-mono mt-1">{entailmentCutoff.toFixed(2)}</div>
            <div className="text-[10px] text-slate-500 mt-1">NLI Grounding Cutoff</div>
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
      <div className="glass-panel p-6 rounded-2xl space-y-4 border border-slate-700/80 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <Cpu className="w-5 h-5 text-purple-400" />
            <h3 className="text-sm font-semibold text-slate-100">Unified Master Composite Ranking Equation</h3>
          </div>
          <span className="text-[11px] font-mono text-purple-400">End-to-End RAG Scoring</span>
        </div>

        {/* Master Formula Display */}
        <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 text-center font-mono text-sm text-purple-200 leading-relaxed overflow-x-auto shadow-inner">
          <div className="text-base font-bold text-cyan-300 mb-1">
            Score<sub>Final</sub>(d) = [ w<sub>1</sub> · S<sub>BM25</sub>(d) + w<sub>2</sub> · S<sub>Dense</sub>(d) ] × RRF<sub>k={rrfK}</sub>(d) × Boost<sub>Canonical</sub> × e<sup>-λ · Δt</sup>
          </div>
          <div className="text-xs text-slate-400 mt-2 font-sans">
            Where λ = {decayLambda}, Canonical Boost = {canonicalBoost}x, and ACL Entailment Gate requires NLI Grounding ≥ {entailmentCutoff}.
          </div>
        </div>
      </div>

      {/* Live Candidate Retrieval Simulation Sandbox */}
      <div className="glass-panel p-6 rounded-2xl space-y-5 border border-slate-700/80 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-emerald-400" />
              <span>Live Retrieval Candidates & Rank Transformations</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Simulate candidate document scoring across Sparse, Dense, RRF Fusion, Decay & ACL Gate for any test query.
            </p>
          </div>

          {/* Persona selector for ACL evaluation */}
          <div className="flex items-center space-x-2 bg-slate-950/80 px-3 py-1.5 rounded-xl border border-slate-800">
            <span className="text-[11px] font-mono text-slate-400">Evaluating as:</span>
            <select
              value={selectedPersona.id}
              onChange={(e) => {
                const found = PRESET_PERSONAS.find((p) => p.id === e.target.value);
                if (found) setSelectedPersona(found);
              }}
              className="bg-transparent text-xs text-cyan-300 font-mono font-semibold focus:outline-none cursor-pointer"
            >
              {PRESET_PERSONAS.map((p) => (
                <option key={p.id} value={p.id} className="bg-slate-900 text-slate-200">
                  {p.name} ({p.role})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Test Query Input Box */}
        <div className="flex items-center space-x-3 bg-slate-950/70 p-2.5 rounded-xl border border-slate-800">
          <Search className="w-4 h-4 text-slate-500 ml-2" />
          <input
            type="text"
            value={testQuery}
            onChange={(e) => setTestQuery(e.target.value)}
            placeholder="Type query to test live retrieval candidates..."
            className="flex-1 bg-transparent text-xs text-slate-100 placeholder-slate-500 focus:outline-none font-mono"
          />
          <button
            onClick={() => setTestQuery('What is the production deployment and rollback process?')}
            className="px-2.5 py-1 text-[11px] font-mono bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
          >
            Try DevOps Query
          </button>
        </div>

        {/* Candidates Transformation Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px]">
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
            <tbody className="divide-y divide-slate-800/60">
              {executionResult.candidates.map((cand, idx) => (
                <tr key={cand.chunkId} className="hover:bg-slate-900/40 transition-colors">
                  <td className="py-3 px-3">
                    <span className={`w-5 h-5 rounded-md text-[11px] font-bold flex items-center justify-center ${
                      idx === 0 ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                    }`}>
                      #{idx + 1}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <div className="font-semibold font-sans text-slate-200 text-xs">{cand.documentTitle}</div>
                    <div className="text-[10px] text-slate-500">ID: {cand.chunkId} • {cand.sourceSystem}</div>
                  </td>
                  <td className="py-3 px-3 text-right text-cyan-400">{cand.sparseScore.toFixed(3)}</td>
                  <td className="py-3 px-3 text-right text-purple-400">{cand.denseScore.toFixed(3)}</td>
                  <td className="py-3 px-3 text-right text-emerald-400">{cand.rrfScore.toFixed(3)}</td>
                  <td className="py-3 px-3 text-right text-amber-400">{(cand.temporalDecay * 100).toFixed(1)}%</td>
                  <td className="py-3 px-3 text-right font-bold text-slate-100">{cand.finalScore.toFixed(3)}</td>
                  <td className="py-3 px-3 text-center">
                    {cand.aclPassed ? (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold inline-flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        PASSED
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-[10px] font-bold inline-flex items-center gap-1">
                        <Lock className="w-3 h-3" />
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
