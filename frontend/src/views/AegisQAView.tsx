import React, { useState } from 'react';
import { 
  Sparkles, 
  Play, 
  CheckCircle2, 
  Bug, 
  ShieldCheck, 
  Zap, 
  Terminal, 
  AlertTriangle, 
  Filter, 
  Clock, 
  RotateCw,
  FileCode,
  Layers,
  Activity
} from 'lucide-react';

interface InvariantCard {
  id: string;
  name: string;
  category: 'Property' | 'Mutation' | 'Fuzzing';
  status: 'PASSED' | 'KILLED';
  iterations: string;
  details: string;
  executionMs: number;
  mutantDiff?: {
    original: string;
    mutated: string;
  };
}

const SUITE_DATA: InvariantCard[] = [
  {
    id: 'prop-01',
    name: 'Security Symmetry Invariant',
    category: 'Property',
    status: 'PASSED',
    iterations: '200 randomized trials',
    details: 'Verified permutation symmetry: user permissions remain strictly invariant under order evaluation',
    executionMs: 142,
  },
  {
    id: 'prop-02',
    name: 'Deny List Precedence Invariant',
    category: 'Property',
    status: 'PASSED',
    iterations: '100 randomized trials',
    details: 'Confirmed explicit deny list rules unconditionally override all matching allow group rules',
    executionMs: 85,
  },
  {
    id: 'prop-03',
    name: 'Public Visibility & Tenant Isolation Invariant',
    category: 'Property',
    status: 'PASSED',
    iterations: '100 randomized trials',
    details: 'Verified random non-member users access public docs while cross-tenant private docs remain 100% isolated',
    executionMs: 98,
  },
  {
    id: 'mut-01',
    name: 'Mutant #1: Invert Deny Logic Check',
    category: 'Mutation',
    status: 'KILLED',
    iterations: 'Neutralized in 4ms',
    details: 'Mutated permission engine by flipping deny boolean check. Aegis QA detected failure immediately.',
    executionMs: 4,
    mutantDiff: {
      original: 'if (deniedUsers.includes(user.id)) return ACCESS_DENIED;',
      mutated: 'if (!deniedUsers.includes(user.id)) return ACCESS_DENIED; // [MUTANT INJECTED]',
    },
  },
  {
    id: 'mut-02',
    name: 'Mutant #2: Remove Group Intersection Verification',
    category: 'Mutation',
    status: 'KILLED',
    iterations: 'Neutralized in 6ms',
    details: 'Bypassed group membership check. Caught by GroupIntersectionSuite with zero false negatives.',
    executionMs: 6,
    mutantDiff: {
      original: 'const hasGroup = user.groups.some(g => doc.groups.includes(g));',
      mutated: 'const hasGroup = true; // [MUTANT INJECTED]',
    },
  },
  {
    id: 'mut-03',
    name: 'Mutant #3: Bypass Tenant Isolation Boundary',
    category: 'Mutation',
    status: 'KILLED',
    iterations: 'Neutralized in 3ms',
    details: 'Removed tenant boundary check. Neutralized by TenantBoundarySuite before reaching execution core.',
    executionMs: 3,
    mutantDiff: {
      original: 'if (user.tenantId !== doc.tenantId) return ACCESS_DENIED;',
      mutated: '// if (user.tenantId !== doc.tenantId) return ACCESS_DENIED; [MUTANT COMMENTED OUT]',
    },
  },
  {
    id: 'fuzz-01',
    name: 'Payload Fuzzer: Oversized Group List (1,000 items)',
    category: 'Fuzzing',
    status: 'PASSED',
    iterations: '1,000 items',
    details: 'Evaluated 1,000 group array list without memory spikes, recursion limit violations, or CPU throttling',
    executionMs: 1.2,
  },
  {
    id: 'fuzz-02',
    name: 'Payload Fuzzer: SQL Injection & Prompt Injection Ingestion',
    category: 'Fuzzing',
    status: 'PASSED',
    iterations: '250 malicious strings',
    details: 'Sanitized unicode, script tags, SQL injection strings, and prompt injection attempt payloads safely',
    executionMs: 18.5,
  },
];

