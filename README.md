# KsTracker — Live Trading Signal Tracking Application

KsTracker is a high-performance, full-stack trading signal tracking application with real-time Binance price integration, automated boundary risk resolution, and a beautiful modern user interface.

It adapts a premium landing page experience featuring background video loops, custom typography, micro-interactions, and a matching, fully aligned Operations Control Terminal.

---

## Tech Stack

### Frontend
- **Framework:** React 18 (`react` + `react-dom` `^18.3.1`)
- **Build Tooling:** Vite (`^5.4.11`) + TypeScript (`^5.6.2`)
- **Styling:** Tailwind CSS 3 (`^3.4.17`) + Custom HSL design variables
- **Animations:** Framer Motion (`^11.18.2`)
- **Icons:** Lucide React (`^0.468.0`)
- **Aura Cinematic Theme:** Full-viewport background video, tech grid guide lines, SVG noise filters, and shiny gradient animations.

### Backend
- **Framework:** Node.js Express server (`^4.21.2`)
- **Integration:** Binance REST Ticker API (live spot prices)
- **Database:** Firebase Cloud Firestore (Admin SDK) with a **Local JSON File DB Fallback**
- **UUID:** UUID (`^11.0.3`) for record keys

---

## Features and Enhancements

1. **Local Database Fallback:** The backend checks for Firebase credentials (`firebase-service-account.json` or `.env` configuration). If not found, it automatically falls back to a local JSON database (`server/db.json`). This ensures zero-setup execution out of the box for evaluators while preserving full cloud database capabilities.
2. **Automated Risk Resolution Loop:** The backend runs a polling task every 15 seconds that fetches live tickers from Binance. It checks all active (`OPEN`) signals:
   - **BUY Signals:** Resolves to `TARGET_HIT` if `livePrice >= target` or `STOPLOSS_HIT` if `livePrice <= stopLoss`.
   - **SELL Signals:** Resolves to `TARGET_HIT` if `livePrice <= target` or `STOPLOSS_HIT` if `livePrice >= stopLoss`.
   - **Expiry Checking:** Once the current time passes the `expiry_time`, unresolved signals automatically transition to `EXPIRED`.
   - **Realized ROI:** Calculated at resolution using the boundary trigger price (or the last live price on expiry) and saved permanently.
3. **Live UI Refresh:** The frontend dashboard table auto-refreshes every 15 seconds, matching the background tracker cycle. Open signals compute their current ROI dynamically on the client using live Binance pricing, featuring an active pulse animation.
4. **Validation Engine:** Strict business validations are enforced at request entry:
   - BUY signals require `stop_loss < entry` and `target > entry`.
   - SELL signals require `stop_loss > entry` and `target < entry`.
   - Expiry time must be after entry time.
   - Entry time cannot be in the past (includes clock drift threshold).
   - Validates that the trading pair symbol is a valid asset pair on Binance before storing.
5. **Unified Theme Architecture:** Both the main Landing Page and the Operations Terminal (`DashboardPage.tsx`) use the dark cinematic aesthetic:
   - Localized background video assets (avoiding 403 CloudFront timeouts).
   - Tech grid guide lines and SVG noise filters (`c3-noise`).
   - Liquid-glass container treatments (`.liquid-glass` mask overlays).
   - Clear input text readability on dark backdrops.

---

## Database Schema

Each trading signal record contains:
| Field | Type | Description |
|---|---|---|
| `id` | `UUID` | Unique primary key |
| `symbol` | `VARCHAR` | Uppercase Binance trading pair (e.g. `BTCUSDT`) |
| `direction` | `ENUM` | `BUY` or `SELL` |
| `entry_price` | `DECIMAL` | Target entry level |
| `stop_loss` | `DECIMAL` | Stop loss level |
| `target_price` | `DECIMAL` | Take profit target level |
| `entry_time` | `TIMESTAMP` | ISO timestamp when signal becomes active |
| `expiry_time` | `TIMESTAMP` | ISO timestamp of the signal deadline |
| `created_at` | `TIMESTAMP` | Auto-set creation timestamp |
| `status` | `ENUM` | Current state: `OPEN` \| `TARGET_HIT` \| `STOPLOSS_HIT` \| `EXPIRED` |
| `realized_roi` | `DECIMAL` | Calculated percentage gain/loss (null while `OPEN`) |

---

## Installation and Running

### Prerequisites
Make sure you have [Node.js](https://nodejs.org) (v18 or higher) installed.

### Step 1: Clone and Install Dependencies

```bash
# Install root/frontend dependencies
npm install

# Install server/backend dependencies
cd server
npm install
cd ..
```

### Step 2: Configure Environment (Optional)
If you want to use a real Firebase Cloud instance, create a service account in your Firebase Console and save it as:
`server/firebase-service-account.json`

Alternatively, configure the variables in a `.env` file in the root folder:
```env
PORT=5000
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-client-email
FIREBASE_PRIVATE_KEY=your-private-key
```
*If left unconfigured, the application runs entirely offline/locally on `server/db.json`.*

### Step 3: Run the Application

We recommend running the backend and frontend concurrently. You can start them in separate terminals:

**Terminal 1: Start Backend Server**
```bash
cd server
npm start
```
*App launches on `http://localhost:5000`. Starts background Binance Live Price poll.*

**Terminal 2: Start Frontend Web Client**
```bash
npm run dev
```
*Vite client compiles and hosts on `http://localhost:5173`.*

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/signals` | Validates trading rules, checks Binance symbol, and stores a new signal. |
| `GET` | `/api/signals` | Retrieves all signals sorted by creation date descending. |
| `GET` | `/api/signals/:id` | Gets details for a single signal. |
| `GET` | `/api/signals/:id/status` | Fetches the live resolution status and current live Binance price. |
| `DELETE` | `/api/signals/:id` | Deletes a signal from storage. |
