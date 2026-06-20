import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { AppleButton } from './AppleButton';

const EASE = [0.22, 1, 0.36, 1];

interface FinalCTAProps {
  onNavigateToDashboard: () => void;
}

export const FinalCTA: React.FC<FinalCTAProps> = ({ onNavigateToDashboard }) => {
  return (
    <section className="max-w-6xl mx-auto px-6 py-20 md:py-32 relative z-10 select-none">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.8, ease: EASE }}
        className="liquid-glass relative overflow-hidden rounded-3xl px-8 py-16 md:py-24 text-center bg-white/[0.01]"
      >
        {/* Radial glow */}
        <div
          className="absolute inset-0 opacity-30 pointer-events-none"
          style={{
            background: 'radial-gradient(600px circle at 50% 0%, rgba(94,14,215,0.25), transparent 70%)',
          }}
        />

        {/* Content */}
        <div className="relative z-10">
          <h2 className="text-4xl md:text-6xl font-semibold tracking-tight leading-[1.05] text-white">
            Close the charts. <br />
            Secure your profit.
          </h2>
          
          <p className="mt-6 text-white/60 max-w-md mx-auto text-sm leading-[1.6] text-center">
            Join thousands of active traders, quant groups, and fund operators who treat risk like a science — not a guessing game.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
            <AppleButton label="Launch Operations Terminal" onClick={onNavigateToDashboard} />
            <button
              type="button"
              onClick={onNavigateToDashboard}
              className="group inline-flex items-center justify-center gap-2 rounded-full border border-white/15 text-white text-sm font-semibold uppercase tracking-wider px-5 py-3 hover:bg-white/5 transition-colors cursor-pointer"
            >
              <span>Talk to sales</span>
              <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-[1px]" />
            </button>
          </div>
        </div>
      </motion.div>
    </section>
  );
};
