import React from 'react';

interface SectionEyebrowProps {
  label: string;
  tag?: string;
}

export const SectionEyebrow: React.FC<SectionEyebrowProps> = ({ label, tag }) => {
  return (
    <div className="inline-flex items-center gap-2.5">
      <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
      <span className="text-sm font-medium text-white/80 uppercase tracking-widest">{label}</span>
      {tag && (
        <span className="text-xs px-2 py-0.5 rounded-full border border-white/10 text-white/50 uppercase tracking-wide">
          {tag}
        </span>
      )}
    </div>
  );
};
