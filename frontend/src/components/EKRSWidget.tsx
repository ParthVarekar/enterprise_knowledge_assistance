import React, { useState } from 'react';
import { useEKRS } from '../context/EKRSContext';
import { GroundingBadge } from './GroundingBadge';
import { CitationModal } from './CitationModal';
import { 
  Bot, 
  Send, 
  X, 
  Sparkles, 
  ShieldCheck, 
  Maximize2
} from 'lucide-react';

export interface EKRSWidgetProps {
  apiEndpoint?: string;
  theme?: 'light' | 'dark';
  token?: string;
  onCitationClick?: (citation: any) => void;
}

export const EKRSWidget: React.FC<EKRSWidgetProps> = ({
  apiEndpoint = '/api/v1/query',
  theme = 'light',
  onCitationClick,
}) => {
  const { currentPersona, history, isProcessing, executeQuery, setViewMode } = useEKRS();
  const [isOpen, setIsOpen] = useState(false);
  const [inputQuery, setInputQuery] = useState('');
  const [selectedCitation, setSelectedCitation] = useState<any>(null);

  const handleSend = () => {
    if (!inputQuery.trim() || isProcessing) return;
    const q = inputQuery;
    setInputQuery('');
    executeQuery(q);
  };

  const handleCitationClick = (citation: any) => {
    if (onCitationClick) {
      onCitationClick(citation);
    } else {
      setSelectedCitation(citation);
    }
  };

  const isDark = theme === 'dark';

  return (
    <>
      {/* Floating Trigger Pill Button (Bottom Right Corner) */}
      <div className="fixed bottom-6 right-6 z-50">
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="flex items-center space-x-2.5 px-4 py-3 bg-[#2383E2] hover:bg-[#1D74CB] text-white rounded-full shadow-lg transition-all font-mono font-bold text-xs active:scale-95 group border border-[#BCE0FD]/30"
          >
            <div className="w-6 h-6 rounded-full bg-white text-[#2383E2] flex items-center justify-center text-xs font-black shadow-2xs">
              EK
            </div>
            <span>EKRS AI Assistant</span>
            <Sparkles className="w-4 h-4 text-white group-hover:rotate-12 transition-transform" />
          </button>
        )}
      </div>

      {/* Floating Drawer Modal */}
      {isOpen && (
        <div className={`fixed bottom-6 right-6 z-50 w-96 max-w-[calc(100vw-2rem)] h-[580px] ${
          isDark ? 'bg-[#191919] text-white border-[#333333]' : 'bg-[#FFFFFF] text-[#37352F] border-[#E9E8E4]'
        } border rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200`}>
          {/* Drawer Header */}
          <div className={`p-4 ${isDark ? 'bg-[#222222] border-[#333333]' : 'bg-[#F7F6F3] border-[#E9E8E4]'} border-b flex items-center justify-between`}>
            <div className="flex items-center space-x-2.5">
              <div className="w-7 h-7 rounded-lg bg-[#2383E2] text-white flex items-center justify-center text-xs font-bold shadow-2xs">
                EK
              </div>
              <div>
                <h3 className="font-bold text-xs tracking-tight">EKRS AI Knowledge Plugin</h3>
                <div className="text-[10px] text-[#787774] font-mono flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-[#00A884]" />
                  <span>{currentPersona.name} • L{currentPersona.clearanceLevel || 2}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-1">
              <button
                onClick={() => {
                  setIsOpen(false);
                  setViewMode('dashboard');
                }}
                className="p-1.5 rounded-lg text-[#787774] hover:text-[#37352F] hover:bg-[#E3E2E0] transition-colors"
                title="Expand to Full Governance Workspace"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-[#787774] hover:text-[#37352F] hover:bg-[#E3E2E0] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Drawer Message Stream */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {history.length === 0 && !isProcessing && (
              <div className="text-center py-12 space-y-3">
                <div className="w-12 h-12 rounded-xl bg-[#EAF2FF] border border-[#BCE0FD] text-[#2383E2] flex items-center justify-center mx-auto shadow-2xs">
                  <Bot className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-xs text-[#000000]">How can I assist your enterprise task?</h4>
                  <p className="text-[11px] text-[#787774] max-w-xs mx-auto leading-relaxed">
                    Ask questions verified against your active security clearance. Endpoint: <code className="font-mono text-[10px] text-[#2383E2]">{apiEndpoint}</code>
                  </p>
                </div>
              </div>
            )}

            {isProcessing && (
              <div className="p-4 rounded-xl bg-[#EAF2FF] border border-[#BCE0FD] text-xs font-mono text-[#2383E2] animate-pulse flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-[#2383E2] animate-spin" />
                <span>Running Zero-Trust RAG retrieval...</span>
              </div>
            )}

            {history.map(res => (
              <div key={res.queryId} className="space-y-2 text-xs">
                {/* User Prompt */}
                <div className="flex justify-end">
                  <div className="bg-[#2383E2] text-white p-3 rounded-xl rounded-tr-none max-w-[85%] font-medium leading-relaxed shadow-2xs">
                    {res.queryText}
                  </div>
                </div>

                {/* AI Answer */}
                <div className="flex justify-start">
                  <div className={`p-3.5 rounded-xl rounded-tl-none max-w-[90%] space-y-2 leading-relaxed shadow-2xs border ${
                    isDark ? 'bg-[#222222] border-[#333333] text-white' : 'bg-[#F7F6F3] border-[#E9E8E4] text-[#37352F]'
                  }`}>
                    <div className="flex items-center justify-between border-b border-[#E9E8E4] pb-1.5">
                      <span className="text-[10px] font-mono text-[#2383E2] font-bold flex items-center gap-1">
                        <Bot className="w-3.5 h-3.5 text-[#2383E2]" />
                        <span>Verified Answer</span>
                      </span>
                      <GroundingBadge score={res.confidenceScore} isAbstained={res.isAbstained} />
                    </div>

                    <p className="text-xs font-sans font-medium whitespace-pre-wrap">{res.answerText}</p>

                    {/* Citations Micro Chips */}
                    {res.citations.length > 0 && (
                      <div className="pt-1.5 border-t border-[#E9E8E4] space-y-1">
                        <div className="text-[10px] font-mono text-[#787774] font-bold">Citations:</div>
                        <div className="flex flex-wrap gap-1">
                          {res.citations.map(c => (
                            <button
                              key={c.chunkId}
                              onClick={() => handleCitationClick(c)}
                              className="px-2 py-0.5 rounded bg-[#FFFFFF] hover:bg-[#F1F0EC] border border-[#E9E8E4] text-[10px] font-mono text-[#37352F] truncate max-w-[150px]"
                            >
                              [{c.citationIndex}] {c.documentTitle}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Pitch Chips */}
          <div className={`px-3 pt-2.5 ${isDark ? 'bg-[#222222]' : 'bg-[#F7F6F3]'} flex items-center gap-1.5 overflow-x-auto pb-1`}>
            {[
              { label: '⚡ Rate Limits', query: 'How does our API gateway handle rate limiting?' },
              { label: '🚀 Rollbacks', query: 'What is the production deployment and rollback process?' },
              { label: '🔒 Security DPA', query: 'What are the details of the customer Data Processing Agreement (DPA)?' },
              { label: '🔑 MFA Setup', query: 'How do users reset their password and set up MFA?' },
            ].map((chip, idx) => (
              <button
                key={idx}
                onClick={() => executeQuery(chip.query)}
                className="px-2 py-0.5 rounded bg-[#FFFFFF] hover:bg-[#F1F0EC] border border-[#E9E8E4] text-[10px] font-mono text-[#37352F] whitespace-nowrap shadow-2xs font-semibold"
              >
                {chip.label}
              </button>
            ))}
          </div>

          {/* Drawer Input Bar */}
          <div className={`p-3 ${isDark ? 'bg-[#222222] border-[#333333]' : 'bg-[#F7F6F3] border-[#E9E8E4]'} border-t`}>
            <div className="relative">
              <input
                type="text"
                value={inputQuery}
                onChange={e => setInputQuery(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') handleSend();
                }}
                placeholder="Ask EKRS assistant..."
                className={`w-full ${isDark ? 'bg-[#191919] text-white border-[#333333]' : 'bg-[#FFFFFF] text-[#37352F] border-[#E9E8E4]'} border rounded-xl pl-3 pr-10 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-[#2383E2] shadow-2xs font-sans`}
              />
              <button
                onClick={handleSend}
                disabled={!inputQuery.trim() || isProcessing}
                className="absolute right-2 top-2 p-1.5 bg-[#2383E2] hover:bg-[#1D74CB] text-white rounded-lg disabled:opacity-40 transition-colors shadow-2xs"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      <CitationModal citation={selectedCitation} onClose={() => setSelectedCitation(null)} />
    </>
  );
};
