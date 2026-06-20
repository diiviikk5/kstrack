import React from 'react';
import { motion } from 'framer-motion';
import { SectionEyebrow } from './SectionEyebrow';

const EASE = [0.22, 1, 0.36, 1];

export const FeatureTriage: React.FC = () => {
  return (
    <section className="max-w-6xl mx-auto px-6 py-20 md:py-28 relative z-10 select-none">
      <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-start">
        
        {/* Left Column: Copy */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: EASE }}
          className="flex flex-col items-start text-left"
        >
          <SectionEyebrow label="Risk Triage" tag="AI-native" />
          <h2 className="mt-5 text-3xl md:text-5xl font-semibold tracking-tight leading-[1.12] text-white">
            Clear the trading noise <br />
            in a single pass.
          </h2>
          <p className="mt-6 text-white/60 text-base leading-[1.6] max-w-md">
            KsTracker analyzes every market tick, filters out the noise, and highlights high-probability trading setups. Focus on execution — our automated risk-triage engine handles the validation.
          </p>
          
          {/* Chips */}
          <div className="mt-8 flex flex-wrap gap-2">
            {[
              'Auto-resolve ROI',
              'Binance Spot Sync',
              'Trailing Stop-Loss',
              'Instant Expiry Triage'
            ].map(chip => (
              <span
                key={chip}
                className="text-xs text-white/70 px-3 py-1.5 rounded-full border border-white/10 bg-white/[0.03]"
              >
                {chip}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Right Column: Interactive liquid-glass list card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, delay: 0.15, ease: EASE }}
          className="liquid-glass rounded-2xl p-5 bg-white/[0.01]"
        >
          <p className="text-xs text-white/50 font-mono tracking-wider uppercase">
            Today · 42 signals triaged
          </p>
          
          <div className="mt-4 space-y-3">
            {[
              {
                color: '#ffffff',
                title: 'Priority Active',
                count: 4,
                items: ['BTCUSDT — 65k Breakout Target', 'ETHUSDT — RSI Divergence Short']
              },
              {
                color: '#e5e5e5',
                title: 'Pending Trigger',
                count: 7,
                items: ['SOLUSDT — Local Crossover', 'BNBUSDT — Launchpool Surge']
              },
              {
                color: '#a3a3a3',
                title: 'Resolved Hits',
                count: 18,
                items: ['LINKUSDT — Target Hit (+8.2%)', 'ADAUSDT — Target Hit (+4.5%)']
              },
              {
                color: '#525252',
                title: 'Expired & Closed',
                count: 13,
                items: ['DOGEUSDT — Stop Loss Hit (-2.1%)', 'XRPUSDT — Expired Close (+0.8%)']
              }
            ].map(group => (
              <div key={group.title} className="liquid-glass rounded-lg p-3 bg-white/[0.02]">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: group.color }} />
                  <span className="text-sm font-semibold text-white tracking-wide">{group.title}</span>
                  <span className="text-xs text-white/40 font-mono">({group.count})</span>
                </div>
                <div className="mt-2 space-y-1">
                  {group.items.map(item => (
                    <p key={item} className="text-xs text-white/50 truncate font-mono tracking-wide pl-4">
                      {item}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  );
};
