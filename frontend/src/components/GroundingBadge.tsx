import React from 'react';
import { ShieldCheck, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface GroundingBadgeProps {
  score: number;
  isAbstained?: boolean;
}

export const GroundingBadge: React.FC<GroundingBadgeProps> = ({ score, isAbstained }) => {
  const percentage = Math.round(score * 100);

  if (isAbstained) {
    return (
      <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono font-medium">
        <AlertTriangle className="w-3.5 h-3.5" />
        <span>Abstained (Insufficient Evidence)</span>
      </div>
    );
  }

  const colorStyle = percentage >= 75
    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
    : percentage >= 50
    ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400'
    : 'bg-amber-500/10 border-amber-500/30 text-amber-400';

  return (
    <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full border text-xs font-mono font-medium ${colorStyle}`}>
      <CheckCircle2 className="w-3.5 h-3.5" />
      <span>NLI Grounded: {percentage}%</span>
    </div>
  );
};
