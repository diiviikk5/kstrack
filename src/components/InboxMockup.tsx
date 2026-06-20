import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Archive,
  File,
  Forward,
  Inbox,
  MoreHorizontal,
  Paperclip,
  Reply,
  Search,
  Send,
  Sparkles,
  Star,
  Trash2
} from 'lucide-react';

const EASE = [0.22, 1, 0.36, 1];

interface SignalMock {
  id: string;
  sender: string;
  avatar: string;
  subject: string;
  preview: string;
  time: string;
  unread: boolean;
  status: 'OPEN' | 'TARGET_HIT' | 'STOPLOSS_HIT' | 'EXPIRED';
  label: string;
  labelColor: string;
  summary: string;
  body: string[];
  attachment: string;
  entry: string;
  target: string;
  stop: string;
}

const MOCK_SIGNALS: SignalMock[] = [
  {
    id: '1',
    sender: 'KsTracker AI',
    avatar: 'K',
    subject: 'BTCUSDT Buy Signal',
    preview: 'Local resistance levels breached with high volume, confirming target breakout...',
    time: '9:41 AM',
    unread: true,
    status: 'TARGET_HIT',
    label: 'Majors',
    labelColor: '#00d2ff',
    summary: 'This BTCUSDT signal was triggered post-breakout. High spot volume indicates strong momentum continuation, leading to an immediate target hit. Realized ROI: +8.33%.',
    body: [
      'Broadcasting buy order details:',
      'Entry confirmed at 60,000.00 USDT. Target take-profit configured at 65,000.00 USDT, with a trailing stop-loss set at 58,000.00 USDT.',
      'Local resistance levels at 64,200.00 USDT were breached with high volume, indicating a strong momentum continuation towards target price.',
      'The signal successfully reached its target of 65,000.00 USDT within the active period.',
    ],
    attachment: 'btc-chart-60k.png',
    entry: '60,000.00',
    target: '65,000.00',
    stop: '58,000.00'
  },
  {
    id: '2',
    sender: 'Sophia Chen (Pro)',
    avatar: 'S',
    subject: 'ETHUSDT Sell Signal',
    preview: 'Bearish divergence on 4H RSI. Entry resistance confirmed, target down at 3100...',
    time: '8:12 AM',
    unread: true,
    status: 'OPEN',
    label: 'Majors',
    labelColor: '#00d2ff',
    summary: 'Short trade divergence. Target price remains active. Strong hourly candle resistance. Current trade probability: 74%.',
    body: [
      'Broadcasting sell order details:',
      'Entry confirmed at 3,300.00 USDT. Target profit configured at 3,100.00 USDT, with stop-loss set at 3,420.00 USDT.',
      'RSI bearish divergence on the 4-hour timeframe indicates a localized retracement towards key daily supports.',
      'Current spot levels are hovering near entry bounds. Monitor volume spikes.',
    ],
    attachment: 'eth-divergence-rsi.png',
    entry: '3,300.00',
    target: '3,100.00',
    stop: '3,420.00'
  },
  {
    id: '3',
    sender: 'Velo Research',
    avatar: 'V',
    subject: 'SOLUSDT Buy Signal',
    preview: 'Support level bounce verified. Moving average crossover confirms altcoin season start...',
    time: 'Yesterday',
    unread: false,
    status: 'TARGET_HIT',
    label: 'Alts',
    labelColor: '#A4F4FD',
    summary: 'Spot accumulation bounce. Signal successfully hit target at 145.00 USDT with maximum precision. Realized ROI: +11.54%.',
    body: [
      'Broadcasting buy order details:',
      'Entry confirmed at 130.00 USDT. Target profit configured at 145.00 USDT, with stop-loss set at 122.00 USDT.',
      'EMA crossover confirmed on daily chart. Strong buying pressure at support bounds.',
      'Target price hit resolved within 18 hours of signal broadcast.',
    ],
    attachment: 'sol-daily-crossover.png',
    entry: '130.00',
    target: '145.00',
    stop: '122.00'
  },
  {
    id: '4',
    sender: 'Fintech Capital',
    avatar: 'F',
    subject: 'BNBUSDT Buy Signal',
    preview: 'Launchpool volume surge expected. Signal is entering active buying range...',
    time: 'Yesterday',
    unread: false,
    status: 'OPEN',
    label: 'DeFi',
    labelColor: '#f59e0b',
    summary: 'Catalyst-driven buy signal. Volume index is rising rapidly. Keep targets active.',
    body: [
      'Broadcasting buy order details:',
      'Entry confirmed at 580.00 USDT. Target profit configured at 620.00 USDT, with stop-loss set at 560.00 USDT.',
      'Upcoming Launchpool announcement expected to surge demand and clear local resistance bounds.',
    ],
    attachment: 'bnb-launchpool-volume.png',
    entry: '580.00',
    target: '620.00',
    stop: '560.00'
  },
  {
    id: '5',
    sender: 'Quant Group',
    avatar: 'Q',
    subject: 'DOGEUSDT Sell Signal',
    preview: 'Overbought momentum exhaustion. Stop-loss trailing to secure local profits...',
    time: 'Mon',
    unread: false,
    status: 'STOPLOSS_HIT',
    label: 'Memes',
    labelColor: '#10b981',
    summary: 'Trailing stop triggered to protect capital. Local momentum reversed rapidly. Realized ROI: -2.10%.',
    body: [
      'Broadcasting sell order details:',
      'Entry confirmed at 0.1400 USDT. Target profit configured at 0.1200 USDT, with stop-loss set at 0.1450 USDT.',
      'High volatility spike triggered the stop-loss level before reversal. Position closed.',
    ],
    attachment: 'doge-4h-exhaustion.png',
    entry: '0.1400',
    target: '0.1200',
    stop: '0.1450'
  }
];

