import React from 'react';
import { motion } from 'framer-motion';
import { Menu } from 'lucide-react';
import { LogoMark } from './LogoMark';
import { AppleButton } from './AppleButton';
import { NAV_LINKS } from '../constants';

interface NavbarProps {
  onNavigateToDashboard: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigateToDashboard }) => {
  return (
    <motion.nav
      className="relative z-20"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Left: LogoMark only */}
        <a href="#" aria-label="KsTracker home" onClick={(e) => { e.preventDefault(); window.location.reload(); }}>
          <LogoMark className="w-8 h-8 hover:opacity-80 transition-opacity" />
        </a>

        {/* Center: Desktop Links */}
        <div className="hidden md:flex gap-8">
          {NAV_LINKS.map((link, i) => (
            <motion.a
              key={link}
              href={`#${link.toLowerCase()}`}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 + i * 0.05, ease: 'easeOut' }}
              className="text-white/70 text-sm font-medium hover:text-white transition-colors uppercase tracking-wider"
              onClick={(e) => {
                e.preventDefault();
                if (link === 'Terminal') {
                  onNavigateToDashboard();
                }
              }}
            >
              {link}
            </motion.a>
          ))}
        </div>

        {/* Right: Desktop CTA */}
        <div className="hidden md:block">
          <AppleButton label="Launch Terminal" onClick={onNavigateToDashboard} />
        </div>

        {/* Mobile menu trigger */}
        <button
          type="button"
          onClick={onNavigateToDashboard}
          className="md:hidden w-10 h-10 rounded-full border border-white/10 bg-white/5 inline-flex items-center justify-center cursor-pointer hover:bg-white/10 active:scale-95 transition-all"
          aria-label="Open terminal"
        >
          <Menu className="w-4 h-4 text-white" />
        </button>
      </div>
    </motion.nav>
  );
};
