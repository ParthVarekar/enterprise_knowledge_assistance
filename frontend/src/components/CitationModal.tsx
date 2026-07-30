import React, { useState, useEffect } from 'react';
import {
  X,
  ExternalLink,
  ShieldAlert,
  ShieldCheck,
  Shield,
  Lock,
  Globe,
  Building2,
  Calendar,
  FileText,
  Copy,
  Check,
  Hash,
  Database,
  CheckCircle2
} from 'lucide-react';

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
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (citation) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [citation, onClose]);

  if (!citation) return null;

  const handleCopyExcerpt = () => {
    if (citation?.excerpt) {
      navigator.clipboard.writeText(citation.excerpt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Format Classification Badge with Icon & Colors
  const renderClassificationBadge = (classification: string) => {
    const cls = classification.toLowerCase();
    switch (cls) {
      case 'restricted':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-rose-500/15 text-rose-300 border border-rose-500/40 shadow-sm shadow-rose-950/50">
            <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
            CLASSIFICATION: RESTRICTED
          </span>
        );
      case 'confidential':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-500/15 text-amber-300 border border-amber-500/40 shadow-sm shadow-amber-950/50">
            <Lock className="w-3.5 h-3.5 text-amber-400" />
            CLASSIFICATION: CONFIDENTIAL
          </span>
        );
      case 'internal':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 shadow-sm shadow-cyan-950/50">
            <Building2 className="w-3.5 h-3.5 text-cyan-400" />
            CLASSIFICATION: INTERNAL
          </span>
        );
      case 'public':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/40 shadow-sm shadow-emerald-950/50">
            <Globe className="w-3.5 h-3.5 text-emerald-400" />
            CLASSIFICATION: PUBLIC
          </span>
        );
    }
  };

  // Format updated date nicely
  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-2xl animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-slate-900/95 border border-slate-700/80 rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl backdrop-blur-2xl flex flex-col max-h-[90vh] sm:max-h-[85vh] animate-in zoom-in-95 duration-200 ring-1 ring-white/10">
        {/* Header Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-800/90 flex items-start justify-between bg-slate-950/60 flex-shrink-0">
          <div className="flex items-start space-x-3.5 min-w-0 pr-4">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center font-mono font-extrabold text-sm flex-shrink-0 shadow-inner">
              [{citation.citationIndex}]
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-slate-100 text-base sm:text-lg leading-snug truncate">
                {citation.documentTitle}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[11px] font-mono text-cyan-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-cyan-400" />
                  Verified Evidence Citation
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-800/80 border border-transparent hover:border-slate-700 transition-all flex-shrink-0"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-4 sm:p-6 space-y-5 overflow-y-auto flex-1 custom-scrollbar">
          {/* Security & Metadata Badges Bar */}
          <div className="flex flex-wrap items-center gap-2.5 bg-slate-950/40 p-3 rounded-xl border border-slate-800/80">
            {renderClassificationBadge(citation.classification)}

            {/* Chunk ID Badge */}
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium bg-slate-950 border border-slate-800 text-cyan-300 shadow-sm">
              <Hash className="w-3 h-3 text-cyan-400" />
              Chunk: <span className="font-bold">{citation.chunkId}</span>
            </span>

            {/* Source System Badge */}
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium bg-slate-950 border border-slate-800 text-slate-300 shadow-sm">
              <Database className="w-3 h-3 text-slate-400" />
              Source: <span className="font-bold uppercase text-slate-200">{citation.sourceSystem}</span>
            </span>

            {/* Updated Date Badge */}
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium bg-slate-950 border border-slate-800 text-slate-400 shadow-sm">
              <Calendar className="w-3 h-3 text-slate-400" />
              Updated: <span className="text-slate-200">{formatDate(citation.lastUpdatedAt)}</span>
            </span>
          </div>

          {/* Clean High-Contrast Text / Code Excerpt Panel */}
          <div className="space-y-2">
            <div className="flex items-center justify-between px-1">
              <div className="text-xs font-mono font-bold text-cyan-400 flex items-center gap-1.5 uppercase tracking-wider">
                <FileText className="w-4 h-4 text-cyan-400" />
                Verified Code & Text Excerpt
              </div>
              <button
                onClick={handleCopyExcerpt}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-cyan-300 transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400 font-bold">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-400" />
                    <span>Copy Text</span>
                  </>
                )}
              </button>
            </div>

            {/* High-Contrast Excerpt Display Box */}
            <div className="bg-slate-950 border border-slate-800/90 rounded-xl p-4 sm:p-5 font-mono text-xs sm:text-sm leading-relaxed text-slate-100 shadow-inner relative overflow-x-auto selection:bg-cyan-500/30 selection:text-cyan-100 ring-1 ring-cyan-500/10">
              <div className="absolute top-0 left-0 bottom-0 w-1 bg-gradient-to-b from-cyan-500 to-blue-600 rounded-l-xl"></div>
              <p className="whitespace-pre-wrap font-mono text-slate-100 pl-2">
                {citation.excerpt}
              </p>
            </div>
          </div>
        </div>

        {/* Footer Bar */}
        <div className="p-4 sm:p-5 border-t border-slate-800/90 bg-slate-950/70 flex flex-col sm:flex-row items-center justify-between gap-3 flex-shrink-0">
          <a
            href={citation.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-4 py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-bold transition-all shadow-md group"
          >
            <span>Open Original Document</span>
            <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition-colors shadow-sm"
          >
            Close Drawer
          </button>
        </div>
      </div>
    </div>
  );
};

