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
    },
    {
      category: 'DevOps',
      label: 'Deployments & Rollbacks',
      query: 'What is the production deployment and rollback process?',
      icon: '🚀',
    },
    {
      category: 'Legal',
      label: 'Customer DPA Details',
      query: 'What are the details of the customer Data Processing Agreement (DPA)?',
      icon: '⚖️',
    },
    {
      category: 'Identity',
      label: 'Password & MFA Setup',
      query: 'How do users reset their password and set up MFA?',
      icon: '🔑',
    },
    {
      category: 'Billing',
      label: 'Plans & Pricing FAQ',
      query: 'What subscription plans and billing discounts are available?',
      icon: '💳',
    },
    {
      category: 'Onboarding',
      label: 'Engineering Onboarding',
      query: 'What is the engineering onboarding process and mandatory training?',
      icon: '📖',
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
        return 'bg-emerald-900 text-emerald-100 border-emerald-700';
      case 'internal':
        return 'bg-[#2A2859] text-white border-white/20';
      case 'confidential':
        return 'bg-amber-900 text-amber-100 border-amber-700';
      case 'restricted':
        return 'bg-[#421d24] text-rose-100 border-rose-700';
      default:
        return 'bg-slate-800 text-slate-200 border-slate-700';
    }
  };

  const getSourceBadge = (source: string) => {
    switch (source.toLowerCase()) {
      case 'confluence':
        return { label: 'Confluence', bg: 'bg-[#2A2859] text-white border-white/20' };
      case 'google_drive':
        return { label: 'Google Drive', bg: 'bg-emerald-900 text-emerald-100 border-emerald-700' };
      case 'zendesk':
        return { label: 'Zendesk KB', bg: 'bg-purple-900 text-purple-100 border-purple-700' };
      default:
        return { label: source, bg: 'bg-slate-800 text-slate-200 border-slate-700' };
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Susurrus Workspace Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#121028]/90 p-6 rounded-[24px] border border-white/15 shadow-2xl backdrop-blur-xl">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
              <MessageSquare className="w-6 h-6 text-[#cbb7fb]" />
              <span>Susurrus Knowledge Workspace</span>
            </h2>
            <span className="px-3 py-0.5 rounded-full bg-[#cbb7fb]/20 border border-[#cbb7fb]/40 text-[#cbb7fb] text-xs font-mono font-bold">
              Speech & Live RAG
            </span>
          </div>
          <p className="text-sm text-slate-300 mt-1">
            Speech-to-thought Enterprise Q&A backed by BM25 + Dense Vector hybrid retrieval and Zero-Trust ACL enforcement.
          </p>
        </div>

        {/* Active Clearance Badge */}
        <div className="flex items-center space-x-3 bg-[#1b1938] border border-white/20 px-4 py-2.5 rounded-[16px]">
          <div className="w-9 h-9 rounded-full bg-[#2A2859] border border-white/20 flex items-center justify-center text-xl">
            {currentPersona.avatar}
          </div>
          <div className="text-xs">
            <div className="font-extrabold text-white flex items-center gap-1.5">
              <span>{currentPersona.name}</span>
              <span className="text-[10px] font-mono px-2 py-0.2 rounded-full bg-[#cbb7fb]/20 text-[#cbb7fb] border border-[#cbb7fb]/30 font-bold">
                {currentPersona.role}
              </span>
            </div>
            <div className="text-[11px] text-slate-300 font-mono mt-0.5 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Clearance: <strong className="text-white">{currentPersona.securityClearance}</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* Input Bar */}
      <div className="bg-[#121028]/90 p-6 rounded-[24px] border border-white/15 shadow-2xl space-y-4">
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
            className="w-full bg-[#1b1938] border border-white/20 focus:border-[#cbb7fb] rounded-[16px] pl-4 pr-32 py-4 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#cbb7fb]/40 resize-none font-sans leading-relaxed shadow-inner"
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
              className="inline-flex items-center space-x-2 px-5 py-2.5 bg-[#2A2859] hover:bg-[#1E1B42] text-white text-xs font-extrabold rounded-[8px] border border-white/20 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-lg active:scale-95"
            >
              <span>Ask Susurrus</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Quick Prompt Chips */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-300">
            <span className="flex items-center gap-1.5 font-bold text-[#cbb7fb]">
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
                className="px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-semibold text-white whitespace-nowrap transition-all flex items-center space-x-1.5 active:scale-95"
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
        <div className="bg-[#121028] p-6 rounded-[24px] border border-[#cbb7fb]/40 flex flex-col items-center justify-center space-y-3 text-[#cbb7fb] shadow-2xl animate-pulse">
          <div className="flex items-center space-x-3">
            <Cpu className="w-6 h-6 animate-spin text-[#cbb7fb]" />
            <span className="text-sm font-mono font-bold text-white">Executing Susurrus Hybrid Retrieval & Live ACL Gate...</span>
          </div>
          <div className="flex items-center space-x-4 text-[11px] font-mono text-slate-300">
            <span>[Stage 1: BM25]</span>
            <span>→</span>
            <span>[Stage 2: Dense Vector]</span>
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
          <div className="bg-[#121028]/80 p-12 rounded-[24px] text-center space-y-4 border border-dashed border-white/20">
            <div className="w-14 h-14 rounded-full bg-[#2A2859] border border-white/20 text-white flex items-center justify-center mx-auto shadow-xl">
              <Bot className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-white">No Queries Executed Yet</h3>
              <p className="text-sm text-slate-300 max-w-lg mx-auto leading-relaxed">
                Type a question above or click one of the quick prompt chips to test Susurrus speech-to-thought RAG retrieval.
              </p>
            </div>
          </div>
        )}

        {history.length > 0 && (
          <div className="flex items-center justify-between px-1">
            <div className="text-xs font-mono text-slate-300 font-bold">
              Query History ({history.length} {history.length === 1 ? 'result' : 'results'})
            </div>
            <button
              onClick={clearHistory}
              className="inline-flex items-center space-x-1 text-xs font-mono text-slate-400 hover:text-rose-300 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Clear History</span>
            </button>
          </div>
        )}

        {history.map((res) => {
          const confidencePercent = Math.min(98, Math.max(10, Math.round(res.confidenceScore * 100)));
          const isClaimsOpen = expandedClaims[res.queryId] ?? true;

          return (
            <div
              key={res.queryId}
              className="bg-[#F3F0EB] text-[#0F172A] p-6 rounded-[24px] space-y-5 border border-[#dcd7d3] shadow-2xl"
            >
              {/* Header: Persona, Query, Latency & Confidence Meter */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[#dcd7d3] pb-4">
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 rounded-full bg-[#2A2859] text-white flex items-center justify-center text-xl shrink-0 mt-0.5 shadow-md">
                    {res.user.avatar}
                  </div>
                  <div>
                    <h4 className="font-extrabold text-lg text-[#0F172A] leading-snug tracking-tight">
                      "{res.queryText}"
                    </h4>
                    <div className="text-[11px] text-[#475569] font-mono mt-1 flex flex-wrap items-center gap-2">
                      <span>Asked by <strong className="text-[#0F172A]">{res.user.name}</strong> ({res.user.role})</span>
                      <span>•</span>
                      <span className="flex items-center gap-1 text-[#475569]">
                        <Clock className="w-3 h-3 text-[#2A2859]" />
                        {res.timestamp}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Badges */}
                <div className="flex items-center space-x-3 self-end md:self-auto shrink-0">
                  <div className="flex items-center space-x-2 bg-white px-3 py-1.5 rounded-full border border-[#dcd7d3] text-xs font-mono text-[#0F172A]">
                    <Zap className="w-3.5 h-3.5 text-[#2A2859]" />
                    <span className="font-bold">{res.latencyMs}ms</span>
                  </div>

                  <div className="flex items-center space-x-2 bg-white px-3 py-1.5 rounded-full border border-[#dcd7d3] text-xs font-mono">
                    <span className="text-[#475569] text-[10px]">Confidence:</span>
                    <div className="w-16 h-2.5 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-[#2A2859] transition-all duration-500"
                        style={{ width: `${confidencePercent}%` }}
                      />
                    </div>
                    <span className="font-bold text-[#0F172A]">
                      {confidencePercent}%
                    </span>
                  </div>

                  <GroundingBadge score={res.confidenceScore} isAbstained={res.isAbstained} />
                </div>
              </div>

              {/* Response Section */}
              <div className="space-y-3">
                {res.isAbstained ? (
                  <div className="p-5 rounded-[16px] bg-[#421d24] text-rose-100 text-xs leading-relaxed space-y-3 shadow-lg">
                    <div className="flex items-center justify-between border-b border-rose-800 pb-2.5">
                      <div className="font-bold text-sm flex items-center gap-2 text-rose-200">
                        <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
                        <span>Intelligent Engine Abstention Triggered</span>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full bg-rose-900 text-rose-100 text-[10px] font-mono uppercase font-bold border border-rose-700">
                        Zero-Trust Guardrail
                      </span>
                    </div>

                    <p className="text-xs text-rose-100 font-sans leading-relaxed font-medium">
                      {res.answerText}
                    </p>

                    <div className="bg-[#1b1938] p-3.5 rounded-[12px] border border-rose-800 text-[11px] font-mono text-rose-200 space-y-1">
                      <div className="flex items-center gap-1.5 font-bold">
                        <Lock className="w-3.5 h-3.5 text-rose-400" />
                        <span>Abstention Rationale:</span>
                      </div>
                      <div>{res.abstentionReason || 'No verified document satisfied security clearance.'}</div>
                    </div>
                  </div>
                ) : (
                  <div className="p-5 rounded-[16px] bg-white border border-[#dcd7d3] text-xs text-[#0F172A] leading-relaxed font-sans whitespace-pre-wrap shadow-sm space-y-2">
                    <div className="flex items-center space-x-2 text-[11px] font-mono text-[#2A2859] font-bold mb-1">
                      <Bot className="w-4 h-4" />
                      <span>Synthesized Verified Answer</span>
                    </div>
                    <div className="text-sm font-medium text-[#0F172A] leading-relaxed">{res.answerText}</div>
                  </div>
                )}
              </div>

              {/* NLI Grounding Claims */}
              {!res.isAbstained && res.claims && res.claims.length > 0 && (
                <div className="rounded-[16px] border border-[#dcd7d3] bg-white overflow-hidden space-y-0">
                  <button
                    onClick={() => toggleClaims(res.queryId)}
                    className="w-full px-4 py-3 bg-[#f8fafc] hover:bg-slate-100 text-left flex items-center justify-between text-xs font-mono transition-colors text-[#0F172A]"
                  >
                    <div className="flex items-center space-x-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span className="font-bold">NLI Claim Verification Checks ({res.claims.length})</span>
                    </div>
                    <div className="flex items-center space-x-2 text-[#475569]">
                      <span className="text-[11px]">Click to {isClaimsOpen ? 'collapse' : 'expand'}</span>
                      {isClaimsOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </button>

                  {isClaimsOpen && (
                    <div className="p-4 space-y-2.5 border-t border-[#dcd7d3]">
                      {res.claims.map((claim, cIdx) => (
                        <div
                          key={cIdx}
                          className="p-3 rounded-[10px] bg-[#F3F0EB] border border-[#dcd7d3] flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
                        >
                          <div className="space-y-1 max-w-2xl">
                            <div className="text-[#0F172A] font-sans italic font-medium">"{claim.claimSentence}"</div>
                            <div className="flex items-center gap-2 text-[10px] font-mono text-[#475569]">
                              <span>Supporting Chunks:</span>
                              {claim.supportingChunkIds.map(cId => (
                                <span key={cId} className="px-1.5 py-0.5 rounded bg-[#2A2859] text-white font-bold">
                                  {cId}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="flex items-center space-x-3 shrink-0 self-end md:self-auto">
                            <div className="text-right font-mono">
                              <div className="text-[10px] text-[#475569]">Entailment</div>
                              <div className="text-xs font-bold text-emerald-700">{Math.min(98, Math.round(claim.entailmentScore * 100))}%</div>
                            </div>
                            <span className="px-2.5 py-1 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800 text-[10px] font-mono font-bold flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                              VERIFIED
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Citations Grid */}
              {res.citations.length > 0 && (
                <div className="space-y-3 pt-1">
                  <div className="text-xs font-mono text-[#0F172A] uppercase tracking-wider flex items-center justify-between font-bold">
                    <span className="flex items-center gap-1.5 text-[#2A2859]">
                      <FileText className="w-4 h-4" />
                      <span>Verified Citations ({res.citations.length})</span>
                    </span>
                    <span className="text-[#475569] text-[11px] lowercase font-normal">Click card to view details</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    {res.citations.map(cite => {
                      const sourceInfo = getSourceBadge(cite.sourceSystem);
                      const classificationClass = getClassificationBadge(cite.classification);

                      return (
                        <button
                          key={cite.chunkId}
                          onClick={() => setSelectedCitation(cite)}
                          className="bg-white p-4 rounded-[16px] text-left flex flex-col justify-between space-y-3 group border border-[#dcd7d3] hover:border-[#2A2859] hover:shadow-lg transition-all"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-start space-x-2.5 min-w-0">
                              <span className="w-6 h-6 rounded-full bg-[#2A2859] text-white text-xs font-mono font-bold flex items-center justify-center shrink-0">
                                [{cite.citationIndex}]
                              </span>
                              <div className="min-w-0">
                                <h5 className="font-bold text-xs text-[#0F172A] truncate group-hover:text-[#2A2859] transition-colors">
                                  {cite.documentTitle}
                                </h5>
                                <div className="text-[10px] font-mono text-[#475569] mt-0.5">
                                  ID: {cite.chunkId}
                                </div>
                              </div>
                            </div>
                            <ArrowRight className="w-4 h-4 text-[#475569] group-hover:text-[#2A2859] group-hover:translate-x-0.5 transition-all shrink-0" />
                          </div>

                          <p className="text-[11px] text-[#292827] line-clamp-2 font-sans leading-relaxed bg-[#F3F0EB] p-2.5 rounded-[10px] border border-[#dcd7d3]">
                            "{cite.excerpt}"
                          </p>

                          <div className="flex items-center justify-between text-[10px] font-mono pt-1">
                            <span className={`px-2 py-0.5 rounded-full border ${sourceInfo.bg}`}>
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

      <CitationModal citation={selectedCitation} onClose={() => setSelectedCitation(null)} />
    </div>
  );
};
