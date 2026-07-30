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
  SlidersHorizontal,
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

  const executionResult = EngineAdapter.executeQuerySync(testQuery, selectedPersona);

  const stages = [
    {
      id: 1,
      title: 'Sparse BM25 Search',
      subtitle: 'Lexical Term Frequency & Inverted Index',
      icon: Search,
      color: 'badge-indigo',
      activeColor: 'bg-indigo-50 border-indigo-300 text-indigo-900 font-bold shadow-xs',
      description:
        'Tokenizes the query into terms, removes stopwords, and calculates Okapi BM25 term frequency scores with length normalization. Best for exact keyword matches, technical acronyms, and document titles.',
      formulaName: 'Okapi BM25 Scoring Equation',
      parameters: [
        { name: 'k1 (Term Saturation)', value: '1.2' },
        { name: 'b (Length Penalty)', value: '0.75' },
        { name: 'IDF Function', value: 'Robertson-Spärck Jones' },
      ],
    },
    {
      id: 2,
      title: 'Dense Vector Search',
      subtitle: '128-Dimensional Cosine Similarity',
      icon: Zap,
      color: 'badge-indigo',
      activeColor: 'bg-indigo-50 border-indigo-300 text-indigo-900 font-bold shadow-xs',
      description:
        'Encodes document chunks and query into 128-dimensional dense vector embeddings using a fine-tuned transformer. Calculates cosine similarity to capture conceptual intent and synonymy.',
      formulaName: 'Dense Cosine Similarity Equation',
      parameters: [
        { name: 'Vector Dimensions', value: '128-dim' },
        { name: 'Distance Metric', value: 'Cosine Similarity' },
        { name: 'Embedding Model', value: 'All-MiniLM-L6-v2 Fine-Tuned' },
      ],
    },
    {
      id: 3,
      title: 'RRF Fusion',
      subtitle: 'Reciprocal Rank Fusion Ensemble',
      icon: Layers,
      color: 'badge-emerald',
      activeColor: 'bg-emerald-50 border-emerald-300 text-emerald-900 font-bold shadow-xs',
      description:
        'Combines discrete rank positions from Sparse BM25 and Dense Vector search into a single unified rank score, preventing scale bias and outperforming raw score averaging.',
      formulaName: 'Reciprocal Rank Fusion Equation',
      parameters: [
        { name: 'Fusion Constant (k)', value: `${rrfK.toFixed(1)}` },
        { name: 'Sparse Weight (w1)', value: '0.40' },
        { name: 'Dense Weight (w2)', value: '0.60' },
      ],
    },
    {
      id: 4,
      title: 'Temporal Decay & ACL Gate',
      subtitle: 'Exponential Recency & Zero-Trust Level Filter',
      icon: Clock,
      color: 'badge-amber',
      activeColor: 'bg-amber-50 border-amber-300 text-amber-900 font-bold shadow-xs',
      description:
        'Applies exponential decay based on document age and filters out any candidate document that violates the active fluid user clearance level or group entitlement.',
      formulaName: 'Temporal Decay & ACL Equation',
      parameters: [
        { name: 'Decay Lambda (λ)', value: `${decayLambda}` },
        { name: 'Canonical Boost', value: `${canonicalBoost}x` },
        { name: 'ACL Level Filter', value: `Clearance Level ${selectedPersona.clearanceLevel || 2}` },
      ],
    },
  ];

  const currentStageInfo = stages.find((s) => s.id === activeStage) || stages[0];

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 light-card p-6 shadow-sm">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Layers className="w-6 h-6 text-indigo-600" />
            <span>Hybrid RAG Retrieval Pipeline Visualizer</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Sparse BM25 + Dense Vector search fused via Reciprocal Rank Fusion (RRF) with exponential temporal recency decay & Zero-Trust ACL filters.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <span className="px-3 py-1 rounded-full badge-indigo text-xs font-mono font-bold">
            Pipeline Version 2.4-Hybrid
          </span>
          <button
            onClick={resetParameters}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 text-xs font-mono font-bold transition-all shadow-2xs active:scale-95"
          >
            <RefreshCw className="w-3.5 h-3.5 text-indigo-600" />
            <span>Reset Tuning</span>
          </button>
        </div>
      </div>

      {/* Stage Flowchart Navigation */}
      <div className="light-card p-6 space-y-6 bg-white border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="text-xs font-mono text-indigo-700 font-bold uppercase tracking-wider flex items-center gap-2">
            <Activity className="w-4 h-4 text-indigo-600" />
            <span>Retrieval Pipeline Stage Architecture</span>
          </div>
          <span className="text-[11px] font-mono text-slate-500">Click a stage to inspect parameters & formula</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {stages.map((stage) => {
            const Icon = stage.icon;
            const isActive = activeStage === stage.id;
            return (
              <button
                key={stage.id}
                onClick={() => setActiveStage(stage.id)}
                className={`p-4 rounded-xl text-left transition-all border ${
                  isActive
                    ? stage.activeColor
                    : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  {isActive ? (
                    <span className="w-7 h-7 rounded-full flex items-center justify-center font-mono font-bold text-xs bg-indigo-600 text-white">
                      0{stage.id}
                    </span>
                  ) : (
                    <span className="w-7 h-7 rounded-full flex items-center justify-center font-mono font-bold text-xs bg-slate-200 text-slate-700">
                      0{stage.id}
                    </span>
                  )}
                  <Icon className="w-4 h-4 text-indigo-600" />
                </div>
                <h4 className="font-bold text-xs text-slate-900 leading-tight">{stage.title}</h4>
                <p className="text-[10px] text-slate-500 font-mono mt-1">{stage.subtitle}</p>
              </button>
            );
          })}
        </div>

        {/* Selected Stage Detail Panel */}
        <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <span>Stage 0{currentStageInfo.id}: {currentStageInfo.title}</span>
              </h3>
              <p className="text-xs text-indigo-600 font-mono mt-0.5">{currentStageInfo.subtitle}</p>
            </div>
            <span className="text-xs font-mono text-slate-600 px-3 py-1 rounded bg-white border border-slate-200 font-semibold self-start sm:self-auto">
              {currentStageInfo.formulaName}
            </span>
          </div>

          <p className="text-xs text-slate-700 leading-relaxed font-sans font-medium">
            {currentStageInfo.description}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            {currentStageInfo.parameters.map((param, idx) => (
              <div key={idx} className="p-3 rounded-lg bg-white border border-slate-200 text-xs font-mono shadow-2xs">
                <span className="text-slate-500 block text-[10px] uppercase font-semibold">{param.name}</span>
                <span className="text-slate-900 font-bold text-sm">{param.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Interactive Hyperparameter Tuning Canvas */}
      <div className="light-card p-6 space-y-5 bg-white border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center space-x-2">
            <SlidersHorizontal className="w-5 h-5 text-indigo-600" />
            <h3 className="text-sm font-extrabold text-slate-900">Live Pipeline Hyperparameter Tuning Sandbox</h3>
          </div>
          <span className="text-[11px] font-mono text-slate-500">Adjust sliders to see candidate score transformations</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="text-[11px] font-mono text-slate-600 font-bold">RRF Constant (k)</div>
            <div className="text-2xl font-extrabold text-slate-900 font-mono">{rrfK}</div>
            <div className="text-[10px] text-slate-500">Controls rank scale smoothing</div>
            <input
              type="range"
              min="10"
              max="100"
              step="5"
              value={rrfK}
              onChange={(e) => setRrfK(parseFloat(e.target.value))}
              className="w-full mt-3 accent-indigo-600 cursor-pointer"
            />
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="text-[11px] font-mono text-slate-600 font-bold">Decay Lambda (λ)</div>
            <div className="text-2xl font-extrabold text-slate-900 font-mono">{decayLambda}</div>
            <div className="text-[10px] text-slate-500">Half-life ~{Math.round(Math.log(2) / decayLambda)} Days</div>
            <input
              type="range"
              min="0.001"
              max="0.02"
              step="0.001"
              value={decayLambda}
              onChange={(e) => setDecayLambda(parseFloat(e.target.value))}
              className="w-full mt-3 accent-indigo-600 cursor-pointer"
            />
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="text-[11px] font-mono text-slate-600 font-bold">Canonical Boost</div>
            <div className="text-2xl font-extrabold text-emerald-700 font-mono">{canonicalBoost.toFixed(2)}x</div>
            <div className="text-[10px] text-slate-500">Gold Tag Multiplier</div>
            <input
              type="range"
              min="1.00"
              max="2.00"
              step="0.05"
              value={canonicalBoost}
              onChange={(e) => setCanonicalBoost(parseFloat(e.target.value))}
              className="w-full mt-3 accent-emerald-600 cursor-pointer"
            />
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="text-[11px] font-mono text-slate-600 font-bold">Entailment Threshold</div>
            <div className="text-2xl font-extrabold text-amber-700 font-mono">{entailmentCutoff.toFixed(2)}</div>
            <div className="text-[10px] text-slate-500">NLI Grounding Cutoff</div>
            <input
              type="range"
              min="0.50"
              max="0.90"
              step="0.05"
              value={entailmentCutoff}
              onChange={(e) => setEntailmentCutoff(parseFloat(e.target.value))}
              className="w-full mt-3 accent-amber-600 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Master Mathematical Formulation Card */}
      <div className="light-card p-6 space-y-4 bg-white border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center space-x-2">
            <Cpu className="w-5 h-5 text-indigo-600" />
            <h3 className="text-sm font-extrabold text-slate-900">Unified Master Composite Ranking Equation</h3>
          </div>
          <span className="text-[11px] font-mono text-indigo-700 font-bold">End-to-End RAG Scoring</span>
        </div>

        {/* Master Formula Display */}
        <div className="p-5 rounded-xl bg-slate-900 text-slate-100 text-center font-mono text-sm leading-relaxed overflow-x-auto shadow-inner border border-slate-800">
          <div className="text-base font-extrabold text-indigo-300 mb-1">
            Score<sub>Final</sub>(d) = [ w<sub>1</sub> · S<sub>BM25</sub>(d) + w<sub>2</sub> · S<sub>Dense</sub>(d) ] × RRF<sub>k={rrfK}</sub>(d) × Boost<sub>Canonical</sub> × e<sup>-λ · Δt</sup>
          </div>
          <div className="text-xs text-slate-400 mt-2 font-sans">
            Where λ = {decayLambda}, Canonical Boost = {canonicalBoost}x, and ACL Entailment Gate requires NLI Grounding ≥ {entailmentCutoff}.
          </div>
        </div>
      </div>

      {/* Live Candidate Retrieval Simulation Sandbox */}
      <div className="light-card p-6 space-y-5 bg-white border border-slate-200 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-indigo-600" />
              <span>Live Candidate Retrieval Sandbox</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5 font-sans font-medium">
              Simulate candidate document scoring across Sparse, Dense, RRF Fusion, Decay & ACL Gate for any test query.
            </p>
          </div>

          {/* Persona selector for ACL evaluation */}
          <div className="flex items-center space-x-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
            <span className="text-[11px] font-mono text-slate-500 font-medium">Evaluating as:</span>
            <select
              value={selectedPersona.id}
              onChange={(e) => {
                const found = PRESET_PERSONAS.find((p) => p.id === e.target.value);
                if (found) setSelectedPersona(found);
              }}
              className="bg-transparent text-xs text-indigo-700 font-mono font-bold focus:outline-none cursor-pointer"
            >
              {PRESET_PERSONAS.map((p) => (
                <option key={p.id} value={p.id} className="bg-white text-slate-900">
                  {p.name} (L{p.clearanceLevel || 2} - {p.role})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Test Query Input Box */}
        <div className="flex items-center space-x-3 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
          <Search className="w-4 h-4 text-slate-400 ml-2" />
          <input
            type="text"
            value={testQuery}
            onChange={(e) => setTestQuery(e.target.value)}
            placeholder="Type query to test live retrieval candidates..."
            className="flex-1 bg-transparent text-xs text-slate-900 placeholder-slate-400 focus:outline-none font-mono font-medium"
          />
          <button
            onClick={() => setTestQuery('What is the production deployment and rollback process?')}
            className="px-3 py-1.5 text-[11px] font-mono font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition-all shadow-xs"
          >
            Try DevOps Query
          </button>
        </div>

        {/* Candidates Transformation Table */}
        <div className="overflow-x-auto bg-white rounded-lg border border-slate-200">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 uppercase text-[10px] font-bold">
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
                    {idx === 0 ? (
                      <span className="w-5 h-5 rounded text-[11px] font-bold flex items-center justify-center bg-indigo-600 text-white shadow-2xs">
                        #{idx + 1}
                      </span>
                    ) : (
                      <span className="w-5 h-5 rounded text-[11px] font-bold flex items-center justify-center bg-slate-200 text-slate-800">
                        #{idx + 1}
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-3">
                    <div className="font-bold font-sans text-slate-900 text-xs">{cand.documentTitle}</div>
                    <div className="text-[10px] text-slate-500">ID: {cand.chunkId} • {cand.sourceSystem}</div>
                  </td>
                  <td className="py-3 px-3 text-right font-bold text-indigo-600">{cand.sparseScore.toFixed(3)}</td>
                  <td className="py-3 px-3 text-right font-bold text-blue-600">{cand.denseScore.toFixed(3)}</td>
                  <td className="py-3 px-3 text-right font-bold text-emerald-600">{cand.rrfScore.toFixed(3)}</td>
                  <td className="py-3 px-3 text-right font-bold text-amber-600">{(cand.temporalDecay * 100).toFixed(1)}%</td>
                  <td className="py-3 px-3 text-right font-extrabold text-slate-900 text-sm">{cand.finalScore.toFixed(3)}</td>
                  <td className="py-3 px-3 text-center">
                    {cand.aclPassed ? (
                      <span className="px-2 py-0.5 rounded badge-emerald text-[10px] font-bold inline-flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        PASSED
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded badge-rose text-[10px] font-bold inline-flex items-center gap-1">
                        <Lock className="w-3 h-3 text-rose-600" />
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
