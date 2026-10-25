// API Service for LSTM-DQN Stock Trading Bot
// Handles communication with FastAPI backend or local demonstration simulation

const ACTION_MAP = {
  0: 'HOLD',
  1: 'BUY',
  2: 'SELL'
};

const ACTION_CODE_MAP = {
  'HOLD': 0,
  'BUY': 1,
  'SELL': 2
};

// Retrieve base URL from localStorage or Vite environment variable
export const getApiBaseUrl = () => {
  const customUrl = localStorage.getItem('rl_trading_bot_api_url');
  if (customUrl !== null && customUrl !== '') {
    return customUrl.trim().replace(/\/+$/, '');
  }
  const envUrl = import.meta.env.VITE_API_BASE_URL;
  if (envUrl) {
    return envUrl.trim().replace(/\/+$/, '');
  }
  return '';
};

export const setApiBaseUrl = (url) => {
  if (!url || url.trim() === '') {
    localStorage.removeItem('rl_trading_bot_api_url');
  } else {
    localStorage.setItem('rl_trading_bot_api_url', url.trim().replace(/\/+$/, ''));
  }
};

/**
 * Health check: GET /
 */
export const checkBackendHealth = async (baseUrl = getApiBaseUrl()) => {
  if (!baseUrl) {
    return {
      connected: false,
      status: 'unconfigured',
      message: 'No backend URL configured. Operating in Demo Mode.'
    };
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000); // 6s timeout for Render cold starts

    const response = await fetch(`${baseUrl}/`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      },
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      return {
        connected: false,
        status: 'http_error',
        statusCode: response.status,
        message: `Backend returned HTTP status ${response.status}`
      };
    }

    const data = await response.json().catch(() => ({}));
    return {
      connected: true,
      status: 'connected',
      message: 'FastAPI backend connected successfully',
      data
    };
  } catch (error) {
    const isTimeout = error.name === 'AbortError';
    return {
      connected: false,
      status: 'error',
      message: isTimeout 
        ? 'Connection timed out (Render free instances may take ~45-60s to wake up)'
        : `Connection failed: ${error.message || 'Network error'}`
    };
  }
};

/**
 * Real API Prediction: POST /predict
 * Expects { features_window: number[10][2] }
 */
export const requestModelPrediction = async (featuresWindow, baseUrl = getApiBaseUrl()) => {
  if (!baseUrl) {
    throw new Error('Backend URL is not configured. Please switch to Demo Mode or enter your API URL in settings.');
  }

  // Validate shape (10, 2)
  if (!Array.isArray(featuresWindow) || featuresWindow.length !== 10) {
    throw new Error(`Invalid features_window shape. Expected 10 rows, received ${featuresWindow?.length || 0}.`);
  }

  for (let i = 0; i < 10; i++) {
    const row = featuresWindow[i];
    if (!Array.isArray(row) || row.length !== 2 || typeof row[0] !== 'number' || typeof row[1] !== 'number') {
      throw new Error(`Invalid row at step ${i + 1}. Expected [close_price, volume] numbers.`);
    }
  }

  const payload = {
    features_window: featuresWindow
  };

  const response = await fetch(`${baseUrl}/predict`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    let errorDetail = `HTTP ${response.status} ${response.statusText}`;
    try {
      const errJson = await response.json();
      if (errJson.detail) errorDetail = typeof errJson.detail === 'string' ? errJson.detail : JSON.stringify(errJson.detail);
    } catch (_) {
      // ignore json parse error
    }
    throw new Error(`Backend Error: ${errorDetail}`);
  }

  const data = await response.json();

  // Normalize response according to spec
  let actionCode = data.action_code;
  let actionName = data.action;

  if (actionCode === undefined && actionName !== undefined) {
    actionCode = ACTION_CODE_MAP[actionName.toUpperCase()] ?? 0;
  }
  if (actionName === undefined && actionCode !== undefined) {
    actionName = ACTION_MAP[actionCode] ?? 'HOLD';
  }

  return {
    source: 'model_api',
    status: data.status || 'success',
    actionCode,
    action: actionName.toUpperCase(),
    // Only pass q_values if backend actually returns them
    qValues: data.q_values || data.qValues || null,
    confidence: data.confidence || null,
    timestamp: new Date().toISOString()
  };
};

