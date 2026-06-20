import React, { useState } from 'react';

interface PricingPlan {
  name: string;
  monthlyPrice: string;
  yearlyPrice: string;
  desc: string;
  features: string[];
  pro: boolean;
}

const PLANS: PricingPlan[] = [
  {
    name: 'Free',
    monthlyPrice: 'Free',
    yearlyPrice: 'Free',
    desc: 'For beginner traders exploring spot setups and building their first models.',
    features: [
      'Up to 3 active signals',
      'Standard spot pair tracking',
      'Basic risk validation',
      '15-second manual dashboard refresh',
      'Local database fallback'
    ],
    pro: false
  },
  {
    name: 'Standard',
    monthlyPrice: '$19/m',
    yearlyPrice: '$190/y',
    desc: 'For active traders seeking automated spot tracking and immediate execution.',
    features: [
      'Up to 50 active signals',
      'Automatic Binance price tracking',
      'Real-time resolution triggers',
      'Trailing stop-loss checking',
      'Access to advanced altcoin pairs'
    ],
    pro: false
  },
  {
    name: 'Pro',
    monthlyPrice: '$99/m',
    yearlyPrice: '$990/y',
    desc: 'For fund managers, trading groups, and professional quantitative strategies.',
    features: [
      'Unlimited active signals',
      'Direct Binance API execution link',
      'Sub-second websocket price tracking',
      'Custom trailing margin risk controls',
      'Full Firestore cloud database integration'
    ],
    pro: true
  }
];

export const Pricing: React.FC = () => {
  const [yearly, setYearly] = useState(false);

  return (
    <section className="c3-pricing-section select-none">
      {/* Fractal Noise overlay svg */}
      <svg className="absolute w-0 h-0" aria-hidden="true">
        <filter id="c3-noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.5" numOctaves="2" stitchTiles="stitch" />
          <feComponentTransfer>
            <feFuncA type="linear" slope="0.075" />
          </feComponentTransfer>
          <feComposite in2="SourceGraphic" operator="in" result="noise" />
          <feBlend in="SourceGraphic" in2="noise" mode="overlay" />
        </filter>
      </svg>

      {/* Watermark Kicker (Giant Backdrop) */}
      <div className="c3-watermark-container">
        <div className="c3-watermark-main select-none pointer-events-none">
          <span className="c3-watermark-line-1">Your signals.</span>
          <span className="c3-watermark-line-2">Revitalized</span>
        </div>
      </div>

      {/* Yearly Toggle Switch */}
      <div className="c3-toggle-wrap">
        <span className="text-sm font-semibold uppercase tracking-widest text-white/70">Billing:</span>
        <span className="text-xs font-semibold uppercase tracking-wider text-white/50">{yearly ? 'Yearly (Save 20%)' : 'Monthly'}</span>
        <button
          type="button"
          role="switch"
          aria-checked={yearly}
          aria-label="Toggle yearly billing"
          className={`c3-toggle ${yearly ? 'active' : ''}`}
          onClick={() => setYearly(v => !v)}
        >
          <span className="c3-toggle-knob" />
        </button>
      </div>

      {/* Plans Cards Grid */}
      <div className="c3-grid">
        {PLANS.map((plan) => (
          <div
            key={plan.name}
            className={`c3-card ${plan.pro ? 'c3-card-pro' : ''}`}
            style={{ borderColor: plan.pro ? '#5E0ED7' : 'rgba(255,255,255,0.1)' }}
          >
            <span className="c3-tier-small uppercase tracking-widest font-semibold">{plan.name}</span>
            <h3 className="c3-tier-large font-mono font-bold">
              {yearly ? plan.yearlyPrice : plan.monthlyPrice}
            </h3>
            <p className="c3-desc">{plan.desc}</p>
            
            <ul className="c3-list">
              {plan.features.map((feat, idx) => (
                <li key={idx}>
                  <span className="c3-check">
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#fff"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                  </span>
                  <span className="font-medium">{feat}</span>
                </li>
              ))}
            </ul>

            <button type="button" className="c3-btn uppercase tracking-wider font-bold">
              Choose Plan
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};