interface InboxMockupProps {
  onNavigateToDashboard: () => void;
}

export const InboxMockup: React.FC<InboxMockupProps> = ({ onNavigateToDashboard }) => {
  const [activeId, setActiveId] = useState('1');
  const activeSignal = MOCK_SIGNALS.find(s => s.id === activeId) || MOCK_SIGNALS[0];

  return (
    <section className="max-w-6xl mx-auto px-6 py-16 md:py-24 relative z-10 select-none">
      <motion.div
        className="relative rounded-2xl overflow-hidden border border-white/10 bg-[#0e1014]/90 backdrop-blur-2xl shadow-2xl"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.1, ease: EASE }}
      >
        {/* Title Bar */}
        <div className="relative flex items-center h-10 px-4 border-b border-white/10 bg-[#0e1014]">
          {/* Traffic Lights */}
          <div className="flex gap-1.5">
            {['#ff5f57', '#febc2e', '#28c840'].map(color => (
              <span
                key={color}
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
          {/* Mockup Title */}
          <span className="absolute left-1/2 -translate-x-1/2 text-xs font-semibold text-white/50 uppercase tracking-widest">
            KsTracker Terminal — Mock Workspace
          </span>
        </div>

        {/* Body */}
        <div className="grid grid-cols-12 h-[520px]">
          {/* Sidebar */}
          <div className="hidden md:block md:col-span-3 border-r border-white/10 bg-black/30 p-4 flex flex-col justify-between">
            <div>
              {/* Compose CTA */}
              <button
                type="button"
                onClick={onNavigateToDashboard}
                className="w-full inline-flex items-center justify-center gap-1.5 rounded-lg bg-white text-black text-xs font-bold px-3 py-2.5 transition-all hover:bg-white/90 active:scale-95 cursor-pointer uppercase tracking-wider"
              >
                <Sparkles className="w-3.5 h-3.5 text-accent" />
                <span>Broadcast Signal</span>
              </button>

              {/* Folders Nav */}
              <nav className="mt-4 space-y-0.5">
                {[
                  { icon: Inbox, label: 'All Signals', count: 42, active: true },
                  { icon: Star, label: 'Target Hit', count: 28 },
                  { icon: Send, label: 'Active Open', count: 12 },
                  { icon: File, label: 'Pending Drafts', count: 2 },
                  { icon: Archive, label: 'Archived Vault' },
                  { icon: Trash2, label: 'Deleted Trash' }
                ].map((item, i) => (
                  <a
                    key={i}
                    href="#"
                    onClick={(e) => { e.preventDefault(); onNavigateToDashboard(); }}
                    className={`flex items-center gap-2.5 rounded-md px-2.5 py-2 text-[11px] font-semibold uppercase tracking-wider transition-colors ${
                      item.active ? 'bg-white/10 text-white' : 'text-white/60 hover:bg-white/5'
                    }`}
                  >
                    <item.icon className="w-3.5 h-3.5" />
                    <span className="flex-1">{item.label}</span>
                    {item.count && (
                      <span className="text-[10px] text-white/40 font-mono">{item.count}</span>
                    )}
                  </a>
                ))}
              </nav>

              {/* Labels Section */}
              <div className="mt-6">
                <p className="px-2.5 text-[9px] font-bold uppercase tracking-widest text-white/30">
                  Trading Sectors
                </p>
                <div className="mt-2 space-y-0.5">
                  {[
                    { color: '#00d2ff', label: 'Majors' },
                    { color: '#A4F4FD', label: 'Altcoins' },
                    { color: '#f59e0b', label: 'DeFi Tokens' },
                    { color: '#10b981', label: 'Meme Assets' }
                  ].map((label, idx) => (
                    <a
                      key={idx}
                      href="#"
                      onClick={(e) => { e.preventDefault(); onNavigateToDashboard(); }}
                      className="flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-white/60 hover:bg-white/5 transition-colors"
                    >
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: label.color }} />
                      <span>{label.label}</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Version indicator */}
            <div className="text-[9px] font-bold tracking-widest text-white/20 uppercase">
              Build v1.4.0-spot
            </div>
          </div>

          {/* Message List */}
          <div className="col-span-5 sm:col-span-5 md:col-span-4 border-r border-white/10 bg-[#0e1014] flex flex-col">
            {/* Search Header */}
            <div className="flex items-center gap-2 px-4 h-11 border-b border-white/10 text-white/40 bg-[#0e1014]">
              <Search className="w-3.5 h-3.5" />
              <span className="text-[10px] font-semibold uppercase tracking-widest">Search signal vaults</span>
            </div>

            {/* Scrollable list */}
            <div className="flex-1 overflow-y-auto divide-y divide-white/5">
              {MOCK_SIGNALS.map((signal) => {
                const isActive = signal.id === activeId;
                const statusColor =
                  signal.status === 'TARGET_HIT'
                    ? 'bg-emerald-500'
                    : signal.status === 'STOPLOSS_HIT'
                    ? 'bg-rose-500'
                    : 'bg-blue-500 animate-pulse';

                return (
                  <button
                    key={signal.id}
                    type="button"
                    onClick={() => setActiveId(signal.id)}
                    className={`w-full text-left px-4 py-3 border-b border-white/5 transition-colors flex flex-col gap-1 ${
                      isActive ? 'bg-white/[0.07]' : 'hover:bg-white/[0.03]'
                    }`}
                  >
                    {/* Header: Sender + Time */}
                    <div className="flex items-center justify-between gap-2">
                      <span className={`text-[11px] uppercase tracking-wider truncate flex items-center gap-1.5 ${
                        signal.unread ? 'font-bold text-white' : 'font-medium text-white/70'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${statusColor}`} />
                        {signal.sender}
                      </span>
                      <span className="text-[9px] text-white/40 shrink-0 font-mono">
                        {signal.time}
                      </span>
                    </div>

                    {/* Subject */}
                    <div className="text-xs uppercase tracking-wide truncate font-semibold text-white/95">
                      {signal.subject}
                    </div>

                    {/* Preview */}
                    <p className="text-[10px] text-white/40 truncate leading-relaxed">
                      {signal.preview}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Reader Panel */}
          <div className="col-span-7 sm:col-span-7 md:col-span-5 flex flex-col bg-[#0e1014]/50">
            {/* Toolbar */}
            <div className="flex items-center justify-between px-4 h-11 border-b border-white/10 bg-[#0e1014]">
              {/* Left group */}
              <div className="flex items-center gap-1">
                {[Reply, Forward, Archive, Trash2].map((Icon, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={onNavigateToDashboard}
                    className="w-7 h-7 rounded-md hover:bg-white/5 inline-flex items-center justify-center text-white/60 hover:text-white transition-colors cursor-pointer"
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </button>
                ))}
              </div>
              {/* Right group */}
              <button
                type="button"
                className="w-7 h-7 rounded-md hover:bg-white/5 inline-flex items-center justify-center text-white/60 hover:text-white transition-colors cursor-pointer"
                aria-label="More options"
              >
                <MoreHorizontal className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Message Body */}
            <div className="flex-1 overflow-y-auto p-5">
              {/* Header Subject */}
              <h3 className="text-sm font-semibold uppercase tracking-widest text-white leading-tight">
                {activeSignal.subject}
              </h3>

              {/* Sender Details */}
              <div className="mt-3 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#00d2ff] to-[#0B2551] inline-flex items-center justify-center text-[10px] font-bold text-white uppercase font-mono">
                    {activeSignal.avatar}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-white tracking-wide">{activeSignal.sender}</span>
                    <span className="text-[10px] text-white/40 tracking-wider font-mono">to me · {activeSignal.time}</span>
                  </div>
                </div>

                {/* Sector Tag */}
                <span className="inline-flex items-center gap-1.5 text-[9px] font-semibold uppercase tracking-widest px-2.5 py-0.5 rounded-full border border-white/10 text-white/60">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: activeSignal.labelColor }} />
                  {activeSignal.label}
                </span>
              </div>

              {/* Liquid-Glass Summary Card */}
              <div className="liquid-glass rounded-xl p-4 mt-5 flex flex-col gap-1.5 border border-white/5 bg-white/[0.01]">
                <div className="flex items-center gap-1.5 text-[#A4F4FD]">
                  <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">KsTracker AI Insights</span>
                </div>
                <p className="text-xs text-white/80 leading-[1.6]">
                  {activeSignal.summary}
                </p>
              </div>

              {/* Signal Parameters Grid */}
              <div className="grid grid-cols-3 gap-3 mt-5">
                {[
                  { title: 'Entry', val: activeSignal.entry, color: 'text-zinc-300' },
                  { title: 'Target', val: activeSignal.target, color: 'text-emerald-400 font-semibold' },
                  { title: 'Stop Loss', val: activeSignal.stop, color: 'text-rose-400 font-semibold' }
                ].map((p, idx) => (
                  <div key={idx} className="bg-white/5 border border-white/5 rounded-lg p-2 flex flex-col gap-0.5 text-center font-mono">
                    <span className="text-[9px] font-semibold text-white/40 uppercase tracking-widest">{p.title}</span>
                    <span className={`text-xs ${p.color}`}>{p.val}</span>
                  </div>
                ))}
              </div>

              {/* Paragraphs */}
              <div className="mt-6 space-y-4 text-xs text-white/70 leading-[1.7]">
                {activeSignal.body.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
                <p className="text-[10px] text-white/40 uppercase tracking-wider font-semibold">
                  — KsTracker Automated Engine
                </p>
              </div>

              {/* Attachment */}
              <button
                type="button"
                onClick={onNavigateToDashboard}
                className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-2 text-xs text-white/70 hover:bg-white/[0.06] transition-colors cursor-pointer uppercase font-semibold tracking-wider"
              >
                <Paperclip className="w-3.5 h-3.5 text-accent" />
                <span>{activeSignal.attachment}</span>
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};
