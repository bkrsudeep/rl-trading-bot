import React from 'react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  Legend 
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  Percent, 
  Activity, 
  ShieldAlert, 
  BarChart3,
  Award
} from 'lucide-react';
import { SAMPLE_EQUITY_CURVE } from '../data/demoData';
import { formatINR } from '../services/api';

const CustomEquityTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: 'rgba(15, 23, 42, 0.95)',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        borderRadius: '8px',
        padding: '10px 14px',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.5)',
        fontSize: '12px'
      }}>
        <div style={{ color: 'var(--text-muted)', marginBottom: '4px' }}>{label}</div>
        {payload.map((entry, index) => (
          <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
            <span style={{ color: entry.color }}>{entry.name}:</span>
            <span className="mono" style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
              {formatINR(entry.value)}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function PerformanceAnalytics({ portfolio, currentPrice }) {
  // Compute portfolio actual return
  const currentTotalEquity = portfolio.cash + (portfolio.holdings * currentPrice);
  const totalReturnPct = ((currentTotalEquity - portfolio.initialCapital) / portfolio.initialCapital) * 100;
  
  // Benchmark buy-and-hold calculation from base price ₹2,680 to current ₹2,845.50 (+6.18%)
  const benchmarkReturnPct = 6.18;

  // Derive trade metrics from transactions
  const totalTrades = portfolio.transactions.length;
  const buyTrades = portfolio.transactions.filter(t => t.type === 'BUY').length;
  const sellTrades = portfolio.transactions.filter(t => t.type === 'SELL').length;

  return (
    <div className="card">
      <div className="card-header">
        <div>
          <h2 className="card-title">
            <BarChart3 size={18} style={{ color: 'var(--teal-400)' }} />
            Performance Analytics & Equity Curve
          </h2>
          <p className="card-subtitle">
            Simulated Agent Equity Curve vs. Passive Buy & Hold Benchmark
          </p>
        </div>

        <span className="badge badge-synthetic">
          Illustrative Sample Model
        </span>
      </div>

      {/* Metrics Row */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', 
        gap: '12px',
        marginBottom: '20px'
      }}>
        <div style={{ padding: '12px', borderRadius: '8px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-subtle)' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Simulated Net Return</div>
          <div className="mono" style={{ 
            fontSize: '18px', 
            fontWeight: 700, 
            color: totalReturnPct >= 0 ? 'var(--signal-buy)' : 'var(--signal-sell)',
            marginTop: '2px'
          }}>
            {totalReturnPct >= 0 ? '+' : ''}{totalReturnPct.toFixed(2)}%
          </div>
          <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '2px' }}>
            Current Virtual Session
          </div>
        </div>

        <div style={{ padding: '12px', borderRadius: '8px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-subtle)' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Buy & Hold Benchmark</div>
          <div className="mono" style={{ fontSize: '18px', fontWeight: 700, color: 'var(--teal-400)', marginTop: '2px' }}>
            +{benchmarkReturnPct}%
          </div>
          <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '2px' }}>
            Passive Holding Reference
          </div>
        </div>

        <div style={{ padding: '12px', borderRadius: '8px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-subtle)' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Max Session Drawdown</div>
          <div className="mono" style={{ fontSize: '18px', fontWeight: 700, color: '#F43F5E', marginTop: '2px' }}>
            -1.42%
          </div>
          <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '2px' }}>
            Simulated Peak-to-Trough
          </div>
        </div>

        <div style={{ padding: '12px', borderRadius: '8px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-subtle)' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Executed Paper Trades</div>
          <div className="mono" style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>
            {totalTrades}
          </div>
          <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '2px' }}>
            {buyTrades} Buys • {sellTrades} Sells
          </div>
        </div>
      </div>

      {/* Interactive Equity Curve Chart */}
      <div style={{ width: '100%', height: 260 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={SAMPLE_EQUITY_CURVE} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" vertical={false} />
            <XAxis 
              dataKey="step" 
              stroke="#64748B" 
              fontSize={11} 
              tickLine={false} 
              axisLine={{ stroke: 'rgba(255,255,255,0.08)' }} 
            />
            <YAxis 
              domain={['dataMin - 100', 'dataMax + 100']} 
              stroke="#64748B" 
              fontSize={11} 
              tickLine={false} 
              axisLine={false}
              orientation="right"
              tickFormatter={(val) => `₹${Math.round(val)}`}
            />
            <Tooltip content={<CustomEquityTooltip />} />
            <Legend 
              verticalAlign="top" 
              height={36} 
              formatter={(value) => <span style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>{value}</span>}
            />
            <Line 
              type="monotone" 
              name="LSTM-DQN Agent Equity (₹)" 
              dataKey="botEquity" 
              stroke="#14B8A6" 
              strokeWidth={2.5} 
              dot={{ r: 3, fill: '#14B8A6' }} 
            />
            <Line 
              type="monotone" 
              name="Passive Buy & Hold Benchmark (₹)" 
              dataKey="benchmarkEquity" 
              stroke="#64748B" 
              strokeWidth={1.8} 
              strokeDasharray="4 4" 
              dot={false} 
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Illustrative Disclaimer */}
      <div style={{ 
        marginTop: '16px', 
        padding: '10px 14px', 
        borderRadius: '6px', 
        background: 'rgba(245, 158, 11, 0.08)',
        border: '1px solid rgba(245, 158, 11, 0.2)',
        fontSize: '11px',
        color: '#FCD34D',
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
      }}>
        <ShieldAlert size={16} style={{ flexShrink: 0 }} />
        <span>
          <strong>Academic Disclaimer:</strong> The equity curve and performance figures shown are illustrative metrics generated from simulated backtest steps. They do NOT represent verified past or future investment returns on real stock exchanges.
        </span>
      </div>
    </div>
  );
}
