import React from 'react';
import { X, ExternalLink, ShieldAlert, Calendar, FileText } from 'lucide-react';

interface CitationModalProps {
  citation: {
    citationIndex: number;
    chunkId: string;
    documentTitle: string;
    sourceSystem: string;
    sourceUrl: string;
    lastUpdatedAt: string;
    excerpt: string;
    classification: string;
  } | null;
  onClose: () => void;
}

export const CitationModal: React.FC<CitationModalProps> = ({ citation, onClose }) => {
  if (!citation) return null;

  const classificationColors: Record<string, string> = {
    public: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    internal: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    confidential: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    restricted: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/40">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center font-mono font-bold">
              [{citation.citationIndex}]
            </div>
            <div>
              <h3 className="font-semibold text-slate-100 text-sm">{citation.documentTitle}</h3>
              <p className="text-[11px] font-mono text-slate-400">Chunk ID: {citation.chunkId}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Metadata Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <span className={`px-2.5 py-1 text-xs font-mono font-semibold rounded-full border ${classificationColors[citation.classification] || 'bg-slate-800 text-slate-300'}`}>
              Security: {citation.classification.toUpperCase()}
            </span>
            <span className="px-2.5 py-1 text-xs font-mono rounded-full bg-slate-800 text-slate-300 border border-slate-700">
              Source: {citation.sourceSystem.toUpperCase()}
            </span>
            <span className="px-2.5 py-1 text-xs font-mono rounded-full bg-slate-800 text-slate-400 border border-slate-700 flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              Updated: {new Date(citation.lastUpdatedAt).toLocaleDateString()}
            </span>
          </div>

          {/* Document Content */}
          <div className="glass-panel p-4 rounded-xl space-y-2">
            <div className="text-xs font-mono text-cyan-400 flex items-center gap-1">
              <FileText className="w-3.5 h-3.5" />
              VERIFIED EXTRACTED CHUNK CONTENT
            </div>
            <p className="text-sm text-slate-200 leading-relaxed font-sans whitespace-pre-wrap">
              {citation.excerpt}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/40 flex items-center justify-between">
          <a
            href={citation.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 text-xs font-mono text-cyan-400 hover:text-cyan-300 hover:underline"
          >
            <span>Open Original Document</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
