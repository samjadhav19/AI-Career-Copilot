import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  badge?: string;
  colorScheme?: 'purple' | 'emerald' | 'indigo' | 'amber';
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  badge,
  colorScheme = 'purple',
  onClick,
}) => {
  const styles = {
    purple: {
      iconBg: 'bg-purple-50 text-purple-600',
      borderHover: 'hover:border-purple-200',
      badge: 'bg-purple-100 text-purple-700',
    },
    emerald: {
      iconBg: 'bg-emerald-50 text-emerald-600',
      borderHover: 'hover:border-emerald-200',
      badge: 'bg-emerald-100 text-emerald-700',
    },
    indigo: {
      iconBg: 'bg-indigo-50 text-indigo-600',
      borderHover: 'hover:border-indigo-200',
      badge: 'bg-indigo-100 text-indigo-700',
    },
    amber: {
      iconBg: 'bg-amber-50 text-amber-600',
      borderHover: 'hover:border-amber-200',
      badge: 'bg-amber-100 text-amber-700',
    },
  }[colorScheme];

  return (
    <div
      onClick={onClick}
      className={`relative p-5 bg-white rounded-2xl border border-slate-100 shadow-xs transition-all duration-200 ${
        onClick ? 'cursor-pointer hover:-translate-y-0.5 hover:shadow-md ' + styles.borderHover : ''
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{title}</p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-slate-900">{value}</span>
            {badge && (
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${styles.badge}`}>
                {badge}
              </span>
            )}
          </div>
          {subtitle && <p className="text-xs text-slate-500 font-medium">{subtitle}</p>}
        </div>

        <div className={`p-3 rounded-xl ${styles.iconBg}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
};
