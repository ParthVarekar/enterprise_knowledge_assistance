import React from 'react';
import { createPortal } from 'react-dom';
import { X, ExternalLink, Calendar, FileText } from 'lucide-react';

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
        return 'badge-blue';
      case 'confidential':
        return 'badge-amber';
      case 'restricted':
        return 'badge-rose';
      default:
        return 'bg-[#F1F0EC] text-[#37352F] border-[#D9D8D5]';
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 bg-[#37352F]/40 backdrop-blur-md animate-in fade-in duration-150 overflow-y-auto">
      <div className="bg-[#FFFFFF] border border-[#E9E8E4] rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl space-y-0 my-auto animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-5 border-b border-[#E9E8E4] flex items-center justify-between bg-[#F7F6F3]">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-[#2383E2] text-white font-mono font-bold text-sm flex items-center justify-center shadow-2xs">
              [{citation.citationIndex}]
            </div>
            <div>
              <h3 className="font-bold text-[#000000] text-sm">{citation.documentTitle}</h3>
              <p className="text-[11px] font-mono text-[#787774]">Chunk ID: {citation.chunkId}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#787774] hover:text-[#37352F] hover:bg-[#EFEFED] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Metadata Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <span className={`px-2.5 py-1 text-xs font-mono font-bold rounded-md ${getClassificationBadge(citation.classification)}`}>
              Security: {citation.classification.toUpperCase()}
            </span>
            <span className="px-2.5 py-1 text-xs font-mono font-semibold rounded-md bg-[#F1F0EC] text-[#37352F] border border-[#D9D8D5]">
              Source: {citation.sourceSystem.toUpperCase()}
            </span>
            <span className="px-2.5 py-1 text-xs font-mono rounded-md bg-[#F1F0EC] text-[#787774] border border-[#D9D8D5] flex items-center gap-1">
              <Calendar className="w-3 h-3 text-[#787774]" />
              Updated: {new Date(citation.lastUpdatedAt).toLocaleDateString()}
            </span>
          </div>

          {/* Document Content Box */}
          <div className="p-4 rounded-xl bg-[#F7F6F3] text-[#37352F] space-y-2 border border-[#E9E8E4]">
            <div className="text-[11px] font-mono text-[#2383E2] flex items-center gap-1.5 font-bold uppercase tracking-wider">
              <FileText className="w-3.5 h-3.5" />
              <span>Verified Extracted Document Chunk</span>
            </div>
            <p className="text-xs font-mono leading-relaxed text-[#37352F] whitespace-pre-wrap pl-1">
              {citation.excerpt}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#E9E8E4] bg-[#F7F6F3] flex items-center justify-between">
          <a
            href={citation.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 text-xs font-mono text-[#2383E2] hover:text-[#1D74CB] font-semibold hover:underline"
          >
            <span>Open Original Document Source</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#E3E2E0]/60 hover:bg-[#D9D8D5] text-[#37352F] text-xs font-semibold rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
