import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { SignalForm } from '../components/SignalForm';
import { SignalDashboard } from '../components/SignalDashboard';

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
      className="relative min-h-screen w-full overflow-y-auto overflow-x-hidden text-white bg-[#192837] flex flex-col"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      {/* Tech Grid Overlay */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      {/* Glow effect */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#5E0ED7]/10 rounded-full blur-[120px] pointer-events-none z-0" />

      {/* Header Bar */}
      <header className="relative z-10 flex items-center justify-between px-5 py-4 sm:px-8 md:px-12 border-b border-white/5 bg-[#121c27]">
        {/* Left: Logo + title */}
        <div className="flex items-center gap-4">
          <div className="flex h-7 w-7 items-center justify-center rounded-full border border-accent">
            <span className="h-2 w-2 rounded-full bg-accent" />
          </div>
          <span className="text-xs sm:text-sm font-bold uppercase tracking-widest text-zinc-300">
            Operations Terminal
          </span>
        </div>

        {/* Right: Back button */}
        <button
          type="button"
          onClick={onNavigateHome}
          className="flex items-center gap-2 text-xs sm:text-sm font-semibold uppercase tracking-widest text-zinc-400 hover:text-white transition-colors cursor-pointer bg-transparent border-none p-0"
        >
          <ArrowLeft size={16} />
          <span>Exit Terminal</span>
        </button>
      </header>

      {/* Workspace Grid */}
      <main className="relative z-10 flex-grow max-w-7xl w-full mx-auto px-5 py-12 sm:px-8 md:px-12 flex flex-col gap-10">
        <div>
          <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white leading-tight">
            Signal Operations Control
          </h1>
          <p className="mt-2 text-sm sm:text-base text-zinc-400 max-w-xl">
            Issue Buy/Sell signals, enforce automated boundary risk checks, and track ROI resolution instantly in a secure unified terminal.
          </p>
        </div>

        <div className="flex flex-col xl:flex-row gap-8 items-start justify-center">
          {/* Left Column: Form */}
          <div className="w-full xl:w-fit shrink-0 flex justify-center">
            {/* We will customize the form to use the new deep purple accent */}
            <SignalForm onSignalCreated={handleSignalCreated} />
          </div>

          {/* Right Column: Dashboard */}
          <div className="w-full flex-grow">
            <SignalDashboard key={refreshKey} />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full bg-[#121c27] text-zinc-500 py-6 px-5 border-t border-white/5 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-semibold uppercase tracking-wider">
          <p>© {new Date().getFullYear()} Fearless Signals / KsTracker. All rights reserved.</p>
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
