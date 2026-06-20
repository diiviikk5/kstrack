import React, { useState } from 'react';
import axios from 'axios';
import { Zap, AlertTriangle, CheckCircle } from 'lucide-react';

interface SignalFormProps {
  onSignalCreated: () => void;
}

export const SignalForm: React.FC<SignalFormProps> = ({ onSignalCreated }) => {
  const [symbol, setSymbol] = useState('');
  const [direction, setDirection] = useState<'BUY' | 'SELL'>('BUY');
  const [entryPrice, setEntryPrice] = useState('');
  const [stopLoss, setStopLoss] = useState('');
  const [targetPrice, setTargetPrice] = useState('');
  
  // Set default entry time to now, and expiry to 1 hour from now
  const getLocalDateTimeString = (date: Date) => {
    const tzOffset = date.getTimezoneOffset() * 60000; // offset in milliseconds
    const localISOTime = (new Date(date.getTime() - tzOffset)).toISOString().slice(0, 16);
    return localISOTime;
  };

  const [entryTime, setEntryTime] = useState(getLocalDateTimeString(new Date()));
  const [expiryTime, setExpiryTime] = useState(getLocalDateTimeString(new Date(Date.now() + 3600000)));

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // 1. Basic validation
    if (!symbol || !entryPrice || !stopLoss || !targetPrice || !entryTime || !expiryTime) {
      setError('Please fill in all fields.');
      return;
    }

    const parsedEntry = parseFloat(entryPrice);
    const parsedStop = parseFloat(stopLoss);
    const parsedTarget = parseFloat(targetPrice);

    if (isNaN(parsedEntry) || isNaN(parsedStop) || isNaN(parsedTarget)) {
      setError('Prices must be valid numbers.');
      return;
    }

    if (parsedEntry <= 0 || parsedStop <= 0 || parsedTarget <= 0) {
      setError('Prices must be greater than zero.');
      return;
    }

    // 2. Business Rules Validation
    if (direction === 'BUY') {
      if (parsedStop >= parsedEntry) {
        setError('For BUY signals, Stop Loss must be less than Entry Price.');
        return;
      }
      if (parsedTarget <= parsedEntry) {
        setError('For BUY signals, Target Price must be greater than Entry Price.');
        return;
      }
    } else {
      if (parsedStop <= parsedEntry) {
        setError('For SELL signals, Stop Loss must be greater than Entry Price.');
        return;
      }
      if (parsedTarget >= parsedEntry) {
        setError('For SELL signals, Target Price must be less than Entry Price.');
        return;
      }
    }

    const entryDate = new Date(entryTime);
    const expiryDate = new Date(expiryTime);
    const now = new Date();

    if (expiryDate <= entryDate) {
      setError('Expiry Time must be after Entry Time.');
      return;
    }

    if (entryDate.getTime() < now.getTime() - 60000) {
      setError('Entry Time cannot be in the past.');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/signals', {
        symbol: symbol.toUpperCase().trim(),
        direction,
        entry_price: parsedEntry,
        stop_loss: parsedStop,
        target_price: parsedTarget,
        entry_time: entryDate.toISOString(),
        expiry_time: expiryDate.toISOString(),
      });

      if (response.status === 201) {
        setSuccess(`Signal created successfully for ${symbol.toUpperCase()}!`);
        // Reset form except dates which we advance
        setSymbol('');
        setEntryPrice('');
        setStopLoss('');
        setTargetPrice('');
        setEntryTime(getLocalDateTimeString(new Date()));
        setExpiryTime(getLocalDateTimeString(new Date(Date.now() + 3600000)));
        onSignalCreated();
      }
    } catch (err: any) {
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError('Failed to create signal. Is the backend server running?');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-lg bg-white/10 backdrop-blur-xl border border-white/20 p-6 sm:p-8 rounded-3xl shadow-2xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-[#7342E2]/20 rounded-xl">
          <Zap className="text-[#7342E2]" size={24} />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold" style={{ color: 'var(--color-text)' }}>
          Create Trading Signal
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Symbol & Direction */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider opacity-70">
              Trading Pair
            </label>
            <input
              type="text"
              placeholder="e.g. BTCUSDT"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-[#7342E2] transition-colors placeholder:opacity-50"
              style={{ color: 'var(--color-text)' }}
              disabled={loading}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider opacity-70">
              Direction
            </label>
            <div className="grid grid-cols-2 bg-white/5 border border-white/10 p-1 rounded-xl">
              <button
                type="button"
                className={`py-2 rounded-lg text-xs font-bold transition-all ${
                  direction === 'BUY'
                    ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                    : 'opacity-60 hover:opacity-100'
                }`}
                style={{ color: direction === 'BUY' ? '#ffffff' : 'var(--color-text)' }}
                onClick={() => setDirection('BUY')}
                disabled={loading}
              >
                BUY
              </button>
              <button
                type="button"
                className={`py-2 rounded-lg text-xs font-bold transition-all ${
                  direction === 'SELL'
                    ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20'
                    : 'opacity-60 hover:opacity-100'
                }`}
                style={{ color: direction === 'SELL' ? '#ffffff' : 'var(--color-text)' }}
                onClick={() => setDirection('SELL')}
                disabled={loading}
              >
                SELL
              </button>
            </div>
          </div>
        </div>

        {/* Entry Price */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider opacity-70">
            Entry Price
          </label>
          <input
            type="number"
            step="any"
            placeholder="0.00000"
            value={entryPrice}
            onChange={(e) => setEntryPrice(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-[#7342E2] transition-colors placeholder:opacity-50"
            style={{ color: 'var(--color-text)' }}
            disabled={loading}
          />
        </div>

        {/* Target & Stop Loss */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider opacity-70 text-emerald-400">
              Target Price
            </label>
            <input
              type="number"
              step="any"
              placeholder="0.00000"
              value={targetPrice}
              onChange={(e) => setTargetPrice(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-emerald-500 transition-colors placeholder:opacity-50"
              style={{ color: 'var(--color-text)' }}
              disabled={loading}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider opacity-70 text-rose-400">
              Stop Loss
            </label>
            <input
              type="number"
              step="any"
              placeholder="0.00000"
              value={stopLoss}
              onChange={(e) => setStopLoss(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-rose-500 transition-colors placeholder:opacity-50"
              style={{ color: 'var(--color-text)' }}
              disabled={loading}
            />
          </div>
        </div>

        {/* Entry & Expiry Times */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider opacity-70">
              Entry Time
            </label>
            <input
              type="datetime-local"
              value={entryTime}
              onChange={(e) => setEntryTime(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-[#7342E2] transition-colors"
              style={{ color: 'var(--color-text)' }}
              disabled={loading}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider opacity-70">
              Expiry Time
            </label>
            <input
              type="datetime-local"
              value={expiryTime}
              onChange={(e) => setExpiryTime(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-[#7342E2] transition-colors"
              style={{ color: 'var(--color-text)' }}
              disabled={loading}
            />
          </div>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="flex items-start gap-2.5 p-3.5 bg-rose-500/20 border border-rose-500/30 rounded-xl text-rose-200 text-xs">
            <AlertTriangle size={16} className="shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Success Notification */}
        {success && (
          <div className="flex items-start gap-2.5 p-3.5 bg-emerald-500/20 border border-emerald-500/30 rounded-xl text-emerald-200 text-xs">
            <CheckCircle size={16} className="shrink-0 mt-0.5" />
            <span>{success}</span>
          </div>
        )}

        {/* Submit button */}
        <button
          type="submit"
          className="w-full py-4 rounded-xl font-semibold text-white bg-[#7342E2] shadow-lg shadow-[#7342E2]/20 hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none cursor-pointer mt-2 text-sm"
          disabled={loading}
        >
          {loading ? 'Validating & Storing...' : 'Broadcast Trading Signal'}
        </button>
      </form>
    </div>
  );
};
