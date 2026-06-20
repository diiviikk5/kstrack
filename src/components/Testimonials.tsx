import React from 'react';
import { motion } from 'framer-motion';

const EASE = [0.22, 1, 0.36, 1];

interface Testimonial {
  quote: string;
  author: string;
  role: string;
  company: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    quote: "“KsTracker gave our fund management team 12 hours of their week back. It acts like a trading desk from the future.”",
    author: "Parker Wilf",
    role: "Managing Partner",
    company: "MERCURY CAPITAL"
  },
  {
    quote: "“The automated Binance tracking alone has changed how we execute orders. I cannot imagine going back to manual sheet tracking.”",
    author: "Andrew von Rosenbach",
    role: "Quantitative Analyst",
    company: "COHERE CAPITAL"
  },
  {
    quote: "“Automated risk triage that actually calculates and resolves ROI with zero delay. Our traders stopped dreading volatile market opens.”",
    author: "Mathies Christensen",
    role: "Risk Manager",
    company: "LUNAR VENTURES"
  }
];

export const Testimonials: React.FC = () => {
  return (
    <section className="max-w-6xl mx-auto px-6 py-20 md:py-28 border-t border-white/10 relative z-10 select-none">
      <div className="grid md:grid-cols-3 gap-6">
        {TESTIMONIALS.map((t, i) => (
          <motion.figure
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, delay: i * 0.1, ease: EASE }}
            className="liquid-glass rounded-2xl p-6 bg-white/[0.01] flex flex-col justify-between"
          >
            <blockquote className="text-sm text-white/80 leading-[1.6] italic">
              {t.quote}
            </blockquote>
            
            <figcaption className="mt-6 pt-5 border-t border-white/10 flex flex-col">
              <span className="text-sm font-semibold text-white tracking-wide">{t.author}</span>
              <span className="text-xs text-white/50">{t.role}</span>
              <span className="mt-1 text-xs text-white font-semibold tracking-widest font-mono text-accent">
                {t.company}
              </span>
            </figcaption>
          </motion.figure>
        ))}
      </div>
    </section>
  );
};
