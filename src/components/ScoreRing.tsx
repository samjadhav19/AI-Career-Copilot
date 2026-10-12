import React from 'react';

interface ScoreRingProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  sublabel?: string;
  colorScheme?: 'purple' | 'emerald' | 'indigo' | 'amber';
}

export const ScoreRing: React.FC<ScoreRingProps> = ({
  score,
  size = 120,
  strokeWidth = 10,
  label,
  sublabel,
  colorScheme = 'purple',
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (Math.min(100, Math.max(0, score)) / 100) * circumference;

  const colorMap = {
    purple: {
      stroke: 'url(#purpleGrad)',
      bg: '#EDE9FE',
      text: 'text-purple-600',
    },
    emerald: {
      stroke: 'url(#emeraldGrad)',
      bg: '#D1FAE5',
      text: 'text-emerald-600',
    },
    indigo: {
      stroke: 'url(#indigoGrad)',
      bg: '#E0E7FF',
      text: 'text-indigo-600',
    },
    amber: {
      stroke: 'url(#amberGrad)',
      bg: '#FEF3C7',
      text: 'text-amber-600',
    },
  };

  const scheme = colorMap[colorScheme];

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          <defs>
            <linearGradient id="purpleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8B5CF6" />
              <stop offset="100%" stopColor="#6D28D9" />
            </linearGradient>
            <linearGradient id="emeraldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10B981" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>
            <linearGradient id="indigoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6366F1" />
              <stop offset="100%" stopColor="#4338CA" />
            </linearGradient>
            <linearGradient id="amberGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#D97706" />
            </linearGradient>
          </defs>
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={scheme.bg}
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={scheme.stroke}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-2xl font-bold tracking-tight text-slate-800">
            {score}
            <span className="text-xs text-slate-400 font-normal">%</span>
          </span>
          {sublabel && <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">{sublabel}</span>}
        </div>
      </div>
      {label && <span className="mt-2 text-xs font-semibold text-slate-600">{label}</span>}
    </div>
  );
};
