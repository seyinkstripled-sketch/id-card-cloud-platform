'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: string;
  isPositive?: boolean;
  icon: LucideIcon;
  colorScheme?: 'emerald' | 'blue' | 'amber' | 'purple' | 'rose';
}

const colorStyles = {
  emerald: {
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
    ring: 'focus:ring-emerald-500',
  },
  blue: {
    bg: 'bg-blue-500/10',
    text: 'text-blue-700',
    border: 'border-blue-200',
    ring: 'focus:ring-blue-500',
  },
  amber: {
    bg: 'bg-amber-500/10',
    text: 'text-amber-700',
    border: 'border-amber-200',
    ring: 'focus:ring-amber-500',
  },
  purple: {
    bg: 'bg-purple-500/10',
    text: 'text-purple-700',
    border: 'border-purple-200',
    ring: 'focus:ring-purple-500',
  },
  rose: {
    bg: 'bg-rose-500/10',
    text: 'text-rose-700',
    border: 'border-rose-200',
    ring: 'focus:ring-rose-500',
  },
};

export default function StatsCard({
  title,
  value,
  change,
  isPositive = true,
  icon: Icon,
  colorScheme = 'emerald',
}: StatsCardProps) {
  const styles = colorStyles[colorScheme];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{title}</p>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">{value}</p>
        </div>
        <div className={`p-3 rounded-xl ${styles.bg} ${styles.text}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
      {change && (
        <div className="mt-3 flex items-center text-xs">
          <span
            className={`font-semibold ${
              isPositive ? 'text-emerald-600' : 'text-rose-600'
            }`}
          >
            {change}
          </span>
          <span className="text-slate-500 ml-1.5">vs previous cycle</span>
        </div>
      )}
    </div>
  );
}
