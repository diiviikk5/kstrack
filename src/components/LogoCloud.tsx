import React from 'react';
import { motion } from 'framer-motion';

export const LogoCloud: React.FC = () => {
  const partners = [
    'Binance',
    'Coinbase',
    'Kraken',
    'dYdX',
    'Uniswap',
    'Bybit',
    'OKX',
    'MetaMask'
  ];

  return (
    <section className="max-w-6xl mx-auto px-6 py-16 md:py-20 relative z-10 select-none">
      <p className="text-center text-xs uppercase tracking-widest text-white/40 font-semibold">
        Integrating live spot data across premier liquidity platforms
      </p>
      
      <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-6 justify-items-center items-center">
        {partners.map((name, i) => (
          <motion.span
            key={name}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5, delay: i * 0.05, ease: 'easeOut' }}
            className="text-center text-sm font-semibold tracking-tight text-white/50 hover:text-white transition-colors cursor-default uppercase tracking-widest font-mono"
          >
            {name}
          </motion.span>
        ))}
      </div>
    </section>
  );
};
