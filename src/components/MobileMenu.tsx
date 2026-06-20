import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Logo } from './Logo';

export const NAV_LINKS = ['Signals', 'Binance Price', 'Stats', 'Documentation', 'Support'] as const;

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
  onScrollToDashboard?: () => void;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({ open, onClose, onScrollToDashboard }) => {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            className="fixed inset-0 z-40"
            style={{
              background: 'rgba(25,40,55,0.35)',
              backdropFilter: 'blur(4px)',
              WebkitBackdropFilter: 'blur(4px)',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
          />

          {/* Sheet */}
          <motion.aside
            key="sheet"
            className="fixed top-0 right-0 z-50 flex flex-col"
            style={{
              width: 'min(88vw, 360px)',
              height: '100dvh',
              background: '#CFC8C5',
              boxShadow: '-12px 0 48px rgba(25,40,55,0.18)',
            }}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{
              animate: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
              exit: { duration: 0.35, ease: [0.55, 0, 1, 0.45] }
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5">
              <Logo fillColor="var(--color-text)" />
              <motion.button
                whileTap={{ scale: 0.9 }}
                className="flex items-center justify-center rounded-full"
                style={{
                  width: 40,
                  height: 40,
                  background: 'rgba(25,40,55,0.1)',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--color-text)',
                }}
                onClick={onClose}
                aria-label="Close menu"
              >
                <X size={20} />
              </motion.button>
            </div>

            {/* Divider */}
            <div
              style={{
                height: 1,
                background: 'rgba(25,40,55,0.12)',
                margin: '0 24px',
              }}
            />

            {/* Nav Links */}
            <nav className="flex flex-col gap-1 px-4 py-6">
              {NAV_LINKS.map((link, i) => (
                <motion.a
                  key={link}
                  href="#"
                  className="rounded-xl px-4 py-3 font-medium transition-colors hover:bg-black/10"
                  style={{
                    fontSize: '1.1rem',
                    color: 'var(--color-text)',
                  }}
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.18 + i * 0.07, duration: 0.4 }}
                  onClick={(e) => {
                    e.preventDefault();
                    onClose();
                    if (link === 'Signals' && onScrollToDashboard) {
                      onScrollToDashboard();
                    }
                  }}
                >
                  {link}
                </motion.a>
              ))}
            </nav>

            {/* CTA Buttons */}
            <div className="mt-auto flex flex-col gap-3 px-6 pb-8">
              <button
                type="button"
                className="w-full py-3.5 rounded-full font-semibold text-white transition-all active:scale-95 hover:brightness-110"
                style={{
                  backgroundColor: '#7342E2',
                  fontSize: '0.95rem',
                  border: 'none',
                  cursor: 'pointer',
                }}
                onClick={() => {
                  onClose();
                  if (onScrollToDashboard) onScrollToDashboard();
                }}
              >
                Launch App
              </button>
              <button
                type="button"
                className="w-full py-3.5 rounded-full font-semibold transition-all active:scale-95 hover:shadow-md"
                style={{
                  backgroundColor: '#F2F2EE',
                  color: 'var(--color-text)',
                  fontSize: '0.95rem',
                  border: 'none',
                  cursor: 'pointer',
                }}
                onClick={onClose}
              >
                Sign In
              </button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};
