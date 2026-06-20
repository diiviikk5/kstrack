import express from 'express';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import { db } from './db.js';
import { startPriceTracker } from './priceTracker.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Helper function to verify if a symbol is valid on Binance
async function isValidBinanceSymbol(symbol) {
  try {
    const response = await axios.get(`https://api.binance.com/api/v3/ticker/price?symbol=${symbol.toUpperCase()}`);
    return !!response.data;
  } catch (error) {
    return false;
  }
}

// POST /api/signals - Create a new signal
app.post('/api/signals', async (req, res) => {
  try {
    const {
      symbol,
      direction,
      entry_price,
      stop_loss,
      target_price,
      entry_time,
      expiry_time
    } = req.body;

    // 1. Basic validation
    if (!symbol || !direction || !entry_price || !stop_loss || !target_price || !entry_time || !expiry_time) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const directionUpper = direction.toUpperCase();
    if (directionUpper !== 'BUY' && directionUpper !== 'SELL') {
      return res.status(400).json({ error: 'Direction must be BUY or SELL' });
    }

    const parsedEntryPrice = parseFloat(entry_price);
    const parsedStopLoss = parseFloat(stop_loss);
    const parsedTargetPrice = parseFloat(target_price);

    if (isNaN(parsedEntryPrice) || isNaN(parsedStopLoss) || isNaN(parsedTargetPrice)) {
      return res.status(400).json({ error: 'Prices must be numbers' });
    }

    if (parsedEntryPrice <= 0 || parsedStopLoss <= 0 || parsedTargetPrice <= 0) {
      return res.status(400).json({ error: 'Prices must be greater than zero' });
    }

    // 2. Validate Business/Trading Rules
    if (directionUpper === 'BUY') {
      if (parsedStopLoss >= parsedEntryPrice) {
        return res.status(400).json({ error: 'For BUY signals, Stop Loss must be less than Entry Price' });
      }
      if (parsedTargetPrice <= parsedEntryPrice) {
        return res.status(400).json({ error: 'For BUY signals, Target Price must be greater than Entry Price' });
      }
    } else if (directionUpper === 'SELL') {
      if (parsedStopLoss <= parsedEntryPrice) {
        return res.status(400).json({ error: 'For SELL signals, Stop Loss must be greater than Entry Price' });
      }
      if (parsedTargetPrice >= parsedEntryPrice) {
        return res.status(400).json({ error: 'For SELL signals, Target Price must be less than Entry Price' });
      }
    }

    const entryDate = new Date(entry_time);
    const expiryDate = new Date(expiry_time);
    const now = new Date();

    if (isNaN(entryDate.getTime()) || isNaN(expiryDate.getTime())) {
      return res.status(400).json({ error: 'Invalid dates provided' });
    }

    if (expiryDate <= entryDate) {
      return res.status(400).json({ error: 'Expiry Time must be after Entry Time' });
    }

    // Optional but recommended: Entry time cannot be in the past
    // We allow a buffer of 60 seconds for clock drift/submission delay
    if (entryDate.getTime() < now.getTime() - 60000) {
      return res.status(400).json({ error: 'Entry Time cannot be in the past' });
    }

    // 3. Binance Symbol Validation
    const symbolUpper = symbol.toUpperCase();
    const isSymbolValid = await isValidBinanceSymbol(symbolUpper);
    if (!isSymbolValid) {
      return res.status(400).json({ error: `Trading pair '${symbolUpper}' is not a valid Binance symbol` });
    }

    // 4. Save Signal
    const id = uuidv4();
    const newSignal = {
      symbol: symbolUpper,
      direction: directionUpper,
      entry_price: parsedEntryPrice,
      stop_loss: parsedStopLoss,
      target_price: parsedTargetPrice,
      entry_time: entryDate.toISOString(),
      expiry_time: expiryDate.toISOString(),
      created_at: now.toISOString(),
      status: 'OPEN',
      realized_roi: null
    };

    const savedSignal = await db.saveSignal(id, newSignal);
    res.status(201).json(savedSignal);
  } catch (error) {
    console.error('Error creating signal:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET /api/signals - List all signals
app.get('/api/signals', async (req, res) => {
  try {
    const signals = await db.getSignals();
    // Sort by created_at descending
    signals.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    res.json(signals);
  } catch (error) {
    console.error('Error listing signals:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET /api/signals/:id - Get single signal
app.get('/api/signals/:id', async (req, res) => {
  try {
    const signal = await db.getSignal(req.params.id);
    if (!signal) {
      return res.status(404).json({ error: 'Signal not found' });
    }
    res.json(signal);
  } catch (error) {
    console.error('Error getting signal:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET /api/signals/:id/status - Fetch current live status (Recommended)
app.get('/api/signals/:id/status', async (req, res) => {
  try {
    const signal = await db.getSignal(req.params.id);
    if (!signal) {
      return res.status(404).json({ error: 'Signal not found' });
    }

    // Get live price from Binance for this pair
    let livePrice = null;
    try {
      const response = await axios.get(`https://api.binance.com/api/v3/ticker/price?symbol=${signal.symbol}`);
      livePrice = parseFloat(response.data.price);
    } catch (e) {
      console.warn(`Could not get live price for status endpoint: ${signal.symbol}`);
    }

    res.json({
      id: signal.id,
      symbol: signal.symbol,
      status: signal.status,
      live_price: livePrice,
      realized_roi: signal.realized_roi
    });
  } catch (error) {
    console.error('Error getting signal status:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// DELETE /api/signals/:id - Delete a signal
app.delete('/api/signals/:id', async (req, res) => {
  try {
    const deleted = await db.deleteSignal(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Signal not found' });
    }
    res.json({ success: true, message: 'Signal deleted successfully' });
  } catch (error) {
    console.error('Error deleting signal:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  // Start background price tracking
  startPriceTracker(15000);
});
