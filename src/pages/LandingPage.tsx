import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, X } from 'lucide-react';
import { NAV_LINKS } from '../constants';

const VIDEO_URL =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzzbokvigwjottwixh07lwa1p/hf_20260517_222138_3e3205be-3364-417b-a64a-bfe087acbec4.mp4";
const EASE = [0.22, 1, 0.36, 1];
const HEADING_WORDS = ["Fearless", "Signals", "Delivered"];

const STATS = [
  { value: "300%", label: "Avg\nROI" },
  { value: "200k", label: "Active\nTraders" },
  { value: "100m", label: "Signals\nTracked" },
];

const fadeDown = {
  hidden: { opacity: 0, y: -20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: EASE },
  }),
};

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.6, ease: EASE },
  }),
};

interface LandingPageProps {
  onNavigateToDashboard: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigateToDashboard }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div
      className="relative flex min-h-screen flex-col overflow-hidden text-black bg-white select-none"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      {/* Background Video */}
      <video
        className="pointer-events-none absolute inset-0 h-full w-full object-cover z-0"
        src={VIDEO_URL}
        autoPlay
        loop
        muted
        playsInline
        aria-hidden="true"
        tabIndex={-1}
      />

      {/* Foreground Container */}
      <div className="relative z-10 flex min-h-screen flex-col justify-between">
        
        {/* Navigation Bar (Zone 1) */}
        <header className="flex items-center justify-between px-5 pt-5 sm:px-8 md:px-12 md:pt-6">
          {/* Left: Logo */}
          <motion.div
            variants={fadeDown}
            initial="hidden"
            animate="visible"
            custom={0}
            className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-accent cursor-pointer"
            onClick={() => window.location.reload()}
          >
            <span className="h-2.5 w-2.5 rounded-full bg-accent" />
          </motion.div>

          {/* Center: Desktop Nav */}
          <nav className="hidden items-center gap-10 md:flex">
            {NAV_LINKS.map((link, i) => (
              <motion.a
                key={link}
                href={`#${link.toLowerCase()}`}
                variants={fadeDown}
                initial="hidden"
                animate="visible"
                custom={i + 1}
                className="text-sm font-semibold uppercase tracking-widest text-black hover:text-accent transition-colors"
                onClick={(e) => {
                  e.preventDefault();
                  if (link === 'Signals' || link === 'Terminal') {
                    onNavigateToDashboard();
                  }
                }}
              >
                {link}
              </motion.a>
            ))}
          </nav>

          {/* Right: Hamburger button */}
          <motion.button
            type="button"
            variants={fadeDown}
            initial="hidden"
            animate="visible"
            custom={5}
            onClick={() => setMenuOpen(true)}
            className="flex h-9 w-9 flex-col items-center justify-center gap-1 rounded-full bg-black hover:bg-zinc-800 transition-all cursor-pointer"
            aria-label="Open menu"
            aria-expanded={menuOpen}
          >
            <span className="h-0.5 w-4 bg-white" />
            <span className="h-0.5 w-4 bg-white" />
            <span className="h-0.5 w-4 bg-white" />
          </motion.button>
        </header>

        {/* Stats Row (Zone 2) */}
        <section className="flex flex-1 items-center justify-end px-5 py-8 sm:px-8 md:px-12 md:py-0">
          <div className="flex items-center gap-5 sm:gap-8 md:gap-10">
            {STATS.map((stat, i) => {
              return (
                <motion.div
                  key={stat.label}
                  variants={fadeUp}
                  initial="hidden"
                  animate="visible"
                  custom={i + 2}
                  className="text-right flex flex-col items-end"
                >
                  <span className="font-semibold text-black leading-none" style={{ fontSize: "clamp(1.5rem, 5vw, 3.5rem)" }}>
                    <span className="text-accent inline-block align-super" style={{ fontSize: "0.55em", marginRight: '2px' }}>+</span>
                    {stat.value.replace('+', '')}
                  </span>
                  <p className="mt-1 whitespace-pre-line text-[10px] font-semibold uppercase leading-tight tracking-widest text-black sm:text-xs md:text-sm">
                    {stat.label}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* Bottom Section (Zone 3) */}
        <footer className="flex flex-col gap-6 px-5 pb-8 sm:px-8 md:gap-12 md:px-12 md:pb-12">
          {/* Row A — Tagline + CTA */}
          <div className="flex items-center justify-between gap-4">
            <motion.p
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={5}
              className="max-w-[130px] text-[10px] font-semibold uppercase tracking-widest text-black sm:max-w-[160px] sm:text-xs md:max-w-xs md:text-sm"
            >
              Shaping Bold<br />Visions Into ROI<br />For Your Portfolio
            </motion.p>

            <motion.button
              type="button"
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={6}
              onClick={onNavigateToDashboard}
              className="flex items-center gap-1 sm:gap-2 text-base sm:text-xl md:text-2xl font-semibold uppercase tracking-widest text-accent hover:opacity-80 transition-opacity cursor-pointer whitespace-nowrap bg-transparent border-none p-0"
            >
              <span>Launch Terminal</span>
              <ArrowUpRight className="h-[18px] w-[18px] sm:h-[22px] sm:w-[22px]" />
            </motion.button>
          </div>

          {/* Row B — Description + Main Heading */}
          <div className="flex items-end justify-between gap-3 sm:gap-4 border-t border-black/10 pt-6 sm:pt-8">
            {/* Description */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={7}
              className="w-[120px] shrink-0 sm:w-[180px] md:w-[280px]"
            >
              <p className="text-left text-[9px] font-semibold uppercase tracking-widest leading-relaxed text-black sm:text-xs md:text-right md:text-sm">
                High-Performance Trading Terminal Built Around Elevating Your Signals Into Striking ROI
              </p>
            </motion.div>

            {/* Main Stacked Heading */}
            <h1
              className="text-right font-semibold uppercase text-black"
              style={{ fontSize: "clamp(2rem, 9vw, 9rem)", lineHeight: 0.88 }}
            >
              {HEADING_WORDS.map((word, i) => (
                <span key={word} className="block overflow-hidden">
                  <motion.span
                    className="block"
                    initial={{ y: "110%" }}
                    animate={{ y: 0 }}
                    transition={{ delay: 0.4 + i * 0.14, duration: 0.7, ease: EASE }}
                  >
                    {word}
                  </motion.span>
                </span>
              ))}
            </h1>
          </div>
        </footer>

      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, y: '-10%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '-10%' }}
            transition={{ duration: 0.35, ease: EASE }}
            className="fixed inset-0 z-50 flex flex-col bg-white px-5 pb-8 pt-5 sm:px-8 md:px-12 md:pt-6"
          >
            {/* Top row */}
            <div className="flex items-center justify-between">
              <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-accent">
                <span className="h-2.5 w-2.5 rounded-full bg-accent" />
              </div>

              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-black cursor-pointer"
                aria-label="Close menu"
              >
                <X size={18} className="text-white" />
              </button>
            </div>

            {/* Nav list */}
            <nav className="mt-16 flex flex-col gap-8">
              {NAV_LINKS.map((link) => (
                <a
                  key={link}
                  href={`#${link.toLowerCase()}`}
                  className="text-3xl font-semibold uppercase tracking-widest text-black hover:text-accent transition-colors"
                  onClick={(e) => {
                    e.preventDefault();
                    setMenuOpen(false);
                    if (link === 'Signals' || link === 'Terminal') {
                      onNavigateToDashboard();
                    }
                  }}
                >
                  {link}
                </a>
              ))}
            </nav>

            {/* Bottom CTA */}
            <div className="mt-auto">
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  onNavigateToDashboard();
                }}
                className="flex items-center gap-2 text-xl font-semibold uppercase tracking-widest text-accent hover:opacity-80 transition-opacity bg-transparent border-none p-0 cursor-pointer"
              >
                <span>Launch Terminal</span>
                <ArrowUpRight size={20} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
