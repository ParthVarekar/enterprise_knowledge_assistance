import React, { useState } from 'react';
import { UserPersona, EngineAdapter, QueryResult } from '../mockEngine/engineAdapter';
import { GroundingBadge } from '../components/GroundingBadge';
import { CitationModal } from '../components/CitationModal';
import { renderCuteAvatar } from '../components/ui/CuteIcons';
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
  MessageSquare,
  CornerDownLeft,
  Rocket,
  Key,
  CreditCard,
  BookOpen
} from 'lucide-react';

import { useEKRS } from '../context/EKRSContext';

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
  const { history, isProcessing, executeQuery, clearHistory } = useEKRS();
  const [inputQuery, setInputQuery] = useState('');
  const [selectedCitation, setSelectedCitation] = useState<any>(null);
  const [expandedClaims, setExpandedClaims] = useState<Record<string, boolean>>({});

  const samplePromptChips: PromptChip[] = [
    {
      category: 'Architecture',
      label: 'API Rate Limits',
      query: 'How does our API gateway handle rate limiting?',
      icon: 'zap',
    },
    {
      category: 'DevOps',
      label: 'Deployment Runbook',
      query: 'What is the production deployment and rollback process?',
      icon: 'rocket',
    },
    {
      category: 'Security',
      label: 'Restricted DPA Policy',
      query: 'What are the details of the customer Data Processing Agreement (DPA)?',
      icon: 'lock',
    },
    {
      category: 'Identity',
      label: 'Password & MFA Setup',
      query: 'How do users reset their password and set up MFA?',
      icon: 'key',
    },
    {
      category: 'Billing',
      label: 'Pricing & Plans FAQ',
      query: 'What subscription plans and billing options are available?',
      icon: 'credit-card',
    },
    {
      category: 'Onboarding',
      label: 'Engineering Onboarding',
      query: 'What is the engineering onboarding process and tooling guide?',
      icon: 'book-open',
    },
  ];

  const renderChipIcon = (iconName: string) => {
    switch (iconName) {
      case 'zap': return <Zap className="w-3.5 h-3.5 text-amber-600" />;
      case 'rocket': return <Rocket className="w-3.5 h-3.5 text-purple-600" />;
      case 'lock': return <Lock className="w-3.5 h-3.5 text-rose-600" />;
      case 'key': return <Key className="w-3.5 h-3.5 text-indigo-600" />;
      case 'credit-card': return <CreditCard className="w-3.5 h-3.5 text-blue-600" />;
      case 'book-open': return <BookOpen className="w-3.5 h-3.5 text-emerald-600" />;
      default: return <Sparkles className="w-3.5 h-3.5 text-indigo-600" />;
    }
  };

  const handleSend = async (textToSend?: string) => {
    const q = textToSend || inputQuery;
    if (!q.trim() || isProcessing) return;

    if (!textToSend) setInputQuery('');
    try {
      await executeQuery(q, currentPersona);
    } catch (err) {
      console.error('Error executing query:', err);
    }
  };

  const toggleClaims = (queryId: string) => {
    setExpandedClaims(prev => ({ ...prev, [queryId]: !prev[queryId] }));
  };

  const getClassificationBadge = (classification: string) => {
    switch (classification.toLowerCase()) {
      case 'public':
        return 'badge-emerald font-bold';
      case 'internal':
        return 'badge-indigo font-bold';
      case 'confidential':
        return 'badge-amber font-bold';
      case 'restricted':
        return 'badge-rose font-bold';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-300 font-bold';
    }
  };

  const getSourceBadge = (source: string) => {
    switch (source.toLowerCase()) {
      case 'confluence':
        return { label: 'Confluence', bg: 'badge-indigo' };
      case 'google_drive':
        return { label: 'Google Drive', bg: 'badge-emerald' };
      case 'zendesk':
        return { label: 'Zendesk KB', bg: 'bg-purple-50 text-purple-700 border-purple-200' };
      default:
        return { label: source, bg: 'bg-slate-100 text-slate-700 border-slate-200' };
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* View Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 light-card p-6 shadow-sm">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <MessageSquare className="w-6 h-6 text-indigo-600" />
              <span>EKRS Knowledge Workspace</span>
            </h2>
            <span className="px-3 py-0.5 rounded-full badge-indigo text-xs font-mono font-bold">
              Speech & Live RAG
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Enterprise Q&A powered by BM25 + Dense Vector hybrid retrieval and Zero-Trust ACL enforcement.
          </p>
        </div>

        {/* Persona Clearance Pill */}
        <div className="flex items-center space-x-3 bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-xl">
          <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 text-indigo-700 flex items-center justify-center shrink-0 shadow-xs font-bold">
            {renderCuteAvatar(currentPersona.avatar)}
          </div>
          <div className="text-xs">
            <div className="font-bold text-slate-900 flex items-center gap-1.5">
              <span>{currentPersona.name}</span>
              <span className="text-[10px] font-mono px-2 py-0.2 rounded bg-indigo-100 text-indigo-700 font-bold border border-indigo-200">
                {currentPersona.role}
              </span>
            </div>
            <div className="text-[11px] text-slate-500 font-mono mt-0.5 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Clearance: <strong className="text-slate-800">{currentPersona.securityClearance}</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Raycast Light Floating Command Bar */}
      <div className="raycast-command-bar p-5 space-y-4">
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
            placeholder={`Ask any enterprise question as ${currentPersona.name}...`}
            className="w-full bg-slate-50/60 border border-slate-200 focus:border-indigo-500 rounded-xl pl-4 pr-36 py-3.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 resize-none font-sans leading-relaxed shadow-inner"
          />

          <div className="absolute right-3 bottom-3 flex items-center space-x-2">
            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-mono text-slate-400 mr-1">
              <span className="keycap">⌘K</span>
              <span className="keycap"><CornerDownLeft className="w-3 h-3 inline" /></span>
            </span>

            <button
              onClick={() => handleSend()}
              disabled={!inputQuery.trim() || isProcessing}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm active:scale-95"
            >
              <span>Ask EKRS</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Suggested Enterprise Prompt Chips */}
        <div className="space-y-2 pt-1">
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-500">
            <span className="flex items-center gap-1.5 font-bold text-indigo-700">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>Suggested Enterprise Queries</span>
            </span>
            <span className="text-slate-400">Click chip to execute</span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {samplePromptChips.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(chip.query)}
                className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200/80 border border-slate-200 text-xs font-semibold text-slate-700 whitespace-nowrap transition-all flex items-center space-x-1.5 active:scale-95 shadow-2xs"
              >
                {renderChipIcon(chip.icon)}
                <span>{chip.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Processing Loader */}
      {isProcessing && (
        <div className="light-card p-6 border-indigo-200 flex flex-col items-center justify-center space-y-3 text-indigo-700 shadow-sm animate-pulse bg-indigo-50/40">
          <div className="flex items-center space-x-3">
            <Cpu className="w-6 h-6 animate-spin text-indigo-600" />
            <span className="text-sm font-mono font-bold text-slate-900">Executing EKRS Hybrid Retrieval & Live ACL Gate...</span>
          </div>
          <div className="flex items-center space-x-3 text-[11px] font-mono text-slate-500">
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
          <div className="light-card p-12 text-center space-y-4 border-dashed border-slate-300">
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-600 flex items-center justify-center mx-auto shadow-xs">
              <Bot className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-900">No Queries Executed Yet</h3>
              <p className="text-sm text-slate-500 max-w-lg mx-auto leading-relaxed">
                Type a question above or click one of the quick prompt chips to test EKRS enterprise RAG retrieval.
              </p>
            </div>
          </div>
        )}

        {history.length > 0 && (
          <div className="flex items-center justify-between px-1">
            <div className="text-xs font-mono text-slate-600 font-bold">
              Query History ({history.length} {history.length === 1 ? 'result' : 'results'})
            </div>
            <button
              onClick={clearHistory}
              className="inline-flex items-center space-x-1 text-xs font-mono text-slate-500 hover:text-rose-600 transition-colors"
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
              className="light-card p-6 space-y-5 border-slate-200 shadow-sm"
            >
              {/* RAG Telemetry Header */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-200/80 pb-4">
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 text-indigo-700 flex items-center justify-center shrink-0 mt-0.5 shadow-2xs font-bold">
                    {renderCuteAvatar(res.user.avatar)}
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-slate-900 leading-snug tracking-tight">
                      "{res.queryText}"
                    </h4>
                    <div className="text-[11px] text-slate-500 font-mono mt-1 flex flex-wrap items-center gap-2">
                      <span>Asked by <strong className="text-slate-900">{res.user.name}</strong> ({res.user.role})</span>
                      <span>•</span>
                      <span className="flex items-center gap-1 text-slate-600">
                        <Clock className="w-3 h-3 text-indigo-600" />
                        {res.timestamp}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Telemetry Micro Badges */}
                <div className="flex items-center space-x-2.5 self-end md:self-auto shrink-0">
                  {/* Latency badge */}
                  <div className="flex items-center space-x-1.5 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200 text-xs font-mono text-slate-700 shadow-2xs">
                    <Zap className="w-3.5 h-3.5 text-indigo-600" />
                    <span className="font-bold">{res.latencyMs}ms</span>
                  </div>

                  {/* Confidence bar */}
                  <div className="flex items-center space-x-2 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200 text-xs font-mono shadow-2xs">
                    <span className="text-slate-500 text-[10px]">Confidence:</span>
                    <div className="w-14 h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-indigo-600 transition-all duration-500"
                        style={{ width: `${confidencePercent}%` }}
                      />
                    </div>
                    <span className="font-bold text-slate-900">
                      {confidencePercent}%
                    </span>
                  </div>

                  {/* NLI Grounded badge in soft green tint */}
                  <GroundingBadge score={res.confidenceScore} isAbstained={res.isAbstained} />
                </div>
              </div>

              {/* Response Section */}
              <div className="space-y-3">
                {res.isAbstained ? (
                  <div className="p-5 rounded-xl badge-rose text-xs leading-relaxed space-y-3 shadow-xs">
                    <div className="flex items-center justify-between border-b border-rose-200 pb-2.5">
                      <div className="font-bold text-sm flex items-center gap-2 text-rose-800">
                        <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
                        <span>Intelligent Engine Abstention Triggered</span>
                      </div>
                      <span className="px-2.5 py-0.5 rounded font-mono text-[10px] uppercase font-bold bg-rose-200 text-rose-900 border border-rose-300">
                        Zero-Trust Guardrail
                      </span>
                    </div>

                    <p className="text-xs text-rose-900 font-sans leading-relaxed font-semibold">
                      {res.answerText}
                    </p>

                    <div className="bg-white p-3.5 rounded-lg border border-rose-200 text-[11px] font-mono text-rose-800 space-y-1">
                      <div className="flex items-center gap-1.5 font-bold">
                        <Lock className="w-3.5 h-3.5 text-rose-600" />
                        <span>Abstention Rationale:</span>
                      </div>
                      <div>{res.abstentionReason || 'No verified document satisfied security clearance.'}</div>
                    </div>
                  </div>
                ) : (
                  <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 leading-relaxed font-sans whitespace-pre-wrap shadow-2xs space-y-2">
                    <div className="flex items-center space-x-2 text-[11px] font-mono text-indigo-700 font-bold mb-1">
                      <Bot className="w-4 h-4 text-indigo-600" />
                      <span>Synthesized Verified Answer</span>
                    </div>
                    <div className="text-sm font-medium text-slate-900 leading-relaxed">{res.answerText}</div>
                  </div>
                )}
              </div>

              {/* NLI Grounding Claims */}
              {!res.isAbstained && res.claims && res.claims.length > 0 && (
                <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
                  <button
                    onClick={() => toggleClaims(res.queryId)}
                    className="w-full px-4 py-3 bg-slate-50 hover:bg-slate-100 text-left flex items-center justify-between text-xs font-mono transition-colors text-slate-800"
                  >
                    <div className="flex items-center space-x-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span className="font-bold">NLI Claim Verification Checks ({res.claims.length})</span>
                    </div>
                    <div className="flex items-center space-x-2 text-slate-500">
                      <span className="text-[11px]">Click to {isClaimsOpen ? 'collapse' : 'expand'}</span>
                      {isClaimsOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </button>

                  {isClaimsOpen && (
                    <div className="p-4 space-y-2.5 border-t border-slate-200">
                      {res.claims.map((claim, cIdx) => (
                        <div
                          key={cIdx}
                          className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
                        >
                          <div className="space-y-1 max-w-2xl">
                            <div className="text-slate-900 font-sans italic font-medium">"{claim.claimSentence}"</div>
                            <div className="flex items-center gap-2 text-[10px] font-mono text-slate-500">
                              <span>Supporting Chunks:</span>
                              {claim.supportingChunkIds.map(cId => (
                                <span key={cId} className="px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-800 font-bold border border-indigo-200">
                                  {cId}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="flex items-center space-x-3 shrink-0 self-end md:self-auto">
                            <div className="text-right font-mono">
                              <div className="text-[10px] text-slate-500">Entailment</div>
                              <div className="text-xs font-bold text-emerald-700">{Math.min(98, Math.round(claim.entailmentScore * 100))}%</div>
                            </div>
                            <span className="px-2.5 py-1 rounded-full badge-emerald text-[10px] font-mono font-bold flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
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
                  <div className="text-xs font-mono text-slate-900 uppercase tracking-wider flex items-center justify-between font-bold">
                    <span className="flex items-center gap-1.5 text-indigo-700">
                      <FileText className="w-4 h-4 text-indigo-600" />
                      <span>Verified Citations ({res.citations.length})</span>
                    </span>
                    <span className="text-slate-500 text-[11px] lowercase font-normal">Click card to view details</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    {res.citations.map(cite => {
                      const sourceInfo = getSourceBadge(cite.sourceSystem);
                      const classificationClass = getClassificationBadge(cite.classification);

                      return (
                        <button
                          key={cite.chunkId}
                          onClick={() => setSelectedCitation(cite)}
                          className="bg-white p-4 rounded-xl text-left flex flex-col justify-between space-y-3 group border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-start space-x-2.5 min-w-0">
                              <span className="w-6 h-6 rounded-lg bg-indigo-600 text-white text-xs font-mono font-bold flex items-center justify-center shrink-0 shadow-2xs">
                                [{cite.citationIndex}]
                              </span>
                              <div className="min-w-0">
                                <h5 className="font-bold text-xs text-slate-900 truncate group-hover:text-indigo-600 transition-colors">
                                  {cite.documentTitle}
                                </h5>
                                <div className="text-[10px] font-mono text-slate-500 mt-0.5">
                                  ID: {cite.chunkId}
                                </div>
                              </div>
                            </div>
                            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all shrink-0" />
                          </div>

                          <p className="text-[11px] text-slate-700 line-clamp-2 font-sans leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-200/80">
                            "{cite.excerpt}"
                          </p>

                          <div className="flex items-center justify-between text-[10px] font-mono pt-1">
                            <span className={`px-2 py-0.5 rounded ${sourceInfo.bg}`}>
                              {sourceInfo.label}
                            </span>
                            <span className={`px-2 py-0.5 rounded uppercase font-bold ${classificationClass}`}>
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
