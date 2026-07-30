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
  Clock, 
  Zap, 
  FileText, 
  RotateCcw,
  Maximize2
} from 'lucide-react';

export const EKRSWidget: React.FC = () => {
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

  return (
    <>
      {/* Floating Trigger Pill Button (Bottom Right Corner) */}
      <div className="fixed bottom-6 right-6 z-50">
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="flex items-center space-x-2.5 px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-lg hover:shadow-indigo-500/25 transition-all font-mono font-bold text-xs active:scale-95 group border border-indigo-400/30"
          >
            <div className="w-6 h-6 rounded-full bg-white text-indigo-700 flex items-center justify-center text-xs font-black shadow-2xs">
              EK
            </div>
            <span>EKRS AI Assistant</span>
            <Sparkles className="w-4 h-4 text-indigo-200 group-hover:rotate-12 transition-transform" />
          </button>
        )}
      </div>

      {/* Floating Drawer Modal */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-96 max-w-[calc(100vw-2rem)] h-[580px] bg-white border border-slate-200 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
          {/* Drawer Header */}
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-xs font-bold shadow-xs">
                EK
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-xs tracking-tight">EKRS AI Knowledge Plugin</h3>
                <div className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
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
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
                title="Expand to Full Governance Workspace"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Drawer Message Stream */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {history.length === 0 && !isProcessing && (
              <div className="text-center py-12 space-y-3">
                <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-600 flex items-center justify-center mx-auto shadow-2xs">
                  <Bot className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-xs text-slate-900">How can I assist your enterprise task?</h4>
                  <p className="text-[11px] text-slate-500 max-w-xs mx-auto leading-relaxed">
                    Ask questions verified against your active security clearance.
                  </p>
                </div>
              </div>
            )}

            {isProcessing && (
              <div className="p-4 rounded-xl bg-indigo-50/50 border border-indigo-200 text-xs font-mono text-indigo-800 animate-pulse flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-indigo-600 animate-spin" />
                <span>Running Zero-Trust RAG retrieval...</span>
              </div>
            )}

            {history.map(res => (
              <div key={res.queryId} className="space-y-2 text-xs">
                {/* User Prompt */}
                <div className="flex justify-end">
                  <div className="bg-indigo-600 text-white p-3 rounded-xl rounded-tr-none max-w-[85%] font-medium leading-relaxed shadow-2xs">
                    {res.queryText}
                  </div>
                </div>

                {/* AI Answer */}
                <div className="flex justify-start">
                  <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl rounded-tl-none max-w-[90%] space-y-2 text-slate-900 leading-relaxed shadow-2xs">
                    <div className="flex items-center justify-between border-b border-slate-200/80 pb-1.5">
                      <span className="text-[10px] font-mono text-indigo-700 font-bold flex items-center gap-1">
                        <Bot className="w-3.5 h-3.5 text-indigo-600" />
                        <span>Verified Answer</span>
                      </span>
                      <GroundingBadge score={res.confidenceScore} isAbstained={res.isAbstained} />
                    </div>

                    <p className="text-xs font-sans font-medium whitespace-pre-wrap">{res.answerText}</p>

                    {/* Citations Micro Chips */}
                    {res.citations.length > 0 && (
                      <div className="pt-1.5 border-t border-slate-200/80 space-y-1">
                        <div className="text-[10px] font-mono text-slate-500 font-bold">Citations:</div>
                        <div className="flex flex-wrap gap-1">
                          {res.citations.map(c => (
                            <button
                              key={c.chunkId}
                              onClick={() => setSelectedCitation(c)}
                              className="px-2 py-0.5 rounded bg-white hover:bg-slate-100 border border-slate-200 text-[10px] font-mono text-slate-700 truncate max-w-[150px]"
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

          {/* Drawer Input Bar */}
          <div className="p-3 bg-slate-50 border-t border-slate-200">
            <div className="relative">
              <input
                type="text"
                value={inputQuery}
                onChange={e => setInputQuery(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') handleSend();
                }}
                placeholder="Ask EKRS assistant..."
                className="w-full bg-white border border-slate-200 rounded-xl pl-3 pr-10 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-2xs font-sans"
              />
              <button
                onClick={handleSend}
                disabled={!inputQuery.trim() || isProcessing}
                className="absolute right-2 top-2 p-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg disabled:opacity-40 transition-colors shadow-2xs"
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
