import React, { useState } from 'react';
import { UserPersona, EngineAdapter, QueryResult } from '../mockEngine/engineAdapter';
import { GroundingBadge } from '../components/GroundingBadge';
import { CitationModal } from '../components/CitationModal';
import {
  Send,
  Bot,
  Sparkles,
  AlertTriangle,
  FileText,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Zap,
  RotateCcw,
  Lock,
  ChevronDown,
  ChevronUp,
  Cpu,
  MessageSquare
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
      query: 'What is the api gateway like for cross continental use?',
      icon: '⚡',
      color: 'bg-sky-950/60 border-sky-500/40 text-sky-300 hover:bg-sky-900/60',
    },
    {
      category: 'DevOps',
      label: 'Deployments & Rollbacks',
      query: 'What is the production deployment and rollback process?',
      icon: '🚀',
      color: 'bg-purple-950/60 border-purple-500/40 text-purple-300 hover:bg-purple-900/60',
    },
    {
      category: 'Legal',
      label: 'Customer DPA Details',
      query: 'What are the details of the customer Data Processing Agreement (DPA)?',
      icon: '⚖️',
      color: 'bg-amber-950/60 border-amber-500/40 text-amber-300 hover:bg-amber-900/60',
    },
    {
      category: 'Identity',
      label: 'Password & MFA Setup',
      query: 'How do users reset their password and set up MFA?',
      icon: '🔑',
      color: 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/60',
    },
    {
      category: 'Billing',
      label: 'Plans & Pricing FAQ',
      query: 'What subscription plans and billing discounts are available?',
      icon: '💳',
      color: 'bg-blue-950/60 border-blue-500/40 text-blue-300 hover:bg-blue-900/60',
    },
    {
      category: 'Onboarding',
      label: 'Engineering Onboarding',
      query: 'What is the engineering onboarding process and mandatory training?',
      icon: '📖',
      color: 'bg-indigo-950/60 border-indigo-500/40 text-indigo-300 hover:bg-indigo-900/60',
    },
  ];

  const handleSend = async (textToSend?: string) => {
    const q = textToSend || inputQuery;
    if (!q.trim() || isProcessing) return;

    setIsProcessing(true);
    if (!textToSend) setInputQuery('');

    try {
      const result = await EngineAdapter.executeQuery(q, currentPersona);
      setHistory(prev => [result, ...prev]);
    } catch (err) {
      console.error('Error executing query:', err);
    } finally {
      setIsProcessing(false);
    }
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
        return 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40';
      case 'internal':
        return 'bg-blue-950/80 text-blue-300 border-blue-500/40';
      case 'confidential':
        return 'bg-amber-950/80 text-amber-300 border-amber-500/40';
      case 'restricted':
        return 'bg-rose-950/80 text-rose-300 border-rose-500/40';
      default:
        return 'bg-slate-900 text-slate-300 border-slate-700';
    }
  };

  const getSourceBadge = (source: string) => {
    switch (source.toLowerCase()) {
      case 'confluence':
        return { label: 'Confluence', bg: 'bg-sky-950/80 text-sky-300 border-sky-500/40' };
      case 'google_drive':
        return { label: 'Google Drive', bg: 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40' };
      case 'zendesk':
        return { label: 'Zendesk KB', bg: 'bg-violet-950/80 text-violet-300 border-violet-500/40' };
      default:
        return { label: source, bg: 'bg-slate-900 text-slate-300 border-slate-700' };
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Workspace Header & Active Persona Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/90 p-5 rounded-2xl border border-slate-700 shadow-xl">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-xl font-bold text-slate-50 tracking-tight flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-sky-400" />
              <span>AI Knowledge Assistant Workspace</span>
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-sky-500/20 border border-sky-500/40 text-sky-300 text-xs font-mono font-semibold">
              Live RAG
            </span>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            Enterprise Q&A backed by BM25 + Dense Vector hybrid retrieval, Reciprocal Rank Fusion, and Zero-Trust ACL enforcement.
          </p>
        </div>

        {/* Active Clearance Badge */}
        <div className="flex items-center space-x-3 bg-slate-950 border border-slate-800 px-3.5 py-2 rounded-xl">
          <div className="w-8 h-8 rounded-lg bg-sky-500/20 border border-sky-500/30 flex items-center justify-center text-lg">
            {currentPersona.avatar}
          </div>
          <div className="text-xs">
            <div className="font-bold text-slate-100 flex items-center gap-1.5">
              <span>{currentPersona.name}</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-sky-300 border border-slate-700">
                {currentPersona.role}
              </span>
            </div>
            <div className="text-[11px] text-slate-400 font-mono mt-0.5 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              <span>Clearance: <strong className="text-slate-200">{currentPersona.securityClearance}</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* High Contrast Input Bar */}
      <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-700 shadow-xl space-y-4">
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
            placeholder={`Ask any enterprise question as ${currentPersona.name}... (Press Enter to send)`}
            className="w-full bg-slate-950 border border-slate-700 focus:border-sky-400 rounded-xl pl-4 pr-28 py-3.5 text-sm text-slate-50 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/40 resize-none font-sans leading-relaxed shadow-inner"
          />

          <div className="absolute right-3 bottom-3 flex items-center space-x-2">
            {inputQuery.trim() && (
              <button
                onClick={() => setInputQuery('')}
                className="px-2.5 py-1 text-xs font-mono text-slate-400 hover:text-slate-200 transition-colors"
              >
                Clear
              </button>
            )}
            <button
              onClick={() => handleSend()}
              disabled={!inputQuery.trim() || isProcessing}
              className="inline-flex items-center space-x-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-md active:scale-95"
            >
              <span>Ask AI</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Quick Prompt Chips */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-300">
            <span className="flex items-center gap-1.5 font-semibold text-sky-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Suggested Enterprise Queries</span>
            </span>
            <span className="text-slate-400">Click chip to execute</span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {samplePromptChips.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(chip.query)}
                className={`px-3 py-1.5 rounded-xl border text-xs font-semibold whitespace-nowrap transition-all duration-150 flex items-center space-x-1.5 ${chip.color}`}
              >
                <span>{chip.icon}</span>
                <span>{chip.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Processing Loader */}
      {isProcessing && (
        <div className="bg-slate-900 p-6 rounded-2xl border border-sky-500/40 flex flex-col items-center justify-center space-y-3 text-sky-400 shadow-xl animate-pulse">
          <div className="flex items-center space-x-3">
            <Cpu className="w-6 h-6 animate-spin text-sky-400" />
            <span className="text-sm font-mono font-semibold text-slate-100">Executing Hybrid RAG Pipeline & Zero-Trust ACL Verification...</span>
          </div>
          <div className="flex items-center space-x-4 text-[11px] font-mono text-slate-300">
            <span>[Stage 1: BM25]</span>
            <span>→</span>
            <span>[Stage 2: Dense Cosine]</span>
            <span>→</span>
            <span>[Stage 3: RRF Fusion]</span>
            <span>→</span>
            <span>[Stage 4: ACL Gate]</span>
          </div>
        </div>
      )}

      {/* Query Results Stream */}
      <div className="space-y-6">
        {history.length === 0 && !isProcessing && (
          <div className="bg-slate-900/80 p-12 rounded-2xl text-center space-y-4 border border-dashed border-slate-700">
            <div className="w-14 h-14 rounded-2xl bg-sky-500/20 border border-sky-500/30 text-sky-300 flex items-center justify-center mx-auto shadow-inner">
              <Bot className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-100">No Queries Executed Yet</h3>
              <p className="text-xs text-slate-300 max-w-lg mx-auto leading-relaxed">
                Type a question above or click one of the quick prompt chips. Test how the engine returns answers or abstains based on <strong className="text-sky-400">{currentPersona.name}'s</strong> security clearance.
              </p>
            </div>
          </div>
        )}

        {history.length > 0 && (
          <div className="flex items-center justify-between px-1">
            <div className="text-xs font-mono text-slate-300 font-semibold">
              Query History ({history.length} {history.length === 1 ? 'result' : 'results'})
            </div>
            <button
              onClick={clearHistory}
              className="inline-flex items-center space-x-1 text-xs font-mono text-slate-400 hover:text-rose-400 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Clear History</span>
            </button>
          </div>
        )}

        {history.map((res) => {
          // STRICTLY CLAMP PERCENTAGE DISPLAY BETWEEN 0% AND 99%
          const confidencePercent = Math.min(99, Math.max(0, Math.round(res.confidenceScore * 100)));
          const isClaimsOpen = expandedClaims[res.queryId] ?? true;

          return (
            <div
              key={res.queryId}
              className="bg-slate-900 p-6 rounded-2xl space-y-5 border border-slate-700 shadow-2xl"
            >
              {/* Header: Persona, Query, Latency & Confidence Score Meter */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-xl shrink-0 mt-0.5 shadow-md">
                    {res.user.avatar}
                  </div>
                  <div>
                    {/* User Question: High Contrast Bold Text */}
                    <h4 className="font-extrabold text-base text-slate-50 leading-snug tracking-tight">
                      "{res.queryText}"
                    </h4>
                    <div className="text-[11px] text-slate-300 font-mono mt-1 flex flex-wrap items-center gap-2">
                      <span>Asked by <strong className="text-slate-100">{res.user.name}</strong> ({res.user.role})</span>
                      <span>•</span>
                      <span className="flex items-center gap-1 text-slate-300">
                        <Clock className="w-3 h-3 text-sky-400" />
                        {res.timestamp}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Score & Latency Badges */}
                <div className="flex items-center space-x-3 self-end md:self-auto shrink-0">
                  <div className="flex items-center space-x-2 bg-slate-950 px-3 py-1.5 rounded-full border border-slate-800 text-xs font-mono">
                    <Zap className="w-3.5 h-3.5 text-sky-400" />
                    <span className="text-slate-200 font-semibold">{res.latencyMs}ms</span>
                  </div>

                  {/* Confidence Meter (Clamped) */}
                  <div className="flex items-center space-x-2 bg-slate-950 px-3 py-1.5 rounded-full border border-slate-800 text-xs font-mono">
                    <span className="text-slate-400 text-[10px]">Confidence:</span>
                    <div className="w-16 h-2.5 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          confidencePercent >= 75
                            ? 'bg-emerald-400'
                            : confidencePercent >= 50
                            ? 'bg-sky-400'
                            : 'bg-amber-400'
                        }`}
                        style={{ width: `${confidencePercent}%` }}
                      />
                    </div>
                    <span className={`font-bold ${
                      confidencePercent >= 75
                        ? 'text-emerald-400'
                        : confidencePercent >= 50
                        ? 'text-sky-400'
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
                  <div className="p-5 rounded-2xl bg-amber-950/60 border border-amber-500/40 text-amber-200 text-xs leading-relaxed space-y-3 shadow-lg">
                    <div className="flex items-center justify-between border-b border-amber-500/20 pb-2.5">
                      <div className="font-bold text-sm flex items-center gap-2 text-amber-300">
                        <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
                        <span>Intelligent Engine Abstention Triggered</span>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[10px] font-mono uppercase font-bold">
                        Zero-Trust ACL Guardrail
                      </span>
                    </div>

                    <p className="text-xs text-amber-100 font-sans leading-relaxed font-medium">
                      {res.answerText}
                    </p>

                    <div className="bg-slate-950 p-3.5 rounded-xl border border-amber-500/30 text-[11px] font-mono text-amber-300 space-y-1">
                      <div className="flex items-center gap-1.5 font-bold">
                        <Lock className="w-3.5 h-3.5 text-amber-400" />
                        <span>Abstention Rationale:</span>
                      </div>
                      <div>{res.abstentionReason || 'No verified document satisfied both retrieval similarity thresholds and security clearance.'}</div>
                      <div className="text-[10px] text-slate-400 mt-1">
                        Current User Group Clearance: <span className="text-sky-300 font-semibold">{res.user.groups.join(', ')}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Answer Card: High Contrast Deep Slate Container with Crisp White Text */
                  <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-100 leading-relaxed font-sans whitespace-pre-wrap shadow-inner space-y-2">
                    <div className="flex items-center space-x-2 text-[11px] font-mono text-sky-400 font-bold mb-1">
                      <Bot className="w-4 h-4" />
                      <span>Synthesized Verified Answer</span>
                    </div>
                    <div className="text-sm font-medium text-slate-100 leading-relaxed">{res.answerText}</div>
                  </div>
                )}
              </div>

              {/* NLI Grounding Verification Accordion */}
              {!res.isAbstained && res.claims && res.claims.length > 0 && (
                <div className="rounded-xl border border-slate-800 bg-slate-950/60 overflow-hidden space-y-0">
                  <button
                    onClick={() => toggleClaims(res.queryId)}
                    className="w-full px-4 py-3 bg-slate-950 hover:bg-slate-800 text-left flex items-center justify-between text-xs font-mono transition-colors"
                  >
                    <div className="flex items-center space-x-2 text-slate-200">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span className="font-bold">NLI Claim Verification Checks ({res.claims.length})</span>
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
                          className="p-3 rounded-lg bg-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
                        >
                          <div className="space-y-1 max-w-2xl">
                            <div className="text-slate-100 font-sans italic font-medium">"{claim.claimSentence}"</div>
                            <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400">
                              <span>Supporting Chunks:</span>
                              {claim.supportingChunkIds.map(cId => (
                                <span key={cId} className="px-1.5 py-0.5 rounded bg-slate-800 text-sky-300 font-bold">
                                  {cId}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="flex items-center space-x-3 shrink-0 self-end md:self-auto">
                            <div className="text-right font-mono">
                              <div className="text-[10px] text-slate-400">Entailment</div>
                              <div className="text-xs font-bold text-emerald-400">{Math.min(99, Math.round(claim.entailmentScore * 100))}%</div>
                            </div>
                            <span className="px-2.5 py-1 rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-300 text-[10px] font-mono font-bold flex items-center gap-1">
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
                  <div className="text-xs font-mono text-slate-300 uppercase tracking-wider flex items-center justify-between font-bold">
                    <span className="flex items-center gap-1.5 text-sky-400">
                      <FileText className="w-4 h-4" />
                      <span>Verified Citations & Context Chunks ({res.citations.length})</span>
                    </span>
                    <span className="text-slate-400 text-[11px] lowercase font-normal">Click card to view details</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    {res.citations.map(cite => {
                      const sourceInfo = getSourceBadge(cite.sourceSystem);
                      const classificationClass = getClassificationBadge(cite.classification);

                      return (
                        <button
                          key={cite.chunkId}
                          onClick={() => setSelectedCitation(cite)}
                          className="bg-slate-950 p-4 rounded-xl text-left flex flex-col justify-between space-y-3 group border border-slate-800 hover:border-sky-500/60 hover:shadow-xl transition-all"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-start space-x-2.5 min-w-0">
                              <span className="w-6 h-6 rounded-md bg-sky-500/20 border border-sky-500/30 text-sky-300 text-xs font-mono font-bold flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                [{cite.citationIndex}]
                              </span>
                              <div className="min-w-0">
                                <h5 className="font-bold text-xs text-slate-100 truncate group-hover:text-sky-300 transition-colors">
                                  {cite.documentTitle}
                                </h5>
                                <div className="text-[10px] font-mono text-slate-400 mt-0.5">
                                  ID: {cite.chunkId}
                                </div>
                              </div>
                            </div>
                            <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-sky-400 group-hover:translate-x-0.5 transition-all shrink-0" />
                          </div>

                          <p className="text-[11px] text-slate-300 line-clamp-2 font-sans leading-relaxed bg-slate-900 p-2.5 rounded-lg border border-slate-800">
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
