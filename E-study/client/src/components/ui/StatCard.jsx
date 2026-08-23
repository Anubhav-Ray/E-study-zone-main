import React from 'react';
import { Card } from './Card';
import { TrendingUp, TrendingDown } from 'lucide-react';

export const StatCard = ({
  icon: Icon,
  title,
  value,
  delta,
  deltaType = 'increase', // 'increase' | 'decrease' | 'neutral'
  color = 'indigo', // 'indigo' | 'pink' | 'emerald' | 'amber' | 'blue' | 'purple'
  subtitle,
  className = ''
}) => {
  const colorMap = {
    indigo: {
      bg: 'bg-indigo-500/15',
      text: 'text-indigo-400',
      border: 'border-indigo-500/30',
      glow: 'hover:shadow-indigo-500/10'
    },
    pink: {
      bg: 'bg-pink-500/15',
      text: 'text-pink-400',
      border: 'border-pink-500/30',
      glow: 'hover:shadow-pink-500/10'
    },
    emerald: {
      bg: 'bg-emerald-500/15',
      text: 'text-emerald-400',
      border: 'border-emerald-500/30',
      glow: 'hover:shadow-emerald-500/10'
    },
    amber: {
      bg: 'bg-amber-500/15',
      text: 'text-amber-400',
      border: 'border-amber-500/30',
      glow: 'hover:shadow-amber-500/10'
    },
    blue: {
      bg: 'bg-blue-500/15',
      text: 'text-blue-400',
      border: 'border-blue-500/30',
      glow: 'hover:shadow-blue-500/10'
    },
    purple: {
      bg: 'bg-purple-500/15',
      text: 'text-purple-400',
      border: 'border-purple-500/30',
      glow: 'hover:shadow-purple-500/10'
    }
  };

  const scheme = colorMap[color] || colorMap.indigo;

  return (
    <Card className={`p-5 group transition-all duration-300 ${scheme.glow} ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <div className={`p-2.5 rounded-xl border ${scheme.bg} ${scheme.border} ${scheme.text} group-hover:scale-110 transition-transform duration-300`}>
          {Icon && <Icon className="w-5 h-5" />}
        </div>
        {delta && (
          <span
            className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${
              deltaType === 'increase'
                ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                : deltaType === 'decrease'
                ? 'bg-red-500/15 text-red-300 border border-red-500/30'
                : 'bg-zinc-800 text-zinc-400'
            }`}
          >
            {deltaType === 'increase' ? (
              <TrendingUp className="w-3 h-3" />
            ) : deltaType === 'decrease' ? (
              <TrendingDown className="w-3 h-3" />
            ) : null}
            {delta}
          </span>
        )}
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">{title}</p>
        <p className="text-3xl font-extrabold text-zinc-100 mt-1 tracking-tight">{value ?? 0}</p>
        {subtitle && <p className="text-xs text-zinc-500 mt-1">{subtitle}</p>}
      </div>
    </Card>
  );
};

export default StatCard;
