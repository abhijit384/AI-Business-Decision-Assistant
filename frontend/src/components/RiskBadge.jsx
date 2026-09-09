import React from 'react';
import { ShieldCheck, AlertTriangle, Flame } from 'lucide-react';

export default function RiskBadge({ level = 'Medium', size = 'md' }) {
  const normalized = (level || 'Medium').toLowerCase();

  const configs = {
    low: {
      label: 'Low Risk',
      classes: 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800 ring-emerald-500/20',
      icon: ShieldCheck,
      iconColor: 'text-emerald-600 dark:text-emerald-400',
    },
    medium: {
      label: 'Medium Risk',
      classes: 'bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800 ring-amber-500/20',
      icon: AlertTriangle,
      iconColor: 'text-amber-600 dark:text-amber-400',
    },
    high: {
      label: 'High Risk',
      classes: 'bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800 ring-rose-500/20',
      icon: Flame,
      iconColor: 'text-rose-600 dark:text-rose-400',
    },
  };

  const config = configs[normalized] || configs.medium;
  const Icon = config.icon;

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs gap-1',
    md: 'px-3 py-1 text-sm gap-1.5',
    lg: 'px-4 py-1.5 text-base gap-2 font-semibold',
  }[size] || 'px-3 py-1 text-sm gap-1.5';

  return (
    <span className={`inline-flex items-center rounded-full border ring-1 font-medium ${config.classes} ${sizeClasses}`}>
      <Icon className={`w-4 h-4 ${config.iconColor}`} />
      <span>{config.label}</span>
    </span>
  );
}
