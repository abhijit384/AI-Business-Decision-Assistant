import React from 'react';

export default function ConfidenceGauge({ score = 85 }) {
  const boundedScore = Math.max(0, Math.min(100, Math.round(score)));

  // Gauge color based on score
  let strokeColor = '#3B82F6'; // blue
  let textColor = 'text-blue-600 dark:text-blue-400';
  let badgeLabel = 'Strong';
  let badgeBg = 'bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800';

  if (boundedScore >= 80) {
    strokeColor = '#10B981'; // emerald
    textColor = 'text-emerald-600 dark:text-emerald-400';
    badgeLabel = 'High Certainty';
    badgeBg = 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
  } else if (boundedScore >= 60) {
    strokeColor = '#2563EB'; // brand blue
    textColor = 'text-blue-600 dark:text-blue-400';
    badgeLabel = 'Moderate';
    badgeBg = 'bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800';
  } else {
    strokeColor = '#F59E0B'; // amber
    textColor = 'text-amber-600 dark:text-amber-400';
    badgeLabel = 'Speculative';
    badgeBg = 'bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800';
  }

  // SVG Circular progress math
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (boundedScore / 100) * circumference;

  return (
    <div className="flex items-center gap-4">
      {/* Circular SVG Gauge */}
      <div className="relative w-20 h-20 flex-shrink-0 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 96 96">
          <circle
            cx="48"
            cy="48"
            r={radius}
            stroke="currentColor"
            className="text-slate-200 dark:text-slate-700"
            strokeWidth="8"
            fill="transparent"
          />
          <circle
            cx="48"
            cy="48"
            r={radius}
            stroke={strokeColor}
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className={`text-xl font-bold tracking-tight ${textColor}`}>
            {boundedScore}%
          </span>
        </div>
      </div>

      {/* Label and description */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Confidence Score</span>
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${badgeBg}`}>
            {badgeLabel}
          </span>
        </div>
        <p className="text-xs text-slate-600 dark:text-slate-400 max-w-[200px]">
          Statistical confidence of the model based on provided business constraints.
        </p>
      </div>
    </div>
  );
}
