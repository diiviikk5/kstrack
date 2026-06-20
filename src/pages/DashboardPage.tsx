import React, { useState, type CSSProperties } from 'react';
import { ArrowLeft } from 'lucide-react';
import { SignalForm } from '../components/SignalForm';
import { SignalDashboard } from '../components/SignalDashboard';

const VIDEO_URL = '/assets/hf_20260508_064122_c4750c0e-7476-4b44-94a2-a85a65c63bf2.mp4';

const gradientStyle: CSSProperties = {
  backgroundImage:
    'linear-gradient(to right, #091020 0%, #0B2551 12.5%, #A4F4FD 32.5%, #00d2ff 50%, #0B2551 67.5%, #091020 87.5%, #091020 100%)',
  backgroundSize: '200% auto',
  WebkitBackgroundClip: 'text',
  backgroundClip: 'text',
  color: 'transparent',
  WebkitTextFillColor: 'transparent',
  filter: 'url(#c3-noise)',
};

interface DashboardPageProps {
  onNavigateHome: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigateHome }) => {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleSignalCreated = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div
      className="relative min-h-screen w-full overflow-y-auto overflow-x-hidden text-white bg-[#0c0c0c] flex flex-col"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      {/* 1. Global background video */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover pointer-events-none opacity-20"
          src={VIDEO_URL}
        />
      </div>

      {/* 2. Fixed vertical guide lines */}
      <div className="hidden md:block pointer-events-none fixed inset-y-0 left-1/2 -translate-x-[calc(50%+36rem)] w-px bg-white/5 z-[5]" />
      <div className="hidden md:block pointer-events-none fixed inset-y-0 left-1/2 translate-x-[calc(-50%+36rem)] w-px bg-white/5 z-[5]" />

      {/* 3. Tech Grid Overlay */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#ffffff01_1px,transparent_1px),linear-gradient(to_bottom,#ffffff01_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      {/* 4. Root SVG noise filter (c3-noise) */}
      <svg className="absolute w-0 h-0" aria-hidden="true">
        <filter id="c3-noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.35 0"
          />
          <feComposite in2="SourceGraphic" operator="in" result="noise" />
          <feBlend in="SourceGraphic" in2="noise" mode="multiply" />
        </filter>
      </svg>

      {/* Header Bar */}
      <header className="relative z-10 flex items-center justify-between px-5 py-4 sm:px-8 md:px-12 border-b border-white/10 bg-black/40 backdrop-blur-xl">
        {/* Left: Logo + title */}
        <div className="flex items-center gap-4">
          <div className="flex h-7 w-7 items-center justify-center rounded-full border border-white/20">
            <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
          </div>
          <span className="text-xs sm:text-sm font-bold uppercase tracking-widest text-zinc-300">
            Operations Terminal
          </span>
        </div>

        {/* Right: Back button */}
        <button
          type="button"
          onClick={onNavigateHome}
          className="flex items-center gap-2 text-xs sm:text-sm font-semibold uppercase tracking-widest text-white/70 hover:text-white transition-all duration-300 cursor-pointer bg-white/5 border border-white/10 hover:bg-white/10 px-4 py-2.5 rounded-full backdrop-blur-md"
        >
          <ArrowLeft size={16} />
          <span>Exit Terminal</span>
        </button>
      </header>

      {/* Workspace Grid */}
      <main className="relative z-10 flex-grow max-w-7xl w-full mx-auto px-5 py-12 sm:px-8 md:px-12 flex flex-col gap-10">
        <div className="text-center md:text-left flex flex-col gap-2">
          <h1 className="text-4xl sm:text-6xl font-semibold tracking-tight leading-[1.05]">
            <span className="block text-white">Signal Operations</span>
            <span className="block animate-shiny" style={gradientStyle}>
              Control Terminal
            </span>
          </h1>
          <p className="mt-4 text-white/60 max-w-2xl text-sm sm:text-base leading-[1.5]">
            Issue Buy/Sell signals, enforce automated boundary risk checks, and track ROI resolution instantly in a secure, high-performance unified terminal.
          </p>
        </div>

        <div className="flex flex-col xl:flex-row gap-8 items-start justify-center">
          {/* Left Column: Form */}
          <div className="w-full xl:w-fit shrink-0 flex justify-center">
            <SignalForm onSignalCreated={handleSignalCreated} />
          </div>

          {/* Right Column: Dashboard */}
          <div className="w-full flex-grow">
            <SignalDashboard key={refreshKey} />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full bg-black/40 backdrop-blur-xl border-t border-white/10 py-6 px-5 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-semibold uppercase tracking-wider text-white/40">
          <p>© {new Date().getFullYear()} KsTracker. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Binance API Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default DashboardPage;
