import React from 'react';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';

interface GroundingBadgeProps {
  score: number;
  isAbstained?: boolean;
}

export const GroundingBadge: React.FC<GroundingBadgeProps> = ({ score, isAbstained }) => {
  const percentage = Math.min(99, Math.max(0, Math.round(score * 100)));

  if (isAbstained) {
    return (
      <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full badge-amber text-xs font-mono font-bold shadow-xs">
        <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
        <span>Abstained (Insufficient Evidence)</span>
      </div>
    );
  }

  const badgeStyle = percentage >= 75
    ? 'badge-emerald font-bold'
    : percentage >= 50
    ? 'badge-indigo font-bold'
    : 'badge-amber font-bold';

  return (
    <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-mono shadow-xs ${badgeStyle}`}>
      <CheckCircle2 className="w-3.5 h-3.5" />
      <span>NLI Grounded: {percentage}%</span>
    </div>
  );
};
