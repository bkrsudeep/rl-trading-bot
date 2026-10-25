import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import MetricCard from './components/MetricCard';
import StockChart from './components/StockChart';
import PredictionPanel from './components/PredictionPanel';
import LstmStateInput from './components/LstmStateInput';
import PortfolioSimulator from './components/PortfolioSimulator';
import PerformanceAnalytics from './components/PerformanceAnalytics';
import ActivityTable from './components/ActivityTable';
import ModelArchitecture from './components/ModelArchitecture';
import BackendSettingsModal from './components/BackendSettingsModal';

import { 
  STOCK_METADATA, 
  SAMPLE_FEATURE_WINDOWS, 
  INITIAL_PORTFOLIO_STATE 
} from './data/demoData';
import { 
  getApiBaseUrl, 
  checkBackendHealth, 
  requestModelPrediction, 
  simulateDemoPrediction, 
  formatINR 
} from './services/api';

import { 
  Wallet, 
  DollarSign, 
  TrendingUp, 
  Cpu, 
  Server, 
  Layers, 
  Activity, 
  BarChart3,
  AlertTriangle,
  Sparkles
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(!getApiBaseUrl());
  
  // Backend health status state
  const [backendStatus, setBackendStatus] = useState({
    connected: false,
    status: 'checking',
    message: 'Checking backend status...',
    isDemo: !getApiBaseUrl()
  });
  const [isCheckingHealth, setIsCheckingHealth] = useState(false);

  // LSTM Window state: 10x2 tensor
  const [featuresWindow, setFeaturesWindow] = useState(
    JSON.parse(JSON.stringify(SAMPLE_FEATURE_WINDOWS.bullish.data))
  );
  const [selectedPreset, setSelectedPreset] = useState('bullish');

  // Prediction state
  const [currentPrediction, setCurrentPrediction] = useState(null);
  const [predictionHistory, setPredictionHistory] = useState([]);
  const [isLoadingPrediction, setIsLoadingPrediction] = useState(false);
  const [apiError, setApiError] = useState(null);

  // Virtual Portfolio state (Paper Trading)
  const [portfolio, setPortfolio] = useState(() => {
    const saved = localStorage.getItem('rl_trading_bot_portfolio');
    if (saved) {
      try { return JSON.parse(saved); } catch (_) {}
    }
    return INITIAL_PORTFOLIO_STATE;
  });

  const currentPrice = STOCK_METADATA.currentPrice;

  // Persist portfolio changes locally
  useEffect(() => {
    localStorage.setItem('rl_trading_bot_portfolio', JSON.stringify(portfolio));
  }, [portfolio]);

  // Check backend health
  const verifyBackend = useCallback(async () => {
    const url = getApiBaseUrl();
    if (!url) {
      setBackendStatus({
        connected: false,
        status: 'unconfigured',
        message: 'No backend URL configured. Operating in Demo Mode.',
        isDemo: true
      });
      setIsDemoMode(true);
      return;
    }

    setIsCheckingHealth(true);
    const result = await checkBackendHealth(url);
    setIsCheckingHealth(false);
    setBackendStatus({
      connected: result.connected,
      status: result.status,
      message: result.message,
      isDemo: !result.connected
    });

    if (!result.connected) {
      // Don't silently switch without informing, keep user aware
    }
  }, []);

  useEffect(() => {
    verifyBackend();
  }, [verifyBackend]);

  // Generate Prediction Handler
  const handleGeneratePrediction = async () => {
    setIsLoadingPrediction(true);
    setApiError(null);

    const presetObj = SAMPLE_FEATURE_WINDOWS[selectedPreset];
    const windowName = presetObj ? presetObj.name : 'Custom 10×2 Window';

    try {
      let result;
      if (isDemoMode) {
        result = await simulateDemoPrediction(featuresWindow);
      } else {
        result = await requestModelPrediction(featuresWindow);
      }

      const predictionRecord = {
        ...result,
        windowPresetName: windowName,
        priceAtPrediction: currentPrice
      };

      setCurrentPrediction(predictionRecord);
      setPredictionHistory(prev => [predictionRecord, ...prev]);
    } catch (err) {
      setApiError(err.message || 'Failed to obtain prediction from model.');
    } finally {
      setIsLoadingPrediction(false);
    }
  };

  // Paper Trade: Buy
  const handleBuyShares = (quantity, price) => {
    const totalCost = quantity * price;
    if (totalCost > portfolio.cash) return;

    setPortfolio(prev => {
      const newCash = prev.cash - totalCost;
      const newHoldings = prev.holdings + quantity;
      const tx = {
        timestamp: new Date().toLocaleTimeString(),
        type: 'BUY',
        shares: quantity,
        price,
        total: totalCost,
        cashAfter: newCash
      };
      return {
        ...prev,
        cash: newCash,
        holdings: newHoldings,
        transactions: [tx, ...prev.transactions]
      };
    });
  };

  // Paper Trade: Sell
  const handleSellShares = (quantity, price) => {
    if (quantity > portfolio.holdings) return;
    const totalRevenue = quantity * price;

    setPortfolio(prev => {
      const newCash = prev.cash + totalRevenue;
      const newHoldings = prev.holdings - quantity;
      const tx = {
        timestamp: new Date().toLocaleTimeString(),
        type: 'SELL',
        shares: quantity,
        price,
        total: totalRevenue,
        cashAfter: newCash
      };
      return {
        ...prev,
        cash: newCash,
        holdings: newHoldings,
        transactions: [tx, ...prev.transactions]
      };
    });
  };

  // Execute trade corresponding to current signal
  const handleExecuteTradeWithSignal = (action) => {
    if (action === 'BUY') {
      const maxShares = Math.floor(portfolio.cash / currentPrice);
      const buyQty = maxShares >= 1 ? 1 : 0;
      if (buyQty > 0) {
        handleBuyShares(buyQty, currentPrice);
      }
    } else if (action === 'SELL') {
      if (portfolio.holdings >= 1) {
        handleSellShares(1, currentPrice);
      }
    }
  };

  // Reset Portfolio
  const handleResetPortfolio = () => {
    if (window.confirm('Reset virtual paper-trading portfolio to starting balance of ₹10,000?')) {
      setPortfolio(INITIAL_PORTFOLIO_STATE);
    }
  };

  // Derived portfolio totals
  const totalPortfolioValue = portfolio.cash + (portfolio.holdings * currentPrice);
  const totalReturn = totalPortfolioValue - portfolio.initialCapital;
  const totalReturnPct = ((totalReturn) / portfolio.initialCapital) * 100;

  return (
    <div className="app-container">
      {/* Navigation Sidebar */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        backendStatus={backendStatus}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Main Content Area */}
      <div className="main-content">
        {/* Top Header */}
        <Header 
          backendStatus={backendStatus}
          isDemoMode={isDemoMode}
          setIsDemoMode={setIsDemoMode}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onCheckHealth={verifyBackend}
          isCheckingHealth={isCheckingHealth}
        />

        {/* Body Container */}
        <main className="content-body">
          {/* Top 4 Metrics Summary Grid */}
          <section className="metrics-grid">
            <MetricCard 
              title="Virtual Portfolio Value"
              value={formatINR(totalPortfolioValue)}
              subtitle={`Initial capital: ₹10,000`}
              icon={Wallet}
              badge={{ label: 'Paper Trading', bg: 'rgba(168, 85, 247, 0.1)', color: '#C084FC', border: 'rgba(168, 85, 247, 0.3)' }}
            />
            <MetricCard 
              title="Available Virtual Cash"
              value={formatINR(portfolio.cash)}
              subtitle={`${portfolio.holdings} shares held in custody`}
              icon={DollarSign}
            />
            <MetricCard 
              title="Simulated Net Return"
              value={`${totalReturn >= 0 ? '+' : ''}${totalReturnPct.toFixed(2)}%`}
              subtitle={`${totalReturn >= 0 ? '+' : ''}${formatINR(totalReturn)} total profit/loss`}
              icon={TrendingUp}
              trend={totalReturn >= 0 ? 'up' : 'down'}
              trendValue={`${totalReturn >= 0 ? '+' : ''}${formatINR(totalReturn)}`}
              valueColor={totalReturn >= 0 ? 'var(--signal-buy)' : 'var(--signal-sell)'}
            />
            <MetricCard 
              title="Current AI Trading Signal"
              value={currentPrediction ? currentPrediction.action : 'STANDBY'}
              subtitle={currentPrediction ? `Action Code: ${currentPrediction.actionCode}` : 'Awaiting 10-step tensor'}
              icon={Cpu}
              valueColor={
                currentPrediction?.action === 'BUY' ? 'var(--signal-buy)' : 
                currentPrediction?.action === 'SELL' ? 'var(--signal-sell)' : 
                currentPrediction?.action === 'HOLD' ? 'var(--signal-hold)' : 'var(--text-muted)'
              }
              badge={{ 
                label: isDemoMode ? 'Demo Mode' : backendStatus.connected ? 'FastAPI Online' : 'Offline', 
                bg: isDemoMode ? 'rgba(56, 189, 248, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                color: isDemoMode ? '#38BDF8' : '#10B981',
                border: isDemoMode ? 'rgba(56, 189, 248, 0.3)' : 'rgba(16, 185, 129, 0.3)'
              }}
            />
          </section>

          {/* Tab Views */}
          {activeTab === 'dashboard' && (
            <>
              {/* Row 1: Stock Chart + AI Prediction Engine */}
              <div className="dashboard-2col">
                <StockChart />
                <PredictionPanel 
                  currentPrediction={currentPrediction}
                  isLoading={isLoadingPrediction}
                  apiError={apiError}
                  onGeneratePrediction={handleGeneratePrediction}
                  isDemoMode={isDemoMode}
                  setIsDemoMode={setIsDemoMode}
                  featuresWindow={featuresWindow}
                  onExecuteTradeWithSignal={handleExecuteTradeWithSignal}
                  portfolioCash={portfolio.cash}
                />
              </div>

              {/* Row 2: LSTM Tensor Window State */}
              <LstmStateInput 
                featuresWindow={featuresWindow}
                setFeaturesWindow={setFeaturesWindow}
                selectedPreset={selectedPreset}
                setSelectedPreset={setSelectedPreset}
              />

              {/* Row 3: Portfolio Simulator & Performance Analytics */}
              <div className="dashboard-equal-2col">
                <PortfolioSimulator 
                  portfolio={portfolio}
                  currentPrice={currentPrice}
                  onBuyShares={handleBuyShares}
                  onSellShares={handleSellShares}
                  onResetPortfolio={handleResetPortfolio}
                />
                <PerformanceAnalytics 
                  portfolio={portfolio}
                  currentPrice={currentPrice}
                />
              </div>

              {/* Row 4: Activity Log */}
              <ActivityTable 
                predictionHistory={predictionHistory}
                onClearHistory={() => setPredictionHistory([])}
              />
            </>
          )}

          {activeTab === 'analytics' && (
            <>
              <StockChart />
              <PerformanceAnalytics 
                portfolio={portfolio}
                currentPrice={currentPrice}
              />
            </>
          )}

          {activeTab === 'prediction' && (
            <div className="dashboard-2col">
              <PredictionPanel 
                currentPrediction={currentPrediction}
                isLoading={isLoadingPrediction}
                apiError={apiError}
                onGeneratePrediction={handleGeneratePrediction}
                isDemoMode={isDemoMode}
                setIsDemoMode={setIsDemoMode}
                featuresWindow={featuresWindow}
                onExecuteTradeWithSignal={handleExecuteTradeWithSignal}
                portfolioCash={portfolio.cash}
              />
              <LstmStateInput 
                featuresWindow={featuresWindow}
                setFeaturesWindow={setFeaturesWindow}
                selectedPreset={selectedPreset}
                setSelectedPreset={setSelectedPreset}
              />
            </div>
          )}

          {activeTab === 'lstm-input' && (
            <LstmStateInput 
              featuresWindow={featuresWindow}
              setFeaturesWindow={setFeaturesWindow}
              selectedPreset={selectedPreset}
              setSelectedPreset={setSelectedPreset}
            />
          )}

          {activeTab === 'portfolio' && (
            <>
              <PortfolioSimulator 
                portfolio={portfolio}
                currentPrice={currentPrice}
                onBuyShares={handleBuyShares}
                onSellShares={handleSellShares}
                onResetPortfolio={handleResetPortfolio}
              />
              <PerformanceAnalytics 
                portfolio={portfolio}
                currentPrice={currentPrice}
              />
            </>
          )}

          {activeTab === 'architecture' && (
            <ModelArchitecture />
          )}

          {activeTab === 'activity' && (
            <ActivityTable 
              predictionHistory={predictionHistory}
              onClearHistory={() => setPredictionHistory([])}
            />
          )}
        </main>
      </div>

      {/* Backend Configuration Modal */}
      <BackendSettingsModal 
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onSettingsUpdated={verifyBackend}
      />
    </div>
  );
}