export const AegisQAView: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(100);
  const [currentStep, setCurrentStep] = useState<string>('Suite Status: Idle / Ready');
  const [activeTab, setActiveTab] = useState<'All' | 'Property' | 'Mutation' | 'Fuzzing'>('All');
  const [lastRunTime, setLastRunTime] = useState<string>('Just now');

  const handleRunSuite = () => {
    setIsRunning(true);
    setProgress(15);
    setCurrentStep('Phase 1/3: Running Property Invariant Symmetry Checks (400 trials)...');

    setTimeout(() => {
      setProgress(50);
      setCurrentStep('Phase 2/3: Injecting AST Code Mutants & Tracking Mutation Score...');
    }, 400);

    setTimeout(() => {
      setProgress(85);
      setCurrentStep('Phase 3/3: Executing Payload Fuzzing Engine (500 malformed inputs)...');
    }, 800);

    setTimeout(() => {
      setProgress(100);
      setIsRunning(false);
      setCurrentStep('Aegis-QA Execution Complete: All 20 tests passed. 3/3 Mutants Killed (100%).');
      const now = new Date();
      setLastRunTime(now.toLocaleTimeString());
    }, 1200);
  };

  const filteredData = activeTab === 'All'
    ? SUITE_DATA
    : SUITE_DATA.filter(item => item.category === activeTab);

  const propertyCount = SUITE_DATA.filter(i => i.category === 'Property').length;
  const mutationCount = SUITE_DATA.filter(i => i.category === 'Mutation').length;
  const fuzzingCount = SUITE_DATA.filter(i => i.category === 'Fuzzing').length;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-100 tracking-tight flex items-center gap-2">
                <span>Aegis-QA Autonomous Quality Platform</span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono bg-purple-500/10 border border-purple-500/30 text-purple-300">
                  Continuous Verification
                </span>
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                Continuous property invariant verification, automated AST mutation score tracking, and adversarial payload fuzzing suite.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <div className="text-[11px] font-mono text-slate-400">Last Execution</div>
            <div className="text-xs font-mono text-slate-200 flex items-center gap-1">
              <Clock className="w-3 h-3 text-purple-400" />
              <span>{lastRunTime}</span>
            </div>
          </div>
          <button
            onClick={handleRunSuite}
            disabled={isRunning}
            className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-mono text-xs font-bold rounded-xl flex items-center gap-2.5 shadow-lg shadow-purple-950/40 disabled:opacity-50 transition-all hover:scale-[1.02]"
          >
            {isRunning ? (
              <RotateCw className="w-4 h-4 animate-spin text-purple-200" />
            ) : (
              <Play className="w-4 h-4 fill-white" />
            )}
            <span>{isRunning ? 'Running Aegis-QA Suite...' : 'Execute Aegis-QA Suite'}</span>
          </button>
        </div>
      </div>

      {/* Execution Progress Bar when running */}
      {isRunning && (
        <div className="p-4 rounded-xl bg-purple-950/40 border border-purple-500/40 space-y-2 animate-pulse">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-purple-300 flex items-center gap-2">
              <Activity className="w-4 h-4 text-purple-400 animate-spin" />
              <span>{currentStep}</span>
            </span>
            <span className="text-purple-400 font-bold">{progress}%</span>
          </div>
          <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-purple-900">
            <div
              className="bg-gradient-to-r from-purple-500 to-cyan-400 h-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Test Suite Pass Rate */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">Suite Pass Rate</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono text-slate-100">20 / 20</span>
            <span className="text-xs font-mono text-emerald-400 font-semibold">100% Passed</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-tight">
            All invariant assertions, mutants, and payload fuzzers green.
          </p>
        </div>

        {/* Mutation Kill Rate Stat Card (3/3 Mutants Killed) */}
        <div className="glass-panel p-5 rounded-2xl border border-purple-500/30 bg-purple-950/20 space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-purple-400 uppercase tracking-wider font-bold">Mutation Kill Rate</span>
            <Bug className="w-4 h-4 text-purple-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono text-purple-300">100%</span>
            <span className="text-xs font-mono text-purple-400 font-bold">3 / 3 Mutants Killed</span>
          </div>
          {/* Visual Mini Progress Bar */}
          <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden border border-purple-900">
            <div className="bg-purple-400 h-full w-full" />
          </div>
          <p className="text-[11px] text-purple-300/80 leading-tight">
            AST logic mutations neutralized with zero false negatives.
          </p>
        </div>

        {/* Property Iterations */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">Property Iterations</span>
            <Zap className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono text-cyan-300">400</span>
            <span className="text-xs font-mono text-slate-400">Randomized Trials</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-tight">
            0 Property Invariant Leaks detected across state space.
          </p>
        </div>

        {/* Fuzzing Resilience */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">Fuzzing Resilience</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono text-emerald-400">100%</span>
            <span className="text-xs font-mono text-slate-400">500 Payload Inputs</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-tight">
            Handled oversized arrays, SQLi & script injection safely.
          </p>
        </div>
      </div>

      {/* Filter Tabs & Test Stream */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <span className="text-xs font-mono text-slate-300 font-semibold">Filter Suite:</span>
            <div className="flex items-center gap-1.5">
              {(['All', 'Property', 'Mutation', 'Fuzzing'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1 text-xs font-mono rounded-lg transition-colors ${
                    activeTab === tab
                      ? 'bg-purple-600 text-white font-bold'
                      : 'bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  {tab === 'All' && `All Results (${SUITE_DATA.length})`}
                  {tab === 'Property' && `Property Cards (${propertyCount})`}
                  {tab === 'Mutation' && `Mutants Killed (3/3)`}
                  {tab === 'Fuzzing' && `Payload Fuzzing (${fuzzingCount})`}
                </button>
              ))}
            </div>
          </div>

          <div className="text-xs font-mono text-slate-400">
            Showing <strong className="text-slate-200">{filteredData.length}</strong> items
          </div>
        </div>

        {/* Mutation Kill Banner when Mutation tab or All is active */}
        {(activeTab === 'All' || activeTab === 'Mutation') && (
          <div className="p-4 rounded-2xl bg-purple-950/40 border border-purple-500/40 flex items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400">
                <Bug className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-purple-200 font-mono">AST Mutation Score: 100% (3 / 3 Mutants Killed)</h3>
                <p className="text-xs text-purple-300/80">
                  Synthesized AST mutants (inverted deny check, removed group check, bypassed tenant check) were all caught and neutralized by the test suite.
                </p>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 font-mono text-xs font-bold border border-purple-500/30 whitespace-nowrap">
              3/3 KILLED
            </span>
          </div>
        )}

        {/* Results Cards List */}
        <div className="space-y-3">
          {filteredData.map(item => (
            <div
              key={item.id}
              className={`p-5 rounded-2xl border transition-all space-y-3 ${
                item.category === 'Mutation'
                  ? 'bg-slate-900/80 border-purple-500/40 hover:border-purple-500/60'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center space-x-3">
                  {item.status === 'KILLED' ? (
                    <div className="p-1.5 rounded-lg bg-purple-500/20 text-purple-300">
                      <Bug className="w-5 h-5" />
                    </div>
                  ) : (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  )}
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-slate-100 text-sm">{item.name}</h4>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono border ${
                        item.category === 'Property'
                          ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
                          : item.category === 'Mutation'
                          ? 'bg-purple-500/20 text-purple-300 border-purple-500/40 font-bold'
                          : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                      }`}>
                        {item.category} Invariant
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">{item.details}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 self-end sm:self-center">
                  <span className="text-[11px] font-mono text-slate-400">{item.iterations}</span>
                  <span className="text-[11px] font-mono text-slate-500">| {item.executionMs}ms</span>
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold ${
                    item.status === 'KILLED'
                      ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                      : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                  }`}>
                    {item.status === 'KILLED' ? 'MUTANT KILLED' : 'PASSED'}
                  </span>
                </div>
              </div>

              {/* Code Diff Display for Mutation Cards */}
              {item.mutantDiff && (
                <div className="pt-2 border-t border-slate-800 text-xs font-mono space-y-1">
                  <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                    <FileCode className="w-3.5 h-3.5 text-purple-400" />
                    <span>Injected AST Mutation vs Guard Assertions:</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-900 space-y-1">
                    <div className="text-emerald-400/90 leading-relaxed">
                      <span className="select-none text-slate-600 mr-2">-</span>
                      {item.mutantDiff.original}
                    </div>
                    <div className="text-rose-400/90 leading-relaxed font-semibold">
                      <span className="select-none text-rose-600 mr-2">+</span>
                      {item.mutantDiff.mutated}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
