import React from 'react';

export default function StatCard({
  title,
  value,
  subtext,
  icon: Icon,
  trend,
  color = 'blue'
}) {
  const colorMap = {
    blue: {
      border: 'border-blue-500/20',
      bg: 'bg-blue-500/10',
      text: 'text-blue-400',
      glow: 'shadow-blue-500/5'
    },
    emerald: {
      border: 'border-emerald-500/20',
      bg: 'bg-emerald-500/10',
      text: 'text-emerald-400',
      glow: 'shadow-emerald-500/5'
    },
    indigo: {
      border: 'border-indigo-500/20',
      bg: 'bg-indigo-500/10',
      text: 'text-indigo-400',
      glow: 'shadow-indigo-500/5'
    },
    amber: {
      border: 'border-amber-500/20',
      bg: 'bg-amber-500/10',
      text: 'text-amber-400',
      glow: 'shadow-amber-500/5'
    },
    purple: {
      border: 'border-purple-500/20',
      bg: 'bg-purple-500/10',
      text: 'text-purple-400',
      glow: 'shadow-purple-500/5'
    }
  };

  const scheme = colorMap[color] || colorMap.blue;

  return (
    <div className={`p-5 rounded-xl bg-slate-900/90 border ${scheme.border} shadow-lg ${scheme.glow} backdrop-blur-sm transition-all hover:border-slate-700`}>
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">{title}</p>
        <div className={`w-9 h-9 rounded-lg ${scheme.bg} flex items-center justify-center ${scheme.text}`}>
          {Icon && <Icon className="w-5 h-5" />}
        </div>
      </div>

      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-2xl font-bold text-white tracking-tight">{value}</span>
        {trend && (
          <span className="text-xs font-semibold text-emerald-400 flex items-center">
            {trend}
          </span>
        )}
      </div>

      {subtext && (
        <p className="mt-1 text-xs text-slate-400">{subtext}</p>
      )}
    </div>
  );
}
