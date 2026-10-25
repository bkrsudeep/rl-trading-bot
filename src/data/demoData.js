// Synthetic and Demo Data for LSTM-DQN Stock Trading Bot
// Note: All stock price series and metrics below are purely synthetic / illustrative
// for academic demonstration and testing.

export const STOCK_METADATA = {
  name: 'Reliance Industries Ltd.',
  symbol: 'RELIANCE.NS',
  exchange: 'NSE (National Stock Exchange of India)',
  currency: 'INR (₹)',
  currentPrice: 2845.50,
  dayChange: 24.30,
  dayChangePercent: 0.86,
  volume24h: '4.82M',
  marketCap: '₹19.25 Lakh Cr',
  high52w: 3024.90,
  low52w: 2220.30,
  dataSource: 'DEMO / SYNTHETIC DATASET (Unvalidated Model)'
};

// 30-day synthetic daily price series for stock chart
export const SYNTHETIC_STOCK_SERIES = [
  { date: '2026-09-15', close: 2680.00, volume: 3850000, high: 2695.00, low: 2665.00, ma20: 2650.00 },
  { date: '2026-09-16', close: 2692.50, volume: 4120000, high: 2705.00, low: 2678.00, ma20: 2655.00 },
  { date: '2026-09-17', close: 2675.00, volume: 3600000, high: 2690.00, low: 2660.00, ma20: 2658.00 },
  { date: '2026-09-18', close: 2710.00, volume: 5200000, high: 2725.00, low: 2670.00, ma20: 2662.00 },
  { date: '2026-09-19', close: 2728.50, volume: 4900000, high: 2735.00, low: 2702.00, ma20: 2668.00 },
  { date: '2026-09-22', close: 2715.00, volume: 3450000, high: 2732.00, low: 2705.00, ma20: 2673.00 },
  { date: '2026-09-23', close: 2735.00, volume: 4600000, high: 2744.00, low: 2710.00, ma20: 2680.00 },
  { date: '2026-09-24', close: 2750.50, volume: 5100000, high: 2762.00, low: 2728.00, ma20: 2688.00 },
  { date: '2026-09-25', close: 2742.00, volume: 3950000, high: 2758.00, low: 2730.00, ma20: 2694.00 },
  { date: '2026-09-26', close: 2765.00, volume: 5800000, high: 2774.00, low: 2738.00, ma20: 2702.00 },
  { date: '2026-09-29', close: 2755.00, volume: 4100000, high: 2770.00, low: 2745.00, ma20: 2708.00 },
  { date: '2026-09-30', close: 2780.00, volume: 6200000, high: 2795.00, low: 2750.00, ma20: 2716.00 },
  { date: '2026-10-01', close: 2792.00, volume: 5400000, high: 2805.00, low: 2772.00, ma20: 2725.00 },
  { date: '2026-10-02', close: 2785.00, volume: 3700000, high: 2800.00, low: 2775.00, ma20: 2732.00 },
  { date: '2026-10-03', close: 2810.00, volume: 6800000, high: 2822.00, low: 2780.00, ma20: 2742.00 },
  { date: '2026-10-06', close: 2825.00, volume: 5900000, high: 2835.00, low: 2800.00, ma20: 2752.00 },
  { date: '2026-10-07', close: 2815.00, volume: 4300000, high: 2830.00, low: 2805.00, ma20: 2760.00 },
  { date: '2026-10-08', close: 2838.00, volume: 6100000, high: 2848.00, low: 2810.00, ma20: 2770.00 },
  { date: '2026-10-09', close: 2855.00, volume: 7200000, high: 2865.00, low: 2828.00, ma20: 2782.00 },
  { date: '2026-10-10', close: 2842.00, volume: 4700000, high: 2860.00, low: 2835.00, ma20: 2790.00 },
  { date: '2026-10-13', close: 2830.00, volume: 4200000, high: 2850.00, low: 2820.00, ma20: 2796.00 },
  { date: '2026-10-14', close: 2848.00, volume: 5300000, high: 2858.00, low: 2825.00, ma20: 2804.00 },
  { date: '2026-10-15', close: 2821.20, volume: 4600000, high: 2852.00, low: 2812.00, ma20: 2810.00 },
  { date: '2026-10-16', close: 2845.50, volume: 4820000, high: 2860.00, low: 2818.00, ma20: 2818.00 }
];

