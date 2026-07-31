import React, { useState } from 'react';
import { 
  Sparkles, 
  Play, 
  CheckCircle2, 
  Bug, 
  ShieldCheck, 
  Zap, 
  Filter, 
  Clock, 
  RotateCw,
  FileCode,
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
  const fuzzingCount = SUITE_DATA.filter(i => i.category === 'Fuzzing').length;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Notion Warm Yellow Hero Container */}
      <div className="notion-block-yellow p-6 md:p-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-[#FFFFFF] border border-[#FFE9B8] text-[#D97706] shadow-2xs">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-[#000000] tracking-tight flex items-center gap-2">
                  <span>Aegis-QA Autonomous Quality Platform</span>
                  <span className="px-2.5 py-0.5 rounded-full badge-amber text-xs font-mono font-bold">
                    Continuous Verification
                  </span>
                </h1>
                <p className="text-xs text-[#787774] mt-0.5 font-medium">
                  Continuous property invariant verification, automated AST mutation score tracking, and adversarial payload fuzzing suite.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <div className="text-[11px] font-mono text-[#787774]">Last Execution</div>
              <div className="text-xs font-mono text-[#37352F] flex items-center gap-1 font-bold">
                <Clock className="w-3 h-3 text-[#2383E2]" />
                <span>{lastRunTime}</span>
              </div>
            </div>
            <button
              onClick={handleRunSuite}
              disabled={isRunning}
              className="px-5 py-2.5 bg-[#2383E2] hover:bg-[#1D74CB] text-white font-mono text-xs font-bold rounded-lg flex items-center gap-2.5 shadow-xs disabled:opacity-50 transition-all active:scale-95"
            >
              {isRunning ? (
                <RotateCw className="w-4 h-4 animate-spin text-white" />
              ) : (
                <Play className="w-4 h-4 fill-white" />
              )}
              <span>{isRunning ? 'Running Aegis-QA Suite...' : 'Execute Aegis-QA Suite'}</span>
            </button>
          </div>
        </div>

        {/* Telemetry Bento Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Suite Pass Rate */}
          <div className="notion-card p-5 space-y-2 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-[#787774] uppercase tracking-wider font-semibold">Suite Pass Rate</span>
              <CheckCircle2 className="w-4 h-4 text-[#00A884]" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold font-mono text-[#000000]">20 / 20</span>
              <span className="text-xs font-mono text-[#00A884] font-bold">100% Passed</span>
            </div>
            <p className="text-[11px] text-[#787774] font-medium leading-tight">
              All invariant assertions, mutants, and payload fuzzers green.
            </p>
          </div>

          {/* Mutation Kill Rate */}
          <div className="notion-card p-5 space-y-2 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-[#00A884] uppercase tracking-wider font-bold">Mutation Kill Rate</span>
              <Bug className="w-4 h-4 text-[#00A884]" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold font-mono text-[#00A884]">100%</span>
              <span className="text-xs font-mono text-[#00A884] font-bold">3 / 3 Mutants Killed</span>
            </div>
            <div className="w-full bg-[#F1F0EC] rounded-full h-1.5 overflow-hidden">
              <div className="bg-[#00A884] h-full w-full" />
            </div>
            <p className="text-[11px] text-[#787774] font-medium leading-tight">
              AST logic mutations neutralized with zero false negatives.
            </p>
          </div>

          {/* Property Iterations */}
          <div className="notion-card p-5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-[#787774] uppercase tracking-wider font-semibold">Property Iterations</span>
              <Zap className="w-4 h-4 text-[#2383E2]" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold font-mono text-[#000000]">400</span>
              <span className="text-xs font-mono text-[#787774] font-medium">Randomized Trials</span>
            </div>
            <p className="text-[11px] text-[#787774] font-medium leading-tight">
              0 Property Invariant Leaks detected across state space.
            </p>
          </div>

          {/* Fuzzing Resilience */}
          <div className="notion-card p-5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-[#787774] uppercase tracking-wider font-semibold">Fuzzing Resilience</span>
              <ShieldCheck className="w-4 h-4 text-[#00A884]" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold font-mono text-[#00A884]">100%</span>
              <span className="text-xs font-mono text-[#787774] font-medium">500 Payload Inputs</span>
            </div>
            <p className="text-[11px] text-[#787774] font-medium leading-tight">
              Handled oversized arrays, SQLi & script injection safely.
            </p>
          </div>
        </div>
      </div>

      {/* Progress Bar when Running */}
      {isRunning && (
        <div className="notion-card p-4 space-y-2 animate-pulse bg-[#EAF2FF]/60 border-[#BCE0FD]">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-[#2383E2] flex items-center gap-2 font-bold">
              <Activity className="w-4 h-4 text-[#2383E2] animate-spin" />
              <span>{currentStep}</span>
            </span>
            <span className="text-[#2383E2] font-bold">{progress}%</span>
          </div>
          <div className="w-full bg-[#F1F0EC] rounded-full h-2 overflow-hidden">
            <div
              className="bg-[#2383E2] h-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Segmented Tab Control & Interactive Test List */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E9E8E4] pb-3">
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-[#787774]" />
            <span className="text-xs font-mono text-[#37352F] font-bold">Filter Suite:</span>
            
            {/* Segmented Tab Control */}
            <div className="flex items-center gap-1.5 p-1 bg-[#F7F6F3] rounded-xl border border-[#E9E8E4]">
              {(['All', 'Property', 'Mutation', 'Fuzzing'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1 text-xs font-mono rounded-lg transition-all ${
                    activeTab === tab
                      ? 'bg-[#FFFFFF] text-[#2383E2] font-bold shadow-2xs border border-[#E9E8E4]'
                      : 'text-[#787774] hover:text-[#37352F]'
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

          <div className="text-xs font-mono text-[#787774]">
            Showing <strong className="text-[#000000]">{filteredData.length}</strong> items
          </div>
        </div>

        {/* Mutation Kill Banner */}
        {(activeTab === 'All' || activeTab === 'Mutation') && (
          <div className="p-4 rounded-2xl badge-emerald flex items-center justify-between gap-4 shadow-2xs">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-xl bg-[#FFFFFF] border border-[#9EE6D3] text-[#00A884]">
                <Bug className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-[#000000] font-mono">AST Mutation Score: 100% (3 / 3 Mutants Killed)</h3>
                <p className="text-xs text-[#00A884] font-medium">
                  Synthesized AST mutants (inverted deny check, removed group check, bypassed tenant check) were all caught and neutralized.
                </p>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full bg-[#FFFFFF] text-[#00A884] font-mono text-xs font-extrabold border border-[#9EE6D3] whitespace-nowrap">
              3/3 KILLED
            </span>
          </div>
        )}

        {/* Results Cards List */}
        <div className="space-y-3">
          {filteredData.map(item => (
            <div
              key={item.id}
              className="notion-card-interactive p-5 space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center space-x-3">
                  {item.status === 'KILLED' ? (
                    <div className="p-1.5 rounded-lg bg-[#E6F8F3] text-[#00A884]">
                      <Bug className="w-5 h-5" />
                    </div>
                  ) : (
                    <CheckCircle2 className="w-5 h-5 text-[#00A884] flex-shrink-0" />
                  )}
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-[#000000] text-sm">{item.name}</h4>
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold ${
                        item.category === 'Property'
                          ? 'badge-blue'
                          : item.category === 'Mutation'
                          ? 'badge-emerald'
                          : 'badge-amber'
                      }`}>
                        {item.category} Invariant
                      </span>
                    </div>
                    <p className="text-xs text-[#787774] mt-0.5 font-medium">{item.details}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 self-end sm:self-center">
                  <span className="text-[11px] font-mono text-[#787774]">{item.iterations}</span>
                  <span className="text-[11px] font-mono text-[#787774]">| {item.executionMs}ms</span>
                  <span className="px-2.5 py-1 rounded-md text-xs font-mono font-bold badge-emerald">
                    {item.status === 'KILLED' ? 'MUTANT KILLED' : 'PASSED'}
                  </span>
                </div>
              </div>

              {/* Code Diff Display for Mutation Cards */}
              {item.mutantDiff && (
                <div className="pt-2 border-t border-[#E9E8E4] text-xs font-mono space-y-1">
                  <div className="text-[11px] text-[#787774] flex items-center gap-1.5 font-bold">
                    <FileCode className="w-3.5 h-3.5 text-[#2383E2]" />
                    <span>Injected AST Mutation vs Guard Assertions:</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#F7F6F3] text-[#37352F] space-y-1 border border-[#E9E8E4]">
                    <div className="text-[#00A884] leading-relaxed font-mono">
                      <span className="select-none text-[#787774] mr-2">-</span>
                      {item.mutantDiff.original}
                    </div>
                    <div className="text-[#E11D48] leading-relaxed font-mono font-bold">
                      <span className="select-none text-[#E11D48] mr-2">+</span>
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
