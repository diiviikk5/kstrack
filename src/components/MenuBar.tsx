import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { AppleLogo } from './AppleLogo';

export const MenuBar: React.FC = () => {
  const [timeStr, setTimeStr] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const date = new Date();
      // Format: Wed May 6 1:09 PM
      const formatted = date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });
      // Replace comma after day to match brief format "Wed May 6 1:09 PM"
      setTimeStr(formatted.replace(',', ''));
    };

    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  function menuItemVisibility(index: number): string {
    if (index > 3) return 'hidden md:inline';
    if (index > 2) return 'hidden sm:inline';
    return '';
  }

  const menuItems = ['File', 'Edit', 'View', 'Go', 'Window', 'Help'];

  return (
    <motion.div
      className="h-10 bg-black/40 backdrop-blur-md border-t border-b border-white/10 relative z-10 flex items-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.9, ease: 'easeOut' }}
    >
      <div className="w-full max-w-6xl mx-auto px-6 flex items-center justify-between text-xs text-white/70 select-none">
        {/* Left menu group */}
        <div className="flex items-center gap-4">
          <AppleLogo className="w-3.5 h-3.5 text-white/80" />
          <span className="font-bold text-white tracking-wide">KsTracker</span>
          <div className="flex items-center gap-4">
            {menuItems.map((item, idx) => (
              <span
                key={item}
                className={`${menuItemVisibility(idx)} hover:text-white transition-colors cursor-pointer`}
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* Right menu group */}
        <div className="flex items-center gap-3">
          <Search className="w-3.5 h-3.5 cursor-pointer hover:text-white transition-colors" />
          <span className="font-medium tracking-wide">{timeStr || 'Wed May 6 1:09 PM'}</span>
        </div>
      </div>
    </motion.div>
  );
};
