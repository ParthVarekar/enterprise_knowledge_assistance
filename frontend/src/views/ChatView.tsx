import React, { useState, useRef, useEffect } from 'react';
import { UserPersona } from '../mockEngine/engineAdapter';
import { GroundingBadge } from '../components/GroundingBadge';
import { CitationModal } from '../components/CitationModal';
import { renderCuteAvatar } from '../components/ui/CuteIcons';
import {
  Send,
  Sparkles,
  ShieldCheck,
  Zap,
  CornerDownLeft,
  Rocket,
  Key,
  CreditCard,
  BookOpen,
  Lock,
  Cpu,
  Clock,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  Maximize2,
  ChevronRight
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
  const { history, isProcessing, executeQuery } = useEKRS();
  const [inputQuery, setInputQuery] = useState('');
  const [selectedCitation, setSelectedCitation] = useState<any>(null);
  const [expandedClaims, setExpandedClaims] = useState<Record<string, boolean>>({});
  const [expandedHistories, setExpandedHistories] = useState<Record<string, boolean>>({});

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [history.length, isProcessing]);

  const samplePromptChips: PromptChip[] = [
    { category: 'Architecture', label: '⚡ Rate Limits', query: 'How does our API gateway handle rate limiting?', icon: 'zap' },
    { category: 'DevOps', label: '🚀 Deployment', query: 'What is the production deployment and rollback process?', icon: 'rocket' },
    { category: 'Security', label: '🔒 DPA Policy', query: 'What are the details of the customer Data Processing Agreement (DPA)?', icon: 'lock' },
    { category: 'Identity', label: '🔑 MFA Setup', query: 'How do users reset their password and set up MFA?', icon: 'key' },
    { category: 'Billing', label: '💳 Pricing & Plans', query: 'What subscription plans and billing options are available?', icon: 'credit-card' },
    { category: 'Onboarding', label: '📘 Onboarding', query: 'What is the engineering onboarding process and tooling guide?', icon: 'book-open' },
  ];

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

  const toggleHistoryItem = (queryId: string) => {
    setExpandedHistories(prev => ({ ...prev, [queryId]: !prev[queryId] }));
  };

  const getClassificationBadge = (classification: string) => {
    switch (classification.toLowerCase()) {
      case 'public': return 'badge-emerald font-bold';
      case 'internal': return 'badge-blue font-bold';
      case 'confidential': return 'badge-amber font-bold';
      case 'restricted': return 'badge-rose font-bold';
      default: return 'bg-[#F1F0EC] text-[#37352F] border-[#D9D8D5] font-bold';
    }
  };

  const getSourceBadge = (source: string) => {
    switch (source.toLowerCase()) {
      case 'confluence': return { label: 'Confluence', bg: 'badge-blue' };
      case 'google_drive': return { label: 'Google Drive', bg: 'badge-emerald' };
      case 'zendesk': return { label: 'Zendesk KB', bg: 'bg-[#F3E8FF] text-[#7E22CE] border-[#E9D5FF]' };
      default: return { label: source, bg: 'bg-[#F1F0EC] text-[#37352F] border-[#D9D8D5]' };
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6 pb-36">
      {/* Notion Top Workspace Header */}
      <div className="notion-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-2xl font-bold text-[#000000] tracking-tight flex items-center gap-2">
              <MessageSquare className="w-6 h-6 text-[#2383E2]" />
              <span>AI Workspace & Chat</span>
            </h2>
            <span className="px-2.5 py-0.5 rounded-full badge-blue text-xs font-mono font-bold">
              CUDA GPU Active
            </span>
          </div>
          <p className="text-xs text-[#787774] mt-1 font-medium">
            Search enterprise knowledge with BM25 + Dense Vector hybrid retrieval and Zero-Trust ACL governance.
          </p>
        </div>

        {/* User Persona Chip */}
        <div className="flex items-center space-x-3 bg-[#F7F6F3] border border-[#E9E8E4] px-4 py-2 rounded-xl shadow-2xs">
          <div className="w-8 h-8 rounded-full bg-[#FFFFFF] border border-[#E9E8E4] text-[#2383E2] flex items-center justify-center shrink-0 font-bold">
            {renderCuteAvatar(currentPersona.avatar)}
          </div>
          <div className="text-xs">
            <div className="font-bold text-[#000000] flex items-center gap-1.5">
              <span>{currentPersona.name}</span>
              <span className="text-[10px] font-mono px-2 py-0.2 rounded bg-[#EAF2FF] text-[#2383E2] font-bold border border-[#BCE0FD]">
                {currentPersona.role}
              </span>
            </div>
            <div className="text-[11px] text-[#787774] font-mono mt-0.5 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#00A884]" />
              <span>Clearance: <strong className="text-[#37352F]">{currentPersona.securityClearance}</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* Empty State Welcome Card */}
      {history.length === 0 && !isProcessing && (
        <div className="notion-block-blue p-8 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-[#FFFFFF] border border-[#BCE0FD] text-[#2383E2] flex items-center justify-center mx-auto shadow-2xs">
            <Sparkles className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-[#000000]">What enterprise question can I answer for you today?</h3>
            <p className="text-xs text-[#787774] max-w-md mx-auto leading-relaxed">
              Ask questions verified against your active security clearance level. Select a suggested prompt below or type your question in the search bar.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 pt-2 max-w-2xl mx-auto">
            {samplePromptChips.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(chip.query)}
                className="px-3.5 py-2 rounded-xl bg-[#FFFFFF] hover:bg-[#F7F6F3] border border-[#E9E8E4] text-xs font-semibold text-[#37352F] transition-all active:scale-95 shadow-2xs flex items-center gap-1.5"
              >
                <span>{chip.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* History Stream */}
      <div className="space-y-6">
        {history.map((result, index) => {
          const isLatest = index === history.length - 1;
          const isExpanded = expandedHistories[result.queryId] ?? isLatest;
          const isClaimsExpanded = expandedClaims[result.queryId];

          return (
            <div key={result.queryId} className="notion-card p-6 space-y-5 transition-all">
              {/* Question Header Row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#E9E8E4] gap-2">
                <div className="flex items-start space-x-3">
                  <div className="w-7 h-7 rounded-lg bg-[#F1F0EC] border border-[#E9E8E4] text-[#2383E2] flex items-center justify-center shrink-0 mt-0.5 font-bold">
                    {renderCuteAvatar(result.user.avatar)}
                  </div>
                  <div>
                    <h3 className="font-bold text-[#000000] text-base leading-snug">
                      "{result.queryText}"
                    </h3>
                    <div className="text-[11px] font-mono text-[#787774] mt-0.5 flex items-center gap-2">
                      <span>Asked by <strong>{result.user.name}</strong> ({result.user.role})</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-[#787774]" />
                        {result.timestamp}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Telemetry Chips & History Toggle */}
                <div className="flex items-center space-x-2 shrink-0 self-end sm:self-center">
                  <span className="px-2.5 py-1 rounded-md bg-[#F1F0EC] border border-[#D9D8D5] text-[11px] font-mono text-[#37352F] flex items-center gap-1 font-semibold">
                    <Zap className="w-3 h-3 text-[#D97706]" />
                    {result.latencyMs}ms
                  </span>
                  <GroundingBadge score={result.confidenceScore} isAbstained={result.isAbstained} />

                  {!isLatest && (
                    <button
                      onClick={() => toggleHistoryItem(result.queryId)}
                      className="px-2.5 py-1 rounded-md bg-[#FFFFFF] hover:bg-[#F1F0EC] border border-[#E9E8E4] text-[11px] font-mono font-bold text-[#2383E2] flex items-center gap-1 shadow-2xs"
                    >
                      <span>{isExpanded ? 'Collapse' : 'Show Details'}</span>
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>
                  )}
                </div>
              </div>

              {/* Response Body (Expanded View) */}
              {isExpanded ? (
                <div className="space-y-5">
                  {/* Verified Synthesized Answer */}
                  <div className="space-y-2">
                    <div className="text-[11px] font-mono text-[#2383E2] font-bold uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Synthesized Verified Answer</span>
                    </div>
                    <div className="p-4 rounded-xl bg-[#F7F6F3] border border-[#E9E8E4] text-sm text-[#37352F] leading-relaxed whitespace-pre-wrap font-sans">
                      {result.answerText}
                    </div>
                  </div>

                  {/* Citations List */}
                  {result.citations && result.citations.length > 0 && (
                    <div className="space-y-2 pt-2 border-t border-[#E9E8E4]">
                      <div className="text-[11px] font-mono text-[#787774] font-bold uppercase tracking-wider flex items-center justify-between">
                        <span>Verified Source Citations ({result.citations.length})</span>
                        <span>Click chunk to view detail</span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {result.citations.map(c => {
                          const srcBadge = getSourceBadge(c.sourceSystem);
                          return (
                            <button
                              key={c.chunkId}
                              onClick={() => setSelectedCitation(c)}
                              className="p-3 rounded-xl bg-[#FFFFFF] border border-[#E9E8E4] hover:border-[#2383E2] hover:shadow-md transition-all text-left space-y-1.5 group"
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-[#000000] truncate group-hover:text-[#2383E2]">
                                  [{c.citationIndex}] {c.documentTitle}
                                </span>
                                <span className={`px-2 py-0.2 rounded text-[9px] font-mono border ${srcBadge.bg}`}>
                                  {srcBadge.label}
                                </span>
                              </div>
                              <p className="text-[11px] text-[#787774] line-clamp-2 leading-relaxed">
                                {c.excerpt}
                              </p>
                              <div className="flex items-center justify-between pt-1 text-[10px] font-mono text-[#787774]">
                                <span className={getClassificationBadge(c.classification)}>
                                  {c.classification.toUpperCase()}
                                </span>
                                <span className="text-[#2383E2] group-hover:underline">Inspect Chunk →</span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* NLI Claim Verification Expansion Block */}
                  {result.claims && result.claims.length > 0 && (
                    <div className="pt-2 border-t border-[#E9E8E4]">
                      <button
                        onClick={() => toggleClaims(result.queryId)}
                        className="w-full flex items-center justify-between text-xs font-mono font-bold text-[#37352F] hover:text-[#000000] p-2 rounded-lg hover:bg-[#F7F6F3]"
                      >
                        <span className="flex items-center gap-1.5 text-[#00A884]">
                          <ShieldCheck className="w-4 h-4" />
                          <span>NLI Claim Verification Checks ({result.claims.length})</span>
                        </span>
                        {isClaimsExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>

                      {isClaimsExpanded && (
                        <div className="mt-3 space-y-2 p-3 rounded-xl bg-[#F7F6F3] border border-[#E9E8E4]">
                          {result.claims.map((claim, idx) => (
                            <div key={idx} className="p-3 rounded-lg bg-[#FFFFFF] border border-[#E9E8E4] space-y-1.5 text-xs">
                              <div className="flex items-center justify-between">
                                <span className="font-mono text-[#37352F] italic">"{claim.claimSentence}"</span>
                                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold badge-emerald">
                                  VERIFIED ({Math.round(claim.entailmentScore * 100)}%)
                                </span>
                              </div>
                              <div className="text-[10px] font-mono text-[#787774] flex items-center gap-2">
                                <span>Supporting Chunks:</span>
                                <span className="font-bold text-[#2383E2]">{claim.supportingChunkIds.join(', ')}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                /* Compact Collapsed View for Older Thread Items */
                <div className="p-3.5 rounded-xl bg-[#F7F6F3] border border-[#E9E8E4] flex items-center justify-between gap-4 text-xs">
                  <p className="text-[#37352F] font-medium line-clamp-1 flex-1">
                    {result.answerText.substring(0, 140)}...
                  </p>
                  <button
                    onClick={() => toggleHistoryItem(result.queryId)}
                    className="text-[#2383E2] hover:underline font-mono text-[11px] font-bold shrink-0 flex items-center gap-1"
                  >
                    <span>View Full Answer</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Processing Loader */}
      {isProcessing && (
        <div className="notion-card p-6 border-[#BCE0FD] flex flex-col items-center justify-center space-y-3 text-[#2383E2] bg-[#EAF2FF]/60 animate-pulse">
          <div className="flex items-center space-x-3">
            <Cpu className="w-6 h-6 animate-spin text-[#2383E2]" />
            <span className="text-sm font-mono font-bold text-[#000000]">Running Zero-Trust RAG retrieval & CUDA synthesis...</span>
          </div>
        </div>
      )}

      <div ref={messagesEndRef} />

      {/* Sticky Bottom Input Bar */}
      <div className="fixed bottom-6 left-64 right-6 z-40 max-w-4xl mx-auto">
        <div className="bg-[#FFFFFF]/95 backdrop-blur-md border border-[#E9E8E4] rounded-2xl shadow-2xl p-3.5 space-y-2">
          {/* Quick Prompt Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            <span className="text-[10px] font-mono text-[#787774] font-bold uppercase tracking-wider shrink-0 mr-1">Quick Query:</span>
            {samplePromptChips.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(chip.query)}
                className="px-2.5 py-1 rounded-lg bg-[#F7F6F3] hover:bg-[#F1F0EC] border border-[#E9E8E4] text-[11px] font-mono font-medium text-[#37352F] whitespace-nowrap transition-all shadow-2xs active:scale-95"
              >
                {chip.label}
              </button>
            ))}
          </div>

          {/* Text Input Row */}
          <div className="relative flex items-center">
            <input
              type="text"
              value={inputQuery}
              onChange={e => setInputQuery(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') handleSend();
              }}
              placeholder={`Ask EKRS knowledge assistant as ${currentPersona.name}...`}
              className="w-full bg-[#F7F6F3] border border-[#E9E8E4] focus:border-[#2383E2] rounded-xl pl-4 pr-32 py-3 text-xs text-[#37352F] placeholder-[#787774] focus:outline-none focus:ring-2 focus:ring-[#2383E2]/20 font-sans font-medium"
            />

            <div className="absolute right-2 flex items-center space-x-2">
              <button
                onClick={() => handleSend()}
                disabled={!inputQuery.trim() || isProcessing}
                className="inline-flex items-center space-x-1.5 px-3.5 py-2 bg-[#2383E2] hover:bg-[#1D74CB] text-white text-xs font-bold rounded-lg disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-xs active:scale-95"
              >
                <span>Ask</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Citation Modal Popup */}
      <CitationModal citation={selectedCitation} onClose={() => setSelectedCitation(null)} />
    </div>
  );
};
