import React from 'react';
import { Navbar } from '../components/Navbar';
import { Hero } from '../components/Hero';
import { MenuBar } from '../components/MenuBar';
import { InboxMockup } from '../components/InboxMockup';
import { FeatureTriage } from '../components/FeatureTriage';
import { LogoCloud } from '../components/LogoCloud';
import { Testimonials } from '../components/Testimonials';
import { Pricing } from '../components/Pricing';
import { FinalCTA } from '../components/FinalCTA';

const VIDEO_URL =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzzbokvigwjottwixh07lwa1p/hf_20260508_064122_c4750c0e-7476-4b44-94a2-a85a65c63bf2.mp4';

interface LandingPageProps {
  onNavigateToDashboard: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigateToDashboard }) => {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#0c0c0c] text-white">
      {/* 1. Global background video (fixed, behind everything) */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover pointer-events-none opacity-40"
          src={VIDEO_URL}
        />
      </div>

      {/* 2. Fixed vertical guide lines */}
      <div className="hidden md:block pointer-events-none fixed inset-y-0 left-1/2 -translate-x-[calc(50%+36rem)] w-px bg-white/10 z-[5]" />
      <div className="hidden md:block pointer-events-none fixed inset-y-0 left-1/2 translate-x-[calc(-50%+36rem)] w-px bg-white/10 z-[5]" />

      {/* 3. Root SVG noise filter (c3-noise) */}
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

      {/* 4. Content wrapper */}
      <div className="relative z-10 flex flex-col">
        <Navbar onNavigateToDashboard={onNavigateToDashboard} />
        
        <main className="flex-grow flex flex-col">
          <Hero onNavigateToDashboard={onNavigateToDashboard} />
          <MenuBar />
          <InboxMockup onNavigateToDashboard={onNavigateToDashboard} />
          <FeatureTriage />
          <LogoCloud />
          <Testimonials />
          <Pricing />
          <FinalCTA onNavigateToDashboard={onNavigateToDashboard} />
        </main>
      </div>
    </div>
  );
};
export default LandingPage;
