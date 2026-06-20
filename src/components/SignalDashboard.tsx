import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { RefreshCw, Trash2, Clock, Check, X, ShieldAlert } from 'lucide-react';

interface Signal {
  id: string;
  symbol: string;
  direction: 'BUY' | 'SELL';
  entry_price: number;
  stop_loss: number;
  target_price: number;
  entry_time: string;
  expiry_time: string;
  created_at: string;
  status: 'OPEN' | 'TARGET_HIT' | 'STOPLOSS_HIT' | 'EXPIRED';
  realized_roi: number | null;
}

export const SignalDashboard: React.FC = () => {
  const [signals, setSignals] = useState<Signal[]>([]);
  const [prices, setPrices] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [countdown, setCountdown] = useState(15);
  const [now, setNow] = useState(new Date());

  // Fetch signals from our Express backend
  const fetchSignals = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/signals');
      setSignals(response.data);
    } catch (error) {
      console.error('Error fetching signals from API:', error);
    }
  };

  // Fetch live prices from Binance exchange directly
  const fetchBinancePrices = async () => {
    try {
      const response = await axios.get('https://api.binance.com/api/v3/ticker/price');
      const priceMap: Record<string, number> = {};
      if (Array.isArray(response.data)) {
        response.data.forEach((item: { symbol: string; price: string }) => {
          priceMap[item.symbol.toUpperCase()] = parseFloat(item.price);
        });
      }
      setPrices(priceMap);
    } catch (error) {
      console.error('Error fetching prices from Binance:', error);
    }
  };

  const refreshData = async () => {
    setRefreshing(true);
    await Promise.all([fetchSignals(), fetchBinancePrices()]);
    setRefreshing(false);
    setCountdown(15);
  };

  // Initial load
  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await refreshData();
      setLoading(false);
    };
    init();
  }, []);

  // 15 seconds polling interval & countdown
  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          refreshData();
          return 15;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Countdown timer for updating time remaining every second
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Handle signal deletion
  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this signal?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/signals/${id}`);
      setSignals((prev) => prev.filter((s) => s.id !== id));
    } catch (error) {
      console.error('Error deleting signal:', error);
      alert('Failed to delete signal.');
    }
  };

  // Calculate remaining time string
  const getTimeRemaining = (expiryStr: string, entryStr: string) => {
    const expiry = new Date(expiryStr);
    const entry = new Date(entryStr);
    
    if (now < entry) {
      const diff = entry.getTime() - now.getTime();
      return `Pending (${formatTimeDiff(diff)})`;
    }

    const diff = expiry.getTime() - now.getTime();
    if (diff <= 0) return 'Expired';

    return formatTimeDiff(diff);
  };

  const formatTimeDiff = (ms: number) => {
    const totalSecs = Math.floor(ms / 1000);
    const days = Math.floor(totalSecs / 86400);
    const hours = Math.floor((totalSecs % 86400) / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;

    const parts = [];
    if (days > 0) parts.push(`${days}d`);
    if (hours > 0 || days > 0) parts.push(`${hours}h`);
    if (mins > 0 || hours > 0 || days > 0) parts.push(`${mins}m`);
    parts.push(`${secs}s`);

    return parts.join(' ');
  };

  // Compute Live ROI for rendering in table
  const renderROI = (signal: Signal) => {
    if (signal.status !== 'OPEN') {
      const roi = signal.realized_roi ?? 0;
      const isPositive = roi >= 0;
      return (
        <span className={`font-bold ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
          {isPositive ? '+' : ''}
          {roi.toFixed(2)}%
        </span>
      );
    }

    // Active & Open - calculate live ROI
    const livePrice = prices[signal.symbol.toUpperCase()];
    if (!livePrice) return <span className="opacity-40">—</span>;

    const entry = signal.entry_price;
    let roi = 0;
    if (signal.direction === 'BUY') {
      roi = ((livePrice - entry) / entry) * 100;
    } else {
      roi = ((entry - livePrice) / entry) * 100;
    }

    const isPositive = roi >= 0;
    return (
      <span className={`font-bold ${isPositive ? 'text-emerald-400' : 'text-rose-400'} animate-pulse`}>
        {isPositive ? '+' : ''}
        {roi.toFixed(2)}%
      </span>
    );
  };

  const getStatusBadge = (status: Signal['status']) => {
    switch (status) {
      case 'OPEN':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30 flex items-center gap-1.5 w-fit">
            <Clock size={12} className="animate-spin" />
            OPEN
          </span>
        );
      case 'TARGET_HIT':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5 w-fit">
            <Check size={12} />
            TARGET HIT
          </span>
        );
      case 'STOPLOSS_HIT':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-1.5 w-fit">
            <X size={12} />
            STOP LOSS HIT
          </span>
        );
      case 'EXPIRED':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-zinc-500/20 text-zinc-300 border border-zinc-500/30 flex items-center gap-1.5 w-fit">
            <ShieldAlert size={12} />
            EXPIRED
          </span>
        );
    }
  };

  return (
    <div className="w-full bg-white/10 backdrop-blur-xl border border-white/20 p-6 sm:p-8 rounded-3xl shadow-2xl overflow-hidden flex flex-col gap-6">
      {/* Header controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold" style={{ color: 'var(--color-text)' }}>
            Broadcasting Signals
          </h2>
          <p className="text-xs sm:text-sm opacity-60 mt-1">
            Verifying bounds and resolving status against live Binance spot pricing.
          </p>
        </div>

        <div className="flex items-center gap-3 self-end sm:self-center">
          <span className="text-xs opacity-75 font-mono">
            Auto-refresh in <strong className="text-[#7342E2]">{countdown}s</strong>
          </span>
          <button
            onClick={refreshData}
            disabled={refreshing}
            className="p-2.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 active:scale-95 transition-all disabled:opacity-50 cursor-pointer"
            aria-label="Refresh data"
          >
            <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3">
          <RefreshCw className="animate-spin text-[#7342E2]" size={36} />
          <span className="text-sm opacity-60">Synchronizing market data...</span>
        </div>
      ) : signals.length === 0 ? (
        <div className="py-16 text-center border border-dashed border-white/15 rounded-2xl">
          <p className="text-sm opacity-50">No signals found. Broadcast your first trading signal above!</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-white/10 text-xs font-bold uppercase tracking-wider opacity-60">
                <th className="py-4 px-3 sm:px-4">Pair</th>
                <th className="py-4 px-3 sm:px-4">Type</th>
                <th className="py-4 px-3 sm:px-4">Entry</th>
                <th className="py-4 px-3 sm:px-4">Live Price</th>
                <th className="py-4 px-3 sm:px-4">Target / Stop</th>
                <th className="py-4 px-3 sm:px-4">Status</th>
                <th className="py-4 px-3 sm:px-4">ROI</th>
                <th className="py-4 px-3 sm:px-4">Remaining</th>
                <th className="py-4 px-2 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {signals.map((signal) => {
                const livePrice = prices[signal.symbol];
                const directionColor =
                  signal.direction === 'BUY'
                    ? 'bg-emerald-500/10 text-emerald-400'
                    : 'bg-rose-500/10 text-rose-400';

                return (
                  <tr
                    key={signal.id}
                    className="hover:bg-white/5 transition-colors group"
                  >
                    {/* Pair */}
                    <td className="py-4 px-3 sm:px-4 font-bold tracking-wide">
                      {signal.symbol}
                    </td>

                    {/* Direction */}
                    <td className="py-4 px-3 sm:px-4">
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${directionColor}`}>
                        {signal.direction}
                      </span>
                    </td>

                    {/* Entry Price */}
                    <td className="py-4 px-3 sm:px-4 font-mono font-medium">
                      {signal.entry_price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>

                    {/* Live Price */}
                    <td className="py-4 px-3 sm:px-4 font-mono">
                      {signal.status === 'OPEN' ? (
                        livePrice ? (
                          <span className="font-semibold text-white">
                            {livePrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                          </span>
                        ) : (
                          <span className="opacity-40">Loading...</span>
                        )
                      ) : (
                        <span className="opacity-40">Resolved</span>
                      )}
                    </td>

                    {/* Target & Stop Loss */}
                    <td className="py-4 px-3 sm:px-4 font-mono text-xs flex flex-col gap-0.5 justify-center">
                      <span className="text-emerald-400 font-semibold">
                        T: {signal.target_price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </span>
                      <span className="text-rose-400 font-semibold">
                        S: {signal.stop_loss.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-4 px-3 sm:px-4">
                      {getStatusBadge(signal.status)}
                    </td>

                    {/* ROI */}
                    <td className="py-4 px-3 sm:px-4 font-mono">
                      {renderROI(signal)}
                    </td>

                    {/* Remaining time */}
                    <td className="py-4 px-3 sm:px-4 font-medium opacity-85 text-xs">
                      {signal.status === 'OPEN' ? (
                        getTimeRemaining(signal.expiry_time, signal.entry_time)
                      ) : (
                        <span className="opacity-40">Resolved</span>
                      )}
                    </td>

                    {/* Action */}
                    <td className="py-4 px-2 text-right">
                      <button
                        onClick={() => handleDelete(signal.id)}
                        className="p-2 rounded-lg text-rose-400/60 hover:text-rose-400 hover:bg-rose-500/10 active:scale-95 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 cursor-pointer"
                        title="Delete signal"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
