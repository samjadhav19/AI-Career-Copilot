import React from 'react';

interface ProgressItem {
  label: string;
  value: number; // 0-100
  color: string; // e.g. 'bg-purple-600'
  tip?: string;
}

interface ProgressCardProps {
  title: string;
  items: ProgressItem[];
}

export const ProgressCard: React.FC<ProgressCardProps> = ({ title, items }) => {
  return (
    <div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-slate-800 tracking-tight">{title}</h3>
        <span className="text-xs text-slate-400 font-medium">Interview Readiness</span>
      </div>

      <div className="space-y-4">
        {items.map((item, idx) => (
          <div key={idx} className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-700">{item.label}</span>
              <span className="font-bold text-slate-900">{item.value}%</span>
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ease-out ${item.color}`}
                style={{ width: `${Math.min(100, Math.max(0, item.value))}%` }}
              />
            </div>
            {item.tip && <p className="text-[11px] text-slate-400">{item.tip}</p>}
          </div>
        ))}
      </div>
    </div>
  );
};
