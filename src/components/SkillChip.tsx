import React from 'react';
import { X, Check } from 'lucide-react';

interface SkillChipProps {
  label: string;
  matched?: boolean;
  onRemove?: () => void;
  onClick?: () => void;
  selected?: boolean;
}

export const SkillChip: React.FC<SkillChipProps> = ({
  label,
  matched,
  onRemove,
  onClick,
  selected,
}) => {
  return (
    <span
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-all ${
        selected
          ? 'bg-purple-600 text-white shadow-xs'
          : matched
          ? 'bg-purple-50 text-purple-700 border border-purple-200/60'
          : 'bg-slate-100 text-slate-700 border border-slate-200/50 hover:bg-slate-200/70'
      } ${onClick ? 'cursor-pointer' : ''}`}
    >
      {matched && <Check className="w-3 h-3 text-purple-600" />}
      <span>{label}</span>
      {onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="p-0.5 hover:bg-slate-300/60 rounded text-slate-500 hover:text-slate-800"
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </span>
  );
};