/**
 * Local Demonstration Prediction (Simulated for testing when backend is offline)
 * Implements deterministic momentum heuristics based on the 10x2 window
 */
export const simulateDemoPrediction = async (featuresWindow) => {
  // Artificial 400ms latency to simulate computation
  await new Promise(resolve => setTimeout(resolve, 450));

  const firstPrice = featuresWindow[0][0];
  const lastPrice = featuresWindow[9][0];
  const priceChangePct = ((lastPrice - firstPrice) / firstPrice) * 100;

  const firstVol = featuresWindow[0][1];
  const lastVol = featuresWindow[9][1];
  const volRatio = lastVol / (firstVol || 1);

  let action = 'HOLD';
  let actionCode = 0;
  let simulatedQValues = {
    HOLD: 0.42,
    BUY: 0.31,
    SELL: 0.27
  };

  if (priceChangePct > 1.2 && volRatio >= 1.05) {
    action = 'BUY';
    actionCode = 1;
    simulatedQValues = {
      HOLD: 0.21,
      BUY: 0.68,
      SELL: 0.11
    };
  } else if (priceChangePct < -1.2) {
    action = 'SELL';
    actionCode = 2;
    simulatedQValues = {
      HOLD: 0.18,
      BUY: 0.14,
      SELL: 0.68
    };
  } else if (priceChangePct > 0.4) {
    action = 'BUY';
    actionCode = 1;
    simulatedQValues = {
      HOLD: 0.35,
      BUY: 0.48,
      SELL: 0.17
    };
  }

  return {
    source: 'demo_simulation',
    isSimulated: true,
    status: 'simulated_success',
    actionCode,
    action,
    qValues: simulatedQValues,
    timestamp: new Date().toISOString(),
    metrics: {
      priceChangePct: Number(priceChangePct.toFixed(2)),
      volumeRatio: Number(volRatio.toFixed(2))
    }
  };
};

/**
 * Currency formatter for Indian Rupee (INR ₹)
 */
export const formatINR = (value, showDecimals = true) => {
  if (value === undefined || value === null || isNaN(value)) return '₹0.00';
  const num = Number(value);
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: showDecimals ? 2 : 0,
    maximumFractionDigits: showDecimals ? 2 : 0
  }).format(num);
};

/**
 * Parse CSV text into a 10x2 features window
 * Accepts formats:
 *   close, volume
 *   date, close, volume
 */
export const parseCSVToFeaturesWindow = (csvText) => {
  if (!csvText || typeof csvText !== 'string') {
    throw new Error('CSV content is empty.');
  }

  const lines = csvText
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(line => line.length > 0);

  if (lines.length === 0) {
    throw new Error('No valid data lines found in CSV.');
  }

  // Parse lines, ignoring header row if it contains text
  const parsedRows = [];
  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const cols = rawLine.split(',').map(c => c.trim().replace(/^["']|["']$/g, ''));

    // Check if header
    if (i === 0 && (isNaN(Number(cols[0])) || (cols[1] && isNaN(Number(cols[1]))))) {
      continue; // Skip header
    }

    if (cols.length >= 2) {
      let closeVal;
      let volVal;

      if (cols.length >= 3 && isNaN(Number(cols[0])) && !isNaN(Number(cols[1])) && !isNaN(Number(cols[2]))) {
        // Date, Close, Volume
        closeVal = parseFloat(cols[1]);
        volVal = parseFloat(cols[2]);
      } else {
        // Close, Volume
        closeVal = parseFloat(cols[0]);
        volVal = parseFloat(cols[1]);
      }

      if (!isNaN(closeVal) && !isNaN(volVal) && closeVal > 0 && volVal >= 0) {
        parsedRows.push([closeVal, volVal]);
      }
    }
  }

  if (parsedRows.length < 10) {
    throw new Error(`CSV contains only ${parsedRows.length} valid rows. The model requires at least 10 rows to create a (10, 2) window.`);
  }

  // Take the most recent 10 rows (last 10 rows of the CSV)
  const window10 = parsedRows.slice(-10);
  return window10;
};
