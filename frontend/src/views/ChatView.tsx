import React, { useState } from 'react';
import { UserPersona, EngineAdapter, QueryResult } from '../mockEngine/engineAdapter';
import { GroundingBadge } from '../components/GroundingBadge';
import { CitationModal } from '../components/CitationModal';
import {
  Send,
  Bot,
  User,
  Sparkles,
  AlertTriangle,
  FileText,
  ArrowRight,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Zap,
  RotateCcw,
  Lock,
  ChevronDown,
  ChevronUp,
  Cpu,
  Layers,
  Search,
  MessageSquare,
  Sparkle,
  Info
} from 'lucide-react';

interface ChatViewProps {
  currentPersona: UserPersona;
}

interface PromptChip {
  category: string;
  label: string;
  query: string;
  icon: string;
  color: string;
}

export const ChatView: React.FC<ChatViewProps> = ({ currentPersona }) => {
  const [inputQuery, setInputQuery] = useState('');
  const [history, setHistory] = useState<QueryResult[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedCitation, setSelectedCitation] = useState<any>(null);
  const [expandedClaims, setExpandedClaims] = useState<Record<string, boolean>>({});

  const samplePromptChips: PromptChip[] = [
    {
      category: 'Architecture',
      label: 'API Gateway & Rate Limits',
      query: 'How does our API gateway handle rate limiting and token buckets?',
      icon: '⚡',
      color: 'border-cyan-500/30 text-cyan-400 bg-cyan-500/10 hover:bg-cyan-500/20',
    },
    {
      category: 'DevOps',
      label: 'Deployments & Rollbacks',
      query: 'What is the production deployment and rollback process?',
      icon: '🚀',
      color: 'border-purple-500/30 text-purple-400 bg-purple-500/10 hover:bg-purple-500/20',
    },
    {
      category: 'Legal',
      label: 'Customer DPA Details',
      query: 'What are the details of the customer Data Processing Agreement (DPA)?',
      icon: '⚖️',
      color: 'border-amber-500/30 text-amber-400 bg-amber-500/10 hover:bg-amber-500/20',
    },
    {
      category: 'Identity',
      label: 'Password & MFA Setup',
      query: 'How do users reset their password and set up MFA?',
      icon: '🔑',
      color: 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20',
    },
    {
      category: 'Billing',
      label: 'Plans & Pricing FAQ',
      query: 'What subscription plans and billing discounts are available?',
      icon: '💳',
      color: 'border-blue-500/30 text-blue-400 bg-blue-500/10 hover:bg-blue-500/20',
    },
    {
      category: 'Onboarding',
      label: 'Engineering Onboarding',
      query: 'What is the engineering onboarding process and mandatory training?',
      icon: '📖',
      color: 'border-indigo-500/30 text-indigo-400 bg-indigo-500/10 hover:bg-indigo-500/20',
    },
  ];

  const handleSend = (textToSend?: string) => {
    const q = textToSend || inputQuery;
    if (!q.trim() || isProcessing) return;

    setIsProcessing(true);
    if (!textToSend) setInputQuery('');

    setTimeout(() => {
      const result = EngineAdapter.executeQuery(q, currentPersona);
      setHistory(prev => [result, ...prev]);
      setIsProcessing(false);
    }, 450);
  };

  const toggleClaims = (queryId: string) => {
    setExpandedClaims(prev => ({ ...prev, [queryId]: !prev[queryId] }));
  };

  const clearHistory = () => {
    setHistory([]);
  };

  const getClassificationBadge = (classification: string) => {
    switch (classification.toLowerCase()) {
      case 'public':
        return 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30';
      case 'internal':
        return 'bg-blue-500/15 text-blue-300 border-blue-500/30';
      case 'confidential':
        return 'bg-amber-500/15 text-amber-300 border-amber-500/30';
      case 'restricted':
        return 'bg-rose-500/15 text-rose-300 border-rose-500/30';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  const getSourceBadge = (source: string) => {
    switch (source.toLowerCase()) {
      case 'confluence':
        return { label: 'Confluence', bg: 'bg-sky-500/10 text-sky-400 border-sky-500/20' };
      case 'google_drive':
        return { label: 'Google Drive', bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' };
      case 'zendesk':
        return { label: 'Zendesk KB', bg: 'bg-violet-500/10 text-violet-400 border-violet-500/20' };
      default:
        return { label: source, bg: 'bg-slate-800 text-slate-300 border-slate-700' };
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Workspace Header & Active Persona Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-5 rounded-2xl border border-slate-700/80 shadow-lg">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-xl font-bold text-slate-100 tracking-tight flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-cyan-400" />
              <span>AI Knowledge Assistant Workspace</span>
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-semibold">
              Live RAG
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Enterprise Q&A backed by BM25 + Dense Vector hybrid retrieval, Reciprocal Rank Fusion, and Zero-Trust ACL enforcement.
          </p>
        </div>

        {/* Active Clearance Badge */}
        <div className="flex items-center space-x-3 bg-slate-950/70 border border-slate-800 px-3.5 py-2 rounded-xl">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-lg">
            {currentPersona.avatar}
          </div>
          <div className="text-xs">
            <div className="font-semibold text-slate-200 flex items-center gap-1.5">
              <span>{currentPersona.name}</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-cyan-400 border border-slate-700">
                {currentPersona.role}
              </span>
            </div>
            <div className="text-[11px] text-slate-400 font-mono mt-0.5 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-cyan-400" />
              <span>Clearance: <span className="text-slate-300 font-medium">{currentPersona.securityClearance}</span></span>
            </div>
          </div>
        </div>
      </div>

      {/* Ultra-Clean Prompt Input Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-700/80 shadow-xl space-y-3.5 transition-all">
        <div className="relative group">
          <textarea
            rows={3}
            value={inputQuery}
            onChange={e => setInputQuery(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder={`Ask any enterprise question as ${currentPersona.name}... (Press Shift + Enter for new line)`}
            className="w-full bg-slate-950/70 border border-slate-700/80 focus:border-cyan-500/60 rounded-xl pl-4 pr-28 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 resize-none font-sans leading-relaxed transition-all shadow-inner"
          />

          <div className="absolute right-3 bottom-3 flex items-center space-x-2">
            {inputQuery.trim() && (
              <button
                onClick={() => setInputQuery('')}
                className="px-2 py-1 text-[11px] font-mono text-slate-400 hover:text-slate-200 transition-colors"
                title="Clear input"
              >
                Clear
              </button>
            )}
            <button
              onClick={() => handleSend()}
              disabled={!inputQuery.trim() || isProcessing}
              className="inline-flex items-center space-x-1.5 px-3.5 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-semibold rounded-lg disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-md active:scale-95"
            >
              <span>Ask AI</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Quick Prompt Chips */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Suggested Enterprise Queries</span>
            </span>
            <span className="text-slate-500">Click chip to execute</span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {samplePromptChips.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(chip.query)}
                className={`px-3 py-1.5 rounded-xl border text-xs font-medium whitespace-nowrap transition-all duration-200 flex items-center space-x-1.5 active:scale-95 ${chip.color}`}
              >
                <span className="text-xs">{chip.icon}</span>
                <span>{chip.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Processing Loader */}
      {isProcessing && (
        <div className="glass-panel p-6 rounded-2xl border border-cyan-500/30 flex flex-col items-center justify-center space-y-3 text-cyan-400 shadow-xl animate-pulse">
          <div className="flex items-center space-x-3">
            <Cpu className="w-6 h-6 animate-spin text-cyan-400" />
            <span className="text-sm font-mono font-semibold">Executing Hybrid RAG Pipeline & Zero-Trust ACL Verification...</span>
          </div>
          <div className="flex items-center space-x-4 text-[11px] font-mono text-slate-400">
            <span>[Stage 1: BM25 Sparse]</span>
            <span>→</span>
            <span>[Stage 2: Dense Cosine]</span>
            <span>→</span>
            <span>[Stage 3: RRF k=60]</span>
            <span>→</span>
            <span>[Stage 4: ACL Gate]</span>
          </div>
        </div>
      )}

      {/* Query Results Stream */}
      <div className="space-y-6">
        {history.length === 0 && !isProcessing && (
          <div className="glass-panel p-12 rounded-2xl text-center space-y-4 border-dashed border-slate-800">
            <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mx-auto shadow-inner">
              <Bot className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-semibold text-slate-200">No Queries Executed Yet</h3>
              <p className="text-xs text-slate-400 max-w-lg mx-auto leading-relaxed">
                Type a question above or click one of the quick prompt chips. Test how the engine returns answers or abstains based on <span className="text-cyan-400 font-mono">{currentPersona.name}'s</span> security clearance.
              </p>
            </div>
          </div>
        )}

        {history.length > 0 && (
          <div className="flex items-center justify-between px-1">
            <div className="text-xs font-mono text-slate-400">
              Query History ({history.length} {history.length === 1 ? 'result' : 'results'})
            </div>
            <button
              onClick={clearHistory}
              className="inline-flex items-center space-x-1 text-xs font-mono text-slate-500 hover:text-rose-400 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Clear History</span>
            </button>
          </div>
        )}

        {history.map((res) => {
          const confidencePercent = Math.round(res.confidenceScore * 100);
          const isClaimsOpen = expandedClaims[res.queryId] ?? true;

          return (
            <div
              key={res.queryId}
              className="glass-panel p-6 rounded-2xl space-y-5 border border-slate-700/80 shadow-xl hover:border-slate-600/80 transition-all"
            >
              {/* Header: Persona, Query, Latency & Confidence Score Meter */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
                <div className="flex items-start space-x-3">
                  <div className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-xl shrink-0 mt-0.5">
                    {res.user.avatar}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-100 leading-snug">
                      "{res.queryText}"
                    </h4>
                    <div className="text-[11px] text-slate-400 font-mono mt-1 flex flex-wrap items-center gap-2">
                      <span>Asked by <strong className="text-slate-300">{res.user.name}</strong> ({res.user.role})</span>
                      <span>•</span>
                      <span className="flex items-center gap-1 text-slate-400">
                        <Clock className="w-3 h-3" />
                        {res.timestamp}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Score & Latency Badges */}
                <div className="flex items-center space-x-3 self-end md:self-auto shrink-0">
                  <div className="flex items-center space-x-2 bg-slate-950/60 px-3 py-1.5 rounded-full border border-slate-800 text-xs font-mono">
                    <Zap className="w-3.5 h-3.5 text-cyan-400" />
                    <span className="text-slate-300">{res.latencyMs}ms</span>
                  </div>

                  {/* Confidence Meter */}
                  <div className="flex items-center space-x-2 bg-slate-950/60 px-3 py-1.5 rounded-full border border-slate-800 text-xs font-mono">
                    <span className="text-slate-400 text-[10px]">Confidence:</span>
                    <div className="w-16 h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          confidencePercent >= 75
                            ? 'bg-emerald-400'
                            : confidencePercent >= 50
                            ? 'bg-cyan-400'
                            : 'bg-amber-400'
                        }`}
                        style={{ width: `${confidencePercent}%` }}
                      />
                    </div>
                    <span className={`font-bold ${
                      confidencePercent >= 75
                        ? 'text-emerald-400'
                        : confidencePercent >= 50
                        ? 'text-cyan-400'
                        : 'text-amber-400'
                    }`}>
                      {confidencePercent}%
                    </span>
                  </div>

                  <GroundingBadge score={res.confidenceScore} isAbstained={res.isAbstained} />
                </div>
              </div>

              {/* Response Section */}
              <div className="space-y-3">
                {res.isAbstained ? (
                  /* Abstention Card */
                  <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs leading-relaxed space-y-3 shadow-lg">
                    <div className="flex items-center justify-between border-b border-amber-500/20 pb-2.5">
                      <div className="font-semibold text-sm flex items-center gap-2 text-amber-300">
                        <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
                        <span>Intelligent Engine Abstention Triggered</span>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[10px] font-mono uppercase font-bold">
                        Zero-Trust ACL Guardrail
                      </span>
                    </div>

                    <p className="text-xs text-amber-100 font-sans leading-relaxed">
                      {res.answerText}
                    </p>

                    <div className="bg-slate-950/60 p-3 rounded-xl border border-amber-500/20 text-[11px] font-mono text-amber-300/90 space-y-1">
                      <div className="flex items-center gap-1.5 font-bold">
                        <Lock className="w-3.5 h-3.5 text-amber-400" />
                        <span>Abstention Rationale:</span>
                      </div>
                      <div>{res.abstentionReason || 'No verified document satisfied both retrieval similarity thresholds and security clearance.'}</div>
                      <div className="text-[10px] text-slate-400 mt-1">
                        Current User Group Clearance: <span className="text-cyan-400">{res.user.groups.join(', ')}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Regular Answer Display */
                  <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 text-xs text-slate-200 leading-relaxed font-sans whitespace-pre-wrap shadow-inner space-y-2">
                    <div className="flex items-center space-x-2 text-[11px] font-mono text-cyan-400 font-semibold mb-1">
                      <Bot className="w-4 h-4" />
                      <span>Synthesized Verified Answer</span>
                    </div>
                    <div>{res.answerText}</div>
                  </div>
                )}
              </div>

              {/* NLI Grounding Verification Accordion (Claims Check) */}
              {!res.isAbstained && res.claims && res.claims.length > 0 && (
                <div className="rounded-xl border border-slate-800 bg-slate-950/40 overflow-hidden space-y-0">
                  <button
                    onClick={() => toggleClaims(res.queryId)}
                    className="w-full px-4 py-3 bg-slate-900/60 hover:bg-slate-900 text-left flex items-center justify-between text-xs font-mono transition-colors"
                  >
                    <div className="flex items-center space-x-2 text-slate-300">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span className="font-semibold">NLI Claim Verification Checks ({res.claims.length})</span>
                    </div>
                    <div className="flex items-center space-x-2 text-slate-400">
                      <span className="text-[11px]">Click to {isClaimsOpen ? 'collapse' : 'expand'}</span>
                      {isClaimsOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </button>

                  {isClaimsOpen && (
                    <div className="p-4 space-y-2.5 border-t border-slate-800">
                      {res.claims.map((claim, cIdx) => (
                        <div
                          key={cIdx}
                          className="p-3 rounded-lg bg-slate-900/80 border border-slate-800/80 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
                        >
                          <div className="space-y-1 max-w-2xl">
                            <div className="text-slate-200 font-sans italic">"{claim.claimSentence}"</div>
                            <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400">
                              <span>Supporting Chunks:</span>
                              {claim.supportingChunkIds.map(cId => (
                                <span key={cId} className="px-1.5 py-0.5 rounded bg-slate-800 text-cyan-400 font-bold">
                                  {cId}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="flex items-center space-x-3 shrink-0 self-end md:self-auto">
                            <div className="text-right font-mono">
                              <div className="text-[10px] text-slate-400">Entailment</div>
                              <div className="text-xs font-bold text-emerald-400">{Math.round(claim.entailmentScore * 100)}%</div>
                            </div>
                            <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono font-bold flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" />
                              VERIFIED
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Citations & Evidence Cards Grid */}
              {res.citations.length > 0 && (
                <div className="space-y-3 pt-1">
                  <div className="text-xs font-mono text-slate-400 uppercase tracking-wider flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <FileText className="w-4 h-4 text-cyan-400" />
                      <span>Verified Citations & Context Chunks ({res.citations.length})</span>
                    </span>
                    <span className="text-cyan-400 text-[11px] lowercase font-normal">Click card to open full chunk detail</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    {res.citations.map(cite => {
                      const sourceInfo = getSourceBadge(cite.sourceSystem);
                      const classificationClass = getClassificationBadge(cite.classification);

                      return (
                        <button
                          key={cite.chunkId}
                          onClick={() => setSelectedCitation(cite)}
                          className="glass-panel-interactive p-4 rounded-xl text-left flex flex-col justify-between space-y-3 group border border-slate-700/70 hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/5 transition-all"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-start space-x-2.5 min-w-0">
                              <span className="w-6 h-6 rounded-md bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono font-bold flex items-center justify-center shrink-0 group-hover:bg-cyan-500 group-hover:text-slate-950 transition-colors">
                                [{cite.citationIndex}]
                              </span>
                              <div className="min-w-0">
                                <h5 className="font-semibold text-xs text-slate-100 truncate group-hover:text-cyan-300 transition-colors">
                                  {cite.documentTitle}
                                </h5>
                                <div className="text-[10px] font-mono text-slate-400 mt-0.5">
                                  ID: {cite.chunkId}
                                </div>
                              </div>
                            </div>
                            <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all shrink-0" />
                          </div>

                          <p className="text-[11px] text-slate-300 line-clamp-2 font-sans leading-relaxed bg-slate-950/40 p-2.5 rounded-lg border border-slate-800/60">
                            "{cite.excerpt}"
                          </p>

                          <div className="flex items-center justify-between text-[10px] font-mono pt-1">
                            <span className={`px-2 py-0.5 rounded border ${sourceInfo.bg}`}>
                              {sourceInfo.label}
                            </span>
                            <span className={`px-2 py-0.5 rounded-full border uppercase font-bold ${classificationClass}`}>
                              {cite.classification}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Citation Detail Modal */}
      <CitationModal citation={selectedCitation} onClose={() => setSelectedCitation(null)} />
    </div>
  );
};
