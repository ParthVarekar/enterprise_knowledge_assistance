import React from 'react';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';

interface GroundingBadgeProps {
  score: number;
  isAbstained?: boolean;
}

export const GroundingBadge: React.FC<GroundingBadgeProps> = ({ score, isAbstained }) => {
  // Strictly clamp percentage between 0% and 99%
  const percentage = Math.min(99, Math.max(0, Math.round(score * 100)));

  if (isAbstained) {
    return (
      <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-950/60 border border-amber-500/40 text-amber-300 text-xs font-mono font-medium">
        <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
        <span>Abstained (ACL / Insufficient Evidence)</span>
      </div>
    );
  }

  const colorStyle = percentage >= 75
    ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
    : percentage >= 50
    ? 'bg-cyan-950/60 border-cyan-500/40 text-cyan-300'
    : 'bg-amber-950/60 border-amber-500/40 text-amber-300';

  return (
    <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full border text-xs font-mono font-medium ${colorStyle}`}>
      <CheckCircle2 className="w-3.5 h-3.5" />
      <span>NLI Grounded: {percentage}%</span>
    </div>
  );
};
