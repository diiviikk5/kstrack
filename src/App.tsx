import { useRef, useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { SignalForm } from './components/SignalForm';
import { SignalDashboard } from './components/SignalDashboard';

function App() {
  const dashboardRef = useRef<HTMLDivElement>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const scrollToDashboard = () => {
    dashboardRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSignalCreated = () => {
    // Incrementing key forces dashboard component to refresh its list
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="relative min-h-screen w-full overflow-y-auto overflow-x-hidden text-[#192837] flex flex-col font-sans select-none">
      {/* Background Video */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 z-0 w-full h-full object-cover pointer-events-none"
        src="/assets/hf_20260606_131516_eca35265-ea66-4fbd-8d52-22aae6e1a503.mp4"
      />

      {/* Backdrop Tint */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-transparent via-[#F2F2EE]/40 to-[#F2F2EE]/90 pointer-events-none" />

      {/* Main Container */}
      <div className="relative z-10 w-full flex-grow flex flex-col">
        {/* Navbar */}
        <Navbar onScrollToDashboard={scrollToDashboard} />

        {/* Hero Section */}
        <main className="flex-grow flex flex-col items-center justify-center py-8">
          <Hero onScrollToDashboard={scrollToDashboard} />
        </main>

        {/* Dashboard Section */}
        <section
          ref={dashboardRef}
          className="w-full relative z-10 px-5 sm:px-8 py-16 sm:py-24 bg-[#192837]/90 text-white"
        >
          {/* Subtle Grid Overlay for Tech Aesthetic */}
          <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

          <div className="relative z-10 max-w-6xl mx-auto flex flex-col gap-16">
            <div className="text-center">
              <h2 className="text-3xl sm:text-5xl font-black tracking-tight" style={{ fontFamily: 'var(--font-heading)' }}>
                Signal Operations Control
              </h2>
              <p className="mt-3 text-sm sm:text-base text-zinc-400 max-w-xl mx-auto">
                Issue Buy/Sell signals, enforce automated boundary risk checks, and track ROI resolution instantly in a secure unified terminal.
              </p>
            </div>

            <div className="flex flex-col lg:flex-row gap-8 items-start justify-center">
              {/* Left Column: Form */}
              <div className="w-full lg:w-fit shrink-0 flex justify-center">
                <SignalForm onSignalCreated={handleSignalCreated} />
              </div>

              {/* Right Column: Dashboard */}
              <div className="w-full flex-grow">
                <SignalDashboard key={refreshKey} />
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="w-full bg-[#121c27] text-zinc-500 py-8 px-5 border-t border-white/5 relative z-10">
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
            <p>© {new Date().getFullYear()} Ironclad Signals / KsTracker. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Binance API Terms</a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;
