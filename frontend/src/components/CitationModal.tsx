import React from 'react';
import { createPortal } from 'react-dom';
import { X, ExternalLink, ShieldAlert, Calendar, FileText, Lock, Globe, Building2 } from 'lucide-react';

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

  const getClassificationBadge = (classification: string) => {
    switch (classification.toLowerCase()) {
      case 'public':
        return 'badge-emerald';
      case 'internal':
        return 'badge-indigo';
      case 'confidential':
        return 'badge-amber';
      case 'restricted':
        return 'badge-rose';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-300';
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-150 overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl space-y-0 my-auto animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white font-mono font-bold text-sm flex items-center justify-center shadow-xs">
              [{citation.citationIndex}]
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">{citation.documentTitle}</h3>
              <p className="text-[11px] font-mono text-slate-500">Chunk ID: {citation.chunkId}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Metadata Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <span className={`px-2.5 py-1 text-xs font-mono font-bold rounded ${getClassificationBadge(citation.classification)}`}>
              Security: {citation.classification.toUpperCase()}
            </span>
            <span className="px-2.5 py-1 text-xs font-mono font-semibold rounded bg-slate-100 text-slate-700 border border-slate-200">
              Source: {citation.sourceSystem.toUpperCase()}
            </span>
            <span className="px-2.5 py-1 text-xs font-mono rounded bg-slate-100 text-slate-500 border border-slate-200 flex items-center gap-1">
              <Calendar className="w-3 h-3 text-slate-400" />
              Updated: {new Date(citation.lastUpdatedAt).toLocaleDateString()}
            </span>
          </div>

          {/* Document Content Box */}
          <div className="p-4 rounded-xl bg-slate-900 text-slate-100 space-y-2 border border-slate-800 shadow-inner">
            <div className="text-[11px] font-mono text-indigo-400 flex items-center gap-1.5 font-bold uppercase tracking-wider">
              <FileText className="w-3.5 h-3.5" />
              <span>Verified Extracted Document Chunk</span>
            </div>
            <p className="text-xs font-mono leading-relaxed text-slate-200 whitespace-pre-wrap pl-1">
              {citation.excerpt}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <a
            href={citation.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 text-xs font-mono text-indigo-600 hover:text-indigo-800 font-semibold hover:underline"
          >
            <span>Open Original Document Source</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-semibold rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
