import React, { useState } from 'react';
import { UserPersona } from '../mockEngine/engineAdapter';
import { GroundingBadge } from '../components/GroundingBadge';
import { CitationModal } from '../components/CitationModal';
import { renderCuteAvatar } from '../components/ui/CuteIcons';
import {
  Send,
  Sparkles,
  FileText,
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
  MessageSquare
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
      case 'zap': return <Zap className="w-3.5 h-3.5 text-[#D97706]" />;
      case 'rocket': return <Rocket className="w-3.5 h-3.5 text-[#9333EA]" />;
      case 'lock': return <Lock className="w-3.5 h-3.5 text-[#E11D48]" />;
      case 'key': return <Key className="w-3.5 h-3.5 text-[#2383E2]" />;
      case 'credit-card': return <CreditCard className="w-3.5 h-3.5 text-[#2563EB]" />;
      case 'book-open': return <BookOpen className="w-3.5 h-3.5 text-[#00A884]" />;
      default: return <Sparkles className="w-3.5 h-3.5 text-[#2383E2]" />;
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
        return 'badge-blue font-bold';
      case 'confidential':
        return 'badge-amber font-bold';
      case 'restricted':
        return 'badge-rose font-bold';
      default:
        return 'bg-[#F1F0EC] text-[#37352F] border-[#D9D8D5] font-bold';
    }
  };

  const getSourceBadge = (source: string) => {
    switch (source.toLowerCase()) {
      case 'confluence':
        return { label: 'Confluence', bg: 'badge-blue' };
      case 'google_drive':
        return { label: 'Google Drive', bg: 'badge-emerald' };
      case 'zendesk':
        return { label: 'Zendesk KB', bg: 'bg-[#F3E8FF] text-[#7E22CE] border-[#E9D5FF]' };
      default:
        return { label: source, bg: 'bg-[#F1F0EC] text-[#37352F] border-[#D9D8D5]' };
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Notion Electric Blue Hero Search Block */}
      <div className="notion-block-blue p-6 md:p-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-2xl font-bold text-[#000000] tracking-tight flex items-center gap-2">
                <MessageSquare className="w-6 h-6 text-[#2383E2]" />
                <span>AI Workspace & Chat</span>
              </h2>
              <span className="px-2.5 py-0.5 rounded-full badge-blue text-xs font-mono font-bold">
                Llama.cpp CUDA
              </span>
            </div>
            <p className="text-sm text-[#787774] mt-1">
              Search enterprise knowledge with BM25 + Dense Vector hybrid retrieval and Zero-Trust ACL governance.
            </p>
          </div>

          {/* User Persona Chip */}
          <div className="flex items-center space-x-3 bg-[#FFFFFF] border border-[#BCE0FD] px-4 py-2.5 rounded-2xl shadow-2xs">
            <div className="w-9 h-9 rounded-full bg-[#F1F0EC] border border-[#E9E8E4] text-[#2383E2] flex items-center justify-center shrink-0 font-bold">
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

        {/* Central Notion Query Box */}
        <div className="notion-card p-4 space-y-3">
          <div className="relative">
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
              className="w-full bg-[#F7F6F3] border border-[#E9E8E4] focus:border-[#2383E2] rounded-xl pl-4 pr-36 py-3 text-sm text-[#37352F] placeholder-[#787774] focus:outline-none focus:ring-2 focus:ring-[#2383E2]/20 resize-none font-sans leading-relaxed"
            />

            <div className="absolute right-3 bottom-3 flex items-center space-x-2">
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-mono text-[#787774] mr-1">
                <span className="keycap">⌘K</span>
                <span className="keycap"><CornerDownLeft className="w-3 h-3 inline" /></span>
              </span>

              <button
                onClick={() => handleSend()}
                disabled={!inputQuery.trim() || isProcessing}
                className="inline-flex items-center space-x-2 px-4 py-2 bg-[#2383E2] hover:bg-[#1D74CB] text-white text-xs font-bold rounded-lg disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-xs active:scale-95"
              >
                <span>Ask EKRS</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Suggested Enterprise Prompt Chips */}
          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between text-[11px] font-mono text-[#787774]">
              <span className="flex items-center gap-1.5 font-bold text-[#2383E2]">
                <Sparkles className="w-3.5 h-3.5 text-[#2383E2]" />
                <span>Suggested Enterprise Queries</span>
              </span>
              <span>Click chip to execute</span>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {samplePromptChips.map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(chip.query)}
                  className="px-3 py-1.5 rounded-xl bg-[#FFFFFF] hover:bg-[#F7F6F3] border border-[#E9E8E4] text-xs font-medium text-[#37352F] whitespace-nowrap transition-all flex items-center space-x-1.5 active:scale-95 shadow-2xs"
                >
                  {renderChipIcon(chip.icon)}
                  <span>{chip.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Processing Loader */}
      {isProcessing && (
        <div className="notion-card p-6 border-[#BCE0FD] flex flex-col items-center justify-center space-y-3 text-[#2383E2] bg-[#EAF2FF]/60 animate-pulse">
          <div className="flex items-center space-x-3">
            <Cpu className="w-6 h-6 animate-spin text-[#2383E2]" />
            <span className="text-sm font-mono font-bold text-[#000000]">Executing EKRS Hybrid Retrieval & Live ACL Gate...</span>
          </div>
        </div>
      )}

      {/* History Stream */}
      <div className="space-y-6">
        {history.map((result) => {
          const isClaimsExpanded = expandedClaims[result.queryId];
          return (
            <div key={result.queryId} className="notion-card p-6 space-y-5">
              {/* Question Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#E9E8E4] gap-2">
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

                {/* Telemetry Chips */}
                <div className="flex items-center space-x-2 shrink-0 self-end sm:self-center">
                  <span className="px-2.5 py-1 rounded-md bg-[#F1F0EC] border border-[#D9D8D5] text-[11px] font-mono text-[#37352F] flex items-center gap-1 font-semibold">
                    <Zap className="w-3 h-3 text-[#D97706]" />
                    {result.latencyMs}ms
                  </span>
                  <GroundingBadge score={result.confidenceScore} isAbstained={result.isAbstained} />
                </div>
              </div>

              {/* Verified Synthesized Answer */}
              <div className="space-y-3">
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
          );
        })}
      </div>

      {/* Citation Modal Popup */}
      <CitationModal citation={selectedCitation} onClose={() => setSelectedCitation(null)} />
    </div>
  );
};
