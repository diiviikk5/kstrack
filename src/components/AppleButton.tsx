import React from 'react';
import { ChevronRight } from 'lucide-react';
import { AppleLogo } from './AppleLogo';

interface AppleButtonProps {
  label?: string;
  full?: boolean;
  onClick?: () => void;
}

export const AppleButton: React.FC<AppleButtonProps> = ({
  label = 'Download KsTracker',
  full = false,
  onClick,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group inline-flex items-center justify-center gap-2 rounded-full bg-white text-black font-medium text-sm px-5 py-3 transition-all hover:bg-white/90 active:scale-[0.98] cursor-pointer ${
        full ? 'w-full' : ''
      }`}
    >
      <AppleLogo />
      <span>{label}</span>
      <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-[1px]" />
    </button>
  );
};
