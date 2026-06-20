import axios from 'axios';
import { db } from './db.js';

let intervalId = null;

async function fetchBinancePrices() {
  try {
    const response = await axios.get('https://api.binance.com/api/v3/ticker/price');
    const priceMap = new Map();
    if (Array.isArray(response.data)) {
      response.data.forEach(item => {
        priceMap.set(item.symbol.toUpperCase(), parseFloat(item.price));
      });
    }
    return priceMap;
  } catch (error) {
    console.error('Error fetching prices from Binance API:', error.message);
    return null;
  }
}

export async function checkSignals() {
  const priceMap = await fetchBinancePrices();
  if (!priceMap || priceMap.size === 0) {
    console.log('Skipping signal status check due to Binance API fetch failure.');
    return;
  }

  try {
    const signals = await db.getSignals();
    const now = new Date();

    for (const signal of signals) {
      // We only evaluate signals that are in the OPEN status
      if (signal.status !== 'OPEN') continue;

      const symbol = signal.symbol.toUpperCase();
      const currentPrice = priceMap.get(symbol);

      if (currentPrice === undefined) {
        console.warn(`Price not found for symbol: ${symbol} in Binance tickers.`);
        continue;
      }

      const entryTime = new Date(signal.entry_time);
      const expiryTime = new Date(signal.expiry_time);

      // 1. Not active yet
      if (now < entryTime) {
        continue;
      }

      // 2. Active period (between entry and expiry)
      if (now >= entryTime && now < expiryTime) {
        let hit = false;
        let finalStatus = 'OPEN';
        let realizedRoi = null;

        const entryPrice = parseFloat(signal.entry_price);
        const stopLoss = parseFloat(signal.stop_loss);
        const targetPrice = parseFloat(signal.target_price);

        if (signal.direction === 'BUY') {
          if (currentPrice >= targetPrice) {
            hit = true;
            finalStatus = 'TARGET_HIT';
            realizedRoi = ((targetPrice - entryPrice) / entryPrice) * 100;
          } else if (currentPrice <= stopLoss) {
            hit = true;
            finalStatus = 'STOPLOSS_HIT';
            realizedRoi = ((stopLoss - entryPrice) / entryPrice) * 100;
          }
        } else if (signal.direction === 'SELL') {
          if (currentPrice <= targetPrice) {
            hit = true;
            finalStatus = 'TARGET_HIT';
            realizedRoi = ((entryPrice - targetPrice) / entryPrice) * 100;
          } else if (currentPrice >= stopLoss) {
            hit = true;
            finalStatus = 'STOPLOSS_HIT';
            realizedRoi = ((entryPrice - stopLoss) / entryPrice) * 100;
          }
        }

        if (hit) {
          console.log(`Signal ${signal.id} (${symbol} ${signal.direction}) hit ${finalStatus} at price ${currentPrice}. ROI: ${realizedRoi.toFixed(2)}%`);
          await db.saveSignal(signal.id, {
            status: finalStatus,
            realized_roi: parseFloat(realizedRoi.toFixed(2))
          });
        }
      }

      // 3. Expired
      if (now >= expiryTime) {
        const entryPrice = parseFloat(signal.entry_price);
        let realizedRoi = 0;

        if (signal.direction === 'BUY') {
          realizedRoi = ((currentPrice - entryPrice) / entryPrice) * 100;
        } else if (signal.direction === 'SELL') {
          realizedRoi = ((entryPrice - currentPrice) / entryPrice) * 100;
        }

        console.log(`Signal ${signal.id} (${symbol}) EXPIRED at price ${currentPrice}. Final ROI: ${realizedRoi.toFixed(2)}%`);
        await db.saveSignal(signal.id, {
          status: 'EXPIRED',
          realized_roi: parseFloat(realizedRoi.toFixed(2))
        });
      }
    }
  } catch (error) {
    console.error('Error running checkSignals loop:', error.message);
  }
}

export function startPriceTracker(intervalMs = 15000) {
  if (intervalId) {
    clearInterval(intervalId);
  }
  
  // Run initial check immediately
  checkSignals();
  
  // Set up interval checking
  intervalId = setInterval(checkSignals, intervalMs);
  console.log(`Binance Live Price Tracker started. Polling every ${intervalMs / 1000}s.`);
}

export function stopPriceTracker() {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
    console.log('Binance Live Price Tracker stopped.');
  }
}
