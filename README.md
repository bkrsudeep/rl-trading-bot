# Intelligent Stock Trading Bot Using Reinforcement Learning (RL) with LSTM State Modeling

> **Final-Year Engineering College Project**  
> An interactive algorithmic trading dashboard demonstrating sequential temporal state modeling via Long Short-Term Memory (LSTM) networks paired with a Deep Q-Network (DQN) reinforcement learning trading agent.

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/bkrsudeep/rl-trading-bot)

---

## 📌 1. Project Overview

This project implements an intelligent algorithmic trading system combining:
1. **Recurrent State Modeling (LSTM):** Encodes sequential price dynamics, velocity, and volume accumulation over a sliding window of **10 consecutive time steps** with **2 features** (Close Price and Trading Volume), generating a dense temporal latent state representation $h_t$.
2. **Deep Q-Network (DQN) Agent:** Approximates action-value functions $Q(s, a)$ over a discrete action space:
   - **HOLD (`0`)**
   - **BUY (`1`)**
   - **SELL (`2`)**
3. **Interactive FinTech Dashboard:** Built with React 18, Vite, and Recharts, offering real-time stock analytics, paper trading simulation (starting with ₹10,000 virtual capital), equity curves, and session audit logs.

```
Market Observations (10, 2) ──> [ LSTM Layers ] ──> Latent State (h_t) ──> [ DQN Agent ] ──> Q(s, a) ──> argmax ──> BUY / SELL / HOLD
```

---

## 🚀 2. Quick Start (Running Locally)

### Prerequisites
- **Node.js**: v18.0.0 or later (v22+ supported)
- **npm**: v9+ or later

### Installation & Launch
1. Open terminal inside the project directory:
   ```powershell
   cd C:\Users\Sudeep\.gemini\antigravity\scratch\rl-trading-bot
   ```
2. Install dependencies (if not already installed):
   ```powershell
   npm install
   ```
3. Start the local Vite development server:
   ```powershell
   npm run dev
   ```
4. Open your browser and navigate to:
   ```
   http://localhost:5173/
   ```

---

## 🔌 3. FastAPI Backend Integration

The dashboard can connect to your deployed FastAPI backend on **Render** or run locally.

### Backend Endpoints Expected:
- **`GET /`**: Health verification endpoint. Returns `{ "status": "ok" }`.
- **`POST /predict`**: Model inference endpoint.
  - **Request Body (JSON):**
    ```json
    {
      "features_window": [
        [2750.00, 3950000],
        [2765.00, 4200000],
        [2772.50, 4500000],
        [2780.00, 4800000],
        [2792.00, 5200000],
        [2805.00, 5700000],
        [2815.00, 5950000],
        [2828.00, 6400000],
        [2838.00, 6900000],
        [2845.50, 7200000]
      ]
    }
    ```
  - **Response (JSON):**
    ```json
    {
      "status": "success",
      "action_code": 1,
      "action": "BUY"
    }
    ```
    *(If raw `q_values` are included in the response, they are rendered in the Q-values card.)*

### How to Configure Your Render URL:
You can configure the backend in **two convenient ways**:

1. **Option A (Instant in UI):**
   - Click the **API Settings** button (gear icon or "API Offline" chip) in the top-right header.
   - Enter your Render backend URL (e.g., `https://your-app.onrender.com`).
   - Click **Test Ping** to test connectivity, then click **Save Configuration**.
   - Your URL is safely saved in local browser storage.

2. **Option B (Environment Variable):**
   - Copy `.env.example` to `.env`:
     ```powershell
     cp .env.example .env
     ```
   - Set:
     ```env
     VITE_API_BASE_URL=https://your-app.onrender.com
     ```
   - Restart the Vite server (`npm run dev`).

> **💡 Render Free Tier Notice:** Free web services on Render spin down after 15 minutes of inactivity. When triggering a prediction after idle time, allow 45–60 seconds for the instance to cold-start. If the backend is offline, you can switch to **Demo Mode** with a single click.

---

## 📊 4. Core System Modules

| Section | Description |
|---|---|
| **Dashboard Overview** | Executive summary showing Portfolio Value, Available Cash, Simulated Return, and Current Signal. |
| **Stock Analytics** | Interactive Recharts area chart and volume bars for Reliance Industries (RELIANCE.NS) with 1W/1M/All time ranges. |
| **AI Prediction Engine** | Displays current action (`BUY`, `SELL`, `HOLD`), action codes (`1`, `2`, `0`), Q-values, and execution buttons. |
| **LSTM State Input** | Interactive (10, 2) tensor editor with 4 pre-configured market sequences and custom CSV upload support. |
| **Portfolio Simulator** | Virtual paper-trading ledger with ₹10,000 starting cash, order validation (cannot overspend or short sell), and transaction logs. |
| **Performance Analytics** | Simulated equity curve versus passive buy-and-hold benchmark, drawdown, and return percentages. |
| **Model Architecture** | Technical viva guide explaining LSTM gate mechanics, Bellman optimality, and Q-learning policy formulation. |
| **Session Activity Log** | Real-time audit log of all model policy evaluations during the browser session. |

---

## 📁 5. Project Directory Structure

```
rl-trading-bot/
├── public/                     # Static assets & favicon
├── src/
│   ├── components/
│   │   ├── ActivityTable.jsx          # Session predictions audit table
│   │   ├── BackendSettingsModal.jsx   # FastAPI URL config & ping testing
│   │   ├── Header.jsx                 # Top bar with status & mode toggles
│   │   ├── LstmStateInput.jsx         # 10x2 tensor window table & CSV parser
│   │   ├── MetricCard.jsx             # Reusable KPI metric card
│   │   ├── ModelArchitecture.jsx      # Academic theoretical viva guide
│   │   ├── PerformanceAnalytics.jsx   # Equity curve & benchmark comparison
│   │   ├── PortfolioSimulator.jsx     # Paper trading ledger (₹10,000 capital)
│   │   ├── PredictionPanel.jsx        # Signal output, Q-values, & error retry
│   │   ├── Sidebar.jsx                # Navigation sidebar & mode indicators
│   │   └── StockChart.jsx             # Interactive Recharts area/volume charts
│   ├── data/
│   │   └── demoData.js                # Synthetic stock series & tensor presets
│   ├── services/
│   │   └── api.js                     # API client, demo simulator, CSV parser, INR formatter
│   ├── App.jsx                        # Main state orchestrator
│   ├── index.css                      # Modern dark navy FinTech stylesheet
│   └── main.jsx                       # React DOM entry point
├── sample_market_data.csv             # Sample CSV for testing tensor upload
├── .env.example                       # Template for API base URL
├── .gitignore                         # Git ignore rules
├── index.html                         # HTML5 template with Inter fonts
├── package.json                       # Dependencies & scripts
├── vite.config.js                     # Vite build configuration
└── README.md                          # Documentation
```

---

## ⚠️ 6. Academic Disclosures & Model Integrity

- **Synthetic Training Data:** The existing LSTM-DQN model was trained and evaluated on synthetic market series. It has **not yet been validated** on real historical tick-level data from the National Stock Exchange of India (NSE).
- **Educational Demonstration:** This software is developed purely for academic engineering curriculum demonstration and does NOT constitute financial or investment advice.
- **Paper Trading:** All orders, cash balances, and equity gains are strictly local virtual simulations.