// Presets for the 10x2 LSTM Feature Window: [ [close, volume], ... 10 rows ]
export const SAMPLE_FEATURE_WINDOWS = {
  bullish: {
    id: 'bullish',
    name: 'Bullish Momentum (Rising Close + High Volume)',
    description: 'Steady sequence of ascending closing prices accompanied by rising trading volume, typically signaling accumulation.',
    expectedTendency: 'BUY',
    data: [
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
  },
  bearish: {
    id: 'bearish',
    name: 'Bearish Breakdown (Declining Close + Selling Volume Spike)',
    description: 'Successive lower highs and breakdown through support with elevated selling volume, indicating distribution.',
    expectedTendency: 'SELL',
    data: [
      [2860.00, 4100000],
      [2852.00, 4300000],
      [2840.00, 4900000],
      [2825.00, 5400000],
      [2810.00, 5800000],
      [2790.00, 6600000],
      [2775.00, 7100000],
      [2760.00, 7500000],
      [2742.00, 8200000],
      [2720.00, 8900000]
    ]
  },
  sideways: {
    id: 'sideways',
    name: 'Consolidation / Sideways (Low Volatility Range)',
    description: 'Price fluctuating within a tight bound of ±0.5% with declining volume, indicating an indecisive market.',
    expectedTendency: 'HOLD',
    data: [
      [2810.00, 3200000],
      [2812.50, 3100000],
      [2809.00, 2900000],
      [2811.00, 3050000],
      [2808.50, 2800000],
      [2813.00, 2950000],
      [2810.50, 2700000],
      [2809.50, 2850000],
      [2811.50, 2600000],
      [2810.00, 2750000]
    ]
  },
  relianceDemo: {
    id: 'relianceDemo',
    name: 'Recent 10-Day Reliance Sequence (Demo)',
    description: 'Last 10 actual sequence entries from the synthetic Reliance Industries demonstration series.',
    expectedTendency: 'HOLD / BUY',
    data: [
      [2810.00, 6800000],
      [2825.00, 5900000],
      [2815.00, 4300000],
      [2838.00, 6100000],
      [2855.00, 7200000],
      [2842.00, 4700000],
      [2830.00, 4200000],
      [2848.00, 5300000],
      [2821.20, 4600000],
      [2845.50, 4820000]
    ]
  }
};

// Initial starting state for Virtual Portfolio
export const INITIAL_PORTFOLIO_STATE = {
  initialCapital: 10000, // ₹10,000 starting cash
  cash: 10000,
  holdings: 0, // number of shares held
  averageBuyPrice: 0,
  realizedPnl: 0,
  transactions: []
};

// Sample equity curve for performance chart comparison (Illustrative only)
export const SAMPLE_EQUITY_CURVE = [
  { step: 'Day 1', botEquity: 10000, benchmarkEquity: 10000, price: 2680.00 },
  { step: 'Day 3', botEquity: 10000, benchmarkEquity: 9981, price: 2675.00 },
  { step: 'Day 5', botEquity: 10185, benchmarkEquity: 10181, price: 2728.50 },
  { step: 'Day 8', botEquity: 10265, benchmarkEquity: 10263, price: 2750.50 },
  { step: 'Day 10', botEquity: 10320, benchmarkEquity: 10317, price: 2765.00 },
  { step: 'Day 13', botEquity: 10450, benchmarkEquity: 10417, price: 2792.00 },
  { step: 'Day 15', botEquity: 10520, benchmarkEquity: 10485, price: 2810.00 },
  { step: 'Day 18', botEquity: 10630, benchmarkEquity: 10589, price: 2838.00 },
  { step: 'Day 20', botEquity: 10580, benchmarkEquity: 10604, price: 2842.00 },
  { step: 'Day 22', botEquity: 10675, benchmarkEquity: 10626, price: 2848.00 },
  { step: 'Day 24', botEquity: 10740, benchmarkEquity: 10617, price: 2845.50 }
];
