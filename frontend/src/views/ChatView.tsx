import React, { useState } from 'react';
import { UserPersona, EngineAdapter, QueryResult } from '../mockEngine/engineAdapter';
import { GroundingBadge } from '../components/GroundingBadge';
import { CitationModal } from '../components/CitationModal';
import { Send, Bot, User, Sparkles, AlertCircle, FileText, ArrowRight, Shield } from 'lucide-react';

interface ChatViewProps {
  currentPersona: UserPersona;
}

export const ChatView: React.FC<ChatViewProps> = ({ currentPersona }) => {
  const [inputQuery, setInputQuery] = useState('');
  const [history, setHistory] = useState<QueryResult[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedCitation, setSelectedCitation] = useState<any>(null);

  const sampleQueries = [
    'How does our API gateway handle rate limiting?',
    'What is the production deployment and rollback process?',
    'What are the details of the customer Data Processing Agreement (DPA)?',
    'How do users reset their password and set up MFA?',
  ];

  const handleSend = (textToSend?: string) => {
    const q = textToSend || inputQuery;
    if (!q.trim() || isProcessing) return;

    setIsProcessing(true);
    setInputQuery('');

    setTimeout(() => {
      const result = EngineAdapter.executeQuery(q, currentPersona);
      setHistory(prev => [result, ...prev]);
      setIsProcessing(false);
    }, 400);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Header Info */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <span>AI Knowledge Workspace & Slack Assistant</span>
            <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono">
              Live RAG
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Ask questions across Confluence, Google Drive & Zendesk. Answers are pre-filtered by <span className="text-cyan-400 font-mono">{currentPersona.name}'s</span> security clearance.
          </p>
        </div>
      </div>

      {/* Query Input Card */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-700/80 shadow-xl space-y-3">
        <div className="relative">
          <textarea
            rows={2}
            value={inputQuery}
            onChange={e => setInputQuery(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder={`Ask a question as ${currentPersona.name}... (Press Enter to send)`}
            className="w-full bg-slate-950/60 border border-slate-700/80 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 resize-none font-sans"
          />
          <button
            onClick={() => handleSend()}
            disabled={!inputQuery.trim() || isProcessing}
            className="absolute right-3 bottom-3 p-2 bg-gradient-to-tr from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-lg disabled:opacity-40 transition-all shadow-md"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

        {/* Sample Quick Queries */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1">
          <span className="text-[11px] font-mono text-slate-500 whitespace-nowrap">Try:</span>
          {sampleQueries.map((sq, i) => (
            <button
              key={i}
              onClick={() => handleSend(sq)}
              className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 text-[11px] text-slate-300 hover:text-cyan-300 whitespace-nowrap transition-colors"
            >
              {sq}
            </button>
          ))}
        </div>
      </div>

      {/* Processing Loader */}
      {isProcessing && (
        <div className="glass-panel p-6 rounded-2xl flex items-center justify-center space-x-3 text-cyan-400 animate-pulse">
          <Sparkles className="w-5 h-5 animate-spin" />
          <span className="text-xs font-mono">Running Hybrid BM25 + Dense Vector Search & Live ACL Verification...</span>
        </div>
      )}

      {/* Query Results Stream */}
      <div className="space-y-6">
        {history.length === 0 && !isProcessing && (
          <div className="glass-panel p-12 rounded-2xl text-center space-y-3 border-dashed border-slate-800">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mx-auto">
              <Bot className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-semibold text-slate-300">No active queries yet</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Type a question above or click one of the quick prompts to experience real-time RAG retrieval and Zero-Trust ACL enforcement.
            </p>
          </div>
        )}

        {history.map((res) => (
          <div key={res.queryId} className="glass-panel p-6 rounded-2xl space-y-4 border border-slate-700/80 shadow-xl">
            {/* Query Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-3">
                <span className="text-lg">{res.user.avatar}</span>
                <div>
                  <h4 className="font-bold text-sm text-slate-100">"{res.queryText}"</h4>
                  <div className="text-[11px] text-slate-400 font-mono">
                    Asked by {res.user.name} ({res.user.role}) at {res.timestamp}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <GroundingBadge score={res.confidenceScore} isAbstained={res.isAbstained} />
                <span className="text-[11px] font-mono text-slate-500">{res.latencyMs}ms</span>
              </div>
            </div>

            {/* Answer Content */}
            <div className="space-y-3">
              {res.isAbstained ? (
                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs leading-relaxed space-y-1">
                  <div className="font-semibold flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 text-amber-400" />
                    Intelligent Engine Abstention
                  </div>
                  <p>{res.answerText}</p>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-200 leading-relaxed font-sans whitespace-pre-wrap">
                  {res.answerText}
                </div>
              )}
            </div>

            {/* Citations & Evidence Section */}
            {res.citations.length > 0 && (
              <div className="space-y-2 pt-2">
                <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider flex items-center justify-between">
                  <span>Verified Citations & Evidence ({res.citations.length})</span>
                  <span className="text-cyan-400">Click citation to inspect chunk</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {res.citations.map(cite => (
                    <button
                      key={cite.chunkId}
                      onClick={() => setSelectedCitation(cite)}
                      className="glass-panel-interactive p-3 rounded-xl text-left flex items-start space-x-3 group"
                    >
                      <span className="w-6 h-6 rounded-md bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[11px] font-mono font-bold flex items-center justify-center flex-shrink-0 group-hover:bg-cyan-500 group-hover:text-slate-950 transition-colors">
                        [{cite.citationIndex}]
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-xs text-slate-200 truncate group-hover:text-cyan-300 transition-colors">
                          {cite.documentTitle}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono mt-0.5 flex items-center gap-2">
                          <span className="uppercase text-slate-300">{cite.sourceSystem}</span>
                          <span>•</span>
                          <span className="text-cyan-400 font-semibold">{cite.classification}</span>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-cyan-400 transition-colors" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Citation Detail Modal */}
      <CitationModal citation={selectedCitation} onClose={() => setSelectedCitation(null)} />
    </div>
  );
};
