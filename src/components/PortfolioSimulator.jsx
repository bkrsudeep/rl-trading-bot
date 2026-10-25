import React, { useState } from 'react';
import { 
  Wallet, 
  ArrowUpRight, 
  ArrowDownLeft, 
  RotateCcw, 
  AlertCircle, 
  CheckCircle2, 
  ShieldCheck,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import { formatINR } from '../services/api';

export default function PortfolioSimulator({ 
  portfolio, 
  currentPrice, 
  onBuyShares, 
  onSellShares, 
  onResetPortfolio 
}) {
  const [tradeShares, setTradeShares] = useState(1);
  const [validationError, setValidationError] = useState('');

  const sharesNum = parseInt(tradeShares, 10) || 0;
  const totalCost = sharesNum * currentPrice;

  // Portfolio derived metrics
  const holdingsValue = portfolio.holdings * currentPrice;
  const totalPortfolioValue = portfolio.cash + holdingsValue;
  const totalProfitLoss = totalPortfolioValue - portfolio.initialCapital;
  const totalProfitLossPercent = (totalProfitLoss / portfolio.initialCapital) * 100;
  const maxBuyableShares = Math.floor(portfolio.cash / currentPrice);

  const handleBuy = () => {
    if (sharesNum <= 0) {
      setValidationError('Please enter a valid share quantity greater than 0.');
      return;
    }
    if (totalCost > portfolio.cash) {
      setValidationError(`Insufficient virtual cash! Required: ${formatINR(totalCost)}, Available: ${formatINR(portfolio.cash)}`);
      return;
    }
    setValidationError('');
    onBuyShares(sharesNum, currentPrice);
  };

  const handleSell = () => {
    if (sharesNum <= 0) {
      setValidationError('Please enter a valid share quantity greater than 0.');
      return;
    }
    if (sharesNum > portfolio.holdings) {
      setValidationError(`Cannot sell more shares than held! Current holdings: ${portfolio.holdings} shares.`);
      return;
    }
    setValidationError('');
    onSellShares(sharesNum, currentPrice);
  };

  return (
    <div className="card">
      <div className="card-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h2 className="card-title">
              <Wallet size={18} style={{ color: 'var(--teal-400)' }} />
              Virtual Portfolio Simulator
            </h2>
            <span className="badge badge-paper">PAPER TRADING ONLY</span>
          </div>
          <p className="card-subtitle">
            Local simulated ledger initialized with ₹10,000 virtual capital. No real capital risk.
          </p>
        </div>

        <button 
          onClick={onResetPortfolio}
          className="btn btn-secondary btn-sm"
          title="Reset portfolio to ₹10,000 starting capital"
        >
          <RotateCcw size={13} />
          Reset Ledger
        </button>
      </div>

      {/* Portfolio Financial Cards Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', 
        gap: '12px',
        marginBottom: '20px' 
      }}>
        <div style={{ padding: '14px', borderRadius: '8px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-subtle)' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px' }}>Total Portfolio Value</div>
          <div className="mono" style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)' }}>
            {formatINR(totalPortfolioValue)}
          </div>
          <div style={{ 
            fontSize: '11px', 
            fontWeight: 600, 
            marginTop: '4px',
            color: totalProfitLoss >= 0 ? 'var(--signal-buy)' : 'var(--signal-sell)',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            {totalProfitLoss >= 0 ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
            {totalProfitLoss >= 0 ? '+' : ''}{formatINR(totalProfitLoss)} ({totalProfitLossPercent >= 0 ? '+' : ''}{totalProfitLossPercent.toFixed(2)}%)
          </div>
        </div>

        <div style={{ padding: '14px', borderRadius: '8px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-subtle)' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px' }}>Available Virtual Cash</div>
          <div className="mono" style={{ fontSize: '20px', fontWeight: 700, color: 'var(--teal-400)' }}>
            {formatINR(portfolio.cash)}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
            Max buyable: <span className="mono" style={{ color: 'var(--text-secondary)' }}>{maxBuyableShares} shares</span>
          </div>
        </div>

        <div style={{ padding: '14px', borderRadius: '8px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-subtle)' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px' }}>Stock Holdings</div>
          <div className="mono" style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)' }}>
            {portfolio.holdings} <span style={{ fontSize: '12px', fontWeight: 400, color: 'var(--text-muted)' }}>shares</span>
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
            Holdings value: <span className="mono" style={{ color: 'var(--text-secondary)' }}>{formatINR(holdingsValue)}</span>
          </div>
        </div>

        <div style={{ padding: '14px', borderRadius: '8px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-subtle)' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px' }}>Current Market Price</div>
          <div className="mono" style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)' }}>
            {formatINR(currentPrice)}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
            Asset: <span style={{ color: 'var(--text-secondary)' }}>RELIANCE.NS (Demo)</span>
          </div>
        </div>
      </div>

      {/* Trade Execution Controls */}
      <div style={{ 
        padding: '16px', 
        borderRadius: '8px', 
        background: 'rgba(255, 255, 255, 0.02)',
        border: '1px solid var(--border-subtle)',
        marginBottom: '20px'
      }}>
        <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '12px' }}>
          Simulate Paper Trade Order
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Shares:</span>
            <input
              type="number"
              min="1"
              value={tradeShares}
              onChange={(e) => {
                setTradeShares(e.target.value);
                setValidationError('');
              }}
              className="input-field mono"
              style={{ width: '80px', padding: '6px 10px' }}
            />
            {/* Quick selectors */}
            <div style={{ display: 'flex', gap: '4px' }}>
              <button onClick={() => setTradeShares(1)} className="btn btn-secondary btn-sm" style={{ padding: '4px 8px' }}>1</button>
              <button onClick={() => setTradeShares(2)} className="btn btn-secondary btn-sm" style={{ padding: '4px 8px' }}>2</button>
              <button 
                onClick={() => setTradeShares(maxBuyableShares > 0 ? maxBuyableShares : 1)} 
                className="btn btn-secondary btn-sm" 
                style={{ padding: '4px 8px' }}
                title="Max shares buyable with current cash"
              >
                Max Buy ({maxBuyableShares})
              </button>
            </div>
          </div>

          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginLeft: 'auto' }}>
            Order Estimated Value: <span className="mono" style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{formatINR(totalCost)}</span>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={handleBuy}
              disabled={sharesNum <= 0 || totalCost > portfolio.cash}
              className="btn btn-buy"
              style={{ minWidth: '130px' }}
            >
              <ArrowUpRight size={16} />
              Paper Buy
            </button>

            <button
              onClick={handleSell}
              disabled={sharesNum <= 0 || sharesNum > portfolio.holdings}
              className="btn btn-sell"
              style={{ minWidth: '130px' }}
            >
              <ArrowDownLeft size={16} />
              Paper Sell
            </button>
          </div>
        </div>

        {validationError && (
          <div className="alert-box alert-danger" style={{ marginTop: '12px' }}>
            <AlertCircle size={15} />
            <span>{validationError}</span>
          </div>
        )}
      </div>

      {/* Transaction History Table */}
      <div>
        <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>
          Simulated Transaction Ledger ({portfolio.transactions.length} Records)
        </div>

        {portfolio.transactions.length === 0 ? (
          <div style={{ 
            padding: '24px', 
            textAlign: 'center', 
            borderRadius: '6px', 
            background: 'rgba(0,0,0,0.15)',
            border: '1px dashed var(--border-subtle)',
            color: 'var(--text-muted)',
            fontSize: '12px'
          }}>
            No paper trades executed in this session. Use the buy/sell buttons or trigger trades based on AI signals.
          </div>
        ) : (
          <div className="data-table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>Type</th>
                  <th>Quantity</th>
                  <th>Exec. Price (₹)</th>
                  <th>Total Value (₹)</th>
                  <th>Cash Remaining (₹)</th>
                  <th>Ledger Status</th>
                </tr>
              </thead>
              <tbody>
                {portfolio.transactions.map((tx, idx) => (
                  <tr key={idx}>
                    <td className="mono" style={{ color: 'var(--text-muted)' }}>{tx.timestamp}</td>
                    <td>
                      <span className={`badge ${tx.type === 'BUY' ? 'badge-live' : 'badge-disconnected'}`}>
                        {tx.type}
                      </span>
                    </td>
                    <td className="mono">{tx.shares} sh</td>
                    <td className="mono">{formatINR(tx.price)}</td>
                    <td className="mono" style={{ fontWeight: 600 }}>{formatINR(tx.total)}</td>
                    <td className="mono" style={{ color: 'var(--teal-400)' }}>{formatINR(tx.cashAfter)}</td>
                    <td>
                      <span className="badge badge-paper" style={{ fontSize: '10px' }}>
                        Simulated Paper Trade
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
